/**
 * 테스트용 계정 2개 (ID / 비밀번호)
 * 민준 / 1234  |  지현 / 1234
 * + 회원가입 시 메모리에 동적 계정 추가
 */

import type { User } from "@/types/user";
import type { UserProfile } from "@/types/profile";
import type { AttendanceRecord } from "@/types/attendance";
import type { GoalSetting, GoalId } from "@/types/goalSetting";
import type { ActiveQuest } from "@/types/quest";
import { DEFAULT_CATEGORY_SETTINGS, type CategoryId, type CategorySettings } from "@/types/categorySettings";
import type { InbodyRecord } from "@/types/workout";
import type { ChartDataPoint, ChartMetricKey } from "@/types/chartData";
import type { CycleRecord } from "@/types/goalSetting";
import type { ActiveGoal } from "@/types";
import type { DayWorkoutRecord } from "@/data/workoutHistory";
import type { OnboardingProfile } from "@/types/onboarding";

export type AccountId = string;

const EMPTY_CHART: Record<ChartMetricKey, ChartDataPoint[]> = {
  "inbody.fatPercent": [],
  "inbody.weight": [],
  "inbody.muscleMass": [],
  "strength.squat": [],
  "strength.bench": [],
  "strength.deadlift": [],
  "strength.total": [],
  "fitness.running": [],
  "fitness.rowing": [],
  "fitness.skierg": [],
  "fitness.total": [],
};

export interface AccountData {
  user: User;
  profile: UserProfile;
  attendance: AttendanceRecord[];
  goalSetting: GoalSetting | null;
  activeQuest: ActiveQuest | null;
  categorySettings: CategorySettings;
  primaryGoal: GoalId | null;
  inbodyHistory: InbodyRecord[];
  chartDataPoints: Record<ChartMetricKey, ChartDataPoint[]>;
  cycleHistory: Record<CategoryId, CycleRecord[]>;
  activeGoal: ActiveGoal | null;
  workoutRecords: DayWorkoutRecord[];
  onboarding?: OnboardingProfile;
}

/** 민준 / 1234 */
const 민준: AccountData = {
  user: {
    id: "user-민준",
    nickname: "민준",
    name: "김민준",
    initial: "김",
    gender: "male",
    birthDate: "1994-05-15",
    height: 178,
    weight: 0,
    experience: "intermediate",
    createdAt: "2026-01-10",
    lifts: [],
    cardio: [],
    prMap: {},
  },
  profile: {
    nickname: "민준",
    gender: "male",
    birthDate: "1994-05-15",
    height: 178,
    weight: 0,
    experience: "intermediate",
    createdAt: "2026-01-10",
  },
  attendance: [],
  goalSetting: null,
  activeQuest: null,
  categorySettings: structuredClone(DEFAULT_CATEGORY_SETTINGS),
  primaryGoal: null,
  inbodyHistory: [
    {
      date: "2026-03-22",
      weight: 76.2,
      muscleMass: 33.4,
      fatMass: 14.6,
      fatPercent: 19.2,
      bmi: 24.1,
      bmr: 1685,
    },
    {
      date: "2026-03-15",
      weight: 76.8,
      muscleMass: 33.1,
      fatMass: 15.2,
      fatPercent: 19.8,
      bmi: 24.3,
      bmr: 1670,
    },
    {
      date: "2026-03-08",
      weight: 77.4,
      muscleMass: 32.8,
      fatMass: 15.9,
      fatPercent: 20.5,
      bmi: 24.6,
      bmr: 1658,
    },
  ],
  chartDataPoints: structuredClone(EMPTY_CHART),
  cycleHistory: { inbody: [], strength: [], fitness: [] },
  activeGoal: null,
  workoutRecords: [],
  onboarding: {
    goal: "bulk",
    experience: "3m_to_1y",
    daysPerWeek: "3",
    sessionMinutes: "60",
    injury: "none",
    gender: "male",
    ageRange: "30s",
  },
};

/** 지현 / 1234 */
const 지현: AccountData = {
  user: {
    id: "user-지현",
    nickname: "지현",
    name: "박지현",
    initial: "박",
    gender: "female",
    birthDate: "1998-08-22",
    height: 165,
    weight: 0,
    experience: "novice",
    createdAt: "2026-02-01",
    lifts: [],
    cardio: [],
    prMap: {},
  },
  profile: {
    nickname: "지현",
    gender: "female",
    birthDate: "1998-08-22",
    height: 165,
    weight: 0,
    experience: "novice",
    createdAt: "2026-02-01",
  },
  attendance: [],
  goalSetting: null,
  activeQuest: null,
  categorySettings: structuredClone(DEFAULT_CATEGORY_SETTINGS),
  primaryGoal: null,
  inbodyHistory: [
    {
      date: "2026-03-20",
      weight: 58.9,
      muscleMass: 23.7,
      fatMass: 12.4,
      fatPercent: 21.1,
      bmi: 21.6,
      bmr: 1332,
    },
    {
      date: "2026-03-13",
      weight: 59.3,
      muscleMass: 23.5,
      fatMass: 12.9,
      fatPercent: 21.8,
      bmi: 21.8,
      bmr: 1325,
    },
    {
      date: "2026-03-06",
      weight: 59.8,
      muscleMass: 23.2,
      fatMass: 13.4,
      fatPercent: 22.4,
      bmi: 22,
      bmr: 1318,
    },
  ],
  chartDataPoints: structuredClone(EMPTY_CHART),
  cycleHistory: { inbody: [], strength: [], fitness: [] },
  activeGoal: null,
  workoutRecords: [],
  onboarding: {
    goal: "diet",
    experience: "first",
    daysPerWeek: "2",
    sessionMinutes: "45",
    injury: "none",
    gender: "female",
    ageRange: "20s",
  },
};

export const MOCK_ACCOUNTS: Record<string, AccountData> = {
  민준,
  지현,
};

/** ID / 비밀번호 검증 (테스트 계정) */
export const TEST_CREDENTIALS: Record<string, string> = {
  민준: "1234",
  지현: "1234",
};

/** 메모리 기반 동적 계정 (회원가입) */
const registeredAccounts = new Map<string, { accountData: AccountData; password: string }>();

function onboardingToExperience(o: OnboardingProfile): "untrained" | "novice" | "intermediate" | "advanced" | "elite" {
  if (o.experience === "first") return "untrained";
  if (o.experience === "under3m") return "novice";
  if (o.experience === "3m_to_1y") return "intermediate";
  if (o.experience === "1y_to_2y") return "advanced";
  return "elite";
}

function createAccountFromOnboarding(
  id: string,
  onboarding: OnboardingProfile,
  name?: string
): AccountData {
  const nickname = id;
  const displayName = name ?? nickname;
  const initial = displayName[0] ?? "?";
  const experience = onboardingToExperience(onboarding);
  const birthDate = onboarding.ageRange === "teens" ? "2005-01-01"
    : onboarding.ageRange === "20s" ? "2000-01-01"
    : onboarding.ageRange === "30s" ? "1990-01-01"
    : "1980-01-01";
  const today = new Date().toISOString().slice(0, 10);

  return {
    user: {
      id: `user-${id}`,
      nickname,
      name: displayName,
      initial,
      gender: onboarding.gender,
      birthDate,
      height: 170,
      weight: 0,
      experience,
      createdAt: today,
      lifts: [],
      cardio: [],
      prMap: {},
    },
    profile: {
      nickname,
      gender: onboarding.gender,
      birthDate,
      height: 170,
      weight: 0,
      experience,
      createdAt: today,
    },
    attendance: [],
    goalSetting: null,
    activeQuest: null,
    categorySettings: structuredClone(DEFAULT_CATEGORY_SETTINGS),
    primaryGoal: null,
    inbodyHistory: [],
    chartDataPoints: structuredClone(EMPTY_CHART),
    cycleHistory: { inbody: [], strength: [], fitness: [] },
    activeGoal: null,
    workoutRecords: [],
    onboarding,
  };
}

export function registerAccount(
  id: string,
  password: string,
  onboarding: OnboardingProfile,
  name?: string
): boolean {
  const trimmed = id.trim();
  if (!trimmed) return false;
  if (trimmed in MOCK_ACCOUNTS || registeredAccounts.has(trimmed)) return false;

  const accountData = createAccountFromOnboarding(trimmed, onboarding, name);
  registeredAccounts.set(trimmed, { accountData, password });
  return true;
}

export function validateLogin(id: string, password: string): AccountId | null {
  const trimmed = id.trim();
  if (trimmed in TEST_CREDENTIALS && TEST_CREDENTIALS[trimmed] === password) {
    return trimmed;
  }
  const reg = registeredAccounts.get(trimmed);
  if (reg && reg.password === password) return trimmed;
  return null;
}

export function getAccountData(id: AccountId): AccountData | null {
  return MOCK_ACCOUNTS[id] ?? registeredAccounts.get(id)?.accountData ?? null;
}

/** 동적 계정 데이터 업데이트 (updateAccountData 시 메모리 반영) */
export function updateRegisteredAccount(id: AccountId, data: AccountData): void {
  const reg = registeredAccounts.get(id);
  if (reg) reg.accountData = data;
}

export function isRegisteredAccount(id: AccountId): boolean {
  return registeredAccounts.has(id);
}
