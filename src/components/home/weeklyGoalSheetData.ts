import type { GoalCategory } from "@/types";

export const CATEGORIES: { value: GoalCategory; label: string; icon: string }[] = [
  { value: "strength", label: "근력",   icon: "🏋️" },
  { value: "cardio",   label: "체력",   icon: "🏃" },
  { value: "attendance", label: "출석", icon: "📅" },
  { value: "body",     label: "체성분", icon: "📊" },
  { value: "weight",   label: "체중",   icon: "⚖️" },
];

export const EXERCISE_OPTIONS: { key: string; label: string }[] = [
  { key: "bench",    label: "벤치프레스" },
  { key: "squat",    label: "스쿼트" },
  { key: "deadlift", label: "데드리프트" },
  { key: "ohp",      label: "오버헤드프레스" },
  { key: "pullup",   label: "풀업" },
];

export const UNIT_MAP: Record<GoalCategory, string> = {
  strength:   "reps",
  cardio:     "km",
  attendance: "회",
  body:       "%",
  weight:     "kg",
};

export const LABEL_MAP: Record<GoalCategory, string> = {
  strength:   "종목 선택",
  cardio:     "유산소",
  attendance: "출석",
  body:       "체지방률",
  weight:     "체중",
};
