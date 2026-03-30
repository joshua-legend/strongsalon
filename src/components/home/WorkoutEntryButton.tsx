"use client";

import { ChevronDown } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function WorkoutEntryButton() {
  const { enterWorkout } = useApp();

  return (
    <div className="z-10 mt-auto pb-4 pt-8">
      <button
        id="workout-header"
        type="button"
        onClick={enterWorkout}
        className="group relative flex h-[64px] w-full items-center justify-between overflow-hidden rounded-[1.25rem] px-5 text-left transition-all duration-300 hover:brightness-110 active:scale-95"
        style={{
          backgroundColor: "var(--accent-main)",
          color: "var(--accent-text)",
          boxShadow: "0 8px 25px -5px var(--accent-bg)",
        }}
      >
        <div className="pointer-events-none absolute inset-0 h-full w-full -translate-x-full bg-white/20 transition-transform duration-700 ease-in-out group-hover:translate-x-full" />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0))",
          }}
        />

        <div className="relative z-10 h-[32px] flex-1 overflow-hidden">
          <div className="animate-workout-slot flex w-full flex-col">
            <div className="flex h-[32px] items-center text-[17px] font-bold tracking-[0.3px]">
              운동하러가기
            </div>
            <div className="flex h-[32px] items-center text-[19px] font-black tracking-wide">
              등 + 이두 데이
            </div>
            <div className="flex h-[32px] items-center text-[14px] font-bold opacity-90">
              4종목 · 16세트 · 약 70분
            </div>
            <div className="flex h-[32px] items-center text-[17px] font-bold tracking-[0.3px]">
              운동하러가기
            </div>
          </div>
        </div>

        <div className="relative z-10 ml-3 flex h-[34px] w-[34px] shrink-0 items-center justify-center overflow-hidden rounded-full transition-transform duration-300 group-active:rotate-180 group-active:scale-90">
          <div className="absolute inset-0 bg-current opacity-15" />
          <ChevronDown className="relative z-10 h-[14px] w-[14px]" />
        </div>
      </button>
    </div>
  );
}
