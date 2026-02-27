"use client";

interface HistoryItem {
  id: string;
  amount: number;
  reason: string;
  label: string;
  createdAt: string;
}

interface CarrotHistoryProps {
  history: HistoryItem[];
}

export default function CarrotHistory({ history }: CarrotHistoryProps) {
  return (
    <div className="flex flex-col gap-2">
      {history.map((h) => (
        <div
          key={h.id}
          className="flex items-center justify-between py-2 px-3 rounded-lg bg-neutral-900 border border-neutral-800"
        >
          <div>
            <p className="font-bebas text-[11px] text-white">{h.label}</p>
            <p className="font-bebas text-[9px] text-neutral-400">{h.createdAt}</p>
          </div>
          <span
            className={`font-bebas text-[16px] ${h.amount >= 0 ? "text-lime-400" : "text-red-500"}`}
          >
            {h.amount >= 0 ? "+" : ""}
            {h.amount} 🥕
          </span>
        </div>
      ))}
    </div>
  );
}
