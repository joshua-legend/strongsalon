"use client";

import { useState, useMemo } from "react";
import { ChevronLeft } from "lucide-react";
import type { AbilityCategory } from "@/config/abilityConfig";
import type { EquipmentItem } from "@/config/equipmentConfig";
import type { StrengthAbilityResult } from "@/types";
import { estimate1RM } from "@/utils/strengthUtils";
import { calcScore, getGrade } from "@/config/abilityConfig";
import {
  getTiersForEquipment,
  UPPER_PULL_ASSIST_IDS,
} from "@/config/equipmentConfig";

interface MaxWeightInputProps {
  category: AbilityCategory;
  equipmentOptions: EquipmentItem[];
  bodyweight: number;
  onComplete: (result: StrengthAbilityResult) => void;
  onBack: () => void;
}

export default function MaxWeightInput({
  category,
  equipmentOptions,
  bodyweight,
  onComplete,
  onBack,
}: MaxWeightInputProps) {
  const [selectedEquipment, setSelectedEquipment] = useState(equipmentOptions[0]?.id ?? "");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");

  const isAssist =
    category.id === "upperPull" &&
    UPPER_PULL_ASSIST_IDS.includes(selectedEquipment);

  const weightNum = parseFloat(weight) || 0;
  const repsNum = parseInt(reps, 10) || 0;

  const actualLoad = useMemo(() => {
    if (!isAssist) return weightNum;
    return Math.max(0, bodyweight - weightNum);
  }, [isAssist, bodyweight, weightNum]);

  const estimated1RM = useMemo(() => {
    if (repsNum === 0) return 0;
    return estimate1RM(actualLoad, repsNum);
  }, [actualLoad, repsNum]);

  const bodyweightRatio = useMemo(() => {
    if (bodyweight <= 0) return 0;
    return Math.round((estimated1RM / bodyweight) * 100) / 100;
  }, [estimated1RM, bodyweight]);

  const assistError =
    isAssist && weightNum >= bodyweight
      ? "보조 중량이 체중보다 큽니다"
      : null;

  const canSubmit = !assistError && weightNum > 0 && repsNum > 0;

  const handleSubmit = () => {
    if (!canSubmit || bodyweight <= 0) return;
    const tiers = getTiersForEquipment(
      category.id as "lowerStrength" | "upperPush" | "upperPull",
      selectedEquipment
    );
    const score = calcScore(bodyweightRatio, tiers);
    const grade = getGrade(score);
    const result: StrengthAbilityResult = {
      score,
      grade,
      equipment: selectedEquipment,
      weight: isAssist ? weightNum : weightNum,
      reps: repsNum,
      estimated1RM,
      bodyweightRatio,
      isAssist: isAssist || undefined,
      date: new Date().toISOString().slice(0, 10),
    };
    onComplete(result);
  };

  return (
    <div className="rounded-2xl p-5 bg-neutral-950 border border-neutral-800 space-y-5">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          className="p-1 rounded-lg hover:bg-neutral-800 text-neutral-400"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="font-bebas text-lg text-white">
          {category.icon} {category.label} 테스트
        </h2>
      </div>

      <div>
        <p className="text-xs text-neutral-500 mb-2">기구 선택</p>
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          {equipmentOptions.map((eq) => (
            <button
              key={eq.id}
              type="button"
              onClick={() => setSelectedEquipment(eq.id)}
              className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedEquipment === eq.id
                  ? "bg-lime-500/20 text-lime-400 border border-lime-500/50"
                  : "bg-neutral-900 text-neutral-400 border border-neutral-800 hover:border-neutral-700"
              }`}
            >
              {eq.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-neutral-500 mb-1">
            {isAssist ? "보조 중량(kg)" : "중량(kg)"}
          </p>
          <input
            type="number"
            inputMode="decimal"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="0"
            className="w-full font-mono text-lg bg-neutral-900 border-b-2 border-neutral-700 px-3 py-2 text-white focus:border-lime-400 focus:outline-none rounded-t-lg"
          />
        </div>
        <div>
          <p className="text-xs text-neutral-500 mb-1">횟수(회)</p>
          <input
            type="number"
            inputMode="numeric"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            placeholder="0"
            className="w-full font-mono text-lg bg-neutral-900 border-b-2 border-neutral-700 px-3 py-2 text-white focus:border-lime-400 focus:outline-none rounded-t-lg"
          />
        </div>
      </div>

      {isAssist && (
        <p className="text-xs text-neutral-400">
          실제 부하: {actualLoad.toFixed(1)} kg (체중 {bodyweight} - 보조 {weightNum})
        </p>
      )}

      {(weightNum > 0 || repsNum > 0) && (
        <div className="rounded-xl p-4 bg-neutral-900/80 border border-neutral-800">
          <p className="font-mono text-sm text-neutral-300">
            추정 1RM: <span className="text-lime-400 font-bold">{estimated1RM.toFixed(1)} kg</span>
          </p>
          <p className="font-mono text-sm text-neutral-400 mt-1">
            체중 대비: <span className="text-white font-bold">{bodyweightRatio.toFixed(2)}배</span>
          </p>
        </div>
      )}

      {assistError && (
        <p className="text-sm text-orange-400">{assistError}</p>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!canSubmit}
        className={`w-full py-4 rounded-xl font-bold text-sm ${
          canSubmit
            ? "bg-lime-500 text-black hover:bg-lime-400"
            : "bg-neutral-800 text-neutral-600 pointer-events-none"
        }`}
      >
        기록 완료
      </button>
    </div>
  );
}
