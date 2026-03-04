"use client";

import { Check, X } from "lucide-react";
import { useQuest } from "@/context/QuestContext";

export default function WeeklyLog() {
  const { userProfile, activeQuest } = useQuest();
  if (!userProfile || !activeQuest) return null;

  const { purpose } = userProfile;
  const { history } = activeQuest;
  const successCount = history.filter((r) => r.passed).length;
  const reversedHistory = [...history].reverse();

  const totalDelta = Math.abs(userProfile.targetValue - userProfile.startValue);
  const deltaStep = Math.abs(purpose.weeklyDelta);
  const totalWeeks = Math.max(1, Math.ceil(totalDelta / deltaStep) || 1);

  return (
    <div className="rounded-2xl p-5 bg-neutral-900 border border-neutral-800">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-bold text-neutral-400">주간 기록</span>
        <div className="flex items-center gap-2">
          {history.length > 0 && (
            <>
              <span className="font-mono text-[10px] text-neutral-500">
                {successCount}/{history.length} 달성
              </span>
              {/* 미니 바코드 - 최근 8주 */}
              <div className="flex gap-0.5">
                {history.slice(-8).map((rec, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-3 rounded-sm ${
                      rec.passed ? "bg-lime-400" : "bg-orange-400/60"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* 로그 목록 */}
      <div className="max-h-44 overflow-y-auto hide-scrollbar">
        {history.length === 0 ? (
          <div className="py-8 text-center text-xs text-neutral-600">
            아직 기록이 없습니다. 첫 주차를 기록해보세요!
          </div>
        ) : (
          <div className="space-y-2">
            {reversedHistory.map((rec, i) => {
              const isNewest = i === 0;
              const diff = rec.recorded - rec.target;

              return (
                <div
                  key={rec.week}
                  className={`flex items-center gap-3 py-2 px-3 rounded-xl ${
                    isNewest ? "bg-neutral-800/20" : ""
                  }`}
                >
                  {/* 주차 배지 */}
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-mono text-xs font-bold ${
                      rec.passed
                        ? "bg-lime-400/15 text-lime-400"
                        : "bg-orange-400/10 text-orange-400"
                    }`}
                  >
                    {rec.week}
                  </div>

                  {/* 기록값 + 달성/차이 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-white">
                        {rec.recorded}
                        {purpose.unit}
                      </span>
                      <span className="text-xs text-neutral-500">
                        {rec.passed ? "달성" : diff > 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1)}
                      </span>
                    </div>
                    {/* 미니 프로그레스 바 */}
                    <div className="mt-1 h-1 bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-lime-400 rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, (rec.week / totalWeeks) * 100)}%`,
                      }}
                    />
                    </div>
                  </div>

                  {/* 원형 아이콘 */}
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                      rec.passed
                        ? "bg-lime-400 text-black"
                        : "bg-neutral-800 text-orange-400"
                    }`}
                  >
                    {rec.passed ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      <X className="w-3 h-3" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
