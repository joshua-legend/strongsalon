"use client";

import { useState, useRef, useEffect } from "react";
import { Plus } from "lucide-react";
import { useChartData } from "@/context/ChartDataContext";
import type { InbodyChartOption } from "@/utils/goalChartData";
import { CYCLE_WEEKS } from "@/utils/chartConstants";

const METRIC_LABELS: Record<InbodyChartOption, string> = {
  fatPercent: "체지방률",
  muscleMass: "골격근",
  weight: "체중",
};

const METRIC_UNITS: Record<InbodyChartOption, string> = {
  fatPercent: "%",
  muscleMass: "kg",
  weight: "kg",
};

function formatDateLabel(configuredAt: string, weekIndex: number): string {
  const d = new Date(configuredAt);
  d.setDate(d.getDate() + weekIndex * 7);
  const m = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${m}-${day}`;
}

function getDateForWeek(configuredAt: string, weekIndex: number): string {
  const d = new Date(configuredAt);
  d.setDate(d.getDate() + weekIndex * 7);
  return d.toISOString().slice(0, 10);
}

interface InbodyRecordInputPopoverProps {
  metric: InbodyChartOption;
  configuredAt: string;
  metricKey: "inbody.fatPercent" | "inbody.muscleMass" | "inbody.weight";
  existingValues?: Record<number, number>;
  onRecorded?: () => void;
}

export default function InbodyRecordInputPopover({
  metric,
  configuredAt,
  metricKey,
  existingValues = {},
  onRecorded,
}: InbodyRecordInputPopoverProps) {
  const { appendChartPoint } = useChartData();
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<Record<number, number>>(() => ({
    0: existingValues[0] ?? 0,
    1: existingValues[1] ?? 0,
    2: existingValues[2] ?? 0,
    3: existingValues[3] ?? 0,
    4: existingValues[4] ?? 0,
  }));

  const prevOpen = useRef(false);
  useEffect(() => {
    if (open && !prevOpen.current) {
      setValues({
        0: existingValues[0] ?? 0,
        1: existingValues[1] ?? 0,
        2: existingValues[2] ?? 0,
        3: existingValues[3] ?? 0,
        4: existingValues[4] ?? 0,
      });
    }
    prevOpen.current = open;
  }, [open, existingValues]);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const unit = METRIC_UNITS[metric];
  const label = METRIC_LABELS[metric];

  const handleSave = () => {
    for (let w = 0; w <= CYCLE_WEEKS; w++) {
      const v = values[w];
      if (typeof v === "number" && v > 0) {
        const date = getDateForWeek(configuredAt, w);
        appendChartPoint(metricKey, { day: w * 7, value: v, date }, configuredAt);
      }
    }
    onRecorded?.();
    setOpen(false);
  };

  const hasAnyValue = Object.values(values).some((v) => v > 0);

  const [hover, setHover] = useState(false);
  return (
    <div className="relative" ref={popoverRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all duration-300 shadow-sm border active:scale-95"
        style={{
          backgroundColor: "var(--bg-card)",
          color: hover ? "var(--accent-main)" : "var(--text-main)",
          borderColor: hover ? "var(--accent-main)" : "var(--border-light)",
        }}
        aria-label="기록 추가"
      >
        <span
          className="w-4 h-4 rounded flex items-center justify-center transition-colors duration-300"
          style={{ backgroundColor: "var(--accent-bg)", color: "var(--accent-main)" }}
        >
          <Plus className="w-3 h-3" />
        </span>
        <span className="text-[11px] font-bold">기록 추가</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 z-50 w-64 rounded-xl shadow-xl p-4 goal-record-popover">
          <div className="text-xs font-bold mb-3 goal-record-popover-label">
            {label} 기록 추가
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {Array.from({ length: CYCLE_WEEKS + 1 }, (_, i) => (
              <div key={i} className="flex items-center gap-2">
                <label className="flex-1 min-w-0 px-2 py-1.5 rounded-lg text-[11px] font-mono flex items-center goal-record-input-label">
                  {formatDateLabel(configuredAt, i)}
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  placeholder="0"
                  value={values[i] || ""}
                  onChange={(e) =>
                    setValues((prev) => ({
                      ...prev,
                      [i]: Number(e.target.value) || 0,
                    }))
                  }
                  className="w-20 px-2 py-1.5 rounded-lg font-mono text-xs focus:outline-none goal-record-input"
                />
                <span className="text-[10px] w-6 goal-record-unit">{unit}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex-1 py-2 rounded-lg text-xs font-bold transition-colors goal-record-cancel"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!hasAnyValue}
              className="flex-1 py-2 rounded-lg text-xs font-bold disabled:opacity-40 disabled:pointer-events-none hover:brightness-110 transition-all goal-record-save"
            >
              저장
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
