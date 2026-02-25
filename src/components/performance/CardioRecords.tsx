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
                <p className="text-[13px] font-medium" style={{ color: 'var(--text)' }}>{c.label}</p>
                <p className="font-space text-[8px]" style={{ color: 'var(--muted)' }}>{c.date}</p>
              </div>
            </div>
            <Badge variant="orange">🏅 PR</Badge>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-3">
            {c.stats.map((s, j) => (
              <div key={j} className="text-center">
                <p className="font-space text-[8px] uppercase mb-1" style={{ color: 'var(--muted)' }}>{s.label}</p>
                <p className="font-bebas text-[20px] leading-none" style={{ color: 'var(--text)' }}>
                  {s.value}
                </p>
              </div>
            ))}
          </div>

          <div
            className="rounded-xl p-3 flex items-center justify-between"
            style={{ background: 'var(--s2)', border: '1px solid var(--border)' }}
          >
            <div>
              <p className="font-space text-[8px] uppercase" style={{ color: 'var(--muted)' }}>
                {c.type === 'run5k' ? '5km' : c.type === 'row2k' ? '2km' : '1km'} PR
              </p>
              <p className="font-bebas text-[22px] leading-none" style={{ color: 'var(--orange)' }}>
                {formatTimeMmSs(c.pr)}
              </p>
            </div>
            <p className="text-[10px]" style={{ color: 'var(--green)' }}>
              ▲ {c.prDelta}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
