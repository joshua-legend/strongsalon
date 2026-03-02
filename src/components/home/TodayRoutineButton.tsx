"use client";

import { Play } from "lucide-react";

interface TodayRoutineButtonProps {
  onClick: () => void;
  title?: string;
  subtitle?: string;
}

export default function TodayRoutineButton({
  onClick,
  title = "DAY 3: CHEST & TRICEPS",
  subtitle = "TODAY'S ROUTINE",
}: TodayRoutineButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full group relative text-black rounded-2xl overflow-hidden transition-all duration-300 active:scale-[0.98] hover:brightness-105"
      style={{
        background: "#f97316",
        boxShadow:
          "0 0 30px rgba(249,115,22,.55), 0 0 60px rgba(249,115,22,.2), 0 0 100px rgba(249,115,22,.08)",
      }}
    >
      <div className="absolute inset-0 bg-stripes opacity-10" />
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent" />

      <div className="relative z-10 p-6 flex justify-between items-center">
        <div className="text-left flex flex-col items-start">
          <span
            className="inline-block px-2 py-0.5 bg-black font-bold text-[10px] uppercase italic -skew-x-12 mb-2"
            style={{ color: "#f97316", textShadow: "0 0 8px rgba(249,115,22,.6)" }}
          >
            <span className="skew-x-12 block">{subtitle}</span>
          </span>
          <h2 className="font-bebas text-4xl tracking-wide leading-none mt-1">{title}</h2>
        </div>

        <div
          className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
          style={{
            background: "#000",
            boxShadow: "0 0 20px rgba(0,0,0,.6), inset 0 0 15px rgba(249,115,22,.08)",
          }}
        >
          <Play
            className="w-6 h-6 ml-1"
            style={{
              color: "#f97316",
              fill: "#f97316",
              filter: "drop-shadow(0 0 6px rgba(249,115,22,.7))",
            }}
          />
        </div>
      </div>
    </button>
  );
}
