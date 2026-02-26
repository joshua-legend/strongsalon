"use client";

import { useState, useMemo } from "react";
import { attendance } from "@/data/attendance";
import { workoutHistory } from "@/data/workoutHistory";
import { getMonthGrid, getWeekDays, isToday } from "@/utils/calendar";

const typeColor: Record<string, string> = {
  pt: "var(--orange)",
  self: "var(--green)",
  both: "var(--purple)",
};

const typeLabel: Record<string, string> = {
  pt: "PT",
  self: "개인",
  both: "PT+개인",
};

function formatDateKey(year: number, month: number, day: number): string {
  return `${year}-${month + 1}-${day}`;
}

function formatDisplayDate(dateKey: string): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  return `${y}년 ${m}월 ${d}일`;
}

function DayWorkoutDetail({
  dateKey,
  record,
  attendType,
  typeColor,
  typeLabel,
  onClose,
}: {
  dateKey: string;
  record: { date: string; type: string; exercises: { icon: string; name: string; sets: { weight: number; reps: number }[] }[]; cardio?: { type: string; label: string; value: string } } | undefined;
  attendType?: string;
  typeColor: Record<string, string>;
  typeLabel: Record<string, string>;
  onClose: () => void;
}) {
  if (!record && !attendType) {
    return (
      <div
        className="mt-4 pt-3 flex flex-col gap-2"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <div className="flex items-center justify-between">
          <span className="font-space text-[10px]" style={{ color: "var(--muted2)" }}>
            {formatDisplayDate(dateKey)}
          </span>
          <button
            onClick={onClose}
            className="text-[12px] px-2 py-1 rounded"
            style={{ color: "var(--muted2)", background: "var(--s3)" }}
          >
            닫기
          </button>
        </div>
        <p className="font-space text-[10px] py-4 text-center" style={{ color: "var(--muted2)" }}>
          해당 날짜에 운동 기록이 없습니다
        </p>
      </div>
    );
  }

  return (
    <div
      className="mt-4 pt-3 flex flex-col gap-3"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-space text-[10px]" style={{ color: "var(--muted2)" }}>
            {formatDisplayDate(dateKey)}
          </span>
          {attendType && (
            <span
              className="font-space text-[8px] px-1.5 py-0.5 rounded"
              style={{
                background: `${typeColor[attendType]}25`,
                color: typeColor[attendType],
              }}
            >
              {typeLabel[attendType]}
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-[12px] px-2 py-1 rounded"
          style={{ color: "var(--muted2)", background: "var(--s3)" }}
        >
          닫기
        </button>
      </div>

      {record?.exercises && record.exercises.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="font-space text-[9px]" style={{ color: "var(--muted)" }}>
            운동 기록
          </p>
          {record.exercises.map((ex, idx) => (
            <div
              key={idx}
              className="rounded-lg p-2.5"
              style={{ background: "var(--s2)", border: "1px solid var(--border)" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[14px]">{ex.icon}</span>
                <span className="font-space text-[11px]" style={{ color: "var(--text)" }}>
                  {ex.name}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {ex.sets.map((s, si) => (
                  <span
                    key={si}
                    className="font-space text-[9px] px-2 py-1 rounded"
                    style={{
                      background: "var(--s3)",
                      color: "var(--muted2)",
                    }}
                  >
                    {s.weight > 0 ? `${s.weight}kg × ${s.reps}회` : `${s.reps}회`}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {record?.cardio && (
        <div
          className="rounded-lg p-2.5 flex items-center justify-between"
          style={{ background: "var(--s2)", border: "1px solid var(--border)" }}
        >
          <span className="font-space text-[11px]" style={{ color: "var(--text)" }}>
            🏃 {record.cardio.label}
          </span>
          <span className="font-space text-[10px]" style={{ color: "var(--muted2)" }}>
            {record.cardio.value}
          </span>
        </div>
      )}

      {attendType && !record?.exercises?.length && (
        <p className="font-space text-[10px] py-2" style={{ color: "var(--muted2)" }}>
          상세 운동 기록이 없습니다
        </p>
      )}
    </div>
  );
}

interface AttendCalendarProps {
  year: number;
  month: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export default function AttendCalendar({ year, month, onPrevMonth, onNextMonth }: AttendCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const grid = useMemo(() => getMonthGrid(year, month), [year, month]);
  const dayNames = getWeekDays();

  const attendMap = useMemo(() => {
    const map: Record<string, string> = {};
    attendance.forEach((a) => {
      map[a.date] = a.type;
    });
    return map;
  }, []);

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
            <span
              className="font-space text-[8px]"
              style={{ color: "var(--muted2)" }}
            >
              {l.label}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-3">
        <button
          onClick={onPrevMonth}
          className="text-[16px] px-2"
          style={{ color: "var(--muted2)" }}
        >
          ‹
        </button>
        <span
          className="font-bebas text-[18px]"
          style={{ color: "var(--text)" }}
        >
          {year}년 {month + 1}월
        </span>
        <button
          onClick={onNextMonth}
          className="text-[16px] px-2"
          style={{ color: "var(--muted2)" }}
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {dayNames.map((d) => (
          <div
            key={d}
            className="text-center font-space text-[8px] py-1"
            style={{ color: "var(--muted)" }}
          >
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
                  ? "2px solid var(--orange)"
                  : today
                    ? "1.5px solid var(--orange)"
                    : type
                      ? `1px solid ${typeColor[type]}30`
                      : "1px solid transparent",
                color: type ? typeColor[type] : "var(--muted2)",
              }}
            >
              <span className="leading-none">{day}</span>
              {type && (
                <span className="font-space text-[6px] leading-none opacity-80">
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
