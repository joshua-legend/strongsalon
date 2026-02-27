export type TabId = 'home' | 'stats' | 'workout' | 'performance' | 'exercise-info';
export type SubTabId = 'body' | 'strength' | 'cardio';

export type GoalCategory = 'strength' | 'body' | 'cardio' | 'attendance' | 'weight';

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
