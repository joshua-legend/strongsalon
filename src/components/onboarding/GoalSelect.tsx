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
      <h2 className="font-bebas text-2xl text-[var(--text-main)] tracking-wider mb-2">
        가장 중요한 목표를 하나 선택하세요
      </h2>
      <p className="text-sm text-[var(--text-sub)] mb-6">
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
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300 text-left active:scale-[0.98] ${
                isSelected
                  ? "bg-[var(--accent-bg)] border-[var(--accent-main)] shadow-[0_0_15px_rgba(163,230,53,0.15)]"
                  : "bg-[var(--bg-card)] border-[var(--border-light)] opacity-70 hover:opacity-100"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  isSelected
                    ? "border-[var(--accent-main)] bg-[var(--accent-main)]"
                    : "border-[var(--border-light)]"
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5 text-[var(--accent-text)]" />}
              </div>
              <Icon
                className={`w-8 h-8 shrink-0 ${!isSelected ? "text-[var(--text-sub)]" : ""}`}
                style={isSelected ? { color: opt.color } : undefined}
              />
              <div className="flex-1 min-w-0">
                <div
                  className={`font-bebas text-lg tracking-wider ${
                    isSelected ? "text-[var(--accent-main)]" : "text-[var(--text-main)]"
                  }`}
                >
                  {opt.label}
                </div>
                <div className="text-xs text-[var(--text-sub)] mt-0.5">{opt.desc}</div>
              </div>
            </button>
          );
        })}
      </div>
      <button
        type="button"
        onClick={onNext}
        disabled={!selected}
        className="w-full py-4 rounded-xl font-bold text-lg bg-[var(--accent-main)] text-[var(--accent-text)] disabled:opacity-40 disabled:pointer-events-none hover:brightness-110 transition-all duration-300 active:scale-[0.98]"
      >
        다음
      </button>
    </div>
  );
}
