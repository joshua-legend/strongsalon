import type { WeeklyGoal } from "@/types";

export function getWeekStreak(attendance: { date: string }[]): boolean[] {
  const today = new Date();
  const dow = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1));
  monday.setHours(0, 0, 0, 0);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    return attendance.some((a) => a.date === key);
  });
}

export function getDaysLeft(dateStr: string): number {
  const [y, m, d] = dateStr.split("-").map(Number);
  return Math.ceil((new Date(y, m - 1, d).getTime() - Date.now()) / 86400000);
}

export function formatPtDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const weekday = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
  return `${m}/${d} (${weekday})`;
}

export function formatExpiry(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return `${y}.${String(m).padStart(2, "0")}.${String(d).padStart(2, "0")}`;
}

export function calcOverallPct(goals: WeeklyGoal[]): number {
  if (goals.length === 0) return 0;
  const sum = goals.reduce((acc, g) => {
    if (g.targetValue <= 0) return acc;
    return acc + Math.min(100, (g.currentValue / g.targetValue) * 100);
  }, 0);
  return Math.round(sum / goals.length);
}

export function getTodayWeekIndex(): number {
  const d = new Date().getDay();
  return d === 0 ? 6 : d - 1;
}
