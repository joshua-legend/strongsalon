'use client';

interface DateBoxProps {
  value: string;
  onChange: (value: string) => void;
}

export default function DateBox({ value, onChange }: DateBoxProps) {
  return (
    <div
      className="rounded-xl border p-3.5 flex items-center gap-3 flex-shrink-0"
      style={{ background: 'var(--s1)', borderColor: 'var(--border)' }}
    >
      <span className="text-base opacity-70">📅</span>
      <div>
        <div
          className="text-[8px] font-[family-name:var(--font-space)] mb-1"
          style={{ color: 'var(--muted2)', letterSpacing: '1px' }}
        >
          DATE
        </div>
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-transparent border-none outline-none cursor-pointer font-[family-name:var(--font-space)] text-[13px]"
          style={{ color: 'var(--text)' }}
        />
      </div>
    </div>
  );
}
