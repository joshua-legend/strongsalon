"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export interface DropdownOption<T = string> {
  value: T;
  label: string;
  /** Optional emoji or icon to show before label */
  emoji?: string;
}

interface CustomDropdownProps<T = string> {
  value: T;
  options: DropdownOption<T>[];
  onChange: (value: T) => void;
  placeholder?: string;
  /** Label shown below the main value (e.g. "예상 운동시간") */
  subLabel?: string;
  /** Custom trigger: render (value, label, isOpen) => ReactNode */
  renderTrigger?: (value: T, selectedOption: DropdownOption<T> | undefined, isOpen: boolean) => React.ReactNode;
  /** Use Bebas for main value display */
  useBebasValue?: boolean;
}

export default function CustomDropdown<T = string>({
  value,
  options,
  onChange,
  placeholder = "선택",
  subLabel,
  renderTrigger,
  useBebasValue = true,
}: CustomDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        className="w-full rounded-2xl border p-4 transition-all duration-300 text-left"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-light)",
          boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        }}
      >
        {renderTrigger ? (
          renderTrigger(value, selectedOption, isOpen)
        ) : (
          <div className="flex items-center justify-between gap-2">
            <div>
              <div
                className={`${useBebasValue ? "font-bebas text-2xl tracking-wider" : ""} transition-colors duration-300`}
                style={{ color: "var(--text-main)" }}
              >
                {selectedOption ? (
                  <>
                    {selectedOption.emoji && <span className="mr-1.5">{selectedOption.emoji}</span>}
                    {selectedOption.label}
                  </>
                ) : (
                  <span style={{ color: "var(--text-sub)" }}>{placeholder}</span>
                )}
              </div>
              {subLabel && (
                <div
                  className="mt-0.5 flex items-center gap-1.5 text-[11px] font-medium transition-colors duration-300"
                  style={{ color: "var(--text-sub)" }}
                >
                  {subLabel}
                </div>
              )}
            </div>
            <ChevronDown
              className="w-4 h-4 shrink-0 transition-transform duration-300"
              style={{ color: "var(--text-sub)", transform: isOpen ? "rotate(180deg)" : undefined }}
            />
          </div>
        )}
      </button>

      {/* Dropdown menu */}
      <div
        className="absolute left-0 right-0 top-full mt-1 z-50 rounded-xl border overflow-hidden transition-all duration-300 origin-top"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-light)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? "scaleY(1)" : "scaleY(0.95)",
          pointerEvents: isOpen ? "auto" : "none",
        }}
      >
        <div className="max-h-[240px] overflow-y-auto custom-scrollbar py-1">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={String(opt.value)}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-left transition-colors duration-200"
                style={{
                  backgroundColor: isSelected ? "var(--accent-bg)" : "transparent",
                  color: isSelected ? "var(--accent-main)" : "var(--text-main)",
                }}
              >
                {opt.emoji && <span className="text-base">{opt.emoji}</span>}
                <span className="font-bebas text-sm tracking-wider">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
