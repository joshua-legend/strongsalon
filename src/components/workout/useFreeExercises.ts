"use client";

import { useState, useCallback, useRef } from "react";
import type {
  FreeExercise,
  SetRecord,
  SetStatus,
  WorkoutCondition,
} from "@/types";
import { useToast } from "@/components/ui/Toast";
import type { PresetExercise } from "@/data/workoutPresets";
import type { RecommendationResponse } from "@/data/workoutRecommendation";
import {
  getRatioForExercise,
  calcWeightFrom1RM,
  PURPOSE_SET_REPS,
  CONDITION_WEIGHT_RATIO,
  CONDITION_REPS,
  CONDITION_TARGET_MODIFIER,
  getSetCountFromTime,
  type PurposeId,
} from "@/data/workoutPresets";
import { estimate1RM, weightForTarget1RM } from "@/utils/estimate1RM";

function nextId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export interface AutoFillOptions {
  getLastRecord: (name: string) => { weight: number; reps: number } | null;
  getStrength1RM: () => { squat: number; bench: number; deadlift: number };
  /** 목표 1RM 상한 (추천 무게가 목표 초과 시 캡) */
  getStrengthGoalTarget?: (lift: "squat" | "bench" | "deadlift") => number | null;
  /** 컨디션·운동시간으로 무게/횟수/세트수 조절 (자유 모드) */
  condition?: WorkoutCondition;
  estMinutes?: number;
}

export function useFreeExercises(
  prData: Record<string, number>,
  showPR: (name: string, diff: number) => void,
  autoFillOptions?: AutoFillOptions,
) {
  const { showToast } = useToast();
  const [freeExercises, setFreeExercises] = useState<
    Record<string, FreeExercise>
  >({});
  const [exerciseOrder, setExerciseOrder] = useState<string[]>([]);
  const loadPresetCalledRef = useRef(false);

  const selectedFavNames = new Set(
    Object.values(freeExercises).map((e) => e.name),
  );
  const strengthComplete =
    Object.keys(freeExercises).length >= 1 &&
    Object.values(freeExercises).some((ex) =>
      ex.sets.some((s) => s.weight > 0 && s.reps > 0),
    );

  const getInitialWeightReps = useCallback(
    (name: string): { weight: number; reps: number } => {
      if (autoFillOptions) {
        const rm = autoFillOptions.getStrength1RM();
        const has1RM =
          (rm.squat ?? 0) + (rm.bench ?? 0) + (rm.deadlift ?? 0) > 0;
        const condition = autoFillOptions.condition ?? "좋음";
        const reps = CONDITION_REPS[condition];

        if (!has1RM) {
          return { weight: 0, reps };
        }
        const ratio = getRatioForExercise(name);
        const last = autoFillOptions.getLastRecord(name);
        let weight: number;
        let effectiveReps: number;

        // 목표(이상페이스) 기반: 보통=100%, 좋음=+2.5%, 최상=+5%
        const target = ratio && autoFillOptions.getStrengthGoalTarget?.(ratio.lift);
        if (ratio && target != null && target > 0) {
          const modifier = CONDITION_TARGET_MODIFIER[condition];
          const effectiveTarget = target * ratio.ratio * modifier;
          weight = Math.max(0, weightForTarget1RM(effectiveTarget, reps));
          effectiveReps = reps;
        } else if (ratio && (rm[ratio.lift] ?? 0) > 0) {
          // 목표 미설정 시 1RM 기반 폴백
          const oneRM = rm[ratio.lift] ?? 0;
          const effectiveRatio = Math.min(1, ratio.ratio * CONDITION_WEIGHT_RATIO[condition]);
          weight = calcWeightFrom1RM(oneRM, effectiveRatio);
          effectiveReps = reps;
        } else if (last) {
          weight = last.weight;
          effectiveReps = last.reps;
        } else {
          return { weight: 0, reps };
        }
        return { weight, reps: effectiveReps };
      }
      return { weight: 0, reps: 0 };
    },
    [autoFillOptions],
  );

  const getInitialSetCount = useCallback((): number => {
    const est = autoFillOptions?.estMinutes ?? 60;
    return getSetCountFromTime(est);
  }, [autoFillOptions?.estMinutes]);

  const toggleFav = useCallback(
    (icon: string, name: string) => {
      setFreeExercises((prev) => {
        const has = Object.values(prev).some((e) => e.name === name);
        if (has) {
          const id = Object.keys(prev).find((k) => prev[k].name === name);
          if (id) {
            setExerciseOrder((o) => o.filter((i) => i !== id));
            const next = { ...prev };
            delete next[id];
            return next;
          }
          return prev;
        }
        const id = nextId("fx");
        const { weight, reps } = getInitialWeightReps(name);
        const setCount = getInitialSetCount();
        const sets: SetRecord[] = Array.from({ length: setCount }, () => ({
          id: nextId("fs"),
          weight,
          reps,
          status: "pending" as const,
        }));
        setExerciseOrder((o) => [...o, id]);
        return { ...prev, [id]: { icon, name, sets } };
      });
    },
    [getInitialWeightReps, getInitialSetCount],
  );

  const addCustomEx = useCallback(
    (name: string) => {
      setFreeExercises((prev) => {
        if (Object.values(prev).some((e) => e.name === name)) return prev;
        const id = nextId("fx");
        const { weight, reps } = getInitialWeightReps(name);
        const setCount = getInitialSetCount();
        const sets: SetRecord[] = Array.from({ length: setCount }, () => ({
          id: nextId("fs"),
          weight,
          reps,
          status: "pending" as const,
        }));
        setExerciseOrder((o) => [...o, id]);
        return { ...prev, [id]: { icon: "💪", name, sets } };
      });
    },
    [getInitialWeightReps, getInitialSetCount],
  );

  const addFreeSet = useCallback(
    (exId: string, weight?: number, reps?: number) => {
      setFreeExercises((prev) => {
        const ex = prev[exId];
        if (!ex) return prev;
        let w = weight ?? 0;
        let r = reps ?? 0;
        if (ex.sets.length > 0 && w === 0 && r === 0) {
          const last = ex.sets[ex.sets.length - 1];
          w = last.weight;
          r = last.reps;
        }
        if (w === 0 && r === 0) {
          w = 5;
          r = 10;
        }
        const newSet: SetRecord = {
          id: nextId("fs"),
          weight: w,
          reps: r,
          status: "pending",
        };
        return { ...prev, [exId]: { ...ex, sets: [...ex.sets, newSet] } };
      });
    },
    [],
  );

  const copyLastFreeSet = useCallback((exId: string) => {
    setFreeExercises((prev) => {
      const ex = prev[exId];
      if (!ex || !ex.sets.length) return prev;
      const last = ex.sets[ex.sets.length - 1];
      return {
        ...prev,
        [exId]: {
          ...ex,
          sets: [
            ...ex.sets,
            {
              id: nextId("fs"),
              weight: last.weight,
              reps: last.reps,
              status: "pending",
            },
          ],
        },
      };
    });
  }, []);

  const delFreeSet = useCallback((exId: string, setId: string) => {
    setFreeExercises((prev) => {
      const ex = prev[exId];
      if (!ex) return prev;
      return {
        ...prev,
        [exId]: { ...ex, sets: ex.sets.filter((s) => s.id !== setId) },
      };
    });
  }, []);

  const onFSetChange = useCallback(
    (exId: string, setId: string, weight: number, reps: number) => {
      setFreeExercises((prev) => {
        const ex = prev[exId];
        if (!ex) return prev;
        const sets = ex.sets.map((s) =>
          s.id === setId ? { ...s, weight, reps } : s,
        );
        return { ...prev, [exId]: { ...ex, sets } };
      });
      setFreeExercises((prev) => {
        const ex = prev[exId];
        const pr = ex ? prData[ex.name] : undefined;
        if (pr != null && weight > pr) showPR(ex!.name, weight - pr);
        return prev;
      });
    },
    [prData, showPR],
  );

  const setSetStatus = useCallback(
    (exId: string, setId: string, status: SetStatus) => {
      setFreeExercises((prev) => {
        const ex = prev[exId];
        if (!ex) return prev;
        const sets = ex.sets.map((s) =>
          s.id === setId ? { ...s, status } : s,
        );
        return { ...prev, [exId]: { ...ex, sets } };
      });
    },
    [],
  );

  const removeFreeEx = useCallback((exId: string) => {
    setExerciseOrder((o) => o.filter((i) => i !== exId));
    setFreeExercises((prev) => {
      const next = { ...prev };
      delete next[exId];
      return next;
    });
  }, []);

  const copyPrevRecord = useCallback(() => {
    setFreeExercises((p) => {
      const benchId = Object.keys(p).find((k) => p[k].name === "벤치프레스");
      const id = benchId ?? nextId("fx");
      const ex = p[id] ?? { icon: "🏋️", name: "벤치프레스", sets: [] };
      const sets: SetRecord[] = [
        { id: nextId("fs"), weight: 60, reps: 12, status: "pending" },
        { id: nextId("fs"), weight: 80, reps: 8, status: "pending" },
        { id: nextId("fs"), weight: 95, reps: 5, status: "pending" },
        { id: nextId("fs"), weight: 100, reps: 3, status: "pending" },
      ];
      if (!benchId) setExerciseOrder((o) => [...o, id]);
      return { ...p, [id]: { ...ex, sets } };
    });
    showToast("📋 이전 기록 복사 완료!");
  }, [showToast]);

  const resetExercises = useCallback(() => {
    setFreeExercises({});
    setExerciseOrder([]);
    loadPresetCalledRef.current = false;
  }, []);

  const loadPreset = useCallback(
    (
      exercises: PresetExercise[],
      strength1RM: { squat: number; bench: number; deadlift: number },
      purpose: PurposeId = "hypertrophy",
      condition: WorkoutCondition = "좋음",
      estMinutes: number = 60,
      getStrengthGoalTarget?: (lift: "squat" | "bench" | "deadlift") => number | null,
    ) => {
      const plan = PURPOSE_SET_REPS[purpose];
      const setCount = getSetCountFromTime(estMinutes);
      const reps = CONDITION_REPS[condition];
      const slicedPlan = plan.slice(0, setCount);
      const result: Record<string, FreeExercise> = {};
      const order: string[] = [];
      for (const ex of exercises) {
        const id = nextId("fx");
        order.push(id);
        const ratio = getRatioForExercise(ex.name);
        const target = ratio && getStrengthGoalTarget?.(ratio.lift);
        let baseWeight = 0;
        if (ratio && target != null && target > 0) {
          const modifier = CONDITION_TARGET_MODIFIER[condition];
          const effectiveTarget = target * ratio.ratio * modifier;
          baseWeight = Math.max(0, weightForTarget1RM(effectiveTarget, reps));
        } else if (ratio && (strength1RM[ratio.lift] ?? 0) > 0) {
          const oneRM = strength1RM[ratio.lift] ?? 0;
          const effectiveRatio = Math.min(1, ratio.ratio * CONDITION_WEIGHT_RATIO[condition]);
          baseWeight = calcWeightFrom1RM(oneRM, effectiveRatio);
        }
        const sets: SetRecord[] = slicedPlan.map(() => ({
          id: nextId("fs"),
          weight: baseWeight,
          reps,
          status: "pending" as const,
        }));
        result[id] = { icon: ex.icon, name: ex.name, sets };
      }
      setFreeExercises(result);
      setExerciseOrder(order);
      loadPresetCalledRef.current = true;
    },
    [],
  );

  const loadFromRecommendation = useCallback((rec: RecommendationResponse) => {
    const result: Record<string, FreeExercise> = {};
    const order: string[] = [];
    for (const ex of rec.exercises) {
      const id = nextId("fx");
      order.push(id);
      const sets: SetRecord[] = ex.sets.map((s) => ({
        id: nextId("fs"),
        weight: s.weight,
        reps: s.reps,
        status: "pending" as const,
      }));
      result[id] = { icon: ex.icon, name: ex.name, sets };
    }
    setFreeExercises(result);
    setExerciseOrder(order);
    loadPresetCalledRef.current = true;
  }, []);

  const orderedIds = exerciseOrder.filter((id) => id in freeExercises);

  const allSetsChecked =
    orderedIds.length > 0 &&
    orderedIds.every((id) => {
      const ex = freeExercises[id];
      return (
        ex &&
        ex.sets.length > 0 &&
        ex.sets.every((s) => s.status === "clear" || s.status === "fail")
      );
    });

  return {
    freeExercises,
    orderedIds,
    selectedFavNames,
    strengthComplete,
    toggleFav,
    addCustomEx,
    addFreeSet,
    copyLastFreeSet,
    delFreeSet,
    onFSetChange,
    setSetStatus,
    removeFreeEx,
    copyPrevRecord,
    resetExercises,
    loadPreset,
    loadFromRecommendation,
    allSetsChecked,
  };
}
