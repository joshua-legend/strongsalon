"use client";

import { useState, useCallback } from "react";
import AttendCalendar from "./AttendCalendar";
import ConditionDonut from "./ConditionDonut";
import StatGrid from "./StatGrid";
import VolumeChart from "./VolumeChart";
import BodyMap from "@/components/home/BodyMap";

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
      <div className="fade-up fade-in-4">
        <AttendCalendar
          year={safeYear}
          month={safeMonth}
          onPrevMonth={onPrevMonth}
          onNextMonth={onNextMonth}
        />
      </div>
      <div className="fade-up fade-in-1">
        <StatGrid year={safeYear} month={safeMonth} />
      </div>
      <div className="fade-up fade-in-3">
        <ConditionDonut />
      </div>
      <div className="fade-up fade-in-4">
        <BodyMap />
      </div>
      {/* <div className="fade-up fade-in-2">
        <VolumeChart />
      </div> */}
      <div className="h-4" />
    </div>
  );
}
