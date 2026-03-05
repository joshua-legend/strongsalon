"use client";

import { ChevronRight } from "lucide-react";
import type { AbilityResults } from "@/types";
import {
  ABILITY_CATEGORIES,
  getGrade,
} from "@/config/abilityConfig";
import PentagonRadarChart from "./PentagonRadarChart";

interface BalanceDashboardProps {
  results: AbilityResults;
  onCategorySelect: (id: keyof AbilityResults) => void;
  onFullTestStart: () => void;
}

export default function BalanceDashboard({
  results,
  onCategorySelect,
  onFullTestStart,
}: BalanceDashboardProps) {
  const measured = Object.values(results).filter((r) => r !== null);
  const totalScore =
    measured.length > 0
      ? measured.reduce((sum, r) => sum + (r?.score ?? 0), 0) / measured.length
      : 0;
  const avgGrade = getGrade(Math.round(totalScore * 10) / 10);

  return (
    <div className="rounded-2xl p-5 bg-neutral-950 border border-neutral-800 space-y-5">
      <PentagonRadarChart results={results} />

      <div className="text-center">
        <p className="font-bebas text-sm text-neutral-500">
          종합 점수:{" "}
          <span className="text-lime-400 font-mono">
            {measured.length > 0
              ? `${totalScore.toFixed(1)} / 100`
              : "—"}
          </span>{" "}
          {measured.length > 0 && (
            <span className="text-neutral-400">등급: {avgGrade}</span>
          )}
        </p>
      </div>

      <div className="space-y-2">
        {ABILITY_CATEGORIES.map((cat) => {
          const r = results[cat.id];
          const score = r?.score ?? 0;
          const grade = r ? r.grade : null;
          const isMeasured = r !== null;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onCategorySelect(cat.id)}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-neutral-900/80 border border-neutral-800 hover:border-neutral-700 transition-colors text-left"
            >
              <span className="text-xl">{cat.icon}</span>
              <span className="text-sm text-neutral-300 flex-1">
                {cat.label}
              </span>
              {isMeasured ? (
                <>
                  <span className="font-mono text-sm font-bold text-white w-8 text-right">
                    {score}
                  </span>
                  <span
                    className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold"
                    style={{
                      background: `${cat.color}30`,
                      color: cat.color,
                    }}
                  >
                    {grade}
                  </span>
                  <div
                    className="w-16 h-1.5 rounded-full overflow-hidden bg-neutral-800"
                    style={{ minWidth: 64 }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${score}%`,
                        backgroundColor: cat.color,
                      }}
                    />
                  </div>
                </>
              ) : (
                <span className="text-xs text-neutral-600">미측정</span>
              )}
              <ChevronRight className="w-4 h-4 text-neutral-600 shrink-0" />
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onFullTestStart}
        className="w-full py-3 rounded-xl font-bold text-sm bg-lime-500/20 text-lime-400 border border-lime-500/40 hover:bg-lime-500/30 transition-colors shadow-[0_0_15px_rgba(163,230,53,0.3)] flex items-center justify-center gap-2"
      >
        <span>▶</span>
        전체 측정하기
      </button>
    </div>
  );
}
