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
      className="w-full group relative bg-lime-400 text-black rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(204,255,0,0.15)] hover:shadow-[0_0_30px_rgba(204,255,0,0.3)] transition-all duration-300 active:scale-[0.98]"
    >
      <div className="absolute inset-0 bg-stripes opacity-10" />
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent" />
      <div className="relative z-10 p-6 flex justify-between items-center">
        <div className="text-left flex flex-col items-start">
          <span className="inline-block px-2 py-0.5 bg-black text-lime-400 font-bold text-[10px] uppercase italic -skew-x-12 mb-2">
            <span className="skew-x-12 block">{subtitle}</span>
          </span>
          <h2 className="font-bebas text-4xl tracking-wide leading-none mt-1">{title}</h2>
        </div>
        <div className="w-14 h-14 bg-black rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
          <Play className="w-6 h-6 text-lime-400 fill-lime-400 ml-1" />
        </div>
      </div>
    </button>
  );
}
