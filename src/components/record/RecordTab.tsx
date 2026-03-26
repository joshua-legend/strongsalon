"use client";

import { useCallback, useState } from "react";
import AttendCalendar from "@/components/stats/AttendCalendar";

export default function RecordTab() {
  const now = new Date();
  const [year, setYear] = useState(() => now.getFullYear());
  const [month, setMonth] = useState(() => now.getMonth());

  const onPrevMonth = useCallback(() => {
    setMonth((value) => {
      if (value <= 0) {
        setYear((prev) => prev - 1);
        return 11;
      }
      return value - 1;
    });
  }, []);

  const onNextMonth = useCallback(() => {
    setMonth((value) => {
      if (value >= 11) {
        setYear((prev) => prev + 1);
        return 0;
      }
      return value + 1;
    });
  }, []);

  const safeYear = Number.isFinite(year) ? year : now.getFullYear();
  const safeMonth =
    Number.isFinite(month) && month >= 0 && month <= 11
      ? month
      : now.getMonth();

  return (
    <div className="px-4 py-4">
      <AttendCalendar
        year={safeYear}
        month={safeMonth}
        onPrevMonth={onPrevMonth}
        onNextMonth={onNextMonth}
      />
    </div>
  );
}
