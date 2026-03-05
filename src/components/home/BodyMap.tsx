'use client';

import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import type { MuscleCondition, MuscleStatus } from '@/types';
import Badge from '@/components/ui/Badge';
import {
  musclesFront, musclesBack,
  statusColor, statusLabel, statusBadge,
  musclesToBodyData, findMuscleBySlug,
} from './bodyMapData';

const Body = dynamic(
  () => import('@mjcdev/react-body-highlighter').then((mod) => mod.default),
  { ssr: false }
);

export default function BodyMap() {
  const [view, setView] = useState<'front' | 'back'>('front');
  const [selected, setSelected] = useState<MuscleCondition | null>(null);
  const muscles = view === 'front' ? musclesFront : musclesBack;

  const bodyData = useMemo(() => musclesToBodyData(muscles), [view]);
  const colors = useMemo(() => [
    statusColor.none, statusColor.recover, statusColor.worked,
    statusColor.fatigue, statusColor.injury,
  ], []);

  const handleBodyPartClick = (b: { slug?: string }) => {
    if (!b.slug) return;
    setSelected(findMuscleBySlug(b.slug, view) ?? null);
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <p className="card-label">🧍 신체 컨디션 맵</p>
        <div className="flex gap-1">
          {(['front', 'back'] as const).map((v) => (
            <button key={v} onClick={() => { setView(v); setSelected(null); }}
              className={`px-3 py-1 rounded-full text-[10px] font-medium transition-colors ${
                view === v
                  ? "bg-lime-400/15 text-lime-400 border border-lime-400/30"
                  : "bg-neutral-900 text-neutral-400 border border-neutral-800"
              }`}>
              {v === 'front' ? '앞면' : '뒷면'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-center mb-4 min-h-[240px] items-center">
        <Body data={bodyData} colors={colors} side={view} gender="male" scale={1.15}
          border="rgba(255,255,255,.13)" onBodyPartClick={handleBodyPartClick} />
      </div>

      <div className="flex flex-wrap gap-2 mb-3 justify-center">
        {(['none', 'recover', 'worked', 'fatigue', 'injury'] as MuscleStatus[]).map((s) => (
          <div key={s} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ background: statusColor[s] }} />
            <span className="font-bebas text-[8px] text-neutral-400">{statusLabel[s]}</span>
          </div>
        ))}
      </div>

      {selected && (
        <div className="rounded-xl p-3 mt-2 transition-all duration-200 bg-neutral-900"
          style={{ border: `1px solid ${statusColor[selected.status]}33` }}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[13px] font-medium text-white">{selected.name}</span>
            <Badge variant={statusBadge[selected.status]}>{statusLabel[selected.status]}</Badge>
          </div>
          <p className="text-[11px] text-neutral-400">{selected.detail}</p>
        </div>
      )}
    </div>
  );
}
