'use client';

import { member } from '@/data/member';
import ProgressBar from '@/components/ui/ProgressBar';
import Badge from '@/components/ui/Badge';

const trendData = [
  { month: '9월', bench: 85, squat: 100, dead: 120 },
  { month: '10월', bench: 87.5, squat: 105, dead: 125 },
  { month: '11월', bench: 90, squat: 110, dead: 130 },
  { month: '12월', bench: 92.5, squat: 112.5, dead: 132.5 },
  { month: '1월', bench: 97.5, squat: 117.5, dead: 137.5 },
  { month: '2월', bench: 100, squat: 120, dead: 140 },
];

export default function StrengthGrade() {
  return (
    <div className="flex flex-col gap-4">
      <div
        className="rounded-2xl p-5 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(245,197,24,.1), rgba(255,94,31,.05))',
          border: '1px solid rgba(245,197,24,.2)',
        }}
      >
        <div className="flex items-center gap-3 mb-3">
          <span className="text-[28px]">🥇</span>
          <div>
            <p className="font-bebas text-[30px] leading-none text-yellow-500">
              {member.level}
            </p>
            <p className="text-[11px] text-neutral-400">
              3대 합계 {member.liftTotal}kg
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <span className="font-bebas text-[8px] text-neutral-400">NOVICE</span>
          <div className="flex-1">
            <ProgressBar value={360} max={405} gradient="linear-gradient(90deg, #eab308, #f97316)" height={8} />
          </div>
          <span className="font-bebas text-[8px] text-neutral-400">ADVANCED</span>
        </div>
        <p className="text-[10px] text-center text-neutral-400">
          ADVANCED까지 합계 +45kg 필요
        </p>
      </div>

      <div className="card">
        <p className="card-label mb-4">🏋️ 3대 운동 1RM</p>
        <div className="flex flex-col gap-4">
          {member.lifts.map((lift, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[12px] font-medium text-white">
                  {lift.name}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-bebas text-[18px]" style={{ color: lift.color }}>
                    {lift.weight}<span className="text-[11px] text-neutral-400">kg</span>
                  </span>
                  <Badge variant={lift.grade === 'Intermediate' ? 'yellow' : 'orange'}>
                    {lift.grade}
                  </Badge>
                </div>
              </div>
              <div className="progress-track" style={{ height: 8 }}>
                <div
                  className="progress-fill"
                  style={{
                    width: `${lift.pct}%`,
                    background: lift.color,
                  }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="font-bebas text-[7px] text-neutral-400">0kg</span>
                <span className="font-bebas text-[7px] text-neutral-400">상위 {100 - lift.pct}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <p className="card-label mb-4">📈 6개월 추이</p>
        <StrengthLineChart data={trendData} />
        <div className="flex gap-4 mt-3 justify-center">
          {[
            { label: '벤치', color: '#22d3ee' },
            { label: '스쿼트', color: '#a3e635' },
            { label: '데드', color: '#f97316' },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-1">
              <div className="w-3 h-[2px] rounded-full" style={{ background: l.color }} />
              <span className="font-bebas text-[8px] text-neutral-400">{l.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StrengthLineChart({ data }: { data: typeof trendData }) {
  const W = 300, H = 120;
  const pad = { t: 10, b: 25, l: 5, r: 5 };
  const cw = W - pad.l - pad.r;
  const ch = H - pad.t - pad.b;

  const allVals = data.flatMap(d => [d.bench, d.squat, d.dead]);
  const minV = Math.min(...allVals) - 5;
  const maxV = Math.max(...allVals) + 5;

  const getX = (i: number) => pad.l + (i / (data.length - 1)) * cw;
  const getY = (v: number) => pad.t + ch - ((v - minV) / (maxV - minV)) * ch;

  const makePath = (key: 'bench' | 'squat' | 'dead') =>
    data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d[key])}`).join(' ');

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
      {data.map((d, i) => (
        <text key={i} x={getX(i)} y={H - 5} textAnchor="middle" fill="#a3a3a3" fontSize="8" fontFamily='"Bebas Neue", cursive'>
          {d.month}
        </text>
      ))}
      <path d={makePath('bench')} fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" />
      <path d={makePath('squat')} fill="none" stroke="#a3e635" strokeWidth="1.5" strokeLinecap="round" />
      <path d={makePath('dead')} fill="none" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" />
      {data.map((d, i) => (
        <g key={i}>
          <circle cx={getX(i)} cy={getY(d.bench)} r="2.5" fill="#22d3ee" />
          <circle cx={getX(i)} cy={getY(d.squat)} r="2.5" fill="#a3e635" />
          <circle cx={getX(i)} cy={getY(d.dead)} r="2.5" fill="#f97316" />
        </g>
      ))}
    </svg>
  );
}
