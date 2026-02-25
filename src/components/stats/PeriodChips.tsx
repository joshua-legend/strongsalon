'use client';

const periods = [
  { id: '1m', label: '1개월' },
  { id: '3m', label: '3개월' },
  { id: '6m', label: '6개월' },
  { id: 'all', label: '전체' },
];

interface PeriodChipsProps {
  value: string;
  onChange: (v: string) => void;
}

export default function PeriodChips({ value, onChange }: PeriodChipsProps) {
  return (
    <div className="flex gap-2">
      {periods.map(p => (
        <button
          key={p.id}
          onClick={() => onChange(p.id)}
          className="px-3.5 py-1.5 rounded-[20px] text-[11px] font-medium transition-all duration-200"
          style={{
            background: value === p.id ? 'rgba(255,94,31,.12)' : 'var(--s2)',
            border: `1px solid ${value === p.id ? 'rgba(255,94,31,.3)' : 'var(--border)'}`,
            color: value === p.id ? 'var(--orange)' : 'var(--muted2)',
          }}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
