"use client";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "lime" | "orange" | "cyan" | "red" | "muted" | "green" | "blue" | "purple" | "yellow";
  className?: string;
}

const colors: Record<string, { bg: string; border: string; text: string }> = {
  lime: { bg: "rgba(163,230,53,.15)", border: "rgba(163,230,53,.35)", text: "rgb(163,230,53)" },
  orange: { bg: "rgba(249,115,22,.15)", border: "rgba(249,115,22,.35)", text: "rgb(249,115,22)" },
  cyan: { bg: "rgba(34,211,238,.15)", border: "rgba(34,211,238,.35)", text: "rgb(34,211,238)" },
  red: { bg: "rgba(239,68,68,.15)", border: "rgba(239,68,68,.35)", text: "rgb(239,68,68)" },
  muted: { bg: "rgba(255,255,255,.06)", border: "rgba(255,255,255,.12)", text: "rgb(163,163,163)" },
  green: { bg: "rgba(163,230,53,.15)", border: "rgba(163,230,53,.35)", text: "rgb(163,230,53)" },
  blue: { bg: "rgba(34,211,238,.15)", border: "rgba(34,211,238,.35)", text: "rgb(34,211,238)" },
  purple: { bg: "rgba(168,85,247,.15)", border: "rgba(168,85,247,.35)", text: "rgb(168,85,247)" },
  yellow: { bg: "rgba(234,179,8,.15)", border: "rgba(234,179,8,.35)", text: "rgb(234,179,8)" },
};

export default function Badge({ children, variant = "lime", className = "" }: BadgeProps) {
  const c = colors[variant] ?? colors.lime;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-[20px] text-[10px] font-medium font-bebas ${className}`}
      style={{
        letterSpacing: "0.5px",
        background: c.bg,
        border: `1px solid ${c.border}`,
        color: c.text,
      }}
    >
      {children}
    </span>
  );
}
