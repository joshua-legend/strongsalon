import type {
  GoalPurpose,
  GoalInputs,
  GoalDuration,
  ActiveGoal,
  WeekStatus,
} from "@/types";
import { Scale, Zap, Dumbbell, Flame } from "lucide-react";

export const STORAGE_KEY = "fitlog-active-goal";

export const PURPOSE_CONFIG: Record<
  GoalPurpose,
  { label: string; wildLabel: string; Icon: typeof Scale; color: string; borderHover: string }
> = {
  다이어트: {
    label: "다이어트",
    wildLabel: "날렵한 표범 다이어트",
    Icon: Scale,
    color: "text-cyan-400",
    borderHover:
      "group-hover:border-cyan-400/50 group-hover:shadow-[0_0_10px_rgba(34,211,238,0.2)]",
  },
  벌크업: {
    label: "벌크업",
    wildLabel: "거대한 곰 벌크업",
    Icon: Zap,
    color: "text-orange-500",
    borderHover:
      "group-hover:border-orange-500/50 group-hover:shadow-[0_0_10px_rgba(249,115,22,0.2)]",
  },
  스트렝스: {
    label: "스트렝스",
    wildLabel: "코뿔소 돌진 스트렝스",
    Icon: Dumbbell,
    color: "text-orange-500",
    borderHover:
      "group-hover:border-orange-500/50 group-hover:shadow-[0_0_10px_rgba(249,115,22,0.2)]",
  },
  바디프로필: {
    label: "바디프로필",
    wildLabel: "독수리 데피니션",
    Icon: Flame,
    color: "text-purple-400",
    borderHover:
      "group-hover:border-purple-400/50 group-hover:shadow-[0_0_10px_rgba(192,132,252,0.2)]",
  },
};

export const DURATION_OPTIONS: GoalDuration[] = [4, 8, 12];

export type MetricRow = { key: string; label: string; current: number; target: number; unit: string };

/** n주차 목표 수치 (선형 보간) */
export function getWeeklyTarget(
  current: number,
  target: number,
  weekIndex: number,
  totalWeeks: number,
): number {
  const ratio = (weekIndex + 1) / totalWeeks;
  const val = current + (target - current) * ratio;
  return Math.round(val * 10) / 10;
}

/** n주차 데드라인 → YYYY-MM-DD */
export function getWeekDeadline(startDate: string, weekIndex: number): string {
  const d = new Date(startDate);
  d.setDate(d.getDate() + (weekIndex + 1) * 7);
  return d.toISOString().slice(0, 10);
}

export function getDefaultInputs(purpose: GoalPurpose): GoalInputs {
  switch (purpose) {
    case "다이어트":
      return { purpose: "다이어트", current: 70, target: 65, unit: "kg" };
    case "벌크업":
      return {
        purpose: "벌크업",
        weightCurrent: 70,
        weightTarget: 75,
        muscleCurrent: 30,
        muscleTarget: 35,
      };
    case "스트렝스":
      return {
        purpose: "스트렝스",
        squat: 100,
        bench: 80,
        deadlift: 120,
        targetSquat: 120,
        targetBench: 100,
        targetDeadlift: 150,
      };
    case "바디프로필":
      return {
        purpose: "바디프로필",
        fatPctCurrent: 25,
        fatPctTarget: 18,
        weightCurrent: 70,
        weightTarget: 65,
      };
  }
}

export function buildActiveGoal(
  purpose: GoalPurpose,
  inputs: GoalInputs,
  duration: GoalDuration,
): ActiveGoal {
  const startDate = new Date().toISOString();
  let title = "";
  let subtitle = "";

  switch (purpose) {
    case "다이어트": {
      const i = inputs as Extract<GoalInputs, { purpose: "다이어트" }>;
      title = `${i.current}kg → ${i.target}kg`;
      subtitle = `체중 감량 목표, ${duration}주 프로토콜`;
      break;
    }
    case "벌크업": {
      const i = inputs as Extract<GoalInputs, { purpose: "벌크업" }>;
      title = `체중 ${i.weightCurrent}→${i.weightTarget}kg, 근육 ${i.muscleCurrent}→${i.muscleTarget}kg`;
      subtitle = `벌크업 ${duration}주 프로토콜`;
      break;
    }
    case "스트렝스": {
      const i = inputs as Extract<GoalInputs, { purpose: "스트렝스" }>;
      title = `3대 ${i.squat + i.bench + i.deadlift}kg → ${i.targetSquat + i.targetBench + i.targetDeadlift}kg`;
      subtitle = `스트렝스 ${duration}주 프로토콜`;
      break;
    }
    case "바디프로필": {
      const i = inputs as Extract<GoalInputs, { purpose: "바디프로필" }>;
      title = `체지방 ${i.fatPctCurrent}% → ${i.fatPctTarget}%`;
      subtitle = `바디프로필 ${duration}주 프로토콜`;
      break;
    }
  }

  const weeklyAchievements: Record<string, WeekStatus[]> = {};
  switch (purpose) {
    case "다이어트":
      weeklyAchievements.weight = Array(duration).fill(null);
      break;
    case "벌크업":
      weeklyAchievements.weight = Array(duration).fill(null);
      weeklyAchievements.muscle = Array(duration).fill(null);
      break;
    case "스트렝스":
      weeklyAchievements.squat = Array(duration).fill(null);
      weeklyAchievements.bench = Array(duration).fill(null);
      weeklyAchievements.deadlift = Array(duration).fill(null);
      break;
    case "바디프로필":
      weeklyAchievements.fatPct = Array(duration).fill(null);
      weeklyAchievements.weight = Array(duration).fill(null);
      break;
  }

  return {
    purpose,
    inputs,
    originalInputs: inputs,
    duration,
    title,
    subtitle,
    startDate,
    weeklyAchievements,
  };
}

/** 실패 시 해당 지표의 목표치를 새 값으로 업데이트 */
export function updateInputsTarget(
  inputs: GoalInputs,
  metricKey: string,
  newTarget: number,
): GoalInputs {
  switch (inputs.purpose) {
    case "다이어트":
      return { ...inputs, target: newTarget };
    case "벌크업":
      if (metricKey === "weight") return { ...inputs, weightTarget: newTarget };
      return { ...inputs, muscleTarget: newTarget };
    case "스트렝스":
      if (metricKey === "squat") return { ...inputs, targetSquat: newTarget };
      if (metricKey === "bench") return { ...inputs, targetBench: newTarget };
      return { ...inputs, targetDeadlift: newTarget };
    case "바디프로필":
      if (metricKey === "fatPct") return { ...inputs, fatPctTarget: newTarget };
      return { ...inputs, weightTarget: newTarget };
  }
}

export function getMetricRows(inputs: GoalInputs): MetricRow[] {
  switch (inputs.purpose) {
    case "다이어트": {
      const i = inputs;
      return [{ key: "weight", label: "체중", current: i.current, target: i.target, unit: "kg" }];
    }
    case "벌크업": {
      const i = inputs;
      return [
        { key: "weight", label: "체중", current: i.weightCurrent, target: i.weightTarget, unit: "kg" },
        { key: "muscle", label: "근육량", current: i.muscleCurrent, target: i.muscleTarget, unit: "kg" },
      ];
    }
    case "스트렝스": {
      const i = inputs;
      return [
        { key: "squat", label: "스쿼트", current: i.squat, target: i.targetSquat, unit: "kg" },
        { key: "bench", label: "벤치", current: i.bench, target: i.targetBench, unit: "kg" },
        { key: "deadlift", label: "데드리프트", current: i.deadlift, target: i.targetDeadlift, unit: "kg" },
      ];
    }
    case "바디프로필": {
      const i = inputs;
      return [
        { key: "fatPct", label: "체지방률", current: i.fatPctCurrent, target: i.fatPctTarget, unit: "%" },
        { key: "weight", label: "체중", current: i.weightCurrent, target: i.weightTarget, unit: "kg" },
      ];
    }
  }
}

/** step 2 → 3 진행 가능 여부 */
export function canProceedFromStep2(purpose: GoalPurpose, inputs: Partial<GoalInputs>): boolean {
  if (!inputs || !("purpose" in inputs) || inputs.purpose !== purpose) return true;
  switch (purpose) {
    case "다이어트": {
      const cur = (inputs as { current?: number }).current ?? 70;
      const tgt = (inputs as { target?: number }).target ?? 65;
      return cur > tgt;
    }
    case "벌크업": {
      const wc = (inputs as { weightCurrent?: number }).weightCurrent ?? 70;
      const wt = (inputs as { weightTarget?: number }).weightTarget ?? 75;
      const mc = (inputs as { muscleCurrent?: number }).muscleCurrent ?? 30;
      const mt = (inputs as { muscleTarget?: number }).muscleTarget ?? 35;
      return wc < wt && mc < mt;
    }
    case "스트렝스": {
      const s = (inputs as { squat?: number }).squat ?? 100;
      const b = (inputs as { bench?: number }).bench ?? 80;
      const d = (inputs as { deadlift?: number }).deadlift ?? 120;
      const ts = (inputs as { targetSquat?: number }).targetSquat ?? 120;
      const tb = (inputs as { targetBench?: number }).targetBench ?? 100;
      const td = (inputs as { targetDeadlift?: number }).targetDeadlift ?? 150;
      return s + b + d < ts + tb + td;
    }
    case "바디프로필": {
      const fc = (inputs as { fatPctCurrent?: number }).fatPctCurrent ?? 25;
      const ft = (inputs as { fatPctTarget?: number }).fatPctTarget ?? 18;
      return fc > ft;
    }
  }
}
