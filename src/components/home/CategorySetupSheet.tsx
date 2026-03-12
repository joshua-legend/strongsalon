"use client";

import { createPortal } from "react-dom";
import { useGoal } from "@/context/GoalContext";
import { useProfile } from "@/context/ProfileContext";
import { useInbody } from "@/context/InbodyContext";
import { useChartData } from "@/context/ChartDataContext";
import type { ChartMetricKey } from "@/types/chartData";
import type { CategoryId } from "@/types/categorySettings";
import type { CategorySetting } from "@/types/categorySettings";
import type { GoalId } from "@/types/goalSetting";
import type { StrengthChartOption, CardioChartOption, InbodyChartOption } from "@/utils/goalChartData";
import InbodySetup from "./setup/InbodySetup";
import InbodySingleSetup from "./setup/InbodySingleSetup";
import StrengthSetup from "./setup/StrengthSetup";
import FitnessSetup from "./setup/FitnessSetup";
import StrengthSingleSetup from "./setup/StrengthSingleSetup";
import FitnessSingleSetup from "./setup/FitnessSingleSetup";

interface CategorySetupSheetProps {
  open: boolean;
  onClose: () => void;
  categoryId: CategoryId;
  primaryGoal: GoalId | null;
  /** 스트렝스/체력/인바디 종목별 단일 설정 시 사용 */
  metric?: StrengthChartOption | CardioChartOption | InbodyChartOption;
  onComplete?: () => void;
}

function addStartPointsForCategory(
  addStartPoint: (key: ChartMetricKey, value: number, configuredAt: string) => void,
  categoryId: CategoryId,
  setting: CategorySetting,
  metric?: StrengthChartOption | CardioChartOption | InbodyChartOption
): void {
  const configuredAt = setting.configuredAt;
  const startValues = setting.startValues;
  if (!configuredAt || !startValues) return;

  if (categoryId === "inbody") {
    if (metric && ["fatPercent", "muscleMass", "weight"].includes(metric)) {
      const key = metric === "fatPercent" ? "fatPercent" : metric === "muscleMass" ? "muscleMass" : "weight";
      const chartKey = `inbody.${key}` as "inbody.fatPercent" | "inbody.muscleMass" | "inbody.weight";
      const val = startValues[key];
      if (typeof val === "number")
        addStartPoint(chartKey, val, configuredAt);
    } else {
      if (typeof startValues.weight === "number")
        addStartPoint("inbody.weight", startValues.weight, configuredAt);
      if (typeof startValues.muscleMass === "number")
        addStartPoint("inbody.muscleMass", startValues.muscleMass, configuredAt);
      if (typeof startValues.fatPercent === "number")
        addStartPoint("inbody.fatPercent", startValues.fatPercent, configuredAt);
    }
  } else if (categoryId === "strength") {
    if (metric && ["squat", "bench", "deadlift"].includes(metric)) {
      const val = startValues[metric];
      if (typeof val === "number")
        addStartPoint(`strength.${metric}` as "strength.squat" | "strength.bench" | "strength.deadlift", val, configuredAt);
    } else {
      if (typeof startValues.squat === "number")
        addStartPoint("strength.squat", startValues.squat, configuredAt);
      if (typeof startValues.bench === "number")
        addStartPoint("strength.bench", startValues.bench, configuredAt);
      if (typeof startValues.deadlift === "number")
        addStartPoint("strength.deadlift", startValues.deadlift, configuredAt);
    }
    if (typeof startValues.total === "number")
      addStartPoint("strength.total", startValues.total, configuredAt);
  } else if (categoryId === "fitness") {
    const runKey = metric === "run5k" ? "running" : metric === "row2k" ? "rowing" : metric === "skierg" ? "skierg" : null;
    if (runKey && typeof startValues[runKey] === "number") {
      addStartPoint(`fitness.${runKey}` as "fitness.running" | "fitness.rowing" | "fitness.skierg", startValues[runKey], configuredAt);
    } else if (!metric) {
      if (typeof startValues.running === "number")
        addStartPoint("fitness.running", startValues.running, configuredAt);
      if (typeof startValues.rowing === "number")
        addStartPoint("fitness.rowing", startValues.rowing, configuredAt);
      if (typeof startValues.skierg === "number")
        addStartPoint("fitness.skierg", startValues.skierg, configuredAt);
    }
    if (typeof startValues.total === "number")
      addStartPoint("fitness.total", startValues.total, configuredAt);
  }
}

export default function CategorySetupSheet({
  open,
  onClose,
  categoryId,
  primaryGoal,
  metric,
  onComplete,
}: CategorySetupSheetProps) {
  const { setCategorySetting, categorySettings } = useGoal();
  const { profile } = useProfile();
  const { addInbodyRecord } = useInbody();
  const { addStartPoint } = useChartData();
  const existingSetting = categorySettings[categoryId];

  const handleComplete = (setting: CategorySetting) => {
    setCategorySetting(categoryId, setting);
    addStartPointsForCategory(addStartPoint, categoryId, setting, metric);
    if (categoryId === "inbody" && setting.configuredAt && setting.startValues) {
      const { weight, muscleMass, fatPercent } = setting.startValues;
      if (typeof weight === "number" && typeof muscleMass === "number" && typeof fatPercent === "number") {
        const fatMass = Math.round(weight * (fatPercent / 100) * 10) / 10;
        addInbodyRecord({
          date: setting.configuredAt,
          weight,
          muscleMass,
          fatMass,
          fatPercent,
        });
      }
    }
    onComplete?.();
    onClose();
  };

  const handleBack = () => onClose();

  if (!open) return null;

  const sheet = (
    <div
      className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="relative z-[10000] w-full max-w-[min(100vw,28rem)] min-w-0 rounded-t-2xl bg-neutral-950 border border-neutral-800 p-5 pb-8 max-h-[85vh] overflow-y-auto overflow-x-hidden box-border"
        onClick={(e) => e.stopPropagation()}
      >
        {categoryId === "inbody" && metric && ["fatPercent", "muscleMass", "weight"].includes(metric) && (
          <InbodySingleSetup
            metric={metric as InbodyChartOption}
            profile={profile ?? null}
            existingSetting={existingSetting}
            onComplete={handleComplete}
            onBack={handleBack}
          />
        )}
        {categoryId === "inbody" && !metric && profile && (
          <InbodySetup
            profile={profile}
            primaryGoal={primaryGoal}
            onComplete={handleComplete}
            onBack={handleBack}
          />
        )}
        {categoryId === "strength" && metric && ["squat", "bench", "deadlift"].includes(metric) && (
          <StrengthSingleSetup
            metric={metric as StrengthChartOption}
            profile={profile ?? null}
            existingSetting={existingSetting}
            onComplete={handleComplete}
            onBack={handleBack}
          />
        )}
        {categoryId === "strength" && !metric && (
          <StrengthSetup
            profile={profile ?? null}
            primaryGoal={primaryGoal}
            onComplete={handleComplete}
            onBack={handleBack}
          />
        )}
        {categoryId === "fitness" && metric && ["run5k", "row2k", "skierg"].includes(metric) && (
          <FitnessSingleSetup
            metric={metric as CardioChartOption}
            existingSetting={existingSetting}
            onComplete={handleComplete}
            onBack={handleBack}
          />
        )}
        {categoryId === "fitness" && !metric && (
          <FitnessSetup
            profile={profile ?? null}
            primaryGoal={primaryGoal}
            onComplete={handleComplete}
            onBack={handleBack}
          />
        )}
      </div>
    </div>
  );

  return createPortal(sheet, document.body);
}
