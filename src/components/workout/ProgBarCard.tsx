'use client';

interface ProgBarCardProps {
  doneCount: number;
  totalCount: number;
}

export default function ProgBarCard({ doneCount, totalCount }: ProgBarCardProps) {
  const pct = totalCount ? (doneCount / totalCount) * 100 : 0;

  return (
    <div
      className="rounded-xl border p-3.5"
      style={{ background: 'var(--s1)', borderColor: 'rgba(168,85,247,.2)' }}
    >
      <div className="flex items-center justify-between mb-2.5">
        <div
          className="text-[9px] font-[family-name:var(--font-space)]"
          style={{ color: 'rgba(168,85,247,.7)', letterSpacing: '1.5px' }}
        >
          // 오늘 진행도
        </div>
        <div className="text-[11px] font-[family-name:var(--font-space)]" style={{ color: 'var(--purple)' }}>
          {doneCount} / {totalCount} 종목 완료
        </div>
      </div>
      <div className="h-1.5 bg-[var(--s3)] rounded overflow-hidden">
        <div
          className="h-full rounded transition-[width] duration-300"
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg,var(--purple),var(--blue))',
          }}
        />
      </div>
    </div>
  );
}
