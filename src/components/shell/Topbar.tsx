'use client';

import { useApp } from '@/context/AppContext';

export default function Topbar() {
  const { theme, colorMode, setColorMode } = useApp();

  if (theme === 'workout') return null;

  return (
    <header
      className="flex items-center justify-between px-5 shrink-0"
      style={{ height: 60, background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}
    >
      <div className="font-bebas text-[24px] tracking-wide leading-none">
        <span style={{ color: 'var(--orange)' }}>Fit</span>
        <span style={{ color: 'var(--muted2)' }}>Log</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setColorMode(colorMode === 'dark' ? 'light' : 'dark')}
          className="w-9 h-9 flex items-center justify-center rounded-full transition-colors"
          style={{ background: 'var(--s2)', color: 'var(--muted2)' }}
          aria-label={colorMode === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
        >
          {colorMode === 'dark' ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>
        <button className="relative w-9 h-9 flex items-center justify-center rounded-full" style={{ background: 'var(--s2)' }}>
          <span className="text-[16px]">🔔</span>
          <span
            className="absolute top-1 right-1 w-2 h-2 rounded-full"
            style={{ background: 'var(--orange)', animation: 'pulse 2s ease infinite' }}
          />
        </button>

        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold"
          style={{
            background: 'linear-gradient(135deg, #f5c518, #ff9a3c)',
            color: '#1a1a1a',
          }}
        >
          김
        </div>
      </div>
    </header>
  );
}
