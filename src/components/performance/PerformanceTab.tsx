"use client";

import AnimalTierHero from "./AnimalTierHero";
import TierDistributionModal from "./TierDistributionModal";
import BalanceDashboard from "./BalanceDashboard";
import TestInput from "./TestInput";
import TestResult from "./TestResult";
import WildChallengeCards from "./WildChallengeCards";
import { usePerformanceTab } from "./usePerformanceTab";

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="rounded-2xl p-6 bg-neutral-900 border border-neutral-800 w-full max-w-sm">
            <h3 className="font-bebas text-lg text-white mb-2">측정 전 체중 입력</h3>
            <p className="text-sm text-neutral-400 mb-4">
              체중 대비 점수 계산을 위해 현재 체중(kg)을 입력해주세요.
            </p>
            <input
              type="number"
              inputMode="decimal"
              value={tempWeight}
              onChange={(e) => setTempWeight(e.target.value)}
              placeholder="예: 75"
              className="w-full font-mono text-lg bg-neutral-800 border border-neutral-700 px-4 py-3 rounded-xl text-white focus:border-lime-400 focus:outline-none mb-4"
            />
            <div className="flex gap-2">
              <button type="button" onClick={handleWeightPromptCancel}
                className="flex-1 py-3 rounded-xl font-bold bg-neutral-800 text-neutral-300">
                취소
              </button>
              <button type="button" onClick={handleWeightPromptConfirm}
                disabled={!tempWeight || parseFloat(tempWeight) <= 0}
                className="flex-1 py-3 rounded-xl font-bold bg-lime-500 text-black disabled:opacity-40 disabled:pointer-events-none">
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
