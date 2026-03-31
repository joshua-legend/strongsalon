"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Dumbbell,
  FolderOpen,
  ListChecks,
  PencilLine,
  PlayCircle,
  Plus,
  RotateCcw,
  Sparkles,
  Trash2,
  UserCheck,
  X,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useGoal } from "@/context/GoalContext";
import { useUser } from "@/context/UserContext";
import { useWorkoutRecords } from "@/context/WorkoutRecordContext";
import { useToast } from "@/components/ui/Toast";
import type { WorkoutCondition } from "@/types";
import {
  getMockRecommendation,
  type RecommendationResponse,
} from "@/data/workoutRecommendation";
import { exercisesInfo, getExerciseCategory } from "@/data/exercises-info";
import { workoutHistory } from "@/data/workoutHistory";
import { getMonthGrid } from "@/utils/calendar";
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

const PT_TEST_TOTAL_SESSIONS = 20;
const PT_TEST_REMAINING_SESSIONS = 8;
const PT_FOCUS_ROTATION = [
  { title: "가슴운동", detail: "벤치프레스 중심으로" },
  { title: "등운동", detail: "풀업 중심으로" },
  { title: "하체운동", detail: "스쿼트 중심으로" },
  { title: "어깨운동", detail: "오버헤드프레스 중심으로" },
] as const;
const PT_SCHEDULE_TIME_SLOTS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
] as const;
const PT_CALENDAR_WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"] as const;
type PtApprovalStatus = "approved" | "pending";

function todayIsoDate() {
  return new Date().toISOString().split("T")[0];
}

function toIsoDate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatKoreanDateTime(date: Date) {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const ampm = hour < 12 ? "오전" : "오후";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  const timeText =
    minute === 0
      ? `${ampm} ${hour12}시`
      : `${ampm} ${hour12}:${String(minute).padStart(2, "0")}`;
  return `${month}월 ${day}일 ${timeText}`;
}

function formatKoreanDateOnly(date: Date) {
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

function formatKoreanTimeSlot(time: string) {
  const [hh, mm] = time.split(":").map(Number);
  if (Number.isNaN(hh) || Number.isNaN(mm)) return time;
  const ampm = hh < 12 ? "오전" : "오후";
  const hour12 = hh % 12 === 0 ? 12 : hh % 12;
  return `${ampm} ${hour12}:${String(mm).padStart(2, "0")}`;
}

function toStartOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isWeekendDate(date: Date) {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function getNextAvailablePtDate(baseDate: Date) {
  const today = toStartOfDay(new Date());
  const candidate = toStartOfDay(baseDate.getTime() < today.getTime() ? today : baseDate);
  while (isWeekendDate(candidate)) {
    candidate.setDate(candidate.getDate() + 1);
  }
  return candidate;
}

function parseDateKey(dateKey: string): Date | null {
  const [y, m, d] = dateKey.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function parsePtStartAt(dateText?: string | null, timeText?: string | null): Date | null {
  if (!dateText) return null;
  const [y, m, d] = dateText.split("-").map(Number);
  if (!y || !m || !d) return null;

  let hour = 0;
  let minute = 0;

  if (timeText) {
    const hhmm = timeText.match(/^(\d{1,2}):(\d{2})$/);
    if (hhmm) {
      hour = Number(hhmm[1]);
      minute = Number(hhmm[2]);
    } else {
      const kor = timeText.match(/(오전|오후)\s*(\d{1,2})(?:[:시]\s*(\d{1,2}))?/);
      if (kor) {
        hour = Number(kor[2]) % 12;
        minute = Number(kor[3] ?? 0);
        if (kor[1] === "오후") hour += 12;
      }
    }
  }

  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
  return new Date(y, m - 1, d, hour, minute, 0, 0);
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
  const { user } = useUser();
  const { getUserWorkoutRecords } = useWorkoutRecords();
  const [overlayExiting, setOverlayExiting] = useState(false);
  const [mode, setMode] = useState<WorkoutTabMode>("free");
  const [freeSessionPageOpen, setFreeSessionPageOpen] = useState(false);
  const [recommendedSessionPageOpen, setRecommendedSessionPageOpen] = useState(false);
  const [showNeedStrengthModal, setShowNeedStrengthModal] = useState(false);
  const [recommendationReason, setRecommendationReason] = useState<string | null>(null);
  const [ptTestMembershipEnabled, setPtTestMembershipEnabled] = useState(false);
  const [ptTestScheduledAtMs, setPtTestScheduledAtMs] = useState<number | null>(null);
  const [ptSchedulePageOpen, setPtSchedulePageOpen] = useState(false);
  const [ptScheduleDate, setPtScheduleDate] = useState<string>(todayIsoDate);
  const [ptScheduleTime, setPtScheduleTime] = useState<string | null>(null);
  const [ptCalendarYear, setPtCalendarYear] = useState(() => new Date().getFullYear());
  const [ptCalendarMonth, setPtCalendarMonth] = useState(() => new Date().getMonth());
  const [ptRequestedScheduleAtMs, setPtRequestedScheduleAtMs] = useState<number | null>(null);
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
  const aiTotalSetCount = previewRecommendation.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
  const aiTodayLabel = useMemo(() => {
    const date = parseDateKey(previewRecommendation.date);
    return date ? formatKoreanDateOnly(date) : "오늘";
  }, [previewRecommendation.date]);
  const aiCategorySummary = useMemo(() => {
    const countByCategory = new Map<string, number>();
    previewRecommendation.exercises.forEach((exercise) => {
      const category = getExerciseCategory(exercise.name);
      const normalized = category === "기타" ? "전신" : category;
      countByCategory.set(normalized, (countByCategory.get(normalized) ?? 0) + 1);
    });
    return Array.from(countByCategory.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);
  }, [previewRecommendation.exercises]);
  const aiMainCategory = aiCategorySummary[0]?.category ?? "전신";
  const strengthExercisesForRoutine = useMemo(
    () => exercisesInfo.filter((ex) => ex.category !== "유산소"),
    [],
  );
  const customRoutineOptions: FreeQuickOption[] = useMemo(
    () => customRoutines.map((routine) => customRoutineToOption(routine)),
    [customRoutines],
  );
  const userPtRemainingSessions = user?.remainingSessions ?? 0;
  const userPtTotalSessions = user?.totalSessions ?? 0;
  const userHasPtMembership = userPtTotalSessions > 0 && userPtRemainingSessions > 0;
  const hasPtMembership = userHasPtMembership || ptTestMembershipEnabled;
  const ptRemainingSessions = userHasPtMembership
    ? userPtRemainingSessions
    : ptTestMembershipEnabled
      ? PT_TEST_REMAINING_SESSIONS
      : 0;
  const ptTotalSessions = userHasPtMembership
    ? userPtTotalSessions
    : ptTestMembershipEnabled
      ? PT_TEST_TOTAL_SESSIONS
      : 0;
  const userPtStartAt = useMemo(
    () => parsePtStartAt(user?.nextPtDate ?? null, user?.nextPtTime ?? null),
    [user?.nextPtDate, user?.nextPtTime],
  );
  const ptStartAt = useMemo(() => {
    if (ptRequestedScheduleAtMs !== null) return new Date(ptRequestedScheduleAtMs);
    if (userPtStartAt) return userPtStartAt;
    if (ptTestScheduledAtMs !== null) return new Date(ptTestScheduledAtMs);
    return null;
  }, [ptRequestedScheduleAtMs, userPtStartAt, ptTestScheduledAtMs]);
  const ptCompletedSessions = hasPtMembership
    ? Math.max(0, ptTotalSessions - ptRemainingSessions)
    : 0;
  const ptNextRound = hasPtMembership ? ptCompletedSessions + 1 : 1;
  const ptUpcomingPlan = useMemo(() => {
    if (!hasPtMembership || !ptStartAt) return [];
    const count = Math.max(1, Math.min(ptRemainingSessions, 4));
    return Array.from({ length: count }, (_, idx) => {
      const round = ptNextRound + idx;
      const date = new Date(ptStartAt);
      date.setDate(date.getDate() + idx * 7);
      const focus = PT_FOCUS_ROTATION[(round - 1) % PT_FOCUS_ROTATION.length];
      const approvalStatus: PtApprovalStatus =
        idx === 0 && ptRequestedScheduleAtMs !== null
          ? "pending"
          : idx % 2 === 0
            ? "approved"
            : "pending";
      return {
        id: `pt-upcoming-${round}`,
        round,
        schedule: formatKoreanDateTime(date),
        focus: `${focus.title}(${focus.detail})`,
        approvalStatus,
      };
    });
  }, [
    hasPtMembership,
    ptStartAt,
    ptRemainingSessions,
    ptNextRound,
    ptRequestedScheduleAtMs,
  ]);
  const ptFeaturedUpcoming = ptUpcomingPlan[0] ?? null;
  const ptFutureUpcoming = ptUpcomingPlan.slice(1);
  const ptPastHistory = useMemo(() => {
    if (!hasPtMembership) return [];
    const merged = [...getUserWorkoutRecords(), ...workoutHistory]
      .filter((record) => record.type === "pt")
      .sort((a, b) => b.date.localeCompare(a.date));
    const usedDates = new Set<string>();
    const deduped = merged.filter((record) => {
      if (usedDates.has(record.date)) return false;
      usedDates.add(record.date);
      return true;
    });
    return deduped.slice(0, 4).map((record, idx) => {
      const focus = record.exercises[0]?.name ?? "기본 루틴";
      const category = getExerciseCategory(focus);
      const categoryLabel =
        category === "유산소"
          ? "유산소"
          : category === "기타"
            ? "기본"
            : `${category}운동`;
      const date = parseDateKey(record.date);
      const round = Math.max(1, ptNextRound - (idx + 1));
      return {
        id: `${record.date}-${idx}`,
        round,
        dateLabel: date ? formatKoreanDateOnly(date) : record.date,
        summary: `${categoryLabel}(${focus} 중심으로)`,
      };
    });
  }, [getUserWorkoutRecords, hasPtMembership, ptNextRound]);

  const isReady = log.workoutPhase === "ready";
  const isInProgress = log.workoutPhase === "inProgress";
  const isPtMode = mode === "pt";
  const showFreeSessionPage = mode === "free" && freeSessionPageOpen;
  const showRecommendedSessionPage =
    mode === "recommended" && recommendedSessionPageOpen;
  const showSessionPage = showFreeSessionPage || showRecommendedSessionPage;
  const showPtSchedulePage = isPtMode && ptSchedulePageOpen;
  const showFreeModeDetails =
    !isPtMode && (mode === "free" || mode === "recommended") && showSessionPage;
  const showInlineFreeReadyActions = mode === "free" && isReady && !showSessionPage;
  const showBottomCta = isPtMode || showSessionPage || !showInlineFreeReadyActions;
  const showSessionReadyStartCta = showSessionPage && isReady;
  const isRoutineEditMode = routineEditingId !== null;
  const ptScheduleDateLabel = useMemo(() => {
    const parsed = parseDateKey(ptScheduleDate);
    return parsed ? formatKoreanDateOnly(parsed) : ptScheduleDate;
  }, [ptScheduleDate]);
  const ptCalendarGrid = useMemo(
    () => getMonthGrid(ptCalendarYear, ptCalendarMonth),
    [ptCalendarYear, ptCalendarMonth],
  );
  const ptCalendarTitle = `${ptCalendarYear}. ${String(ptCalendarMonth + 1).padStart(2, "0")}`;
  const canGoPrevPtCalendarMonth = useMemo(() => {
    const now = new Date();
    const visible = new Date(ptCalendarYear, ptCalendarMonth, 1);
    const current = new Date(now.getFullYear(), now.getMonth(), 1);
    return visible.getTime() > current.getTime();
  }, [ptCalendarYear, ptCalendarMonth]);

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
    if (nextMode !== "pt") {
      setPtSchedulePageOpen(false);
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
      if (!hasPtMembership) {
        showToast("회원권 활성화 후 PT 스케줄 조정을 진행할 수 있어요.");
        return;
      }
      if (!ptSchedulePageOpen) {
        const baseDate = ptStartAt ? new Date(ptStartAt) : new Date();
        const initialDate = getNextAvailablePtDate(baseDate);
        const slot = `${String(baseDate.getHours()).padStart(2, "0")}:00`;
        setPtScheduleDate(toIsoDate(initialDate));
        setPtCalendarYear(initialDate.getFullYear());
        setPtCalendarMonth(initialDate.getMonth());
        setPtScheduleTime(
          PT_SCHEDULE_TIME_SLOTS.includes(slot as (typeof PT_SCHEDULE_TIME_SLOTS)[number])
            ? slot
            : "19:00",
        );
        setPtSchedulePageOpen(true);
        return;
      }
      if (!ptScheduleDate || !ptScheduleTime) {
        showToast("날짜와 시간대를 선택하면 요청을 보낼 수 있어요.");
        return;
      }
      const selectedDate = parseDateKey(ptScheduleDate);
      if (!selectedDate) {
        showToast("요청 날짜 형식이 올바르지 않아요.");
        return;
      }
      if (isWeekendDate(selectedDate)) {
        showToast("PT는 주중(월~금) 일정만 요청할 수 있어요.");
        return;
      }
      const [hours, minutes] = ptScheduleTime.split(":").map(Number);
      const requestedAt = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        hours,
        minutes,
        0,
        0,
      );
      setPtRequestedScheduleAtMs(requestedAt.getTime());
      setPtSchedulePageOpen(false);
      showToast(
        `${ptScheduleDateLabel} ${formatKoreanTimeSlot(ptScheduleTime)} 일정으로 조정 요청을 보냈어요.`,
      );
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

  const handleBackFromSessionPage = () => {
    if (!showSessionPage) return;
    if (isInProgress) {
      showToast("운동 진행 중에는 세션 페이지를 닫을 수 없어요.");
      return;
    }
    setFreeSessionPageOpen(false);
    setRecommendedSessionPageOpen(false);
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

  const handleEnablePtMembershipTest = () => {
    if (hasPtMembership) return;
    setPtTestMembershipEnabled(true);
    setPtTestScheduledAtMs(Date.now() + 45 * 60 * 1000);
    showToast("테스트용 PT 회원권을 활성화했어요.");
  };

  const handleBackFromPtSchedulePage = () => {
    if (!showPtSchedulePage) return;
    setPtSchedulePageOpen(false);
  };

  const handleShiftPtCalendarMonth = (offset: number) => {
    const next = new Date(ptCalendarYear, ptCalendarMonth + offset, 1);
    setPtCalendarYear(next.getFullYear());
    setPtCalendarMonth(next.getMonth());
  };

  const handleSelectPtCalendarDay = (day: number) => {
    const selected = new Date(ptCalendarYear, ptCalendarMonth, day);
    const today = toStartOfDay(new Date());
    if (selected.getTime() < today.getTime()) return;
    if (isWeekendDate(selected)) return;
    setPtScheduleDate(toIsoDate(selected));
  };

  const ctaDisabled = isPtMode
    ? !hasPtMembership || (showPtSchedulePage && (!ptScheduleDate || !ptScheduleTime))
    : (isReady && showSessionPage && !log.isWorkoutReady) ||
      (isInProgress && !(log.allSetsChecked && log.allCardioChecked));

  const ctaTitle = isPtMode
    ? showPtSchedulePage
      ? "스케줄 요청 보내기"
      : "PT 스케줄 조정하기"
    : showSessionReadyStartCta
      ? "운동 시작"
    : isInProgress
      ? "운동 종료 및 기록 저장"
      : mode === "recommended"
        ? "AI 추천 루틴 시작하기"
        : "자유 운동 시작하기";

  const ctaDesc = isPtMode
    ? !hasPtMembership
      ? "회원권 활성화 후 스케줄 조정 가능"
      : showPtSchedulePage
        ? ptScheduleTime
          ? `${ptScheduleDateLabel} ${formatKoreanTimeSlot(ptScheduleTime)} 요청 전송`
          : "희망 시간대를 선택해 주세요"
        : "새로운 날짜와 시간을 골라 트레이너에게 요청해요"
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

            {!(showSessionPage || showPtSchedulePage) && (
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
                        <div
                          className="rounded-xl border p-3 mb-3"
                          style={{
                            borderColor: "var(--accent-main)",
                            backgroundColor: "var(--accent-bg)",
                          }}
                        >
                          <p
                            className="text-[10px] font-bold tracking-widest uppercase"
                            style={{ color: "var(--accent-main)" }}
                          >
                            Today&apos;s AI Workout
                          </p>
                          <p
                            className="text-[15px] font-black mt-1"
                            style={{ color: "var(--text-main)" }}
                          >
                            {aiTodayLabel} {aiMainCategory} 중심 루틴
                          </p>
                          <p
                            className="text-[11px] mt-1"
                            style={{ color: "var(--text-sub)" }}
                          >
                            오늘은 {previewRecommendation.exercises.length}종목 · {aiTotalSetCount}세트 · 약 {previewRecommendation.estMinutes ?? 45}분 루틴으로 진행해요.
                          </p>
                          <div className="flex gap-1.5 overflow-x-auto pb-0.5 mt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                            {previewRecommendation.exercises.map((exercise) => (
                              <span
                                key={`ai-chip-${exercise.name}`}
                                className="shrink-0 px-2 py-1 rounded-full text-[10px] font-semibold border"
                                style={{
                                  borderColor: "var(--border-light)",
                                  backgroundColor: "var(--bg-card)",
                                  color: "var(--text-main)",
                                }}
                              >
                                {exercise.icon} {exercise.name}
                              </span>
                            ))}
                          </div>
                        </div>
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
                          {previewRecommendation.exercises.map((ex, idx) => (
                            <div key={ex.name} className="flex items-center justify-between">
                              <span className="text-[13px] font-bold" style={{ color: "var(--text-main)" }}>{idx + 1}. {ex.icon} {ex.name}</span>
                              <span className="text-[11px] font-mono" style={{ color: "var(--text-sub)" }}>{ex.sets.length} Set</span>
                            </div>
                          ))}
                          {aiCategorySummary.length > 0 && (
                            <div className="pt-1 flex items-center gap-1.5 flex-wrap">
                              {aiCategorySummary.map((item) => (
                                <span
                                  key={`ai-category-${item.category}`}
                                  className="px-2 py-1 rounded-md text-[10px] font-semibold border"
                                  style={{
                                    borderColor: "var(--border-light)",
                                    color: "var(--text-sub)",
                                    backgroundColor: "var(--bg-body)",
                                  }}
                                >
                                  {item.category} {item.count}종목
                                </span>
                              ))}
                            </div>
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
                    <motion.div
                      key="pt"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="space-y-3"
                    >
                      {!hasPtMembership && (
                        <div
                          className="rounded-[1.25rem] p-5 border text-center"
                          style={{
                            backgroundColor: "var(--bg-card)",
                            borderColor: "var(--border-light)",
                          }}
                        >
                          <div
                            className="w-11 h-11 rounded-full border mx-auto mb-3 flex items-center justify-center"
                            style={{
                              borderColor: "var(--border-light)",
                              backgroundColor: "var(--bg-body)",
                              color: "var(--text-sub)",
                            }}
                          >
                            <UserCheck className="w-5 h-5" />
                          </div>
                          <p
                            className="text-[14px] font-bold"
                            style={{ color: "var(--text-main)" }}
                          >
                            활성 PT 회원권이 없어요
                          </p>
                          <p
                            className="text-[11px] mt-1 leading-relaxed"
                            style={{ color: "var(--text-sub)" }}
                          >
                            PT 회원권을 등록하면 이 화면에서 다음 일정과 히스토리를
                            바로 확인할 수 있어요.
                          </p>
                          <button
                            type="button"
                            onClick={handleEnablePtMembershipTest}
                            className="mt-4 h-10 px-4 rounded-xl text-[12px] font-bold border"
                            style={{
                              borderColor: "var(--accent-main)",
                              backgroundColor: "var(--accent-bg)",
                              color: "var(--accent-main)",
                            }}
                          >
                            테스트: 회원권 활성화
                          </button>
                        </div>
                      )}

                      {hasPtMembership && (
                        <div
                          className="rounded-[1.25rem] p-4 border space-y-3"
                          style={{
                            backgroundColor: "var(--bg-card)",
                            borderColor: "var(--border-light)",
                          }}
                        >
                          {ptFeaturedUpcoming ? (
                            <div
                              className="rounded-xl border p-4"
                              style={{
                                borderColor: "var(--accent-main)",
                                backgroundColor: "var(--accent-bg)",
                              }}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <p
                                    className="text-[10px] font-bold tracking-widest uppercase"
                                    style={{ color: "var(--accent-main)" }}
                                  >
                                    Next PT
                                  </p>
                                  <p
                                    className="text-[21px] leading-tight font-black mt-1"
                                    style={{ color: "var(--text-main)" }}
                                  >
                                    {ptFeaturedUpcoming.round}회차
                                  </p>
                                  <p
                                    className="text-[13px] font-semibold mt-1"
                                    style={{ color: "var(--text-main)" }}
                                  >
                                    {ptFeaturedUpcoming.schedule}
                                  </p>
                                  <p
                                    className="text-[11px] mt-1"
                                    style={{ color: "var(--text-sub)" }}
                                  >
                                    {ptFeaturedUpcoming.focus}
                                  </p>
                                  <div className="mt-2">
                                    <span
                                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md border text-[10px] font-bold"
                                      style={
                                        ptFeaturedUpcoming.approvalStatus === "approved"
                                          ? {
                                              borderColor: "var(--accent-main)",
                                              backgroundColor:
                                                "color-mix(in srgb, var(--accent-bg) 82%, var(--bg-card) 18%)",
                                              color: "var(--accent-main)",
                                            }
                                          : {
                                              borderColor: "#f59e0b",
                                              backgroundColor: "rgba(245,158,11,0.12)",
                                              color: "#f59e0b",
                                            }
                                      }
                                    >
                                      {ptFeaturedUpcoming.approvalStatus === "approved" ? (
                                        <UserCheck className="w-3 h-3" />
                                      ) : (
                                        <Clock3 className="w-3 h-3" />
                                      )}
                                      {ptFeaturedUpcoming.approvalStatus === "approved"
                                        ? "트레이너 승인 완료"
                                        : "트레이너 승인 대기"}
                                    </span>
                                  </div>
                                </div>
                                <span
                                  className="px-2.5 py-1 rounded-lg border text-[10px] font-mono shrink-0"
                                  style={{
                                    borderColor: "var(--border-light)",
                                    backgroundColor: "var(--bg-body)",
                                    color: "var(--text-sub)",
                                  }}
                                >
                                  {ptRemainingSessions}/{ptTotalSessions}회 남음
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div
                              className="rounded-xl border px-3 py-3"
                              style={{
                                borderColor: "var(--border-light)",
                                backgroundColor: "var(--bg-body)",
                              }}
                            >
                              <p
                                className="text-[12px] font-semibold"
                                style={{ color: "var(--text-main)" }}
                              >
                                Next PT 일정 등록 대기중
                              </p>
                            </div>
                          )}

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <Sparkles
                                  className="w-3.5 h-3.5"
                                  style={{ color: "var(--accent-main)" }}
                                />
                                <p
                                  className="text-[11px] font-bold"
                                  style={{ color: "var(--accent-main)" }}
                                >
                                  다가올 PT 일정
                                </p>
                              </div>
                              <span
                                className="text-[9px] px-2 py-0.5 rounded-full border font-semibold"
                                style={{
                                  borderColor: "var(--accent-main)",
                                  backgroundColor: "var(--accent-bg)",
                                  color: "var(--accent-main)",
                                }}
                              >
                                UPCOMING
                              </span>
                            </div>
                            <div className="flex items-center gap-2 -mt-0.5">
                              <span
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] font-semibold"
                                style={{
                                  borderColor: "var(--accent-main)",
                                  backgroundColor:
                                    "color-mix(in srgb, var(--accent-bg) 78%, var(--bg-card) 22%)",
                                  color: "var(--accent-main)",
                                }}
                              >
                                <UserCheck className="w-2.5 h-2.5" />
                                승인 완료
                              </span>
                              <span
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] font-semibold"
                                style={{
                                  borderColor: "#f59e0b",
                                  backgroundColor: "rgba(245,158,11,0.12)",
                                  color: "#f59e0b",
                                }}
                              >
                                <Clock3 className="w-2.5 h-2.5" />
                                승인 대기
                              </span>
                            </div>
                            {ptFutureUpcoming.length === 0 ? (
                              <p
                                className="text-[11px] px-0.5"
                                style={{ color: "var(--text-sub)" }}
                              >
                                현재 예약된 추가 PT 일정이 없어요.
                              </p>
                            ) : (
                              <div className="flex gap-2.5 overflow-x-auto pb-1.5 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                                {ptFutureUpcoming.map((row) => (
                                  <div
                                    key={row.id}
                                    className="min-w-[176px] shrink-0 rounded-[0.95rem] border px-3 py-2.5 snap-start"
                                    style={{
                                      borderColor:
                                        row.approvalStatus === "approved"
                                          ? "color-mix(in srgb, var(--accent-main) 58%, var(--border-light) 42%)"
                                          : "color-mix(in srgb, #f59e0b 62%, var(--border-light) 38%)",
                                      backgroundColor:
                                        row.approvalStatus === "approved"
                                          ? "color-mix(in srgb, var(--accent-bg) 76%, var(--bg-card) 24%)"
                                          : "color-mix(in srgb, rgba(245,158,11,0.16) 72%, var(--bg-card) 28%)",
                                    }}
                                  >
                                    <div className="flex items-center justify-between gap-2">
                                      <p
                                        className="text-[12px] font-black"
                                        style={{ color: "var(--text-main)" }}
                                      >
                                        {row.round}회차
                                      </p>
                                      <span
                                        className="px-1.5 py-0.5 rounded-md border text-[9px] font-bold shrink-0 inline-flex items-center gap-1"
                                        style={
                                          row.approvalStatus === "approved"
                                            ? {
                                                borderColor: "var(--accent-main)",
                                                color: "var(--accent-main)",
                                                backgroundColor:
                                                  "color-mix(in srgb, var(--accent-bg) 78%, var(--bg-card) 22%)",
                                              }
                                            : {
                                                borderColor: "#f59e0b",
                                                color: "#f59e0b",
                                                backgroundColor: "rgba(245,158,11,0.12)",
                                              }
                                        }
                                      >
                                        {row.approvalStatus === "approved" ? (
                                          <UserCheck className="w-2.5 h-2.5" />
                                        ) : (
                                          <Clock3 className="w-2.5 h-2.5" />
                                        )}
                                        {row.approvalStatus === "approved" ? "확정" : "대기"}
                                      </span>
                                    </div>
                                    <p
                                      className="text-[11px] mt-1"
                                      style={{ color: "var(--text-main)" }}
                                    >
                                      {row.schedule}
                                    </p>
                                    <p
                                      className="text-[10px] mt-1"
                                      style={{ color: "var(--text-sub)" }}
                                    >
                                      {row.focus}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          <div
                            className="space-y-2 pt-1"
                            style={{
                              borderTop: "1px solid var(--border-light)",
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <RotateCcw
                                  className="w-3.5 h-3.5"
                                  style={{ color: "var(--text-sub)" }}
                                />
                                <p
                                  className="text-[11px] font-bold"
                                  style={{ color: "var(--text-main)" }}
                                >
                                  지난 PT 기록
                                </p>
                              </div>
                              <span
                                className="text-[9px] px-2 py-0.5 rounded-full border font-semibold"
                                style={{
                                  borderColor: "var(--border-light)",
                                  backgroundColor: "var(--bg-body)",
                                  color: "var(--text-sub)",
                                }}
                              >
                                PAST
                              </span>
                            </div>
                            {ptPastHistory.length === 0 ? (
                              <p
                                className="text-[11px] px-0.5"
                                style={{ color: "var(--text-sub)" }}
                              >
                                지난 PT 기록이 아직 없어요.
                              </p>
                            ) : (
                              <div className="flex gap-2.5 overflow-x-auto pb-1.5 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                                {ptPastHistory.map((row) => (
                                  <div
                                    key={row.id}
                                    className="min-w-[176px] shrink-0 rounded-[0.95rem] border px-3 py-2.5 snap-start"
                                    style={{
                                      borderColor: "var(--border-light)",
                                      backgroundColor:
                                        "color-mix(in srgb, var(--bg-body) 86%, #000 14%)",
                                    }}
                                  >
                                    <p
                                      className="text-[12px] font-black"
                                      style={{ color: "var(--text-main)" }}
                                    >
                                      {row.round}회차
                                    </p>
                                    <p
                                      className="text-[11px] mt-1"
                                      style={{ color: "var(--text-main)" }}
                                    >
                                      {row.dateLabel}
                                    </p>
                                    <p
                                      className="text-[10px] mt-1"
                                      style={{ color: "var(--text-sub)" }}
                                    >
                                      {row.summary}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
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
              <div className="space-y-2">
                {!isInProgress && (
                  <button
                    type="button"
                    onClick={handleBackFromSessionPage}
                    className="w-full h-10 px-3 rounded-xl border flex items-center gap-1.5 text-[12px] font-semibold"
                    style={{
                      backgroundColor: "var(--bg-card)",
                      borderColor: "var(--accent-main)",
                      color: "var(--accent-main)",
                    }}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    이전으로 돌아가기
                  </button>
                )}
                <div
                  className="rounded-xl px-3 py-2.5 border flex items-center justify-between gap-3"
                  style={{
                    backgroundColor: "var(--bg-card)",
                    borderColor: "var(--border-light)",
                  }}
                >
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold tracking-wide" style={{ color: "var(--accent-main)" }}>
                      {showRecommendedSessionPage ? "AI 추천 세션" : "자유 세션"}
                    </p>
                    <p className="text-[12px] mt-0.5 truncate" style={{ color: "var(--text-sub)" }}>
                      세트/유산소 기록 화면
                    </p>
                  </div>
                  <span
                    className="text-[10px] px-2 py-1 rounded-md border shrink-0"
                    style={{
                      borderColor: "var(--border-light)",
                      backgroundColor: "var(--bg-body)",
                      color: "var(--text-sub)",
                    }}
                  >
                    READY
                  </span>
                </div>
              </div>
            )}

            {showPtSchedulePage && (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleBackFromPtSchedulePage}
                  className="w-full h-10 px-3 rounded-xl border flex items-center gap-1.5 text-[12px] font-semibold"
                  style={{
                    backgroundColor: "var(--bg-card)",
                    borderColor: "var(--accent-main)",
                    color: "var(--accent-main)",
                  }}
                >
                  <ChevronLeft className="w-4 h-4" />
                  PT 모드로 돌아가기
                </button>

                <div
                  className="rounded-[1.25rem] border p-4"
                  style={{
                    borderColor: "var(--accent-main)",
                    backgroundColor: "var(--accent-bg)",
                  }}
                >
                  <p
                    className="text-[10px] font-bold tracking-widest uppercase"
                    style={{ color: "var(--accent-main)" }}
                  >
                    PT Schedule Event
                  </p>
                  <p className="text-[16px] font-black mt-1" style={{ color: "var(--text-main)" }}>
                    PT 일정 조정 요청
                  </p>
                  <p className="text-[11px] mt-1" style={{ color: "var(--text-sub)" }}>
                    날짜와 시간대를 선택하면 트레이너에게 승인 요청이 전송됩니다.
                  </p>
                </div>

                <div
                  className="rounded-xl border p-4 space-y-2.5"
                  style={{
                    borderColor: "var(--border-light)",
                    backgroundColor: "var(--bg-card)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-[12px] font-semibold" style={{ color: "var(--text-main)" }}>
                      캘린더 날짜 선택
                    </p>
                    <span className="text-[10px] font-semibold" style={{ color: "var(--text-sub)" }}>
                      토/일 선택 불가
                    </span>
                  </div>
                  <div className="rounded-lg border p-2.5" style={{ borderColor: "var(--border-light)", backgroundColor: "var(--bg-body)" }}>
                    <div className="flex items-center justify-between mb-2">
                      <button
                        type="button"
                        onClick={() => handleShiftPtCalendarMonth(-1)}
                        disabled={!canGoPrevPtCalendarMonth}
                        className="h-7 w-7 rounded-md border flex items-center justify-center disabled:opacity-40"
                        style={{ borderColor: "var(--border-light)", color: "var(--text-sub)" }}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <p className="text-[12px] font-bold" style={{ color: "var(--text-main)" }}>
                        {ptCalendarTitle}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleShiftPtCalendarMonth(1)}
                        className="h-7 w-7 rounded-md border flex items-center justify-center"
                        style={{ borderColor: "var(--border-light)", color: "var(--text-sub)" }}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-7 gap-1 mb-1">
                      {PT_CALENDAR_WEEKDAYS.map((weekday) => (
                        <div
                          key={`pt-weekday-${weekday}`}
                          className="h-6 flex items-center justify-center text-[10px] font-semibold"
                          style={{ color: "var(--text-sub)" }}
                        >
                          {weekday}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {ptCalendarGrid.map((day, idx) => {
                        if (day === null) {
                          return <div key={`pt-empty-${idx}`} className="h-9" />;
                        }
                        const dateObj = new Date(ptCalendarYear, ptCalendarMonth, day);
                        const dateIso = toIsoDate(dateObj);
                        const isSelected = ptScheduleDate === dateIso;
                        const isWeekend = isWeekendDate(dateObj);
                        const todayStart = toStartOfDay(new Date());
                        const isPast = dateObj.getTime() < todayStart.getTime();
                        const isDisabled = isWeekend || isPast;
                        return (
                          <button
                            key={`pt-day-${idx}`}
                            type="button"
                            onClick={() => handleSelectPtCalendarDay(day)}
                            disabled={isDisabled}
                            className="h-9 rounded-md border text-[11px] font-semibold disabled:opacity-40"
                            style={
                              isSelected
                                ? {
                                    borderColor: "var(--accent-main)",
                                    backgroundColor: "var(--accent-bg)",
                                    color: "var(--accent-main)",
                                  }
                                : {
                                    borderColor: "transparent",
                                    backgroundColor: "transparent",
                                    color: isWeekend ? "var(--text-sub)" : "var(--text-main)",
                                  }
                            }
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <p className="text-[11px]" style={{ color: "var(--text-sub)" }}>
                    선택 날짜: {ptScheduleDateLabel}
                  </p>
                </div>

                <div
                  className="rounded-xl border p-4 space-y-2.5"
                  style={{
                    borderColor: "var(--border-light)",
                    backgroundColor: "var(--bg-card)",
                  }}
                >
                  <p className="text-[12px] font-semibold" style={{ color: "var(--text-main)" }}>
                    시간대 선택 (08:00 ~ 22:00)
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {PT_SCHEDULE_TIME_SLOTS.map((slot) => {
                      const active = ptScheduleTime === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setPtScheduleTime(slot)}
                          className="h-10 rounded-lg border text-[11px] font-semibold transition-colors"
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
                          {formatKoreanTimeSlot(slot)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div
                  className="rounded-xl border px-4 py-3"
                  style={{
                    borderColor: "var(--border-light)",
                    backgroundColor: "var(--bg-card)",
                  }}
                >
                  <p className="text-[11px] font-semibold" style={{ color: "var(--text-main)" }}>
                    요청 미리보기
                  </p>
                  <p className="text-[12px] mt-1" style={{ color: "var(--text-main)" }}>
                    {ptScheduleTime
                      ? `${ptScheduleDateLabel} ${formatKoreanTimeSlot(ptScheduleTime)}`
                      : `${ptScheduleDateLabel} 시간 미선택`}
                  </p>
                  <p className="text-[11px] mt-1" style={{ color: "var(--text-sub)" }}>
                    하단 버튼으로 요청을 보내면 승인 전까지 다가올 PT에 대기 상태로 표시됩니다.
                  </p>
                </div>
              </div>
            )}

            {showSessionPage && isReady && !log.isWorkoutReady && (
              <div
                className="rounded-lg px-3 py-2.5 border flex items-center justify-between gap-3"
                style={{
                  backgroundColor: "var(--bg-card)",
                  borderColor: "var(--border-light)",
                }}
              >
                <span className="text-[11px] font-semibold shrink-0" style={{ color: "var(--text-main)" }}>
                  시작 조건
                </span>
                <p className="text-[11px] text-right" style={{ color: "var(--text-sub)" }}>
                  종목 1개 + KG/횟수 1세트 입력
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
