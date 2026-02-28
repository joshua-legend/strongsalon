'use client';

import type { CardioEntry, CardioType } from '@/types';

const CARDIO_META: Record<CardioType, { label: string; emoji: string }> = {
  run: { label: '런닝', emoji: '🏃' },
  cycle: { label: '싸이클', emoji: '🚴' },
  row: { label: '로잉', emoji: '🚣' },
};

interface CardioAreaProps {
  entries: CardioEntry[];
  onAdd: (type: CardioType) => void;
  onUpdate: (
    id: string,
    patch: Partial<Pick<CardioEntry, 'distanceKm' | 'timeMinutes'>>
  ) => void;
  onRemove: (id: string) => void;
}

export default function CardioArea({ entries, onAdd, onUpdate, onRemove }: CardioAreaProps) {
  return (
    <div className="flex flex-col gap-3">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-0.5">
        <div>
          <h3
            className="font-bebas text-[14px] tracking-wider uppercase"
            style={{
              color: '#00e5ff',
              textShadow: '0 0 8px rgba(0,229,255,.5)',
            }}
          >
            유산소
          </h3>
          <p className="font-bebas text-[10px] mt-1 tracking-wider" style={{ color: '#fff' }}>
            거리(km) · 시간(분) 입력
          </p>
        </div>

        {/* Add buttons */}
        <div className="flex flex-wrap gap-1.5">
          {(Object.keys(CARDIO_META) as CardioType[]).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => onAdd(type)}
              className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl border font-bebas text-[11px] tracking-wider transition-all hover:brightness-110"
              style={{
                borderColor: 'rgba(0,229,255,.4)',
                background: '#0a0a0a',
                color: '#00e5ff',
                boxShadow: '0 0 8px rgba(0,229,255,.2)',
                textShadow: '0 0 8px rgba(0,229,255,.5)',
              }}
            >
              <span>{CARDIO_META[type].emoji}</span>
              <span>+ {CARDIO_META[type].label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Entry cards */}
      {entries.length > 0 && (
        <div className="flex flex-col gap-2">
          {entries.map((e) => (
            <div
              key={e.id}
              className="flex flex-wrap items-center gap-2 py-3 px-4 rounded-2xl border"
            style={{
              background: '#050505',
              borderColor: 'rgba(0,229,255,.4)',
              boxShadow: '0 0 12px rgba(0,229,255,.2)',
            }}
            >
              {/* Type label */}
              <div
                className="flex items-center gap-1.5 font-bebas text-[13px] shrink-0 tracking-wider"
              style={{
                color: '#00e5ff',
                textShadow: '0 0 6px rgba(0,229,255,.5)',
              }}
              >
                <span>{CARDIO_META[e.type].emoji}</span>
                <span>{CARDIO_META[e.type].label}</span>
              </div>

              {/* Inputs */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <label
                  className="flex items-center gap-1.5 font-bebas text-[10px] tracking-wider"
                  style={{ color: '#fff' }}
                >
                  <span>km</span>
                  <input
                    type="number"
                    min={0}
                    step={0.1}
                    value={e.distanceKm || ''}
                    onChange={(ev) =>
                      onUpdate(e.id, { distanceKm: parseFloat(ev.target.value) || 0 })
                    }
                    className="w-16 rounded-xl py-1.5 px-2 font-bebas text-[13px] outline-none text-white transition-all focus:shadow-[0_0_16px_rgba(0,229,255,.3)] focus:border-cyan-400/60 border"
                    style={{ background: '#0a0a0a', borderColor: 'rgba(255,255,255,.07)' }}
                  />
                </label>
                <label
                  className="flex items-center gap-1.5 font-bebas text-[10px] tracking-wider"
                  style={{ color: '#fff' }}
                >
                  <span>분</span>
                  <input
                    type="number"
                    min={0}
                    step={1}
                    value={e.timeMinutes || ''}
                    onChange={(ev) =>
                      onUpdate(e.id, { timeMinutes: parseInt(ev.target.value, 10) || 0 })
                    }
                    className="w-14 rounded-xl py-1.5 px-2 font-bebas text-[13px] outline-none text-white transition-all focus:shadow-[0_0_16px_rgba(0,229,255,.3)] focus:border-cyan-400/60 border"
                    style={{ background: '#0a0a0a', borderColor: 'rgba(255,255,255,.07)' }}
                  />
                </label>
              </div>

              {/* Delete */}
              <button
                type="button"
                onClick={() => onRemove(e.id)}
                className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:bg-red-500/10 hover:text-red-500 hover:shadow-[0_0_10px_rgba(239,68,68,.2)]"
                style={{ color: '#fff' }}
                aria-label="삭제"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
