'use client';

import type { Exercise } from '@/types';
import SVGIllust from '@/components/ui/SVGIllust';

interface WorkoutListProps {
  exercises: Exercise[];
}

export default function WorkoutList({ exercises }: WorkoutListProps) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: 'var(--og-s1, #220c00)', border: '1px solid var(--border)' }}
    >
      <div className="px-4 pt-4 pb-2">
        <p className="font-space text-[9px] tracking-[1.5px] uppercase" style={{ color: 'var(--text3, var(--muted))' }}>
          🏋️ 오늘의 운동
        </p>
      </div>

      {exercises.map((ex, i) => (
        <div
          key={ex.id}
          className="flex items-center gap-3 px-4 py-3 relative"
          style={{ borderTop: i > 0 ? '1px solid var(--border)' : undefined }}
        >
          <div
            className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r"
            style={{ background: 'var(--og, var(--orange))' }}
          />

          <SVGIllust type={ex.svgIllust} size={56} />

          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium mb-0.5" style={{ color: 'var(--text)' }}>
              {ex.name}
            </p>
            <p className="text-[10px]" style={{ color: 'var(--text2, var(--muted2))' }}>
              {ex.sets.length}세트 · {ex.intensity}
            </p>
          </div>

          <span className="font-bebas text-[24px]" style={{ color: 'var(--og, var(--orange))', opacity: 0.3 }}>
            {String(i + 1).padStart(2, '0')}
          </span>
        </div>
      ))}
    </div>
  );
}
