"use client";

import { useState } from "react";
import { getCarrotBalance } from "@/data/credits";
import CarrotShop from "./CarrotShop";

export default function CarrotBadge() {
  const [showShop, setShowShop] = useState(false);
  const balance = getCarrotBalance();

  return (
    <>
      <button
        onClick={() => setShowShop(true)}
        className="w-full flex items-center justify-between rounded-xl px-4 py-3 bg-neutral-900 border border-neutral-800 hover:border-neutral-600 transition-colors"
      >
        <span className="font-bebas text-[12px] text-white">
          🥕 {balance} · 상점 →
        </span>
      </button>
      <CarrotShop open={showShop} onClose={() => setShowShop(false)} />
    </>
  );
}
