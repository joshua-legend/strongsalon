"use client";

import type { WorkoutMode } from "@/types";

interface ModeBannerProps {
  mode: WorkoutMode | null;
  onSelectMode: (m: WorkoutMode) => void;
  onShowModeChoice: () => void;
}

export default function ModeBanner({
  mode,
  onSelectMode,
  onShowModeChoice,
}: ModeBannerProps) {
  if (mode === null) {
    return (
      <div
        className="rounded-xl p-5 sm:p-6 border"
        style={{
          background: "var(--s1)",
          borderColor: "var(--border)",
          boxShadow: "0 0 0 1px rgba(255,255,255,.04) inset",
        }}
      >
        <h2
          className="text-center text-sm font-bold mb-4"
          style={{ color: "var(--text)" }}
        >
          운동 모드 선택
        </h2>
        <p
          className="text-center text-[11px] mb-5"
          style={{ color: "var(--text2)" }}
        >
          오늘은 어떤 방식으로 운동할까요?
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onSelectMode("trainer")}
            className="rounded-xl p-4 sm:p-5 border-2 text-left transition-all hover:opacity-90 active:scale-[0.98]"
            style={{
              background:
                "linear-gradient(145deg, rgba(168,85,247,.12) 0%, rgba(79,142,247,.06) 100%)",
              borderColor: "rgba(168,85,247,.35)",
              boxShadow: "0 0 0 1px rgba(168,85,247,.08) inset",
            }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3"
              style={{
                background:
                  "linear-gradient(135deg, var(--purple), var(--blue))",
                boxShadow: "0 2px 10px rgba(168,85,247,.28)",
              }}
            >
              🤖
            </div>
            <div
              className="font-bold text-[13px] mb-0.5"
              style={{ color: "var(--text)" }}
            >
              AI 트레이닝
            </div>
            <div className="text-[11px]" style={{ color: "var(--text2)" }}>
              오늘의 프로그램이 자동으로 나와요
            </div>
          </button>
          <button
            type="button"
            onClick={() => onSelectMode("free")}
            className="rounded-xl p-4 sm:p-5 border-2 text-left transition-all hover:opacity-90 active:scale-[0.98]"
            style={{
              background:
                "linear-gradient(145deg, rgba(255,77,0,.12) 0%, rgba(255,122,51,.06) 100%)",
              borderColor: "rgba(255,77,0,.35)",
              boxShadow: "0 0 0 1px rgba(255,77,0,.08) inset",
            }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3"
              style={{
                background:
                  "linear-gradient(135deg, var(--orange), var(--og2))",
                boxShadow: "0 2px 10px rgba(255,77,0,.28)",
              }}
            >
              🏃
            </div>
            <div
              className="font-bold text-[13px] mb-0.5"
              style={{ color: "var(--text)" }}
            >
              자유모드 트레이닝
            </div>
            <div className="text-[11px]" style={{ color: "var(--text2)" }}>
              근력 + 유산소 직접 선택해서 진행
            </div>
          </button>
        </div>
      </div>
    );
  }

  if (mode === "free") {
    return (
      <div
        className="rounded-xl p-4 relative overflow-hidden border"
        style={{
          background:
            "linear-gradient(145deg, rgba(255,77,0,.14) 0%, rgba(255,122,51,.06) 100%)",
          borderColor: "rgba(255,77,0,.3)",
          boxShadow: "0 0 0 1px rgba(255,77,0,.08) inset",
        }}
      >
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1 sm:flex-initial w-full">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-[22px] shrink-0"
              style={{
                background:
                  "linear-gradient(135deg, var(--orange), var(--og2))",
                boxShadow: "0 2px 10px rgba(255,77,0,.28)",
              }}
            >
              🏃
            </div>
            <div className="min-w-0 flex-1">
              <div
                className="font-black text-[15px] tracking-tight mb-0.5"
                style={{ color: "var(--orange)" }}
              >
                자유모드 트레이닝
              </div>
            </div>
            <div className="flex-1 flex justify-end">
              <button
                type="button"
                onClick={onShowModeChoice}
                className="py-2 px-3 rounded-lg border text-[11px] font-medium transition-opacity hover:opacity-80"
                style={{
                  borderColor: "var(--border2)",
                  background: "var(--s2)",
                  color: "var(--muted2)",
                }}
              >
                모드 변경
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl p-4 relative overflow-hidden border"
      style={{
        background:
          "linear-gradient(145deg, rgba(168,85,247,.14) 0%, rgba(79,142,247,.06) 100%)",
        borderColor: "rgba(168,85,247,.3)",
        boxShadow: "0 0 0 1px rgba(168,85,247,.08) inset",
      }}
    >
      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1 sm:flex-initial w-full">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-[22px] shrink-0"
            style={{
              background: "linear-gradient(135deg, var(--purple), var(--blue))",
              boxShadow: "0 2px 10px rgba(168,85,247,.28)",
            }}
          >
            🤖
          </div>
          <div className="min-w-0 flex-1">
            <div
              className="font-black text-[15px] tracking-tight mb-0.5"
              style={{ color: "var(--purple)" }}
            >
              AI 트레이닝
            </div>
          </div>
          <div className="flex-1 flex justify-end">
            <button
              type="button"
              onClick={onShowModeChoice}
              className="py-2 px-3 rounded-lg border text-[11px] font-medium transition-opacity hover:opacity-80"
              style={{
                borderColor: "var(--border2)",
                background: "var(--s2)",
                color: "var(--muted2)",
              }}
            >
              모드 변경
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
