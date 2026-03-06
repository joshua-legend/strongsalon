'use client';

import { useState } from 'react';
import { EXERCISE_GROUPS } from '@/data/workout';

import type { CardioType } from '@/types';

interface AddExerciseCardProps {
  selectedNames: Set<string>;
  onToggleFav: (icon: string, name: string) => void;
  onAddCardio: (type: CardioType) => void;
}

export default function AddExerciseCard({
  selectedNames,
  onToggleFav,
  onAddCardio,
}: AddExerciseCardProps) {
  const [openGroup, setOpenGroup] = useState<number | null>(0);

  return (
    <div
      className="rounded-2xl overflow-hidden border"
      style={{
        background: '#050505',
        borderColor: 'rgba(163,230,53,.4)',
        boxShadow: '0 0 12px rgba(163,230,53,.2)',
      }}
    >
      <div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-4 px-5 border-b"
        style={{ borderColor: 'rgba(255,255,255,.04)' }}
      >
        <div>
          <h3
            className="font-bebas text-[18px] leading-none tracking-wider text-white"
            style={{ textShadow: '0 0 12px rgba(163,230,53,.5), 0 0 28px rgba(163,230,53,.25)' }}
          >
            ＋ 운동 종목 추가
          </h3>
          <p className="font-bebas text-[10px] mt-1 tracking-wider" style={{ color: '#fff' }}>
            종류별로 선택
          </p>
        </div>
      </div>

      <div className="p-5">
        <div className="space-y-2">
          {EXERCISE_GROUPS.map((group, idx) => {
            const isOpen = openGroup === idx;
            const isCardio = 'cardio' in group;
            return (
              <div key={group.label} className="rounded-xl border border-neutral-800 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenGroup(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between px-4 py-2.5 font-bebas text-[12px] tracking-wider text-white hover:bg-neutral-800/50 transition-colors"
                  style={{ background: 'rgba(255,255,255,.02)' }}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base">{group.icon}</span>
                    <span>{group.label}</span>
                  </span>
                  <span className={`text-[10px] ${isCardio ? 'text-cyan-400' : 'text-lime-400'}`}>
                    {isOpen ? '접기 ▲' : '펼치기 ▾'}
                  </span>
                </button>
                {isOpen && (
                  <div className="flex flex-wrap gap-1.5 p-3 pt-0 border-t border-neutral-800/50">
                    {isCardio
                      ? (group as { cardio: { type: 'run' | 'cycle' | 'row' | 'skierg'; label: string; emoji: string }[] }).cardio.map(({ type, label, emoji }) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => onAddCardio(type)}
                            className="flex items-center gap-1 py-1.5 px-3 rounded-xl border font-bebas text-[11px] tracking-wider transition-all whitespace-nowrap hover:brightness-110"
                            style={{
                              borderColor: 'rgba(0,229,255,.4)',
                              background: '#0a0a0a',
                              color: '#00e5ff',
                              boxShadow: '0 0 8px rgba(0,229,255,.2)',
                            }}
                          >
                            <span>{emoji}</span>
                            <span>+ {label}</span>
                          </button>
                        ))
                      : (group as { chips: { icon: string; name: string }[] }).chips.map(({ icon, name }) => {
                          const active = selectedNames.has(name);
                          return (
                            <button
                              key={name}
                              type="button"
                              onClick={() => onToggleFav(icon, name)}
                              className="flex items-center gap-1 py-1.5 px-3 rounded-xl border font-bebas text-[11px] tracking-wider transition-all whitespace-nowrap"
                              style={
                                active
                                  ? {
                                      borderColor: 'rgb(163, 230, 53)',
                                      background: 'rgba(163,230,53,.1)',
                                      color: 'rgb(163, 230, 53)',
                                      boxShadow: '0 0 8px rgba(163,230,53,.25)',
                                    }
                                  : {
                                      borderColor: 'rgba(255,255,255,.07)',
                                      background: '#0a0a0a',
                                      color: '#fff',
                                    }
                              }
                            >
                              <span className="text-xs">{icon}</span>
                              <span>{name}</span>
                            </button>
                          );
                        })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
