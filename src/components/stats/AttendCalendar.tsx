"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAttendance } from "@/context/AttendanceContext";
import { workoutHistory } from "@/data/workoutHistory";
import { useWorkoutRecords } from "@/context/WorkoutRecordContext";
import { getMonthGrid } from "@/utils/calendar";
import DayWorkoutDetail from "./DayWorkoutDetail";

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] as const;

const typeColor: Record<string, string> = {
  pt: "var(--accent-main)",
  self: "var(--accent-sub)",
};

const typeLabel: Record<string, string> = {
  pt: "PT수업",
  self: "개인운동",
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
  const { getWorkoutRecordByDate } = useWorkoutRecords();

  const grid = useMemo(() => getMonthGrid(year, month), [year, month]);

  const attendMap = useMemo(() => {
    const map: Record<string, string> = {};
    attendance.forEach((a) => {
      if (a.type === "both") {
        map[a.date] = "pt";
      } else {
        map[a.date] = a.type;
      }
    });
    return map;
  }, [attendance]);

  return (
    <div
      className="rounded-2xl p-5 border transition-colors duration-300 shadow-sm"
      style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-light)" }}
    >
      {/* 범례 */}
      <div className="flex items-center gap-4 mb-4 justify-center">
        <div className="flex items-center gap-1.5">
          <div
            className="w-2 h-2 rounded-full transition-colors duration-300"
            style={{ backgroundColor: "var(--accent-main)" }}
          />
          <span className="font-bebas text-[11px] tracking-wider transition-colors duration-300" style={{ color: "var(--text-sub)" }}>
            PT수업
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div
            className="w-2 h-2 rounded-full transition-colors duration-300"
            style={{ backgroundColor: "var(--accent-sub)" }}
          />
          <span className="font-bebas text-[11px] tracking-wider transition-colors duration-300" style={{ color: "var(--text-sub)" }}>
            개인운동
          </span>
        </div>
      </div>

      {/* 월 변경 */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onPrevMonth}
          className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors duration-300 active:scale-95 hover:bg-(--bg-card-hover)"
          style={{ color: "var(--text-sub)" }}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="font-bebas text-xl tracking-wider transition-colors duration-300" style={{ color: "var(--text-main)" }}>
          {year}. {String(month + 1).padStart(2, "0")}
        </span>
        <button
          onClick={onNextMonth}
          className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors duration-300 active:scale-95 hover:bg-(--bg-card-hover)"
          style={{ color: "var(--text-sub)" }}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map((d) => (
          <div key={d} className="text-center font-bebas text-[11px] py-1 transition-colors duration-300" style={{ color: "var(--text-sub)" }}>
            {d}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 gap-1">
        {grid.map((day, i) => {
          if (day === null) return <div key={i} className="h-9" />;
          const dateKey = formatDateKey(year, month, day);
          const type = attendMap[dateKey];
          const isSelected = selectedDate === dateKey;

          return (
            <button
              key={i}
              type="button"
              onClick={() => setSelectedDate(dateKey)}
              className={`h-9 rounded-lg flex items-center justify-center w-full transition-all duration-300 active:scale-95 ${!isSelected ? "hover:bg-(--bg-card-hover)" : ""}`}
              style={
                isSelected
                  ? {
                      borderWidth: 2,
                      borderColor: "var(--accent-main)",
                      color: "var(--accent-main)",
                      backgroundColor: "var(--accent-bg)",
                      boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
                    }
                  : {
                      color: "var(--text-main)",
                      backgroundColor: type ? (type === "pt" ? "rgba(163,230,53,0.1)" : "rgba(34,197,94,0.1)" as string) : undefined,
                    }
              }
            >
              <span className="font-bebas text-lg">{day}</span>
            </button>
          );
        })}
      </div>

      {selectedDate && (
        <DayWorkoutDetail
          dateKey={selectedDate}
          record={getWorkoutRecordByDate(selectedDate, workoutHistory)}
          attendType={attendMap[selectedDate]}
          typeColor={typeColor}
          typeLabel={typeLabel}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </div>
  );
}
