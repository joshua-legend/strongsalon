"use client";

import { Target, Sliders } from "lucide-react";

interface DirectiveCardProps {
  onOpenSlider: () => void;
}

export default function DirectiveCard({ onOpenSlider }: DirectiveCardProps) {
  return (
    <div
      className="border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group"
      style={{
        background: "#050505",
        borderColor: "rgba(163,230,53,.18)",
      }}
    >
      {/* Hover glow overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: "rgba(163,230,53,.03)" }}
      />

      <Target className="w-12 h-12 mb-4 transition-all duration-300 text-white group-hover:text-lime-400 group-hover:drop-shadow-[0_0_12px_rgba(163,230,53,.6)]" />

      <h3 className="text-2xl font-bebas tracking-wider mb-1 text-white">
        이번 주 목표 없음
      </h3>
      <p className="text-xs font-sans mb-6 text-white">
        주간 목표를 설정하고 달성률을 추적하세요.
      </p>

      <button
        onClick={onOpenSlider}
        className="relative inline-block px-6 py-3 font-bold text-sm uppercase italic -skew-x-12 text-black transition-all hover:brightness-110 active:scale-[0.98]"
        style={{
          background: "#a3e635",
          boxShadow: "0 0 20px rgba(163,230,53,.55), 0 0 40px rgba(163,230,53,.2)",
        }}
      >
        <div className="absolute inset-0 bg-stripes opacity-20 pointer-events-none" />
        <span className="skew-x-12 flex items-center gap-2">
          <Sliders className="w-4 h-4" /> 목표 설정하기
        </span>
      </button>
    </div>
  );
}
