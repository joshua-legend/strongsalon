"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { getCarrotBalance } from "@/data/credits";
import CarrotShop from "@/components/home/CarrotShop";

export default function Topbar() {
  const { theme } = useApp();
  const [showShop, setShowShop] = useState(false);
  const balance = getCarrotBalance();

  if (theme === "workout") return null;

  return (
    <>
      <header
        className="flex items-center justify-between px-5 shrink-0 h-[60px] bg-neutral-950 border-b border-neutral-800"
      >
        <div className="font-bebas text-[24px] tracking-wide leading-none">
          <span className="text-lime-400">Fit</span>
          <span className="text-neutral-400">Log</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowShop(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full transition-colors bg-neutral-900 border border-neutral-800 hover:border-neutral-600"
          >
            <span className="text-[13px]">🥕</span>
            <span className="font-bebas text-[14px] leading-none text-lime-400">
              {balance}
            </span>
          </button>

          <button className="relative w-9 h-9 flex items-center justify-center rounded-full bg-neutral-900">
            <span className="text-[16px]">🔔</span>
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
          </button>

          <div className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold bg-lime-400 text-black">
            김
          </div>
        </div>
      </header>

      <CarrotShop open={showShop} onClose={() => setShowShop(false)} />
    </>
  );
}
