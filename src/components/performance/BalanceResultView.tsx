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
      <h2 className="font-bebas text-xl text-center text-white mb-6">
        {category.icon} {category.label}
      </h2>

      <div className="flex flex-col items-center mb-6">
        <div
          className="w-28 h-28 rounded-full flex items-center justify-center font-bebas text-6xl border-4"
          style={{ backgroundColor: `${category.color}20`, borderColor: category.color, color: category.color }}
        >
          {result.grade}
        </div>
        <p className="font-mono text-sm text-neutral-500 mt-4">점수: {result.score} / 100</p>
      </div>

      <div className="rounded-xl p-4 bg-neutral-900 border border-neutral-800 mb-4">
        <p className="text-xs text-neutral-500 mb-2">전면/후면 비율</p>
        <div className="h-2 rounded-full bg-neutral-800 overflow-hidden mb-1">
          <div className="h-full rounded-full transition-all"
            style={{ width: `${Math.min(100, result.frontBackRatio)}%`, backgroundColor: frontBackOk ? "#4ade80" : "#f97316" }} />
        </div>
        <p className="text-xs text-neutral-400">
          {result.frontBackRatio}% {frontBackOk ? "✓ 균형" : "⚠ 보강 필요"}
        </p>
      </div>

      <div className="rounded-xl p-4 bg-neutral-900 border border-neutral-800 mb-6">
        <p className="text-xs text-neutral-500 mb-2">내측/외측 비율</p>
        <div className="h-2 rounded-full bg-neutral-800 overflow-hidden mb-1">
          <div className="h-full rounded-full transition-all"
            style={{ width: `${Math.min(100, result.innerOuterRatio)}%`, backgroundColor: innerOuterOk ? "#4ade80" : "#f97316" }} />
        </div>
        <p className="text-xs text-neutral-400">
          {result.innerOuterRatio}% {innerOuterOk ? "✓ 균형" : "⚠ 보강 필요"}
        </p>
      </div>

      <div className="mt-auto space-y-3">
        <button type="button" onClick={onConfirm}
          className="w-full py-4 rounded-xl font-bold bg-lime-500 text-black hover:bg-lime-400 transition-colors">
          확인
        </button>
        <button type="button" onClick={onRetry}
          className="w-full py-3 rounded-xl font-bold bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition-colors">
          다시 측정
        </button>
      </div>
    </div>
  );
}
