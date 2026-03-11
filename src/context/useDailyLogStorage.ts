'use client';

import type { DailyLog } from '@/types/workout';

let dailyLogsData: Record<string, DailyLog> = {};

export function loadDailyLogsV3(): Record<string, DailyLog> {
  return dailyLogsData;
}

export function saveDailyLogV3(log: DailyLog): void {
  dailyLogsData[log.date] = log;
}
