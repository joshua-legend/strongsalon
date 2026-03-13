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
    <div className="rounded-2xl p-5 space-y-5" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-light)" }}>
      <PentagonRadarChart results={results} />

      <div className="text-center">
        <p className="font-bebas text-sm font-bold" style={{ color: "var(--text-sub)" }}>
          종합 점수:{" "}
          <span className="font-mono font-bold" style={{ color: "var(--accent-main)" }}>
            {measured.length > 0
              ? `${totalScore.toFixed(1)} / 100`
              : "—"}
          </span>{" "}
          {measured.length > 0 && (
            <span style={{ color: "var(--text-sub)" }}>등급: {avgGrade}</span>
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
              className="w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left"
            style={{ backgroundColor: "var(--bg-body)", border: "1px solid var(--border-light)" }}
            >
              <span className="text-xl">{cat.icon}</span>
              <span className="text-sm flex-1" style={{ color: "var(--text-main)" }}>
                {cat.label}
              </span>
              {isMeasured ? (
                <>
                  <span className="font-mono text-sm font-bold w-8 text-right" style={{ color: "var(--text-main)" }}>
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
                    className="w-16 h-1.5 rounded-full overflow-hidden"
                    style={{ backgroundColor: "var(--bg-card-hover)", minWidth: 64 }}
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
                <span className="text-xs" style={{ color: "var(--text-sub)" }}>미측정</span>
              )}
              <ChevronRight className="w-4 h-4 shrink-0" style={{ color: "var(--text-sub)" }} />
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onFullTestStart}
        className="w-full py-3 rounded-xl font-bold text-sm transition-colors hover:brightness-110 flex items-center justify-center gap-2"
        style={{ backgroundColor: "var(--accent-main)", color: "var(--accent-text)" }}
      >
        <span>▶</span>
        전체 측정하기
      </button>
    </div>
  );
}
