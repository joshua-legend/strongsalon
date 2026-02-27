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
              className={`flex-1 rounded-lg py-2 text-center relative ${
                isActive ? 'bg-yellow-500/20 border border-yellow-500/50' : 'bg-neutral-900 border border-neutral-800'
              }`}
            >
              <p className={`font-bebas text-[7px] font-bold mb-0.5 ${isActive ? '' : 'text-neutral-400'}`} style={isActive ? { color } : undefined}>
                {g.grade}
              </p>
              <p className="font-bebas text-[7px] text-neutral-400">{g.range}</p>
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
