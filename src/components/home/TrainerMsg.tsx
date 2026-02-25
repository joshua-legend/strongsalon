'use client';

import { member } from '@/data/member';

export default function TrainerMsg() {
  return (
    <div className="card">
      <div className="flex items-center gap-2.5 mb-3">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold"
          style={{ background: 'rgba(255,94,31,.15)', color: 'var(--orange)', border: '1px solid rgba(255,94,31,.3)' }}
        >
          이
        </div>
        <div>
          <p className="text-[12px] font-medium" style={{ color: 'var(--text)' }}>
            {member.trainerName} 트레이너
          </p>
          <p className="font-space text-[8px]" style={{ color: 'var(--muted)' }}>오늘 메시지</p>
        </div>
      </div>
      <p className="text-[12px] leading-relaxed" style={{ color: 'var(--muted2)' }}>
        "민준씨, 오늘 벤치프레스 102.5kg 도전해봅시다! 지난주 100kg 6회 성공했으니 충분히 가능합니다. 폼 유지에 집중하세요 💪"
      </p>
    </div>
  );
}
