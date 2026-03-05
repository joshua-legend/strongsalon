"use client";

import { useState, useEffect } from "react";
import AnimalTierHero from "./AnimalTierHero";
import TierDistributionModal from "./TierDistributionModal";
import BalanceDashboard from "./BalanceDashboard";
import TestInput from "./TestInput";
import TestResult from "./TestResult";
import WildChallengeCards from "./WildChallengeCards";
import type { AbilityResults, AbilityResult } from "@/types";
import { ABILITY_CATEGORIES, loadAbilityResults, saveAbilityResults } from "@/config/abilityConfig";
import { useQuest } from "@/context/QuestContext";
import { member } from "@/data/member";

type TestScreen = null | "input" | "result";

export default function PerformanceTab() {
  const { userProfile } = useQuest();
  const [showTierModal, setShowTierModal] = useState(false);
  const [abilityResults, setAbilityResults] = useState<AbilityResults>(
    loadAbilityResults
  );
  const [testScreen, setTestScreen] = useState<TestScreen>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<
    keyof AbilityResults | null
  >(null);
  const [fullTestMode, setFullTestMode] = useState(false);
  const [fullTestIndex, setFullTestIndex] = useState(0);
  const [lastResult, setLastResult] = useState<AbilityResult | null>(null);
  const [prevResultForDisplay, setPrevResultForDisplay] =
    useState<AbilityResult | null>(null);
  const [showWeightPrompt, setShowWeightPrompt] = useState(false);
  const [tempWeight, setTempWeight] = useState("");

  const bodyweight =
    userProfile?.weight ??
    member?.bodyComp?.weight ??
    (tempWeight ? parseFloat(tempWeight) || 0 : 0);

  useEffect(() => {
    saveAbilityResults(abilityResults);
  }, [abilityResults]);

  const activeCategory = activeCategoryId
    ? ABILITY_CATEGORIES.find((c) => c.id === activeCategoryId)
    : null;

  const needsWeight = bodyweight <= 0;

  const handleCategorySelect = (id: keyof AbilityResults) => {
    if (needsWeight) {
      setShowWeightPrompt(true);
      setActiveCategoryId(id);
      setFullTestMode(false);
      return;
    }
    setActiveCategoryId(id);
    setFullTestMode(false);
    setTestScreen("input");
  };

  const handleFullTestStart = () => {
    if (needsWeight) {
      setShowWeightPrompt(true);
      setFullTestMode(true);
      setFullTestIndex(0);
      setActiveCategoryId("lowerStrength");
      return;
    }
    setFullTestMode(true);
    setFullTestIndex(0);
    setActiveCategoryId("lowerStrength");
    setTestScreen("input");
  };

  const handleWeightPromptConfirm = () => {
    const w = parseFloat(tempWeight);
    if (w > 0 && w < 300) {
      setTempWeight(String(w));
      setShowWeightPrompt(false);
      if (activeCategoryId) {
        setTestScreen("input");
      }
    }
  };

  const handleInputComplete = (result: AbilityResult) => {
    if (!activeCategoryId) return;
    const prev = abilityResults[activeCategoryId];
    setAbilityResults((r) => ({ ...r, [activeCategoryId]: result }));
    setLastResult(result);
    setPrevResultForDisplay(prev);
    setTestScreen("result");
  };

  const handleResultConfirm = () => {
    if (fullTestMode && fullTestIndex < 4) {
      setFullTestIndex((i) => i + 1);
      const nextCat = ABILITY_CATEGORIES[fullTestIndex + 1];
      setActiveCategoryId(nextCat.id);
      setTestScreen("input");
    } else {
      setTestScreen(null);
      setActiveCategoryId(null);
      setFullTestMode(false);
    }
  };

  const handleResultRetry = () => {
    setTestScreen("input");
  };

  return (
    <div className="px-4 py-4 flex flex-col gap-4">
      <div className="fade-up">
        <AnimalTierHero onOpenTierDistribution={() => setShowTierModal(true)} />
      </div>

      <TierDistributionModal
        open={showTierModal}
        onClose={() => setShowTierModal(false)}
      />

      {showWeightPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="rounded-2xl p-6 bg-neutral-900 border border-neutral-800 w-full max-w-sm">
            <h3 className="font-bebas text-lg text-white mb-2">
              측정 전 체중 입력
            </h3>
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
              <button
                type="button"
                onClick={() => {
                  setShowWeightPrompt(false);
                  setActiveCategoryId(null);
                  setFullTestMode(false);
                }}
                className="flex-1 py-3 rounded-xl font-bold bg-neutral-800 text-neutral-300"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleWeightPromptConfirm}
                disabled={!tempWeight || parseFloat(tempWeight) <= 0}
                className="flex-1 py-3 rounded-xl font-bold bg-lime-500 text-black disabled:opacity-40 disabled:pointer-events-none"
              >
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
            onBack={() => {
              setTestScreen(null);
              setActiveCategoryId(null);
              setFullTestMode(false);
            }}
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
