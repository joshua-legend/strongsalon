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
    <div className="rounded-2xl p-5 space-y-5" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-light)" }}>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          className="p-1 rounded-lg transition-colors"
          style={{ color: "var(--text-sub)" }}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="font-bebas text-lg" style={{ color: "var(--text-main)" }}>
          {category.icon} {category.label} 테스트
        </h2>
      </div>

      <div>
        <p className="text-xs mb-2" style={{ color: "var(--text-sub)" }}>기구 선택</p>
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          {equipmentOptions.map((eq) => (
            <button
              key={eq.id}
              type="button"
              onClick={() => setSelectedEquipment(eq.id)}
              className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                selectedEquipment === eq.id
                  ? "bg-lime-500/20 text-lime-400 border-lime-500/50"
                  : "bg-[var(--bg-body)] border-[var(--border-light)]"
              }`}
              style={selectedEquipment !== eq.id ? { color: "var(--text-sub)" } : undefined}
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
        <p className="text-xs mt-1" style={{ color: "var(--text-sub)" }}>
          (체중 {bodyweight}kg × {weightRatio})
        </p>
      </div>

      <div>
        <p className="text-xs mb-2" style={{ color: "var(--text-sub)" }}>
          해당 중량에서 최대 몇 회 수행했나요?
        </p>
        <div className="flex items-baseline justify-center gap-2">
          <input
            type="number"
            inputMode="numeric"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            placeholder="0"
            className="font-bebas text-6xl w-32 text-center bg-transparent border-b-2 focus:border-[var(--accent-main)] focus:outline-none"
          style={{ borderColor: "var(--border-light)", color: "var(--text-main)" }}
          />
          <span className="font-mono text-lg" style={{ color: "var(--text-sub)" }}>회</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!canSubmit}
        className={`w-full py-4 rounded-xl font-bold text-sm transition-colors ${
          canSubmit
            ? "hover:brightness-110"
            : "pointer-events-none opacity-50"
        }`}
          style={canSubmit ? { backgroundColor: "var(--accent-main)", color: "var(--accent-text)" } : { backgroundColor: "var(--bg-card)", color: "var(--text-sub)" }}
      >
        기록 완료
      </button>
    </div>
  );
}
