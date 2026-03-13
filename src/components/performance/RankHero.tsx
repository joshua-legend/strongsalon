'use client';

import { useUser } from '@/context/UserContext';
import { calcTotalScore, calcStrengthScore, calcBodyScore, calcCardioScore, getGrade } from '@/utils/scoring';
import Badge from '@/components/ui/Badge';
import RadarChart from './RadarChart';

export default function RankHero() {
  const { user } = useUser();
  const total = user ? calcTotalScore(user) : 0;
  const strength = user ? calcStrengthScore(user) : 0;
  const body = user ? calcBodyScore(user) : 0;
  const cardio = user ? calcCardioScore(user) : 0;
  const grade = getGrade(total);

  return (
    <div
      className="rounded-2xl p-5 relative overflow-hidden transition-colors duration-300"
      style={{
        background: 'var(--challenge-rank-bg)',
        border: '1px solid var(--challenge-rank-border)',
      }}
    >
      <div className="flex flex-col items-center text-center mb-4">
        <Badge variant={grade === 'GOLD' ? 'yellow' : 'purple'} className="mb-3">
          🥇 {grade}
        </Badge>

        <p
          className="font-bebas text-[72px] leading-none bg-gradient-to-r from-purple-500 to-orange-500 bg-clip-text text-transparent"
        >
          {total}
        </p>
        <p className="font-bebas text-[9px] mt-1" style={{ color: "var(--text-sub)" }}>
          / 100
        </p>

        <p className="text-[11px] mt-2" style={{ color: "var(--text-sub)" }}>
          전국 일반인 기준 <span className="text-orange-500">상위 37%</span>
        </p>
      </div>

      <RadarChart strength={strength} body={body} cardio={cardio} />
    </div>
  );
}
