"use client";

import { useState } from "react";
import { Sun, Moon, Dumbbell } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useAttendance } from "@/context/AttendanceContext";
import { useWorkoutRecords } from "@/context/WorkoutRecordContext";
import { getMonthlyStats } from "@/utils/monthlyStats";
import { workoutHistory } from "@/data/workoutHistory";
import type { WorkoutConditionValue } from "@/data/workoutHistory";
import MyPageModal from "@/components/mypage/MyPageModal";

const CONDITION_META: { value: WorkoutConditionValue; emoji: string; label: string; score: number }[] = [
  { value: "불타", emoji: "🔥", label: "불타", score: 5 },
  { value: "최고", emoji: "💪", label: "최고", score: 4 },
  { value: "좋음", emoji: "😊", label: "좋음", score: 3 },
  { value: "나쁨", emoji: "😕", label: "나쁨", score: 2 },
  { value: "최악", emoji: "😫", label: "최악", score: 1 },
];

export default function Topbar() {
  const { user } = useUser();
  const { currentAccountId, accountData } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { attendance } = useAttendance();
  const { records, getUserWorkoutRecords } = useWorkoutRecords();
  const [showMyPage, setShowMyPage] = useState(false);

  const userRecords = getUserWorkoutRecords();

  const handleTestClick = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    // 1. 캘린더(출석) 데이터: 날짜별 pt/self/both
    const calendar: Record<string, string> = {};
    attendance.forEach((a) => {
      calendar[a.date] = a.type === "both" ? "pt" : a.type;
    });

    // 2. 월별 통계
    const monthlyStats = getMonthlyStats(year, month, attendance, userRecords);

    // 3. 컨디션 분포
    const conditionCounts: Record<string, number> = {};
    CONDITION_META.forEach((c) => {
      conditionCounts[c.value] = 0;
    });
    const allRecords = [...workoutHistory, ...records];
    const seen = new Set<string>();
    for (const r of allRecords) {
      if (seen.has(r.date)) continue;
      seen.add(r.date);
      if (r.condition) {
        conditionCounts[r.condition] = (conditionCounts[r.condition] || 0) + 1;
      }
    }
    const conditionTotal = Object.values(conditionCounts).reduce((a, b) => a + b, 0);
    const conditionDistribution = CONDITION_META.map((c) => ({
      value: c.value,
      label: c.label,
      emoji: c.emoji,
      count: conditionCounts[c.value] || 0,
      pct: conditionTotal > 0 ? Math.round(((conditionCounts[c.value] || 0) / conditionTotal) * 100) : 0,
    })).filter((d) => d.count > 0);
    const conditionAvg =
      conditionTotal > 0
        ? Math.round(
            (CONDITION_META.reduce((sum, c) => sum + (conditionCounts[c.value] || 0) * c.score, 0) / conditionTotal) * 10
          ) / 10
        : 0;

    const payload = {
      currentAccountId,
      year,
      month: month + 1,
      calendar: {
        attendMap: calendar,
        attendanceList: attendance,
      },
      monthlyStats: {
        ptDays: monthlyStats.ptDays,
        selfRate: monthlyStats.selfRate,
        totalVolume: monthlyStats.totalVolume,
        workoutCount: monthlyStats.workoutCount,
        avgMinutes: monthlyStats.avgMinutes,
        streak: monthlyStats.streak,
      },
      conditionDistribution: {
        items: conditionDistribution,
        total: conditionTotal,
        avg: conditionAvg,
      },
    };
    console.log("[통계 테스트]", payload);
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
            <Dumbbell className="w-5 h-5" />
          </div>
          <h1
            className="text-2xl font-bold tracking-widest transition-colors duration-300"
            style={{ color: "var(--text-main)", fontFamily: "'Bebas Neue', sans-serif" }}
          >
            STRONG-SALON
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
