'use client';

import { useUser } from '@/context/UserContext';
import ProgressBar from '@/components/ui/ProgressBar';

export default function LevelMini() {
  const { user } = useUser();
  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-[24px]">🥇</span>
        <div>
          <p className="font-bebas text-[22px] leading-none text-yellow-500">
            {user?.level ?? "-"}
          </p>
          <p className="text-[10px] mt-0.5 text-[var(--text-sub)]">
            3대 합계 {user?.liftTotal ?? 0}kg · 상위 40%
          </p>
        </div>
      </div>
      <ProgressBar value={360} max={405} gradient="linear-gradient(90deg, #eab308, #f97316)" />
      <p className="text-[9px] mt-2 text-[var(--text-sub)]">
        ADVANCED까지 +45kg · 예상 2~3개월
      </p>
    </div>
  );
}
