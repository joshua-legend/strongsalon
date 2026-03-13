"use client";

import { useUser } from "@/context/UserContext";
import { useAttendance } from "@/context/AttendanceContext";
import { getGreeting } from "@/utils/format";

function todayKey(): string {
  const n = new Date();
  return `${n.getFullYear()}-${n.getMonth() + 1}-${n.getDate()}`;
}

function ptAlert(nextPtDate: string | null | undefined): "today" | "tomorrow" | null {
  if (!nextPtDate) return null;
  const [y, m, d] = nextPtDate.split("-").map(Number);
  const target = new Date(y, m - 1, d);
  const today  = new Date();
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const diff = Math.ceil((target.getTime() - todayMidnight.getTime()) / 86400000);
  if (diff === 0) return "today";
  if (diff === 1) return "tomorrow";
  return null;
}

export default function HeroBanner() {
  const { user } = useUser();
  const { isCheckedIn } = useAttendance();
  const greeting = getGreeting();
  const checkedIn = isCheckedIn(todayKey());
  const ptStatus  = ptAlert(user?.nextPtDate);

  return (
    <div className="rounded-2xl px-5 py-4 relative overflow-hidden bg-[var(--bg-card)] border border-[var(--border-light)]">
      <div className="absolute -top-8 -right-8 w-32 h-32 bg-lime-500 opacity-10 blur-3xl rounded-full" />

      <div className="relative z-10">
        {/* 인사말 */}
        <p className="font-bebas text-[11px] text-[var(--text-sub)] mb-3">
          {greeting}, <span className="text-[var(--text-main)]">{user?.name ?? ""}</span>님
        </p>

        {/* 스트릭 + 오늘 출석 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <p className="font-bebas text-[52px] leading-none text-[var(--text-main)]">
                {user?.streak ?? 0}
              </p>
              <p className="font-bebas text-[9px] text-[var(--text-sub)] uppercase tracking-wider -mt-1">
                연속 출석 일
              </p>
            </div>
            <span className="text-[32px] select-none">🔥</span>
          </div>

          {/* 오늘 출석 상태 */}
          <div className={`flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl border transition-colors ${
            checkedIn
              ? "bg-lime-400/10 border-lime-400/30"
              : "bg-[var(--bg-card-hover)] border-[var(--border-light)]"
          }`}>
            <span className="text-[20px]">{checkedIn ? "✅" : "⬜"}</span>
            <p className={`font-bebas text-[8px] uppercase tracking-wider ${
              checkedIn ? "text-[var(--accent-main)]" : "text-[var(--text-sub)]"
            }`}>
              {checkedIn ? "출석 완료" : "미출석"}
            </p>
          </div>
        </div>

        {/* PT 알림 */}
        {ptStatus && (
          <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-orange-500/10 border border-orange-500/25">
            <span className="text-[14px]">📋</span>
            <p className="font-bebas text-[10px] text-orange-400">
              {ptStatus === "today"
                ? `오늘 PT 예정 — ${user?.trainerName ?? ""} 트레이너`
                : `내일 PT 예정 — ${user?.trainerName ?? ""} 트레이너`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
