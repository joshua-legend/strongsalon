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
    <div
      className="rounded-2xl flex overflow-hidden relative group transition-all hover:shadow-[0_0_30px_rgba(0,229,255,.2)]"
      style={{
        background: "#050505",
        border: "1px solid rgba(0,229,255,.2)",
        boxShadow: "0 0 20px rgba(0,229,255,.06)",
      }}
    >
      {/* Left neon accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{
          background: "#00e5ff",
          boxShadow: "0 0 10px #00e5ff, 0 0 20px rgba(0,229,255,.5)",
        }}
      />

      {/* Main content */}
      <div
        className="p-5 flex-1 border-r border-dashed"
        style={{
          background: "linear-gradient(90deg, rgba(0,229,255,.04) 0%, transparent 100%)",
          borderColor: "rgba(255,255,255,.06)",
        }}
      >
        <span
          className="font-mono text-[10px] tracking-widest uppercase flex items-center gap-1.5 mb-1"
          style={{ color: "#00e5ff", textShadow: "0 0 8px rgba(0,229,255,.6)" }}
        >
          <Ticket className="w-3 h-3" /> PT SESSIONS
        </span>

        <div className="flex items-baseline gap-1 mt-1">
          <span
            className="font-bebas text-5xl text-white"
            style={{ textShadow: "0 0 20px rgba(0,229,255,.3)" }}
          >
            {remaining}
          </span>
          <span className="font-bebas text-2xl text-white">
            / {total}
          </span>
        </div>

        {nextPtDate && (
          <div
            className="mt-3 flex items-center gap-2 rounded-lg p-2 border"
            style={{ background: "#030303", borderColor: "rgba(255,255,255,.06)" }}
          >
            <Calendar className="w-3.5 h-3.5" style={{ color: "#1a1a1a" }} />
            <div className="flex flex-col">
              <span
                className="text-[9px] font-mono uppercase tracking-widest leading-none mb-0.5 text-white"
              >
                Next Session
              </span>
              <span className="text-xs font-bold leading-none text-white">
                {formatPtDate(nextPtDate)} · {trainerName ?? ""}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Ticket stub */}
      <div
        className="w-20 flex flex-col justify-center items-center relative z-10"
        style={{ background: "#030303" }}
      >
        <div
          className="absolute -top-3 -left-3 w-6 h-6 rounded-full border-b border-r"
          style={{ background: "#030303", borderColor: "rgba(255,255,255,.06)" }}
        />
        <div
          className="absolute -bottom-3 -left-3 w-6 h-6 rounded-full border-t border-r"
          style={{ background: "#030303", borderColor: "rgba(255,255,255,.06)" }}
        />
        <span className="font-bebas text-lg -rotate-90 tracking-widest whitespace-nowrap transition-all text-white group-hover:text-cyan-400 group-hover:drop-shadow-[0_0_8px_rgba(0,229,255,.5)]">
          BOOK NOW
        </span>
      </div>
    </div>
  );
}
