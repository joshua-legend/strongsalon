"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAttendance } from "@/context/AttendanceContext";
import { useChartData } from "@/context/ChartDataContext";
import { useInbody } from "@/context/InbodyContext";
import type { InbodyRecord } from "@/types/workout";
import { useWorkoutRecords } from "@/context/WorkoutRecordContext";
import { workoutHistory } from "@/data/workoutHistory";
import { getMonthGrid } from "@/utils/calendar";
import InbodyInputSheet from "@/components/home/InbodyInputSheet";
import RecordWorkoutAddSheet from "@/components/record/RecordWorkoutAddSheet";
import DayWorkoutDetail from "./DayWorkoutDetail";

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] as const;

type CalendarMarkerType = "pt" | "self" | "inbody";

const markerOrder: CalendarMarkerType[] = ["pt", "self", "inbody"];

const typeColor: Record<CalendarMarkerType, string> = {
  pt: "#f97316",
  self: "#22c55e",
  inbody: "#0ea5e9",
};

const typeLabel: Record<CalendarMarkerType, string> = {
  pt: "PT",
  self: "개인운동",
  inbody: "인바디",
};

function formatDateKey(year: number, month: number, day: number): string {
  return `${year}-${month + 1}-${day}`;
}

function isDateInMonth(dateKey: string, year: number, month: number): boolean {
  const [y, m] = dateKey.split("-").map(Number);
  return Number.isFinite(y) && Number.isFinite(m) && y === year && m === month + 1;
}

function normalizeDateKey(rawDate: string): string {
  const [y, m, d] = rawDate.split("-").map(Number);
  if (![y, m, d].every(Number.isFinite)) return rawDate;
  return `${y}-${m}-${d}`;
}

function toIsoDateKey(rawDate: string | null): string | undefined {
  if (!rawDate) return undefined;
  const [y, m, d] = rawDate.split("-").map(Number);
  if (![y, m, d].every(Number.isFinite)) return undefined;
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function addMarker(
  markerMap: Record<string, Set<CalendarMarkerType>>,
  dateKey: string,
  marker: CalendarMarkerType
) {
  if (!markerMap[dateKey]) {
    markerMap[dateKey] = new Set<CalendarMarkerType>();
  }
  markerMap[dateKey].add(marker);
}

function getMarkerAccent(markers: CalendarMarkerType[]): string {
  if (markers.length === 0) return "var(--accent-main)";
  if (markers.length === 1) return typeColor[markers[0]];
  return "#f97316";
}

function getMarkerLabel(markers: CalendarMarkerType[]): string | undefined {
  if (markers.length === 0) return undefined;
  return markers.map((marker) => typeLabel[marker]).join(" + ");
}

interface AttendCalendarProps {
  year: number;
  month: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export default function AttendCalendar({
  year,
  month,
  onPrevMonth,
  onNextMonth,
}: AttendCalendarProps) {
  const todayDefaultDate = useMemo(() => {
    const now = new Date();
    if (now.getFullYear() !== year || now.getMonth() !== month) return null;
    return formatDateKey(year, month, now.getDate());
  }, [year, month]);

  const [manualSelectedDate, setManualSelectedDate] = useState<string | null>(null);
  const [addWorkoutDate, setAddWorkoutDate] = useState<string | null>(null);
  const [addInbodyDate, setAddInbodyDate] = useState<string | null>(null);

  const { attendance } = useAttendance();
  const { inbodyHistory } = useInbody();
  const { chartDataPoints } = useChartData();
  const { records, getWorkoutRecordByDate } = useWorkoutRecords();

  const grid = useMemo(() => getMonthGrid(year, month), [year, month]);

  const { dayMarkerMap, inbodyRecordMap } = useMemo(() => {
    const markerMap: Record<string, Set<CalendarMarkerType>> = {};
    const recordMap: Record<string, InbodyRecord> = {};

    attendance.forEach((entry) => {
      const key = normalizeDateKey(entry.date);
      if (entry.type === "pt" || entry.type === "both") {
        addMarker(markerMap, key, "pt");
      }
      if (entry.type === "self" || entry.type === "both") {
        addMarker(markerMap, key, "self");
      }
    });

    workoutHistory.forEach((record) => {
      const key = normalizeDateKey(record.date);
      if (record.type === "pt" || record.type === "both") {
        addMarker(markerMap, key, "pt");
      }
      if (record.type === "self" || record.type === "both") {
        addMarker(markerMap, key, "self");
      }
    });

    records.forEach((record) => {
      const key = normalizeDateKey(record.date);
      if (record.type === "pt" || record.type === "both") {
        addMarker(markerMap, key, "pt");
      }
      if (record.type === "self" || record.type === "both") {
        addMarker(markerMap, key, "self");
      }
    });

    inbodyHistory.forEach((record) => {
      const key = normalizeDateKey(record.date);
      addMarker(markerMap, key, "inbody");
      recordMap[key] = record;
    });

    const inbodyChartKeys = [
      "inbody.weight",
      "inbody.muscleMass",
      "inbody.fatPercent",
    ] as const;

    inbodyChartKeys.forEach((metricKey) => {
      (chartDataPoints[metricKey] ?? []).forEach((point) => {
        if (point.value > 0) {
          addMarker(markerMap, normalizeDateKey(point.date), "inbody");
        }
      });
    });

    const sortedMarkerMap = Object.fromEntries(
      Object.entries(markerMap).map(([dateKey, markerSet]) => [
        dateKey,
        markerOrder.filter((marker) => markerSet.has(marker)),
      ])
    ) as Record<string, CalendarMarkerType[]>;

    return {
      dayMarkerMap: sortedMarkerMap,
      inbodyRecordMap: recordMap,
    };
  }, [attendance, inbodyHistory, chartDataPoints, records]);

  const selectedDate = useMemo(() => {
    if (manualSelectedDate && isDateInMonth(manualSelectedDate, year, month)) {
      return manualSelectedDate;
    }
    return todayDefaultDate;
  }, [manualSelectedDate, month, todayDefaultDate, year]);

  const selectedMarkers = selectedDate
    ? dayMarkerMap[normalizeDateKey(selectedDate)] ?? []
    : [];
  const selectedHasInbody = selectedMarkers.includes("inbody");
  const selectedInbodyRecord = selectedDate
    ? inbodyRecordMap[normalizeDateKey(selectedDate)]
    : undefined;
  const selectedMarkerColor = getMarkerAccent(selectedMarkers);
  const selectedMarkerLabel = getMarkerLabel(selectedMarkers);
  const editingInbodyRecord = addInbodyDate
    ? inbodyRecordMap[normalizeDateKey(addInbodyDate)]
    : undefined;

  return (
    <div
      className="rounded-2xl border p-5 shadow-sm transition-colors duration-300"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border-light)",
      }}
    >
      <div className="mb-4 flex items-center justify-center gap-4">
        {markerOrder.map((type) => (
          <div key={type} className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: typeColor[type] }}
            />
            <span
              className="font-bebas text-[11px] tracking-wider"
              style={{ color: "var(--text-sub)" }}
            >
              {typeLabel[type]}
            </span>
          </div>
        ))}
      </div>
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={onPrevMonth}
          className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-300 hover:bg-[var(--bg-card-hover)] active:scale-95"
          style={{ color: "var(--text-sub)" }}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span
          className="font-bebas text-xl tracking-wider transition-colors duration-300"
          style={{ color: "var(--text-main)" }}
        >
          {year}. {String(month + 1).padStart(2, "0")}
        </span>
        <button
          onClick={onNextMonth}
          className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-300 hover:bg-[var(--bg-card-hover)] active:scale-95"
          style={{ color: "var(--text-sub)" }}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mb-2 grid grid-cols-7 gap-1">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="py-1 text-center font-bebas text-[11px] transition-colors duration-300"
            style={{ color: "var(--text-sub)" }}
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {grid.map((day, idx) => {
          if (day === null) return <div key={idx} className="h-11" />;

          const dateKey = formatDateKey(year, month, day);
          const markers = dayMarkerMap[dateKey] ?? [];
          const isSelected = selectedDate === dateKey;
          const accentColor = getMarkerAccent(markers);

          return (
            <button
              key={idx}
              type="button"
              onClick={() => setManualSelectedDate(dateKey)}
              className="flex h-11 w-full flex-col items-center justify-center rounded-lg border transition-all duration-300 hover:bg-[var(--bg-card-hover)] active:scale-95"
              style={{
                borderColor: isSelected ? accentColor : "transparent",
                backgroundColor: isSelected ? "var(--bg-card-hover)" : "transparent",
                boxShadow: isSelected ? "0 1px 2px 0 rgb(0 0 0 / 0.05)" : "none",
              }}
            >
              <span
                className="font-bebas text-lg leading-none"
                style={{
                  color: isSelected && markers.length > 0 ? accentColor : "var(--text-main)",
                }}
              >
                {day}
              </span>
              <span className="mt-1 flex min-h-[6px] items-center justify-center gap-1">
                {markers.map((marker) => (
                  <span
                    key={`${dateKey}-${marker}`}
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: typeColor[marker] }}
                  />
                ))}
              </span>
            </button>
          );
        })}
      </div>

      {selectedDate ? (
        <DayWorkoutDetail
          dateKey={selectedDate}
          record={getWorkoutRecordByDate(selectedDate, workoutHistory)}
          attendLabelText={selectedMarkerLabel}
          attendColor={selectedMarkerColor}
          typeColor={typeColor}
          typeLabel={typeLabel}
          hasInbodyRecord={selectedHasInbody}
          inbodyRecord={selectedInbodyRecord}
          showWorkoutAdd={true}
          showInbodyAdd={true}
          onAddWorkout={(dateKey) => setAddWorkoutDate(dateKey)}
          onAddInbody={(dateKey) => setAddInbodyDate(dateKey)}
          onClose={() => setManualSelectedDate(null)}
        />
      ) : null}

      <RecordWorkoutAddSheet
        key={addWorkoutDate ?? "record-add-closed"}
        open={Boolean(addWorkoutDate)}
        dateKey={addWorkoutDate}
        onClose={() => setAddWorkoutDate(null)}
      />

      <InbodyInputSheet
        key={addInbodyDate ?? "inbody-add-closed"}
        open={Boolean(addInbodyDate)}
        initialDate={toIsoDateKey(addInbodyDate)}
        initialRecord={editingInbodyRecord}
        onClose={() => setAddInbodyDate(null)}
      />
    </div>
  );
}

