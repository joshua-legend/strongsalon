"use client";

import { useState, useEffect } from "react";
import {
  Target,
  Sliders,
  Scale,
  Dumbbell,
  Zap,
  Flame,
  AlertTriangle,
  X,
  Check,
  Trophy,
} from "lucide-react";
import type {
  GoalPurpose,
  GoalInputs,
  GoalDuration,
  ActiveGoal,
  WeekStatus,
} from "@/types";

const STORAGE_KEY = "fitlog-active-goal";

const PURPOSE_CONFIG: Record<
  GoalPurpose,
  { label: string; wildLabel: string; Icon: typeof Scale; color: string; borderHover: string }
> = {
  다이어트: {
    label: "다이어트",
    wildLabel: "날렵한 표범 다이어트",
    Icon: Scale,
    color: "text-cyan-400",
    borderHover:
      "group-hover:border-cyan-400/50 group-hover:shadow-[0_0_10px_rgba(34,211,238,0.2)]",
  },
  벌크업: {
    label: "벌크업",
    wildLabel: "거대한 곰 벌크업",
    Icon: Zap,
    color: "text-orange-500",
    borderHover:
      "group-hover:border-orange-500/50 group-hover:shadow-[0_0_10px_rgba(249,115,22,0.2)]",
  },
  스트렝스: {
    label: "스트렝스",
    wildLabel: "코뿔소 돌진 스트렝스",
    Icon: Dumbbell,
    color: "text-orange-500",
    borderHover:
      "group-hover:border-orange-500/50 group-hover:shadow-[0_0_10px_rgba(249,115,22,0.2)]",
  },
  바디프로필: {
    label: "바디프로필",
    wildLabel: "독수리 데피니션",
    Icon: Flame,
    color: "text-purple-400",
    borderHover:
      "group-hover:border-purple-400/50 group-hover:shadow-[0_0_10px_rgba(192,132,252,0.2)]",
  },
};

const DURATION_OPTIONS: GoalDuration[] = [4, 8, 12];

/** n주차 목표 수치 (선형 보간): current + (target - current) * ((weekIndex + 1) / totalWeeks) */
function getWeeklyTarget(
  current: number,
  target: number,
  weekIndex: number,
  totalWeeks: number,
): number {
  const ratio = (weekIndex + 1) / totalWeeks;
  const val = current + (target - current) * ratio;
  return Math.round(val * 10) / 10;
}

/** n주차 데드라인 (startDate + (weekIndex+1)*7일) → YYYY-MM-DD */
function getWeekDeadline(startDate: string, weekIndex: number): string {
  const d = new Date(startDate);
  d.setDate(d.getDate() + (weekIndex + 1) * 7);
  return d.toISOString().slice(0, 10);
}

function getDefaultInputs(purpose: GoalPurpose): GoalInputs {
  switch (purpose) {
    case "다이어트":
      return { purpose: "다이어트", current: 70, target: 65, unit: "kg" };
    case "벌크업":
      return {
        purpose: "벌크업",
        weightCurrent: 70,
        weightTarget: 75,
        muscleCurrent: 30,
        muscleTarget: 35,
      };
    case "스트렝스":
      return {
        purpose: "스트렝스",
        squat: 100,
        bench: 80,
        deadlift: 120,
        targetSquat: 120,
        targetBench: 100,
        targetDeadlift: 150,
      };
    case "바디프로필":
      return {
        purpose: "바디프로필",
        fatPctCurrent: 25,
        fatPctTarget: 18,
        weightCurrent: 70,
        weightTarget: 65,
      };
  }
}

function buildActiveGoal(
  purpose: GoalPurpose,
  inputs: GoalInputs,
  duration: GoalDuration,
): ActiveGoal {
  const startDate = new Date().toISOString();
  let title = "";
  let subtitle = "";

  switch (purpose) {
    case "다이어트": {
      const i = inputs as Extract<GoalInputs, { purpose: "다이어트" }>;
      title = `${i.current}kg → ${i.target}kg`;
      subtitle = `체중 감량 목표, ${duration}주 프로토콜`;
      break;
    }
    case "벌크업": {
      const i = inputs as Extract<GoalInputs, { purpose: "벌크업" }>;
      title = `체중 ${i.weightCurrent}→${i.weightTarget}kg, 근육 ${i.muscleCurrent}→${i.muscleTarget}kg`;
      subtitle = `벌크업 ${duration}주 프로토콜`;
      break;
    }
    case "스트렝스": {
      const i = inputs as Extract<GoalInputs, { purpose: "스트렝스" }>;
      title = `3대 ${i.squat + i.bench + i.deadlift}kg → ${i.targetSquat + i.targetBench + i.targetDeadlift}kg`;
      subtitle = `스트렝스 ${duration}주 프로토콜`;
      break;
    }
    case "바디프로필": {
      const i = inputs as Extract<GoalInputs, { purpose: "바디프로필" }>;
      title = `체지방 ${i.fatPctCurrent}% → ${i.fatPctTarget}%`;
      subtitle = `바디프로필 ${duration}주 프로토콜`;
      break;
    }
  }

  const weeklyAchievements: Record<string, WeekStatus[]> = {};
  switch (purpose) {
    case "다이어트":
      weeklyAchievements.weight = Array(duration).fill(null);
      break;
    case "벌크업":
      weeklyAchievements.weight = Array(duration).fill(null);
      weeklyAchievements.muscle = Array(duration).fill(null);
      break;
    case "스트렝스":
      weeklyAchievements.squat = Array(duration).fill(null);
      weeklyAchievements.bench = Array(duration).fill(null);
      weeklyAchievements.deadlift = Array(duration).fill(null);
      break;
    case "바디프로필":
      weeklyAchievements.fatPct = Array(duration).fill(null);
      weeklyAchievements.weight = Array(duration).fill(null);
      break;
  }

  return {
    purpose,
    inputs,
    originalInputs: inputs,
    duration,
    title,
    subtitle,
    startDate,
    weeklyAchievements,
  };
}

type MetricRow = { key: string; label: string; current: number; target: number; unit: string };

/** 실패 시 해당 지표의 목표치를 새 값으로 업데이트 */
function updateInputsTarget(
  inputs: GoalInputs,
  metricKey: string,
  newTarget: number,
): GoalInputs {
  switch (inputs.purpose) {
    case "다이어트":
      return { ...inputs, target: newTarget };
    case "벌크업":
      if (metricKey === "weight") return { ...inputs, weightTarget: newTarget };
      return { ...inputs, muscleTarget: newTarget };
    case "스트렝스":
      if (metricKey === "squat") return { ...inputs, targetSquat: newTarget };
      if (metricKey === "bench") return { ...inputs, targetBench: newTarget };
      return { ...inputs, targetDeadlift: newTarget };
    case "바디프로필":
      if (metricKey === "fatPct") return { ...inputs, fatPctTarget: newTarget };
      return { ...inputs, weightTarget: newTarget };
  }
}

function getMetricRows(inputs: GoalInputs): MetricRow[] {
  switch (inputs.purpose) {
    case "다이어트": {
      const i = inputs;
      return [{ key: "weight", label: "체중", current: i.current, target: i.target, unit: "kg" }];
    }
    case "벌크업": {
      const i = inputs;
      return [
        { key: "weight", label: "체중", current: i.weightCurrent, target: i.weightTarget, unit: "kg" },
        { key: "muscle", label: "근육량", current: i.muscleCurrent, target: i.muscleTarget, unit: "kg" },
      ];
    }
    case "스트렝스": {
      const i = inputs;
      return [
        { key: "squat", label: "스쿼트", current: i.squat, target: i.targetSquat, unit: "kg" },
        { key: "bench", label: "벤치", current: i.bench, target: i.targetBench, unit: "kg" },
        { key: "deadlift", label: "데드리프트", current: i.deadlift, target: i.targetDeadlift, unit: "kg" },
      ];
    }
    case "바디프로필": {
      const i = inputs;
      return [
        { key: "fatPct", label: "체지방률", current: i.fatPctCurrent, target: i.fatPctTarget, unit: "%" },
        { key: "weight", label: "체중", current: i.weightCurrent, target: i.weightTarget, unit: "kg" },
      ];
    }
  }
}

/** 현재|목표 통일 카드 (목표값 orange 강조) */
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

/** step 2 → 3 진행 가능 여부: 현재가 목표보다 이미 높거나 같으면 false */
function canProceedFromStep2(purpose: GoalPurpose, inputs: Partial<GoalInputs>): boolean {
  if (!inputs || !("purpose" in inputs) || inputs.purpose !== purpose) return true;
  switch (purpose) {
    case "다이어트": {
      const cur = (inputs as { current?: number }).current ?? 70;
      const tgt = (inputs as { target?: number }).target ?? 65;
      return cur > tgt; // 감량: 현재 > 목표여야 함
    }
    case "벌크업": {
      const wc = (inputs as { weightCurrent?: number }).weightCurrent ?? 70;
      const wt = (inputs as { weightTarget?: number }).weightTarget ?? 75;
      const mc = (inputs as { muscleCurrent?: number }).muscleCurrent ?? 30;
      const mt = (inputs as { muscleTarget?: number }).muscleTarget ?? 35;
      return wc < wt && mc < mt; // 증량: 현재 < 목표여야 함
    }
    case "스트렝스": {
      const s = (inputs as { squat?: number }).squat ?? 100;
      const b = (inputs as { bench?: number }).bench ?? 80;
      const d = (inputs as { deadlift?: number }).deadlift ?? 120;
      const ts = (inputs as { targetSquat?: number }).targetSquat ?? 120;
      const tb = (inputs as { targetBench?: number }).targetBench ?? 100;
      const td = (inputs as { targetDeadlift?: number }).targetDeadlift ?? 150;
      return s + b + d < ts + tb + td; // 상승: 현재 합 < 목표 합
    }
    case "바디프로필": {
      const fc = (inputs as { fatPctCurrent?: number }).fatPctCurrent ?? 25;
      const ft = (inputs as { fatPctTarget?: number }).fatPctTarget ?? 18;
      return fc > ft; // 체지방 감소: 현재 > 목표여야 함
    }
  }
}

export default function GoalTracker() {
  const [hasTarget, setHasTarget] = useState(false);
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [purpose, setPurpose] = useState<GoalPurpose | null>(null);
  const [inputs, setInputs] = useState<Partial<GoalInputs>>({});
  const [duration, setDuration] = useState<GoalDuration | null>(null);
  const [activeGoal, setActiveGoal] = useState<ActiveGoal | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ActiveGoal;
        if (!parsed.originalInputs) {
          parsed.originalInputs = parsed.inputs;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        }
        if (!parsed.weeklyAchievements) {
          const d = parsed.duration as GoalDuration;
          const goal = buildActiveGoal(parsed.purpose, parsed.inputs, d);
          parsed.weeklyAchievements = goal.weeklyAchievements;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        } else {
          // 마이그레이션: boolean[] → WeekStatus[]
          const wa = parsed.weeklyAchievements as Record<string, unknown[]>;
          let migrated = false;
          for (const k of Object.keys(wa)) {
            const arr = wa[k];
            if (Array.isArray(arr) && arr.some((v) => typeof v === "boolean")) {
              wa[k] = arr.map((v) => (v === true ? "success" : null));
              migrated = true;
            }
          }
          if (migrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        }
        setActiveGoal(parsed);
        setHasTarget(true);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleConfirm = () => {
    if (!purpose || !duration) return;
    const base = getDefaultInputs(purpose);
    const merged = { ...base, ...inputs } as GoalInputs;

    const goal = buildActiveGoal(purpose, merged, duration);
    setActiveGoal(goal);
    setHasTarget(true);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(goal));
    } catch {
      // ignore
    }
    setStep(0);
    setPurpose(null);
    setInputs({});
    setDuration(null);
  };

  const handleStartOver = () => {
    setShowResetConfirm(false);
    setHasTarget(false);
    setActiveGoal(null);
    setStep(0);
    setPurpose(null);
    setInputs({});
    setDuration(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const handlePurposeSelect = (p: GoalPurpose) => {
    setPurpose(p);
    setInputs(getDefaultInputs(p));
    setStep(2);
  };

  const handleDurationSelect = (d: GoalDuration) => {
    setDuration(d);
  };

  const handleSuccess = (metricKey: string, weekIndex: number) => {
    setActiveGoal((prev) => {
      if (!prev) return prev;
      const wa = prev.weeklyAchievements ?? {};
      const arr = [...(wa[metricKey] ?? Array(prev.duration).fill(null))];
      arr[weekIndex] = "success";
      const next = { ...prev, weeklyAchievements: { ...wa, [metricKey]: arr } };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const handleFail = (metricKey: string, weekIndex: number, row: MetricRow) => {
    setActiveGoal((prev) => {
      if (!prev) return prev;
      const duration = prev.duration;
      const failedWeekTarget = getWeeklyTarget(row.current, row.target, weekIndex, duration);
      const newDuration = duration + 1;

      const newInputs = updateInputsTarget(prev.inputs, metricKey, failedWeekTarget);
      const wa = prev.weeklyAchievements ?? {};
      const arr = [...(wa[metricKey] ?? Array(duration).fill(null))];
      const newArr: WeekStatus[] = [
        ...arr.slice(0, weekIndex),
        "fail",
        ...arr.slice(weekIndex + 1),
        null,
      ];

      const next: ActiveGoal = {
        ...prev,
        inputs: newInputs,
        duration: newDuration,
        weeklyAchievements: { ...wa, [metricKey]: newArr },
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // ── Active Dashboard ──
  if (hasTarget && activeGoal) {
    const metricRows = getMetricRows(activeGoal.inputs);
    const duration = activeGoal.duration;
    const wa = activeGoal.weeklyAchievements ?? {};
    const origRows = activeGoal.originalInputs
      ? getMetricRows(activeGoal.originalInputs)
      : metricRows;
    const isFullyComplete = metricRows.every((row) => {
      const statuses = wa[row.key] ?? Array(duration).fill(null);
      return statuses.slice(0, duration).every((s) => s === "success");
    });

    return (
      <div className="relative bg-neutral-900 border border-neutral-800 rounded-2xl p-5 overflow-hidden shadow-2xl group animate-zoom-in-95">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500 opacity-10 blur-3xl rounded-full pointer-events-none" />

        <div className="relative z-10">
          {/* 목표지향 UI */}
          <div className="mb-5">
            <span className="inline-block px-2 py-0.5 bg-orange-500 text-black font-bold text-[10px] uppercase italic -skew-x-12 mb-3 shadow-[0_0_10px_rgba(249,115,22,0.3)]">
              <span className="skew-x-12 flex items-center gap-1">
                <Target className="w-3 h-3" /> 야생 생존 퀘스트
              </span>
            </span>
            <GoalDisplay purpose={activeGoal.purpose} inputs={activeGoal.inputs} duration={activeGoal.duration} />
          </div>

          {/* 최종 도착지 예상 수치 */}
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

          {/* 완료 카드 */}
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

          {/* 주 단위 달성 타임라인 (가로 스크롤) */}
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
                                onClick={() => handleSuccess(row.key, i)}
                                className="flex-1 py-1.5 px-2 text-[10px] font-bold bg-orange-500/30 hover:bg-orange-500/50 text-orange-300 rounded border border-orange-400/40 transition-colors"
                              >
                                사냥 성공!
                              </button>
                              <button
                                type="button"
                                onClick={() => handleFail(row.key, i, row)}
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

        {/* 목표 변경 경고 모달 */}
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
                  onClick={handleStartOver}
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

  // ── Setup Wizard ──
  const isSetup = !hasTarget;
  const containerClass = isSetup
    ? "bg-neutral-900 border-2 border-dashed border-neutral-800 rounded-2xl p-6 shadow-lg relative overflow-hidden hover:border-orange-500/30 transition-colors"
    : "bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-lg relative overflow-hidden";

  return (
    <div className={containerClass}>
      <div className="min-h-[200px] flex flex-col">
        {step === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-4 animate-slide-in-from-bottom">
            <Target className="w-12 h-12 mb-4 text-white group-hover:text-orange-500 transition-all duration-300" />
            <h3 className="text-2xl font-bebas tracking-wider mb-1 text-white">
              목표 설정하기
            </h3>
            <p className="text-xs font-sans mb-6 text-neutral-400">
              목적을 선택하고 수치를 입력해 프로토콜을 시작하세요.
            </p>
            <button
              onClick={() => setStep(1)}
              className="relative inline-block px-6 py-3 font-bold text-sm uppercase italic -skew-x-12 text-black transition-all hover:brightness-110 active:scale-[0.98] bg-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.55)]"
            >
              <div className="absolute inset-0 bg-stripes opacity-20 pointer-events-none" />
              <span className="skew-x-12 flex items-center gap-2">
                <Sliders className="w-4 h-4" /> 목표 설정 시작하기
              </span>
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="animate-slide-in-from-bottom">
            <h3 className="text-lg font-bebas text-white mb-4">목적 선택</h3>
            <div className="grid grid-cols-2 gap-3">
              {(Object.keys(PURPOSE_CONFIG) as GoalPurpose[]).map((p) => {
                const cfg = PURPOSE_CONFIG[p];
                return (
                  <button
                    key={p}
                    onClick={() => handlePurposeSelect(p)}
                    className={`group flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-neutral-800 bg-neutral-950 transition-all ${cfg.borderHover}`}
                  >
                    <cfg.Icon className={`w-8 h-8 ${cfg.color}`} />
                    <span className="font-bebas text-sm text-white">
                      {cfg.wildLabel}
                    </span>
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setStep(0)}
              className="mt-4 text-xs text-neutral-500 hover:text-neutral-300"
            >
              ← 이전
            </button>
          </div>
        )}

        {step === 2 && purpose && (
          <div className="animate-slide-in-from-bottom">
            <h3 className="text-lg font-bebas text-white mb-4">
              현재 수치 & 목표 수치
            </h3>

            {purpose === "다이어트" && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-neutral-500 mb-1 flex items-center justify-between">
                    <span>현재 체중</span>
                    <span className="font-bebas text-orange-500">{(inputs as { current?: number }).current ?? 70} kg</span>
                  </label>
                  <input
                    type="range"
                    min={40}
                    max={150}
                    value={(inputs as { current?: number }).current ?? 70}
                    onChange={(e) =>
                      setInputs((prev) => ({
                        ...prev,
                        purpose: "다이어트",
                        current: Number(e.target.value),
                        target: (prev as { target?: number }).target ?? 65,
                        unit: "kg",
                      }))
                    }
                    className="setup-slider w-full"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-500 mb-1 flex items-center justify-between">
                    <span>목표 체중</span>
                    <span className="font-bebas text-orange-500">{(inputs as { target?: number }).target ?? 65} kg</span>
                  </label>
                  <input
                    type="range"
                    min={40}
                    max={150}
                    value={(inputs as { target?: number }).target ?? 65}
                    onChange={(e) =>
                      setInputs((prev) => ({
                        ...prev,
                        purpose: "다이어트",
                        current: (prev as { current?: number }).current ?? 70,
                        target: Number(e.target.value),
                        unit: "kg",
                      }))
                    }
                    className="setup-slider w-full"
                  />
                </div>
              </div>
            )}

            {purpose === "벌크업" && (
              <div className="space-y-4">
                {(
                  [
                    ["weightCurrent", "현재 체중", 70],
                    ["weightTarget", "목표 체중", 75],
                    ["muscleCurrent", "현재 근육량", 30],
                    ["muscleTarget", "목표 근육량", 35],
                  ] as const
                ).map(([key, label, def]) => {
                  const inp = inputs as Record<string, number>;
                  const val = inp[key] ?? def;
                  return (
                    <div key={key}>
                      <label className="text-xs text-neutral-500 mb-1 flex items-center justify-between">
                        <span>{label}</span>
                        <span className="font-bebas text-orange-500">{val} kg</span>
                      </label>
                      <input
                        type="range"
                        min={key.includes("muscle") ? 20 : 40}
                        max={key.includes("muscle") ? 60 : 120}
                        value={val}
                        onChange={(e) =>
                          setInputs((prev) => {
                            const p = prev as Record<string, number>;
                            const v = Number(e.target.value);
                            return {
                              purpose: "벌크업" as const,
                              weightCurrent:
                                key === "weightCurrent"
                                  ? v
                                  : (p.weightCurrent ?? 70),
                              weightTarget:
                                key === "weightTarget"
                                  ? v
                                  : (p.weightTarget ?? 75),
                              muscleCurrent:
                                key === "muscleCurrent"
                                  ? v
                                  : (p.muscleCurrent ?? 30),
                              muscleTarget:
                                key === "muscleTarget"
                                  ? v
                                  : (p.muscleTarget ?? 35),
                            };
                          })
                        }
                        className="setup-slider w-full"
                      />
                    </div>
                  );
                })}
              </div>
            )}

            {purpose === "스트렝스" && (
              <div className="space-y-4">
                {[
                  ["squat", "targetSquat", "스쿼트"],
                  ["bench", "targetBench", "벤치"],
                  ["deadlift", "targetDeadlift", "데드리프트"],
                ].map(([cur, tgt, label]) => {
                  const curVal = (inputs as Record<string, number>)[cur] ?? 100;
                  const tgtVal = (inputs as Record<string, number>)[tgt] ?? 120;
                  return (
                    <div key={cur} className="space-y-2">
                      <label className="text-xs text-neutral-500 flex items-center justify-between">
                        <span>{label} 현재</span>
                        <span className="font-bebas text-orange-500">{curVal} kg</span>
                      </label>
                      <input
                        type="range"
                        min={0}
                        max={300}
                        value={curVal}
                        onChange={(e) =>
                          setInputs((prev) => ({
                            ...prev,
                            purpose: "스트렝스",
                            ...(prev as object),
                            [cur]: Number(e.target.value),
                          }))
                        }
                        className="setup-slider w-full"
                      />
                      <label className="text-xs text-neutral-500 flex items-center justify-between">
                        <span>{label} 목표</span>
                        <span className="font-bebas text-orange-500">{tgtVal} kg</span>
                      </label>
                      <input
                        type="range"
                        min={0}
                        max={300}
                        value={tgtVal}
                        onChange={(e) =>
                          setInputs((prev) => ({
                            ...prev,
                            purpose: "스트렝스",
                            ...(prev as object),
                            [tgt]: Number(e.target.value),
                          }))
                        }
                        className="setup-slider w-full"
                      />
                    </div>
                  );
                })}
              </div>
            )}

            {purpose === "바디프로필" && (
              <div className="space-y-4">
                {[
                  ["fatPctCurrent", "fatPctTarget", "체지방률", 10, 40, "%"],
                  ["weightCurrent", "weightTarget", "체중", 40, 120, "kg"],
                ].map(([cur, tgt, label, min, max, unit]) => {
                  const curVal = (inputs as Record<string, number>)[cur] ?? (label === "체지방률" ? 25 : 70);
                  const tgtVal = (inputs as Record<string, number>)[tgt] ?? (label === "체지방률" ? 18 : 65);
                  return (
                    <div key={cur} className="space-y-2">
                      <label className="text-xs text-neutral-500 flex items-center justify-between">
                        <span>{label} 현재</span>
                        <span className="font-bebas text-orange-500">{curVal}{unit}</span>
                      </label>
                      <input
                        type="range"
                        min={min}
                        max={max}
                        value={curVal}
                        onChange={(e) =>
                          setInputs((prev) => ({
                            ...prev,
                            purpose: "바디프로필",
                            ...(prev as object),
                            [cur]: Number(e.target.value),
                          }))
                        }
                        className="setup-slider w-full"
                      />
                      <label className="text-xs text-neutral-500 flex items-center justify-between">
                        <span>{label} 목표</span>
                        <span className="font-bebas text-orange-500">{tgtVal}{unit}</span>
                      </label>
                      <input
                        type="range"
                        min={min}
                        max={max}
                        value={tgtVal}
                        onChange={(e) =>
                          setInputs((prev) => ({
                            ...prev,
                            purpose: "바디프로필",
                            ...(prev as object),
                            [tgt]: Number(e.target.value),
                          }))
                        }
                        className="setup-slider w-full"
                      />
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setStep(1)}
                className="text-xs text-neutral-500 hover:text-neutral-300"
              >
                ← 이전
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!canProceedFromStep2(purpose, inputs)}
                className="ml-auto px-4 py-2 bg-orange-500 text-black font-bold text-sm rounded-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:brightness-100"
              >
                다음 →
              </button>
            </div>
          </div>
        )}

        {step === 3 && purpose && (
          <div className="animate-slide-in-from-bottom">
            <h3 className="text-lg font-bebas text-white mb-4">기간 설정</h3>
            <div className="flex gap-2 mb-6">
              {DURATION_OPTIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => handleDurationSelect(d)}
                  className={`flex-1 py-3 rounded-xl border-2 font-bebas text-sm transition-all ${
                    duration === d
                      ? "border-orange-500 bg-orange-500/10 text-orange-500"
                      : "border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-600"
                  }`}
                >
                  {d}주
                </button>
              ))}
            </div>

            <button
              onClick={handleConfirm}
              disabled={!duration}
              className="w-full py-3 bg-orange-500 text-black font-bold text-sm rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 transition-all"
            >
              <Target className="w-4 h-4" /> 목표 확정
            </button>

            <button
              onClick={() => setStep(2)}
              className="mt-4 text-xs text-neutral-500 hover:text-neutral-300 block"
            >
              ← 이전
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
