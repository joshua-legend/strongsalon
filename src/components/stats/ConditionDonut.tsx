'use client';

const data = [
  { label: '🔥 최고', pct: 28, color: '#f97316' },
  { label: '😊 좋음', pct: 45, color: '#a3e635' },
  { label: '😐 보통', pct: 20, color: '#eab308' },
  { label: '😩 피로', pct: 7, color: '#ef4444' },
];

const R = 52;
const CIRC = 2 * Math.PI * R;

export default function ConditionDonut() {
  let offset = 0;

  return (
    <div className="card">
      <p className="card-label mb-4">😊 컨디션 분포</p>
      <div className="flex items-center gap-5">
        <div className="relative shrink-0">
          <svg width="130" height="130" viewBox="0 0 130 130">
            {data.map((d, i) => {
              const dash = (d.pct / 100) * CIRC;
              const gap = CIRC - dash;
              const currentOffset = offset;
              offset += dash;
              return (
                <circle
                  key={i}
                  cx="65" cy="65" r={R}
                  fill="none"
                  stroke={d.color}
                  strokeWidth="12"
                  strokeDasharray={`${dash} ${gap}`}
                  strokeDashoffset={-currentOffset}
                  strokeLinecap="round"
                  transform="rotate(-90 65 65)"
                  opacity="0.85"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-bebas text-[28px] leading-none text-orange-500">4.2</span>
            <span className="font-bebas text-[8px] text-neutral-400">평균</span>
          </div>
        </div>

        <div className="flex flex-col gap-2.5 flex-1">
          {data.map((d, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-[11px] w-16 shrink-0">{d.label}</span>
              <div className="flex-1 h-[5px] rounded-full overflow-hidden bg-neutral-950/50">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${d.pct}%`, background: d.color }}
                />
              </div>
              <span className="font-bebas text-[9px] w-8 text-right text-neutral-500">
                {d.pct}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
