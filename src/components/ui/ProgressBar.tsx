"use client";

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  gradient?: string;
  height?: number;
  className?: string;
}

export default function ProgressBar({
  value,
  max = 100,
  color,
  gradient,
  height = 6,
  className = "",
}: ProgressBarProps) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className={`h-2 rounded-full overflow-hidden bg-neutral-950 ${className}`} style={{ height }}>
      <div
        className="progress-fill relative"
        style={{
          width: `${pct}%`,
          background: gradient || color || "rgb(163,230,53)",
        }}
      >
        <div className="absolute inset-0 bg-stripes opacity-20" />
      </div>
    </div>
  );
}
