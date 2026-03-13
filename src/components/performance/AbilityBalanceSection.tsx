"use client";

import BalanceDashboard from "./BalanceDashboard";
import TestInput from "./TestInput";
import TestResult from "./TestResult";
import { usePerformanceTab } from "./usePerformanceTab";

export default function AbilityBalanceSection() {
  const {
    abilityResults,
    testScreen,
    activeCategory,
    lastResult,
    prevResultForDisplay,
    showWeightPrompt,
    tempWeight,
    setTempWeight,
    bodyweight,
    handleCategorySelect,
    handleFullTestStart,
    handleWeightPromptConfirm,
    handleWeightPromptCancel,
    handleInputComplete,
    handleResultConfirm,
    handleResultRetry,
    handleBackFromInput,
  } = usePerformanceTab();

  return (
    <>
      {showWeightPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
          <div className="rounded-2xl p-6 w-full max-w-sm" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-light)" }}>
            <h3 className="font-bebas text-lg font-bold mb-2" style={{ color: "var(--text-main)" }}>측정 전 체중 입력</h3>
            <p className="text-sm mb-4" style={{ color: "var(--text-sub)" }}>
              체중 대비 점수 계산을 위해 현재 체중(kg)을 입력해주세요.
            </p>
            <input
              type="number"
              inputMode="decimal"
              value={tempWeight}
              onChange={(e) => setTempWeight(e.target.value)}
              placeholder="예: 75"
              className="w-full font-mono text-lg px-4 py-3 rounded-xl focus:outline-none focus:border-[var(--border-focus)] mb-4"
              style={{ backgroundColor: "var(--bg-body)", border: "1px solid var(--border-light)", color: "var(--text-main)" }}
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleWeightPromptCancel}
                className="flex-1 py-3 rounded-xl font-bold transition-colors"
                style={{ backgroundColor: "var(--bg-card)", color: "var(--text-main)", border: "1px solid var(--border-light)" }}
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleWeightPromptConfirm}
                disabled={!tempWeight || parseFloat(tempWeight) <= 0}
                className="flex-1 py-3 rounded-xl font-bold disabled:opacity-40 disabled:pointer-events-none transition-colors hover:brightness-110"
                style={{ backgroundColor: "var(--accent-main)", color: "var(--accent-text)" }}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {testScreen === null && (
        <BalanceDashboard
          results={abilityResults}
          onCategorySelect={handleCategorySelect}
          onFullTestStart={handleFullTestStart}
        />
      )}

      {testScreen === "input" && activeCategory && bodyweight > 0 && (
        <TestInput
          category={activeCategory}
          bodyweight={bodyweight}
          onComplete={handleInputComplete}
          onBack={handleBackFromInput}
        />
      )}

      {testScreen === "result" && activeCategory && lastResult && (
        <TestResult
          category={activeCategory}
          result={lastResult}
          prevResult={prevResultForDisplay}
          onConfirm={handleResultConfirm}
          onRetry={handleResultRetry}
        />
      )}
    </>
  );
}
