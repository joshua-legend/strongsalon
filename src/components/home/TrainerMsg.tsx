'use client';

import { useUser } from '@/context/UserContext';

export default function TrainerMsg() {
  const { user } = useUser();
  return (
    <div className="card">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold bg-orange-500/15 text-orange-500 border border-orange-500/30">
          이
        </div>
        <div>
          <p className="text-[12px] font-medium text-[var(--text-main)]">
            {user?.trainerName ?? ""} 트레이너
          </p>
          <p className="font-bebas text-[8px] text-[var(--text-sub)]">오늘 메시지</p>
        </div>
      </div>
      <p className="text-[12px] leading-relaxed text-[var(--text-sub)]">
        "민준씨, 오늘 벤치프레스 102.5kg 도전해봅시다! 지난주 100kg 6회 성공했으니 충분히 가능합니다. 폼 유지에 집중하세요 💪"
      </p>
    </div>
  );
}
