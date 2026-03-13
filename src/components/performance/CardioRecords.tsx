'use client';

import { useUser } from '@/context/UserContext';
import Badge from '@/components/ui/Badge';
import { formatTimeMmSs } from '@/utils/format';

export default function CardioRecords() {
  const { user } = useUser();
  const cardio = user?.cardio ?? [];
  return (
    <div className="flex flex-col gap-4">
      {cardio.map((c, i) => (
        <div key={i} className="card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-[20px]">{c.emoji}</span>
              <div>
                <p className="text-[13px] font-bold" style={{ color: "var(--text-main)" }}>{c.label}</p>
                <p className="font-bebas text-[8px]" style={{ color: "var(--text-sub)" }}>{c.date}</p>
              </div>
            </div>
            <Badge variant="orange">🏅 PR</Badge>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-3">
            {c.stats.map((s, j) => (
              <div key={j} className="text-center">
                <p className="font-bebas text-[8px] uppercase mb-1" style={{ color: "var(--text-sub)" }}>{s.label}</p>
                <p className="font-bebas text-[20px] leading-none" style={{ color: "var(--text-main)" }}>
                  {s.value}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-xl p-3 flex items-center justify-between" style={{ backgroundColor: "var(--bg-body)", border: "1px solid var(--border-light)" }}>
            <div>
              <p className="font-bebas text-[8px] uppercase" style={{ color: "var(--text-sub)" }}>
                {c.type === 'run5k' ? '5km' : c.type === 'row2k' ? '2km' : c.type === 'skierg' ? '2km' : '10km'} PR
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
