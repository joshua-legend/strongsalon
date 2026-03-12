"use client";

import { ChevronLeft } from "lucide-react";
import { SPLIT_PRESETS, type SplitId } from "@/data/workoutPresets";

interface SplitSelectProps {
  onSelect: (splitId: SplitId) => void;
  onBack: () => void;
}

export default function SplitSelect({ onSelect, onBack }: SplitSelectProps) {
  return (
    <div className="min-h-full flex flex-col px-4 py-6" style={{ background: "#000" }}>
      <div className="max-w-md mx-auto w-full">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 text-neutral-400 hover:text-white text-sm mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          뒤로
        </button>

        <h1 className="font-bebas text-2xl tracking-wider text-white mb-4">
          분할 선택
        </h1>

        <div className="grid grid-cols-2 gap-3">
          {SPLIT_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelect(preset.id)}
              className="rounded-xl p-4 text-left border border-neutral-700 hover:border-lime-400/50 hover:bg-lime-500/10 transition-all bg-neutral-950/80"
            >
              <h3 className="font-bebas text-base tracking-wider text-white">
                {preset.shortLabel}
              </h3>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                {preset.exercises.length}종목 · 약 {preset.estMinutes}분
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
