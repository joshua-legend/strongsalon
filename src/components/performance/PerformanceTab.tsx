"use client";

import AnimalTierHero from "./AnimalTierHero";
import TierDistributionModal from "./TierDistributionModal";
import BalanceDashboard from "./BalanceDashboard";
import TestInput from "./TestInput";
import TestResult from "./TestResult";
import WildChallengeCards from "./WildChallengeCards";
import { usePerformanceTab } from "./usePerformanceTab";

/**
 * @deprecated 챌린지 탭은 현재 비활성화 상태입니다.
 * 네비게이션에서는 노출하지 않으며, 필요 시 재활성화 예정입니다.
 */
export default function PerformanceTab() {
  const {
    showTierModal, setShowTierModal,
    abilityResults,
    testScreen,
    activeCategory,
    lastResult,
    prevResultForDisplay,
    showWeightPrompt,
    tempWeight, setTempWeight,
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
    <div className="px-4 py-4 flex flex-col gap-4">
      <div className="fade-up">
        <AnimalTierHero onOpenTierDistribution={() => setShowTierModal(true)} />
      </div>

      <TierDistributionModal open={showTierModal} onClose={() => setShowTierModal(false)} />

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
              <button type="button" onClick={handleWeightPromptCancel}
                className="flex-1 py-3 rounded-xl font-bold transition-colors"
                style={{ backgroundColor: "var(--bg-card)", color: "var(--text-main)", border: "1px solid var(--border-light)" }}>
                취소
              </button>
              <button type="button" onClick={handleWeightPromptConfirm}
                disabled={!tempWeight || parseFloat(tempWeight) <= 0}
                className="flex-1 py-3 rounded-xl font-bold disabled:opacity-40 disabled:pointer-events-none transition-colors hover:brightness-110"
                style={{ backgroundColor: "var(--accent-main)", color: "var(--accent-text)" }}>
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {testScreen === null && (
        <div className="fade-up fade-in-1">
          <BalanceDashboard
            results={abilityResults}
            onCategorySelect={handleCategorySelect}
            onFullTestStart={handleFullTestStart}
          />
        </div>
      )}

      {testScreen === "input" && activeCategory && bodyweight > 0 && (
        <div className="fade-up">
          <TestInput
            category={activeCategory}
            bodyweight={bodyweight}
            onComplete={handleInputComplete}
            onBack={handleBackFromInput}
          />
        </div>
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

      {testScreen === null && (
        <div className="fade-up fade-in-2">
          <WildChallengeCards />
        </div>
      )}

      <div className="h-4" />
    </div>
  );
}
