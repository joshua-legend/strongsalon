'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/context/UserContext';
import { calcStrengthScore, calcBodyScore, calcCardioScore } from '@/utils/scoring';

interface CardSection {
  icon: string;
  title: string;
  weight: string;
  score: number;
  source: string;
  details: { label: string; value: string; pct: number; color: string }[];
}

export default function RankCards() {
  const { user } = useUser();
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const sections: CardSection[] = useMemo(() => {
    if (!user) return [];
    return [
      {
        icon: '🏋️',
        title: '근력 점수',
        weight: '가중치 40%',
        score: calcStrengthScore(user),
        source: 'Strengthlevel 전국 표본',
        details: (user.lifts ?? []).map(l => ({
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
        score: calcBodyScore(user),
        source: '동연령·성별 표준',
        details: user.bodyComp
          ? [
              { label: '골격근량', value: `${user.bodyComp.muscle}kg`, pct: 68, color: '#22d3ee' },
              { label: '체지방률', value: `${user.bodyComp.fatPct}%`, pct: 62, color: '#f97316' },
            ]
          : [],
      },
      {
        icon: '🏃',
        title: '체력 점수',
        weight: '가중치 30%',
        score: calcCardioScore(user),
        source: 'Cooper test · Concept2',
        details: [
          { label: '5km 런', value: '26:40', pct: 55, color: '#a3e635' },
          { label: '로잉 2km', value: '7:38', pct: 50, color: '#22d3ee' },
          { label: '싸이클 10km', value: '21:20', pct: 58, color: '#f97316' },
        ],
      },
    ];
  }, [user]);

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
                <p className="text-[13px] font-bold" style={{ color: "var(--text-main)" }}>{s.title}</p>
                <p className="font-bebas text-[8px]" style={{ color: "var(--text-sub)" }}>{s.weight}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bebas text-[28px] text-purple-500">{s.score}</span>
              <span
                className={`text-[14px] transition-transform duration-200 text-neutral-400 ${openIdx === i ? 'rotate-180' : ''}`}
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
                <div className="pt-3 mt-3 border-t" style={{ borderColor: "var(--border-light)" }}>
                  <p className="font-bebas text-[8px] mb-3" style={{ color: "var(--text-sub)" }}>
                    기준: {s.source}
                  </p>
                  <div className="flex flex-col gap-3">
                    {s.details.map((d, j) => (
                      <div key={j}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px]" style={{ color: "var(--text-main)" }}>{d.label}</span>
                          <span className="font-bebas text-[10px] font-bold" style={{ color: d.color }}>{d.value}</span>
                        </div>
                        <div className="progress-track" style={{ height: 5 }}>
                          <div
                            className="progress-fill"
                            style={{ width: `${d.pct}%`, background: d.color }}
                          />
                        </div>
                        <p className="font-bebas text-[7px] text-right mt-0.5" style={{ color: "var(--text-sub)" }}>
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
