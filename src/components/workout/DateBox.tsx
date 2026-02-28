'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight, CalendarCheck, CalendarDays } from 'lucide-react';

interface DateBoxProps {
  value: string;   // "YYYY-MM-DD"
  onChange: (value: string) => void;
}

const KOR_DAYS = ['일', '월', '화', '수', '목', '금', '토'];
const ENG_DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const KOR_MONTHS = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getTodayStr(): string {
  return formatDate(new Date());
}

export default function DateBox({ value, onChange }: DateBoxProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const date = parseLocalDate(value);
  const today = getTodayStr();
  const isToday = value === today;
  const dow = date.getDay();

  function shiftDay(delta: number) {
    const d = parseLocalDate(value);
    d.setDate(d.getDate() + delta);
    onChange(formatDate(d));
  }

  function openPicker() {
    const el = inputRef.current;
    if (!el) return;
    if (typeof el.showPicker === 'function') {
      try { el.showPicker(); } catch { el.click(); }
    } else {
      el.click();
    }
  }

  return (
    <div
      className="rounded-2xl border p-5 transition-all duration-300"
      style={{
        background: '#050505',
        borderColor: isToday ? 'rgba(163,230,53,.5)' : 'rgba(255,255,255,.06)',
        boxShadow: isToday
          ? '0 0 12px rgba(163,230,53,.3)'
          : '0 0 15px rgba(0,0,0,.3)',
      }}
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5">
          {isToday ? (
            <CalendarCheck size={12} style={{ color: 'rgb(163, 230, 53)', filter: 'drop-shadow(0 0 6px rgba(163,230,53,.6))' }} />
          ) : (
            <CalendarDays size={12} style={{ color: '#fff' }} />
          )}
          <span className="font-bebas text-[11px] tracking-widest" style={{ color: 'rgba(163,230,53,.45)' }}>
            WORKOUT DATE
          </span>
        </div>

        {isToday ? (
          <span className="font-bebas text-[10px] tracking-widest" style={{ color: 'rgb(163, 230, 53)', textShadow: '0 0 10px rgba(163,230,53,.7)' }}>
            TODAY ✓
          </span>
        ) : (
          <button
            type="button"
            onClick={() => onChange(today)}
            className="font-bebas text-[10px] px-2.5 py-1 rounded-lg border tracking-widest transition-all hover:shadow-[0_0_15px_rgba(163,230,53,.3)]"
            style={{ borderColor: 'rgba(163,230,53,.4)', color: 'rgb(163, 230, 53)', textShadow: '0 0 6px rgba(163,230,53,.4)' }}
          >
            오늘
          </button>
        )}
      </div>

      {/* ── Date Navigator ── */}
      <div className="flex items-center justify-between gap-3">
        {/* Prev */}
        <button
          type="button"
          onClick={() => shiftDay(-1)}
          className="w-10 h-10 rounded-xl flex items-center justify-center border active:scale-95 transition-all shrink-0 hover:shadow-[0_0_15px_rgba(163,230,53,.2)]"
          style={{ borderColor: 'rgba(255,255,255,.08)', color: 'rgba(163,230,53,.5)' }}
        >
          <ChevronLeft size={18} />
        </button>

        {/* Date Center — tap to open native picker */}
        <button
          type="button"
          onClick={openPicker}
          className="flex-1 flex flex-col items-center gap-1 py-1 active:opacity-70 transition-opacity"
        >
          {/* Day row */}
          <div className="flex items-baseline gap-2.5">
            <span className="font-bebas text-[14px] tracking-wider leading-none" style={{ color: isToday ? 'rgba(163,230,53,.8)' : '#fff' }}>
              {KOR_DAYS[dow]}요일
            </span>
            <span
              className="font-bebas leading-none tracking-wide"
              style={{
                fontSize: '36px',
                color: isToday ? 'rgb(163, 230, 53)' : '#e5e5e5',
                textShadow: isToday ? '0 0 15px rgba(163,230,53,.8), 0 0 35px rgba(163,230,53,.4)' : 'none',
              }}
            >
              {String(date.getDate()).padStart(2, '0')}
            </span>
            <span
              className="font-bebas text-[14px] tracking-wider leading-none"
              style={{ color: isToday ? 'rgba(163,230,53,.9)' : '#fff', textShadow: isToday ? '0 0 6px rgba(163,230,53,.4)' : 'none' }}
            >
              {ENG_DAYS[dow]}
            </span>
          </div>

          {/* Year · Month */}
          <span className="font-bebas text-[12px] tracking-widest" style={{ color: '#fff' }}>
            {date.getFullYear()} · {KOR_MONTHS[date.getMonth()]}
          </span>
        </button>

        {/* Next */}
        <button
          type="button"
          onClick={() => shiftDay(1)}
          className="w-10 h-10 rounded-xl flex items-center justify-center border active:scale-95 transition-all shrink-0 hover:shadow-[0_0_15px_rgba(163,230,53,.2)]"
          style={{ borderColor: 'rgba(255,255,255,.08)', color: 'rgba(163,230,53,.5)' }}
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* ── Hidden native input ── */}
      <input
        ref={inputRef}
        type="date"
        value={value}
        onChange={(e) => e.target.value && onChange(e.target.value)}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
      />
    </div>
  );
}
