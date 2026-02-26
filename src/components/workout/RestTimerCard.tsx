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
    <div
      className="rounded-xl border overflow-hidden"
      style={{ background: 'var(--s1)', borderColor: 'var(--border)' }}
    >
      <div className="py-3 px-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
        <div
          className="text-xs font-semibold"
          style={{ color: 'var(--text)', letterSpacing: '0.5px' }}
        >
          세트 휴식 타이머
        </div>
        <div className="text-[9px] font-[family-name:var(--font-space)]" style={{ color: 'var(--muted2)' }}>
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
              stroke="var(--s3)"
              strokeWidth={5}
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={leftSec === 0 ? 'var(--green)' : 'var(--orange)'}
              strokeWidth={5}
              strokeLinecap="round"
              strokeDasharray={RING_CIRC}
              strokeDashoffset={RING_CIRC - dashOffset}
              className="transition-[stroke-dashoffset] duration-300"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div
              className="font-[family-name:var(--font-bebas)] text-4xl tracking-wider leading-none"
              style={{ color: 'var(--text)' }}
            >
              {display}
            </div>
            <div className="text-[8px] font-[family-name:var(--font-space)]" style={{ color: 'var(--muted2)' }}>
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
              className={`flex-1 py-1.5 px-1 rounded-md border text-[10px] font-[family-name:var(--font-space)] text-center transition-all ${
                presetIdx === idx ? 'border-[rgba(255,77,0,.3)] bg-[rgba(255,77,0,.1)]' : 'border-[var(--border)] bg-[var(--s2)]'
              }`}
              style={{
                color: presetIdx === idx ? 'var(--orange)' : 'var(--muted2)',
              }}
            >
              {sec === 60 ? '1분' : sec === 90 ? '90초' : sec === 120 ? '2분' : '3분'}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={handleToggle}
          className="w-full py-2.5 rounded-lg border-0 text-white text-xs font-bold transition-opacity hover:opacity-85"
          style={{ background: 'linear-gradient(135deg,var(--orange),var(--og2))' }}
        >
          {running ? '⏸ 정지' : leftSec <= 0 ? '▶ 시작' : '▶ 재개'}
        </button>
      </div>
    </div>
  );
}
