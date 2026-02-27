'use client';

import { member } from '@/data/member';
import Badge from '@/components/ui/Badge';
import { formatTimeMmSs } from '@/utils/format';

export default function CardioRecords() {
  return (
    <div className="flex flex-col gap-4">
      {member.cardio.map((c, i) => (
        <div key={i} className="card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-[20px]">{c.emoji}</span>
              <div>
                <p className="text-[13px] font-medium text-white">{c.label}</p>
                <p className="font-bebas text-[8px] text-neutral-400">{c.date}</p>
              </div>
            </div>
            <Badge variant="orange">🏅 PR</Badge>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-3">
            {c.stats.map((s, j) => (
              <div key={j} className="text-center">
                <p className="font-bebas text-[8px] uppercase mb-1 text-neutral-400">{s.label}</p>
                <p className="font-bebas text-[20px] leading-none text-white">
                  {s.value}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-xl p-3 flex items-center justify-between bg-neutral-900 border border-neutral-800">
            <div>
              <p className="font-bebas text-[8px] uppercase text-neutral-400">
                {c.type === 'run5k' ? '5km' : c.type === 'row2k' ? '2km' : '10km'} PR
              </p>
              <p className="font-bebas text-[22px] leading-none text-orange-500">
                {formatTimeMmSs(c.pr)}
              </p>
            </div>
            <p className="text-[10px] text-lime-400">
              ▲ {c.prDelta}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
