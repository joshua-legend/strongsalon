"use client";

import { Dumbbell, ChevronRight } from "lucide-react";
import type { ExerciseInfoItem, ExerciseCategory } from "@/types";
import { getExerciseGif } from "@/data/exercise-gifs";

const DEFAULT_MODEL_URL =
  "https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Shoulder-Press.gif";

const CATEGORY_COLORS: Record<ExerciseCategory | "전체", { bg: string; text: string }> = {
  전체: { bg: "var(--text-sub)", text: "white" },
  가슴: { bg: "#a3e635", text: "black" },
  등: { bg: "#f97316", text: "black" },
  어깨: { bg: "#eab308", text: "black" },
  팔: { bg: "#22d3ee", text: "black" },
  하체: { bg: "#a855f7", text: "white" },
  코어: { bg: "#ef4444", text: "white" },
  유산소: { bg: "#3b82f6", text: "white" },
};

function getEquipment(item: ExerciseInfoItem): string {
  if (item.equipment) return item.equipment;
  const d = (item.description || "").toLowerCase();
  if (d.includes("바벨")) return "Barbell";
  if (d.includes("덤벨")) return "Dumbbell";
  if (d.includes("케이블")) return "Cable";
  if (d.includes("바를") || d.includes("바에") || d.includes("바 ")) return "Bar";
  if (d.includes("맨몸")) return "Bodyweight";
  if (d.includes("러닝") || d.includes("트레드밀")) return "Treadmill";
  if (d.includes("로잉")) return "Rowing";
  if (d.includes("스키에르그")) return "Skierg";
  return "Machine";
}

interface ExerciseListProps {
  items: ExerciseInfoItem[];
  onSelect: (item: ExerciseInfoItem) => void;
}

export default function ExerciseList({ items, onSelect }: ExerciseListProps) {
  return (
    <div className="flex flex-col gap-3">
      {items.map((ex) => {
        const badgeStyle = CATEGORY_COLORS[ex.category] ?? { bg: "var(--text-sub)", text: "white" };
        const modelUrl = ex.modelUrl ?? getExerciseGif(ex.id) ?? DEFAULT_MODEL_URL;
        const equipment = getEquipment(ex);

        return (
          <button
            key={ex.id}
            onClick={() => onSelect(ex)}
            className="group bg-[var(--bg-card)] border border-[var(--border-light)] hover:border-[var(--text-sub)] rounded-xl p-3 flex gap-4 items-center transition-colors cursor-pointer relative overflow-hidden text-left"
          >
            {/* 우측 배경 장식 아이콘 */}
            <Dumbbell className="absolute -right-4 -bottom-4 w-24 h-24 -rotate-12 pointer-events-none transition-opacity duration-300" style={{ color: "var(--decor-icon-color)", opacity: "var(--decor-icon-opacity)" }} />

            {/* 3D 썸네일 영역 */}
            <div className="relative w-20 h-20 bg-[var(--bg-card-hover)] rounded-lg border border-[var(--border-light)] overflow-hidden flex-shrink-0 flex items-center justify-center p-1">
              <img
                src={modelUrl}
                alt={ex.name}
                className="w-full h-full object-contain scale-110"
              />
            </div>

            {/* 텍스트 정보 영역 */}
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              {/* Skewed 뱃지 */}
              <div className="flex items-start mb-1">
                <span
                  className="inline-block px-2 py-0.5 font-bold text-[9px] uppercase italic -skew-x-12"
                  style={{ backgroundColor: badgeStyle.bg, color: badgeStyle.text }}
                >
                  <span className="skew-x-12 block">{ex.category}</span>
                </span>
              </div>

              {/* 종목명 */}
              <h3 className="text-xl font-bebas text-[var(--text-main)] group-hover:text-[var(--text-main)] transition-colors truncate tracking-wide">
                {ex.name}
              </h3>

              {/* 장비 메타데이터 태그 */}
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-mono text-[var(--text-sub)] flex items-center gap-1 border border-[var(--border-light)] px-1.5 py-0.5 rounded bg-[var(--bg-body)]">
                  {equipment}
                </span>
              </div>
            </div>

            <ChevronRight className="w-5 h-5 text-[var(--text-sub)] group-hover:text-[var(--accent-main)] transition-colors mr-1 flex-shrink-0" />
          </button>
        );
      })}
    </div>
  );
}
