'use client';

import { useWorkout } from '@/context/WorkoutContext';
import CondHero from './CondHero';
import WorkoutList from './WorkoutList';
import CondPicker from './CondPicker';

export default function CondScreen() {
  const { exercises } = useWorkout();

  return (
    <div className="flex flex-col gap-4 pb-8">
      <CondHero />

      <div className="px-4">
        <div
          className="rounded-2xl p-4"
          style={{ background: 'var(--og-s1, #220c00)', border: '1px solid var(--border)' }}
        >
          <div className="flex items-center gap-2.5 mb-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold"
              style={{ background: 'rgba(255,77,0,.15)', color: 'var(--og, var(--orange))', border: '1px solid rgba(255,77,0,.3)' }}
            >
              이
            </div>
            <div>
              <p className="text-[12px] font-medium" style={{ color: 'var(--text)' }}>이준호 트레이너</p>
              <p className="font-space text-[8px]" style={{ color: 'var(--text3, var(--muted))' }}>오늘 메시지</p>
            </div>
          </div>
          <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text2, var(--muted2))' }}>
            "오늘 벤치 102.5kg 도전! 지난주 100kg 6회 성공했으니 충분히 가능합니다. 폼에 집중하세요 💪"
          </p>
        </div>
      </div>

      <div className="px-4">
        <WorkoutList exercises={exercises} />
      </div>

      <div className="px-4">
        <CondPicker />
      </div>
    </div>
  );
}
