'use client';

import type { DailyLog } from '@/types/workout';

const DAILY_LOGS_V3_KEY = 'fitlog-daily-logs-v3';

export function loadDailyLogsV3(): Record<string, DailyLog> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(DAILY_LOGS_V3_KEY);
    if (raw) return JSON.parse(raw) as Record<string, DailyLog>;
  } catch {
    // ignore
  }
  return {};
}

export function saveDailyLogV3(log: DailyLog): void {
  try {
    const logs = loadDailyLogsV3();
    logs[log.date] = log;
    localStorage.setItem(DAILY_LOGS_V3_KEY, JSON.stringify(logs));
  } catch {
    // ignore
  }
}
