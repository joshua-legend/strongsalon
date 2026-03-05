"use client";

import { Flame, CheckCircle2, MapPin, Loader2 } from "lucide-react";
import { WEEK_DAYS } from "@/config/targetConfigs";
import { useAttendance } from "@/context/AttendanceContext";
import { useGymCheckIn } from "./useGymCheckIn";

function todayKey(): string {
  const n = new Date();
  return `${n.getFullYear()}-${n.getMonth() + 1}-${n.getDate()}`;
}

interface WeeklyStreakCardProps {
  weekStreak: boolean[];
  todayIdx: number;
}

export default function WeeklyStreakCard({ weekStreak, todayIdx }: WeeklyStreakCardProps) {
  const { addAttendance, isCheckedIn } = useAttendance();
  const today = todayKey();
  const checkedInToday = isCheckedIn(today);
  const { checkInStatus, handleCheckIn, resetStatus } = useGymCheckIn(today, checkedInToday, addAttendance);

  return (
    <div className="rounded-2xl p-5 border" style={{ background: "#050505", borderColor: "rgba(255,255,255,.06)" }}>
      <div className="flex items-center gap-2 mb-4">
        <Flame className="w-4 h-4" fill="currentColor"
          style={{ color: "#ff5500", filter: "drop-shadow(0 0 6px rgba(255,85,0,.7))" }} />
        <span className="font-bebas text-[14px] tracking-wider uppercase text-white">이번 주 출석</span>
      </div>

      <div className="flex justify-between gap-1">
        {WEEK_DAYS.map((day, idx) => {
          const checked = weekStreak[idx];
          const isToday = idx === todayIdx;
          return (
            <div key={idx} className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
                style={
                  checked
                    ? { background: "#f97316", color: "#000", boxShadow: "0 0 14px rgba(249,115,22,.55), 0 0 28px rgba(249,115,22,.2)" }
                    : isToday
                    ? { background: "#0a0a0a", border: "2px dashed rgba(249,115,22,.4)", color: "#fff" }
                    : { background: "#0a0a0a", border: "1px solid rgba(255,255,255,.06)", color: "#fff" }
                }
              >
                {checked ? <CheckCircle2 className="w-5 h-5" /> : <span className="font-bebas text-lg">{day}</span>}
              </div>
            </div>
          );
        })}
      </div>

      {!checkedInToday && (
        <div className="mt-4 pt-4 border-t border-neutral-800/80">
          {checkInStatus === "permission-prompt" && (
            <div className="rounded-xl p-4 bg-orange-500/10 border border-orange-500/25">
              <p className="font-bebas text-[11px] text-orange-400 mb-2">위치 권한이 필요합니다. 허용하기 버튼을 눌러주세요</p>
              <button type="button" onClick={handleCheckIn}
                className="w-full py-2.5 rounded-lg bg-orange-500 text-black font-bold text-sm flex items-center justify-center gap-2">
                <MapPin className="w-4 h-4" /> 허용하기
              </button>
            </div>
          )}

          {checkInStatus === "loading" && (
            <div className="flex items-center justify-center gap-2 py-3 text-neutral-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="font-bebas text-xs">위치 확인 중...</span>
            </div>
          )}

          {checkInStatus === "out-of-range" && (
            <div className="rounded-xl p-4 bg-orange-500/10 border border-orange-500/25">
              <p className="font-bebas text-[11px] text-orange-400 text-center">헬스장이 아닙니다. 출석은 헬스장 근처(200m 이내)에서만 가능합니다.</p>
              <button type="button" onClick={resetStatus}
                className="mt-2 w-full py-2 rounded-lg bg-neutral-800 text-neutral-400 text-xs font-bold">다시 시도</button>
            </div>
          )}

          {checkInStatus === "error" && (
            <div className="rounded-xl p-4 bg-neutral-800/80 border border-neutral-700">
              <p className="font-bebas text-[11px] text-neutral-400 text-center mb-2">위치를 가져올 수 없습니다. 네트워크와 GPS를 확인해주세요.</p>
              <button type="button" onClick={resetStatus}
                className="w-full py-2 rounded-lg bg-neutral-700 text-neutral-300 text-xs font-bold">다시 시도</button>
            </div>
          )}

          {(checkInStatus === "idle" || checkInStatus === "success") && (
            <button type="button" onClick={handleCheckIn} disabled={checkInStatus === "success"}
              className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-70"
              style={{
                background: checkInStatus === "success" ? "rgba(163,230,53,0.2)" : "#f97316",
                color: checkInStatus === "success" ? "#a3e635" : "#000",
                boxShadow: checkInStatus === "success" ? "none" : "0 0 14px rgba(249,115,22,.4)",
              }}
            >
              {checkInStatus === "success" ? (
                <><CheckCircle2 className="w-4 h-4" /> 출석 완료</>
              ) : (
                <><MapPin className="w-4 h-4" /> 출석하기</>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
