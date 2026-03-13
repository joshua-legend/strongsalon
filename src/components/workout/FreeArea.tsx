'use client';

import type { FreeExercise, CardioEntry, CardioType, SetStatus } from '@/types';
import AddExerciseCard from './AddExerciseCard';
import FreeExCard from './FreeExCard';

const CARDIO_META: Record<CardioType, { label: string; emoji: string }> = {
  run: { label: '런닝', emoji: '🏃' },
  cycle: { label: '싸이클', emoji: '🚴' },
  row: { label: '로잉', emoji: '🚣' },
  skierg: { label: '스키에르그', emoji: '⛷️' },
};

interface FreeAreaProps {
  freeExercises: Record<string, FreeExercise>;
  orderedIds: string[];
  cardioEntries: CardioEntry[];
  isWorkoutActive: boolean;
  onUpdateCardio: (id: string, patch: Partial<Pick<CardioEntry, 'distanceKm' | 'timeMinutes'>>) => void;
  onRemoveCardio: (id: string) => void;
  prData: Record<string, number>;
  selectedFavNames: Set<string>;
  onToggleFav: (icon: string, name: string) => void;
  onToggleCardio: (type: 'run' | 'cycle' | 'row' | 'skierg') => void;
  onAddSet: (exId: string) => void;
  onCopyLastSet: (exId: string) => void;
  onDeleteSet: (exId: string, setId: string) => void;
  onSetChange: (exId: string, setId: string, weight: number, reps: number) => void;
  onSetStatusChange: (exId: string, setId: string, status: SetStatus) => void;
  onRemove: (exId: string) => void;
  onCheckPR: (name: string, diff: number) => void;
  onToggleCardioCheck: (id: string) => void;
}

export default function FreeArea({
  freeExercises,
  orderedIds,
  cardioEntries,
  isWorkoutActive,
  onUpdateCardio,
  onRemoveCardio,
  prData,
  selectedFavNames,
  onToggleFav,
  onToggleCardio,
  onAddSet,
  onCopyLastSet,
  onDeleteSet,
  onSetChange,
  onSetStatusChange,
  onRemove,
  onCheckPR,
  onToggleCardioCheck,
}: FreeAreaProps) {
  const totalCount = orderedIds.length + cardioEntries.length;

  return (
    <div className="flex flex-col gap-4">
      <AddExerciseCard
        selectedNames={selectedFavNames}
        onToggleFav={onToggleFav}
        cardioTypes={cardioEntries.map((e) => e.type)}
        onToggleCardio={onToggleCardio}
      />

      {totalCount > 0 && (
        <div
          className="rounded-2xl overflow-hidden relative"
          style={{
            background: '#050505',
            border: '1px solid rgba(163,230,53,.35)',
            boxShadow: '0 0 20px rgba(163,230,53,.12), 0 0 40px rgba(163,230,53,.04)',
          }}
        >
          <div
            className="absolute left-0 top-0 bottom-0 w-1"
            style={{
              background: '#a3e635',
              boxShadow: '0 0 10px rgba(163,230,53,.5), 0 0 20px rgba(163,230,53,.25)',
            }}
          />

          <div
            className="relative pl-5 pr-5 py-3"
            style={{
              background: 'linear-gradient(90deg, rgba(163,230,53,.06) 0%, transparent 100%)',
              borderBottom: '1px solid rgba(255,255,255,.04)',
            }}
          >
            <h3
              className="font-bebas text-[14px] tracking-wider uppercase"
              style={{ color: 'rgba(163,230,53,.9)', textShadow: '0 0 8px rgba(163,230,53,.4)' }}
            >
              내 운동
            </h3>
            <p className="font-bebas text-[10px] mt-0.5 tracking-wider" style={{ color: 'rgba(255,255,255,.5)' }}>
              {totalCount}종목
            </p>
          </div>

          <div className="p-3 pt-2 flex flex-col gap-3">
            {orderedIds.map((id, idx) => {
              const ex = freeExercises[id];
              if (!ex) return null;

              return (
                <FreeExCard
                  key={id}
                  id={id}
                  index={idx}
                  exercise={ex}
                  prWeight={prData[ex.name]}
                  isWorkoutActive={isWorkoutActive}
                  onAddSet={onAddSet}
                  onCopyLastSet={onCopyLastSet}
                  onDeleteSet={onDeleteSet}
                  onSetChange={onSetChange}
                  onSetStatusChange={onSetStatusChange}
                  onRemove={onRemove}
                  onCheckPR={onCheckPR}
                />
              );
            })}
            {cardioEntries.map((e) => {
              const filled = e.distanceKm > 0 && e.timeMinutes > 0;
              return (
                <div
                  key={e.id}
                  className="rounded-2xl border overflow-hidden transition-all"
                  style={{
                    background: e.checked ? 'rgba(0,229,255,.04)' : '#050505',
                    borderColor: e.checked ? 'rgba(0,229,255,.6)' : 'rgba(0,229,255,.4)',
                    boxShadow: e.checked ? '0 0 16px rgba(0,229,255,.25)' : '0 0 12px rgba(0,229,255,.2)',
                  }}
                >
                  <div className="flex flex-wrap items-center gap-2 py-3 px-4">
                    <div
                      className="flex items-center gap-1.5 font-bebas text-[13px] shrink-0 tracking-wider"
                      style={{ color: '#00e5ff', textShadow: '0 0 6px rgba(0,229,255,.5)' }}
                    >
                      <span>{CARDIO_META[e.type].emoji}</span>
                      <span>{CARDIO_META[e.type].label}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <label className="flex items-center gap-1.5 font-bebas text-[10px] tracking-wider" style={{ color: '#fff' }}>
                        <input
                          type="number" min={0} step={0.1} value={e.distanceKm || ''}
                          onChange={(ev) => onUpdateCardio(e.id, { distanceKm: parseFloat(ev.target.value) || 0 })}
                          className="w-16 rounded-xl py-1.5 px-2 font-bebas text-[13px] outline-none text-white transition-all focus:shadow-[0_0_16px_rgba(0,229,255,.3)] focus:border-cyan-400/60 border"
                          style={{ background: '#0a0a0a', borderColor: 'rgba(255,255,255,.07)' }}
                        />
                        <span>km</span>
                      </label>
                      <label className="flex items-center gap-1.5 font-bebas text-[10px] tracking-wider" style={{ color: '#fff' }}>
                        <input
                          type="number" min={0} step={1} value={e.timeMinutes || ''}
                          onChange={(ev) => onUpdateCardio(e.id, { timeMinutes: parseInt(ev.target.value, 10) || 0 })}
                          className="w-14 rounded-xl py-1.5 px-2 font-bebas text-[13px] outline-none text-white transition-all focus:shadow-[0_0_16px_rgba(0,229,255,.3)] focus:border-cyan-400/60 border"
                          style={{ background: '#0a0a0a', borderColor: 'rgba(255,255,255,.07)' }}
                        />
                        <span>분</span>
                      </label>
                    </div>
                    <button type="button" onClick={() => onRemoveCardio(e.id)}
                      className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:bg-red-500/10 hover:text-red-500"
                      style={{ color: '#fff' }} aria-label="삭제">
                      ✕
                    </button>
                  </div>

                  {/* 유산소 완료 체크 - 운동 중 + 값 입력됨 */}
                  {isWorkoutActive && filled && (
                    <div className="px-4 pb-3">
                      <button
                        type="button"
                        onClick={() => onToggleCardioCheck(e.id)}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bebas text-[12px] tracking-wider transition-all active:scale-95"
                        style={e.checked ? {
                          background: 'rgba(0,229,255,.12)',
                          border: '1.5px solid rgba(0,229,255,.7)',
                          color: '#00e5ff',
                          boxShadow: '0 0 12px rgba(0,229,255,.25)',
                        } : {
                          background: 'rgba(255,255,255,.03)',
                          border: '1.5px solid rgba(255,255,255,.1)',
                          color: 'rgba(255,255,255,.5)',
                        }}
                      >
                        <span className="text-[16px]">{e.checked ? '✅' : '⬜'}</span>
                        <span>{e.checked ? '유산소 완료!' : '유산소 완료 체크'}</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
