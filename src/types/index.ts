export type TabId = 'home' | 'stats' | 'workout' | 'performance' | 'exercise-info';
export type SubTabId = 'body' | 'strength' | 'cardio';

/** 동물 티어 (와일드 피트니스) */
export type AnimalTier = 'sloth' | 'meerkat' | 'gazelle' | 'tiger' | 'grizzly';

/** 5대 능력치 (레이더 차트) */
export interface AbilityStats {
  strength: number;      // 근력
  endurance: number;    // 근지구력
  explosiveness: number; // 순발력
  cardio: number;       // 심폐지구력
  stability: number;   // 안정성
}

export type GoalCategory = 'strength' | 'body' | 'cardio' | 'attendance' | 'weight';

// ── Goal Tracker & Setup Wizard ──
export type GoalPurpose = '다이어트' | '벌크업' | '스트렝스' | '바디프로필';

export type GoalInputs =
  | { purpose: '다이어트'; current: number; target: number; unit: 'kg' }
  | {
      purpose: '벌크업';
      weightCurrent: number;
      weightTarget: number;
      muscleCurrent: number;
      muscleTarget: number;
    }
  | {
      purpose: '스트렝스';
      squat: number;
      bench: number;
      deadlift: number;
      targetSquat: number;
      targetBench: number;
      targetDeadlift: number;
    }
  | {
      purpose: '바디프로필';
      fatPctCurrent: number;
      fatPctTarget: number;
      weightCurrent: number;
      weightTarget: number;
    };

export type GoalDuration = 4 | 8 | 12;

/** 주차별 평가 상태: null=미평가, success=성공, fail=실패 */
export type WeekStatus = "success" | "fail" | null;

/** 지표별 주차 달성 여부 (성공/실패 버튼) */
export type WeeklyAchievements = Record<string, WeekStatus[]>;

export interface ActiveGoal {
  purpose: GoalPurpose;
  inputs: GoalInputs;
  /** 확정 시점의 원본 목표 (지연 계산용) */
  originalInputs?: GoalInputs;
  /** 4|8|12 또는 실패 이월로 연장된 값 (9, 10, ...) */
  duration: number;
  title: string;
  subtitle: string;
  startDate: string;
  weeklyAchievements?: WeeklyAchievements;
}

export interface WeeklyGoal {
  id: string;
  label: string;
  category: GoalCategory;
  exerciseKey?: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  icon: string;
}

export interface Goal {
  id: string;
  category: GoalCategory;
  exerciseKey?: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline?: string;
  achieved: boolean;
  isPrimary: boolean;
  label?: string;
}

export type CarrotReason =
  | 'weekly_attend'
  | 'pr_achieved'
  | 'goal_achieved'
  | 'streak_bonus'
  | 'whip_no_attend'
  | 'whip_2week'
  | 'whip_deadline'
  | 'shop_purchase';

export interface CarrotCredit {
  id: string;
  amount: number;
  reason: CarrotReason;
  relatedId?: string;
  createdAt: string;
}

export interface ShopItem {
  id: string;
  name: string;
  cost: number;
  emoji: string;
  description?: string;
}

export type ExerciseCategory = '가슴' | '등' | '어깨' | '팔' | '하체' | '코어' | '유산소';

export interface ExerciseInfoItem {
  id: string;
  name: string;
  category: ExerciseCategory;
  icon: string;
  targetMuscles: { primary: string[]; secondary: string[] };
  description: string;
  tips: string;
  levelGuide: { novice: string; inter: string; adv: string };
  svgIllust?: string;
  /** 3D GIF/이미지 URL (썸네일용). 없으면 fallback 사용 */
  modelUrl?: string | null;
  /** 장비 (Barbell, Dumbbell, Cable, Machine, Bar, Bodyweight 등) */
  equipment?: string | null;
  /** YouTube embed URL (autoplay+mute 권장). 예: https://www.youtube.com/embed/VIDEO_ID?autoplay=1&mute=1&loop=1&playlist=VIDEO_ID&playsinline=1 */
  embedUrl?: string | null;
}
export type Condition = '최고' | '좋음' | '보통' | '피로' | '최악';

export interface WorkoutSet {
  label: string;
  kg: number;
  reps: number;
  done: boolean;
}

export interface Exercise {
  id: number;
  name: string;
  emoji: string;
  cat: string;
  intensity: string;
  prevKg: number;
  prevReps: number;
  prKg: number;
  sets: WorkoutSet[];
  svgIllust: string;
}

export type AttendType = 'pt' | 'self' | 'both';

export interface AttendanceRecord {
  date: string;
  type: AttendType;
}

export interface BodyComposition {
  weight: number;
  muscle: number;
  fatPct: number;
  bmi: number;
  measuredAt: string;
  delta: { weight: number; muscle: number; fatPct: number };
}

export interface CardioRecord {
  type: 'run5k' | 'row2k' | 'cycle';
  label: string;
  emoji: string;
  time: number;
  pr: number;
  prDelta: string;
  date: string;
  stats: { label: string; value: string }[];
}

export interface LiftData {
  name: string;
  weight: number;
  grade: string;
  color: string;
  pct: number;
}

export type MuscleStatus = 'none' | 'injury' | 'worked' | 'fatigue' | 'recover';

export interface MuscleCondition {
  id: string;
  name: string;
  status: MuscleStatus;
  detail: string;
}

export type RankGrade = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'ELITE';

export interface MemberProfile {
  name: string;
  initial: string;
  avatarGradient: string;
  trainerName: string;
  level: 'NOVICE' | 'INTERMEDIATE' | 'ADVANCED';
  liftTotal: number;
  bodyWeight: number;
  streak: number;
  monthAttendRate: number;
  avgVolume: string;
  avgCondition: number;
  bodyComp: BodyComposition;
  lifts: LiftData[];
  cardio: CardioRecord[];
  prMap: Record<string, number>;
  remainingSessions?: number;
  totalSessions?: number;
  nextPtDate?: string | null;
  membershipExpiry?: string | null;
  membershipStart?: string | null;
}

// ── 운동 기록 페이지 (WorkoutPage) 전용 ──
export type WorkoutMode = 'trainer' | 'free';
export type WorkoutCondition = '최악' | '나쁨' | '좋음' | '최고' | '불타';

export interface SetRecord {
  id: string;
  weight: number;
  reps: number;
}

export interface TrainerExercise {
  id: string;
  icon: string;
  name: string;
  rx: string;
  tSets: number;
  prevPR: number | null;
  sets: SetRecord[];
}

export interface FreeExercise {
  icon: string;
  name: string;
  sets: SetRecord[];
}

export interface TrainerProg {
  exercises: TrainerExercise[];
}

// 오늘 운동용 유산소 1건 (km + 시간)
export type CardioType = 'run' | 'cycle' | 'row';

export interface CardioEntry {
  id: string;
  type: CardioType;
  distanceKm: number;
  timeMinutes: number;
}
