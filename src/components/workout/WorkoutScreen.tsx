'use client';

import { useState, useEffect } from 'react';
import { useWorkout } from '@/context/WorkoutContext';
import { useToast } from '@/components/ui/Toast';
import WorkoutTopbar from './WorkoutTopbar';
import RestBar from './RestBar';
import PRPopup from './PRPopup';
import ExerciseCard from './ExerciseCard';

export default function WorkoutScreen() {
  const { exercises, currentIdx, doneSets, totalSets, dispatch } = useWorkout();
  const { showToast } = useToast();
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowHint(false), 3200);
    return () => clearTimeout(t);
  }, []);

  const progressPct = totalSets > 0 ? (doneSets / totalSets) * 100 : 0;
  const currentEx = exercises[currentIdx];

  if (!currentEx) return null;

  const handleToggle = (setIdx: number) => {
    dispatch({ type: 'TOGGLE_SET', exerciseIdx: currentIdx, setIdx });
    const set = currentEx.sets[setIdx];
    if (!set.done) {
      dispatch({ type: 'START_REST' });
    }
  };

  return (
    <div className="flex flex-col min-h-full">
      <WorkoutTopbar />

      <div className="h-[5px] w-full" style={{ background: 'var(--og-s2, var(--s2))' }}>
        <div
          className="h-full"
          style={{
            width: `${progressPct}%`,
            background: 'white',
            transition: 'width 0.6s cubic-bezier(.4,0,.2,1)',
          }}
        />
      </div>

      <RestBar />

      <div
        className="flex items-center justify-between px-4 py-2"
        style={{ background: 'var(--og, var(--orange))' }}
      >
        <button
          onClick={() => currentIdx > 0 && dispatch({ type: 'SET_CURRENT_IDX', idx: currentIdx - 1 })}
          className="text-[14px] px-2"
          style={{ color: currentIdx > 0 ? 'white' : 'rgba(255,255,255,.3)' }}
        >
          ‹
        </button>
        <span className="text-[13px] font-medium text-white">
          {currentIdx + 1}/{exercises.length} {currentEx.name}
        </span>
        <button
          onClick={() => {
            if (currentIdx < exercises.length - 1) {
              if (currentEx.sets.every(s => s.done)) {
                dispatch({ type: 'SET_CURRENT_IDX', idx: currentIdx + 1 });
              } else {
                showToast('⚠️ 모든 세트를 완료 후 넘어가세요!');
              }
            }
          }}
          className="text-[14px] px-2"
          style={{ color: currentIdx < exercises.length - 1 ? 'white' : 'rgba(255,255,255,.3)' }}
        >
          ›
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4" style={{ background: 'var(--og-bg, #1a0900)' }}>
        <PRPopup />

        {showHint && (
          <p
            className="text-center text-[11px] mb-3 animate-pulse"
            style={{ color: 'var(--text3, var(--muted))' }}
          >
            ← 스와이프로 운동 이동 →
          </p>
        )}

        <ExerciseCard
          exercise={currentEx}
          exerciseIdx={currentIdx}
          isLast={currentIdx === exercises.length - 1}
          nextName={exercises[currentIdx + 1]?.name}
          onToggle={handleToggle}
          onUpdateWeight={(si, kg) => dispatch({ type: 'UPDATE_WEIGHT', exerciseIdx: currentIdx, setIdx: si, kg })}
          onUpdateReps={(si, reps) => dispatch({ type: 'UPDATE_REPS', exerciseIdx: currentIdx, setIdx: si, reps })}
          onAdjustAllWeight={(delta) => dispatch({ type: 'ADJUST_ALL_WEIGHT', exerciseIdx: currentIdx, delta })}
          onNext={() => dispatch({ type: 'SET_CURRENT_IDX', idx: currentIdx + 1 })}
          onPrev={() => dispatch({ type: 'SET_CURRENT_IDX', idx: currentIdx - 1 })}
          onComplete={() => dispatch({ type: 'COMPLETE' })}
          totalExercises={exercises.length}
        />
      </div>
    </div>
  );
}
