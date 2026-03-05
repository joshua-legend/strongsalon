"use client";

import { member } from "@/data/member";
import { useQuest } from "@/context/QuestContext";
import { calcTotalScore } from "@/utils/scoring";
import {
  getAnimalTierFromPercentile,
  ANIMAL_TIER_CONFIG,
} from "@/utils/animalTier";

interface MyPageModalProps {
  open: boolean;
  onClose: () => void;
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
  } catch {
    return "-";
  }
}

export default function MyPageModal({ open, onClose }: MyPageModalProps) {
  const { userProfile } = useQuest();

  if (!open) return null;

  const score = calcTotalScore(member);
  const percentile = Math.min(100, Math.max(0, score));
  const tier = getAnimalTierFromPercentile(percentile);
  const cfg = ANIMAL_TIER_CONFIG[tier];
  const topPercent = Math.round(100 - percentile);

  const height = userProfile?.height ?? null;
  const weight = userProfile?.weight ?? member.bodyComp?.weight ?? null;
  const bodyFatPct = userProfile?.bodyFatPct ?? member.bodyComp?.fatPct ?? null;
  const muscleMass = userProfile?.muscleMass ?? member.bodyComp?.muscle ?? null;
  const liftTotal = member.liftTotal ?? null;
  const createdAt = userProfile?.createdAt ?? member.membershipStart ?? null;

  const rows: { label: string; value: string | number | null }[] = [
    { label: "회원명", value: member.name },
    { label: "키", value: height != null ? `${height} cm` : null },
    { label: "몸무게", value: weight != null ? `${weight} kg` : null },
    { label: "체지방량", value: bodyFatPct != null ? `${bodyFatPct}%` : null },
    { label: "골격근량", value: muscleMass != null ? `${muscleMass} kg` : null },
    { label: "1RM 중량", value: liftTotal != null ? `${liftTotal} kg` : null },
    { label: "티어", value: cfg ? `${cfg.label} (Top ${topPercent}%)` : null },
    { label: "가입날짜", value: createdAt ? formatDate(createdAt) : null },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative w-full max-w-sm rounded-2xl bg-neutral-900 border border-neutral-800 p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bebas text-xl text-lime-400 tracking-wider">
            마이페이지
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-neutral-400 hover:text-white transition-colors"
          >
            닫기
          </button>
        </div>

        <div className="space-y-4">
          {rows.map(({ label, value }) => (
            <div
              key={label}
              className="flex justify-between items-baseline py-2 border-b border-neutral-800/80 last:border-0"
            >
              <span className="text-xs text-neutral-500 font-mono">{label}</span>
              <span className="font-mono text-sm font-bold text-white">
                {value ?? "-"}
              </span>
            </div>
          ))}
        </div>

        {cfg && (
          <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center gap-2">
            <span className="text-2xl">{cfg.emoji}</span>
            <div>
              <div className="font-bebas text-sm text-lime-400">
                Tier {cfg.tierNum} · {cfg.label}
              </div>
              <div className="text-[10px] text-neutral-500">{cfg.mascotDesc}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
