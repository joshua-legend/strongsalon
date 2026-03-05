export type AttendType = 'pt' | 'self' | 'both';

export interface AttendanceRecord {
  date: string;
  type: AttendType;
}
