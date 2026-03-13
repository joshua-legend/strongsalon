"use client";

import { ChevronDown } from "lucide-react";
import type { WorkoutCondition } from "@/types";
import CustomDropdown, { type DropdownOption } from "@/components/ui/CustomDropdown";

const OPTIONS: DropdownOption<WorkoutCondition>[] = [
  { value: "최악", label: "최악", emoji: "😫" },
  { value: "나쁨", label: "나쁨", emoji: "😕" },
  { value: "좋음", label: "좋음", emoji: "😊" },
  { value: "최고", label: "최고", emoji: "💪" },
  { value: "불타", label: "불타", emoji: "🔥" },
];

interface CondBoxProps {
  value: WorkoutCondition;
  onChange: (v: WorkoutCondition) => void;
}

export default function CondBox({ value, onChange }: CondBoxProps) {
  return (
    <CustomDropdown<WorkoutCondition>
      value={value}
      options={OPTIONS}
      onChange={onChange}
      subLabel="CONDITION"
      renderTrigger={(_, opt, isOpen) => (
        <div className="flex items-center justify-between gap-2">
          <div>
            <div
              className="font-bebas text-2xl tracking-wider transition-colors duration-300"
              style={{ color: "var(--text-main)" }}
            >
              {opt ? (
                <>
                  <span className="mr-1.5">{opt.emoji}</span>
                  {opt.label}
                </>
              ) : (
                <span style={{ color: "var(--text-sub)" }}>선택</span>
              )}
            </div>
            <div
              className="mt-0.5 text-[11px] font-medium transition-colors duration-300"
              style={{ color: "var(--text-sub)" }}
            >
              CONDITION
            </div>
          </div>
          <ChevronDown
            className="w-4 h-4 shrink-0 transition-transform duration-300"
            style={{ color: "var(--text-sub)", transform: isOpen ? "rotate(180deg)" : undefined }}
          />
        </div>
      )}
    />
  );
}
