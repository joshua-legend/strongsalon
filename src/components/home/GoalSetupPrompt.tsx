"use client";

import { Target } from "lucide-react";

interface GoalSetupPromptProps {
  onStart: () => void;
}

export default function GoalSetupPrompt({ onStart }: GoalSetupPromptProps) {
  return (
    <div className="rounded-2xl p-5 bg-[var(--bg-card)] border border-[var(--border-light)] overflow-hidden relative">
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-[var(--accent-main)] opacity-10 blur-3xl rounded-full" />
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-5 h-5 text-[var(--accent-main)]" />
          <span className="font-bebas text-lg text-[var(--text-main)] tracking-wider">
            목표를 설정해 주세요
          </span>
        </div>
        <p className="text-sm text-[var(--text-sub)] mb-4">
          체중 감량, 근육량 증가, 체력 증진 중 원하는 목표를 선택하고 시작해보세요.
        </p>
        <button
          onClick={onStart}
          className="w-full py-4 rounded-xl font-bold text-lg bg-[var(--accent-main)] text-[var(--accent-text)] hover:brightness-110 transition-all shadow-[0_0_20px_rgba(163,230,53,0.3)]"
        >
          목표 설정하기
        </button>
      </div>
    </div>
  );
}
