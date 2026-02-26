"use client";

import { member } from "@/data/member";
import { getGreeting, getDailyHeroMessage } from "@/utils/format";
import Badge from "@/components/ui/Badge";

export default function HeroBanner() {
  const greeting = getGreeting();
  const heroMessage = getDailyHeroMessage();

  return (
    <div
      className="rounded-2xl p-5 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, rgba(255,94,31,.13), rgba(255,154,60,.06))",
        border: "1px solid rgba(255,94,31,.2)",
      }}
    >
      <p className="text-[12px] mb-1" style={{ color: "var(--muted2)" }}>
        {greeting}, {member.name}님
      </p>
      <h1
        className="font-bebas text-[30px] leading-tight tracking-wide mb-3"
        style={{ color: "var(--text)" }}
      >
        {heroMessage}
      </h1>

      <Badge variant="orange" className="mb-4">
        🔥 연속 {member.streak}일 출석 중!
      </Badge>

      <div className="grid grid-cols-3 gap-2.5 mt-4">
        <StatItem
          label="이달 출석률"
          value={`${member.monthAttendRate}%`}
          accent="var(--green)"
        />
        <StatItem
          label="평균 볼륨"
          value={member.avgVolume}
          accent="var(--orange)"
        />
        <StatItem
          label="평균 컨디션"
          value={`${member.avgCondition}/5`}
          accent="var(--blue)"
        />
      </div>
    </div>
  );
}

function StatItem({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div
      className="rounded-xl py-3.5 px-3 text-center border"
      style={{
        background: "var(--s1)",
        borderColor: "var(--border)",
        boxShadow: "0 0 0 1px rgba(0,0,0,.03) inset",
      }}
    >
      <p
        className="font-space font-semibold uppercase tracking-wider mb-1.5"
        style={{
          fontSize: "9px",
          color: "var(--muted2)",
          letterSpacing: "0.12em",
        }}
      >
        {label}
      </p>
      <p
        className="font-bebas text-[20px] leading-none tracking-wide"
        style={{ color: accent }}
      >
        {value}
      </p>
    </div>
  );
}
