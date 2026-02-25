'use client';

import React, { createContext, useContext, useReducer, useRef, useCallback, useEffect } from 'react';
import type { TabId, SubTabId } from '@/types';

const COLOR_MODE_KEY = 'fitlog-color-mode';

interface AppState {
  activeTab: TabId;
  subTab: SubTabId;
  theme: 'default' | 'workout';
  colorMode: 'light' | 'dark';
}

type AppAction =
  | { type: 'SET_TAB'; tab: TabId }
  | { type: 'SET_SUBTAB'; subTab: SubTabId }
  | { type: 'ENTER_WORKOUT' }
  | { type: 'EXIT_WORKOUT' }
  | { type: 'SET_COLOR_MODE'; colorMode: 'light' | 'dark' };

function getInitialColorMode(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'dark';
  const stored = window.localStorage.getItem(COLOR_MODE_KEY);
  return stored === 'light' ? 'light' : 'dark';
}

const initialState: AppState = {
  activeTab: 'home',
  subTab: 'body',
  theme: 'default',
  colorMode: 'dark',
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
    case 'SET_COLOR_MODE':
      return { ...state, colorMode: action.colorMode };
    default:
      return state;
  }
}

interface AppContextValue extends AppState {
  setTab: (tab: TabId) => void;
  setSubTab: (subTab: SubTabId) => void;
  enterWorkout: () => void;
  exitWorkout: () => void;
  setColorMode: (mode: 'light' | 'dark') => void;
  scrollBodyRef: React.RefObject<HTMLDivElement | null>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const scrollBodyRef = useRef<HTMLDivElement | null>(null);
  const mounted = useRef(false);

  useEffect(() => {
    const mode = getInitialColorMode();
    document.documentElement.setAttribute('data-color-mode', mode);
    if (mode !== state.colorMode) dispatch({ type: 'SET_COLOR_MODE', colorMode: mode });
    mounted.current = true;
  }, []);

  useEffect(() => {
    if (!mounted.current) return;
    document.documentElement.setAttribute('data-color-mode', state.colorMode);
    window.localStorage.setItem(COLOR_MODE_KEY, state.colorMode);
  }, [state.colorMode]);

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

  const setColorMode = useCallback((mode: 'light' | 'dark') => {
    dispatch({ type: 'SET_COLOR_MODE', colorMode: mode });
  }, []);

  return (
    <AppContext.Provider value={{ ...state, setTab, setSubTab, enterWorkout, exitWorkout, setColorMode, scrollBodyRef }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
