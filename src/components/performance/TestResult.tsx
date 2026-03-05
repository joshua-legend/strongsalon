"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import type {
  AbilityResult,
  StrengthAbilityResult,
  BalanceAbilityResult,
  EnduranceAbilityResult,
} from "@/types";
import type { AbilityCategory } from "@/config/abilityConfig";
import {
  LOWER_STRENGTH_EQUIPMENT,
  UPPER_PUSH_SELECT_EQUIPMENT,
  UPPER_PULL_SELECT_EQUIPMENT,
  ENDURANCE_SELECT_EQUIPMENT,
} from "@/config/equipmentConfig";

function getEquipmentName(id: string, options: { id: string; name: string }[]): string {
  return options.find((e) => e.id === id)?.name ?? id;
}

interface TestResultProps {
  category: AbilityCategory;
  result: AbilityResult;
  prevResult: AbilityResult | null;
  onConfirm: () => void;
  onRetry: () => void;
}

function StrengthResultView({
  category,
  result,
  prevResult,
  onConfirm,
  onRetry,
}: {
  category: AbilityCategory;
  result: StrengthAbilityResult;
  prevResult: StrengthAbilityResult | null;
  onConfirm: () => void;
  onRetry: () => void;
}) {
  const equipmentOptions =
    category.id === "lowerStrength"
      ? LOWER_STRENGTH_EQUIPMENT
      : category.id === "upperPush"
      ? UPPER_PUSH_SELECT_EQUIPMENT
      : UPPER_PULL_SELECT_EQUIPMENT;
  const equipName = getEquipmentName(result.equipment, equipmentOptions);

  const prevStrength = prevResult as StrengthAbilityResult | null;
  const sameEquipment = prevStrength?.equipment === result.equipment;
  const prev1RM = prevStrength?.estimated1RM ?? 0;
  const diff = result.estimated1RM - prev1RM;

  return (
    <div className="px-4 py-6 flex flex-col min-h-[60vh]">
      <h2 className="font-bebas text-xl text-center text-white mb-6">
        {category.icon} {category.label}
      </h2>

      <div className="flex flex-col items-center mb-6">
        <div
          className="w-28 h-28 rounded-full flex items-center justify-center font-bebas text-6xl border-4"
          style={{
            backgroundColor: `${category.color}20`,
            borderColor: category.color,
            color: category.color,
          }}
        >
          {result.grade}
        </div>
        <p className="font-mono text-sm text-neutral-400 mt-4">
          {equipName} {result.weight}kg × {result.reps}회
        </p>
        <p className="font-mono text-sm text-neutral-500">
          추정 1RM: {result.estimated1RM.toFixed(1)} kg
        </p>
        <p className="font-mono text-sm text-neutral-500">
          체중 대비: {result.bodyweightRatio.toFixed(2)}배
        </p>
        <p className="font-mono text-sm text-neutral-500">
          점수: {result.score} / 100
        </p>
      </div>

      {prevStrength && sameEquipment && prev1RM > 0 && (
        <div className="rounded-xl p-4 bg-neutral-900 border border-neutral-800 mb-6">
          <p className="text-xs text-neutral-500 mb-1">이전 기록</p>
          <p className="text-sm text-neutral-400">
            {prevStrength.estimated1RM.toFixed(1)}kg (1RM)
          </p>
          <p
            className={`text-sm font-bold mt-2 flex items-center gap-1 ${
              diff > 0 ? "text-lime-400" : diff < 0 ? "text-orange-400" : "text-neutral-400"
            }`}
          >
            {diff > 0 ? <TrendingUp className="w-4 h-4" /> : diff < 0 ? <TrendingDown className="w-4 h-4" /> : null}
            {diff > 0
              ? `+${diff.toFixed(1)}kg 향상!`
              : diff < 0
              ? `${diff.toFixed(1)}kg`
              : "동일"}
          </p>
        </div>
      )}

      <div className="mt-auto space-y-3">
        <button
          type="button"
          onClick={onConfirm}
          className="w-full py-4 rounded-xl font-bold bg-lime-500 text-black hover:bg-lime-400 transition-colors"
        >
          확인
        </button>
        <button
          type="button"
          onClick={onRetry}
          className="w-full py-3 rounded-xl font-bold bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition-colors"
        >
          다시 측정
        </button>
      </div>
    </div>
  );
}

function BalanceResultView({
  category,
  result,
  onConfirm,
  onRetry,
}: {
  category: AbilityCategory;
  result: BalanceAbilityResult;
  onConfirm: () => void;
  onRetry: () => void;
}) {
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
          style={{
            backgroundColor: `${category.color}20`,
            borderColor: category.color,
            color: category.color,
          }}
        >
          {result.grade}
        </div>
        <p className="font-mono text-sm text-neutral-500 mt-4">
          점수: {result.score} / 100
        </p>
      </div>

      <div className="rounded-xl p-4 bg-neutral-900 border border-neutral-800 mb-4">
        <p className="text-xs text-neutral-500 mb-2">전면/후면 비율</p>
        <div className="h-2 rounded-full bg-neutral-800 overflow-hidden mb-1">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${Math.min(100, result.frontBackRatio)}%`,
              backgroundColor: frontBackOk ? "#4ade80" : "#f97316",
            }}
          />
        </div>
        <p className="text-xs text-neutral-400">
          {result.frontBackRatio}% {frontBackOk ? "✓ 균형" : "⚠ 보강 필요"}
        </p>
      </div>

      <div className="rounded-xl p-4 bg-neutral-900 border border-neutral-800 mb-6">
        <p className="text-xs text-neutral-500 mb-2">내측/외측 비율</p>
        <div className="h-2 rounded-full bg-neutral-800 overflow-hidden mb-1">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${Math.min(100, result.innerOuterRatio)}%`,
              backgroundColor: innerOuterOk ? "#4ade80" : "#f97316",
            }}
          />
        </div>
        <p className="text-xs text-neutral-400">
          {result.innerOuterRatio}% {innerOuterOk ? "✓ 균형" : "⚠ 보강 필요"}
        </p>
      </div>

      <div className="mt-auto space-y-3">
        <button
          type="button"
          onClick={onConfirm}
          className="w-full py-4 rounded-xl font-bold bg-lime-500 text-black hover:bg-lime-400 transition-colors"
        >
          확인
        </button>
        <button
          type="button"
          onClick={onRetry}
          className="w-full py-3 rounded-xl font-bold bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition-colors"
        >
          다시 측정
        </button>
      </div>
    </div>
  );
}

function EnduranceResultView({
  category,
  result,
  prevResult,
  onConfirm,
  onRetry,
}: {
  category: AbilityCategory;
  result: EnduranceAbilityResult;
  prevResult: EnduranceAbilityResult | null;
  onConfirm: () => void;
  onRetry: () => void;
}) {
  const equipName = getEquipmentName(result.equipment, ENDURANCE_SELECT_EQUIPMENT);
  const prevEndurance = prevResult as EnduranceAbilityResult | null;
  const sameEquipment = prevEndurance?.equipment === result.equipment;
  const diff = prevEndurance ? result.reps - prevEndurance.reps : 0;

  return (
    <div className="px-4 py-6 flex flex-col min-h-[60vh]">
      <h2 className="font-bebas text-xl text-center text-white mb-6">
        {category.icon} {category.label}
      </h2>

      <div className="flex flex-col items-center mb-6">
        <div
          className="w-28 h-28 rounded-full flex items-center justify-center font-bebas text-6xl border-4"
          style={{
            backgroundColor: `${category.color}20`,
            borderColor: category.color,
            color: category.color,
          }}
        >
          {result.grade}
        </div>
        <p className="font-mono text-sm text-neutral-400 mt-4">
          {equipName} {result.testWeight}kg × {result.reps}회
        </p>
        <p className="font-mono text-sm text-neutral-500">
          점수: {result.score} / 100
        </p>
      </div>

      {prevEndurance && sameEquipment && (
        <div className="rounded-xl p-4 bg-neutral-900 border border-neutral-800 mb-6">
          <p className="text-xs text-neutral-500 mb-1">이전 기록</p>
          <p className="text-sm text-neutral-400">
            {prevEndurance.reps}회 ({prevEndurance.score}점)
          </p>
          <p
            className={`text-sm font-bold mt-2 flex items-center gap-1 ${
              diff > 0 ? "text-lime-400" : diff < 0 ? "text-orange-400" : "text-neutral-400"
            }`}
          >
            {diff > 0 ? <TrendingUp className="w-4 h-4" /> : diff < 0 ? <TrendingDown className="w-4 h-4" /> : null}
            {diff > 0 ? `+${diff}회 향상!` : diff < 0 ? `${diff}회` : "동일"}
          </p>
        </div>
      )}

      <div className="mt-auto space-y-3">
        <button
          type="button"
          onClick={onConfirm}
          className="w-full py-4 rounded-xl font-bold bg-lime-500 text-black hover:bg-lime-400 transition-colors"
        >
          확인
        </button>
        <button
          type="button"
          onClick={onRetry}
          className="w-full py-3 rounded-xl font-bold bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition-colors"
        >
          다시 측정
        </button>
      </div>
    </div>
  );
}

export default function TestResult({
  category,
  result,
  prevResult,
  onConfirm,
  onRetry,
}: TestResultProps) {
  if ("estimated1RM" in result && "bodyweightRatio" in result) {
    return (
      <StrengthResultView
        category={category}
        result={result as StrengthAbilityResult}
        prevResult={prevResult as StrengthAbilityResult | null}
        onConfirm={onConfirm}
        onRetry={onRetry}
      />
    );
  }
  if ("frontBackRatio" in result && "innerOuterRatio" in result) {
    return (
      <BalanceResultView
        category={category}
        result={result as BalanceAbilityResult}
        onConfirm={onConfirm}
        onRetry={onRetry}
      />
    );
  }
  if ("testWeight" in result && "reps" in result) {
    return (
      <EnduranceResultView
        category={category}
        result={result as EnduranceAbilityResult}
        prevResult={prevResult as EnduranceAbilityResult | null}
        onConfirm={onConfirm}
        onRetry={onRetry}
      />
    );
  }
  return null;
}
