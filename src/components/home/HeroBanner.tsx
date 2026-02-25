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

      <div className="grid grid-cols-3 gap-3 mt-2">
        <StatItem label="이달 출석률" value={`${member.monthAttendRate}%`} />
        <StatItem label="평균 볼륨" value={member.avgVolume} />
        <StatItem label="평균 컨디션" value={`${member.avgCondition}/5`} />
      </div>
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p
        className="font-space font-medium uppercase tracking-[0.2em] mb-1"
        style={{
          fontSize: "10px",
          color: "var(--muted2)",
          letterSpacing: "0.15em",
        }}
      >
        {label}
      </p>
      <p
        className="font-bebas text-[22px] leading-none"
        style={{ color: "var(--orange)" }}
      >
        {value}
      </p>
    </div>
  );
}
