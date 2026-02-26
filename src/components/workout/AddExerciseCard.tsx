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
      className="rounded-xl overflow-hidden border"
      style={{
        background: 'var(--s1)',
        borderColor: 'rgba(255,77,0,.22)',
        boxShadow: '0 0 0 1px rgba(255,77,0,.06) inset',
      }}
    >
      <div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-3 px-4 border-b"
        style={{ borderColor: 'rgba(255,77,0,.15)' }}
      >
        <div>
          <h3 className="text-[13px] font-bold" style={{ color: 'var(--text)' }}>
            ＋ 운동 종목 추가
          </h3>
          <p className="text-[10px] mt-0.5" style={{ color: 'var(--text2)' }}>
            즐겨찾기에서 고르거나 직접 입력
          </p>
        </div>
        <button
          type="button"
          onClick={() => setFavOpen((o) => !o)}
          className="text-[10px] font-bold cursor-pointer transition-opacity hover:opacity-80 flex items-center gap-1 self-start sm:self-center"
          style={{ color: 'var(--orange)' }}
        >
          {favOpen ? '접기 ▲' : '펼치기 ▾'}
        </button>
      </div>
      <div className="p-3.5">
        <div className={`flex flex-wrap gap-1.5 mb-3 ${favOpen ? '' : 'hidden'}`}>
          {FAV_CHIPS.map(({ icon, name }) => (
            <button
              key={name}
              type="button"
              onClick={() => onToggleFav(icon, name)}
              className={`flex items-center gap-1 py-1.5 px-3 rounded-lg border text-[11px] font-medium transition-all whitespace-nowrap ${
                selectedNames.has(name)
                  ? 'border-[var(--orange)]'
                  : 'border-[var(--border)] bg-[var(--s2)] text-[var(--muted2)] hover:border-[var(--border2)] hover:text-[var(--text)]'
              }`}
              style={
                selectedNames.has(name)
                  ? {
                      background: 'rgba(255,77,0,.12)',
                      color: 'var(--orange)',
                    }
                  : undefined
              }
            >
              <span className="text-xs">{icon}</span>
              <span>{name}</span>
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddCustom()}
            placeholder="직접 입력..."
            className="flex-1 rounded-lg border py-2 px-3 text-[12px] outline-none transition-[border-color] placeholder:opacity-50 focus:border-[var(--orange)]"
            style={{
              background: 'var(--s2)',
              borderColor: 'var(--border)',
              color: 'var(--text)',
            }}
          />
          <button
            type="button"
            onClick={handleAddCustom}
            className="h-9 px-4 rounded-lg border-0 text-white text-[12px] font-bold transition-all hover:opacity-90 active:scale-[0.98] shrink-0"
            style={{ background: 'linear-gradient(135deg,var(--orange),var(--og2))', boxShadow: '0 2px 10px rgba(255,77,0,.25)' }}
          >
            ＋ 추가
          </button>
        </div>
      </div>
    </div>
  );
}
