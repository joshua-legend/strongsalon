"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
}

interface CustomSelectProps<T extends string> {
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  placeholder?: string;
  id?: string;
}

export default function CustomSelect<T extends string>({
  value,
  options,
  onChange,
  placeholder = "선택",
  id,
}: CustomSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedLabel = options.find((o) => o.value === value)?.label ?? placeholder;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        id={id}
        onClick={() => setOpen((prev) => !prev)}
        className="select-signup select-signup-trigger w-full flex items-center justify-between gap-2 text-left"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={id ? `${id}-label` : undefined}
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown
          className={`w-4 h-4 shrink-0 text-neutral-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="custom-select-dropdown absolute z-50 mt-1 w-full min-w-[160px] max-h-[220px] overflow-y-auto rounded-xl border border-neutral-700 bg-neutral-900 py-1 shadow-xl shadow-black/40"
          aria-activedescendant={value}
        >
          {options.map((opt) => {
            const isSelected = value === opt.value;
            return (
              <li
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onChange(opt.value);
                    setOpen(false);
                  }
                }}
                className={`custom-select-option cursor-pointer px-4 py-3 text-[14px] transition-colors ${
                  isSelected
                    ? "bg-lime-500/15 text-lime-400"
                    : "text-white hover:bg-neutral-800 active:bg-neutral-700"
                }`}
              >
                {opt.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
