import { Scale, Dumbbell, Activity } from "lucide-react";

export type GoalId = "diet" | "strength" | "fitness";

export interface GoalOption {
  id: GoalId;
  label: string;
  desc: string;
  metric: "weight" | "estimated1RM" | "cardioTime";
  unit: string;
  weeklyDelta: number;
}

export interface GoalOptionWithIcon extends GoalOption {
  Icon: typeof Scale;
}

export const goalOptions: GoalOptionWithIcon[] = [
  {
    id: "diet",
    label: "다이어트",
    desc: "체지방 감량 + 근육 성장 병행",
    metric: "weight",
    unit: "kg",
    weeklyDelta: -0.5,
    Icon: Scale,
  },
  {
    id: "strength",
    label: "근력 스트렝스",
    desc: "주요 복합 운동 1RM 향상",
    metric: "estimated1RM",
    unit: "kg",
    weeklyDelta: 2.5,
    Icon: Dumbbell,
  },
  {
    id: "fitness",
    label: "체력 상승",
    desc: "유산소 수행능력 향상",
    metric: "cardioTime",
    unit: "분",
    weeklyDelta: 2,
    Icon: Activity,
  },
];
