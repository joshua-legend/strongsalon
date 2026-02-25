'use client';

import RankHero from './RankHero';
import GradeLegend from './GradeLegend';
import RankCards from './RankCards';

export default function RankingTab() {
  return (
    <div className="px-4 py-4 flex flex-col gap-4">
      <div className="fade-up"><RankHero /></div>
      <div className="fade-up fade-in-1"><GradeLegend /></div>
      <div className="fade-up fade-in-2"><RankCards /></div>
      <div className="fade-up fade-in-3"><AIGuide /></div>
      <div className="h-4" />
    </div>
  );
}

function AIGuide() {
  const tips = [
    { icon: '🏋️', area: '근력', tip: '벤치 +7.5kg → 근력 점수 +4점', color: 'var(--blue)' },
    { icon: '🧬', area: '체성분', tip: '체지방률 1% 감소 → 체성분 점수 +3점', color: 'var(--green)' },
    { icon: '🏃', area: '체력', tip: '5km 런 1분 단축 → 체력 점수 +5점', color: 'var(--orange)' },
  ];

  return (
    <div className="card">
      <p className="card-label mb-3">💡 AI 개선 가이드</p>
      <div className="flex flex-col gap-3">
        {tips.map((t, i) => (
          <div
            key={i}
            className="rounded-xl p-3 flex items-start gap-3"
            style={{ background: 'var(--s2)', border: '1px solid var(--border)' }}
          >
            <span className="text-[18px]">{t.icon}</span>
            <div>
              <p className="text-[11px] font-medium mb-0.5" style={{ color: t.color }}>{t.area}</p>
              <p className="text-[11px]" style={{ color: 'var(--muted2)' }}>{t.tip}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
