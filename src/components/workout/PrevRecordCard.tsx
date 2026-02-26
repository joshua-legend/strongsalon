'use client';

import { PREV_RECORD } from '@/data/workout';

interface PrevRecordCardProps {
  onCopyPrev: () => void;
}

export default function PrevRecordCard({ onCopyPrev }: PrevRecordCardProps) {
  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{ background: 'var(--s1)', borderColor: 'var(--border)' }}
    >
      <div className="py-3 px-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
        <div
          className="text-[8px] font-[family-name:var(--font-space)]"
          style={{ color: 'var(--muted2)', letterSpacing: '2px' }}
        >
          // {PREV_RECORD.title}
        </div>
        <div className="text-[9px] font-[family-name:var(--font-space)]" style={{ color: 'var(--muted2)' }}>
          {PREV_RECORD.ago}
        </div>
      </div>
      <div className="py-3 px-4">
        {PREV_RECORD.rows.map((row) => (
          <div
            key={row.n}
            className="flex items-center gap-2.5 py-1.5 border-b last:border-b-0"
            style={{ borderColor: 'var(--border)' }}
          >
            <div
              className="font-[family-name:var(--font-space)] text-[9px] w-9 flex-shrink-0"
              style={{ color: 'var(--muted2)' }}
            >
              {row.n}
            </div>
            <div
              className="font-[family-name:var(--font-space)] text-[11px] flex-1"
              style={{ color: 'var(--muted2)' }}
            >
              {row.val}
            </div>
            <div
              className="font-[family-name:var(--font-space)] text-[9px]"
              style={{ color: 'var(--muted2)' }}
            >
              {row.v}
            </div>
          </div>
        ))}
        <div
          className="flex justify-between pt-2 mt-1 border-t"
          style={{ borderColor: 'var(--border)' }}
        >
          <span className="font-[family-name:var(--font-space)] text-[11px]" style={{ color: 'var(--muted2)' }}>
            총 볼륨
          </span>
          <span className="font-[family-name:var(--font-space)] font-bold text-[11px]" style={{ color: 'var(--orange)' }}>
            {PREV_RECORD.total} kg
          </span>
        </div>
        <button
          type="button"
          onClick={onCopyPrev}
          className="w-full mt-2.5 py-2 rounded-lg border text-[11px] font-[family-name:var(--font-space)] cursor-pointer transition-colors hover:border-blue-500 hover:text-blue-500"
          style={{ borderColor: 'var(--border2)', background: 'transparent', color: 'var(--muted2)' }}
        >
          📋 이전 기록 그대로 복사
        </button>
      </div>
    </div>
  );
}
