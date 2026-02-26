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

export default function CardioArea({
  entries,
  onAdd,
  onUpdate,
  onRemove,
}: CardioAreaProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-0.5">
        <div>
          <h3 className="text-xs font-semibold" style={{ color: 'var(--text)' }}>
            유산소
          </h3>
          <p className="text-[10px] mt-0.5" style={{ color: 'var(--text2)' }}>
            거리(km) · 시간(분) 입력
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(Object.keys(CARDIO_META) as CardioType[]).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => onAdd(type)}
              className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg border text-[11px] font-medium transition-all"
              style={{
                borderColor: 'var(--border)',
                background: 'var(--s2)',
                color: 'var(--text)',
              }}
            >
              <span>{CARDIO_META[type].emoji}</span>
              <span>+ {CARDIO_META[type].label}</span>
            </button>
          ))}
        </div>
      </div>

      {entries.length > 0 && (
        <div className="flex flex-col gap-2">
          {entries.map((e) => (
            <div
              key={e.id}
              className="flex flex-wrap items-center gap-2 py-2.5 px-3 rounded-xl border"
              style={{
                background: 'var(--s1)',
                borderColor: 'var(--border)',
              }}
            >
              <div
                className="flex items-center gap-1.5 text-[12px] font-medium shrink-0"
                style={{ color: 'var(--text)' }}
              >
                <span>{CARDIO_META[e.type].emoji}</span>
                <span>{CARDIO_META[e.type].label}</span>
              </div>
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <label className="flex items-center gap-1.5 text-[11px]" style={{ color: 'var(--text2)' }}>
                  <span>km</span>
                  <input
                    type="number"
                    min={0}
                    step={0.1}
                    value={e.distanceKm || ''}
                    onChange={(ev) =>
                      onUpdate(e.id, {
                        distanceKm: parseFloat(ev.target.value) || 0,
                      })
                    }
                    className="w-16 rounded border py-1.5 px-2 text-[12px] outline-none focus:border-[var(--blue)]"
                    style={{
                      background: 'var(--s2)',
                      borderColor: 'var(--border)',
                      color: 'var(--text)',
                    }}
                  />
                </label>
                <label className="flex items-center gap-1.5 text-[11px]" style={{ color: 'var(--text2)' }}>
                  <span>분</span>
                  <input
                    type="number"
                    min={0}
                    step={1}
                    value={e.timeMinutes || ''}
                    onChange={(ev) =>
                      onUpdate(e.id, {
                        timeMinutes: parseInt(ev.target.value, 10) || 0,
                      })
                    }
                    className="w-14 rounded border py-1.5 px-2 text-[12px] outline-none focus:border-[var(--blue)]"
                    style={{
                      background: 'var(--s2)',
                      borderColor: 'var(--border)',
                      color: 'var(--text)',
                    }}
                  />
                </label>
              </div>
              <button
                type="button"
                onClick={() => onRemove(e.id)}
                className="shrink-0 p-1.5 rounded-lg transition-opacity hover:opacity-80"
                style={{ background: 'var(--s2)', color: 'var(--muted2)' }}
                aria-label="삭제"
              >
                🗑
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
