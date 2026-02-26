'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type {
  WorkoutMode,
  WorkoutCondition,
  TrainerProg,
  FreeExercise,
  SetRecord,
} from '@/types';
import { createInitialTrainerProg } from '@/data/workout';
import { useToast } from '@/components/ui/Toast';
import WorkoutTopbar from './WorkoutTopbar';
import DateBox from './DateBox';
import CondBox from './CondBox';
import ModeBanner from './ModeBanner';
import TrainerArea from './TrainerArea';
import FreeArea from './FreeArea';
import RestTimerCard from './RestTimerCard';
import VolCard from './VolCard';
import PrevRecordCard from './PrevRecordCard';

function nextId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export default function WorkoutPage() {
  const { showToast } = useToast();
  const [workoutDate, setWorkoutDate] = useState(() =>
    new Date().toISOString().split('T')[0]
  );
  const [condition, setCondition] = useState<WorkoutCondition>('좋음');
  const [mode, setMode] = useState<WorkoutMode>('trainer');
  const [trainerProg, setTrainerProg] = useState<TrainerProg>(() =>
    createInitialTrainerProg()
  );
  const [freeExercises, setFreeExercises] = useState<Record<string, FreeExercise>>(
    {}
  );
  const [elapsedSec, setElapsedSec] = useState(0);
  const [prData] = useState<Record<string, number>>({});
  const [prBadge, setPrBadge] = useState<{ name: string; diff: number } | null>(
    null
  );
  const prTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const allDoneShownRef = useRef(false);

  const selectedFavNames = new Set(
    Object.values(freeExercises).map((e) => e.name)
  );

  useEffect(() => {
    const t = setInterval(() => setElapsedSec((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const trainerDoneCount = trainerProg.exercises.filter(
    (ex) => ex.sets.filter((s) => s.weight > 0 && s.reps > 0).length >= ex.tSets
  ).length;
  const trainerTotalCount = trainerProg.exercises.length;
  useEffect(() => {
    if (
      mode === 'trainer' &&
      trainerTotalCount > 0 &&
      trainerDoneCount === trainerTotalCount &&
      !allDoneShownRef.current
    ) {
      allDoneShownRef.current = true;
      const t = setTimeout(() => {
        showToast('🎉 오늘 프로그램 완료! 저장하세요');
      }, 400);
      return () => clearTimeout(t);
    }
    if (trainerDoneCount < trainerTotalCount) allDoneShownRef.current = false;
  }, [mode, trainerDoneCount, trainerTotalCount, showToast]);

  const showPR = useCallback(
    (name: string, diff: number) => {
      if (prTimeoutRef.current) clearTimeout(prTimeoutRef.current);
      setPrBadge({ name, diff });
      prTimeoutRef.current = setTimeout(() => {
        setPrBadge(null);
        prTimeoutRef.current = null;
      }, 6000);
      showToast(`🏅 ${name} 신기록 +${diff.toFixed(1)}kg!`);
    },
    [showToast]
  );

  const clearAll = useCallback(() => {
    if (!confirm('모든 기록을 초기화할까요?')) return;
    setTrainerProg(createInitialTrainerProg());
    setFreeExercises({});
    setPrBadge(null);
    setElapsedSec(0);
    showToast('🗑 초기화 완료');
  }, [showToast]);

  const saveAll = useCallback(() => {
    showToast('💾 운동기록 저장 완료! 챌린지 +1회 🥕');
  }, [showToast]);

  const switchMode = useCallback(() => {
    if (mode === 'trainer') {
      if (
        !confirm(
          '트레이너 프로그램을 벗어나 자유 운동 모드로 전환할까요?\n이미 입력한 세트 기록은 유지됩니다.'
        )
      )
        return;
      setMode('free');
      showToast('🏃 자유 운동 모드로 전환');
    } else {
      if (!confirm('트레이너 프로그램 모드로 돌아갈까요?')) return;
      setMode('trainer');
      showToast('🤖 트레이너 프로그램 모드');
    }
  }, [mode, showToast]);

  const addTSet = useCallback((exId: string) => {
    setTrainerProg((prev) => {
      const next = { ...prev, exercises: [...prev.exercises] };
      const ex = next.exercises.find((e) => e.id === exId);
      if (!ex) return prev;
      const newSet: SetRecord = {
        id: nextId(exId),
        weight: 0,
        reps: 0,
      };
      ex.sets = [...ex.sets, newSet];
      return next;
    });
  }, []);

  const copyLastTSet = useCallback((exId: string) => {
    setTrainerProg((prev) => {
      const next = { ...prev, exercises: [...prev.exercises] };
      const ex = next.exercises.find((e) => e.id === exId);
      if (!ex || !ex.sets.length) return prev;
      const last = ex.sets[ex.sets.length - 1];
      ex.sets = [
        ...ex.sets,
        { id: nextId(exId), weight: last.weight, reps: last.reps },
      ];
      return next;
    });
  }, []);

  const delTSet = useCallback((exId: string, setId: string) => {
    setTrainerProg((prev) => {
      const next = { ...prev, exercises: [...prev.exercises] };
      const ex = next.exercises.find((e) => e.id === exId);
      if (!ex) return prev;
      ex.sets = ex.sets.filter((s) => s.id !== setId);
      return next;
    });
  }, []);

  const onTSetChange = useCallback(
    (exId: string, setId: string, weight: number, reps: number) => {
      setTrainerProg((prev) => {
        const next = { ...prev, exercises: [...prev.exercises] };
        const ex = next.exercises.find((e) => e.id === exId);
        if (!ex) return prev;
        const s = ex.sets.find((x) => x.id === setId);
        if (s) {
          s.weight = weight;
          s.reps = reps;
        }
        return next;
      });
      const ex = trainerProg.exercises.find((e) => e.id === exId);
      if (ex?.prevPR != null && weight > ex.prevPR) {
        showPR(ex.name, weight - ex.prevPR);
      }
    },
    [trainerProg.exercises, showPR]
  );

  const toggleFav = useCallback((icon: string, name: string) => {
    setFreeExercises((prev) => {
      const has = Object.values(prev).some((e) => e.name === name);
      if (has) {
        const next = { ...prev };
        const id = Object.keys(next).find((k) => next[k].name === name);
        if (id) delete next[id];
        return next;
      }
      const id = nextId('fx');
      const newSet: SetRecord = { id: nextId('fs'), weight: 0, reps: 0 };
      return { ...prev, [id]: { icon, name, sets: [newSet] } };
    });
  }, []);

  const addCustomEx = useCallback((name: string) => {
    setFreeExercises((prev) => {
      if (Object.values(prev).some((e) => e.name === name)) return prev;
      const id = nextId('fx');
      const newSet: SetRecord = { id: nextId('fs'), weight: 0, reps: 0 };
      return { ...prev, [id]: { icon: '💪', name, sets: [newSet] } };
    });
  }, []);

  const addFreeSet = useCallback((exId: string, weight = 0, reps = 0) => {
    setFreeExercises((prev) => {
      const ex = prev[exId];
      if (!ex) return prev;
      const newSet: SetRecord = {
        id: nextId('fs'),
        weight,
        reps,
      };
      return {
        ...prev,
        [exId]: { ...ex, sets: [...ex.sets, newSet] },
      };
    });
  }, []);

  const copyLastFreeSet = useCallback((exId: string) => {
    setFreeExercises((prev) => {
      const ex = prev[exId];
      if (!ex || !ex.sets.length) return prev;
      const last = ex.sets[ex.sets.length - 1];
      return {
        ...prev,
        [exId]: {
          ...ex,
          sets: [
            ...ex.sets,
            { id: nextId('fs'), weight: last.weight, reps: last.reps },
          ],
        },
      };
    });
  }, []);

  const delFreeSet = useCallback((exId: string, setId: string) => {
    setFreeExercises((prev) => {
      const ex = prev[exId];
      if (!ex) return prev;
      return {
        ...prev,
        [exId]: { ...ex, sets: ex.sets.filter((s) => s.id !== setId) },
      };
    });
  }, []);

  const onFSetChange = useCallback(
    (exId: string, setId: string, weight: number, reps: number) => {
      setFreeExercises((prev) => {
        const ex = prev[exId];
        if (!ex) return prev;
        const sets = ex.sets.map((s) =>
          s.id === setId ? { ...s, weight, reps } : s
        );
        return { ...prev, [exId]: { ...ex, sets } };
      });
      const ex = freeExercises[exId];
      const pr = ex ? prData[ex.name] : undefined;
      if (pr != null && weight > pr) showPR(ex!.name, weight - pr);
    },
    [prData, freeExercises, showPR]
  );

  const removeFreeEx = useCallback((exId: string) => {
    setFreeExercises((prev) => {
      const next = { ...prev };
      delete next[exId];
      return next;
    });
  }, []);

  const copyPrevRecord = useCallback(() => {
    if (mode === 'free') {
      setFreeExercises((p) => {
        const benchId = Object.keys(p).find((k) => p[k].name === '벤치프레스');
        const id = benchId ?? nextId('fx');
        const ex = p[id] ?? { icon: '🏋️', name: '벤치프레스', sets: [] };
        const sets: SetRecord[] = [
          { id: nextId('fs'), weight: 60, reps: 12 },
          { id: nextId('fs'), weight: 80, reps: 8 },
          { id: nextId('fs'), weight: 95, reps: 5 },
          { id: nextId('fs'), weight: 100, reps: 3 },
        ];
        return { ...p, [id]: { ...ex, sets } };
      });
    }
    showToast('📋 이전 기록 복사 완료!');
  }, [mode, showToast]);

  return (
    <div
      className="min-h-full flex flex-col"
      data-theme="workout"
      style={{ background: 'var(--og-bg, #1a0900)' }}
    >
      <WorkoutTopbar elapsedSec={elapsedSec} onClear={clearAll} onSave={saveAll} />
      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-1 gap-4 max-w-4xl mx-auto lg:grid-cols-[1fr_280px]">
          <div className="flex flex-col gap-3.5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
              <DateBox value={workoutDate} onChange={setWorkoutDate} />
              <CondBox value={condition} onChange={setCondition} />
            </div>
            <ModeBanner mode={mode} onSwitch={switchMode} />
            {mode === 'trainer' && (
              <TrainerArea
                trainerProg={trainerProg}
                onAddSet={addTSet}
                onCopyLastSet={copyLastTSet}
                onDeleteSet={delTSet}
                onSetChange={onTSetChange}
                onCheckPR={showPR}
              />
            )}
            {mode === 'free' && (
              <FreeArea
                freeExercises={freeExercises}
                prData={prData}
                selectedFavNames={selectedFavNames}
                onToggleFav={toggleFav}
                onAddCustom={addCustomEx}
                onAddSet={(id) => addFreeSet(id)}
                onCopyLastSet={copyLastFreeSet}
                onDeleteSet={delFreeSet}
                onSetChange={onFSetChange}
                onRemove={removeFreeEx}
                onCheckPR={showPR}
              />
            )}
          </div>
          <div className="flex flex-col gap-3.5 lg:sticky lg:top-20">
            <RestTimerCard />
            <VolCard
              mode={mode}
              trainerProg={trainerProg}
              freeExercises={freeExercises}
              prBadge={prBadge}
            />
            <PrevRecordCard onCopyPrev={copyPrevRecord} />
          </div>
        </div>
      </div>
    </div>
  );
}
