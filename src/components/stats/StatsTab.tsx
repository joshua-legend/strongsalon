"use client";

import { useState, useCallback } from "react";
import AttendCalendar from "./AttendCalendar";
import ConditionDonut from "./ConditionDonut";
import StatGrid from "./StatGrid";

export default function StatsTab() {
  const now = new Date();
  const [year, setYear] = useState(() => now.getFullYear());
  const [month, setMonth] = useState(() => now.getMonth());

  const onPrevMonth = useCallback(() => {
    setMonth((m) => {
      if (m <= 0) {
        setYear((y) => y - 1);
        return 11;
      }
      return m - 1;
    });
  }, []);

  const onNextMonth = useCallback(() => {
    setMonth((m) => {
      if (m >= 11) {
        setYear((y) => y + 1);
        return 0;
      }
      return m + 1;
    });
  }, []);

  const safeYear = Number.isFinite(year) ? year : now.getFullYear();
  const safeMonth =
    Number.isFinite(month) && month >= 0 && month <= 11
      ? month
      : now.getMonth();

  return (
    <div className="px-4 py-4 flex flex-col gap-4">
      <section className="space-y-3 fade-up fade-in-4">
        <h2 className="text-xs font-semibold tracking-wider uppercase transition-colors duration-300" style={{ color: "var(--text-sub)" }}>
          Attendance Calendar
        </h2>
        <AttendCalendar
          year={safeYear}
          month={safeMonth}
          onPrevMonth={onPrevMonth}
          onNextMonth={onNextMonth}
        />
      </section>
      <section className="space-y-3 fade-up fade-in-1">
        <h2 className="text-xs font-semibold tracking-wider uppercase transition-colors duration-300" style={{ color: "var(--text-sub)" }}>
          Monthly Stats
        </h2>
        <StatGrid year={safeYear} month={safeMonth} />
      </section>
      <div className="fade-up fade-in-3">
        <ConditionDonut />
      </div>
      <div className="h-4" />
    </div>
  );
}
