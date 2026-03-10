export interface ChartDataPoint {
  day: number;
  value: number;
  date: string;
}

export type ChartMetricKey =
  | "inbody.weight"
  | "inbody.muscleMass"
  | "inbody.fatPercent"
  | "strength.squat"
  | "strength.bench"
  | "strength.deadlift"
  | "strength.total"
  | "fitness.running"
  | "fitness.rowing"
  | "fitness.skierg"
  | "fitness.total";
