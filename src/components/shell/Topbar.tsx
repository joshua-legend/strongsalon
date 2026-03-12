"use client";

import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { useAuth } from "@/context/AuthContext";
import MyPageModal from "@/components/mypage/MyPageModal";

export default function Topbar() {
  const { user } = useUser();
  const { currentAccountId, accountData } = useAuth();
  const [showMyPage, setShowMyPage] = useState(false);

  const handleTestClick = () => {
    const payload = {
      currentAccountId,
      accountData: accountData ?? null,
    };
    console.log("[현재 유저 전체 데이터]", payload);
  };

  return (
    <>
      <header
        className="flex items-center justify-between px-5 shrink-0 h-[60px] bg-black border-b border-lime-500/25"
        style={{ boxShadow: "0 0 30px rgba(163,230,53,.06), 0 1px 0 rgba(163,230,53,.18)" }}
      >
        {/* 테스트 버튼 */}
        <button
          type="button"
          onClick={handleTestClick}
          className="px-3 py-1.5 rounded-lg text-xs font-bold text-neutral-400 hover:text-white bg-neutral-800/80 hover:bg-neutral-700 border border-neutral-700 transition-colors"
        >
          테스트
        </button>

        {/* Logo */}
        <div className="font-bebas text-[24px] tracking-wide leading-none">
          <span
            style={{
              color: "#a3e635",
              textShadow: "0 0 10px #a3e635, 0 0 22px rgba(163,230,53,.5)",
            }}
          >
            Fit
          </span>
          <span className="text-neutral-700">Log</span>
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-2">
          {/* Bell */}
          <button
            className="relative w-9 h-9 flex items-center justify-center rounded-full"
            style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,.06)" }}
          >
            <span className="text-[16px]">🔔</span>
            <span
              className="absolute top-1 right-1 w-2 h-2 rounded-full bg-lime-400 animate-pulse"
              style={{ boxShadow: "0 0 6px #a3e635, 0 0 12px rgba(163,230,53,.4)" }}
            />
          </button>

          {/* Avatar */}
          <button
            type="button"
            onClick={() => setShowMyPage(true)}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold text-black transition-all hover:brightness-110"
            style={{ background: "#a3e635", boxShadow: "0 0 16px rgba(163,230,53,.45)" }}
          >
            {user?.initial ?? "?"}
          </button>
        </div>
      </header>

      <MyPageModal open={showMyPage} onClose={() => setShowMyPage(false)} />
    </>
  );
}
