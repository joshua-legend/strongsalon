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
      <div className="rounded-2xl p-5 sm:p-6 border border-neutral-800 bg-neutral-900 shadow-[0_0_30px_rgba(163,230,53,.06)]">
        <h2 className="text-center font-bebas text-[20px] tracking-wider mb-4 text-white drop-shadow-[0_0_10px_rgba(255,255,255,.2)]">
          운동 모드 선택
        </h2>
        <p className="text-center font-bebas text-[11px] mb-5 text-neutral-500 tracking-wider">
          오늘은 어떤 방식으로 운동할까요?
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onSelectMode("trainer")}
            className="rounded-2xl p-4 sm:p-5 border-2 text-left transition-all hover:opacity-90 active:scale-[0.98] hover:shadow-[0_0_30px_rgba(168,85,247,.25)]"
            style={{
              background:
                "linear-gradient(145deg, rgba(168,85,247,.12) 0%, rgba(79,142,247,.06) 100%)",
              borderColor: "rgba(168,85,247,.5)",
              boxShadow: "0 0 20px rgba(168,85,247,.15)",
            }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3 bg-gradient-to-br from-purple-500 to-cyan-400 shadow-[0_0_20px_rgba(168,85,247,.5)]"
            >
              🤖
            </div>
            <div className="font-bebas text-[16px] leading-none mb-0.5 text-white tracking-wider">
              AI 트레이닝
            </div>
            <div className="font-bebas text-[10px] text-neutral-500 tracking-wider">
              오늘의 프로그램이 자동으로 나와요
            </div>
          </button>
          <button
            type="button"
            onClick={() => onSelectMode("free")}
            className="rounded-2xl p-4 sm:p-5 border-2 text-left transition-all hover:opacity-90 active:scale-[0.98] hover:shadow-[0_0_30px_rgba(249,115,22,.25)]"
            style={{
              background:
                "linear-gradient(145deg, rgba(255,77,0,.12) 0%, rgba(255,122,51,.06) 100%)",
              borderColor: "rgba(255,77,0,.5)",
              boxShadow: "0 0 20px rgba(249,115,22,.15)",
            }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3 bg-gradient-to-br from-orange-500 to-orange-400 shadow-[0_0_20px_rgba(249,115,22,.5)]"
            >
              🏃
            </div>
            <div className="font-bebas text-[16px] leading-none mb-0.5 text-white tracking-wider">
              자유모드 트레이닝
            </div>
            <div className="font-bebas text-[10px] text-neutral-500 tracking-wider">
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
        className="rounded-2xl p-5 relative overflow-hidden border"
        style={{
          background:
            "linear-gradient(145deg, rgba(255,77,0,.14) 0%, rgba(255,122,51,.06) 100%)",
          borderColor: "rgba(255,77,0,.5)",
          boxShadow: "0 0 25px rgba(249,115,22,.2)",
        }}
      >
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1 sm:flex-initial w-full">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-[22px] shrink-0 bg-gradient-to-br from-orange-500 to-orange-400 shadow-[0_0_20px_rgba(249,115,22,.5)]"
            >
              🏃
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bebas text-[18px] leading-none tracking-wider mb-0.5 text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,.4)]">
                자유모드 트레이닝
              </div>
            </div>
          </div>
          <div className="flex-1 flex justify-end">
            <button
              type="button"
              onClick={onShowModeChoice}
              className="py-2 px-3 rounded-lg border border-neutral-700 bg-neutral-900 text-neutral-400 font-bebas text-[10px] tracking-wider transition-opacity hover:opacity-80"
            >
              모드 변경
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl p-5 relative overflow-hidden border"
        style={{
          background:
            "linear-gradient(145deg, rgba(168,85,247,.14) 0%, rgba(79,142,247,.06) 100%)",
          borderColor: "rgba(168,85,247,.5)",
          boxShadow: "0 0 25px rgba(168,85,247,.2)",
        }}
    >
      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1 sm:flex-initial w-full">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-[22px] shrink-0 bg-gradient-to-br from-purple-500 to-cyan-400 shadow-[0_0_20px_rgba(168,85,247,.5)]"
          >
            🤖
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-bebas text-[18px] leading-none tracking-wider mb-0.5 text-purple-500 drop-shadow-[0_0_8px_rgba(168,85,247,.4)]">
              AI 트레이닝
            </div>
          </div>
        </div>
        <div className="flex-1 flex justify-end">
          <button
            type="button"
            onClick={onShowModeChoice}
            className="py-2 px-3 rounded-lg border border-neutral-700 bg-neutral-900 text-neutral-400 font-bebas text-[10px] tracking-wider transition-opacity hover:opacity-80"
          >
            모드 변경
          </button>
        </div>
      </div>
    </div>
  );
}
