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

export type CardioType = 'run' | 'cycle' | 'row';

export interface CardioEntry {
  id: string;
  type: CardioType;
  distanceKm: number;
  timeMinutes: number;
}
