'use client';

const stats = [
  {
    label: '총 볼륨',
    value: '72',
    unit: 'k',
    color: 'var(--orange)',
    change: '▲ +18%',
    changeColor: 'var(--green)',
    icon: '🔥',
  },
  {
    label: '운동 횟수',
    value: '16',
    unit: '회',
    color: 'var(--green)',
    change: '▲ +3회',
    changeColor: 'var(--green)',
    icon: '📊',
  },
  {
    label: '평균 운동시간',
    value: '68',
    unit: '분',
    color: 'var(--blue)',
    change: '▼ -4분',
    changeColor: 'var(--red)',
    icon: '⏱️',
  },
  {
    label: '연속 출석',
    value: '12',
    unit: '일',
    color: 'var(--yellow)',
    change: '역대 최고 🏆',
    changeColor: 'var(--yellow)',
    icon: '🔥',
  },
];

export default function StatGrid() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((s, i) => (
        <div
          key={i}
          className="card relative overflow-hidden group"
        >
          <div className="absolute top-3 right-3 text-[20px] opacity-10 group-hover:opacity-20 transition-opacity">
            {s.icon}
          </div>
          <p className="card-label mb-2">{s.icon} {s.label}</p>
          <p className="font-bebas text-[32px] leading-none mb-1" style={{ color: s.color }}>
            {s.value}
            <span className="text-[16px]" style={{ color: 'var(--muted2)' }}>{s.unit}</span>
          </p>
          <p className="font-space text-[9px]" style={{ color: s.changeColor }}>
            {s.change}
          </p>
          <div
            className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ background: s.color }}
          />
        </div>
      ))}
    </div>
  );
}
