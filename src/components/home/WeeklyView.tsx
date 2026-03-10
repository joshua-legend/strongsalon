"use client";

import { useMemo } from "react";
import { useProfile } from "@/context/ProfileContext";
import { useGoal } from "@/context/GoalContext";
import { loadDailyLogsV3 } from "@/context/useDailyLogStorage";
import {
  calcWeeklyTrainingScore,
  getScoreGrade,
  type ScoreBreakdown,
} from "@/config/trainingScoring";
import type { DailyLog } from "@/types/workout";
import ActivityRing from "./ActivityRing";

const DAY_NAMES = ["일", "월", "화", "수", "목", "금", "토"];

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getWeekNumber(date: Date): number {
  const start = getWeekStart(date);
  const startOfYear = new Date(start.getFullYear(), 0, 1);
  const diff = start.getTime() - startOfYear.getTime();
  return Math.ceil(diff / (7 * 24 * 60 * 60 * 1000));
}

function getScoreStrokeColor(grade: string): string {
  if (grade === "S" || grade === "A") return "rgb(163, 230, 53)";
  if (grade === "B") return "rgb(234, 179, 8)";
  if (grade === "C") return "rgb(249, 115, 22)";
  return "rgb(239, 68, 68)";
}

function getScoreMessage(goalId: string, breakdown: ScoreBreakdown): string {
  const items: string[] = [];
  if (breakdown.volume < 50) items.push("볼륨");
  if (breakdown.sets < 50) items.push("세트");
  if (breakdown.cardio < 50) items.push("유산소");
  if (breakdown.variety != null && breakdown.variety < 50) items.push("다양성");
  if (items.length === 0) return "잘하고 있어요!";
  return `${items.join(", ")} 보강을 추천해요`;
}

export default function WeeklyView() {
  const { profile } = useProfile();
  const { goalSetting } = useGoal();

  const weeklyData = useMemo(() => {
    if (!profile || !goalSetting) return null;
    const logs = loadDailyLogsV3();
    const today = new Date();
    const weekStart = getWeekStart(today);
    const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);

    const weeklyLogs: DailyLog[] = [];
    for (const [dateStr, log] of Object.entries(logs)) {
      const d = new Date(dateStr);
      if (d >= weekStart && d < weekEnd && log.isCompleted) {
        weeklyLogs.push(log);
      }
    }

    const goalId = goalSetting.goalId;
    const { score, breakdown } = calcWeeklyTrainingScore(
      goalId,
      weeklyLogs,
      profile.weight
    );
    const grade = getScoreGrade(score);

    let totalSets = 0;
    let totalVolume = 0;
    let totalCardioMin = 0;
    weeklyLogs.forEach((log) => {
      log.exercises.forEach((ex) => {
        ex.sets.forEach((s) => {
          if (s.completed && s.weight > 0 && s.reps > 0) {
            totalSets += 1;
            totalVolume += s.weight * s.reps;
          }
        });
      });
      (log.cardio ?? []).forEach((c) => {
        totalCardioMin += c.minutes;
      });
    });

    return {
      weekNumber: getWeekNumber(today),
      score,
      grade,
      breakdown,
      weeklyLogs: weeklyLogs.sort((a, b) => a.date.localeCompare(b.date)),
      totalSets,
      totalVolume,
      totalCardioMin,
      goalId,
    };
  }, [profile, goalSetting]);

  if (!profile || !goalSetting || !weeklyData) return null;

  const { score, grade, breakdown, weeklyLogs, totalSets, totalVolume, totalCardioMin, goalId } = weeklyData;
  const strokeColor = getScoreStrokeColor(grade);
  const scoreMessage = getScoreMessage(goalId, breakdown);

  return (
    <div className="space-y-4">
      {/* 스코어 링 */}
      <div className="rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 p-5 flex flex-col items-center">
        <ActivityRing percent={score} size={140} strokeWidth={12} strokeColor={strokeColor}>
          <span className="font-bebas text-3xl text-white">{score}</span>
          <span className="text-xs text-neutral-500">트레이닝</span>
          <span className="font-bebas text-lg" style={{ color: strokeColor }}>
            {grade}등급
          </span>
        </ActivityRing>
      </div>

      {/* ScoreBreakdown */}
      <div className="rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 p-5">
        <h3 className="font-bebas text-sm text-neutral-400 tracking-wider mb-3">
          채점 분석
        </h3>
        <div className="space-y-3">
          {breakdown.volume != null && (
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>볼륨</span>
                <span className="font-mono text-lime-400">{Math.round(breakdown.volume)}/100</span>
              </div>
              <div className="h-1.5 rounded-full bg-neutral-800 overflow-hidden">
                <div
                  className="h-full bg-lime-400 rounded-full"
                  style={{ width: `${Math.min(100, breakdown.volume)}%` }}
                />
              </div>
            </div>
          )}
          {breakdown.sets != null && (
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>세트</span>
                <span className="font-mono text-lime-400">{Math.round(breakdown.sets)}/100</span>
              </div>
              <div className="h-1.5 rounded-full bg-neutral-800 overflow-hidden">
                <div
                  className="h-full bg-lime-400 rounded-full"
                  style={{ width: `${Math.min(100, breakdown.sets)}%` }}
                />
              </div>
            </div>
          )}
          {breakdown.cardio != null && (
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>유산소</span>
                <span className="font-mono text-lime-400">{Math.round(breakdown.cardio)}/100</span>
              </div>
              <div className="h-1.5 rounded-full bg-neutral-800 overflow-hidden">
                <div
                  className="h-full bg-lime-400 rounded-full"
                  style={{ width: `${Math.min(100, breakdown.cardio)}%` }}
                />
              </div>
            </div>
          )}
          {breakdown.variety != null && (
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>다양성</span>
                <span className="font-mono text-lime-400">{Math.round(breakdown.variety)}/100</span>
              </div>
              <div className="h-1.5 rounded-full bg-neutral-800 overflow-hidden">
                <div
                  className="h-full bg-lime-400 rounded-full"
                  style={{ width: `${Math.min(100, breakdown.variety)}%` }}
                />
              </div>
            </div>
          )}
        </div>
        <p className="mt-3 text-xs text-neutral-500">{scoreMessage}</p>
      </div>

      {/* WeeklySummaryBar */}
      <div className="rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 p-4 grid grid-cols-3 gap-2 text-center">
        <div>
          <div className="text-[10px] text-neutral-500 uppercase">총 세트</div>
          <div className="font-mono text-lg text-lime-400">{totalSets}</div>
        </div>
        <div>
          <div className="text-[10px] text-neutral-500 uppercase">총 볼륨</div>
          <div className="font-mono text-lg text-white">{totalVolume.toLocaleString()}kg</div>
        </div>
        <div>
          <div className="text-[10px] text-neutral-500 uppercase">유산소</div>
          <div className="font-mono text-lg text-white">{totalCardioMin}분</div>
        </div>
      </div>

      {/* DailyWorkoutCards */}
      <div className="rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 p-5">
        <h3 className="font-bebas text-sm text-neutral-400 tracking-wider mb-3">
          일별 기록
        </h3>
        {weeklyLogs.length === 0 ? (
          <div className="py-8 text-center text-xs text-neutral-600">
            아직 이번 주 운동 기록이 없습니다
          </div>
        ) : (
          <div className="space-y-3">
            {weeklyLogs.map((log) => {
              const d = new Date(log.date);
              const dow = d.getDay();
              const dayName = DAY_NAMES[dow];
              const exCount = log.exercises.length;
              const cardioCount = (log.cardio ?? []).length;
              return (
                <div
                  key={log.date}
                  className="rounded-xl bg-neutral-950 border border-neutral-800 p-3"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-neutral-400">
                      {dayName}요일 · {log.date}
                    </span>
                  </div>
                  <div className="text-xs text-neutral-500 space-y-1">
                    <div>근력: {exCount}종목</div>
                    {cardioCount > 0 && <div>유산소: {(log.cardio ?? []).map((c) => `${c.minutes}분`).join(", ")}</div>}
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
