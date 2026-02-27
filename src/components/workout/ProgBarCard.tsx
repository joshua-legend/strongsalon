'use client';

interface ProgBarCardProps {
  doneCount: number;
  totalCount: number;
}

export default function ProgBarCard({ doneCount, totalCount }: ProgBarCardProps) {
  const pct = totalCount ? (doneCount / totalCount) * 100 : 0;

  return (
    <div className="rounded-xl border border-purple-500/25 p-3.5 bg-neutral-900">
      <div className="flex items-center justify-between mb-2.5">
        <div className="text-xs font-semibold text-purple-400 tracking-wide">
          오늘 진행도
        </div>
        <div className="text-[11px] font-bebas text-purple-500">
          {doneCount} / {totalCount} 종목 완료
        </div>
      </div>
      <div className="h-1.5 bg-neutral-950/50 rounded overflow-hidden">
        <div
          className="h-full rounded transition-[width] duration-300"
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg,#a855f7,#22d3ee)',
          }}
        />
      </div>
    </div>
  );
}
