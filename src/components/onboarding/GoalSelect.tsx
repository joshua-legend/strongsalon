"use client";

import { Check } from "lucide-react";
import { goalOptions } from "@/config/goalOptions";
import type { GoalId } from "@/types/goalSetting";

interface GoalSelectProps {
  selected: GoalId | null;
  onSelect: (id: GoalId) => void;
  onNext: () => void;
}

export default function GoalSelect({
  selected,
  onSelect,
  onNext,
}: GoalSelectProps) {
  return (
    <div className="animate-slide-up-quest">
      <h2 className="font-bebas text-2xl text-white tracking-wider mb-2">
        가장 중요한 목표를 하나 선택하세요
      </h2>
      <p className="text-sm text-neutral-500 mb-6">
        이 목표를 최우선으로 추적합니다
      </p>
      <div className="space-y-3 mb-8">
        {goalOptions.map((opt) => {
          const Icon = opt.icon;
          const isSelected = selected === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelect(opt.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                isSelected
                  ? "bg-lime-400/5 border-lime-400 shadow-[0_0_15px_rgba(163,230,53,0.15)]"
                  : "bg-neutral-900 border-neutral-800 opacity-70 hover:opacity-100"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  isSelected
                    ? "border-lime-400 bg-lime-400"
                    : "border-neutral-600"
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5 text-black" />}
              </div>
              <Icon
                className={`w-8 h-8 shrink-0 ${!isSelected ? "text-neutral-500" : ""}`}
                style={isSelected ? { color: opt.color } : undefined}
              />
              <div className="flex-1 min-w-0">
                <div
                  className={`font-bebas text-lg tracking-wider ${
                    isSelected ? "text-lime-400" : "text-white"
                  }`}
                >
                  {opt.label}
                </div>
                <div className="text-xs text-neutral-500 mt-0.5">{opt.desc}</div>
              </div>
            </button>
          );
        })}
      </div>
      <button
        type="button"
        onClick={onNext}
        disabled={!selected}
        className="w-full py-4 rounded-xl font-bold text-lg bg-lime-400 text-black disabled:opacity-40 disabled:pointer-events-none hover:brightness-110 transition-all"
      >
        다음
      </button>
    </div>
  );
}
