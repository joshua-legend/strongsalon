"use client";

import { Check } from "lucide-react";
import { purposeOptions } from "@/config/purposeOptions";
import type { PurposeOptionWithIcon } from "@/config/purposeOptions";

interface GoalSelectProps {
  selected: PurposeOptionWithIcon | null;
  onSelect: (p: PurposeOptionWithIcon) => void;
  onNext: () => void;
}

export default function GoalSelect({
  selected,
  onSelect,
  onNext,
}: GoalSelectProps) {
  return (
    <div className="animate-slide-up-quest">
      <h2 className="font-bebas text-2xl text-white tracking-wider mb-6">
        어떤 변화를 만들고 싶으세요?
      </h2>
      <div className="space-y-3 mb-8">
        {purposeOptions
          .filter((p) => ["cut", "bulk", "endure"].includes(p.id))
          .map((p) => {
          const isSelected = selected?.id === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelect(p)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                isSelected
                  ? "bg-lime-400/5 border-lime-400"
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
              <p.Icon
                className={`w-8 h-8 shrink-0 ${
                  isSelected ? "text-lime-400" : "text-neutral-500"
                }`}
              />
              <div className="flex-1 min-w-0">
                <div
                  className={`font-bebas text-lg tracking-wider ${
                    isSelected ? "text-lime-400" : "text-white"
                  }`}
                >
                  {p.label}
                </div>
                <div className="text-xs text-neutral-500 mt-0.5">{p.desc}</div>
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
