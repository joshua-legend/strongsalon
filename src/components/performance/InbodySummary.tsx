"use client";

import { useUser } from "@/context/UserContext";
import { InbodySummaryChart } from "./InbodySummaryChart";

const defaultMetrics = [
  { label: "체중", value: 0, unit: "kg", delta: 0, color: "text-[var(--text-main)]" },
  { label: "골격근량", value: 0, unit: "kg", delta: 0, color: "text-cyan-400" },
  { label: "체지방률", value: 0, unit: "%", delta: 0, color: "text-orange-500" },
];

const metricsFromBodyComp = (bc: { weight: number; muscle: number; fatPct: number; delta: { weight: number; muscle: number; fatPct: number } }) => [
  { label: "체중", value: bc.weight, unit: "kg", delta: bc.delta.weight, color: "text-[var(--text-main)]" },
  { label: "골격근량", value: bc.muscle, unit: "kg", delta: bc.delta.muscle, color: "text-cyan-400" },
  { label: "체지방률", value: bc.fatPct, unit: "%", delta: bc.delta.fatPct, color: "text-orange-500" },
];

const gauges = [
  { label: "골격근량", value: 34.2, min: 28, max: 42, normal: [30, 36], verdict: "▲ 표준이상", color: "#22d3ee" },
  { label: "체지방률", value: 16.8, min: 5, max: 30, normal: [10, 20], verdict: "✓ 표준", color: "#a3e635" },
  { label: "BMI", value: 23.1, min: 15, max: 35, normal: [18.5, 25], verdict: "✓ 정상", color: "#a3e635" },
];

const trendData = [
  { month: "9월", weight: 76.0, muscle: 33.2, fat: 19.5 },
  { month: "10월", weight: 75.2, muscle: 33.5, fat: 18.8 },
  { month: "11월", weight: 74.8, muscle: 33.8, fat: 18.0 },
  { month: "12월", weight: 74.2, muscle: 34.0, fat: 17.5 },
  { month: "1월", weight: 73.8, muscle: 34.1, fat: 17.0 },
  { month: "2월", weight: 73.4, muscle: 34.2, fat: 16.8 },
];

export default function InbodySummary() {
  const { user } = useUser();
  const bc = user?.bodyComp;
  const metrics = bc ? metricsFromBodyComp(bc) : defaultMetrics;

  return (
    <div className="flex flex-col gap-4">
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <p className="card-label font-bold">📋 최근 측정</p>
          <span className="font-bebas text-[8px]" style={{ color: "var(--text-sub)" }}>
            {bc?.measuredAt ?? "-"} · 15일 전
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {metrics.map((m, i) => (
            <div key={i} className="text-center">
              <p className="font-bebas text-[8px] uppercase mb-1" style={{ color: "var(--text-sub)" }}>{m.label}</p>
              <p className={`font-bebas text-[28px] leading-none ${m.color}`}>
                {m.value}
                <span className="text-[14px]" style={{ color: "var(--text-sub)" }}>{m.unit}</span>
              </p>
              <p className={`font-bebas text-[9px] mt-1 ${
                m.delta > 0
                  ? "text-lime-400"
                  : m.delta < 0
                    ? m.label === "체지방률" ? "text-lime-400" : "text-red-500"
                    : "text-[var(--text-sub)]"
              }`}>
                {m.delta > 0 ? "▲" : m.delta < 0 ? "▼" : ""}{" "}
                {m.delta > 0 ? "+" : ""}{m.delta}{m.unit}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <p className="card-label font-bold mb-4">🧬 인바디 판정</p>
        <div className="flex flex-col gap-4">
          {gauges.map((g, i) => {
            const range = g.max - g.min;
            const valuePct = ((g.value - g.min) / range) * 100;
            const normalStart = ((g.normal[0] - g.min) / range) * 100;
            const normalEnd = ((g.normal[1] - g.min) / range) * 100;

            return (
              <div key={i}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-medium" style={{ color: "var(--text-main)" }}>{g.label}</span>
                  <span className="font-bebas text-[9px]" style={{ color: g.color }}>{g.verdict}</span>
                </div>
                <div className="relative h-4 rounded-full overflow-hidden" style={{ backgroundColor: "var(--bg-card-hover)" }}>
                  <div
                    className="absolute top-0 h-full rounded-full opacity-25"
                    style={{ left: `${normalStart}%`, width: `${normalEnd - normalStart}%`, background: g.color }}
                  />
                  <div
                    className="absolute w-3.5 h-3.5 rounded-full border-2 z-10"
                    style={{ left: `${valuePct}%`, top: "50%", transform: "translate(-50%, -50%)", background: "var(--bg-card)", borderColor: g.color }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="font-bebas text-[7px]" style={{ color: "var(--text-sub)" }}>{g.min}</span>
                  <span className="font-bebas text-[7px]" style={{ color: "var(--text-sub)" }}>{g.max}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card">
        <p className="card-label font-bold mb-4">📈 6개월 추이</p>
        <InbodySummaryChart data={trendData} />
        <div className="flex gap-4 mt-3 justify-center">
          {[
            { label: "체중", color: "#737373" },
            { label: "골격근량", color: "#22d3ee" },
            { label: "체지방률", color: "#f97316" },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1">
              <div className="w-3 h-[2px] rounded-full" style={{ background: l.color }} />
              <span className="font-bebas text-[8px]" style={{ color: "var(--text-sub)" }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
