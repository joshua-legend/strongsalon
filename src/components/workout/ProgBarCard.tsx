'use client';

interface ProgBarCardProps {
  doneCount: number;
  totalCount: number;
}

export default function ProgBarCard({ doneCount, totalCount }: ProgBarCardProps) {
  const pct = totalCount ? (doneCount / totalCount) * 100 : 0;

  return (
    <div className="rounded-2xl border border-purple-500/30 p-5 bg-neutral-900 shadow-[0_0_25px_rgba(168,85,247,.1)]">
      <div className="flex items-center justify-between mb-3">
        <div className="font-bebas text-[12px] text-purple-400 tracking-widest uppercase drop-shadow-[0_0_6px_rgba(168,85,247,.4)]">
          오늘 진행도
        </div>
        <div className="font-bebas text-[11px] text-purple-500 tracking-wider drop-shadow-[0_0_6px_rgba(168,85,247,.4)]">
          {doneCount} / {totalCount} 종목 완료
        </div>
      </div>
      <div className="h-1.5 bg-neutral-950/50 rounded overflow-hidden">
        <div
          className="h-full rounded transition-[width] duration-300 shadow-[0_0_10px_rgba(168,85,247,.5)]"
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg,#a855f7,#22d3ee)',
          }}
        />
      </div>
    </div>
  );
}
