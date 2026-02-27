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
    <div className="rounded-xl overflow-hidden border border-orange-500/25 bg-neutral-900 shadow-[0_0_0_1px_rgba(249,115,22,.06)_inset]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-3 px-4 border-b border-orange-500/15">
        <div>
          <h3 className="text-[13px] font-bold text-white">
            ＋ 운동 종목 추가
          </h3>
          <p className="text-[10px] mt-0.5 text-neutral-400">
            즐겨찾기에서 고르거나 직접 입력
          </p>
        </div>
        <button
          type="button"
          onClick={() => setFavOpen((o) => !o)}
          className="text-[10px] font-bold cursor-pointer transition-opacity hover:opacity-80 flex items-center gap-1 self-start sm:self-center text-orange-500"
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
                  ? 'border-orange-500 bg-orange-500/12 text-orange-500'
                  : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-700 hover:text-white'
              }`}
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
            className="flex-1 rounded-lg border border-neutral-800 py-2 px-3 text-[12px] outline-none transition-[border-color] placeholder:opacity-50 focus:border-orange-500 bg-neutral-900 text-white"
          />
          <button
            type="button"
            onClick={handleAddCustom}
            className="h-9 px-4 rounded-lg border-0 text-white text-[12px] font-bold transition-all hover:opacity-90 active:scale-[0.98] shrink-0 bg-gradient-to-br from-orange-500 to-orange-400 shadow-[0_2px_10px_rgba(249,115,22,.25)]"
          >
            ＋ 추가
          </button>
        </div>
      </div>
    </div>
  );
}
