"use client";

import type { BalanceAbilityResult } from "@/types";
import type { AbilityCategory } from "@/config/abilityConfig";

interface BalanceResultViewProps {
  category: AbilityCategory;
  result: BalanceAbilityResult;
  onConfirm: () => void;
  onRetry: () => void;
}

export default function BalanceResultView({
  category,
  result,
  onConfirm,
  onRetry,
}: BalanceResultViewProps) {
  const frontBackOk = result.frontBackRatio >= 60 && result.frontBackRatio <= 80;
  const innerOuterOk = result.innerOuterRatio >= 80 && result.innerOuterRatio <= 100;

  return (
    <div className="px-4 py-6 flex flex-col min-h-[60vh]">
      <h2 className="font-bebas text-xl font-bold text-center mb-6" style={{ color: "var(--text-main)" }}>
        {category.icon} {category.label}
      </h2>

      <div className="flex flex-col items-center mb-6">
        <div
          className="w-28 h-28 rounded-full flex items-center justify-center font-bebas text-6xl border-4"
          style={{ backgroundColor: `${category.color}20`, borderColor: category.color, color: category.color }}
        >
          {result.grade}
        </div>
        <p className="font-mono text-sm mt-4" style={{ color: "var(--text-sub)" }}>점수: {result.score} / 100</p>
      </div>

      <div className="rounded-xl p-4 mb-4" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-light)" }}>
        <p className="text-xs mb-2" style={{ color: "var(--text-sub)" }}>전면/후면 비율</p>
        <div className="h-2 rounded-full overflow-hidden mb-1" style={{ backgroundColor: "var(--bg-card-hover)" }}>
          <div className="h-full rounded-full transition-all"
            style={{ width: `${Math.min(100, result.frontBackRatio)}%`, backgroundColor: frontBackOk ? "#4ade80" : "#f97316" }} />
        </div>
        <p className="text-xs" style={{ color: "var(--text-sub)" }}>
          {result.frontBackRatio}% {frontBackOk ? "✓ 균형" : "⚠ 보강 필요"}
        </p>
      </div>

      <div className="rounded-xl p-4 mb-6" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-light)" }}>
        <p className="text-xs mb-2" style={{ color: "var(--text-sub)" }}>내측/외측 비율</p>
        <div className="h-2 rounded-full overflow-hidden mb-1" style={{ backgroundColor: "var(--bg-card-hover)" }}>
          <div className="h-full rounded-full transition-all"
            style={{ width: `${Math.min(100, result.innerOuterRatio)}%`, backgroundColor: innerOuterOk ? "#4ade80" : "#f97316" }} />
        </div>
        <p className="text-xs" style={{ color: "var(--text-sub)" }}>
          {result.innerOuterRatio}% {innerOuterOk ? "✓ 균형" : "⚠ 보강 필요"}
        </p>
      </div>

      <div className="mt-auto space-y-3">
        <button type="button" onClick={onConfirm}
          className="w-full py-4 rounded-xl font-bold transition-colors hover:brightness-110"
          style={{ backgroundColor: "var(--accent-main)", color: "var(--accent-text)" }}>
          확인
        </button>
        <button type="button" onClick={onRetry}
          className="w-full py-3 rounded-xl font-bold transition-colors hover:opacity-90"
          style={{ backgroundColor: "var(--bg-card)", color: "var(--text-main)", border: "1px solid var(--border-light)" }}>
          다시 측정
        </button>
      </div>
    </div>
  );
}
