"use client";

import type { DayWorkoutRecord } from "@/data/workoutHistory";
import type { InbodyRecord } from "@/types/workout";

interface DayWorkoutDetailProps {
  dateKey: string;
  record: DayWorkoutRecord | undefined;
  attendType?: string;
  attendLabelText?: string;
  attendColor?: string;
  typeColor: Record<string, string>;
  typeLabel: Record<string, string>;
  hasInbodyRecord?: boolean;
  inbodyRecord?: InbodyRecord;
  showWorkoutAdd?: boolean;
  showInbodyAdd?: boolean;
  onAddWorkout?: (dateKey: string) => void;
  onAddInbody?: (dateKey: string) => void;
  onClose: () => void;
}

type ActionMode = "add" | "update";

function formatDisplayDate(dateKey: string): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  return `${y}. ${String(m).padStart(2, "0")}. ${String(d).padStart(2, "0")}`;
}

function formatDuration(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0 && s > 0) return `${m}m ${s}s`;
  if (m > 0) return `${m}m`;
  return `${s}s`;
}

function formatMetricNumber(value?: number, fractionDigits = 1): string {
  if (typeof value !== "number" || Number.isNaN(value)) return "-";
  return Number.isInteger(value) ? String(value) : value.toFixed(fractionDigits);
}

function WorkoutActionButton({
  dateKey,
  mode,
  onAddWorkout,
}: {
  dateKey: string;
  mode: ActionMode;
  onAddWorkout?: (dateKey: string) => void;
}) {
  if (!onAddWorkout) return null;
  return (
    <button
      type="button"
      onClick={() => onAddWorkout(dateKey)}
      className="w-full rounded-xl border px-3 py-3 text-[12px] font-bold transition-all hover:brightness-110 active:scale-[0.98]"
      style={{
        borderColor: "var(--accent-main)",
        color: "var(--accent-main)",
        backgroundColor: "var(--accent-bg)",
      }}
    >
      {mode === "update" ? "운동 기록 업데이트" : "운동 기록 추가"}
    </button>
  );
}

function InbodyActionButton({
  dateKey,
  mode,
  onAddInbody,
}: {
  dateKey: string;
  mode: ActionMode;
  onAddInbody?: (dateKey: string) => void;
}) {
  if (!onAddInbody) return null;
  return (
    <button
      type="button"
      onClick={() => onAddInbody(dateKey)}
      className="w-full rounded-xl border px-3 py-3 text-[12px] font-bold transition-all hover:brightness-110 active:scale-[0.98]"
      style={{
        borderColor: "#38bdf8",
        color: "#38bdf8",
        backgroundColor: "rgba(56,189,248,0.1)",
      }}
    >
      {mode === "update" ? "인바디 기록 업데이트" : "인바디 기록 추가"}
    </button>
  );
}

function ActionArea({
  dateKey,
  showWorkoutAction,
  showInbodyAction,
  workoutMode,
  inbodyMode,
  onAddWorkout,
  onAddInbody,
}: {
  dateKey: string;
  showWorkoutAction: boolean;
  showInbodyAction: boolean;
  workoutMode: ActionMode;
  inbodyMode: ActionMode;
  onAddWorkout?: (dateKey: string) => void;
  onAddInbody?: (dateKey: string) => void;
}) {
  const count = Number(showWorkoutAction) + Number(showInbodyAction);
  if (count === 0) return null;

  return (
    <div className="space-y-2">
      <p
        className="text-[10px] font-semibold tracking-wide"
        style={{ color: "var(--text-sub)" }}
      >
        기존 데이터가 있으면 같은 날짜 기록을 업데이트합니다.
      </p>
      <div className={`grid gap-2 ${count > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
        {showWorkoutAction ? (
          <WorkoutActionButton
            dateKey={dateKey}
            mode={workoutMode}
            onAddWorkout={onAddWorkout}
          />
        ) : null}
        {showInbodyAction ? (
          <InbodyActionButton
            dateKey={dateKey}
            mode={inbodyMode}
            onAddInbody={onAddInbody}
          />
        ) : null}
      </div>
    </div>
  );
}

export default function DayWorkoutDetail({
  dateKey,
  record,
  attendType,
  attendLabelText,
  attendColor,
  typeColor,
  typeLabel,
  hasInbodyRecord = false,
  inbodyRecord,
  showWorkoutAdd = true,
  showInbodyAdd = true,
  onAddWorkout,
  onAddInbody,
  onClose,
}: DayWorkoutDetailProps) {
  const hasExercises = !!record?.exercises?.length;
  const hasCardio = !!record?.cardio;
  const hasDuration = (record?.durationSec ?? 0) > 0;
  const hasCondition = !!record?.condition;
  const hasWorkoutRecord = !!record;
  const hasNoDetail = !hasExercises && !hasCardio && !hasDuration;

  const resolvedAttendLabel =
    attendLabelText ?? (attendType ? typeLabel[attendType] ?? attendType : null);
  const resolvedAttendColor =
    attendColor ??
    (attendType ? typeColor[attendType] ?? "var(--text-sub)" : "var(--text-sub)");
  const hasAttendBadge = Boolean(resolvedAttendLabel);

  const showWorkoutAction = !!onAddWorkout && showWorkoutAdd;
  const showInbodyAction = !!onAddInbody && showInbodyAdd;
  const workoutMode: ActionMode = hasWorkoutRecord ? "update" : "add";
  const inbodyMode: ActionMode = hasInbodyRecord ? "update" : "add";

  if (!record && !hasAttendBadge) {
    return (
      <div
        className="mt-4 flex flex-col gap-3 border-t pt-4 transition-colors duration-300"
        style={{ borderColor: "var(--border-light)" }}
      >
        <div className="flex items-center justify-between">
          <span
            className="font-bebas text-[15px] tracking-wider transition-colors duration-300"
            style={{ color: "var(--text-main)" }}
          >
            {formatDisplayDate(dateKey)}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border px-2.5 py-1.5 font-bebas text-[11px] transition-all duration-300 hover:scale-95 active:scale-90"
            style={{
              backgroundColor: "var(--bg-body)",
              borderColor: "var(--border-light)",
              color: "var(--text-sub)",
            }}
          >
            닫기
          </button>
        </div>

        <p
          className="py-3 text-center font-bebas text-[10px] transition-colors duration-300"
          style={{ color: "var(--text-sub)" }}
        >
          해당 날짜에는 기록이 없습니다.
        </p>

        <ActionArea
          dateKey={dateKey}
          showWorkoutAction={showWorkoutAction}
          showInbodyAction={showInbodyAction}
          workoutMode={workoutMode}
          inbodyMode={inbodyMode}
          onAddWorkout={onAddWorkout}
          onAddInbody={onAddInbody}
        />
      </div>
    );
  }

  return (
    <div
      className="mt-4 flex flex-col gap-3 border-t pt-4 transition-colors duration-300"
      style={{ borderColor: "var(--border-light)" }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="font-bebas text-[15px] tracking-wider transition-colors duration-300"
            style={{ color: "var(--text-main)" }}
          >
            {formatDisplayDate(dateKey)}
          </span>
          {resolvedAttendLabel ? (
            <span
              className="rounded-md border px-1.5 py-0.5 font-bebas text-[9px] tracking-wider"
              style={{
                borderColor: `${resolvedAttendColor}66`,
                color: resolvedAttendColor,
                backgroundColor: `${resolvedAttendColor}14`,
              }}
            >
              {resolvedAttendLabel}
            </span>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border px-2.5 py-1.5 font-bebas text-[11px] transition-all duration-300 hover:scale-95 active:scale-90"
          style={{
            backgroundColor: "var(--bg-body)",
            borderColor: "var(--border-light)",
            color: "var(--text-sub)",
          }}
        >
          닫기
        </button>
      </div>

      {(hasCondition || hasDuration) && (
        <div className="flex items-center gap-2">
          {hasCondition ? (
            <div
              className="rounded-lg border px-2.5 py-1.5"
              style={{
                borderColor: "var(--border-light)",
                backgroundColor: "var(--bg-card)",
              }}
            >
              <span className="font-bebas text-[10px]" style={{ color: "var(--text-main)" }}>
                CONDITION: {record?.condition}
              </span>
            </div>
          ) : null}
          {hasDuration ? (
            <div
              className="rounded-lg border px-2.5 py-1.5"
              style={{
                borderColor: "var(--border-light)",
                backgroundColor: "var(--bg-card)",
              }}
            >
              <span className="font-bebas text-[10px]" style={{ color: "var(--text-main)" }}>
                TIME: {formatDuration(record?.durationSec ?? 0)}
              </span>
            </div>
          ) : null}
        </div>
      )}

      {hasExercises ? (
        <div className="flex flex-col gap-2.5">
          {record!.exercises.map((exercise, idx) => {
            const maxWeight = Math.max(...exercise.sets.map((set) => set.weight), 0);
            const totalVolume = exercise.sets.reduce(
              (sum, set) => sum + set.weight * set.reps,
              0
            );

            return (
              <div
                key={`${exercise.name}-${idx}`}
                className="overflow-hidden rounded-xl border transition-colors duration-300"
                style={{ borderColor: "var(--border-light)" }}
              >
                <div
                  className="flex items-center justify-between px-3 py-2.5 transition-colors duration-300"
                  style={{ backgroundColor: "var(--bg-card-hover)" }}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bebas text-sm">{exercise.icon}</span>
                    <span
                      className="font-bebas text-[12px] transition-colors duration-300"
                      style={{ color: "var(--text-main)" }}
                    >
                      {exercise.name}
                    </span>
                  </div>
                  <span
                    className="font-bebas text-[10px] tracking-wider transition-colors duration-300"
                    style={{ color: "var(--text-sub)" }}
                  >
                    {exercise.sets.length} SETS / {totalVolume.toLocaleString()}kg
                  </span>
                </div>

                <div
                  className="px-3 py-2 transition-colors duration-300"
                  style={{ backgroundColor: "var(--bg-body)" }}
                >
                  <div className="mb-1.5 grid grid-cols-3 gap-x-2">
                    <span className="text-center font-bebas text-[10px]" style={{ color: "var(--text-sub)" }}>
                      SET
                    </span>
                    <span className="text-center font-bebas text-[10px]" style={{ color: "var(--text-sub)" }}>
                      WEIGHT
                    </span>
                    <span className="text-center font-bebas text-[10px]" style={{ color: "var(--text-sub)" }}>
                      REPS
                    </span>
                  </div>

                  {exercise.sets.map((set, setIdx) => {
                    const isHighlight = set.weight === maxWeight && set.weight > 0;
                    const isLast = setIdx === exercise.sets.length - 1;

                    return (
                      <div
                        key={`${exercise.name}-${setIdx}`}
                        className="grid grid-cols-3 gap-x-2 py-1"
                        style={!isLast ? { borderBottom: "1px solid var(--border-light)" } : undefined}
                      >
                        <span className="text-center font-bebas text-[11px]" style={{ color: "var(--text-sub)" }}>
                          {setIdx + 1}
                        </span>
                        <span
                          className="text-center font-bebas text-[12px]"
                          style={{
                            color: isHighlight ? "var(--accent-main)" : "var(--text-main)",
                          }}
                        >
                          {set.weight > 0 ? `${set.weight} kg` : "-"}
                        </span>
                        <span
                          className="text-center font-bebas text-[12px]"
                          style={{
                            color: isHighlight ? "var(--accent-main)" : "var(--text-main)",
                          }}
                        >
                          {set.reps}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      {hasCardio ? (
        <div
          className="flex items-center justify-between rounded-xl border p-2.5 transition-colors duration-300"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border-light)",
          }}
        >
          <span className="font-bebas text-[11px]" style={{ color: "var(--text-main)" }}>
            CARDIO {record?.cardio?.label}
          </span>
          <span className="font-bebas text-[10px]" style={{ color: "var(--text-sub)" }}>
            {record?.cardio?.value}
          </span>
        </div>
      ) : null}

      {inbodyRecord ? (
        <div
          className="overflow-hidden rounded-xl border transition-colors duration-300"
          style={{ borderColor: "var(--border-light)" }}
        >
          <div
            className="px-3 py-2.5 transition-colors duration-300"
            style={{ backgroundColor: "var(--bg-card-hover)" }}
          >
            <span className="font-bebas text-[11px] tracking-wider" style={{ color: "#38bdf8" }}>
              INBODY
            </span>
          </div>
          <div
            className="grid grid-cols-3 gap-2 p-3 transition-colors duration-300"
            style={{ backgroundColor: "var(--bg-body)" }}
          >
            <div
              className="rounded-lg border px-2.5 py-2"
              style={{
                borderColor: "var(--border-light)",
                backgroundColor: "var(--bg-card)",
              }}
            >
              <p className="font-bebas text-[10px]" style={{ color: "var(--text-sub)" }}>
                체중
              </p>
              <p className="font-bebas text-[13px]" style={{ color: "var(--text-main)" }}>
                {formatMetricNumber(inbodyRecord.weight)} kg
              </p>
            </div>
            <div
              className="rounded-lg border px-2.5 py-2"
              style={{
                borderColor: "var(--border-light)",
                backgroundColor: "var(--bg-card)",
              }}
            >
              <p className="font-bebas text-[10px]" style={{ color: "var(--text-sub)" }}>
                골격근량
              </p>
              <p className="font-bebas text-[13px]" style={{ color: "var(--text-main)" }}>
                {formatMetricNumber(inbodyRecord.muscleMass)} kg
              </p>
            </div>
            <div
              className="rounded-lg border px-2.5 py-2"
              style={{
                borderColor: "var(--border-light)",
                backgroundColor: "var(--bg-card)",
              }}
            >
              <p className="font-bebas text-[10px]" style={{ color: "var(--text-sub)" }}>
                체지방률
              </p>
              <p className="font-bebas text-[13px]" style={{ color: "var(--text-main)" }}>
                {formatMetricNumber(inbodyRecord.fatPercent)} %
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {(!record || hasNoDetail) && !inbodyRecord ? (
        <p className="py-1 font-bebas text-[10px]" style={{ color: "var(--text-sub)" }}>
          운동 상세 기록이 없습니다.
        </p>
      ) : null}

      <ActionArea
        dateKey={dateKey}
        showWorkoutAction={showWorkoutAction}
        showInbodyAction={showInbodyAction}
        workoutMode={workoutMode}
        inbodyMode={inbodyMode}
        onAddWorkout={onAddWorkout}
        onAddInbody={onAddInbody}
      />
    </div>
  );
}

