'use client';

import { useApp } from '@/context/AppContext';

const feeds = [
  { color: '#a3e635', text: '출석 체크 완료', sub: '오늘 12번째 연속 출석', time: '2시간 전' },
  { color: '#f97316', text: '벤치프레스 PR 갱신', sub: '100kg → 102.5kg 달성!', time: '어제' },
  { color: '#22d3ee', text: '주간 챌린지 진행 중', sub: '3/4 완료', time: '2일 전' },
  { color: '#a855f7', text: '랭킹 점수 업데이트', sub: 'GOLD 등급 유지 (63점)', time: '3일 전' },
];

export default function MiniFeed() {
  const { setTab } = useApp();

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <p className="card-label">📌 최근 활동</p>
        <button
          onClick={() => setTab('performance')}
          className="font-bebas text-[9px]"
          style={{ color: 'var(--orange)', letterSpacing: '0.5px' }}
        >
          랭킹 →
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {feeds.map((f, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: f.color }} />
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-medium text-[var(--text-main)]">
                {f.text}
              </p>
              <p className="text-[10px] text-[var(--text-sub)]">{f.sub}</p>
            </div>
            <span className="font-bebas text-[8px] shrink-0 mt-0.5 text-[var(--text-sub)]">
              {f.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
