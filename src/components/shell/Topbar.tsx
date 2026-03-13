"use client";

import { useState } from "react";
import { Sun, Moon, Activity } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import MyPageModal from "@/components/mypage/MyPageModal";

export default function Topbar() {
  const { user } = useUser();
  const { currentAccountId, accountData } = useAuth();
  const { theme, toggleTheme } = useTheme();
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
        className="flex items-center justify-between px-5 shrink-0 h-[60px] bg-[var(--bg-body)] border-b border-[var(--border-light)]"
      >
        {/* 테스트 버튼 */}
        <button
          type="button"
          onClick={handleTestClick}
          className="px-3 py-1.5 rounded-lg text-xs font-bold text-[var(--text-sub)] hover:text-[var(--text-main)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-light)] transition-colors duration-300"
        >
          테스트
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300"
            style={{ backgroundColor: "var(--accent-main)", color: "var(--accent-text)" }}
          >
            <Activity className="w-5 h-5" />
          </div>
          <h1
            className="text-2xl font-bold tracking-widest transition-colors duration-300"
            style={{ color: "var(--text-main)", fontFamily: "'Bebas Neue', sans-serif" }}
          >
            FITLOG
          </h1>
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--text-sub)] hover:text-[var(--accent-main)] transition-colors duration-300 active:scale-[0.98]"
            aria-label={theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환"}
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          {/* Avatar */}
          <button
            type="button"
            onClick={() => setShowMyPage(true)}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold text-[var(--accent-text)] bg-[var(--accent-main)] transition-all duration-300 hover:brightness-110 active:scale-[0.98]"
          >
            {user?.initial ?? "?"}
          </button>
        </div>
      </header>

      <MyPageModal open={showMyPage} onClose={() => setShowMyPage(false)} />
    </>
  );
}
