'use client';

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
            <div key={d} className="flex-1 flex flex-col items-center gap-1.5">
              <span className="font-space text-[8px]" style={{ color: 'var(--muted)' }}>{d}</span>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-medium"
                style={{
                  ...(status === 'done' && {
                    background: 'rgba(34,197,94,.15)',
                    color: 'var(--green)',
                    border: '1px solid rgba(34,197,94,.3)',
                  }),
                  ...(status === 'today' && {
                    background: 'transparent',
                    color: 'var(--orange)',
                    border: '2px solid var(--orange)',
                    animation: 'pulse 2s ease infinite',
                  }),
                  ...(status === 'rest' && {
                    background: 'var(--s2)',
                    color: 'var(--muted)',
                    border: '1px solid var(--border)',
                  }),
                  ...(status === 'future' && {
                    background: 'var(--s2)',
                    color: 'var(--muted)',
                    border: '1px solid var(--border)',
                    opacity: 0.4,
                  }),
                }}
              >
                {status === 'done' ? '✓' : ''}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
