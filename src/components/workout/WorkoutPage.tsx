"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bookmark,
  Dumbbell,
  FolderOpen,
  ListChecks,
  PencilLine,
  PlayCircle,
  Plus,
  RefreshCw,
  RotateCcw,
  Sparkles,
  Trash2,
  UserCheck,
  X,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useGoal } from "@/context/GoalContext";
import { useToast } from "@/components/ui/Toast";
import type { WorkoutCondition } from "@/types";
import {
  getMockRecommendation,
  type RecommendationResponse,
} from "@/data/workoutRecommendation";
import { exercisesInfo } from "@/data/exercises-info";
import NeedStrengthModal from "./NeedStrengthModal";
import TimeSelectCard from "./TimeSelectCard";
import ConditionSelectCard from "./ConditionSelectCard";
import FreeArea from "./FreeArea";
import { useWorkoutLog } from "./useWorkoutLog";

type WorkoutTabMode = "recommended" | "free" | "pt";
type FreeOptionIcon = "plus" | "bookmark" | "recent";

interface FreeQuickOption {
  id: string;
  icon: FreeOptionIcon;
  title: string;
  desc: string;
  estMinutes: number;
  condition: WorkoutCondition;
  exercises?: RecommendationResponse["exercises"];
  exerciseNames?: string[];
}

interface CustomRoutine {
  id: string;
  name: string;
  exerciseNames: string[];
  createdAt: number;
}

const ROUTINE_STORAGE_KEY = "strongsalon.custom-routines.v1";
const ROUTINE_STRENGTH_CATEGORIES = [
  "가슴",
  "하체",
  "등",
  "어깨",
  "팔",
  "코어",
] as const;

const PT_LOGS = [
  { id: "1", name: "바벨 스쿼트", time: "14:31", done: "3세트 완료", value: "85kg x 10회", active: true },
  { id: "2", name: "바벨 스쿼트", time: "14:24", done: "2세트 완료", value: "75kg x 12회" },
  { id: "3", name: "바벨 스쿼트", time: "14:20", done: "웜업 세트 완료", value: "40kg x 20회" },
  { id: "4", name: "동적 스트레칭", time: "14:15", done: "하체 웜업 완료", value: "5분" },
];

function todayIsoDate() {
  return new Date().toISOString().split("T")[0];
}

function toHHMMSS(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function iconOf(kind: FreeOptionIcon) {
  if (kind === "plus") return Plus;
  if (kind === "recent") return RotateCcw;
  return Bookmark;
}

function customRoutineToOption(routine: CustomRoutine): FreeQuickOption {
  return {
    id: routine.id,
    icon: "bookmark",
    title: `저장 루틴: ${routine.name}`,
    desc: `${routine.exerciseNames.length}종목 · 내 루틴`,
    estMinutes: Math.max(30, Math.min(90, routine.exerciseNames.length * 12)),
    condition: "좋음",
    exerciseNames: routine.exerciseNames,
  };
}

export default function WorkoutPage() {
  const log = useWorkoutLog();
  const { showToast } = useToast();
  const {
    exitWorkout,
    setSelectedSplit,
    setTab,
    setOpenRecommendationSetup,
    setOpenStrengthSetup,
  } = useApp();
  const { categorySettings } = useGoal();
  const [overlayExiting, setOverlayExiting] = useState(false);
  const [mode, setMode] = useState<WorkoutTabMode>("free");
  const [freeSessionPageOpen, setFreeSessionPageOpen] = useState(false);
  const [recommendedSessionPageOpen, setRecommendedSessionPageOpen] = useState(false);
  const [showNeedStrengthModal, setShowNeedStrengthModal] = useState(false);
  const [recommendationReason, setRecommendationReason] = useState<string | null>(null);
  const [customRoutines, setCustomRoutines] = useState<CustomRoutine[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(ROUTINE_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as CustomRoutine[];
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(
        (item) =>
          typeof item?.id === "string" &&
          typeof item?.name === "string" &&
          Array.isArray(item?.exerciseNames),
      );
    } catch {
      return [];
    }
  });
  const [routineBuilderOpen, setRoutineBuilderOpen] = useState(false);
  const [routineEditingId, setRoutineEditingId] = useState<string | null>(null);
  const [routineNameInput, setRoutineNameInput] = useState("");
  const [routineSelectedNames, setRoutineSelectedNames] = useState<Set<string>>(
    new Set(),
  );

  const strength = categorySettings?.strength;
  const inbody = categorySettings?.inbody;
  const fitness = categorySettings?.fitness;
  const hasStrength =
    strength?.isConfigured &&
    strength?.startValues &&
    (strength.startValues.squat ?? 0) > 0 &&
    (strength.startValues.bench ?? 0) > 0 &&
    (strength.startValues.deadlift ?? 0) > 0;
  const hasInbody =
    inbody?.isConfigured &&
    inbody?.startValues &&
    (inbody.startValues.weight ?? 0) > 0 &&
    (inbody.startValues.fatPercent ?? 0) >= 5 &&
    (inbody.startValues.muscleMass ?? 0) >= 10;
  const hasFitness =
    fitness?.isConfigured &&
    fitness?.startValues &&
    ((fitness.startValues.running ?? 0) > 0 ||
      (fitness.startValues.rowing ?? 0) > 0 ||
      (fitness.startValues.skierg ?? 0) > 0);
  const hasAllRecommendationData = hasStrength && hasInbody && hasFitness;
  const has1RM =
    strength?.startValues &&
    (strength.startValues.squat ?? 0) +
      (strength.startValues.bench ?? 0) +
      (strength.startValues.deadlift ?? 0) >
      0;

  const previewRecommendation = useMemo(() => getMockRecommendation(), []);
  const aiPreviewExercises = previewRecommendation.exercises.slice(0, 2);
  const aiRemainingCount = Math.max(0, previewRecommendation.exercises.length - aiPreviewExercises.length);
  const aiTotalSetCount = previewRecommendation.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
  const strengthExercisesForRoutine = useMemo(
    () => exercisesInfo.filter((ex) => ex.category !== "유산소"),
    [],
  );
  const customRoutineOptions: FreeQuickOption[] = useMemo(
    () => customRoutines.map((routine) => customRoutineToOption(routine)),
    [customRoutines],
  );

  const isReady = log.workoutPhase === "ready";
  const isInProgress = log.workoutPhase === "inProgress";
  const isPtMode = mode === "pt";
  const showFreeSessionPage = mode === "free" && freeSessionPageOpen;
  const showRecommendedSessionPage =
    mode === "recommended" && recommendedSessionPageOpen;
  const showSessionPage = showFreeSessionPage || showRecommendedSessionPage;
  const showFreeModeDetails =
    !isPtMode && (mode === "free" || mode === "recommended") && showSessionPage;
  const showInlineFreeReadyActions = mode === "free" && isReady && !showSessionPage;
  const showBottomCta = showSessionPage || !showInlineFreeReadyActions;
  const showSessionReadyStartCta = showSessionPage && isReady;
  const isRoutineEditMode = routineEditingId !== null;

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(ROUTINE_STORAGE_KEY, JSON.stringify(customRoutines));
  }, [customRoutines]);

  const handleModeSelect = (nextMode: WorkoutTabMode) => {
    if (nextMode === mode) return;
    if (nextMode === "recommended" && !hasAllRecommendationData) {
      setShowNeedStrengthModal(true);
      return;
    }
    setMode(nextMode);
    if (nextMode !== "free") {
      setFreeSessionPageOpen(false);
    }
    if (nextMode !== "recommended") {
      setRecommendedSessionPageOpen(false);
    }
    setSelectedSplit(null);
    if (nextMode === "recommended") {
      log.loadFromRecommendation(previewRecommendation);
      setRecommendationReason(previewRecommendation.reason ?? null);
      return;
    }
    log.resetExercises();
    setRecommendationReason(null);
  };

  const runFreeOption = (option: FreeQuickOption) => {
    setMode("free");
    setFreeSessionPageOpen(false);
    setRecommendedSessionPageOpen(false);
    setSelectedSplit(null);
    log.setEstMinutes(option.estMinutes);
    log.setCondition(option.condition);
    if (option.exercises) {
      log.loadFromRecommendation({
        date: todayIsoDate(),
        estMinutes: option.estMinutes,
        exercises: option.exercises,
      });
    } else if (option.exerciseNames && option.exerciseNames.length > 0) {
      log.resetExercises();
      option.exerciseNames.forEach((name) => {
        const matched = strengthExercisesForRoutine.find((ex) => ex.name === name);
        log.toggleFav(matched?.icon ?? "💪", name);
      });
    } else {
      log.resetExercises();
    }
    setRecommendationReason(null);
  };

  const handleButtonClick = () => {
    if (isPtMode) {
      showToast("PT 모드 동기화 연동은 준비 중이에요.");
      return;
    }
    if (isReady) {
      if (mode === "free") {
        if (!freeSessionPageOpen) {
          setFreeSessionPageOpen(true);
          setRecommendedSessionPageOpen(false);
          return;
        }
      }
      if (mode === "recommended") {
        if (!recommendedSessionPageOpen) {
          setRecommendedSessionPageOpen(true);
          setFreeSessionPageOpen(false);
          return;
        }
      }
      if (mode === "free" || mode === "recommended") {
        log.startWorkout();
        return;
      }
      if (mode !== "pt") {
        setFreeSessionPageOpen(true);
        setRecommendedSessionPageOpen(false);
      }
      log.startWorkout();
    }
    else if (isInProgress) {
      setFreeSessionPageOpen(false);
      setRecommendedSessionPageOpen(false);
      log.completeWorkout();
    }
  };

  const handleOpenFreeSessionPage = () => {
    if (mode === "free" && isReady) {
      setFreeSessionPageOpen(true);
      setRecommendedSessionPageOpen(false);
    }
  };

  const handleCreateRoutine = () => {
    setRoutineEditingId(null);
    setRoutineNameInput("");
    setRoutineSelectedNames(new Set());
    setRoutineBuilderOpen(true);
  };

  const handleEditRoutine = (routineId: string) => {
    const target = customRoutines.find((routine) => routine.id === routineId);
    if (!target) return;
    setRoutineEditingId(target.id);
    setRoutineNameInput(target.name);
    setRoutineSelectedNames(new Set(target.exerciseNames));
    setRoutineBuilderOpen(true);
  };

  const handleDeleteRoutine = (routineId: string) => {
    const target = customRoutines.find((routine) => routine.id === routineId);
    if (!target) return;
    if (typeof window !== "undefined") {
      const ok = window.confirm(`"${target.name}" 루틴을 삭제할까요?`);
      if (!ok) return;
    }
    setCustomRoutines((prev) => prev.filter((routine) => routine.id !== routineId));
    if (routineEditingId === routineId) {
      setRoutineEditingId(null);
      setRoutineBuilderOpen(false);
    }
    showToast(`"${target.name}" 루틴을 삭제했어요.`);
  };

  const closeRoutineBuilder = () => {
    setRoutineBuilderOpen(false);
    setRoutineEditingId(null);
  };

  const handleToggleRoutineExercise = (name: string) => {
    setRoutineSelectedNames((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const handleSaveRoutine = () => {
    const trimmed = routineNameInput.trim();
    if (!trimmed) {
      showToast("루틴 이름을 입력해 주세요.");
      return;
    }
    if (routineSelectedNames.size === 0) {
      showToast("운동 종목을 1개 이상 선택해 주세요.");
      return;
    }
    if (routineEditingId) {
      setCustomRoutines((prev) =>
        prev.map((routine) =>
          routine.id === routineEditingId
            ? {
                ...routine,
                name: trimmed,
                exerciseNames: Array.from(routineSelectedNames),
              }
            : routine,
        ),
      );
      showToast(`"${trimmed}" 루틴을 수정했어요.`);
      closeRoutineBuilder();
      return;
    }

    const nextRoutine: CustomRoutine = {
      id: `custom_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      name: trimmed,
      exerciseNames: Array.from(routineSelectedNames),
      createdAt: Date.now(),
    };
    setCustomRoutines((prev) => [nextRoutine, ...prev]);
    showToast(`"${trimmed}" 루틴이 저장됐어요.`);
    closeRoutineBuilder();
  };

  const ctaDisabled =
    !isPtMode &&
    ((isReady && showSessionPage && !log.isWorkoutReady) ||
      (isInProgress && !(log.allSetsChecked && log.allCardioChecked)));

  const ctaTitle = isPtMode
    ? "PT 세션 요약 보기"
    : showSessionReadyStartCta
      ? "운동 시작"
    : isInProgress
      ? "운동 종료 및 기록 저장"
      : mode === "recommended"
        ? "AI 추천 루틴 시작하기"
        : "자유 운동 시작하기";

  const ctaDesc = isPtMode
    ? "동기화 로그를 확인하고 마무리"
    : showSessionReadyStartCta
      ? "시작하면 타이머가 켜지고 기록이 진행돼요"
    : isInProgress
      ? "모든 세트 체크 후 종료 가능"
      : mode === "recommended"
        ? `${previewRecommendation.exercises.length}종목 · ${aiTotalSetCount}세트 바로 시작`
        : "빈 세션에서 마음대로 기록";

  const handleGoToStrengthSetup = () => {
    setShowNeedStrengthModal(false);
    setTab("level");
    setOpenRecommendationSetup(true);
  };

  const handleOverlayEnterComplete = () => {
    setTimeout(() => setOverlayExiting(true), 2500);
  };

  return (
    <div className="min-h-full flex flex-col bg-[var(--bg-body)]">
      <div className="flex-1 overflow-auto px-4 py-4" style={{ paddingBottom: 88 }}>
        <div className="grid grid-cols-1 gap-4 max-w-4xl mx-auto">
          <div className="flex flex-col gap-4">

            {!showSessionPage && (
              <>
                <div className="rounded-[1.25rem] p-1.5 border grid grid-cols-3 gap-1" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-light)" }}>
                  {[
                    { id: "recommended" as const, label: "AI 추천", Icon: Sparkles },
                    { id: "free" as const, label: "자유 모드", Icon: Dumbbell },
                    { id: "pt" as const, label: "PT 모드", Icon: UserCheck },
                  ].map(({ id, label, Icon }) => {
                    const active = mode === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => handleModeSelect(id)}
                        className="py-3 rounded-[1rem] text-[12px] font-bold flex flex-col items-center justify-center gap-1.5 transition-colors"
                        style={active ? { backgroundColor: "var(--accent-main)", color: "var(--accent-text)" } : { backgroundColor: "transparent", color: "var(--text-sub)" }}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{label}</span>
                      </button>
                    );
                  })}
                </div>

                <AnimatePresence mode="wait">
                  {mode === "recommended" && (
                    <motion.div key="ai" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                      <div className="rounded-[1.25rem] p-4 border shadow-sm" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-light)" }}>
                        <div className="flex justify-between items-center mb-3 pb-3 border-b" style={{ borderColor: "var(--border-light)" }}>
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: "var(--accent-bg)" }}>
                              <ListChecks className="w-4 h-4" style={{ color: "var(--accent-main)" }} />
                            </div>
                            <span className="text-[13px] font-bold" style={{ color: "var(--text-main)" }}>AI 루틴 요약</span>
                          </div>
                          <span className="text-[11px] font-mono px-2 py-1 rounded-md" style={{ color: "var(--text-sub)", backgroundColor: "var(--bg-body)" }}>
                            총 {previewRecommendation.exercises.length}종목 · {aiTotalSetCount}세트
                          </span>
                        </div>
                        <div className="space-y-2.5">
                          {aiPreviewExercises.map((ex, idx) => (
                            <div key={ex.name} className="flex items-center justify-between">
                              <span className="text-[13px] font-bold" style={{ color: "var(--text-main)" }}>{idx + 1}. {ex.name}</span>
                              <span className="text-[11px] font-mono" style={{ color: "var(--text-sub)" }}>{ex.sets.length} Set</span>
                            </div>
                          ))}
                          {aiRemainingCount > 0 && (
                            <p className="text-[12px] italic" style={{ color: "var(--text-sub)" }}>
                              + 나머지 {aiRemainingCount}종목 대기 중...
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {mode === "free" && (
                    <motion.div key="free" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                      <div className="rounded-[1.25rem] p-4 border shadow-sm" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-light)" }}>
                        <div className="flex justify-between items-center mb-3 pb-3 border-b" style={{ borderColor: "var(--border-light)" }}>
                          <span className="text-[13px] font-bold" style={{ color: "var(--text-main)" }}>나만의 루틴</span>
                          <span className="text-[11px] font-mono px-2 py-1 rounded-md" style={{ color: "var(--text-sub)", backgroundColor: "var(--bg-body)" }}>
                            총 {customRoutineOptions.length}개 저장됨
                          </span>
                        </div>
                        {customRoutineOptions.length === 0 ? (
                          <div className="rounded-xl border py-7 px-4 flex flex-col items-center justify-center text-center gap-2.5" style={{ borderColor: "var(--border-light)", backgroundColor: "var(--bg-body)" }}>
                            <div className="w-11 h-11 rounded-full border flex items-center justify-center" style={{ borderColor: "var(--border-light)", color: "var(--text-sub)", backgroundColor: "var(--bg-card)" }}>
                              <FolderOpen className="w-5 h-5" />
                            </div>
                            <p className="text-[13px] font-semibold" style={{ color: "var(--text-main)" }}>
                              아직 저장된 루틴이 없어요
                            </p>
                            <p className="text-[11px] leading-relaxed" style={{ color: "var(--text-sub)" }}>
                              아래에서 나만의 루틴을 만들어 바로 시작해보세요.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {customRoutineOptions.map((option) => {
                              const Icon = iconOf(option.icon);
                              return (
                                <div key={option.id} className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      runFreeOption(option);
                                      setFreeSessionPageOpen(true);
                                      setRecommendedSessionPageOpen(false);
                                    }}
                                    className="flex-1 flex items-center justify-between rounded-lg px-2 py-2 border"
                                    style={{
                                      color: "var(--text-main)",
                                      borderColor: "var(--border-light)",
                                      backgroundColor: "var(--bg-body)",
                                    }}
                                  >
                                    <div className="flex items-center gap-3 text-left">
                                      <Icon className="w-4 h-4" style={{ color: "var(--text-sub)" }} />
                                      <div>
                                        <p className="text-[13px] font-bold">{option.title}</p>
                                        <p className="text-[11px]" style={{ color: "var(--text-sub)" }}>{option.desc}</p>
                                      </div>
                                    </div>
                                    <PlayCircle className="w-5 h-5" style={{ color: "var(--text-sub)" }} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleEditRoutine(option.id)}
                                    className="w-10 h-10 rounded-lg border flex items-center justify-center"
                                    style={{
                                      borderColor: "var(--border-light)",
                                      color: "var(--text-sub)",
                                      backgroundColor: "var(--bg-body)",
                                    }}
                                    aria-label={`${option.title} 수정`}
                                    title="루틴 수정"
                                  >
                                    <PencilLine className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteRoutine(option.id)}
                                    className="w-10 h-10 rounded-lg border flex items-center justify-center"
                                    style={{
                                      borderColor: "var(--border-light)",
                                      color: "#ef4444",
                                      backgroundColor: "var(--bg-body)",
                                    }}
                                    aria-label={`${option.title} 삭제`}
                                    title="루틴 삭제"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {mode === "pt" && (
                    <motion.div key="pt" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-3">
                      <div className="border rounded-[1.25rem] p-4 flex justify-between items-center" style={{ backgroundColor: "var(--accent-bg)", borderColor: "var(--accent-main)" }}>
                        <div>
                          <h3 className="text-[14px] font-bold" style={{ color: "var(--text-main)" }}>김트레이너 PT 진행중</h3>
                          <p className="text-[11px] font-mono" style={{ color: "var(--accent-main)" }}>{isInProgress ? toHHMMSS(log.elapsedSec) : "00:24:15"} 경과</p>
                        </div>
                        <button type="button" onClick={() => showToast("PT 로그를 최신 상태로 동기화했어요.")} className="w-8 h-8 rounded-full border flex items-center justify-center" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-light)", color: "var(--text-main)" }}>
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="rounded-[1.25rem] p-4 border" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-light)" }}>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-[12px] font-bold" style={{ color: "var(--text-sub)" }}>실시간 운동 기록 로그</span>
                          <span className="text-[10px]" style={{ color: "var(--text-sub)" }}>자동 동기화 켬</span>
                        </div>
                        <div className="space-y-2">
                          {PT_LOGS.map((row) => (
                            <div key={row.id} className="rounded-xl border p-3" style={{ backgroundColor: row.active ? "var(--accent-bg)" : "var(--bg-body)", borderColor: row.active ? "var(--accent-main)" : "var(--border-light)" }}>
                              <div className="flex justify-between">
                                <span className="text-[12px] font-bold" style={{ color: "var(--text-main)" }}>{row.name}</span>
                                <span className="text-[10px] font-mono" style={{ color: "var(--text-sub)" }}>{row.time}</span>
                              </div>
                              <p className="text-[11px]" style={{ color: "var(--text-sub)" }}>{row.done} <span style={{ color: "var(--text-main)" }}>{row.value}</span></p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {showInlineFreeReadyActions && (
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={handleCreateRoutine}
                      className="w-full h-[52px] rounded-[1rem] border flex items-center justify-center gap-2 text-[13px] font-semibold transition-all active:scale-95"
                      style={{
                        backgroundColor: "var(--bg-card)",
                        borderColor: "var(--border-light)",
                        color: "var(--text-main)",
                      }}
                    >
                      <Plus className="w-4 h-4" style={{ color: "var(--accent-main)" }} />
                      <span>나만의 루틴 만들기</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleOpenFreeSessionPage}
                      disabled={ctaDisabled}
                      className="w-full h-[64px] px-6 rounded-[1.25rem] transition-all active:scale-95 flex items-center justify-between gap-3 disabled:opacity-40"
                      style={{
                        backgroundColor: "var(--accent-main)",
                        color: "var(--accent-text)",
                        boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
                      }}
                    >
                      <div className="text-left min-w-0">
                        <p className="text-[16px] font-black truncate">자유 운동 시작하기</p>
                        <p className="text-[11px] font-bold opacity-80 truncate">
                          시작 후 세트 기록 화면으로 전환
                        </p>
                      </div>
                      <div className="w-[34px] h-[34px] rounded-full flex items-center justify-center bg-black/15 shrink-0">
                        <PlayCircle className="w-4 h-4" />
                      </div>
                    </button>
                  </div>
                )}
              </>
            )}

            {showSessionPage && (
              <div
                className="rounded-[1.25rem] px-4 py-3 border"
                style={{
                  backgroundColor: "var(--accent-bg)",
                  borderColor: "var(--accent-main)",
                }}
              >
                <p className="text-[11px] font-bold tracking-wide" style={{ color: "var(--accent-main)" }}>
                  {showRecommendedSessionPage ? "RECOMMENDED SESSION" : "FREE SESSION"}
                </p>
                <p className="text-[15px] font-bold mt-1" style={{ color: "var(--text-main)" }}>
                  {showRecommendedSessionPage ? "AI 추천 세션 페이지" : "자유 운동 세션 페이지"}
                </p>
                <p className="text-[11px] mt-0.5" style={{ color: "var(--text-sub)" }}>
                  아래에서 세트/유산소를 바로 기록하세요.
                </p>
              </div>
            )}

            {showSessionPage && isReady && !log.isWorkoutReady && (
              <div
                className="rounded-xl px-4 py-3 border"
                style={{
                  backgroundColor: "var(--bg-card)",
                  borderColor: "var(--border-light)",
                }}
              >
                <p className="text-[12px] font-semibold" style={{ color: "var(--text-main)" }}>
                  운동 시작 조건
                </p>
                <p className="text-[11px] mt-1" style={{ color: "var(--text-sub)" }}>
                  운동 종목을 추가하고, 각 종목에 KG와 횟수를 1세트 이상 입력하면 시작 버튼이 활성화됩니다.
                </p>
              </div>
            )}

            <AnimatePresence mode="wait">
              {(mode === "free" || mode === "recommended") &&
                (isInProgress || showSessionPage) && (
                <motion.section key="time-cond" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="grid grid-cols-2 gap-3">
                  <TimeSelectCard value={log.estMinutes} onChange={log.setEstMinutes} />
                  <ConditionSelectCard value={log.condition} onChange={log.setCondition} />
                </motion.section>
              )}
            </AnimatePresence>

            {(mode === "free" || mode === "recommended") &&
              (isInProgress || showSessionPage) &&
              !has1RM && (
              <div className="rounded-xl px-4 py-3 border flex items-start gap-3" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-light)" }}>
                <Dumbbell className="w-4 h-4 mt-1" style={{ color: "var(--accent-main)" }} />
                <div>
                  <p className="text-[12px]" style={{ color: "var(--text-main)" }}>
                    레벨 탭에서 3대 운동 1RM을 설정하면 권장 무게가 자동으로 채워져요.
                  </p>
                  <button type="button" onClick={() => { setTab("level"); setOpenStrengthSetup(true); }} className="mt-1 text-[11px] font-semibold" style={{ color: "var(--accent-main)" }}>
                    레벨 탭에서 설정하기 →
                  </button>
                </div>
              </div>
            )}

            {mode === "recommended" && recommendationReason && !showRecommendedSessionPage && (
              <div className="rounded-2xl px-4 py-3 border" style={{ backgroundColor: "var(--accent-bg)", borderColor: "var(--border-light)", color: "var(--accent-main)" }}>
                <p className="text-[12px]"><Sparkles className="inline w-3.5 h-3.5 mr-1 -mt-0.5" />{recommendationReason}</p>
              </div>
            )}

            {!isPtMode && showFreeModeDetails && (
              <FreeArea
                freeExercises={log.freeExercises}
                orderedIds={log.orderedIds}
                cardioEntries={log.cardioEntries}
                isWorkoutActive={isInProgress}
                onUpdateCardio={log.updateCardio}
                onRemoveCardio={log.removeCardio}
                prData={log.prData}
                selectedFavNames={log.selectedFavNames}
                onToggleFav={log.toggleFav}
                onToggleCardio={log.toggleCardio}
                onAddSet={(id) => log.addFreeSet(id)}
                onDeleteSet={log.delFreeSet}
                onSetChange={log.onFSetChange}
                onSetStatusChange={log.setSetStatus}
                onRemove={log.removeFreeEx}
                onCheckPR={log.showPR}
                onToggleCardioCheck={log.toggleCardioCheck}
              />
            )}
          </div>
        </div>
      </div>

      {showBottomCta && (
        <div className="fixed left-0 right-0 w-full max-w-[480px] mx-auto z-30 px-4 flex items-center justify-center gap-3" style={{ bottom: "calc(72px + env(safe-area-inset-bottom, 0px) + 16px)" }}>
          {isInProgress && !isPtMode && (
            <div className="flex items-center gap-3 shrink-0 rounded-xl border px-4 py-2.5" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-light)" }}>
              <span className="font-bebas text-xl tracking-wider" style={{ color: "var(--accent-main)" }}>
                {String(Math.floor(log.elapsedSec / 60)).padStart(2, "0")}:{String(log.elapsedSec % 60).padStart(2, "0")}
              </span>
              <span className="text-neutral-500">|</span>
              <span className="font-bebas text-lg tracking-wider" style={{ color: "var(--text-main)" }}>목표 {log.estMinutes}분</span>
            </div>
          )}
          <button
            type="button"
            onClick={handleButtonClick}
            disabled={ctaDisabled}
            className={`h-[64px] px-6 rounded-[1.25rem] transition-all active:scale-95 flex items-center justify-between gap-3 disabled:opacity-40 ${isInProgress && !isPtMode ? "flex-1 min-w-0" : "w-full max-w-[calc(480px-2rem)]"}`}
            style={{ backgroundColor: "var(--accent-main)", color: "var(--accent-text)", boxShadow: "0 8px 20px rgba(0,0,0,0.25)" }}
          >
            <div className="text-left min-w-0">
              <p className="text-[16px] font-black truncate">{ctaTitle}</p>
              <p className="text-[11px] font-bold opacity-80 truncate">{ctaDesc}</p>
            </div>
            <div className="w-[34px] h-[34px] rounded-full flex items-center justify-center bg-black/15 shrink-0">
              {isPtMode ? <UserCheck className="w-4 h-4" /> : isReady ? <PlayCircle className="w-4 h-4" /> : <Dumbbell className="w-4 h-4" />}
            </div>
          </button>
        </div>
      )}

      <AnimatePresence>
        {routineBuilderOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-end justify-center"
            style={{ backgroundColor: "rgba(0,0,0,0.62)" }}
            onClick={closeRoutineBuilder}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 280 }}
              className="w-full max-w-[480px] rounded-t-2xl border max-h-[82vh] flex flex-col"
              style={{
                backgroundColor: "var(--bg-card)",
                borderColor: "var(--border-light)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="px-4 py-4 border-b flex items-center justify-between"
                style={{ borderColor: "var(--border-light)" }}
              >
                <p className="text-[15px] font-bold" style={{ color: "var(--text-main)" }}>
                  {isRoutineEditMode ? "루틴 수정하기" : "나만의 루틴 만들기"}
                </p>
                <button
                  type="button"
                  onClick={closeRoutineBuilder}
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ color: "var(--text-sub)" }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div>
                  <p className="text-[11px] mb-1.5" style={{ color: "var(--text-sub)" }}>
                    루틴 이름
                  </p>
                  <input
                    value={routineNameInput}
                    onChange={(e) => setRoutineNameInput(e.target.value)}
                    placeholder="예: 등/이두 집중 루틴"
                    maxLength={24}
                    className="w-full h-11 px-3 rounded-xl border text-[13px] outline-none"
                    style={{
                      backgroundColor: "var(--bg-body)",
                      borderColor: "var(--border-light)",
                      color: "var(--text-main)",
                    }}
                  />
                </div>

                {ROUTINE_STRENGTH_CATEGORIES.map((category) => {
                  const items = strengthExercisesForRoutine.filter(
                    (ex) => ex.category === category,
                  );
                  if (items.length === 0) return null;
                  return (
                    <div key={category}>
                      <p
                        className="text-[11px] font-bold mb-2 tracking-wide"
                        style={{ color: "var(--text-sub)" }}
                      >
                        {category}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {items.map((ex) => {
                          const active = routineSelectedNames.has(ex.name);
                          return (
                            <button
                              key={ex.id}
                              type="button"
                              onClick={() => handleToggleRoutineExercise(ex.name)}
                              className="px-3 py-2 rounded-xl border text-[12px] font-semibold flex items-center gap-1.5 transition-colors"
                              style={
                                active
                                  ? {
                                      borderColor: "var(--accent-main)",
                                      backgroundColor: "var(--accent-bg)",
                                      color: "var(--accent-main)",
                                    }
                                  : {
                                      borderColor: "var(--border-light)",
                                      backgroundColor: "var(--bg-body)",
                                      color: "var(--text-main)",
                                    }
                              }
                            >
                              <span>{ex.icon}</span>
                              <span>{ex.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div
                className="p-4 border-t"
                style={{ borderColor: "var(--border-light)" }}
              >
                <button
                  type="button"
                  onClick={handleSaveRoutine}
                  className="w-full h-12 rounded-xl font-bold text-[14px] transition-all disabled:opacity-40"
                  disabled={
                    routineNameInput.trim().length === 0 ||
                    routineSelectedNames.size === 0
                  }
                  style={{
                    backgroundColor: "var(--accent-main)",
                    color: "var(--accent-text)",
                  }}
                >
                  {isRoutineEditMode ? "루틴 수정 저장" : "루틴 저장하기"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <NeedStrengthModal open={showNeedStrengthModal} onClose={() => setShowNeedStrengthModal(false)} onGoToHome={handleGoToStrengthSetup} />

      <AnimatePresence mode="wait" onExitComplete={exitWorkout}>
        {log.workoutPhase === "completed" && !overlayExiting && (
          <motion.div
            key="workout-complete-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-sm"
            style={{ backgroundColor: "rgba(0,0,0,0.85)" }}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
              className="text-center px-8"
              onAnimationComplete={handleOverlayEnterComplete}
            >
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.4 }} className="font-bebas text-5xl md:text-6xl tracking-wider" style={{ color: "var(--accent-main)" }}>
                오운완 ✨
              </motion.div>
              <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35, duration: 0.4 }} className="mt-3 text-lg" style={{ color: "var(--text-sub)" }}>
                오늘도 해냈다
              </motion.p>
              <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.45, duration: 0.4 }} className="mt-2 text-sm font-mono" style={{ color: "var(--text-sub)" }}>
                ⏱ {log.formatElapsed(log.completedElapsedSec)}
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
