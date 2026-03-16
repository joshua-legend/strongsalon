"use client";

import { Trash2 } from "lucide-react";
import type { CardioEntry, CardioType } from "@/types";

const CARDIO_META: Record<CardioType, { label: string; emoji: string }> = {
  run: { label: "런닝", emoji: "🏃" },
  cycle: { label: "싸이클", emoji: "🚴" },
  row: { label: "로잉", emoji: "🚣" },
  skierg: { label: "스키에르그", emoji: "⛷️" },
};

interface CardioCardProps {
  entry: CardioEntry;
  isWorkoutActive: boolean;
  onUpdate: (patch: Partial<Pick<CardioEntry, "distanceKm" | "timeMinutes">>) => void;
  onRemove: () => void;
  onToggleCheck?: () => void;
}

export default function CardioCard({
  entry,
  isWorkoutActive,
  onUpdate,
  onRemove,
  onToggleCheck,
}: CardioCardProps) {
  const meta = CARDIO_META[entry.type];
  const filled = entry.distanceKm > 0 && entry.timeMinutes > 0;
  const summary =
    filled
      ? `${entry.distanceKm} km · ${entry.timeMinutes} 분`
      : "— km · — 분";

  return (
    <div
      className="rounded-2xl border overflow-hidden transition-all"
      style={{
        backgroundColor: entry.checked ? "var(--accent-bg)" : "var(--bg-card)",
        borderColor: entry.checked ? "var(--accent-main)" : "var(--border-light)",
        boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      }}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="font-bebas text-[12px] font-bold px-2 py-0.5 rounded-md tracking-wider"
                style={{
                  backgroundColor: "rgba(34,197,94,0.15)",
                  color: "var(--accent-sub)",
                  border: "1px solid var(--border-light)",
                }}
              >
                유산소
              </span>
              <span
                className="font-bebas text-[16px] font-bold tracking-wider truncate"
                style={{ color: "var(--text-main)" }}
              >
                {meta.emoji} {meta.label}
              </span>
            </div>
            <div
              className="font-bebas text-[13px] font-bold tracking-widest mb-3"
              style={{ color: "var(--text-sub)" }}
            >
              {summary}
            </div>

            {/* km · 분 입력 */}
            <div className="flex items-center gap-2 flex-wrap">
              <label className="flex items-center gap-1.5 font-bebas text-[10px] tracking-wider">
                <input
                  type="number"
                  min={0}
                  step={0.1}
                  value={entry.distanceKm || ""}
                  onChange={(ev) =>
                    onUpdate({ distanceKm: parseFloat(ev.target.value) || 0 })
                  }
                  className="w-16 rounded-xl py-2 px-3 font-bebas text-[13px] outline-none transition-all border focus:border-[var(--border-focus)]"
                  style={{
                    backgroundColor: "var(--bg-body)",
                    borderColor: "var(--border-light)",
                    color: "var(--text-main)",
                  }}
                />
                <span style={{ color: "var(--text-main)" }}>km</span>
              </label>
              <span style={{ color: "var(--text-sub)" }}>·</span>
              <label className="flex items-center gap-1.5 font-bebas text-[10px] tracking-wider">
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={entry.timeMinutes || ""}
                  onChange={(ev) =>
                    onUpdate({ timeMinutes: parseInt(ev.target.value, 10) || 0 })
                  }
                  className="w-14 rounded-xl py-2 px-3 font-bebas text-[13px] outline-none transition-all border focus:border-[var(--border-focus)]"
                  style={{
                    backgroundColor: "var(--bg-body)",
                    borderColor: "var(--border-light)",
                    color: "var(--text-main)",
                  }}
                />
                <span style={{ color: "var(--text-main)" }}>분</span>
              </label>
            </div>
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors shrink-0 hover:bg-[var(--bg-body)]"
            style={{ color: "var(--text-sub)" }}
            aria-label="종목 삭제"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {isWorkoutActive && filled && onToggleCheck && (
          <button
            type="button"
            onClick={onToggleCheck}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bebas text-[12px] tracking-wider transition-all active:scale-95 border mt-2"
            style={
              entry.checked
                ? {
                    backgroundColor: "var(--accent-bg)",
                    borderColor: "var(--accent-main)",
                    color: "var(--accent-main)",
                  }
                : {
                    backgroundColor: "transparent",
                    borderColor: "var(--border-light)",
                    color: "var(--text-sub)",
                  }
            }
          >
            <span className="text-[16px]">{entry.checked ? "✅" : "⬜"}</span>
            <span>{entry.checked ? "유산소 완료!" : "유산소 완료 체크"}</span>
          </button>
        )}
      </div>
    </div>
  );
}
