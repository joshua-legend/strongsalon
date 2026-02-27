'use client';

import { PREV_RECORD } from '@/data/workout';

interface PrevRecordCardProps {
  onCopyPrev: () => void;
}

export default function PrevRecordCard({ onCopyPrev }: PrevRecordCardProps) {
  return (
    <div className="rounded-xl border border-neutral-800 overflow-hidden bg-neutral-900">
      <div className="py-3 px-4 border-b border-neutral-800 flex items-center justify-between">
        <div className="text-xs font-semibold text-white tracking-wide">
          {PREV_RECORD.title}
        </div>
        <div className="text-[9px] font-bebas text-neutral-400">
          {PREV_RECORD.ago}
        </div>
      </div>
      <div className="py-3 px-4">
        {PREV_RECORD.rows.map((row) => (
          <div
            key={row.n}
            className="flex items-center gap-2.5 py-1.5 border-b last:border-b-0"
            className="border-neutral-800"
          >
            <div
              className="font-bebas text-[9px] w-9 flex-shrink-0 text-neutral-400"
            >
              {row.n}
            </div>
            <div
              className="font-bebas text-[11px] flex-1 text-neutral-400"
            >
              {row.val}
            </div>
            <div
              className="font-bebas text-[9px] text-neutral-400"
            >
              {row.v}
            </div>
          </div>
        ))}
        <div
          className="flex justify-between pt-2 mt-1 border-t"
          className="border-neutral-800"
        >
          <span className="font-bebas text-[11px] text-neutral-400">
            총 볼륨
          </span>
          <span className="font-bebas font-bold text-[11px] text-orange-500">
            {PREV_RECORD.total} kg
          </span>
        </div>
        <button
          type="button"
          onClick={onCopyPrev}
          className="w-full mt-2.5 py-2 rounded-lg border border-neutral-700 bg-transparent text-neutral-400 text-[11px] font-bebas cursor-pointer transition-colors hover:border-cyan-400 hover:text-cyan-400"
        >
          📋 이전 기록 그대로 복사
        </button>
      </div>
    </div>
  );
}
