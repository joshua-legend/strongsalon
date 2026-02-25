'use client';

import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import type { MuscleCondition, MuscleStatus } from '@/types';
import Badge from '@/components/ui/Badge';

const Body = dynamic(
  () => import('@mjcdev/react-body-highlighter').then((mod) => mod.default),
  { ssr: false }
);

const musclesFront: MuscleCondition[] = [
  { id: 'chest', name: '가슴', status: 'worked', detail: '오늘 운동 부위 — 벤치프레스, 인클라인' },
  { id: 'shoulder', name: '어깨', status: 'recover', detail: '회복 완료 — 2일 전 운동' },
  { id: 'bicep', name: '이두', status: 'fatigue', detail: '피로 누적 — 연속 3일 자극' },
  { id: 'abs', name: '복근', status: 'none', detail: '상태 양호' },
  { id: 'quad', name: '대퇴사두', status: 'recover', detail: '회복 완료 — 3일 전 스쿼트' },
];

const musclesBack: MuscleCondition[] = [
  { id: 'trap', name: '승모근', status: 'fatigue', detail: '피로 누적 — 데드리프트 후' },
  { id: 'back', name: '등', status: 'recover', detail: '회복 완료 — 4일 전 운동' },
  { id: 'tricep', name: '삼두', status: 'worked', detail: '오늘 운동 부위 — 딥스, 푸시다운' },
  { id: 'glute', name: '둔근', status: 'none', detail: '상태 양호' },
  { id: 'hamstring', name: '햄스트링', status: 'injury', detail: '⚠️ 부상 주의 — 경미한 긴장감' },
];

const statusToIntensity: Record<MuscleStatus, number> = {
  none: 1,
  injury: 2,
  worked: 3,
  fatigue: 4,
  recover: 5,
};

const statusColor: Record<MuscleStatus, string> = {
  none: '#454d62',
  injury: '#ef4444',
  worked: '#ff5e1f',
  fatigue: '#f5c518',
  recover: '#22c55e',
};

const statusLabel: Record<MuscleStatus, string> = {
  none: '양호',
  injury: '부상주의',
  worked: '오늘운동',
  fatigue: '피로누적',
  recover: '회복완료',
};

const statusBadge: Record<MuscleStatus, 'muted' | 'red' | 'orange' | 'yellow' | 'green'> = {
  none: 'muted',
  injury: 'red',
  worked: 'orange',
  fatigue: 'yellow',
  recover: 'green',
};

type LibrarySlug = 'chest' | 'deltoids' | 'biceps' | 'abs' | 'quadriceps' | 'trapezius' | 'upper-back' | 'lower-back' | 'triceps' | 'gluteal' | 'hamstring';

const idToSlugs: Record<string, LibrarySlug[]> = {
  chest: ['chest'],
  shoulder: ['deltoids'],
  bicep: ['biceps'],
  abs: ['abs'],
  quad: ['quadriceps'],
  trap: ['trapezius'],
  back: ['upper-back', 'lower-back'],
  tricep: ['triceps'],
  glute: ['gluteal'],
  hamstring: ['hamstring'],
};

const slugToId: Record<string, string> = {
  chest: 'chest',
  deltoids: 'shoulder',
  biceps: 'bicep',
  abs: 'abs',
  quadriceps: 'quad',
  trapezius: 'trap',
  'upper-back': 'back',
  'lower-back': 'back',
  triceps: 'tricep',
  gluteal: 'glute',
  hamstring: 'hamstring',
};

function musclesToBodyData(muscles: MuscleCondition[]): { slug: LibrarySlug; intensity: number }[] {
  const out: { slug: LibrarySlug; intensity: number }[] = [];
  for (const m of muscles) {
    const slugs = idToSlugs[m.id];
    if (!slugs) continue;
    const intensity = statusToIntensity[m.status];
    for (const slug of slugs) {
      out.push({ slug, intensity });
    }
  }
  return out;
}

function findMuscleBySlug(slug: string, view: 'front' | 'back'): MuscleCondition | null {
  const id = slugToId[slug];
  if (!id) return null;
  const list = view === 'front' ? musclesFront : musclesBack;
  return list.find((m) => m.id === id) ?? null;
}

export default function BodyMap() {
  const [view, setView] = useState<'front' | 'back'>('front');
  const [selected, setSelected] = useState<MuscleCondition | null>(null);
  const muscles = view === 'front' ? musclesFront : musclesBack;

  const bodyData = useMemo(() => musclesToBodyData(muscles), [view]);

  const colors = useMemo(
    () => [statusColor.none, statusColor.injury, statusColor.worked, statusColor.fatigue, statusColor.recover],
    []
  );

  const handleBodyPartClick = (b: { slug?: string }, _side?: 'left' | 'right') => {
    if (!b.slug) return;
    const muscle = findMuscleBySlug(b.slug, view);
    setSelected(muscle ?? null);
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <p className="card-label">🧍 신체 컨디션 맵</p>
        <div className="flex gap-1">
          <button
            onClick={() => {
              setView('front');
              setSelected(null);
            }}
            className="px-3 py-1 rounded-full text-[10px] font-medium transition-colors"
            style={{
              background: view === 'front' ? 'rgba(255,94,31,.12)' : 'var(--s2)',
              color: view === 'front' ? 'var(--orange)' : 'var(--muted)',
              border: `1px solid ${view === 'front' ? 'rgba(255,94,31,.3)' : 'var(--border)'}`,
            }}
          >
            앞면
          </button>
          <button
            onClick={() => {
              setView('back');
              setSelected(null);
            }}
            className="px-3 py-1 rounded-full text-[10px] font-medium transition-colors"
            style={{
              background: view === 'back' ? 'rgba(255,94,31,.12)' : 'var(--s2)',
              color: view === 'back' ? 'var(--orange)' : 'var(--muted)',
              border: `1px solid ${view === 'back' ? 'rgba(255,94,31,.3)' : 'var(--border)'}`,
            }}
          >
            뒷면
          </button>
        </div>
      </div>

      <div className="flex justify-center mb-4 min-h-[240px] items-center">
        <Body
          data={bodyData}
          colors={colors}
          side={view}
          gender="male"
          scale={1.15}
          border="rgba(255,255,255,.13)"
          onBodyPartClick={handleBodyPartClick}
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-3 justify-center">
        {(['injury', 'worked', 'fatigue', 'recover'] as MuscleStatus[]).map((s) => (
          <div key={s} className="flex items-center gap-1">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: statusColor[s] }}
            />
            <span className="font-space text-[8px]" style={{ color: 'var(--muted2)' }}>
              {statusLabel[s]}
            </span>
          </div>
        ))}
      </div>

      {selected && (
        <div
          className="rounded-xl p-3 mt-2 transition-all duration-200"
          style={{
            background: 'var(--s2)',
            border: `1px solid ${statusColor[selected.status]}33`,
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[13px] font-medium" style={{ color: 'var(--text)' }}>
              {selected.name}
            </span>
            <Badge variant={statusBadge[selected.status]}>{statusLabel[selected.status]}</Badge>
          </div>
          <p className="text-[11px]" style={{ color: 'var(--muted2)' }}>
            {selected.detail}
          </p>
        </div>
      )}
    </div>
  );
}
