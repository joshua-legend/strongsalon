"use client";

import { useAttendance } from "@/context/AttendanceContext";

function hasTwoWeekNoAttend(attendance: { date: string }[]): boolean {
  const dates = attendance.map((a) => {
    const [y, m, d] = a.date.split("-").map(Number);
    return new Date(y, m - 1, d).getTime();
  });
  dates.sort((a, b) => b - a);

  const now = Date.now();
  const oneWeek = 7 * 24 * 60 * 60 * 1000;

  let lastAttend = 0;
  for (const t of dates) {
    if (t <= now) {
      lastAttend = t;
      break;
    }
  }

  if (lastAttend === 0) return true;
  const daysSince = (now - lastAttend) / (24 * 60 * 60 * 1000);
  return daysSince >= 14;
}

export default function WhipBanner() {
  const { attendance } = useAttendance();
  const show = hasTwoWeekNoAttend(attendance);
  if (!show) return null;

  return (
    <div className="rounded-xl p-4 flex items-center gap-3 bg-red-500/15 border border-red-500/30">
      <span className="text-[28px]">🪓</span>
      <div>
        <p className="font-bebas text-[12px] font-medium text-red-500">
          2주 연속 무출석
        </p>
        <p className="font-bebas text-[10px] text-neutral-400">
          다음 월요일 정산 시 -3 🥕 차감 예정
        </p>
      </div>
    </div>
  );
}
