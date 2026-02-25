'use client';

import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type { Exercise, Condition } from '@/types';

export type WorkoutPhase = 'cond' | 'workout' | 'complete';

interface WorkoutState {
  exercises: Exercise[];
  currentIdx: number;
  condition: Condition | null;
  startTime: number | null;
  elapsedSec: number;
  phase: WorkoutPhase;
  restActive: boolean;
  restSeconds: number;
  showPR: boolean;
}

type WorkoutAction =
  | { type: 'INIT'; exercises: Exercise[] }
  | { type: 'SET_CONDITION'; cond: Condition }
  | { type: 'START_WORKOUT' }
  | { type: 'SET_CURRENT_IDX'; idx: number }
  | { type: 'TOGGLE_SET'; exerciseIdx: number; setIdx: number }
  | { type: 'UPDATE_WEIGHT'; exerciseIdx: number; setIdx: number; kg: number }
  | { type: 'UPDATE_REPS'; exerciseIdx: number; setIdx: number; reps: number }
  | { type: 'ADJUST_ALL_WEIGHT'; exerciseIdx: number; delta: number }
  | { type: 'START_REST' }
  | { type: 'TICK_REST' }
  | { type: 'STOP_REST' }
  | { type: 'TICK_ELAPSED' }
  | { type: 'COMPLETE' }
  | { type: 'SHOW_PR'; show: boolean }
  | { type: 'RESET' };

const initialState: WorkoutState = {
  exercises: [],
  currentIdx: 0,
  condition: null,
  startTime: null,
  elapsedSec: 0,
  phase: 'cond',
  restActive: false,
  restSeconds: 90,
  showPR: false,
};

function workoutReducer(state: WorkoutState, action: WorkoutAction): WorkoutState {
  switch (action.type) {
    case 'INIT':
      return { ...initialState, exercises: action.exercises, phase: 'cond' };
    case 'SET_CONDITION':
      return { ...state, condition: action.cond };
    case 'START_WORKOUT':
      return { ...state, phase: 'workout', startTime: Date.now(), elapsedSec: 0 };
    case 'SET_CURRENT_IDX':
      return { ...state, currentIdx: action.idx };
    case 'TOGGLE_SET': {
      const exs = state.exercises.map((ex, ei) => {
        if (ei !== action.exerciseIdx) return ex;
        const sets = ex.sets.map((s, si) => {
          if (si !== action.setIdx) return s;
          return { ...s, done: !s.done };
        });
        return { ...ex, sets };
      });
      const curEx = exs[action.exerciseIdx];
      const curSet = curEx.sets[action.setIdx];
      const isPR = curSet.done && curSet.kg > curEx.prKg;
      return { ...state, exercises: exs, showPR: isPR };
    }
    case 'UPDATE_WEIGHT': {
      const exs = state.exercises.map((ex, ei) => {
        if (ei !== action.exerciseIdx) return ex;
        const sets = ex.sets.map((s, si) =>
          si === action.setIdx ? { ...s, kg: action.kg } : s
        );
        return { ...ex, sets };
      });
      return { ...state, exercises: exs };
    }
    case 'UPDATE_REPS': {
      const exs = state.exercises.map((ex, ei) => {
        if (ei !== action.exerciseIdx) return ex;
        const sets = ex.sets.map((s, si) =>
          si === action.setIdx ? { ...s, reps: action.reps } : s
        );
        return { ...ex, sets };
      });
      return { ...state, exercises: exs };
    }
    case 'ADJUST_ALL_WEIGHT': {
      const exs = state.exercises.map((ex, ei) => {
        if (ei !== action.exerciseIdx) return ex;
        const sets = ex.sets.map(s => ({
          ...s,
          kg: Math.max(0, s.kg + action.delta),
        }));
        return { ...ex, sets };
      });
      return { ...state, exercises: exs };
    }
    case 'START_REST':
      return { ...state, restActive: true, restSeconds: 90 };
    case 'TICK_REST':
      if (state.restSeconds <= 0) return { ...state, restActive: false, restSeconds: 0 };
      return { ...state, restSeconds: state.restSeconds - 1 };
    case 'STOP_REST':
      return { ...state, restActive: false, restSeconds: 0 };
    case 'TICK_ELAPSED':
      return { ...state, elapsedSec: state.elapsedSec + 1 };
    case 'COMPLETE':
      return { ...state, phase: 'complete' };
    case 'SHOW_PR':
      return { ...state, showPR: action.show };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

interface WorkoutContextValue extends WorkoutState {
  dispatch: React.Dispatch<WorkoutAction>;
  totalSets: number;
  doneSets: number;
  totalVolume: number;
}

const WorkoutContext = createContext<WorkoutContextValue | null>(null);

export function WorkoutProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(workoutReducer, initialState);

  const totalSets = state.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
  const doneSets = state.exercises.reduce(
    (acc, ex) => acc + ex.sets.filter(s => s.done).length,
    0
  );
  const totalVolume = state.exercises.reduce(
    (acc, ex) => acc + ex.sets.filter(s => s.done).reduce((a, s) => a + s.kg * s.reps, 0),
    0
  );

  return (
    <WorkoutContext.Provider value={{ ...state, dispatch, totalSets, doneSets, totalVolume }}>
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkout() {
  const ctx = useContext(WorkoutContext);
  if (!ctx) throw new Error('useWorkout must be used within WorkoutProvider');
  return ctx;
}
