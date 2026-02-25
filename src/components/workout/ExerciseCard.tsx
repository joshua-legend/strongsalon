'use client';

import { useRef, useState } from 'react';
import type { Exercise } from '@/types';
import SVGIllust from '@/components/ui/SVGIllust';
import Badge from '@/components/ui/Badge';
import SetTable from './SetTable';
import { useToast } from '@/components/ui/Toast';

interface ExerciseCardProps {
  exercise: Exercise;
  exerciseIdx: number;
  isLast: boolean;
  nextName?: string;
  onToggle: (setIdx: number) => void;
  onUpdateWeight: (setIdx: number, kg: number) => void;
  onUpdateReps: (setIdx: number, reps: number) => void;
  onAdjustAllWeight: (delta: number) => void;
  onNext: () => void;
  onPrev: () => void;
  onComplete: () => void;
  totalExercises: number;
}

export default function ExerciseCard({
  exercise,
  exerciseIdx,
  isLast,
  nextName,
  onToggle,
  onUpdateWeight,
  onUpdateReps,
  onAdjustAllWeight,
  onNext,
  onPrev,
  onComplete,
  totalExercises,
}: ExerciseCardProps) {
  const { showToast } = useToast();
  const touchRef = useRef<{ startX: number; startY: number } | null>(null);
  const [swipeX, setSwipeX] = useState(0);

  const allDone = exercise.sets.every(s => s.done);

  const handleNext = () => {
    if (!allDone) {
      showToast('⚠️ 모든 세트를 완료 후 넘어가세요!');
      return;
    }
    if (isLast) onComplete();
    else onNext();
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchRef.current = { startX: e.touches[0].clientX, startY: e.touches[0].clientY };
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchRef.current) return;
    const dx = e.touches[0].clientX - touchRef.current.startX;
    const dy = e.touches[0].clientY - touchRef.current.startY;
    if (Math.abs(dx) > Math.abs(dy)) {
      setSwipeX(dx * 0.3);
    }
  };

  const onTouchEnd = () => {
    if (swipeX > 60 && exerciseIdx > 0) onPrev();
    else if (swipeX < -60 && !isLast && allDone) onNext();
    setSwipeX(0);
    touchRef.current = null;
  };

  return (
    <div
      className="transition-transform"
      style={{ transform: `translateX(${swipeX}px)`, transition: swipeX === 0 ? 'transform 0.38s cubic-bezier(.4,0,.2,1)' : 'none' }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="flex items-center gap-4 mb-4">
        <SVGIllust type={exercise.svgIllust} size={80} />
        <div>
          <p className="font-bebas text-[34px] leading-none" style={{ color: 'var(--og, var(--orange))' }}>
            {exercise.name}
          </p>
          <Badge variant="orange" className="mt-1">{exercise.cat}</Badge>
        </div>
      </div>

      <div
        className="rounded-xl p-3 mb-4 flex items-center justify-between"
        style={{ background: 'var(--og-s2, var(--s2))', border: '1px solid var(--border)' }}
      >
        <div className="text-center">
          <p className="font-space text-[8px] mb-1" style={{ color: 'var(--text3, var(--muted))' }}>지난주</p>
          <p className="font-bebas text-[18px] leading-none" style={{ color: 'var(--muted2)' }}>
            {exercise.prevKg}<span className="text-[10px]">kg</span> × {exercise.prevReps}
          </p>
        </div>
        <span className="text-[18px]" style={{ color: 'var(--og, var(--orange))' }}>→</span>
        <div className="text-center">
          <p className="font-space text-[8px] mb-1" style={{ color: 'var(--text3, var(--muted))' }}>오늘 목표</p>
          <p className="font-bebas text-[18px] leading-none" style={{ color: 'var(--og, var(--orange))' }}>
            {exercise.intensity}
          </p>
        </div>
      </div>

      <SetTable
        sets={exercise.sets}
        exerciseIdx={exerciseIdx}
        exerciseName={exercise.name}
        onToggle={onToggle}
        onUpdateWeight={onUpdateWeight}
        onUpdateReps={onUpdateReps}
      />

      {exercise.sets[0]?.kg > 0 && (
        <div className="flex justify-center gap-2 mt-3">
          {[-5, -2.5, 2.5, 5].map(d => (
            <button
              key={d}
              onClick={() => onAdjustAllWeight(d)}
              className="px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all active:scale-95"
              style={{
                background: 'var(--og-s2, var(--s2))',
                border: '1px solid var(--border)',
                color: d > 0 ? 'var(--green)' : 'var(--red)',
              }}
            >
              {d > 0 ? '+' : ''}{d}
            </button>
          ))}
        </div>
      )}

      <button
        onClick={handleNext}
        className="w-full mt-4 py-3.5 rounded-xl text-[14px] font-bold transition-all duration-200"
        style={{
          background: isLast ? 'var(--green)' : 'var(--og, var(--orange))',
          color: 'white',
          opacity: allDone ? 1 : 0.5,
        }}
      >
        {isLast
          ? '🎉 운동 완료!'
          : `다음 운동 · ${nextName} →`}
      </button>
    </div>
  );
}
