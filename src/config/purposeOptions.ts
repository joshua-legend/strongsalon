import { Scale, Dumbbell, Zap, Activity } from "lucide-react";
import type { PurposeOption } from "@/types/quest";

export interface PurposeOptionWithIcon extends PurposeOption {
  Icon: typeof Scale;
}

export const purposeOptions: PurposeOptionWithIcon[] = [
  {
    id: "cut",
    label: "체중 감량",
    desc: "매주 0.5kg씩 줄여나가요",
    unit: "kg",
    weeklyDelta: -0.5,
    metricKey: "weight",
    Icon: Scale,
  },
  {
    id: "bulk",
    label: "근육량 증가",
    desc: "매주 0.3kg씩 늘려나가요",
    unit: "kg",
    weeklyDelta: 0.3,
    metricKey: "muscleMass",
    Icon: Dumbbell,
  },
  {
    id: "strength",
    label: "스트렝스 향상",
    desc: "매주 2.5kg씩 증량해요",
    unit: "kg",
    weeklyDelta: 2.5,
    metricKey: "liftMax",
    Icon: Zap,
  },
  {
    id: "endure",
    label: "기초 체력 증진",
    desc: "매주 유산소 2분씩 늘려요",
    unit: "분",
    weeklyDelta: 2,
    metricKey: "cardioTime",
    Icon: Activity,
  },
];
