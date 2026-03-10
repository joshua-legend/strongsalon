'use client';

import { useUser } from "@/context/UserContext";

export function parseDateMs(dateStr: string): number {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).getTime();
}

export function getDaysLeft(dateStr: string): number {
  return Math.ceil((parseDateMs(dateStr) - Date.now()) / 86400000);
}

export function formatShort(dateStr: string): string {
  const [, m, d] = dateStr.split("-").map(Number);
  return `${m}월 ${d}일`;
}

export function ptBgColor(remaining: number, total: number): string {
  const ratio = total > 0 ? remaining / total : 0;
  if (ratio >= 0.5) return "rgb(163,230,53)";
  if (ratio >= 0.25) return "rgb(249,115,22)";
  return "rgb(239,68,68)";
}

export function membershipBgColor(days: number): string {
  if (days > 30) return "rgb(163,230,53)";
  if (days > 14) return "rgb(249,115,22)";
  return "rgb(239,68,68)";
}

export function useSessionManager() {
  const { user } = useUser();
  const sessions = user?.remainingSessions ?? 0;
  const total = user?.totalSessions ?? 0;
  const nextDate = user?.nextPtDate;
  const expiry = user?.membershipExpiry;
  const start = user?.membershipStart;
  const daysLeft = expiry ? getDaysLeft(expiry) : null;

  const ptBg = ptBgColor(sessions, total);
  const msBg = daysLeft !== null ? membershipBgColor(daysLeft) : "rgb(163,163,163)";
  const ptUrgent = total > 0 && sessions / total < 0.25;
  const msUrgent = daysLeft !== null && daysLeft <= 14;

  return { sessions, total, nextDate, expiry, start, daysLeft, ptBg, msBg, ptUrgent, msUrgent };
}
