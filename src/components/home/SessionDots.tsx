"use client";

export function SessionDots({ remaining, total, color }: { remaining: number; total: number; color: string }) {
  const capped = Math.min(total, 20);
  const used = total - remaining;

  return (
    <div className="mt-2">
      <div className="flex flex-wrap gap-1">
        {Array.from({ length: capped }).map((_, i) => (
          <span
            key={i}
            className="w-2.5 h-2.5 rounded-full transition-all"
            style={{ background: i < used ? "rgb(38,38,38)" : color, opacity: i < used ? 0.3 : 1 }}
          />
        ))}
        {total > 20 && (
          <span className="font-bebas text-[8px] text-neutral-500 self-center">+{total - 20}</span>
        )}
      </div>
      <p className="font-bebas text-[8px] mt-1 text-neutral-500">{used}회 사용 · 총 {total}회</p>
    </div>
  );
}
