"use client";

import { CreditCard, Clock } from "lucide-react";

interface GymTicketCardProps {
  daysLeft: number | null;
  expiryFormatted: string | null;
}

export default function GymTicketCard({ daysLeft, expiryFormatted }: GymTicketCardProps) {
  return (
    <div
      className="rounded-2xl flex overflow-hidden relative group transition-all duration-300 hover:shadow-md border cursor-pointer"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border-light)",
      }}
    >
      {/* 왼쪽 포인트 라인 */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 transition-colors duration-300"
        style={{ backgroundColor: "var(--accent-main)" }}
      />

      {/* 왼쪽 메인 영역 */}
      <div
        className="p-5 flex-1 border-r border-dashed transition-colors duration-300"
        style={{
          background: "linear-gradient(90deg, var(--accent-bg) 0%, transparent 100%)",
          borderColor: "var(--border-light)",
        }}
      >
        <span
          className="font-mono text-[10px] tracking-widest uppercase flex items-center gap-1.5 mb-1 font-bold transition-colors duration-300"
          style={{ color: "var(--accent-main)" }}
        >
          <CreditCard className="w-3 h-3" /> GYM ACCESS
        </span>

        <div className="flex items-baseline gap-1 mt-1">
          <span className="font-bebas text-5xl transition-colors duration-300" style={{ color: "var(--text-main)" }}>
            {daysLeft ?? "None"}
          </span>
          <span className="font-bebas text-2xl transition-colors duration-300" style={{ color: "var(--text-sub)" }}>
            DAYS
          </span>
        </div>

        {expiryFormatted && (
          <div
            className="mt-3 flex items-center gap-2 rounded-lg p-2 border transition-colors duration-300"
            style={{
              backgroundColor: "var(--bg-body)",
              borderColor: "var(--border-light)",
            }}
          >
            <Clock className="w-3.5 h-3.5" style={{ color: "var(--text-sub)" }} />
            <div className="flex flex-col">
              <span
                className="text-[9px] font-mono uppercase tracking-widest leading-none mb-0.5 transition-colors duration-300"
                style={{ color: "var(--text-sub)" }}
              >
                Expires On
              </span>
              <span
                className="text-xs font-bebas leading-none transition-colors duration-300"
                style={{ color: "var(--text-main)" }}
              >
                {expiryFormatted}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 오른쪽 액션 영역 */}
      <div
        className="w-20 flex flex-col justify-center items-center relative transition-colors duration-300"
        style={{ backgroundColor: "var(--bg-card-hover)" }}
      >
        {/* 위쪽 구멍 */}
        <div
          className="absolute -top-3 -left-3 w-6 h-6 rounded-full border-b border-r transition-colors duration-300"
          style={{ backgroundColor: "var(--bg-body)", borderColor: "var(--border-light)" }}
        />
        {/* 아래쪽 구멍 */}
        <div
          className="absolute -bottom-3 -left-3 w-6 h-6 rounded-full border-t border-r transition-colors duration-300"
          style={{ backgroundColor: "var(--bg-body)", borderColor: "var(--border-light)" }}
        />
        <span
          className="text-lg -rotate-90 tracking-widest whitespace-nowrap transition-colors duration-300 group-hover:text-[var(--accent-main)]"
          style={{ color: "var(--text-sub)", fontFamily: "'Bebas Neue', sans-serif" }}
        >
          EXTEND
        </span>
      </div>
    </div>
  );
}
