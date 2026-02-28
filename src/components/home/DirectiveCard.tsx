"use client";

import { Target, Sliders } from "lucide-react";

interface DirectiveCardProps {
  onOpenSlider: () => void;
}

export default function DirectiveCard({ onOpenSlider }: DirectiveCardProps) {
  return (
    <div className="bg-neutral-900 border-2 border-dashed border-neutral-800 rounded-2xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group">
      <div className="absolute inset-0 bg-lime-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <Target className="w-12 h-12 text-neutral-700 mb-4 group-hover:text-lime-500 transition-colors duration-300" />
      <h3 className="text-2xl font-bebas text-neutral-400 tracking-wider mb-1">이번 주 목표 없음</h3>
      <p className="text-xs font-sans text-neutral-500 mb-6">주간 목표를 설정하고 달성률을 추적하세요.</p>
      <button
        onClick={onOpenSlider}
        className="relative inline-block px-6 py-3 font-bold text-sm uppercase italic -skew-x-12 bg-lime-400 text-black hover:bg-lime-300 transition-colors shadow-[0_0_15px_rgba(204,255,0,0.3)]"
      >
        <div className="absolute inset-0 bg-stripes opacity-20 pointer-events-none" />
        <span className="skew-x-12 flex items-center gap-2">
          <Sliders className="w-4 h-4" /> 목표 설정하기
        </span>
      </button>
    </div>
  );
}
