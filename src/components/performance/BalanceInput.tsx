"use client";

import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import type { AbilityCategory } from "@/config/abilityConfig";
import type { BalanceAbilityResult } from "@/types";
import { useBalanceCalc } from "./useBalanceCalc";
import { WeightRepsInput } from "./BalanceInputForm";

const QUAD_EQUIP = { id: "legext", name: "레그익스텐션 (전면)" };
const HAM_OPTIONS = [
  { id: "lyingcurl", name: "라잉 레그컬" },
  { id: "seatedcurl", name: "시티드 레그컬" },
];
const INNER_EQUIP = { id: "innerthigh", name: "이너타이 (내측)" };
const OUTER_EQUIP = { id: "outerthigh", name: "아웃타이 (외측)" };

interface BalanceInputProps {
  category: AbilityCategory;
  bodyweight: number;
  onComplete: (result: BalanceAbilityResult) => void;
  onBack: () => void;
}

export default function BalanceInput({ category, onComplete, onBack }: BalanceInputProps) {
  const [hamChoice, setHamChoice] = useState<"lyingcurl" | "seatedcurl">("lyingcurl");
  const [quadWeight, setQuadWeight] = useState("");
  const [quadReps, setQuadReps] = useState("");
  const [hamWeight, setHamWeight] = useState("");
  const [hamReps, setHamReps] = useState("");
  const [innerWeight, setInnerWeight] = useState("");
  const [innerReps, setInnerReps] = useState("");
  const [outerWeight, setOuterWeight] = useState("");
  const [outerReps, setOuterReps] = useState("");

  const qw = parseFloat(quadWeight) || 0;
  const qr = parseInt(quadReps, 10) || 0;
  const hw = parseFloat(hamWeight) || 0;
  const hr = parseInt(hamReps, 10) || 0;
  const iw = parseFloat(innerWeight) || 0;
  const ir = parseInt(innerReps, 10) || 0;
  const ow = parseFloat(outerWeight) || 0;
  const or = parseInt(outerReps, 10) || 0;

  const {
    quad1RM, ham1RM, inner1RM, outer1RM,
    frontBackRatio, innerOuterRatio,
    frontBackScore, innerOuterScore,
    totalScore, grade,
    frontBackDiagnosis, innerOuterDiagnosis,
  } = useBalanceCalc({ qw, qr, hw, hr, iw, ir, ow, or });

  const allFilled = qw > 0 && qr > 0 && hw > 0 && hr > 0 && iw > 0 && ir > 0 && ow > 0 && or > 0;

  const handleSubmit = () => {
    if (!allFilled) return;
    const result: BalanceAbilityResult = {
      score: totalScore, grade,
      frontBackRatio, innerOuterRatio,
      frontBackScore, innerOuterScore,
      quad: { equipment: QUAD_EQUIP.id, weight: qw, reps: qr, est1RM: quad1RM },
      ham: { equipment: hamChoice, weight: hw, reps: hr, est1RM: ham1RM },
      inner: { equipment: INNER_EQUIP.id, weight: iw, reps: ir, est1RM: inner1RM },
      outer: { equipment: OUTER_EQUIP.id, weight: ow, reps: or, est1RM: outer1RM },
      date: new Date().toISOString().slice(0, 10),
    };
    onComplete(result);
  };

  return (
    <div className="rounded-2xl p-5 bg-neutral-950 border border-neutral-800 space-y-5">
      <div className="flex items-center gap-2">
        <button type="button" onClick={onBack} className="p-1 rounded-lg hover:bg-neutral-800 text-neutral-400">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="font-bebas text-lg text-white">{category.icon} {category.label} 테스트</h2>
      </div>

      <div>
        <p className="text-xs font-bold text-neutral-400 mb-3">── 전면 / 후면 비율 ──</p>
        <WeightRepsInput label={QUAD_EQUIP.name} weight={quadWeight} setWeight={setQuadWeight} reps={quadReps} setReps={setQuadReps} />
        <div className="mt-3">
          <p className="text-xs text-neutral-500 mb-2">레그컬 (후면) — 라잉 or 시티드 택1</p>
          <div className="flex gap-2 mb-2">
            {HAM_OPTIONS.map((o) => (
              <button key={o.id} type="button" onClick={() => setHamChoice(o.id as "lyingcurl" | "seatedcurl")}
                className={`px-3 py-1.5 rounded-lg text-xs ${hamChoice === o.id ? "bg-violet-500/20 text-violet-400 border border-violet-500/50" : "bg-neutral-900 text-neutral-500 border border-neutral-800"}`}>
                {o.name}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input type="number" inputMode="decimal" value={hamWeight} onChange={(e) => setHamWeight(e.target.value)} placeholder="중량"
              className="flex-1 font-mono text-sm bg-neutral-900 border border-neutral-700 px-3 py-2 rounded-lg text-white focus:border-lime-400 focus:outline-none" />
            <input type="number" inputMode="numeric" value={hamReps} onChange={(e) => setHamReps(e.target.value)} placeholder="횟수"
              className="w-20 font-mono text-sm bg-neutral-900 border border-neutral-700 px-3 py-2 rounded-lg text-white focus:border-lime-400 focus:outline-none" />
            <span className="text-neutral-500 text-sm self-center">회</span>
          </div>
        </div>
        {(quad1RM > 0 || ham1RM > 0) && (
          <p className={`text-xs mt-2 ${frontBackRatio >= 60 && frontBackRatio <= 80 ? "text-lime-400" : "text-orange-400"}`}>
            → 후면/전면 비율: {frontBackRatio}% (이상: 60–80%) {frontBackDiagnosis}
          </p>
        )}
      </div>

      <div>
        <p className="text-xs font-bold text-neutral-400 mb-3">── 내측 / 외측 비율 ──</p>
        <WeightRepsInput label={INNER_EQUIP.name} weight={innerWeight} setWeight={setInnerWeight} reps={innerReps} setReps={setInnerReps} />
        <div className="mt-3">
          <WeightRepsInput label={OUTER_EQUIP.name} weight={outerWeight} setWeight={setOuterWeight} reps={outerReps} setReps={setOuterReps} />
        </div>
        {(inner1RM > 0 || outer1RM > 0) && (
          <p className={`text-xs mt-2 ${innerOuterRatio >= 80 && innerOuterRatio <= 100 ? "text-lime-400" : "text-orange-400"}`}>
            → 내측/외측 비율: {innerOuterRatio}% (이상: 80–100%) {innerOuterDiagnosis}
          </p>
        )}
      </div>

      <button type="button" onClick={handleSubmit} disabled={!allFilled}
        className={`w-full py-4 rounded-xl font-bold text-sm ${allFilled ? "bg-lime-500 text-black hover:bg-lime-400" : "bg-neutral-800 text-neutral-600 pointer-events-none"}`}>
        기록 완료
      </button>
    </div>
  );
}
