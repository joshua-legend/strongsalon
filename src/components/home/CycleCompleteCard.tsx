"use client";

import { Trophy, RotateCcw, Plus } from "lucide-react";
import type { CategoryId } from "@/types/categorySettings";

const CATEGORY_LABELS: Record<CategoryId, string> = {
  inbody: "인바디",
  strength: "스트렝스",
  fitness: "체력",
};

interface CycleCompleteCardProps {
  categoryId: CategoryId;
  startValue: number;
  targetValue: number;
  finalValue: number;
  achieved: boolean;
  unit: string;
  onExtend: () => void;
  onReset: () => void;
}

export default function CycleCompleteCard({
  categoryId,
  startValue,
  targetValue,
  finalValue,
  achieved,
  unit,
  onExtend,
  onReset,
}: CycleCompleteCardProps) {
  const label = CATEGORY_LABELS[categoryId];

  return (
    <div className="rounded-2xl overflow-hidden bg-gradient-to-b from-[var(--bg-card)] via-[var(--bg-card)] to-[var(--bg-body)] border border-[var(--border-light)] p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Trophy
          className={`w-6 h-6 ${achieved ? "text-lime-400" : "text-amber-500"}`}
        />
        <span className="font-bebas text-lg text-[var(--text-main)]">
          {label} 4주 사이클 완료
        </span>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between text-[var(--text-sub)]">
          <span>시작</span>
          <span className="font-mono text-[var(--text-main)]">{startValue}{unit}</span>
        </div>
        <div className="flex items-center justify-between text-[var(--text-sub)]">
          <span>목표</span>
          <span className="font-mono text-[var(--text-main)]">{targetValue}{unit}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>결과</span>
          <span className="font-mono font-bold text-[var(--text-main)]">
            {finalValue}{unit}
          </span>
        </div>
        <div className="flex items-center justify-end">
          <span
            className={`px-2 py-0.5 rounded-lg text-xs font-bold ${
              achieved ? "bg-lime-400/20 text-lime-400" : "bg-amber-500/20 text-amber-500"
            }`}
          >
            {achieved ? "달성" : "미달성"}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onExtend}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm bg-lime-400 text-black hover:brightness-110 transition-all"
        >
          <Plus className="w-4 h-4" />
          4주 연장
        </button>
        <button
          type="button"
          onClick={onReset}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm border-2 border-[var(--border-light)] text-[var(--text-sub)] hover:border-[var(--accent-main)]/50 hover:text-[var(--accent-main)] transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          새로운 목표로 설정
        </button>
      </div>
    </div>
  );
}
