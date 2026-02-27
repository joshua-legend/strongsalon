'use client';

import { member } from '@/data/member';
import { calcTotalScore, calcStrengthScore, calcBodyScore, calcCardioScore, getGrade } from '@/utils/scoring';
import Badge from '@/components/ui/Badge';
import RadarChart from './RadarChart';

export default function RankHero() {
  const total = calcTotalScore(member);
  const strength = calcStrengthScore(member);
  const body = calcBodyScore(member);
  const cardio = calcCardioScore(member);
  const grade = getGrade(total);

  return (
    <div
      className="rounded-2xl p-5 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(168,85,247,.12), rgba(255,94,31,.08))',
        border: '1px solid rgba(168,85,247,.2)',
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
        <p className="font-bebas text-[9px] mt-1 text-neutral-400">
          / 100
        </p>

        <p className="text-[11px] mt-2 text-neutral-400">
          전국 일반인 기준 <span className="text-orange-500">상위 37%</span>
        </p>
      </div>

      <RadarChart strength={strength} body={body} cardio={cardio} />
    </div>
  );
}
