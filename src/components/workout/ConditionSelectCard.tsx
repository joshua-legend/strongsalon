"use client";

import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { Activity, ChevronDown } from "lucide-react";
import type { WorkoutCondition } from "@/types";

const CONDITION_OPTIONS: { value: WorkoutCondition; percent: number; emoji: string; label: string }[] = [
  { value: "최악", percent: 20, emoji: "😫", label: "최악 (휴식 권장)" },
  { value: "나쁨", percent: 40, emoji: "😕", label: "나쁨 (리커버리)" },
  { value: "좋음", percent: 60, emoji: "😊", label: "보통 (루틴 유지)" },
  { value: "최고", percent: 80, emoji: "💪", label: "좋음 (과부하 도전)" },
  { value: "불타", percent: 100, emoji: "🔥", label: "최고 (PR 갱신)" },
];

interface ConditionSelectCardProps {
  value: WorkoutCondition;
  onChange: (v: WorkoutCondition) => void;
}

export default function ConditionSelectCard({ value, onChange }: ConditionSelectCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = CONDITION_OPTIONS.find((o) => o.value === value) ?? CONDITION_OPTIONS[2];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      const inContainer = containerRef.current?.contains(target);
      const portal = document.getElementById("condition-dropdown-portal");
      const inPortal = portal?.contains(target);
      if (!inContainer && !inPortal) setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useLayoutEffect(() => {
    if (!isOpen) return;
    const updatePosition = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const portal = document.getElementById("condition-dropdown-portal");
      if (portal) {
        portal.style.top = `${rect.bottom + 8}px`;
        portal.style.left = `${rect.right - 240}px`;
      }
    };
    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsOpen((o) => !o)}
        onKeyDown={(e) => e.key === "Enter" && setIsOpen((o) => !o)}
        className="p-4 rounded-2xl border relative overflow-hidden transition-all duration-300 shadow-sm cursor-pointer hover:shadow-md"
        style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-light)" }}
      >
        <div className="flex items-center justify-between mb-3 relative z-10">
          <div className="flex items-center gap-1.5">
            <Activity
              className="w-4 h-4 transition-colors duration-300"
              style={{ color: "var(--text-sub)" }}
            />
            <p className="text-[12px] font-bold transition-colors duration-300" style={{ color: "var(--text-sub)" }}>
              컨디션
            </p>
          </div>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-300 opacity-50 ${isOpen ? "rotate-180" : ""}`}
            style={{ color: "var(--text-sub)" }}
          />
        </div>
        <p className="font-bebas text-4xl leading-none transition-colors duration-300 relative z-10" style={{ color: "var(--accent-sub)" }}>
          {selected.percent}
          <span className="text-base font-sans font-bold ml-1 transition-colors duration-300" style={{ color: "var(--text-sub)" }}>
            %
          </span>
        </p>
        <p className="text-[11px] font-bold mt-2 transition-colors duration-300 relative z-10 flex items-center gap-1" style={{ color: "var(--accent-sub)" }}>
          <span>{selected.emoji}</span> {selected.label}
        </p>
        <div
          className="absolute bottom-0 left-0 right-0 h-1.5 opacity-0 transition-opacity duration-300 z-0"
          style={{ backgroundColor: "var(--accent-sub)" }}
        />
      </div>

      {isOpen &&
        createPortal(
          <div
            id="condition-dropdown-portal"
            className="fixed w-[240px] rounded-xl border shadow-xl z-[100] overflow-hidden animate-zoom-in-95"
            style={{
              backgroundColor: "var(--bg-body)",
              borderColor: "var(--border-light)",
            }}
          >
            <div className="max-h-[280px] overflow-y-auto custom-scroll py-1.5">
              {CONDITION_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 text-left transition-colors hover:bg-[var(--bg-card-hover)]"
                  style={{ backgroundColor: opt.value === value ? "var(--bg-card-hover)" : undefined }}
                >
                  <span className="font-bold text-[13px] flex items-center gap-2" style={{ color: "var(--text-main)" }}>
                    <span>{opt.emoji}</span> {opt.label}
                  </span>
                  <span className="font-bebas text-lg" style={{ color: "var(--accent-sub)" }}>
                    {opt.percent} <span className="text-xs" style={{ color: "var(--text-sub)" }}>%</span>
                  </span>
                </button>
              ))}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
