"use client";

import { Flame, CheckCircle2 } from "lucide-react";
import { WEEK_DAYS } from "@/config/targetConfigs";

interface WeeklyStreakCardProps {
  weekStreak: boolean[];
  todayIdx: number;
}

export default function WeeklyStreakCard({ weekStreak, todayIdx }: WeeklyStreakCardProps) {
  return (
    <div
      className="rounded-2xl p-5 border"
      style={{ background: "#050505", borderColor: "rgba(255,255,255,.06)" }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Flame
          className="w-4 h-4"
          fill="currentColor"
          style={{
            color: "#ff5500",
            filter: "drop-shadow(0 0 6px rgba(255,85,0,.7))",
          }}
        />
        <span
          className="font-bebas text-[14px] tracking-wider uppercase text-white"
        >
          이번 주 출석
        </span>
      </div>

      <div className="flex justify-between gap-1">
        {WEEK_DAYS.map((day, idx) => {
          const checked = weekStreak[idx];
          const isToday = idx === todayIdx;

          return (
            <div key={idx} className="flex flex-col items-center gap-2">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
                style={
                  checked
                    ? {
                        background: "#a3e635",
                        color: "#000",
                        boxShadow:
                          "0 0 14px rgba(163,230,53,.55), 0 0 28px rgba(163,230,53,.2)",
                      }
                    : isToday
                    ? {
                        background: "#0a0a0a",
                        border: "2px dashed rgba(163,230,53,.4)",
                        color: "#fff",
                      }
                    : {
                        background: "#0a0a0a",
                        border: "1px solid rgba(255,255,255,.06)",
                        color: "#fff",
                      }
                }
              >
                {checked ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <span className="font-bebas text-lg">{day}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
