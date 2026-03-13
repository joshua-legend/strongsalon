'use client';

import { useState } from 'react';
import { Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { EXERCISE_GROUPS } from '@/data/workout';

import type { CardioType } from '@/types';

interface AddExerciseCardProps {
  selectedNames: Set<string>;
  onToggleFav: (icon: string, name: string) => void;
  cardioTypes: CardioType[];
  onToggleCardio: (type: CardioType) => void;
}

export default function AddExerciseCard({
  selectedNames,
  onToggleFav,
  cardioTypes,
  onToggleCardio,
}: AddExerciseCardProps) {
  const [openGroup, setOpenGroup] = useState<number | null>(0);

  return (
    <div
      className="rounded-2xl overflow-hidden relative"
      style={{
        background: 'var(--bg-body)',
        border: '1px solid rgba(163,230,53,.35)',
        boxShadow: '0 0 20px rgba(163,230,53,.12), 0 0 40px rgba(163,230,53,.04)',
      }}
    >
      {/* Left accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{
          background: 'var(--accent-main)',
          boxShadow: '0 0 10px rgba(163,230,53,.6), 0 0 20px rgba(163,230,53,.3)',
        }}
      />

      {/* Header */}
      <div
        className="relative pl-5 pr-5 py-4"
        style={{
          background: 'linear-gradient(90deg, var(--accent-bg) 0%, transparent 100%)',
          borderBottom: '1px solid rgba(255,255,255,.04)',
        }}
      >
        <div className="flex items-center gap-2">
          <span
            className="flex items-center justify-center w-8 h-8 rounded-xl"
            style={{
              background: 'var(--accent-bg)',
              border: '1px solid rgba(163,230,53,.35)',
              boxShadow: '0 0 12px rgba(163,230,53,.2)',
            }}
          >
            <Plus className="w-4 h-4 text-[var(--accent-main)]" strokeWidth={2.5} />
          </span>
          <div>
            <h3
              className="font-bebas text-[18px] leading-none tracking-wider text-[var(--text-main)]"
              style={{ textShadow: '0 0 12px rgba(163,230,53,.5), 0 0 28px rgba(163,230,53,.2)' }}
            >
              운동 종목 추가
            </h3>
            <p className="font-bebas text-[10px] mt-0.5 tracking-wider text-[var(--text-sub)]">
              카테고리별로 선택
            </p>
          </div>
        </div>
      </div>

      {/* Groups */}
      <div className="p-4 pt-3">
        <div className="space-y-2">
          {EXERCISE_GROUPS.map((group, idx) => {
            const isOpen = openGroup === idx;
            const hasCardio = !!group.cardio?.length;
            const hasChips = !!group.chips?.length;
            const accentColor = hasCardio && !hasChips ? '#00e5ff' : '#a3e635';
            return (
              <div
                key={group.label}
                className="rounded-xl overflow-hidden transition-all"
                style={{
                  border: `1px solid ${isOpen ? (accentColor === '#00e5ff' ? 'rgba(0,229,255,.3)' : 'rgba(163,230,53,.3)') : 'rgba(255,255,255,.06)'}`,
                  background: isOpen ? 'rgba(255,255,255,.02)' : 'rgba(255,255,255,.01)',
                  boxShadow: isOpen ? `0 0 12px ${accentColor === '#00e5ff' ? 'rgba(0,229,255,.15)' : 'rgba(163,230,53,.15)'}` : 'none',
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpenGroup(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between px-4 py-3 font-bebas text-[13px] tracking-wider text-[var(--text-main)] transition-all duration-300 hover:bg-[var(--bg-card-hover)] active:scale-[0.98]"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="text-lg" style={{ filter: `drop-shadow(0 0 6px ${accentColor}60)` }}>
                      {group.icon}
                    </span>
                    <span>{group.label}</span>
                  </span>
                  <span
                    className="flex items-center gap-1 text-[10px] transition-colors"
                    style={{ color: accentColor, textShadow: `0 0 6px ${accentColor}50` }}
                  >
                    {isOpen ? (
                      <>
                        <span>접기</span>
                        <ChevronUp className="w-3.5 h-3.5" />
                      </>
                    ) : (
                      <>
                        <span>펼치기</span>
                        <ChevronDown className="w-3.5 h-3.5" />
                      </>
                    )}
                  </span>
                </button>
                {isOpen && (
                  <div
                    className="flex flex-wrap gap-2 p-3 pt-0 border-t"
                    style={{ borderColor: 'rgba(255,255,255,.04)' }}
                  >
                    {hasChips &&
                      group.chips!.map(({ icon, name }) => {
                        const active = selectedNames.has(name);
                        return (
                          <button
                            key={name}
                            type="button"
                            onClick={() => onToggleFav(icon, name)}
                            className={`flex items-center gap-2 py-2 px-3.5 rounded-xl font-bebas text-[11px] tracking-wider transition-all duration-300 whitespace-nowrap hover:scale-[1.02] active:scale-95 ${
                              active
                                ? "border border-[var(--accent-main)]/50 bg-[var(--accent-bg)] text-[var(--accent-main)] shadow-[0_0_12px_rgba(163,230,53,.25)]"
                                : "border border-[var(--border-light)] bg-[var(--bg-card)] text-[var(--text-main)]"
                            }`}
                          >
                            <span className="text-xs">{icon}</span>
                            <span>{name}</span>
                          </button>
                        );
                      })}
                    {hasCardio &&
                      group.cardio!.map(({ type, label, emoji }) => {
                        const active = cardioTypes.includes(type);
                        return (
                          <button
                            key={type}
                            type="button"
                            onClick={() => onToggleCardio(type)}
                            className="flex items-center gap-2 py-2 px-4 rounded-xl font-bebas text-[11px] tracking-wider transition-all whitespace-nowrap hover:scale-[1.02] active:scale-[0.98]"
                            style={
                              active
                                ? {
                                    border: '1px solid rgba(0,229,255,.6)',
                                    background: 'rgba(0,229,255,.18)',
                                    color: '#00e5ff',
                                    boxShadow: '0 0 12px rgba(0,229,255,.35)',
                                  }
                                : {
                                    border: '1px solid rgba(0,229,255,.4)',
                                    background: 'rgba(0,229,255,.08)',
                                    color: '#00e5ff',
                                    boxShadow: '0 0 12px rgba(0,229,255,.2)',
                                  }
                            }
                          >
                            <span className="text-sm">{emoji}</span>
                            <span>{active ? '✓ ' : '+ '}{label}</span>
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
