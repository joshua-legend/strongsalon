"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { AbilityStats } from "@/types";

const ABILITY_KEYS: { key: keyof AbilityStats; label: string }[] = [
  { key: "strength", label: "근력" },
  { key: "endurance", label: "근지구력" },
  { key: "explosiveness", label: "순발력" },
  { key: "cardio", label: "심폐지구력" },
  { key: "stability", label: "안정성" },
];

const STORAGE_KEY = "fitlog-ability-stats";

const DEFAULT_STATS: AbilityStats = {
  strength: 60,
  endurance: 50,
  explosiveness: 55,
  cardio: 45,
  stability: 60,
};

function loadFromStorage(): AbilityStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AbilityStats;
      return { ...DEFAULT_STATS, ...parsed };
    }
  } catch {
    // ignore
  }
  return DEFAULT_STATS;
}

interface AbilityMeasureModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (stats: AbilityStats) => void;
  initialStats?: AbilityStats;
}

export default function AbilityMeasureModal({
  open,
  onClose,
  onSave,
  initialStats,
}: AbilityMeasureModalProps) {
  const [stats, setStats] = useState<AbilityStats>(
    () => initialStats ?? loadFromStorage()
  );

  if (!open) return null;

  const handleSave = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    } catch {
      // ignore
    }
    onSave(stats);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-[480px] bg-neutral-950 border-t border-neutral-800 rounded-t-3xl p-5 pt-7 animate-slide-up shadow-[0_-10px_40px_rgba(0,0,0,0.8)] flex flex-col max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-neutral-500 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <h3 className="font-bebas text-2xl text-white mb-4 tracking-wider">
          능력치 밸런스 측정
        </h3>

        <div className="overflow-y-auto pr-3 mb-6 flex-1 space-y-4">
          {ABILITY_KEYS.map(({ key, label }) => (
            <div key={key}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-neutral-400">{label}</span>
                <span className="font-bebas text-lg text-orange-500">
                  {stats[key]}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={stats[key]}
                onChange={(e) =>
                  setStats((prev) => ({ ...prev, [key]: Number(e.target.value) }))
                }
                className="setup-slider w-full"
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleSave}
          className="w-full py-3 bg-orange-500 text-black font-bold text-sm rounded-xl hover:brightness-110 transition-all"
        >
          저장
        </button>
      </div>
    </div>
  );
}

export { loadFromStorage };
