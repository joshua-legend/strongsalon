"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { carrotHistory, getCarrotBalance } from "@/data/credits";
import { shopItems } from "@/data/shop";
import CarrotHistory from "./CarrotHistory";

const REASON_LABELS: Record<string, string> = {
  weekly_attend: "주간 출석",
  streak_bonus: "7일 연속 출석",
  pr_achieved: "PR 갱신",
  goal_achieved: "목표 달성",
  whip_no_attend: "주간 무출석",
  whip_2week: "2주 연속 무출석",
  whip_deadline: "목표 기한 초과",
  shop_purchase: "상점 구매",
};

interface CarrotShopProps {
  open: boolean;
  onClose: () => void;
}

export default function CarrotShop({ open, onClose }: CarrotShopProps) {
  const { showToast } = useToast();
  const [tab, setTab] = useState<"shop" | "history">("shop");
  const [balance, setBalance] = useState(getCarrotBalance());

  const handlePurchase = (item: { id: string; name: string; cost: number }) => {
    if (balance < item.cost) {
      showToast("잔액이 부족합니다");
      return;
    }
    setBalance((b) => Math.max(0, b - item.cost));
    showToast(`🥕 -${item.cost} ${item.name} 구매 완료`);
    onClose();
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-[900] bg-black/40" onClick={onClose} />
      <div className="fixed left-0 right-0 bottom-0 z-[901] rounded-t-2xl p-4 pb-[max(1rem,env(safe-area-inset-bottom))] max-h-[80vh] overflow-auto bg-neutral-950 border-t border-neutral-800">
        <div className="flex items-center justify-between mb-4">
          <p className="font-bebas text-[24px] mb-0 text-lime-400">🥕 {balance}</p>
          <button onClick={onClose} className="text-[14px] text-neutral-400">
            닫기
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setTab("shop")}
            className={`flex-1 py-2 rounded-lg text-[11px] font-medium ${
              tab === "shop"
                ? "bg-lime-400/20 text-lime-400 border border-lime-400/50"
                : "bg-neutral-900 text-neutral-400"
            }`}
          >
            상점
          </button>
          <button
            onClick={() => setTab("history")}
            className={`flex-1 py-2 rounded-lg text-[11px] font-medium ${
              tab === "history"
                ? "bg-lime-400/20 text-lime-400 border border-lime-400/50"
                : "bg-neutral-900 text-neutral-400"
            }`}
          >
            이력
          </button>
        </div>

        {tab === "shop" && (
          <div className="grid grid-cols-2 gap-3">
            {shopItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handlePurchase(item)}
                disabled={balance < item.cost}
                className="rounded-xl p-4 text-left disabled:opacity-50 bg-neutral-900 border border-neutral-800 hover:border-neutral-600"
              >
                <span className="text-[24px]">{item.emoji}</span>
                <p className="font-bebas text-[11px] mt-2 text-white">{item.name}</p>
                <p className="font-bebas text-[16px] text-lime-400">{item.cost} 🥕</p>
              </button>
            ))}
          </div>
        )}

        {tab === "history" && (
          <CarrotHistory
            history={carrotHistory.map((h) => ({
              ...h,
              label: REASON_LABELS[h.reason] ?? h.reason,
            }))}
          />
        )}
      </div>
    </>
  );
}
