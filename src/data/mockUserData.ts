/**
 * 목업용 유저 데이터 (1인)
 * 홈탭·마이페이지·골트래커·출석 관련 타입에 의존
 * 데이터 바인딩은 보류
 */

import type { User } from "@/types/user";
import type { UserProfile } from "@/types/profile";
import type { AttendanceRecord } from "@/types/attendance";
import type { GoalSetting } from "@/types/goalSetting";
import type { ActiveQuest } from "@/types/quest";
import type { CategorySettings } from "@/types/categorySettings";
import type { InbodyRecord } from "@/types/workout";
import type { ChartDataPoint } from "@/types/chartData";

// ─── 1. User (유저 프로필) ────────────────────────────────────────────────
export const mockUser: User = {
  id: "mock-001",
  nickname: "민준",
  name: "김민준",
  initial: "김",
  gender: "male",
  birthDate: "1994-05-15",
  height: 178,
  weight: 73.4,
  experience: "intermediate",
  avatarGradient: "linear-gradient(135deg, #f5c518, #ff9a3c)",
  createdAt: "2026-01-10",

  trainerName: "이준호",
  membershipExpiry: "2026-04-10",
  membershipStart: "2026-01-10",
  remainingSessions: 8,
  totalSessions: 20,
  nextPtDate: "2026-03-01",

  level: "INTERMEDIATE",
  liftTotal: 360,
  bodyWeight: 73.4,
  ageSegment: "30대 초반",
  streak: 12,
  monthAttendRate: 73,
  avgVolume: "9.2k",
  avgCondition: 4.2,

  bodyComp: {
    weight: 73.4,
    muscle: 34.2,
    fatPct: 16.8,
    bmi: 23.1,
    measuredAt: "2026-02-10",
    delta: { weight: -0.8, muscle: 0.4, fatPct: -1.2 },
  },
  lifts: [
    { name: "벤치프레스", weight: 100, grade: "Intermediate", color: "#22d3ee", pct: 55 },
    { name: "스쿼트", weight: 120, grade: "Intermediate", color: "#a3e635", pct: 50 },
    { name: "데드리프트", weight: 140, grade: "Intermediate", color: "#f97316", pct: 60 },
  ],
  cardio: [
    {
      type: "run5k",
      label: "러닝머신 5km",
      emoji: "🏃",
      time: 1600,
      pr: 1600,
      prDelta: "지난달 대비 -1:20 개선",
      date: "2026-02-20",
      stats: [
        { label: "거리", value: "5.2km" },
        { label: "시간", value: "28분" },
        { label: "페이스", value: "5:23/km" },
      ],
    },
    {
      type: "row2k",
      label: "로잉머신 2km",
      emoji: "🚣",
      time: 462,
      pr: 458,
      prDelta: "지난달 대비 -0:24 개선",
      date: "2026-02-18",
      stats: [
        { label: "거리", value: "2,000m" },
        { label: "시간", value: "7:42" },
        { label: "스플릿", value: "1:55/500m" },
      ],
    },
  ],
  prMap: { bench: 100, squat: 120, deadlift: 140 },
};

// ─── 2. UserProfile (온보딩/프로필) ───────────────────────────────────────
export const mockProfile: UserProfile = {
  nickname: "민준",
  gender: "male",
  birthDate: "1994-05-15",
  height: 178,
  weight: 73.4,
  experience: "intermediate",
  createdAt: "2026-01-10",
};

// ─── 3. AttendanceRecord[] (출석 기록) ────────────────────────────────────
export const mockAttendance: AttendanceRecord[] = [
  { date: "2026-2-3", type: "pt" },
  { date: "2026-2-4", type: "self" },
  { date: "2026-2-5", type: "both" },
  { date: "2026-2-7", type: "self" },
  { date: "2026-2-10", type: "pt" },
  { date: "2026-2-11", type: "self" },
  { date: "2026-2-12", type: "pt" },
  { date: "2026-2-13", type: "self" },
  { date: "2026-2-14", type: "both" },
  { date: "2026-2-17", type: "pt" },
  { date: "2026-2-18", type: "self" },
  { date: "2026-2-19", type: "pt" },
  { date: "2026-2-20", type: "self" },
  { date: "2026-2-21", type: "both" },
  { date: "2026-2-23", type: "self" },
  { date: "2026-2-24", type: "pt" },
  { date: "2026-2-25", type: "self" },
];

// ─── 4. GoalSetting (목표 설정) ───────────────────────────────────────────
export const mockGoalSetting: GoalSetting = {
  goalId: "diet",
  category: "inbody",
  mainMetric: "fatPercent",
  startValues: { fatPercent: 18, weight: 74, muscleMass: 33 },
  target: {
    metric: "fatPercent",
    startValue: 18,
    targetValue: 14,
    weeklyDelta: -0.5,
    estimatedWeeks: 8,
    totalWeeks: 4,
  },
  autoPaces: {
    fatPercent: { start: 18, target: 18, weeklyDelta: -0.5 },
    weight: { start: 74, target: 72, weeklyDelta: -0.25 },
    muscleMass: { start: 33, target: 34, weeklyDelta: 0.25 },
  },
};

// ─── 5. ActiveQuest (진행 중 퀘스트) ──────────────────────────────────────
export const mockActiveQuest: ActiveQuest = {
  currentWeek: 3,
  latestMetric: 16.5,
  history: [
    { week: 1, recorded: 17.5, target: 17.5, passed: true },
    { week: 2, recorded: 17, target: 17, passed: true },
  ],
  streak: 2,
  bestStreak: 2,
};

// ─── 6. CategorySettings (인바디/스트렝스/체력 카테고리 설정) ─────────────
export const mockCategorySettings: CategorySettings = {
  inbody: {
    isConfigured: true,
    configuredAt: "2026-02-10",
    startValues: { fatPercent: 18, weight: 74, muscleMass: 33 },
    goal: {
      metric: "fatPercent",
      startValue: 18,
      targetValue: 14,
      weeklyDelta: -0.5,
      estimatedWeeks: 8,
      totalWeeks: 4,
    },
    autoPaces: {
      fatPercent: { start: 18, target: 18, weeklyDelta: -0.5 },
      weight: { start: 74, target: 72, weeklyDelta: -0.25 },
      muscleMass: { start: 33, target: 34, weeklyDelta: 0.25 },
    },
    cycleWeeks: 4,
    cycleEndDate: "2026-03-10",
  },
  strength: {
    isConfigured: true,
    configuredAt: "2026-02-10",
    startValues: { total: 340, squat: 110, bench: 95, deadlift: 135 },
    goal: {
      metric: "total",
      startValue: 340,
      targetValue: 365,
      weeklyDelta: 6.25,
      estimatedWeeks: 4,
      totalWeeks: 4,
    },
    autoPaces: {
      squat: { start: 110, target: 120, weeklyDelta: 2.5 },
      bench: { start: 95, target: 105, weeklyDelta: 2.5 },
      deadlift: { start: 135, target: 140, weeklyDelta: 1.25 },
    },
    cycleWeeks: 4,
    cycleEndDate: "2026-03-10",
  },
  fitness: {
    isConfigured: false,
    configuredAt: null,
    startValues: null,
    goal: null,
    autoPaces: null,
  },
};

// ─── 7. InbodyRecord[] (인바디 측정 이력) ─────────────────────────────────
export const mockInbodyHistory: InbodyRecord[] = [
  { date: "2026-02-10", weight: 74, muscleMass: 33, fatMass: 12.4, fatPercent: 18, bmi: 23.4 },
  { date: "2026-02-17", weight: 73.6, muscleMass: 33.2, fatMass: 11.8, fatPercent: 17.5, bmi: 23.2 },
  { date: "2026-02-24", weight: 73.4, muscleMass: 33.2, fatMass: 11.5, fatPercent: 16.5, bmi: 23.1 },
];

// ─── 8. ChartDataPoint (차트 포인트 예시, metricKey별) ────────────────────
export const mockChartDataPoints: Record<string, ChartDataPoint[]> = {
  "inbody.fatPercent": [
    { day: 0, value: 18, date: "2026-02-10" },
    { day: 7, value: 17.5, date: "2026-02-17" },
    { day: 14, value: 16.5, date: "2026-02-24" },
  ],
  "inbody.weight": [
    { day: 0, value: 74, date: "2026-02-10" },
    { day: 7, value: 73.6, date: "2026-02-17" },
    { day: 14, value: 73.4, date: "2026-02-24" },
  ],
  "inbody.muscleMass": [
    { day: 0, value: 33, date: "2026-02-10" },
    { day: 7, value: 33.2, date: "2026-02-17" },
    { day: 14, value: 33.2, date: "2026-02-24" },
  ],
  "strength.total": [
    { day: 0, value: 340, date: "2026-02-10" },
    { day: 7, value: 345, date: "2026-02-17" },
    { day: 14, value: 350, date: "2026-02-24" },
  ],
};

// ─── 9. 통합 목업 객체 (모든 데이터 한 번에) ──────────────────────────────
export const mockUserData = {
  user: mockUser,
  profile: mockProfile,
  attendance: mockAttendance,
  goalSetting: mockGoalSetting,
  activeQuest: mockActiveQuest,
  categorySettings: mockCategorySettings,
  inbodyHistory: mockInbodyHistory,
  chartDataPoints: mockChartDataPoints,
} as const;
