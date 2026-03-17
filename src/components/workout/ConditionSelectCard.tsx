"use client";

import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { Activity, ChevronDown } from "lucide-react";
import type { WorkoutCondition } from "@/types";

const CONDITION_OPTIONS: { value: WorkoutCondition; emoji: string; main: string; sub: string }[] = [
  { value: "최악", emoji: "😫", main: "레스트", sub: "오프데이" },
  { value: "나쁨", emoji: "😕", main: "리커버리", sub: "가벼운 무게" },
  { value: "좋음", emoji: "😊", main: "워킹", sub: "메인 세트" },
  { value: "최고", emoji: "💪", main: "오버로드", sub: "프로그레스" },
  { value: "불타", emoji: "🔥", main: "피크", sub: "PR 시도" },
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
    <div ref={containerRef} className="relative w-full h-full min-h-0">
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsOpen((o) => !o)}
        onKeyDown={(e) => e.key === "Enter" && setIsOpen((o) => !o)}
        className="h-full min-h-[100px] p-4 rounded-2xl border relative overflow-hidden transition-all duration-300 shadow-sm cursor-pointer hover:shadow-md flex flex-col"
        style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-light)" }}
      >
        <div className="flex items-center justify-between mb-3 relative z-10 shrink-0">
          <div className="flex items-center gap-1.5">
            <Activity
              className="w-4 h-4 transition-colors duration-300"
              style={{ color: "var(--text-sub)" }}
            />
            <p className="text-[12px] font-bold transition-colors duration-300" style={{ color: "var(--text-sub)" }}>
              오늘의 컨디션
            </p>
          </div>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-300 opacity-50 ${isOpen ? "rotate-180" : ""}`}
            style={{ color: "var(--text-sub)" }}
          />
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <p className="text-xl font-extrabold leading-none transition-colors duration-300 relative z-10" style={{ color: "var(--accent-main)" }}>
            {selected.main}
            <span className="text-sm font-extrabold ml-1 transition-colors duration-300" style={{ color: "var(--text-sub)" }}>
              {selected.emoji}
            </span>
          </p>
          <p className="text-[10px] font-extrabold mt-2 transition-colors duration-300 relative z-10" style={{ color: "var(--accent-main)" }}>
            {selected.sub}
          </p>
        </div>
        <div
          className="absolute bottom-0 left-0 right-0 h-1.5 opacity-0 transition-opacity duration-300 z-0"
          style={{ backgroundColor: "var(--accent-main)" }}
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
                  <span className="font-medium text-[13px] flex items-center gap-2" style={{ color: "var(--text-main)" }}>
                    <span>{opt.emoji}</span> {opt.main} ({opt.sub})
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
