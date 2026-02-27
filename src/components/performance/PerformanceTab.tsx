'use client';

import { useApp } from '@/context/AppContext';
import { member } from '@/data/member';
import { calcStrengthScore, calcBodyScore, calcCardioScore } from '@/utils/scoring';
import RankHero from './RankHero';
import SubTabs from './SubTabs';
import InbodySummary from './InbodySummary';
import StrengthGrade from './StrengthGrade';
import CardioRecords from './CardioRecords';
import GradeLegend from './GradeLegend';

function AIGuide() {
  const tips = [
    { icon: '🏋️', area: '근력', tip: '벤치 +7.5kg → 근력 점수 +4점', color: 'text-cyan-400' },
    { icon: '🧬', area: '체성분', tip: '체지방률 1% 감소 → 체성분 점수 +3점', color: 'text-lime-400' },
    { icon: '🏃', area: '체력', tip: '5km 런 1분 단축 → 체력 점수 +5점', color: 'text-orange-500' },
  ];

  return (
    <div className="card">
      <p className="card-label mb-3">💡 AI 개선 가이드</p>
      <div className="flex flex-col gap-3">
        {tips.map((t, i) => (
          <div
            key={i}
            className="rounded-xl p-3 flex items-start gap-3 bg-neutral-900 border border-neutral-800"
          >
            <span className="text-[18px]">{t.icon}</span>
            <div>
              <p className={`text-[11px] font-medium mb-0.5 ${t.color}`}>{t.area}</p>
              <p className="text-[11px] text-neutral-400">{t.tip}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PerformanceTab() {
  const { subTab } = useApp();
  const strengthScore = calcStrengthScore(member);
  const bodyScore = calcBodyScore(member);
  const cardioScore = calcCardioScore(member);

  const scoreLabels: Record<string, { score: number; pct: number }> = {
    body: { score: bodyScore, pct: 38 },
    strength: { score: strengthScore, pct: 45 },
    cardio: { score: cardioScore, pct: 42 },
  };

  const current = scoreLabels[subTab] ?? scoreLabels.body;

  return (
    <div className="px-4 py-4 flex flex-col gap-4">
      <div className="fade-up"><RankHero /></div>
      <div className="fade-up fade-in-1"><SubTabs /></div>

      <div className="fade-up fade-in-2">
        <p className="font-bebas text-[9px] mb-2 text-neutral-400">
          {subTab === 'body' && `🧬 체성분 점수 ${current.score}점 · 상위 ${current.pct}%`}
          {subTab === 'strength' && `🏋️ 근력 점수 ${current.score}점 · 상위 ${current.pct}%`}
          {subTab === 'cardio' && `🏃 체력 점수 ${current.score}점 · 상위 ${current.pct}%`}
        </p>
        {subTab === 'body' && <InbodySummary />}
        {subTab === 'strength' && <StrengthGrade />}
        {subTab === 'cardio' && <CardioRecords />}
      </div>

      <div className="fade-up fade-in-3"><GradeLegend /></div>
      <div className="fade-up fade-in-4"><AIGuide /></div>
      <div className="h-4" />
    </div>
  );
}
