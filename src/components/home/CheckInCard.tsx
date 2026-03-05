"use client";

import { useState } from "react";
import { useQuest } from "@/context/QuestContext";

export default function CheckInCard() {
  const { userProfile, activeQuest, recordWeek } = useQuest();
  const [inputValue, setInputValue] = useState("");

  if (!userProfile || !activeQuest) return null;

  const { purpose } = userProfile;
  const { latestMetric, currentWeek } = activeQuest;
  const weekTargetRaw = latestMetric + purpose.weeklyDelta;
  const weekTarget = Math.ceil(weekTargetRaw * 100) / 100;
  const numVal = parseFloat(inputValue);
  const isValidNum = !isNaN(numVal) && numVal > 0;
  const passed =
    isValidNum &&
    (purpose.weeklyDelta < 0 ? numVal <= weekTarget : numVal >= weekTarget);

  const handleRecord = () => {
    if (!isValidNum) return;
    recordWeek(numVal);
    setInputValue("");
  };

  const inputState = !inputValue || !isValidNum ? "idle" : passed ? "pass" : "fail";

  const cardBorder =
    inputState === "idle"
      ? "border-neutral-800"
      : inputState === "pass"
        ? "border-lime-400/30"
        : "border-orange-400/20";

  const inputColor =
    inputState === "idle"
      ? "text-neutral-600 border-neutral-700"
      : inputState === "pass"
        ? "text-lime-400 border-lime-400"
        : "text-orange-400 border-orange-400";

  return (
    <div
      className={`rounded-2xl p-5 bg-neutral-900 border transition-colors ${cardBorder}`}
    >
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-bold text-neutral-400">
          W{currentWeek} 체크인
        </span>
        <div className="bg-neutral-950 px-2.5 py-1 rounded-lg border border-neutral-800/50 flex items-baseline gap-1">
          <span className="text-[9px] text-neutral-500">목표</span>
          <span className="font-mono text-xs font-bold text-white">
            {purpose.weeklyDelta < 0 ? "≤" : "≥"}
            {weekTarget}
          </span>
          <span className="text-[9px] text-neutral-600">{purpose.unit}</span>
        </div>
      </div>

      {/* 입력 - 단위 한쪽만 */}
      <div className="flex items-center justify-center gap-2 mb-3">
        <input
          type="number"
          inputMode="decimal"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="0.0"
          className={`flex-1 max-w-[160px] text-center font-bebas text-5xl bg-transparent border-b-2 focus:outline-none transition-colors ${inputColor}`}
        />
        <span className={`font-mono text-base ${inputState === "idle" ? "text-neutral-600" : inputState === "pass" ? "text-lime-400" : "text-orange-400"}`}>
          {purpose.unit}
        </span>
      </div>

      {/* 피드백 pill */}
      <div className="h-7 flex items-center justify-center mb-4">
        {inputState === "pass" && (
          <span className="px-3 py-1 rounded-full bg-lime-400/10 text-lime-400 text-xs font-bold fade-slide-up">
            ✓ 목표 달성!
          </span>
        )}
        {inputState === "fail" && (
          <span className="px-3 py-1 rounded-full bg-orange-400/10 text-orange-400 text-xs font-bold fade-slide-up">
            ⚠ 재도전
          </span>
        )}
      </div>

      {/* CTA */}
      <button
        onClick={handleRecord}
        disabled={!isValidNum}
        className={`w-full py-3 rounded-xl font-bold text-base transition-all ${
          !isValidNum
            ? "bg-neutral-800 text-neutral-600 pointer-events-none"
            : passed
              ? "bg-lime-400 text-black shadow-[0_0_15px_rgba(163,230,53,0.3)]"
              : "bg-neutral-100 text-neutral-900 shadow-lg"
        }`}
      >
        {!isValidNum
          ? "측정값을 입력해주세요"
          : passed
            ? "기록 완료 ✓"
            : "기록 완료"}
      </button>
    </div>
  );
}
