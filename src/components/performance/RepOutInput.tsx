"use client";

import { useState, useMemo } from "react";
import { ChevronLeft } from "lucide-react";
import type { AbilityCategory } from "@/config/abilityConfig";
import type { EquipmentItem } from "@/config/equipmentConfig";
import type { EnduranceAbilityResult } from "@/types";
import { calcScore, getGrade } from "@/config/abilityConfig";
import {
  ENDURANCE_EQUIPMENT_CONFIG,
  ENDURANCE_SELECT_EQUIPMENT,
} from "@/config/equipmentConfig";

interface RepOutInputProps {
  category: AbilityCategory;
  equipmentOptions: EquipmentItem[];
  bodyweight: number;
  onComplete: (result: EnduranceAbilityResult) => void;
  onBack: () => void;
}

export default function RepOutInput({
  category,
  equipmentOptions,
  bodyweight,
  onComplete,
  onBack,
}: RepOutInputProps) {
  const [selectedEquipment, setSelectedEquipment] = useState(
    equipmentOptions[0]?.id ?? ""
  );
  const [reps, setReps] = useState("");

  const config = selectedEquipment
    ? ENDURANCE_EQUIPMENT_CONFIG[selectedEquipment]
    : null;
  const weightRatio = config?.weightRatio ?? 0.5;
  const testWeight = useMemo(() => {
    const raw = bodyweight * weightRatio;
    return Math.round(raw * 2) / 2;
  }, [bodyweight, weightRatio]);

  const repsNum = parseInt(reps, 10) || 0;
  const tiers = config?.tiers ?? [];
  const score = useMemo(
    () => (repsNum > 0 && tiers.length > 0 ? calcScore(repsNum, tiers) : 0),
    [repsNum, tiers]
  );
  const grade = getGrade(score);

  const canSubmit = repsNum >= 0;

  const handleSubmit = () => {
    if (!canSubmit || !selectedEquipment) return;
    const result: EnduranceAbilityResult = {
      score,
      grade,
      equipment: selectedEquipment,
      testWeight,
      reps: repsNum,
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

      <div className="rounded-xl p-4 bg-amber-500/10 border border-amber-500/30">
        <p className="text-sm text-amber-400 font-medium">
          기구를 {testWeight}kg으로 세팅하세요
        </p>
        <p className="text-xs text-neutral-500 mt-1">
          (체중 {bodyweight}kg × {weightRatio})
        </p>
      </div>

      <div>
        <p className="text-xs text-neutral-500 mb-2">
          해당 중량에서 최대 몇 회 수행했나요?
        </p>
        <div className="flex items-baseline justify-center gap-2">
          <input
            type="number"
            inputMode="numeric"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            placeholder="0"
            className="font-bebas text-6xl w-32 text-center bg-transparent border-b-2 border-neutral-700 text-white focus:border-lime-400 focus:outline-none"
          />
          <span className="font-mono text-lg text-neutral-500">회</span>
        </div>
      </div>

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
