'use client';

import type { RankGrade } from '@/types';
import { getGradeColor } from '@/utils/scoring';

const grades: { grade: RankGrade; range: string }[] = [
  { grade: 'BRONZE', range: '0~39' },
  { grade: 'SILVER', range: '40~59' },
  { grade: 'GOLD', range: '60~74' },
  { grade: 'PLATINUM', range: '75~89' },
  { grade: 'ELITE', range: '90+' },
];

export default function GradeLegend() {
  return (
    <div className="card">
      <p className="card-label mb-3">🏆 등급 기준</p>
      <div className="flex gap-1">
        {grades.map(g => {
          const color = getGradeColor(g.grade);
          const isActive = g.grade === 'GOLD';
          return (
            <div
              key={g.grade}
              className="flex-1 rounded-lg py-2 text-center relative"
              style={{
                background: isActive ? `${color}20` : 'var(--s2)',
                border: `1px solid ${isActive ? `${color}50` : 'var(--border)'}`,
              }}
            >
              <p className="font-space text-[7px] font-bold mb-0.5" style={{ color: isActive ? color : 'var(--muted2)' }}>
                {g.grade}
              </p>
              <p className="font-space text-[7px]" style={{ color: 'var(--muted)' }}>{g.range}</p>
              {isActive && (
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full" style={{ background: color }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
