"use client";

import { useState } from "react";
import type {
  GoalPurpose,
  GoalInputs,
  GoalDuration,
  ActiveGoal,
  WeekStatus,
} from "@/types";
import {
  MetricRow,
  getDefaultInputs,
  buildActiveGoal,
  getWeeklyTarget,
  updateInputsTarget,
} from "./goalTrackerUtils";
import { useAuth } from "@/context/AuthContext";
import GoalTrackerSetup from "./GoalTrackerSetup";
import GoalTrackerActive from "./GoalTrackerActive";

export default function GoalTracker() {
  const { accountData, updateAccountData } = useAuth();
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [purpose, setPurpose] = useState<GoalPurpose | null>(null);
  const [inputs, setInputs] = useState<Partial<GoalInputs>>({});
  const [duration, setDuration] = useState<GoalDuration | null>(null);

  const activeGoal = accountData?.activeGoal ?? null;
  const hasTarget = !!activeGoal;

  const handleConfirm = () => {
    if (!purpose || !duration) return;
    const base = getDefaultInputs(purpose);
    const merged = { ...base, ...inputs } as GoalInputs;
    const goal = buildActiveGoal(purpose, merged, duration);
    updateAccountData((prev) => ({ ...prev, activeGoal: goal }));
    setStep(0);
    setPurpose(null);
    setInputs({});
    setDuration(null);
  };

  const handleStartOver = () => {
    updateAccountData((prev) => ({ ...prev, activeGoal: null }));
    setStep(0);
    setPurpose(null);
    setInputs({});
    setDuration(null);
  };

  const handlePurposeSelect = (p: GoalPurpose) => {
    setPurpose(p);
    setInputs(getDefaultInputs(p));
    setStep(2);
  };

  const handleSuccess = (metricKey: string, weekIndex: number) => {
    if (!activeGoal) return;
    const wa = activeGoal.weeklyAchievements ?? {};
    const arr = [...(wa[metricKey] ?? Array(activeGoal.duration).fill(null))];
    arr[weekIndex] = "success";
    const next = { ...activeGoal, weeklyAchievements: { ...wa, [metricKey]: arr } };
    updateAccountData((prev) => ({ ...prev, activeGoal: next }));
  };

  const handleFail = (metricKey: string, weekIndex: number, row: MetricRow) => {
    if (!activeGoal) return;
    const dur = activeGoal.duration;
    const failedWeekTarget = getWeeklyTarget(row.current, row.target, weekIndex, dur);
    const newInputs = updateInputsTarget(activeGoal.inputs, metricKey, failedWeekTarget);
    const wa = activeGoal.weeklyAchievements ?? {};
    const arr = [...(wa[metricKey] ?? Array(dur).fill(null))];
    const newArr: WeekStatus[] = [...arr.slice(0, weekIndex), "fail", ...arr.slice(weekIndex + 1), null];
    const next: ActiveGoal = {
      ...activeGoal,
      inputs: newInputs,
      duration: dur + 1,
      weeklyAchievements: { ...wa, [metricKey]: newArr },
    };
    updateAccountData((prev) => ({ ...prev, activeGoal: next }));
  };

  if (hasTarget && activeGoal) {
    return (
      <GoalTrackerActive
        activeGoal={activeGoal}
        onSuccess={handleSuccess}
        onFail={handleFail}
        onReset={handleStartOver}
      />
    );
  }

  return (
    <GoalTrackerSetup
      step={step}
      purpose={purpose}
      inputs={inputs}
      duration={duration}
      onStepChange={setStep}
      onPurposeSelect={handlePurposeSelect}
      onInputsChange={setInputs}
      onDurationSelect={setDuration}
      onConfirm={handleConfirm}
    />
  );
}
