'use client';

import type { WorkoutMode } from '@/types';
import type { TrainerProg } from '@/types';
import type { FreeExercise } from '@/types';

interface VolCardProps {
  mode: WorkoutMode;
  trainerProg: TrainerProg;
  freeExercises: Record<string, FreeExercise>;
  prBadge: { name: string; diff: number } | null;
}

export default function VolCard({
  mode,
  trainerProg,
  freeExercises,
  prBadge,
}: VolCardProps) {
  let total = 0;
  const items: { name: string; vol: number }[] = [];

  if (mode === 'trainer') {
    trainerProg.exercises.forEach((ex) => {
      let v = 0;
      ex.sets.forEach((s) => {
        v += s.weight * s.reps;
      });
      total += v;
      if (v > 0) items.push({ name: ex.name, vol: v });
    });
  } else {
    Object.values(freeExercises).forEach((ex) => {
      let v = 0;
      ex.sets.forEach((s) => {
        v += s.weight * s.reps;
      });
      total += v;
      if (v > 0) items.push({ name: ex.name, vol: v });
    });
  }

  const maxVol = items.length ? Math.max(...items.map((i) => i.vol)) : 0;
  const grad =
    mode === 'trainer'
      ? 'linear-gradient(90deg,var(--purple),var(--blue))'
      : 'linear-gradient(90deg,var(--orange),var(--og2))';

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{ background: 'var(--s1)', borderColor: 'var(--border)' }}
    >
      <div className="py-3 px-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <div
          className="text-[8px] font-[family-name:var(--font-space)]"
          style={{ color: 'var(--muted2)', letterSpacing: '2px' }}
        >
          // 오늘 총 볼륨
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-baseline gap-1.5 mb-3.5">
          <div
            className="font-[family-name:var(--font-bebas)] text-[56px] leading-none transition-colors"
            style={{ color: mode === 'trainer' ? 'var(--purple)' : 'var(--orange)' }}
          >
            {total.toLocaleString()}
          </div>
          <div className="text-[13px] font-[family-name:var(--font-space)]" style={{ color: 'var(--muted2)' }}>
            kg
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {items.length === 0 ? (
            <div
              className="text-[10px] font-[family-name:var(--font-space)] text-center py-2.5 leading-relaxed"
              style={{ color: 'var(--muted2)' }}
            >
              세트를 입력하면
              <br />
              자동 계산됩니다
            </div>
          ) : (
            items.map((i) => (
              <div key={i.name} className="flex items-center gap-2">
                <div
                  className="text-[10px] w-16 overflow-hidden text-ellipsis whitespace-nowrap flex-shrink-0"
                  style={{ color: 'var(--muted2)' }}
                >
                  {i.name}
                </div>
                <div className="flex-1 h-1.5 bg-[var(--s3)] rounded overflow-hidden">
                  <div
                    className="h-full rounded transition-[width] duration-300"
                    style={{
                      width: `${maxVol ? (i.vol / maxVol) * 100 : 0}%`,
                      background: grad,
                    }}
                  />
                </div>
                <div
                  className="text-[9px] font-[family-name:var(--font-space)] w-12 text-right flex-shrink-0"
                  style={{ color: 'var(--muted2)' }}
                >
                  {i.vol.toLocaleString()}kg
                </div>
              </div>
            ))
          )}
        </div>
        {prBadge && (
          <div
            className="flex items-center gap-2.5 py-2.5 px-3.5 rounded-lg mt-3 border"
            style={{
              background: 'rgba(34,197,94,.07)',
              borderColor: 'rgba(34,197,94,.18)',
            }}
          >
            <span className="text-[22px]">🏅</span>
            <div>
              <div className="text-xs font-bold" style={{ color: 'var(--green)' }}>
                신기록 달성!
              </div>
              <div className="text-[9px] font-[family-name:var(--font-space)] mt-0.5" style={{ color: 'var(--muted2)' }}>
                {prBadge.name} +{prBadge.diff.toFixed(1)}kg 🎉
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
