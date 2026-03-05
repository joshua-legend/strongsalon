"use client";

import { useState, useMemo } from "react";
import { useAttendance } from "@/context/AttendanceContext";
import { workoutHistory } from "@/data/workoutHistory";
import { getMonthGrid, getWeekDays, isToday } from "@/utils/calendar";
import DayWorkoutDetail from "./DayWorkoutDetail";

const typeColor: Record<string, string> = {
  pt: "rgb(249,115,22)",
  self: "rgb(163,230,53)",
  both: "rgb(168,85,247)",
};

const typeLabel: Record<string, string> = {
  pt: "PT",
  self: "개인",
  both: "PT+개인",
};

function formatDateKey(year: number, month: number, day: number): string {
  return `${year}-${month + 1}-${day}`;
}

interface AttendCalendarProps {
  year: number;
  month: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export default function AttendCalendar({ year, month, onPrevMonth, onNextMonth }: AttendCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const { attendance } = useAttendance();

  const grid = useMemo(() => getMonthGrid(year, month), [year, month]);
  const dayNames = getWeekDays();

  const attendMap = useMemo(() => {
    const map: Record<string, string> = {};
    attendance.forEach((a) => {
      map[a.date] = a.type;
    });
    return map;
  }, [attendance]);

  return (
    <div className="card">
      <p className="card-label mb-3">📅 출석 캘린더</p>

      <div className="flex items-center gap-3 mb-3 justify-center">
        {[
          { color: typeColor.pt, label: "PT수업" },
          { color: typeColor.self, label: "개인운동" },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: l.color }}
            />
            <span className="font-bebas text-[8px] text-neutral-400">
              {l.label}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-3">
        <button onClick={onPrevMonth} className="text-[16px] px-2 text-neutral-400">
          ‹
        </button>
        <span className="font-bebas text-[18px] text-white">
          {year}년 {month + 1}월
        </span>
        <button onClick={onNextMonth} className="text-[16px] px-2 text-neutral-400">
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {dayNames.map((d) => (
          <div key={d} className="text-center font-bebas text-[8px] py-1 text-neutral-500">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {grid.map((day, i) => {
          if (day === null) return <div key={i} className="h-9" />;
          const dateKey = formatDateKey(year, month, day);
          const type = attendMap[dateKey];
          const today = isToday(year, month, day);
          const isSelected = selectedDate === dateKey;

          return (
            <button
              key={i}
              type="button"
              onClick={() => setSelectedDate((prev) => (prev === dateKey ? null : dateKey))}
              className="h-9 rounded-lg flex flex-col items-center justify-center gap-0.5 text-[11px] relative w-full cursor-pointer active:scale-[0.97] transition-transform"
              style={{
                background: type ? `${typeColor[type]}15` : "transparent",
                border: isSelected
                  ? "2px solid rgb(249,115,22)"
                  : today
                    ? "1.5px solid rgb(249,115,22)"
                    : type
                      ? `1px solid ${typeColor[type]}30`
                      : "1px solid transparent",
                color: type ? typeColor[type] : "rgb(163,163,163)",
              }}
            >
              <span className="leading-none">{day}</span>
              {type && (
                <span className="font-bebas text-[6px] leading-none opacity-80">
                  {typeLabel[type]}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {selectedDate && (
        <DayWorkoutDetail
          dateKey={selectedDate}
          record={workoutHistory.find((r) => r.date === selectedDate)}
          attendType={attendMap[selectedDate]}
          typeColor={typeColor}
          typeLabel={typeLabel}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </div>
  );
}
