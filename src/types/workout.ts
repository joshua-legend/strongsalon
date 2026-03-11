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

export type WorkoutMode = 'trainer' | 'free';
export type WorkoutCondition = '최악' | '나쁨' | '좋음' | '최고' | '불타';

export type SetStatus = 'pending' | 'clear' | 'fail';

export interface SetRecord {
  id: string;
  weight: number;
  reps: number;
  status: SetStatus;
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

export type CardioType = 'run' | 'cycle' | 'row' | 'skierg';

export interface CardioEntry {
  id: string;
  type: CardioType;
  distanceKm: number;
  timeMinutes: number;
  checked: boolean;
}

export interface InbodyRecord {
  date: string;
  weight: number;
  muscleMass: number;
  fatMass: number;
  fatPercent: number;
  bmi?: number;
  bmr?: number;
}

/** 위클리 스코어 등급 */
export type ScoreGrade = "S" | "A" | "B" | "C" | "D";

/** 일별 운동 로그 (loadDailyLogsV3 / calcWeeklyTrainingScore용) */
export interface DailyLog {
  date: string;
  isCompleted: boolean;
  exercises: Array<{
    equipmentId: string;
    sets: Array<{ weight: number; reps: number; completed: boolean }>;
  }>;
  cardio?: Array<{ minutes: number }>;
}

/** 운동 일 유형 (상체 푸쉬, 하체 등) */
export type DayType =
  | "upperPush"
  | "upperPull"
  | "upperFull"
  | "lowerCompound"
  | "lowerIsolation"
  | "fullBody";

/** 처방 운동 (주간 플랜용) */
export interface PrescribedExercise {
  equipmentId: string;
  equipmentName: string;
  targetWeight: number;
  targetReps: number;
  targetSets: number;
  restSeconds: number;
}

/** 운동 로그 (완료 시 기록) */
export interface ExerciseLog {
  equipmentId: string;
  equipmentName?: string;
  targetWeight: number;
  actualWeight?: number;
  targetReps: number;
  targetSets: number;
  completedSets: number;
  sets?: Array<{ weight: number; reps: number; completed: boolean }>;
}

/** 일별 처방 로그 */
export interface PrescriptionDailyLog {
  date: string;
  dayType: DayType;
  exercises: ExerciseLog[];
  totalTargetSets: number;
  totalCompletedSets: number;
  completionRate: number;
  isCompleted: boolean;
}

/** 주간 플랜 */
export interface WeeklyPlan {
  weekNumber: number;
  startDate: string;
  days: DayPlan[];
}

/** 일별 플랜 */
export interface DayPlan {
  dayOfWeek: number;
  dayLabel: string;
  dayType: DayType;
  exercises: PrescribedExercise[];
}

/** 주간 진행 */
export interface WeeklyProgress {
  weekNumber: number;
  trainingDays: number[];
  completedDays: number[];
  totalTargetSets: number;
  totalCompletedSets: number;
  dayCompletionRate: number;
  setCompletionRate: number;
}
