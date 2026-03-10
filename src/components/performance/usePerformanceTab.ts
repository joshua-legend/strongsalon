'use client';

import { useState, useEffect, useRef } from "react";
import type { AbilityResults, AbilityResult } from "@/types";
import { ABILITY_CATEGORIES, DEFAULT_ABILITY_RESULTS, loadAbilityResults, saveAbilityResults } from "@/config/abilityConfig";
import { useProfile } from "@/context/ProfileContext";
import { useUser } from "@/context/UserContext";

type TestScreen = null | "input" | "result";

export function usePerformanceTab() {
  const { profile } = useProfile();
  const { user } = useUser();
  const [showTierModal, setShowTierModal] = useState(false);
  const [abilityResults, setAbilityResults] = useState<AbilityResults>(DEFAULT_ABILITY_RESULTS);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      setAbilityResults(loadAbilityResults());
      return;
    }
    saveAbilityResults(abilityResults);
  }, [abilityResults]);

  const [testScreen, setTestScreen] = useState<TestScreen>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<keyof AbilityResults | null>(null);
  const [fullTestMode, setFullTestMode] = useState(false);
  const [fullTestIndex, setFullTestIndex] = useState(0);
  const [lastResult, setLastResult] = useState<AbilityResult | null>(null);
  const [prevResultForDisplay, setPrevResultForDisplay] = useState<AbilityResult | null>(null);
  const [showWeightPrompt, setShowWeightPrompt] = useState(false);
  const [tempWeight, setTempWeight] = useState("");

  const bodyweight =
    profile?.weight ??
    user?.bodyComp?.weight ??
    (tempWeight ? parseFloat(tempWeight) || 0 : 0);

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
      if (activeCategoryId) setTestScreen("input");
    }
  };

  const handleWeightPromptCancel = () => {
    setShowWeightPrompt(false);
    setActiveCategoryId(null);
    setFullTestMode(false);
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

  const handleResultRetry = () => setTestScreen("input");

  const handleBackFromInput = () => {
    setTestScreen(null);
    setActiveCategoryId(null);
    setFullTestMode(false);
  };

  return {
    showTierModal, setShowTierModal,
    abilityResults,
    testScreen,
    activeCategoryId,
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
  };
}
