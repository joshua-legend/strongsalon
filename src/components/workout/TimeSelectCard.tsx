"use client";

import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { Timer, ChevronDown } from "lucide-react";

const TIME_OPTIONS = [
  { value: 30, label: "짧게" },
  { value: 45, label: "조금 짧게" },
  { value: 60, label: "보통" },
  { value: 75, label: "조금 길게" },
  { value: 90, label: "길게" },
  { value: 120, label: "아주 길게" },
] as const;

interface TimeSelectCardProps {
  value: number;
  onChange: (v: number) => void;
}

export default function TimeSelectCard({ value, onChange }: TimeSelectCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = TIME_OPTIONS.find((o) => o.value === value) ?? TIME_OPTIONS[2];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      const inContainer = containerRef.current?.contains(target);
      const portal = document.getElementById("time-dropdown-portal");
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
      const portal = document.getElementById("time-dropdown-portal");
      if (portal) {
        portal.style.top = `${rect.bottom + 8}px`;
        portal.style.left = `${rect.left}px`;
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
            <Timer
              className="w-4 h-4 transition-colors duration-300"
              style={{ color: "var(--text-sub)" }}
            />
            <p className="text-[12px] font-bold transition-colors duration-300" style={{ color: "var(--text-sub)" }}>
              운동 시간
            </p>
          </div>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-300 opacity-50 ${isOpen ? "rotate-180" : ""}`}
            style={{ color: "var(--text-sub)" }}
          />
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <p className="font-bebas text-4xl leading-none transition-colors duration-300 relative z-10" style={{ color: "var(--accent-main)" }}>
            {selected.value}
            <span className="text-base font-sans font-bold ml-1 transition-colors duration-300" style={{ color: "var(--text-sub)" }}>
              min
            </span>
          </p>
          <p className="text-[10px] font-bold mt-2 transition-colors duration-300 relative z-10" style={{ color: "var(--accent-main)" }}>
            {selected.label}
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
            id="time-dropdown-portal"
            className="fixed w-[240px] rounded-xl border shadow-xl z-[100] overflow-hidden animate-zoom-in-95"
            style={{
              backgroundColor: "var(--bg-body)",
              borderColor: "var(--border-light)",
            }}
          >
            <div className="max-h-[280px] overflow-y-auto custom-scroll py-1.5">
              {TIME_OPTIONS.map((opt) => (
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
                  <span className="font-bold text-[13px]" style={{ color: "var(--text-main)" }}>
                    {opt.label}
                  </span>
                  <span className="font-bebas text-lg" style={{ color: "var(--accent-main)" }}>
                    {opt.value} <span className="text-xs" style={{ color: "var(--text-sub)" }}>min</span>
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
