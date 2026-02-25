export type TabId = 'home' | 'stats' | 'workout' | 'performance' | 'ranking';
export type SubTabId = 'body' | 'strength' | 'cardio';
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
  type: 'run5k' | 'row2k' | 'ski1k';
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
}
