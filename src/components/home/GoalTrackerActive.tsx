"use client";

import { useState } from "react";
import { Target, Sliders, AlertTriangle, X, Check, Trophy } from "lucide-react";
import type { ActiveGoal, GoalInputs, GoalPurpose, WeekStatus } from "@/types";
import {
  PURPOSE_CONFIG,
  MetricRow,
  getMetricRows,
  getWeeklyTarget,
  getWeekDeadline,
} from "./goalTrackerUtils";

function MetricCard({
  label,
  current,
  target,
  unit,
}: {
  label: string;
  current: number;
  target: number;
  unit: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-2 px-3 bg-neutral-950/80 rounded-xl border border-neutral-800">
      <span className="text-xs text-neutral-500">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-bebas text-neutral-400">{current}{unit}</span>
        <span className="text-neutral-600">|</span>
        <span className="font-bebas text-lg text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/30">
          {target}{unit}
        </span>
      </div>
    </div>
  );
}

function GoalDisplay({
  purpose,
  inputs,
  duration,
}: {
  purpose: GoalPurpose;
  inputs: GoalInputs;
  duration: number;
}) {
  const cfg = PURPOSE_CONFIG[purpose];
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-baseline gap-2">
        <cfg.Icon className={`w-5 h-5 ${cfg.color} shrink-0`} />
        <span className="text-xs text-neutral-500 font-mono">{cfg.wildLabel} · {duration}주</span>
      </div>
      <div className="grid gap-2">
        {inputs.purpose === "다이어트" && (
          <>
            <MetricCard
              label="체중"
              current={(inputs as Extract<GoalInputs, { purpose: "다이어트" }>).current}
              target={(inputs as Extract<GoalInputs, { purpose: "다이어트" }>).target}
              unit="kg"
            />
            <p className="text-xs text-neutral-500">체중 감량 목표</p>
          </>
        )}
        {inputs.purpose === "벌크업" && (
          <>
            <MetricCard
              label="체중"
              current={(inputs as Extract<GoalInputs, { purpose: "벌크업" }>).weightCurrent}
              target={(inputs as Extract<GoalInputs, { purpose: "벌크업" }>).weightTarget}
              unit="kg"
            />
            <MetricCard
              label="근육량"
              current={(inputs as Extract<GoalInputs, { purpose: "벌크업" }>).muscleCurrent}
              target={(inputs as Extract<GoalInputs, { purpose: "벌크업" }>).muscleTarget}
              unit="kg"
            />
            <p className="text-xs text-neutral-500">벌크업 목표</p>
          </>
        )}
        {inputs.purpose === "스트렝스" && (
          <>
            <MetricCard
              label="3대 합산"
              current={
                (inputs as Extract<GoalInputs, { purpose: "스트렝스" }>).squat +
                (inputs as Extract<GoalInputs, { purpose: "스트렝스" }>).bench +
                (inputs as Extract<GoalInputs, { purpose: "스트렝스" }>).deadlift
              }
              target={
                (inputs as Extract<GoalInputs, { purpose: "스트렝스" }>).targetSquat +
                (inputs as Extract<GoalInputs, { purpose: "스트렝스" }>).targetBench +
                (inputs as Extract<GoalInputs, { purpose: "스트렝스" }>).targetDeadlift
              }
              unit="kg"
            />
            <p className="text-xs text-neutral-500">스쿼트 · 벤치 · 데드리프트 목표</p>
          </>
        )}
        {inputs.purpose === "바디프로필" && (
          <>
            <MetricCard
              label="체지방률"
              current={(inputs as Extract<GoalInputs, { purpose: "바디프로필" }>).fatPctCurrent}
              target={(inputs as Extract<GoalInputs, { purpose: "바디프로필" }>).fatPctTarget}
              unit="%"
            />
            <MetricCard
              label="체중"
              current={(inputs as Extract<GoalInputs, { purpose: "바디프로필" }>).weightCurrent}
              target={(inputs as Extract<GoalInputs, { purpose: "바디프로필" }>).weightTarget}
              unit="kg"
            />
            <p className="text-xs text-neutral-500">바디프로필 준비 목표</p>
          </>
        )}
      </div>
    </div>
  );
}

interface GoalTrackerActiveProps {
  activeGoal: ActiveGoal;
  onSuccess: (metricKey: string, weekIndex: number) => void;
  onFail: (metricKey: string, weekIndex: number, row: MetricRow) => void;
  onReset: () => void;
}

export default function GoalTrackerActive({
  activeGoal,
  onSuccess,
  onFail,
  onReset,
}: GoalTrackerActiveProps) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const metricRows = getMetricRows(activeGoal.inputs);
  const duration = activeGoal.duration;
  const wa = activeGoal.weeklyAchievements ?? {};
  const origRows = activeGoal.originalInputs
    ? getMetricRows(activeGoal.originalInputs)
    : metricRows;
  const isFullyComplete = metricRows.every((row) => {
    const statuses = wa[row.key] ?? Array(duration).fill(null);
    return statuses.slice(0, duration).every((s: WeekStatus) => s === "success");
  });

  return (
    <div className="relative bg-neutral-900 border border-neutral-800 rounded-2xl p-5 overflow-hidden shadow-2xl group animate-zoom-in-95">
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500 opacity-10 blur-3xl rounded-full pointer-events-none" />

      <div className="relative z-10">
        <div className="mb-5">
          <span className="inline-block px-2 py-0.5 bg-orange-500 text-black font-bold text-[10px] uppercase italic -skew-x-12 mb-3 shadow-[0_0_10px_rgba(249,115,22,0.3)]">
            <span className="skew-x-12 flex items-center gap-1">
              <Target className="w-3 h-3" /> 야생 생존 퀘스트
            </span>
          </span>
          <GoalDisplay purpose={activeGoal.purpose} inputs={activeGoal.inputs} duration={activeGoal.duration} />
        </div>

        {metricRows.length > 0 && (
          <div className="mb-4 p-3 rounded-xl border bg-neutral-950/80 border-neutral-800">
            <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-2">
              최종 도착지
            </div>
            {metricRows.map((row, idx) => {
              const orig = origRows[idx];
              const origTarget = orig?.target ?? row.target;
              const isDecreaseGoal = ["weight", "fatPct"].includes(row.key) && activeGoal.purpose !== "벌크업";
              const isDelayed = isDecreaseGoal
                ? row.target > origTarget
                : row.target < origTarget;
              const isOver = isDecreaseGoal
                ? row.target < origTarget
                : row.target > origTarget;
              const delta = Math.round(Math.abs(row.target - origTarget) * 10) / 10;
              return (
                <div key={row.key} className="flex items-center justify-between gap-2 text-sm">
                  <span className="text-neutral-400">{row.label}</span>
                  <span
                    className={`font-bebas ${
                      isDelayed ? "text-red-500" : isOver ? "text-orange-500" : "text-white"
                    }`}
                  >
                    {row.target}{row.unit}
                    {isDelayed && orig && delta > 0 && (
                      <span className="text-[10px] font-mono text-red-400 ml-1">
                        (원래 {origTarget}{row.unit} → {delta}{row.unit} 지연)
                      </span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {isFullyComplete && (
          <div className="mb-4 p-5 rounded-2xl border-2 border-orange-500/50 bg-orange-500/10 flex flex-col items-center gap-2 animate-zoom-in-95">
            <Trophy className="w-12 h-12 text-orange-500" />
            <span className="font-bebas text-xl text-orange-500 tracking-wider">
              생존 퀘스트 완료!
            </span>
            <div className="text-xs text-neutral-300 font-mono text-center">
              {metricRows.map((row) => (
                <div key={row.key}>
                  {row.label}: {row.target}{row.unit} 달성
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4 mb-4">
          {metricRows.map((row) => {
            const statuses = wa[row.key] ?? Array(duration).fill(null);
            return (
              <div key={row.key} className="bg-neutral-950 rounded-xl p-4 border border-neutral-800">
                <div className="text-xs text-neutral-500 mb-3">
                  {row.label} {row.current}{row.unit} → {row.target}{row.unit}
                </div>
                <div className="flex overflow-x-auto gap-3 pb-2 custom-scrollbar">
                  {Array.from({ length: duration }, (_, i) => {
                    const targetVal = getWeeklyTarget(row.current, row.target, i, duration);
                    const status = statuses[i] ?? null;
                    const deadline = getWeekDeadline(activeGoal.startDate, i);
                    return (
                      <div
                        key={i}
                        className={`flex flex-col gap-1 p-3 rounded-lg border transition-colors min-w-[140px] shrink-0 ${
                          status === "success"
                            ? "bg-orange-500/20 border-orange-500/40"
                            : status === "fail"
                              ? "bg-red-500/10 border-red-500/40"
                              : "bg-neutral-900 border-neutral-800"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] text-neutral-500">
                            {i + 1}주 · {deadline}
                          </span>
                        </div>
                        <span className="font-bebas text-sm text-white">
                          {targetVal}{row.unit}
                        </span>
                        <p className="text-[9px] text-neutral-500 mt-1">
                          이번 주 사냥 목표에 도달하셨나요?
                        </p>
                        {status === null ? (
                          <div className="flex gap-1 mt-1">
                            <button
                              type="button"
                              onClick={() => onSuccess(row.key, i)}
                              className="flex-1 py-1.5 px-2 text-[10px] font-bold bg-orange-500/30 hover:bg-orange-500/50 text-orange-300 rounded border border-orange-400/40 transition-colors"
                            >
                              사냥 성공!
                            </button>
                            <button
                              type="button"
                              onClick={() => onFail(row.key, i, row)}
                              className="flex-1 py-1.5 px-2 text-[10px] font-bold bg-red-500/30 hover:bg-red-500/50 text-red-300 rounded border border-red-400/40 transition-colors"
                            >
                              사냥 실패...
                            </button>
                          </div>
                        ) : status === "success" ? (
                          <div className="flex items-center gap-1 mt-1 text-orange-500">
                            <Check className="w-4 h-4 shrink-0" />
                            <span className="text-[10px]">완료</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 mt-1 text-red-400">
                            <X className="w-4 h-4 shrink-0" />
                            <span className="text-[10px]">실패</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => setShowResetConfirm(true)}
          className="w-full py-3 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 rounded-xl text-sm font-bold text-neutral-400 transition-colors flex items-center justify-center gap-2"
        >
          <Sliders className="w-4 h-4" /> 목표 변경
        </button>
      </div>

      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-sm bg-neutral-900 border border-orange-500/50 rounded-2xl p-5 shadow-xl animate-zoom-in-95">
            <button
              onClick={() => setShowResetConfirm(false)}
              className="absolute top-3 right-3 p-1 rounded-lg text-neutral-500 hover:text-white hover:bg-neutral-800 transition-colors"
              aria-label="닫기"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-start gap-3 mb-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg mb-1">목표 변경 시 주의</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  목표를 변경하면 <span className="text-orange-400 font-semibold">기존 목표와 관련된 기록이 모두 삭제</span>됩니다. 정말 변경하시겠습니까?
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-3 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-xl text-sm font-bold text-white transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => { setShowResetConfirm(false); onReset(); }}
                className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-black font-bold text-sm rounded-xl transition-colors"
              >
                변경하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
