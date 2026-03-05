"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import type { EnduranceAbilityResult } from "@/types";
import type { AbilityCategory } from "@/config/abilityConfig";
import { ENDURANCE_SELECT_EQUIPMENT } from "@/config/equipmentConfig";

function getEquipmentName(id: string, options: { id: string; name: string }[]): string {
  return options.find((e) => e.id === id)?.name ?? id;
}

interface EnduranceResultViewProps {
  category: AbilityCategory;
  result: EnduranceAbilityResult;
  prevResult: EnduranceAbilityResult | null;
  onConfirm: () => void;
  onRetry: () => void;
}

export default function EnduranceResultView({
  category,
  result,
  prevResult,
  onConfirm,
  onRetry,
}: EnduranceResultViewProps) {
  const equipName = getEquipmentName(result.equipment, ENDURANCE_SELECT_EQUIPMENT);
  const sameEquipment = prevResult?.equipment === result.equipment;
  const diff = prevResult ? result.reps - prevResult.reps : 0;

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
        <p className="font-mono text-sm text-neutral-400 mt-4">
          {equipName} {result.testWeight}kg × {result.reps}회
        </p>
        <p className="font-mono text-sm text-neutral-500">점수: {result.score} / 100</p>
      </div>

      {prevResult && sameEquipment && (
        <div className="rounded-xl p-4 bg-neutral-900 border border-neutral-800 mb-6">
          <p className="text-xs text-neutral-500 mb-1">이전 기록</p>
          <p className="text-sm text-neutral-400">{prevResult.reps}회 ({prevResult.score}점)</p>
          <p className={`text-sm font-bold mt-2 flex items-center gap-1 ${diff > 0 ? "text-lime-400" : diff < 0 ? "text-orange-400" : "text-neutral-400"}`}>
            {diff > 0 ? <TrendingUp className="w-4 h-4" /> : diff < 0 ? <TrendingDown className="w-4 h-4" /> : null}
            {diff > 0 ? `+${diff}회 향상!` : diff < 0 ? `${diff}회` : "동일"}
          </p>
        </div>
      )}

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
