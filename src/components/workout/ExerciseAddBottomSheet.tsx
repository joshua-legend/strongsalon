"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PencilLine, Plus, Search, Trash2, X } from "lucide-react";
import { exercisesInfo } from "@/data/exercises-info";
import { EXERCISE_GROUPS } from "@/data/workout";
import type { CardioType } from "@/types";

const STRENGTH_CATEGORIES = ["가슴", "하체", "등", "어깨", "팔", "코어"] as const;
const FILTER_OPTIONS = ["전체", ...STRENGTH_CATEGORIES, "유산소"] as const;
const CUSTOM_EXERCISE_CATEGORIES = [...STRENGTH_CATEGORIES, "유산소"] as const;
type ExerciseFilter = (typeof FILTER_OPTIONS)[number];
type StrengthCategory = (typeof STRENGTH_CATEGORIES)[number];
type CustomExerciseCategory = (typeof CUSTOM_EXERCISE_CATEGORIES)[number];

const CUSTOM_EXERCISE_STORAGE_KEY = "strongsalon.custom-strength-exercises.v1";
const CATEGORY_ICON_MAP: Record<CustomExerciseCategory, string> = {
  가슴: "🫀",
  하체: "🦵",
  등: "🪽",
  어깨: "🧱",
  팔: "💪",
  코어: "🔥",
  유산소: "🏃",
};

interface CustomStrengthExercise {
  id: string;
  name: string;
  category: CustomExerciseCategory;
  icon: string;
}

interface StrengthChipItem {
  id: string;
  name: string;
  category: CustomExerciseCategory;
  icon: string;
  isCustom?: boolean;
}

const strengthExercises = exercisesInfo.filter(
  (ex) => ex.category !== "유산소"
);

const cardioGroup = EXERCISE_GROUPS.find((g) => g.label === "유산소");

interface ExerciseAddBottomSheetProps {
  open: boolean;
  onClose: () => void;
  selectedNames: Set<string>;
  cardioTypes: CardioType[];
  onToggleFav: (icon: string, name: string) => void;
  onToggleCardio: (type: CardioType) => void;
}

export default function ExerciseAddBottomSheet({
  open,
  onClose,
  selectedNames,
  cardioTypes,
  onToggleFav,
  onToggleCardio,
}: ExerciseAddBottomSheetProps) {
  const [pendingStrength, setPendingStrength] = useState<Set<string>>(new Set());
  const [pendingCardio, setPendingCardio] = useState<CardioType[]>([]);
  const [activeFilter, setActiveFilter] = useState<ExerciseFilter>("전체");
  const [query, setQuery] = useState("");
  const [customExercises, setCustomExercises] = useState<CustomStrengthExercise[]>(
    () => {
      if (typeof window === "undefined") return [];
      try {
        const raw = window.localStorage.getItem(CUSTOM_EXERCISE_STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw) as CustomStrengthExercise[];
        if (!Array.isArray(parsed)) return [];
        return parsed.filter(
          (item) =>
            typeof item?.id === "string" &&
            typeof item?.name === "string" &&
            typeof item?.icon === "string" &&
            CUSTOM_EXERCISE_CATEGORIES.includes(
              item?.category as CustomExerciseCategory,
            ),
        );
      } catch {
        return [];
      }
    },
  );
  const [customModeOpen, setCustomModeOpen] = useState(false);
  const [editingCustomId, setEditingCustomId] = useState<string | null>(null);
  const [newExerciseName, setNewExerciseName] = useState("");
  const [newExerciseCategory, setNewExerciseCategory] = useState<CustomExerciseCategory>(
    "가슴",
  );
  const [createError, setCreateError] = useState<string | null>(null);
  const [deletedCustomNames, setDeletedCustomNames] = useState<Set<string>>(
    new Set(),
  );
  const customIdRef = useRef(customExercises.length);
  const prevOpen = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(
      CUSTOM_EXERCISE_STORAGE_KEY,
      JSON.stringify(customExercises),
    );
  }, [customExercises]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      if (!prevOpen.current) {
        const nextStrength = new Set(selectedNames);
        const nextCardio = [...cardioTypes];
        queueMicrotask(() => {
          setPendingStrength(nextStrength);
          setPendingCardio(nextCardio);
          setActiveFilter("전체");
          setQuery("");
          setCustomModeOpen(false);
          setEditingCustomId(null);
          setNewExerciseName("");
          setNewExerciseCategory("가슴");
          setCreateError(null);
          setDeletedCustomNames(new Set());
        });
      }
      prevOpen.current = true;
    } else {
      document.body.style.overflow = "";
      prevOpen.current = false;
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, selectedNames, cardioTypes]);

  if (!open) return null;

  const baseStrengthItems: StrengthChipItem[] = strengthExercises.map((e) => ({
    id: e.id,
    name: e.name,
    category: e.category as StrengthCategory,
    icon: e.icon,
  }));
  const customStrengthItems: StrengthChipItem[] = customExercises.map((e) => ({
    ...e,
    isCustom: true,
  }));
  const allStrengthItems: StrengthChipItem[] = [
    ...baseStrengthItems,
    ...customStrengthItems,
  ];

  const normalizedQuery = query.trim().toLowerCase();
  const filteredStrengthGroups = STRENGTH_CATEGORIES.map((cat) => {
    if (!(activeFilter === "전체" || activeFilter === cat)) {
      return { cat, items: [] as StrengthChipItem[] };
    }
    const items = allStrengthItems.filter((e) => {
      const categoryMatch = e.category === cat;
      const textMatch =
        normalizedQuery.length === 0 ||
        e.name.toLowerCase().includes(normalizedQuery);
      return categoryMatch && textMatch;
    });
    return { cat, items };
  }).filter((group) => group.items.length > 0);

  const filteredCustomCardioItems =
    activeFilter === "전체" || activeFilter === "유산소"
      ? customStrengthItems.filter((item) => {
          if (item.category !== "유산소") return false;
          if (normalizedQuery.length === 0) return true;
          return item.name.toLowerCase().includes(normalizedQuery);
        })
      : [];

  const filteredCardio =
    activeFilter === "전체" || activeFilter === "유산소"
      ? (cardioGroup?.cardio ?? []).filter((c) => {
          if (normalizedQuery.length === 0) return true;
          return c.label.toLowerCase().includes(normalizedQuery);
        })
      : [];

  const hasAnyResult =
    filteredStrengthGroups.length > 0 ||
    filteredCardio.length > 0 ||
    filteredCustomCardioItems.length > 0;

  const handleStrengthClick = (icon: string, name: string) => {
    setPendingStrength((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const handleCardioClick = (type: CardioType) => {
    setPendingCardio((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleConfirm = () => {
    const pendingStrengthSet = new Set(pendingStrength);
    const selectedNamesSet = new Set(selectedNames);

    allStrengthItems.forEach((ex) => {
      const inPending = pendingStrengthSet.has(ex.name);
      const wasSelected = selectedNamesSet.has(ex.name);
      if (inPending && !wasSelected) onToggleFav(ex.icon, ex.name);
      if (!inPending && wasSelected) onToggleFav(ex.icon, ex.name);
    });
    deletedCustomNames.forEach((name) => {
      if (selectedNamesSet.has(name)) onToggleFav("💪", name);
    });

    const pendingCardioSet = new Set(pendingCardio);
    const cardioTypesSet = new Set(cardioTypes);
    const allCardioTypes: CardioType[] = ["run", "cycle", "row", "skierg"];
    allCardioTypes.forEach((t) => {
      const inPending = pendingCardioSet.has(t);
      const wasSelected = cardioTypesSet.has(t);
      if (inPending !== wasSelected) onToggleCardio(t);
    });

    onClose();
  };

  const handleDeleteCustomExercise = (id: string, name: string) => {
    setCustomExercises((prev) => prev.filter((item) => item.id !== id));
    setPendingStrength((prev) => {
      const next = new Set(prev);
      next.delete(name);
      return next;
    });
    setDeletedCustomNames((prev) => {
      const next = new Set(prev);
      next.add(name);
      return next;
    });
    if (editingCustomId === id) {
      setEditingCustomId(null);
      setNewExerciseName("");
      setNewExerciseCategory("가슴");
      setCreateError(null);
    }
  };

  const handleStartCustomCreate = () => {
    setEditingCustomId(null);
    setNewExerciseName("");
    setNewExerciseCategory("가슴");
    setCreateError(null);
  };

  const handleStartCustomEdit = (item: CustomStrengthExercise) => {
    setEditingCustomId(item.id);
    setNewExerciseName(item.name);
    setNewExerciseCategory(item.category);
    setCreateError(null);
  };

  const handleSaveCustomExercise = () => {
    const trimmedName = newExerciseName.trim();
    if (!trimmedName) {
      setCreateError("운동 이름을 입력해 주세요.");
      return;
    }

    const normalized = trimmedName.replace(/\s/g, "").toLowerCase();
    const exists = allStrengthItems.some(
      (item) =>
        item.name.replace(/\s/g, "").toLowerCase() === normalized &&
        item.id !== editingCustomId,
    );
    if (exists) {
      setCreateError("이미 같은 이름의 운동이 있어요.");
      return;
    }

    if (editingCustomId) {
      const beforeItem = customExercises.find((item) => item.id === editingCustomId);
      if (!beforeItem) return;
      setCustomExercises((prev) =>
        prev.map((item) =>
          item.id === editingCustomId
            ? {
                ...item,
                name: trimmedName,
                category: newExerciseCategory,
                icon: CATEGORY_ICON_MAP[newExerciseCategory],
              }
            : item,
        ),
      );
      if (beforeItem.name !== trimmedName) {
        setPendingStrength((prev) => {
          const next = new Set(prev);
          const hadOld = next.has(beforeItem.name);
          next.delete(beforeItem.name);
          if (hadOld) next.add(trimmedName);
          return next;
        });
        setDeletedCustomNames((prev) => {
          const next = new Set(prev);
          next.add(beforeItem.name);
          next.delete(trimmedName);
          return next;
        });
      }
      setEditingCustomId(null);
      setNewExerciseName("");
      setNewExerciseCategory("가슴");
      setCreateError(null);
      return;
    }

    customIdRef.current += 1;
    const nextItem: CustomStrengthExercise = {
      id: `custom_ex_${customIdRef.current}`,
      name: trimmedName,
      category: newExerciseCategory,
      icon: CATEGORY_ICON_MAP[newExerciseCategory],
    };
    setDeletedCustomNames((prev) => {
      const next = new Set(prev);
      next.delete(trimmedName);
      return next;
    });
    setCustomExercises((prev) => [nextItem, ...prev]);
    setPendingStrength((prev) => {
      const next = new Set(prev);
      next.add(trimmedName);
      return next;
    });
    setActiveFilter(newExerciseCategory === "유산소" ? "유산소" : newExerciseCategory);
    setQuery("");
    setNewExerciseName("");
    setNewExerciseCategory("가슴");
    setCreateError(null);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-end justify-center"
        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        onClick={onClose}
      >
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="w-full max-w-md rounded-t-2xl overflow-hidden max-h-[80vh] flex flex-col"
          style={{
            backgroundColor: "var(--bg-card)",
            borderTop: "1px solid var(--border-light)",
            boxShadow: "0 -4px 24px rgba(0,0,0,0.3)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-4 border-b"
            style={{ borderColor: "var(--border-light)" }}
          >
            <h3 className="font-bebas text-lg tracking-wider" style={{ color: "var(--text-main)" }}>
              운동 종목 추가
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-[var(--bg-card-hover)]"
              style={{ color: "var(--text-sub)" }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Exercise list */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
            <div className="space-y-3">
              <div className="relative">
                <Search
                  className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--text-sub)" }}
                />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="운동 이름 검색"
                  className="w-full h-10 pl-9 pr-3 rounded-xl border text-[13px] outline-none"
                  style={{
                    borderColor: "var(--border-light)",
                    backgroundColor: "var(--bg-body)",
                    color: "var(--text-main)",
                  }}
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
                {FILTER_OPTIONS.map((option) => {
                  const active = activeFilter === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setActiveFilter(option)}
                      className="h-8 px-3 rounded-full border text-[11px] font-semibold whitespace-nowrap transition-colors"
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
                              color: "var(--text-sub)",
                            }
                      }
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => {
                  setCustomModeOpen((prev) => !prev);
                  setCreateError(null);
                }}
                className="w-full h-9 rounded-xl border inline-flex items-center justify-center gap-1.5 text-[12px] font-semibold"
                style={{
                  borderColor: "var(--accent-main)",
                  backgroundColor: "var(--accent-bg)",
                  color: "var(--accent-main)",
                }}
              >
                <Plus className="w-3.5 h-3.5" />
                커스텀
              </button>

              {customModeOpen && (
                <div
                  className="rounded-xl border p-3 space-y-3"
                  style={{
                    borderColor: "var(--border-light)",
                    backgroundColor: "var(--bg-body)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-[12px] font-semibold" style={{ color: "var(--text-main)" }}>
                      커스텀 운동 관리
                    </p>
                    <button
                      type="button"
                      onClick={handleStartCustomCreate}
                      className="h-7 px-2.5 rounded-lg border text-[11px] font-semibold"
                      style={{
                        borderColor: "var(--border-light)",
                        color: "var(--text-sub)",
                        backgroundColor: "var(--bg-card)",
                      }}
                    >
                      + 새 항목
                    </button>
                  </div>

                  {customExercises.length === 0 ? (
                    <p className="text-[11px]" style={{ color: "var(--text-sub)" }}>
                      아직 커스텀 운동이 없어요. 아래에서 바로 추가해보세요.
                    </p>
                  ) : (
                    <div className="space-y-1.5">
                      {customExercises.map((item) => (
                        <div
                          key={item.id}
                          className="h-9 px-2.5 rounded-lg border flex items-center justify-between"
                          style={{
                            borderColor:
                              editingCustomId === item.id
                                ? "var(--accent-main)"
                                : "var(--border-light)",
                            backgroundColor: "var(--bg-card)",
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <span>{item.icon}</span>
                            <span className="text-[12px]" style={{ color: "var(--text-main)" }}>
                              {item.name}
                            </span>
                            <span
                              className="text-[10px] px-1.5 py-0.5 rounded-full"
                              style={{
                                border: "1px solid var(--border-light)",
                                color: "var(--text-sub)",
                              }}
                            >
                              {item.category}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleStartCustomEdit(item)}
                              className="w-7 h-7 rounded-md border flex items-center justify-center"
                              style={{
                                borderColor: "var(--border-light)",
                                color: "var(--text-sub)",
                                backgroundColor: "var(--bg-body)",
                              }}
                              aria-label={`${item.name} 수정`}
                            >
                              <PencilLine className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCustomExercise(item.id, item.name)}
                              className="w-7 h-7 rounded-md border flex items-center justify-center"
                              style={{
                                borderColor: "var(--border-light)",
                                color: "#ef4444",
                                backgroundColor: "var(--bg-body)",
                              }}
                              aria-label={`${item.name} 삭제`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="pt-2 border-t space-y-3" style={{ borderColor: "var(--border-light)" }}>
                    <p className="text-[11px] font-semibold" style={{ color: "var(--text-sub)" }}>
                      {editingCustomId ? "커스텀 운동 수정" : "커스텀 운동 추가"}
                    </p>

                    <div>
                      <p className="text-[11px] mb-1" style={{ color: "var(--text-sub)" }}>
                        운동 이름
                      </p>
                      <input
                        value={newExerciseName}
                        onChange={(e) => {
                          setNewExerciseName(e.target.value);
                          if (createError) setCreateError(null);
                        }}
                        placeholder="예: 케이블 크런치"
                        maxLength={24}
                        className="w-full h-9 px-3 rounded-lg border text-[12px] outline-none"
                        style={{
                          borderColor: "var(--border-light)",
                          backgroundColor: "var(--bg-card)",
                          color: "var(--text-main)",
                        }}
                      />
                    </div>

                    <div>
                      <p className="text-[11px] mb-1.5" style={{ color: "var(--text-sub)" }}>
                        카테고리
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {CUSTOM_EXERCISE_CATEGORIES.map((cat) => {
                          const active = newExerciseCategory === cat;
                          return (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => setNewExerciseCategory(cat)}
                              className="h-8 px-2.5 rounded-lg border text-[11px] font-semibold"
                              style={
                                active
                                  ? {
                                      borderColor: "var(--accent-main)",
                                      backgroundColor: "var(--accent-bg)",
                                      color: "var(--accent-main)",
                                    }
                                  : {
                                      borderColor: "var(--border-light)",
                                      backgroundColor: "var(--bg-card)",
                                      color: "var(--text-sub)",
                                    }
                              }
                            >
                              {cat}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {createError && (
                      <p className="text-[11px]" style={{ color: "#ef4444" }}>
                        {createError}
                      </p>
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleStartCustomCreate}
                        className="h-9 flex-1 rounded-lg border text-[12px] font-medium"
                        style={{
                          borderColor: "var(--border-light)",
                          backgroundColor: "var(--bg-card)",
                          color: "var(--text-sub)",
                        }}
                      >
                        입력 초기화
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveCustomExercise}
                        className="h-9 flex-1 rounded-lg text-[12px] font-bold"
                        style={{
                          backgroundColor: "var(--accent-main)",
                          color: "var(--accent-text)",
                        }}
                      >
                        {editingCustomId ? "수정 저장" : "추가 저장"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Strength exercises by category */}
            {filteredStrengthGroups.map(({ cat, items }) => {
              return (
                <div key={cat}>
                  <div
                    className="font-bebas text-[11px] tracking-widest uppercase mb-2"
                    style={{ color: "var(--text-sub)" }}
                  >
                    {cat}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {items.map((ex) => {
                      const isSelected = pendingStrength.has(ex.name);
                      return (
                        <button
                          key={ex.id}
                          type="button"
                          onClick={() => handleStrengthClick(ex.icon, ex.name)}
                          className="flex items-center gap-2 py-2.5 px-3.5 rounded-xl border transition-all duration-300 font-bebas text-[12px] tracking-wider"
                          style={
                            isSelected
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
                          <span className="text-base">{ex.icon}</span>
                          <span>{ex.name}</span>
                          {ex.isCustom && (
                            <span
                              className="text-[9px] px-1.5 py-0.5 rounded-full"
                              style={{
                                border: "1px solid var(--border-light)",
                                color: "var(--text-sub)",
                                backgroundColor: "var(--bg-card)",
                              }}
                            >
                              CUSTOM
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Cardio */}
            {(filteredCardio.length > 0 || filteredCustomCardioItems.length > 0) && (
              <div>
                <div
                  className="font-bebas text-[11px] tracking-widest uppercase mb-2"
                  style={{ color: "var(--text-sub)" }}
                >
                  유산소
                </div>
                <div className="flex flex-wrap gap-2">
                  {filteredCustomCardioItems.map((item) => {
                    const selected = pendingStrength.has(item.name);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleStrengthClick(item.icon, item.name)}
                        className="flex items-center gap-2 py-2.5 px-3.5 rounded-xl border transition-all duration-300 font-bebas text-[12px] tracking-wider"
                        style={
                          selected
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
                        <span className="text-base">{item.icon}</span>
                        <span>{item.name}</span>
                        <span
                          className="text-[9px] px-1.5 py-0.5 rounded-full"
                          style={{
                            border: "1px solid var(--border-light)",
                            color: "var(--text-sub)",
                            backgroundColor: "var(--bg-card)",
                          }}
                        >
                          CUSTOM
                        </span>
                      </button>
                    );
                  })}
                  {filteredCardio.map((c) => {
                    const isSelected = pendingCardio.includes(c.type);
                    return (
                      <button
                        key={c.type}
                        type="button"
                        onClick={() => handleCardioClick(c.type)}
                        className="flex items-center gap-2 py-2.5 px-3.5 rounded-xl border transition-all duration-300 font-bebas text-[12px] tracking-wider"
                        style={
                          isSelected
                            ? {
                                borderColor: "var(--accent-sub)",
                                backgroundColor: "rgba(34,197,94,0.1)",
                                color: "var(--accent-sub)",
                              }
                            : {
                                borderColor: "var(--border-light)",
                                backgroundColor: "var(--bg-body)",
                                color: "var(--text-main)",
                              }
                        }
                      >
                        <span className="text-base">{c.emoji}</span>
                        <span>{c.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {!hasAnyResult && (
              <div
                className="rounded-xl border px-4 py-8 text-center"
                style={{
                  borderColor: "var(--border-light)",
                  backgroundColor: "var(--bg-body)",
                }}
              >
                <p className="text-[13px] font-semibold" style={{ color: "var(--text-main)" }}>
                  검색 결과가 없어요
                </p>
                <p className="text-[11px] mt-1" style={{ color: "var(--text-sub)" }}>
                  검색어를 바꾸거나 필터를 `전체`로 돌려서 다시 확인해보세요.
                </p>
              </div>
            )}
          </div>

          {/* 선택완료 버튼 */}
          <div
            className="p-4 border-t shrink-0"
            style={{ borderColor: "var(--border-light)" }}
          >
            <button
              type="button"
              onClick={handleConfirm}
              className="w-full py-3.5 rounded-xl font-bold text-base transition-all hover:brightness-110 active:scale-[0.98]"
              style={{
                backgroundColor: "var(--accent-main)",
                color: "#000",
              }}
            >
              선택완료
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
