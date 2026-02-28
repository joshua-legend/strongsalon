"use client";

import { Flame, CheckCircle2 } from "lucide-react";
import { WEEK_DAYS } from "@/config/targetConfigs";

interface WeeklyStreakCardProps {
  weekStreak: boolean[];
  todayIdx: number;
}

export default function WeeklyStreakCard({ weekStreak, todayIdx }: WeeklyStreakCardProps) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Flame className="w-4 h-4 text-orange-500" fill="currentColor" />
        <span className="font-bebas text-[14px] text-neutral-400 tracking-wider uppercase">이번 주 출석</span>
      </div>
      <div className="flex justify-between gap-1">
        {WEEK_DAYS.map((day, idx) => {
          const checked = weekStreak[idx];
          const isToday = idx === todayIdx;
          return (
            <div key={idx} className="flex flex-col items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  checked
                    ? "bg-lime-400 text-black shadow-[0_0_12px_rgba(204,255,0,0.4)]"
                    : isToday
                    ? "bg-neutral-800 border-2 border-dashed border-lime-400/50 text-neutral-400"
                    : "bg-neutral-950 border border-neutral-800 text-neutral-600"
                }`}
              >
                {checked ? <CheckCircle2 className="w-5 h-5" /> : <span className="font-bebas text-lg">{day}</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
