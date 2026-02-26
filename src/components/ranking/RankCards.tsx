'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { member } from '@/data/member';
import { calcStrengthScore, calcBodyScore, calcCardioScore } from '@/utils/scoring';

interface CardSection {
  icon: string;
  title: string;
  weight: string;
  score: number;
  source: string;
  details: { label: string; value: string; pct: number; color: string }[];
}

const sections: CardSection[] = [
  {
    icon: '🏋️',
    title: '근력 점수',
    weight: '가중치 40%',
    score: calcStrengthScore(member),
    source: 'Strengthlevel 전국 표본',
    details: member.lifts.map(l => ({
      label: l.name,
      value: `${l.weight}kg`,
      pct: l.pct,
      color: l.color,
    })),
  },
  {
    icon: '🧬',
    title: '체성분 점수',
    weight: '가중치 30%',
    score: calcBodyScore(member),
    source: '동연령·성별 표준',
    details: [
      { label: '골격근량', value: `${member.bodyComp.muscle}kg`, pct: 68, color: 'var(--blue)' },
      { label: '체지방률', value: `${member.bodyComp.fatPct}%`, pct: 62, color: 'var(--orange)' },
    ],
  },
  {
    icon: '🏃',
    title: '체력 점수',
    weight: '가중치 30%',
    score: calcCardioScore(member),
    source: 'Cooper test · Concept2',
    details: [
      { label: '5km 런', value: '26:40', pct: 55, color: 'var(--green)' },
      { label: '로잉 2km', value: '7:38', pct: 50, color: 'var(--blue)' },
      { label: '싸이클 10km', value: '21:20', pct: 58, color: 'var(--orange)' },
    ],
  },
];

export default function RankCards() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-3">
      {sections.map((s, i) => (
        <div key={i} className="card overflow-hidden">
          <button
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="text-[20px]">{s.icon}</span>
              <div className="text-left">
                <p className="text-[13px] font-medium" style={{ color: 'var(--text)' }}>{s.title}</p>
                <p className="font-space text-[8px]" style={{ color: 'var(--muted)' }}>{s.weight}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bebas text-[28px]" style={{ color: 'var(--purple)' }}>{s.score}</span>
              <span
                className="text-[14px] transition-transform duration-200"
                style={{
                  color: 'var(--muted)',
                  transform: openIdx === i ? 'rotate(180deg)' : 'rotate(0)',
                }}
              >
                ▾
              </span>
            </div>
          </button>

          <AnimatePresence>
            {openIdx === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="pt-3 mt-3" style={{ borderTop: '1px solid var(--border)' }}>
                  <p className="font-space text-[8px] mb-3" style={{ color: 'var(--muted)' }}>
                    기준: {s.source}
                  </p>
                  <div className="flex flex-col gap-3">
                    {s.details.map((d, j) => (
                      <div key={j}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px]" style={{ color: 'var(--text)' }}>{d.label}</span>
                          <span className="font-space text-[10px] font-bold" style={{ color: d.color }}>{d.value}</span>
                        </div>
                        <div className="progress-track" style={{ height: 5 }}>
                          <div
                            className="progress-fill"
                            style={{ width: `${d.pct}%`, background: d.color }}
                          />
                        </div>
                        <p className="font-space text-[7px] text-right mt-0.5" style={{ color: 'var(--muted)' }}>
                          상위 {100 - d.pct}%
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
