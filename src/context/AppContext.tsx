'use client';

import React, { createContext, useContext, useReducer, useRef, useCallback } from 'react';
import type { TabId, SubTabId } from '@/types';

interface AppState {
  activeTab: TabId;
  subTab: SubTabId;
  theme: 'default' | 'workout';
}

type AppAction =
  | { type: 'SET_TAB'; tab: TabId }
  | { type: 'SET_SUBTAB'; subTab: SubTabId }
  | { type: 'ENTER_WORKOUT' }
  | { type: 'EXIT_WORKOUT' };

const initialState: AppState = {
  activeTab: 'home',
  subTab: 'body',
  theme: 'default',
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
      return { ...state, activeTab: 'workout', theme: 'workout' };
    case 'EXIT_WORKOUT':
      return { ...state, activeTab: 'home', theme: 'default' };
    default:
      return state;
  }
}

interface AppContextValue extends AppState {
  setTab: (tab: TabId) => void;
  setSubTab: (subTab: SubTabId) => void;
  enterWorkout: () => void;
  exitWorkout: () => void;
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

  return (
    <AppContext.Provider value={{ ...state, setTab, setSubTab, enterWorkout, exitWorkout, scrollBodyRef }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
