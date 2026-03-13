'use client';

import { useApp } from '@/context/AppContext';

export default function TodayCTA() {
  const { enterWorkout } = useApp();

  return (
    <button
      onClick={enterWorkout}
      className="w-full rounded-2xl p-5 relative overflow-hidden text-left group"
      style={{
        background: 'linear-gradient(135deg, #f97316, #fb923c)',
      }}
    >
      <div className="flex items-center gap-4">
        <span className="text-[32px]">🏋️</span>
        <div className="flex-1 min-w-0">
          <p className="text-[16px] font-bold text-[var(--text-main)] mb-0.5">오늘의 운동 시작</p>
          <p className="text-[11px] text-[var(--text-main)]/70">
            가슴 + 삼두 데이 · 4종목 13세트 · 약 75분
          </p>
        </div>
        <span className="text-[20px] text-[var(--text-main)]/60 group-hover:translate-x-1 transition-transform">›</span>
      </div>

      <div
        className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.15), transparent)',
        }}
      />
    </button>
  );
}
