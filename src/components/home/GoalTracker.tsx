"use client";

import { useState, useEffect } from "react";
import type {
  GoalPurpose,
  GoalInputs,
  GoalDuration,
  ActiveGoal,
  WeekStatus,
} from "@/types";
import {
  STORAGE_KEY,
  MetricRow,
  getDefaultInputs,
  buildActiveGoal,
  getWeeklyTarget,
  updateInputsTarget,
  getMetricRows,
} from "./goalTrackerUtils";
import GoalTrackerSetup from "./GoalTrackerSetup";
import GoalTrackerActive from "./GoalTrackerActive";

export default function GoalTracker() {
  const [hasTarget, setHasTarget] = useState(false);
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [purpose, setPurpose] = useState<GoalPurpose | null>(null);
  const [inputs, setInputs] = useState<Partial<GoalInputs>>({});
  const [duration, setDuration] = useState<GoalDuration | null>(null);
  const [activeGoal, setActiveGoal] = useState<ActiveGoal | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ActiveGoal;
        if (!parsed.originalInputs) {
          parsed.originalInputs = parsed.inputs;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        }
        if (!parsed.weeklyAchievements) {
          const d = parsed.duration as GoalDuration;
          const goal = buildActiveGoal(parsed.purpose, parsed.inputs, d);
          parsed.weeklyAchievements = goal.weeklyAchievements;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        } else {
          const wa = parsed.weeklyAchievements as Record<string, unknown[]>;
          let migrated = false;
          for (const k of Object.keys(wa)) {
            const arr = wa[k];
            if (Array.isArray(arr) && arr.some((v) => typeof v === "boolean")) {
              wa[k] = arr.map((v) => (v === true ? "success" : null));
              migrated = true;
            }
          }
          if (migrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        }
        setActiveGoal(parsed);
        setHasTarget(true);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleConfirm = () => {
    if (!purpose || !duration) return;
    const base = getDefaultInputs(purpose);
    const merged = { ...base, ...inputs } as GoalInputs;
    const goal = buildActiveGoal(purpose, merged, duration);
    setActiveGoal(goal);
    setHasTarget(true);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(goal)); } catch { /* ignore */ }
    setStep(0); setPurpose(null); setInputs({}); setDuration(null);
  };

  const handleStartOver = () => {
    setHasTarget(false); setActiveGoal(null);
    setStep(0); setPurpose(null); setInputs({}); setDuration(null);
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  };

  const handlePurposeSelect = (p: GoalPurpose) => {
    setPurpose(p);
    setInputs(getDefaultInputs(p));
    setStep(2);
  };

  const handleSuccess = (metricKey: string, weekIndex: number) => {
    setActiveGoal((prev) => {
      if (!prev) return prev;
      const wa = prev.weeklyAchievements ?? {};
      const arr = [...(wa[metricKey] ?? Array(prev.duration).fill(null))];
      arr[weekIndex] = "success";
      const next = { ...prev, weeklyAchievements: { ...wa, [metricKey]: arr } };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  };

  const handleFail = (metricKey: string, weekIndex: number, row: MetricRow) => {
    setActiveGoal((prev) => {
      if (!prev) return prev;
      const dur = prev.duration;
      const failedWeekTarget = getWeeklyTarget(row.current, row.target, weekIndex, dur);
      const newInputs = updateInputsTarget(prev.inputs, metricKey, failedWeekTarget);
      const wa = prev.weeklyAchievements ?? {};
      const arr = [...(wa[metricKey] ?? Array(dur).fill(null))];
      const newArr: WeekStatus[] = [...arr.slice(0, weekIndex), "fail", ...arr.slice(weekIndex + 1), null];
      const next: ActiveGoal = {
        ...prev,
        inputs: newInputs,
        duration: dur + 1,
        weeklyAchievements: { ...wa, [metricKey]: newArr },
      };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
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
