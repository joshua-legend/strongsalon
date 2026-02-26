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
      className="rounded-xl border overflow-hidden"
      style={{ background: 'var(--s1)', borderColor: 'var(--border)' }}
    >
      <div className="flex items-center justify-between py-3 px-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <div
          className="text-[9px] font-[family-name:var(--font-space)]"
          style={{ color: 'var(--muted2)', letterSpacing: '2px' }}
        >
          // 운동 종목 추가
        </div>
        <button
          type="button"
          onClick={() => setFavOpen((o) => !o)}
          className="text-[10px] font-[family-name:var(--font-space)] cursor-pointer transition-opacity hover:opacity-70"
          style={{ color: 'var(--orange)' }}
        >
          즐겨찾기 ▾
        </button>
      </div>
      <div className="p-3.5">
        <div className={`flex flex-wrap gap-1.5 mb-3 ${favOpen ? '' : 'hidden'}`}>
          {FAV_CHIPS.map(({ icon, name }) => (
            <button
              key={name}
              type="button"
              onClick={() => onToggleFav(icon, name)}
              className={`flex items-center gap-1 py-1.5 px-3 rounded-full border text-[11px] transition-all whitespace-nowrap ${
                selectedNames.has(name)
                  ? 'font-bold'
                  : 'border-[var(--border)] bg-[var(--s2)] text-[var(--muted2)] hover:border-[var(--border2)] hover:text-[var(--text)]'
              }`}
              style={
                selectedNames.has(name)
                  ? {
                      background: 'rgba(255,77,0,.1)',
                      borderColor: 'rgba(255,77,0,.3)',
                      color: 'var(--orange)',
                    }
                  : undefined
              }
            >
              <span>{icon}</span>
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
            className="flex-1 rounded-lg border py-2 px-3 text-xs outline-none transition-[border-color] placeholder:opacity-60"
            style={{
              background: 'var(--s2)',
              borderColor: 'var(--border)',
              color: 'var(--text)',
            }}
          />
          <button
            type="button"
            onClick={handleAddCustom}
            className="h-[38px] px-4 rounded-lg border-0 text-white text-xs font-bold transition-opacity hover:opacity-85"
            style={{ background: 'linear-gradient(135deg,var(--orange),var(--og2))' }}
          >
            + 추가
          </button>
        </div>
      </div>
    </div>
  );
}
