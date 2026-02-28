"use client";

import { Ticket, Calendar } from "lucide-react";
import { formatPtDate } from "@/utils/homeUtils";

interface PtTicketCardProps {
  remaining: number;
  total: number;
  nextPtDate?: string | null;
  trainerName?: string;
}

export default function PtTicketCard({ remaining, total, nextPtDate, trainerName }: PtTicketCardProps) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl flex overflow-hidden relative group hover:border-cyan-400/50 transition-colors">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400" />
      <div className="p-5 flex-1 border-r border-dashed border-neutral-700 bg-gradient-to-r from-neutral-900 to-neutral-900/80">
        <span className="font-mono text-[10px] text-cyan-400 tracking-widest uppercase flex items-center gap-1.5 mb-1">
          <Ticket className="w-3 h-3" /> PT SESSIONS
        </span>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="font-bebas text-5xl text-white">{remaining}</span>
          <span className="font-bebas text-2xl text-neutral-600">/ {total}</span>
        </div>
        {nextPtDate && (
          <div className="mt-3 flex items-center gap-2 bg-neutral-950/50 rounded-lg p-2 border border-neutral-800">
            <Calendar className="w-3.5 h-3.5 text-neutral-400" />
            <div className="flex flex-col">
              <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest leading-none mb-0.5">Next Session</span>
              <span className="text-xs text-neutral-300 font-bold leading-none">
                {formatPtDate(nextPtDate)} · {trainerName ?? ""}
              </span>
            </div>
          </div>
        )}
      </div>
      <div className="bg-neutral-950 w-20 flex flex-col justify-center items-center relative z-10">
        <div className="absolute -top-3 -left-3 w-6 h-6 bg-neutral-950 rounded-full border-b border-r border-neutral-800" />
        <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-neutral-950 rounded-full border-t border-r border-neutral-800" />
        <span className="font-bebas text-lg text-neutral-500 -rotate-90 tracking-widest group-hover:text-cyan-400 transition-colors whitespace-nowrap">BOOK NOW</span>
      </div>
    </div>
  );
}
