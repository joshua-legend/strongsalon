"use client";

import { useState } from "react";
import { CheckCircle2, Flame, Plus, Zap } from "lucide-react";
import { weeklyGoals as initialGoals } from "@/data/weeklyGoals";
import type { WeeklyGoal } from "@/types";
import WeeklyGoalSheet from "./WeeklyGoalSheet";

function calcPct(g: WeeklyGoal): number {
  if (g.targetValue <= 0) return 0;
  return Math.min(100, Math.round((g.currentValue / g.targetValue) * 100));
}

function pctColor(pct: number): string {
  if (pct >= 60)  return "text-lime-400";
  if (pct >= 30)  return "text-orange-500";
  return "text-red-500";
}

function barColor(pct: number): string {
  if (pct >= 60)  return "bg-lime-400";
  if (pct >= 30)  return "bg-orange-500";
  return "bg-red-500";
}

type BadgePart = "CHEST" | "BACK" | "CARDIO";

function badgeColor(part: BadgePart): string {
  if (part === "CHEST") return "bg-lime-400 text-black";
  if (part === "BACK") return "bg-orange-500 text-black";
  return "bg-cyan-400 text-black";
}

function categoryToPart(cat: WeeklyGoal["category"]): BadgePart {
  if (cat === "cardio") return "CARDIO";
  if (cat === "attendance" || cat === "weight") return "BACK";
  return "CHEST";
}

function SkewedBadge({ part, children }: { part: BadgePart; children: React.ReactNode }) {
  return (
    <div
      className={`inline-block px-2.5 py-1 font-bold text-[10px] uppercase italic -skew-x-12 w-max mb-1 tracking-[0.15em] ${badgeColor(part)}`}
      style={{ fontFamily: '"Bebas Neue", "Bebas Neue Fallback", cursive' }}
    >
      <span className="skew-x-12 block tracking-wide">{children}</span>
    </div>
  );
}

const LABEL_EN: Record<string, string> = {
  벤치프레스: "Bench Press",
  런닝: "Running",
  출석: "Attendance",
};

const UNIT_EN: Record<string, string> = {
  reps: "reps",
  km: "km",
  회: "sessions",
};

function GoalCard({ goal, onUpdate }: { goal: WeeklyGoal; onUpdate: (id: string, val: number) => void }) {
  const pct  = calcPct(goal);
  const done = pct >= 100;
  const [editing, setEditing] = useState(false);
  const [input,   setInput]   = useState(String(goal.currentValue));

  const commit = () => {
    const n = Number(input);
    if (!isNaN(n)) onUpdate(goal.id, n);
    setEditing(false);
  };

  return (
    <div className={`rounded-xl p-4 transition-colors bg-neutral-900 border ${
      done ? "border-lime-400/30" : "border-neutral-800"
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[18px]">{goal.icon}</span>
          <div>
            <p className="font-bebas text-[10px] text-neutral-500 uppercase tracking-wider mb-0.5">
              {goal.category}
            </p>
            <p className="font-bebas text-[16px] leading-none text-white">
              {LABEL_EN[goal.label] ?? goal.label}
            </p>
          </div>
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-lg bg-neutral-950 font-bebas text-[11px] ${pctColor(pct)}`}>
          {done
            ? <CheckCircle2 size={12} />
            : <Flame size={12} className="text-orange-500" />
          }
          {pct}%
        </div>
      </div>

      <div className="flex items-end justify-between mb-2">
        <div className="flex items-baseline gap-1">
          {editing ? (
            <input
              autoFocus
              type="number"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onBlur={commit}
              onKeyDown={(e) => e.key === "Enter" && commit()}
              className="w-16 text-[22px] font-bebas bg-transparent border-b border-lime-400 text-lime-400 focus:outline-none"
            />
          ) : (
            <button
              onClick={() => { setInput(String(goal.currentValue)); setEditing(true); }}
              className={`font-bebas text-[22px] leading-none ${pctColor(pct)}`}
              title="클릭하여 수정"
            >
              {goal.currentValue}
            </button>
          )}
          <span className="font-bebas text-[14px] text-neutral-500">/ {goal.targetValue}</span>
          <span className="font-bebas text-[9px] text-neutral-500 ml-0.5">{UNIT_EN[goal.unit] ?? goal.unit}</span>
        </div>
        {done
          ? <span className="font-bebas text-[9px] text-lime-400">Done</span>
          : <span className="font-bebas text-[9px] text-neutral-500">{goal.targetValue - goal.currentValue} {UNIT_EN[goal.unit] ?? goal.unit} left</span>
        }
      </div>

      <div className="h-2 rounded-full overflow-hidden bg-neutral-950">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out relative ${barColor(pct)}`}
          style={{ width: `${pct}%` }}
        >
          <div className="absolute inset-0 bg-stripes opacity-20" />
        </div>
      </div>
    </div>
  );
}

export default function GoalTracker() {
  const [goals,     setGoals]     = useState<WeeklyGoal[]>(initialGoals);
  const [showSheet, setShowSheet] = useState(false);

  const overallPct = goals.length === 0
    ? 0
    : Math.round(goals.reduce((sum, g) => sum + calcPct(g), 0) / goals.length);

  const handleUpdate = (id: string, val: number) => {
    setGoals((prev) => prev.map((g) => g.id === id ? { ...g, currentValue: val } : g));
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap size={16} className="text-lime-400" fill="currentColor" />
          <h2 className="font-bebas text-[20px] leading-none text-white tracking-wide">WEEKLY DIRECTIVE</h2>
        </div>
        <button
          onClick={() => setShowSheet(true)}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-bebas text-[10px] text-neutral-400 bg-neutral-900 border border-neutral-800 hover:border-neutral-600 transition-colors"
        >
          <Plus size={10} />
          목표 추가
        </button>
      </div>

      {goals.length === 0 ? (
        <div className="py-6 text-center">
          <p className="text-[28px] mb-2">⚡</p>
          <p className="font-bebas text-[16px] text-neutral-400 mb-1">WEEKLY DIRECTIVE가 없어요</p>
          <p className="font-bebas text-[10px] text-neutral-600 mb-4">운동, 유산소, 출석 등 달성할 목표를 추가하세요</p>
          <button
            onClick={() => setShowSheet(true)}
            className="px-5 py-2 rounded-xl font-bebas text-[11px] bg-lime-400 text-black"
          >
            첫 목표 추가하기
          </button>
        </div>
      ) : (
        <>
          {/* Overall */}
          <div className="rounded-xl p-4 mb-4 relative overflow-hidden bg-neutral-900 border border-neutral-800">
            <div className="absolute -top-6 -right-6 w-28 h-28 bg-lime-500 opacity-10 blur-2xl rounded-full" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <SkewedBadge part="CHEST">OVERALL COMPLETION</SkewedBadge>
                <span className={`font-bebas text-[24px] leading-none drop-shadow-[0_0_8px_rgba(163,230,53,.4)] ${pctColor(overallPct)}`}>
                  {overallPct}%
                </span>
              </div>
              <div className="h-3 rounded-full overflow-hidden p-0.5 bg-neutral-950 border border-neutral-800">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-out relative ${barColor(overallPct)}`}
                  style={{ width: `${overallPct}%` }}
                >
                  <div className="absolute inset-0 bg-stripes opacity-30" />
                </div>
              </div>
              <p className="font-bebas text-[9px] mt-1.5 text-neutral-500">
                {goals.filter((g) => calcPct(g) >= 100).length} / {goals.length}개 달성
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {goals.map((g) => (
              <GoalCard key={g.id} goal={g} onUpdate={handleUpdate} />
            ))}
          </div>
        </>
      )}

      <WeeklyGoalSheet
        open={showSheet}
        onClose={() => setShowSheet(false)}
        goals={goals}
        onSave={setGoals}
      />
    </div>
  );
}
