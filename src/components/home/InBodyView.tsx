"use client";

import { useState } from "react";
import { useInbody } from "@/context/InbodyContext";
import InbodyInputSheet from "./InbodyInputSheet";
import { InbodyTrendChart } from "./InbodyTrendChart";

export default function InBodyView() {
  const { inbodyHistory } = useInbody();
  const [showInput, setShowInput] = useState(false);

  const latest = inbodyHistory[0];
  const prev = inbodyHistory[1];

  return (
    <div className="space-y-4">
      {/* LatestInbodyCard */}
      <div className="rounded-2xl overflow-hidden bg-[var(--bg-card)] border border-[var(--border-light)] p-5">
        <div className="flex justify-between items-center mb-4">
          <span className="text-[10px] font-bold text-[var(--text-sub)] uppercase tracking-widest">
            최근 측정
          </span>
          <button
            type="button"
            onClick={() => setShowInput(true)}
            className="text-xs text-[var(--accent-main)] hover:opacity-80"
          >
            + 추가
          </button>
        </div>
        {latest ? (
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-[var(--bg-body)] border border-[var(--border-light)] p-3">
              <div className="text-[10px] text-[var(--text-sub)] mb-1">체중</div>
              <div className="font-mono text-lg text-[var(--text-main)]">{latest.weight} kg</div>
            </div>
            <div className="rounded-xl bg-[var(--bg-body)] border border-[var(--border-light)] p-3">
              <div className="text-[10px] text-[var(--text-sub)] mb-1">골격근량</div>
              <div className="font-mono text-lg text-[var(--text-main)]">{latest.muscleMass} kg</div>
            </div>
            <div className="rounded-xl bg-[var(--bg-body)] border border-[var(--border-light)] p-3">
              <div className="text-[10px] text-[var(--text-sub)] mb-1">체지방량</div>
              <div className="font-mono text-lg text-[var(--text-main)]">{latest.fatMass} kg</div>
            </div>
            <div className="rounded-xl bg-[var(--bg-body)] border border-[var(--border-light)] p-3">
              <div className="text-[10px] text-[var(--text-sub)] mb-1">체지방률</div>
              <div className="font-mono text-lg text-[var(--text-main)]">{latest.fatPercent}%</div>
            </div>
            {latest.bmi != null && (
              <div className="rounded-xl bg-[var(--bg-body)] border border-[var(--border-light)] p-3">
                <div className="text-[10px] text-[var(--text-sub)] mb-1">BMI</div>
                <div className="font-mono text-lg text-[var(--text-main)]">{latest.bmi}</div>
              </div>
            )}
            {latest.bmr != null && (
              <div className="rounded-xl bg-[var(--bg-body)] border border-[var(--border-light)] p-3">
                <div className="text-[10px] text-[var(--text-sub)] mb-1">기초대사량</div>
                <div className="font-mono text-lg text-[var(--text-main)]">{latest.bmr} kcal</div>
              </div>
            )}
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-[var(--text-sub)]">
            아직 인바디 기록이 없습니다
          </div>
        )}
      </div>

      {/* InbodyChangeCard */}
      {latest && prev && (
        <div className="rounded-2xl overflow-hidden bg-[var(--bg-card)] border border-[var(--border-light)] p-5">
          <div className="text-[10px] font-bold text-[var(--text-sub)] uppercase tracking-widest mb-3">
            이전 대비 변화
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <ChangeItem
              label="체중"
              curr={latest.weight}
              prev={prev.weight}
              invert={true}
            />
            <ChangeItem
              label="골격근"
              curr={latest.muscleMass}
              prev={prev.muscleMass}
              invert={false}
            />
            <ChangeItem
              label="체지방"
              curr={latest.fatMass}
              prev={prev.fatMass}
              invert={true}
            />
            <ChangeItem
              label="체지방률"
              curr={latest.fatPercent}
              prev={prev.fatPercent}
              invert={true}
            />
          </div>
        </div>
      )}

      {/* InbodyTrendChart - 간단 SVG 라인 */}
      {inbodyHistory.length >= 2 && (
        <InbodyTrendChart records={inbodyHistory.slice(0, 10)} />
      )}

      {/* InbodyHistoryList */}
      <div className="rounded-2xl overflow-hidden bg-[var(--bg-card)] border border-[var(--border-light)] p-5">
        <div className="text-[10px] font-bold text-[var(--text-sub)] uppercase tracking-widest mb-3">
          측정 기록
        </div>
        {inbodyHistory.length === 0 ? (
          <div className="py-6 text-center text-xs text-[var(--text-sub)]">
            기록이 없습니다
          </div>
        ) : (
          <div className="space-y-2">
            {inbodyHistory.map((r) => (
              <div
                key={r.date}
                className="flex justify-between items-center py-2 border-b border-[var(--border-light)] last:border-0"
              >
                <span className="text-xs text-[var(--text-sub)]">{r.date}</span>
                <span className="font-mono text-sm text-[var(--text-main)]">
                  {r.weight}kg · 근육{r.muscleMass} · 지방{r.fatPercent}%
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <InbodyInputSheet open={showInput} onClose={() => setShowInput(false)} />
    </div>
  );
}

function ChangeItem({
  label,
  curr,
  prev,
  invert,
}: {
  label: string;
  curr: number;
  prev: number;
  invert: boolean;
}) {
  const diff = curr - prev;
  const isGood = invert ? diff <= 0 : diff >= 0;
  const color = diff === 0 ? "text-[var(--text-sub)]" : isGood ? "text-[var(--accent-main)]" : "text-orange-400";
  const sign = diff > 0 ? "+" : "";
  return (
    <span className={color}>
      {label} {sign}{diff.toFixed(1)}
    </span>
  );
}

