import { attendance } from "@/data/attendance";
import { workoutHistory } from "@/data/workoutHistory";

const TARGET_DAYS = 22;

function safeNum(n: unknown): number {
  const v = Number(n);
  return Number.isFinite(v) ? v : 0;
}

/** 날짜 파싱: '2026-1-2' -> {y, m, d} */
function parseDate(dateStr: string): { y: number; m: number; d: number } {
  const parts = String(dateStr).split("-");
  return {
    y: safeNum(parts[0]) || 0,
    m: safeNum(parts[1]) || 0,
    d: safeNum(parts[2]) || 0,
  };
}

/** cardio value에서 분 추출 */
function parseCardioMinutes(value: string): number {
  const match = String(value).match(/(\d+)\s*분/);
  return match ? safeNum(match[1]) : 0;
}

function getWorkoutDuration(date: string): number {
  const record = workoutHistory.find((r) => r.date === date);
  if (!record) return 0;
  let strengthMin = 0;
  record.exercises.forEach((ex) => {
    strengthMin += (ex.sets?.length ?? 0) * 2.5;
  });
  const cardioMin = record.cardio ? parseCardioMinutes(record.cardio.value) : 0;
  return Math.round(strengthMin + cardioMin);
}

export interface MonthlyStats {
  ptDays: number;
  selfRate: number;
  totalVolume: number;
  workoutCount: number;
  avgMinutes: number;
  streak: number;
}

export function getMonthlyStats(year: number, month: number): MonthlyStats {
  const y = safeNum(year);
  const monthNum = safeNum(month) + 1;

  const monthRecords = attendance.filter((a) => {
    const { y: ay, m: am } = parseDate(a.date);
    return ay === y && am === monthNum;
  });

  const ptDays = monthRecords.filter((r) => r.type === "pt" || r.type === "both").length;
  const selfDays = monthRecords.filter((r) => r.type === "self" || r.type === "both").length;
  const totalDays = monthRecords.length;
  const selfRate = TARGET_DAYS > 0 ? Math.round((selfDays / TARGET_DAYS) * 100) : 0;

  let totalVolume = 0;
  let totalMinutes = 0;
  monthRecords.forEach((r) => {
    const wh = workoutHistory.find((w) => w.date === r.date);
    if (wh?.exercises) {
      wh.exercises.forEach((ex) => {
        (ex.sets ?? []).forEach((s) => {
          totalVolume += safeNum(s.weight) * safeNum(s.reps);
        });
      });
      totalMinutes += getWorkoutDuration(r.date);
    }
  });

  const avgMinutes = totalDays > 0 ? Math.round(totalMinutes / totalDays) : 0;

  const sortedDates = [...monthRecords]
    .map((r) => r.date)
    .sort((a, b) => {
      const pa = parseDate(a);
      const pb = parseDate(b);
      return new Date(pa.y, pa.m - 1, pa.d).getTime() - new Date(pb.y, pb.m - 1, pb.d).getTime();
    });

  let maxStreak = 0;
  let streak = 0;
  for (let i = 0; i < sortedDates.length; i++) {
    if (i === 0) {
      streak = 1;
    } else {
      const pa = parseDate(sortedDates[i - 1]);
      const prev = new Date(pa.y, pa.m - 1, pa.d);
      prev.setDate(prev.getDate() + 1);
      const nextStr = `${prev.getFullYear()}-${prev.getMonth() + 1}-${prev.getDate()}`;
      if (nextStr === sortedDates[i]) streak++;
      else streak = 1;
    }
    maxStreak = Math.max(maxStreak, streak);
  }

  return {
    ptDays,
    selfRate,
    totalVolume,
    workoutCount: totalDays,
    avgMinutes,
    streak: maxStreak,
  };
}
