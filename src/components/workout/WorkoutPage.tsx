'use client';

import { useEffect } from 'react';
import { useWorkout } from '@/context/WorkoutContext';
import { todayExercises } from '@/data/exercises';
import CondScreen from './CondScreen';
import WorkoutScreen from './WorkoutScreen';
import CompleteOverlay from './CompleteOverlay';

export default function WorkoutPage() {
  const { phase, dispatch } = useWorkout();

  useEffect(() => {
    const exs = todayExercises.map(e => ({ ...e, sets: e.sets.map(s => ({ ...s })) }));
    dispatch({ type: 'INIT', exercises: exs });
  }, [dispatch]);

  return (
    <div
      className="min-h-full"
      style={{ background: 'var(--og-bg, #1a0900)' }}
    >
      {phase === 'cond' && <CondScreen />}
      {phase === 'workout' && <WorkoutScreen />}
      {phase === 'complete' && <CompleteOverlay />}
    </div>
  );
}
