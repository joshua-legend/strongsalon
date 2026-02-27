'use client';

interface DateBoxProps {
  value: string;
  onChange: (value: string) => void;
}

export default function DateBox({ value, onChange }: DateBoxProps) {
  return (
    <div className="rounded-xl border border-neutral-800 p-3.5 flex items-center gap-3 flex-shrink-0 bg-neutral-900">
      <span className="text-base opacity-70">📅</span>
      <div>
        <div className="text-[8px] font-bebas mb-1 text-neutral-400 tracking-widest">
          DATE
        </div>
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-transparent border-none outline-none cursor-pointer font-bebas text-[13px] text-white"
        />
      </div>
    </div>
  );
}
