"use client";

import ProgressBar from "@/components/ui/ProgressBar";

export default function ChallengeCards() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="card">
        <p className="card-label mb-2">🎯 이번 주 챌린지</p>
        <p className="font-bebas text-[26px] leading-none text-lime-400">
          3<span className="text-[14px] text-neutral-400">/4</span>
        </p>
        <p className="text-[10px] mt-1 mb-3 text-neutral-400">
          🥕 1회 더 출석하면 달성!
        </p>
        <ProgressBar value={75} />
      </div>

      <div className="card">
        <p className="card-label mb-2">📅 이번 달 출석</p>
        <p className="font-bebas text-[26px] leading-none text-orange-500">
          16<span className="text-[14px] text-neutral-400">/22회</span>
        </p>
        <p className="text-[10px] mt-1 mb-3 text-neutral-400">
          출석률 73%
        </p>
        <ProgressBar value={73} color="rgb(249,115,22)" />
      </div>
    </div>
  );
}
