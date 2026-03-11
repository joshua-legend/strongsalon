'use client';

import { useMemo } from 'react';
import { workoutHistory } from '@/data/workoutHistory';
import type { WorkoutConditionValue } from '@/data/workoutHistory';
import { getUserWorkoutRecords } from '@/context/useWorkoutRecordStorage';

const CONDITION_META: { value: WorkoutConditionValue; emoji: string; label: string; color: string; score: number }[] = [
  { value: '불타', emoji: '🔥', label: '불타', color: '#f97316', score: 5 },
  { value: '최고', emoji: '💪', label: '최고', color: '#60a5fa', score: 4 },
  { value: '좋음', emoji: '😊', label: '좋음', color: '#a3e635', score: 3 },
  { value: '나쁨', emoji: '😕', label: '나쁨', color: '#eab308', score: 2 },
  { value: '최악', emoji: '😫', label: '최악', color: '#ef4444', score: 1 },
];

const R = 52;
const CIRC = 2 * Math.PI * R;

export default function ConditionDonut() {
  const { data, avg, total } = useMemo(() => {
    const counts: Record<string, number> = {};
    CONDITION_META.forEach((c) => { counts[c.value] = 0; });

    const allRecords = [...workoutHistory, ...getUserWorkoutRecords()];
    const seen = new Set<string>();
    for (const r of allRecords) {
      if (seen.has(r.date)) continue;
      seen.add(r.date);
      if (r.condition) {
        counts[r.condition] = (counts[r.condition] || 0) + 1;
      }
    }

    const total = Object.values(counts).reduce((a, b) => a + b, 0);

    const data = CONDITION_META.map((c) => ({
      ...c,
      count: counts[c.value] || 0,
      pct: total > 0 ? Math.round(((counts[c.value] || 0) / total) * 100) : 0,
    })).filter((d) => d.count > 0);

    let avgScore = 0;
    if (total > 0) {
      const scoreSum = CONDITION_META.reduce((sum, c) => sum + (counts[c.value] || 0) * c.score, 0);
      avgScore = Math.round((scoreSum / total) * 10) / 10;
    }

    return { data, avg: avgScore, total };
  }, []);

  if (total === 0) {
    return (
      <div className="card">
        <p className="card-label mb-4">😊 컨디션 분포</p>
        <div className="flex flex-col items-center justify-center py-8 gap-3">
          <div className="relative shrink-0">
            <svg width="130" height="130" viewBox="0 0 130 130">
              <circle
                cx="65" cy="65" r={R}
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="12"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[24px] leading-none">📊</span>
            </div>
          </div>
          <div className="text-center">
            <p className="font-bebas text-[12px] text-neutral-400">아직 컨디션 데이터가 없습니다</p>
            <p className="font-bebas text-[10px] text-neutral-600 mt-1">운동 탭에서 운동을 완료하면 컨디션이 기록됩니다</p>
          </div>
        </div>
      </div>
    );
  }

  let offset = 0;
  const avgColor = avg >= 4 ? '#f97316' : avg >= 3 ? '#a3e635' : avg >= 2 ? '#eab308' : '#ef4444';

  return (
    <div className="card">
      <p className="card-label mb-4">😊 컨디션 분포</p>
      <div className="flex items-center gap-5">
        <div className="relative shrink-0">
          <svg width="130" height="130" viewBox="0 0 130 130">
            {data.map((d, i) => {
              const dash = (d.pct / 100) * CIRC;
              const gap = CIRC - dash;
              const currentOffset = offset;
              offset += dash;
              return (
                <circle
                  key={i}
                  cx="65" cy="65" r={R}
                  fill="none"
                  stroke={d.color}
                  strokeWidth="12"
                  strokeDasharray={`${dash} ${gap}`}
                  strokeDashoffset={-currentOffset}
                  strokeLinecap="round"
                  transform="rotate(-90 65 65)"
                  opacity="0.85"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-bebas text-[28px] leading-none" style={{ color: avgColor }}>{avg}</span>
            <span className="font-bebas text-[8px] text-neutral-400">평균</span>
          </div>
        </div>

        <div className="flex flex-col gap-2.5 flex-1">
          {data.map((d, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-[11px] w-16 shrink-0">{d.emoji} {d.label}</span>
              <div className="flex-1 h-[5px] rounded-full overflow-hidden bg-neutral-950/50">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${d.pct}%`, background: d.color }}
                />
              </div>
              <span className="font-bebas text-[9px] w-8 text-right text-neutral-500">
                {d.pct}%
              </span>
            </div>
          ))}
          <span className="font-bebas text-[8px] text-neutral-600 mt-0.5">
            총 {total}회 기록
          </span>
        </div>
      </div>
    </div>
  );
}
