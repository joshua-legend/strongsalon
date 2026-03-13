"use client";

import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import type { AbilityCategory } from "@/config/abilityConfig";
import type { EquipmentItem } from "@/config/equipmentConfig";
import type { StrengthAbilityResult } from "@/types";
import { calcScore, getGrade } from "@/config/abilityConfig";
import { getTiersForEquipment, UPPER_PULL_ASSIST_IDS } from "@/config/equipmentConfig";
import { useMaxWeightCalc } from "./useMaxWeightCalc";

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

  const isAssist = category.id === "upperPull" && UPPER_PULL_ASSIST_IDS.includes(selectedEquipment);
  const weightNum = parseFloat(weight) || 0;
  const repsNum = parseInt(reps, 10) || 0;

  const { actualLoad, estimated1RM, bodyweightRatio, assistError } = useMaxWeightCalc({
    weightNum, repsNum, bodyweight, isAssist,
  });

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
      weight: weightNum,
      reps: repsNum,
      estimated1RM,
      bodyweightRatio,
      isAssist: isAssist || undefined,
      date: new Date().toISOString().slice(0, 10),
    };
    onComplete(result);
  };

  return (
    <div className="rounded-2xl p-5 space-y-5" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-light)" }}>
      <div className="flex items-center gap-2">
        <button type="button" onClick={onBack} className="p-1 rounded-lg transition-colors" style={{ color: "var(--text-sub)" }}>
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="font-bebas text-lg" style={{ color: "var(--text-main)" }}>{category.icon} {category.label} 테스트</h2>
      </div>

      <div>
        <p className="text-xs mb-2" style={{ color: "var(--text-sub)" }}>기구 선택</p>
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          {equipmentOptions.map((eq) => (
            <button key={eq.id} type="button" onClick={() => setSelectedEquipment(eq.id)}
              className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                selectedEquipment === eq.id
                  ? "bg-lime-500/20 text-lime-400 border-lime-500/50"
                  : "bg-[var(--bg-body)] border-[var(--border-light)]"
              }`}
              style={selectedEquipment !== eq.id ? { color: "var(--text-sub)" } : undefined}>
              {eq.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs mb-1" style={{ color: "var(--text-sub)" }}>{isAssist ? "보조 중량(kg)" : "중량(kg)"}</p>
          <input type="number" inputMode="decimal" value={weight} onChange={(e) => setWeight(e.target.value)}
            placeholder="0"
            className="w-full font-mono text-lg border-b-2 px-3 py-2 focus:outline-none focus:border-[var(--accent-main)] rounded-t-lg"
            style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-light)", color: "var(--text-main)" }} />
        </div>
        <div>
          <p className="text-xs mb-1" style={{ color: "var(--text-sub)" }}>횟수(회)</p>
          <input type="number" inputMode="numeric" value={reps} onChange={(e) => setReps(e.target.value)}
            placeholder="0"
            className="w-full font-mono text-lg border-b-2 px-3 py-2 focus:outline-none focus:border-[var(--accent-main)] rounded-t-lg"
            style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-light)", color: "var(--text-main)" }} />
        </div>
      </div>

      {isAssist && (
        <p className="text-xs" style={{ color: "var(--text-sub)" }}>
          실제 부하: {actualLoad.toFixed(1)} kg (체중 {bodyweight} - 보조 {weightNum})
        </p>
      )}

      {(weightNum > 0 || repsNum > 0) && (
        <div className="rounded-xl p-4" style={{ backgroundColor: "var(--bg-body)", border: "1px solid var(--border-light)" }}>
          <p className="font-mono text-sm" style={{ color: "var(--text-main)" }}>
            추정 1RM: <span className="text-lime-400 font-bold">{estimated1RM.toFixed(1)} kg</span>
          </p>
          <p className="font-mono text-sm mt-1" style={{ color: "var(--text-sub)" }}>
            체중 대비: <span className="font-bold" style={{ color: "var(--text-main)" }}>{bodyweightRatio.toFixed(2)}배</span>
          </p>
        </div>
      )}

      {assistError && <p className="text-sm text-orange-400">{assistError}</p>}

      <button type="button" onClick={handleSubmit} disabled={!canSubmit}
        className={`w-full py-4 rounded-xl font-bold text-sm transition-colors ${
          canSubmit ? "hover:brightness-110" : "pointer-events-none opacity-50"
        }`}
        style={canSubmit ? { backgroundColor: "var(--accent-main)", color: "var(--accent-text)" } : { backgroundColor: "var(--bg-card)", color: "var(--text-sub)" }}>
        기록 완료
      </button>
    </div>
  );
}
