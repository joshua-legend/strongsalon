"use client";

import { X } from "lucide-react";
import { ANIMAL_TIER_CONFIG } from "@/utils/animalTier";
import type { AnimalTier } from "@/types";

const TIER_ORDER: AnimalTier[] = ["sloth", "meerkat", "gazelle", "tiger", "grizzly"];
const BAR_HEIGHTS = [10, 25, 30, 25, 10];

interface TierDistributionModalProps {
  open: boolean;
  onClose: () => void;
}

export default function TierDistributionModal({ open, onClose }: TierDistributionModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-sm bg-neutral-900 border border-orange-500/30 rounded-2xl p-5 shadow-xl animate-zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-lg text-neutral-500 hover:text-white hover:bg-neutral-800 transition-colors"
          aria-label="닫기"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="font-bebas text-xl text-white mb-4 tracking-wider">
          티어 분포
        </h3>
        <p className="text-[11px] text-neutral-400 mb-4">
          전체 유저 기준 정규 분포
        </p>

        <div className="flex items-end justify-center gap-2 h-32 mb-4">
          {TIER_ORDER.map((tierId, i) => {
            const cfg = ANIMAL_TIER_CONFIG[tierId];
            const h = BAR_HEIGHTS[i];
            return (
              <div
                key={tierId}
                className="flex flex-col items-center gap-1 flex-1"
              >
                <div
                  className="w-full rounded-t transition-all duration-500"
                  style={{
                    height: `${h}%`,
                    minHeight: 8,
                    background: `linear-gradient(to top, rgba(249,115,22,0.4), rgba(249,115,22,0.8))`,
                  }}
                />
              </div>
            );
          })}
        </div>

        <div className="flex justify-between gap-1 border-t border-neutral-800 pt-3">
          {TIER_ORDER.map((tierId) => {
            const cfg = ANIMAL_TIER_CONFIG[tierId];
            return (
              <div
                key={tierId}
                className="flex flex-col items-center gap-0.5 min-w-0 flex-1"
              >
                <span className="text-lg">{cfg.emoji}</span>
                <span className="text-[9px] text-neutral-500 truncate w-full text-center">
                  {cfg.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
