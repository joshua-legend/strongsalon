"use client";

type TrendPoint = { month: string; weight: number; muscle: number; fat: number };

export function InbodySummaryChart({ data }: { data: TrendPoint[] }) {
  const W = 300;
  const H = 120;
  const pad = { t: 10, b: 25, l: 5, r: 5 };
  const cw = W - pad.l - pad.r;
  const ch = H - pad.t - pad.b;

  const allVals = data.flatMap((d) => [d.weight, d.muscle, d.fat]);
  const minV = Math.min(...allVals) - 2;
  const maxV = Math.max(...allVals) + 2;

  const getX = (i: number) => pad.l + (i / (data.length - 1)) * cw;
  const getY = (v: number) => pad.t + ch - ((v - minV) / (maxV - minV)) * ch;

  const makePath = (key: "weight" | "muscle" | "fat") =>
    data.map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(d[key])}`).join(" ");

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
      {data.map((d, i) => (
        <text key={i} x={getX(i)} y={H - 5} textAnchor="middle" fill="#a3a3a3" fontSize="8"
          fontFamily='"Bebas Neue", cursive'>
          {d.month}
        </text>
      ))}
      <path d={makePath("weight")} fill="none" stroke="#737373" strokeWidth="1.5" strokeLinecap="round" />
      <path d={makePath("muscle")} fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" />
      <path d={makePath("fat")} fill="none" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" />
      {data.map((d, i) => (
        <g key={i}>
          <circle cx={getX(i)} cy={getY(d.weight)} r="2.5" fill="#737373" />
          <circle cx={getX(i)} cy={getY(d.muscle)} r="2.5" fill="#22d3ee" />
          <circle cx={getX(i)} cy={getY(d.fat)} r="2.5" fill="#f97316" />
        </g>
      ))}
    </svg>
  );
}
