'use client';

import React, { createContext, useContext, useReducer, useRef, useCallback } from 'react';
import type { TabId, SubTabId } from '@/types';
import type { SplitId } from '@/data/workoutPresets';

export type WorkoutScreen = 'mode' | 'split' | 'page';

interface AppState {
  activeTab: TabId;
  subTab: SubTabId;
  theme: 'default' | 'workout';
  /** 운동탭 내부 화면: 모드선택 | 분할선택 | 운동페이지 */
  workoutScreen: WorkoutScreen;
  /** 추천 모드 시 선택한 분할 */
  selectedSplit: SplitId | null;
  /** 홈탭 진입 시 스트렝스 설정 시트 자동 오픈 */
  openStrengthSetup: boolean;
}

type AppAction =
  | { type: 'SET_TAB'; tab: TabId }
  | { type: 'SET_SUBTAB'; subTab: SubTabId }
  | { type: 'ENTER_WORKOUT' }
  | { type: 'EXIT_WORKOUT' }
  | { type: 'SET_WORKOUT_SCREEN'; screen: WorkoutScreen }
  | { type: 'SET_SELECTED_SPLIT'; split: SplitId | null }
  | { type: 'SET_OPEN_STRENGTH_SETUP'; open: boolean };

const initialState: AppState = {
  activeTab: 'home',
  subTab: 'body',
  theme: 'default',
  workoutScreen: 'mode',
  selectedSplit: null,
  openStrengthSetup: false,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_TAB':
      if (action.tab === 'workout') {
        return { ...state, activeTab: 'workout', theme: 'workout' };
      }
      return { ...state, activeTab: action.tab, theme: 'default' };
    case 'SET_SUBTAB':
      return { ...state, subTab: action.subTab };
    case 'ENTER_WORKOUT':
      return { ...state, activeTab: 'workout', theme: 'workout', workoutScreen: 'page', selectedSplit: null };
    case 'EXIT_WORKOUT':
      return { ...state, activeTab: 'home', theme: 'default', workoutScreen: 'mode', selectedSplit: null };
    case 'SET_WORKOUT_SCREEN':
      return { ...state, workoutScreen: action.screen };
    case 'SET_SELECTED_SPLIT':
      return { ...state, selectedSplit: action.split };
    case 'SET_OPEN_STRENGTH_SETUP':
      return { ...state, openStrengthSetup: action.open };
    default:
      return state;
  }
}

interface AppContextValue extends AppState {
  setTab: (tab: TabId) => void;
  setSubTab: (subTab: SubTabId) => void;
  enterWorkout: () => void;
  exitWorkout: () => void;
  setWorkoutScreen: (screen: WorkoutScreen) => void;
  setSelectedSplit: (split: SplitId | null) => void;
  setOpenStrengthSetup: (open: boolean) => void;
  scrollBodyRef: React.RefObject<HTMLDivElement | null>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const scrollBodyRef = useRef<HTMLDivElement | null>(null);

  const setTab = useCallback((tab: TabId) => {
    dispatch({ type: 'SET_TAB', tab });
    if (scrollBodyRef.current) scrollBodyRef.current.scrollTop = 0;
  }, []);

  const setSubTab = useCallback((subTab: SubTabId) => {
    dispatch({ type: 'SET_SUBTAB', subTab });
  }, []);

  const enterWorkout = useCallback(() => {
    dispatch({ type: 'ENTER_WORKOUT' });
  }, []);

  const exitWorkout = useCallback(() => {
    dispatch({ type: 'EXIT_WORKOUT' });
  }, []);

  const setWorkoutScreen = useCallback((screen: WorkoutScreen) => {
    dispatch({ type: 'SET_WORKOUT_SCREEN', screen });
  }, []);

  const setSelectedSplit = useCallback((split: SplitId | null) => {
    dispatch({ type: 'SET_SELECTED_SPLIT', split });
  }, []);

  const setOpenStrengthSetup = useCallback((open: boolean) => {
    dispatch({ type: 'SET_OPEN_STRENGTH_SETUP', open });
  }, []);

  return (
    <AppContext.Provider
      value={{
        ...state,
        setTab,
        setSubTab,
        enterWorkout,
        exitWorkout,
        setWorkoutScreen,
        setSelectedSplit,
        setOpenStrengthSetup,
        scrollBodyRef,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
