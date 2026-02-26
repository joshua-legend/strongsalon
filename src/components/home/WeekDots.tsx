'use client';

import { Check, Circle, CircleDot } from 'lucide-react';

const days = ['월', '화', '수', '목', '금', '토', '일'];

type DotStatus = 'done' | 'today' | 'rest' | 'future';

function getDayStatus(idx: number): DotStatus {
  const today = new Date().getDay();
  const mondayBased = today === 0 ? 6 : today - 1;
  if (idx < mondayBased) {
    return idx === 5 ? 'rest' : 'done';
  }
  if (idx === mondayBased) return 'today';
  return 'future';
}

export default function WeekDots() {
  return (
    <div className="card">
      <p className="card-label mb-3">📅 이번 주 출석</p>
      <div className="flex gap-2">
        {days.map((d, i) => {
          const status = getDayStatus(i);
          return (
            <div key={d} className="flex-1 flex flex-col items-center gap-2">
              <span
                className="font-space text-[9px] font-medium"
                style={{ color: 'var(--muted2)' }}
              >
                {d}
              </span>
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors"
                style={{
                  ...(status === 'done' && {
                    background: 'rgba(34,197,94,.12)',
                    border: '1.5px solid rgba(34,197,94,.35)',
                  }),
                  ...(status === 'today' && {
                    background: 'rgba(255,94,31,.1)',
                    border: '2px solid var(--orange)',
                    boxShadow: '0 0 0 2px rgba(255,94,31,.15)',
                  }),
                  ...(status === 'rest' && {
                    background: 'var(--s2)',
                    border: '1px solid var(--border)',
                  }),
                  ...(status === 'future' && {
                    background: 'var(--s2)',
                    border: '1px solid var(--border)',
                    opacity: 0.5,
                  }),
                }}
              >
                {status === 'done' && (
                  <Check
                    size={18}
                    strokeWidth={2.5}
                    className="shrink-0"
                    style={{ color: 'var(--green)' }}
                  />
                )}
                {status === 'today' && (
                  <CircleDot
                    size={20}
                    strokeWidth={2}
                    className="shrink-0 animate-pulse"
                    style={{ color: 'var(--orange)' }}
                  />
                )}
                {(status === 'rest' || status === 'future') && (
                  <Circle
                    size={16}
                    strokeWidth={1.5}
                    className="shrink-0"
                    style={{ color: 'var(--muted2)' }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
