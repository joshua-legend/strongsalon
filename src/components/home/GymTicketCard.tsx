"use client";

import { CreditCard, Clock } from "lucide-react";

interface GymTicketCardProps {
  daysLeft: number | null;
  expiryFormatted: string | null;
}

export default function GymTicketCard({ daysLeft, expiryFormatted }: GymTicketCardProps) {
  return (
    <div
      className="rounded-2xl flex overflow-hidden relative group transition-all hover:shadow-[0_0_30px_rgba(192,132,252,.2)]"
      style={{
        background: "#050505",
        border: "1px solid rgba(192,132,252,.2)",
        boxShadow: "0 0 20px rgba(192,132,252,.06)",
      }}
    >
      {/* Left neon accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{
          background: "#c084fc",
          boxShadow: "0 0 10px #c084fc, 0 0 20px rgba(192,132,252,.5)",
        }}
      />

      {/* Main content */}
      <div
        className="p-5 flex-1 border-r border-dashed"
        style={{
          background: "linear-gradient(90deg, rgba(192,132,252,.04) 0%, transparent 100%)",
          borderColor: "rgba(255,255,255,.06)",
        }}
      >
        <span
          className="font-mono text-[10px] tracking-widest uppercase flex items-center gap-1.5 mb-1"
          style={{ color: "#c084fc", textShadow: "0 0 8px rgba(192,132,252,.6)" }}
        >
          <CreditCard className="w-3 h-3" /> GYM ACCESS
        </span>

        <div className="flex items-baseline gap-1 mt-1">
          <span
            className="font-bebas text-5xl text-white"
            style={{ textShadow: "0 0 20px rgba(192,132,252,.3)" }}
          >
            {daysLeft ?? "—"}
          </span>
          <span className="font-bebas text-2xl text-white">
            DAYS
          </span>
        </div>

        {expiryFormatted && (
          <div
            className="mt-3 flex items-center gap-2 rounded-lg p-2 border"
            style={{ background: "#030303", borderColor: "rgba(255,255,255,.06)" }}
          >
            <Clock className="w-3.5 h-3.5" style={{ color: "#1a1a1a" }} />
            <div className="flex flex-col">
              <span
                className="text-[9px] font-mono uppercase tracking-widest leading-none mb-0.5 text-white"
              >
                Expires On
              </span>
              <span className="text-xs font-bold leading-none text-white">
                {expiryFormatted}
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
        <span className="font-bebas text-lg -rotate-90 tracking-widest whitespace-nowrap transition-all text-white group-hover:text-purple-400 group-hover:drop-shadow-[0_0_8px_rgba(192,132,252,.5)]">
          EXTEND
        </span>
      </div>
    </div>
  );
}
