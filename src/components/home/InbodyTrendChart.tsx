"use client";

import type { InbodyRecord } from "@/types/workout";

interface InbodyTrendChartProps {
  records: InbodyRecord[];
  embedded?: boolean;
}

export function InbodyTrendChart({ records, embedded }: InbodyTrendChartProps) {
  if (records.length < 2) return null;
  const reversed = [...records].reverse();
  const weights = reversed.map((r) => r.weight);
  const muscles = reversed.map((r) => r.muscleMass);
  const fats = reversed.map((r) => r.fatMass);
  const minVal = Math.min(...weights, ...muscles, ...fats);
  const maxVal = Math.max(...weights, ...muscles, ...fats);
  const range = maxVal - minVal || 1;
  const w = 280;
  const h = 120;
  const pad = 20;
  const div = reversed.length - 1 || 1;

  const toX = (i: number) => pad + (i / div) * (w - 2 * pad);
  const toY = (v: number) => h - pad - ((v - minVal) / range) * (h - 2 * pad);

  const weightPath = weights.map((v, i) => `${i === 0 ? "M" : "L"} ${toX(i)} ${toY(v)}`).join(" ");
  const musclePath = muscles.map((v, i) => `${i === 0 ? "M" : "L"} ${toX(i)} ${toY(v)}`).join(" ");
  const fatPath = fats.map((v, i) => `${i === 0 ? "M" : "L"} ${toX(i)} ${toY(v)}`).join(" ");

  const content = (
    <>
      <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-3">
        추이 (체중 · 근육 · 지방)
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-32">
        <path d={weightPath} fill="none" stroke="rgb(163,230,53)" strokeWidth="2" />
        <path d={musclePath} fill="none" stroke="rgb(96,165,250)" strokeWidth="2" />
        <path d={fatPath} fill="none" stroke="rgb(249,115,22)" strokeWidth="2" />
      </svg>
      <div className="flex gap-4 mt-2 text-[10px]">
        <span className="text-lime-400">— 체중</span>
        <span className="text-blue-400">— 근육</span>
        <span className="text-orange-400">— 지방</span>
      </div>
    </>
  );

  if (embedded) {
    return <div>{content}</div>;
  }

  return (
    <div className="rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 p-5">
      {content}
    </div>
  );
}
