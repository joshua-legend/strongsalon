'use client';

import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/components/ui/Toast';

const PRESETS = [60, 90, 120, 180];
const RING_CIRC = 2 * Math.PI * 45;

export default function RestTimerCard() {
  const { showToast } = useToast();
  const [totalSec, setTotalSec] = useState(90);
  const [leftSec, setLeftSec] = useState(90);
  const [running, setRunning] = useState(false);
  const [presetIdx, setPresetIdx] = useState(1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setLeftSec((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          intervalRef.current = null;
          setRunning(false);
          showToast('⏰ 휴식 끝! 다음 세트 시작!');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, showToast]);

  const handleSetPreset = (sec: number, idx: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTotalSec(sec);
    setLeftSec(sec);
    setRunning(false);
    setPresetIdx(idx);
  };

  const handleToggle = () => {
    if (running) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setRunning(false);
    } else {
      if (leftSec <= 0) {
        setLeftSec(totalSec);
      }
      setRunning(true);
    }
  };

  const dashOffset = totalSec ? (RING_CIRC * (totalSec - leftSec)) / totalSec : 0;
  const m = Math.floor(leftSec / 60);
  const s = leftSec % 60;
  const display = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

  return (
    <div className="rounded-xl border border-neutral-800 overflow-hidden bg-neutral-900">
      <div className="py-3 px-4 border-b border-neutral-800 flex items-center justify-between">
        <div className="text-xs font-semibold text-white tracking-wide">
          세트 휴식 타이머
        </div>
        <div className="text-[9px] font-bebas text-neutral-400">
          {running ? '카운트다운' : leftSec === 0 ? '완료 ✓' : '대기중'}
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-center mb-3.5 relative">
          <svg className="w-[120px] h-[120px] -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#262626"
              strokeWidth={5}
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={leftSec === 0 ? '#22c55e' : '#f97316'}
              strokeWidth={5}
              strokeLinecap="round"
              strokeDasharray={RING_CIRC}
              strokeDashoffset={RING_CIRC - dashOffset}
              className="transition-[stroke-dashoffset] duration-300"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div
              className="font-bebas text-4xl tracking-wider leading-none text-white"
            >
              {display}
            </div>
            <div className="text-[8px] font-bebas text-neutral-400">
              REST
            </div>
          </div>
        </div>
        <div className="flex gap-1.5 mb-2.5">
          {PRESETS.map((sec, idx) => (
            <button
              key={sec}
              type="button"
              onClick={() => handleSetPreset(sec, idx)}
              className={`flex-1 py-1.5 px-1 rounded-md border text-[10px] font-bebas text-center transition-all ${
                presetIdx === idx ? 'border-orange-500/30 bg-orange-500/10 text-orange-500' : 'border-neutral-800 bg-neutral-900 text-neutral-400'
              }`}
            >
              {sec === 60 ? '1분' : sec === 90 ? '90초' : sec === 120 ? '2분' : '3분'}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={handleToggle}
          className="w-full py-2.5 rounded-lg border-0 text-white text-xs font-bold transition-opacity hover:opacity-85 bg-gradient-to-br from-orange-500 to-orange-400"
        >
          {running ? '⏸ 정지' : leftSec <= 0 ? '▶ 시작' : '▶ 재개'}
        </button>
      </div>
    </div>
  );
}
