import type { BodyComposition, CardioRecord, LiftData } from "@/types";

export interface User {
  id: string;
  email?: string;
  nickname: string;
  name: string;
  initial: string;
  gender: "male" | "female";
  birthDate: string;
  height: number;
  weight: number;
  experience: "beginner" | "intermediate" | "advanced";
  avatarGradient?: string;
  createdAt: string;

  /** 트레이너/멤버십 */
  trainerName?: string;
  membershipExpiry?: string | null;
  membershipStart?: string | null;
  remainingSessions?: number;
  totalSessions?: number;
  nextPtDate?: string | null;
  /** 다음 PT 예정 시간 (예: "14:00", "오후 2시") */
  nextPtTime?: string | null;

  /** 퍼포먼스용 */
  level?: "NOVICE" | "INTERMEDIATE" | "ADVANCED";
  liftTotal?: number;
  bodyWeight?: number;
  ageSegment?: string;
  streak?: number;
  monthAttendRate?: number;
  avgVolume?: string;
  avgCondition?: number;
  bodyComp?: BodyComposition;
  lifts?: LiftData[];
  cardio?: CardioRecord[];
  prMap?: Record<string, number>;
}
