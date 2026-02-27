"use client";

import { Check, Circle, CircleDot } from "lucide-react";

const days = ["월", "화", "수", "목", "금", "토", "일"];

type DotStatus = "done" | "today" | "rest" | "future";

function getDayStatus(idx: number): DotStatus {
  const today = new Date().getDay();
  const mondayBased = today === 0 ? 6 : today - 1;
  if (idx < mondayBased) {
    return idx === 5 ? "rest" : "done";
  }
  if (idx === mondayBased) return "today";
  return "future";
}

export default function WeekDots() {
  return (
    <div className="card">
      <p className="card-label mb-3">📅 이번 주 출석</p>
      <div className="flex gap-2">
        {days.map((d, i) => {
          const status = getDayStatus(i);
          return (
            <div key={d} className="flex-1 flex flex-col items-center gap-2">
              <span className="font-bebas text-[9px] font-medium text-neutral-400">
                {d}
              </span>
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors
                  ${status === "done" ? "bg-lime-400/15 border-lime-400/35 border-[1.5px]" : ""}
                  ${status === "today" ? "bg-lime-400/15 border-2 border-lime-400 shadow-[0_0_0_2px_rgba(163,230,53,.15)]" : ""}
                  ${status === "rest" ? "bg-neutral-900 border border-neutral-800" : ""}
                  ${status === "future" ? "bg-neutral-900 border border-neutral-800 opacity-50" : ""}
                `}
              >
                {status === "done" && (
                  <Check size={18} strokeWidth={2.5} className="shrink-0 text-lime-400" />
                )}
                {status === "today" && (
                  <CircleDot
                    size={20}
                    strokeWidth={2}
                    className="shrink-0 animate-pulse text-lime-400"
                  />
                )}
                {(status === "rest" || status === "future") && (
                  <Circle size={16} strokeWidth={1.5} className="shrink-0 text-neutral-400" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
