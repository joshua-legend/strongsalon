import { Scale, Dumbbell, Activity } from "lucide-react";
import type { GoalId } from "@/types/goalSetting";

export interface GoalOption {
  id: GoalId;
  label: string;
  desc: string;
  icon: typeof Scale;
  color: string;
}

export const goalOptions: GoalOption[] = [
  {
    id: "diet",
    label: "살 빼기",
    desc: "체지방 감량 + 근육 유지",
    icon: Scale,
    color: "#a3e635",
  },
  {
    id: "strength",
    label: "스트렝스",
    desc: "3대 운동 1RM 향상",
    icon: Dumbbell,
    color: "#a3e635",
  },
  {
    id: "fitness",
    label: "체력",
    desc: "유산소 수행능력 향상",
    icon: Activity,
    color: "#a3e635",
  },
];
