'use client';

import { useState } from 'react';
import { FAV_CHIPS } from '@/data/workout';

interface AddExerciseCardProps {
  selectedNames: Set<string>;
  onToggleFav: (icon: string, name: string) => void;
  onAddCustom: (name: string) => void;
}

export default function AddExerciseCard({
  selectedNames,
  onToggleFav,
  onAddCustom,
}: AddExerciseCardProps) {
  const [favOpen, setFavOpen] = useState(true);
  const [customInput, setCustomInput] = useState('');

  const handleAddCustom = () => {
    const name = customInput.trim();
    if (!name) return;
    onAddCustom(name);
    setCustomInput('');
  };

  return (
    <div
      className="rounded-2xl overflow-hidden border"
      style={{
        background: '#050505',
        borderColor: 'rgba(163,230,53,.4)',
        boxShadow: '0 0 12px rgba(163,230,53,.2)',
      }}
    >
      {/* Header */}
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
          <p
            className="font-bebas text-[10px] mt-1 tracking-wider"
            style={{ color: '#fff' }}
          >
            즐겨찾기에서 고르거나 직접 입력
          </p>
        </div>
        <button
          type="button"
          onClick={() => setFavOpen((o) => !o)}
          className="font-bebas text-[10px] tracking-wider cursor-pointer hover:opacity-80 flex items-center gap-1 self-start sm:self-center transition-opacity"
          style={{ color: 'rgb(163, 230, 53)', textShadow: '0 0 8px rgba(163,230,53,.4)' }}
        >
          {favOpen ? '접기 ▲' : '펼치기 ▾'}
        </button>
      </div>

      {/* Body */}
      <div className="p-5">
        {/* Fav chips */}
        <div className={`flex flex-wrap gap-1.5 mb-3 ${favOpen ? '' : 'hidden'}`}>
          {FAV_CHIPS.map(({ icon, name }) => {
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
                        textShadow: '0 0 6px rgba(163,230,53,.5)',
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

        {/* Custom input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddCustom()}
            placeholder="직접 입력..."
            className="flex-1 rounded-xl py-2.5 px-3 font-bebas text-[13px] outline-none text-white placeholder:text-neutral-800 focus:shadow-[0_0_20px_rgba(163,230,53,.25)] focus:border-lime-400/70 border transition-all"
            style={{ background: '#0a0a0a', borderColor: 'rgba(255,255,255,.07)' }}
          />
          <button
            type="button"
            onClick={handleAddCustom}
            className="h-10 px-5 rounded-xl font-bebas text-[13px] tracking-wider active:scale-[0.98] shrink-0 text-white transition-all hover:brightness-110"
            style={{
              background: 'linear-gradient(135deg, rgb(163, 230, 53) 0%, #65a30d 100%)',
              border: '1px solid rgb(163, 230, 53)',
              boxShadow: '0 0 12px rgba(163,230,53,.3)',
            }}
          >
            ＋ 추가
          </button>
        </div>
      </div>
    </div>
  );
}
