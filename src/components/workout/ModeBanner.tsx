'use client';

import type { WorkoutMode } from '@/types';

interface ModeBannerProps {
  mode: WorkoutMode;
  onSwitch: () => void;
}

export default function ModeBanner({ mode, onSwitch }: ModeBannerProps) {
  const isTrainer = mode === 'trainer';
  return (
    <div
      className="rounded-xl p-4 flex items-center gap-3.5 relative overflow-hidden border transition-colors"
      style={
        isTrainer
          ? {
              background: 'linear-gradient(135deg,rgba(168,85,247,.12),rgba(79,142,247,.07))',
              borderColor: 'rgba(168,85,247,.25)',
            }
          : {
              background: 'linear-gradient(135deg,rgba(255,77,0,.12),rgba(255,122,51,.05))',
              borderColor: 'rgba(255,77,0,.22)',
            }
      }
    >
      <div className="text-3xl flex-shrink-0">{isTrainer ? '🤖' : '🏃'}</div>
      <div className="flex-1 min-w-0">
        <div
          className="text-[8px] font-[family-name:var(--font-space)] tracking-wider mb-1"
          style={{ color: isTrainer ? 'var(--purple)' : 'var(--orange)' }}
        >
          {isTrainer ? '// TRAINER PROGRAM' : '// FREE WORKOUT'}
        </div>
        <div className="text-[15px] font-black truncate">
          {isTrainer ? '이준호 트레이너의 오늘 루틴' : '자유 운동 모드'}
        </div>
        <div className="text-[11px] mt-0.5" style={{ color: 'var(--muted2)' }}>
          {isTrainer
            ? '가슴 + 삼두 집중일 · 주 4일 플랜 Day 1'
            : '원하는 종목을 자유롭게 추가하세요'}
        </div>
        <div
          className="inline-flex items-center gap-1 text-[9px] font-[family-name:var(--font-space)] px-2 py-0.5 rounded-full mt-1.5"
          style={{
            background: isTrainer ? 'rgba(168,85,247,.12)' : 'rgba(255,77,0,.08)',
            color: isTrainer ? 'var(--purple)' : 'var(--og3)',
            border: `1px solid ${isTrainer ? 'rgba(168,85,247,.2)' : 'rgba(255,77,0,.15)'}`,
          }}
        >
          {isTrainer ? '✓ 3일 전 배포됨' : '트레이너 처방 없이 진행 중'}
        </div>
      </div>
      <button
        type="button"
        onClick={onSwitch}
        className="flex-shrink-0 py-2 px-4 rounded-lg border text-[11px] font-bold flex items-center gap-1 transition-transform hover:-translate-y-px"
        style={{
          borderColor: isTrainer ? 'rgba(255,77,0,.28)' : 'rgba(168,85,247,.28)',
          color: isTrainer ? 'var(--og3)' : 'var(--purple)',
          background: isTrainer ? 'rgba(255,77,0,.07)' : 'rgba(168,85,247,.07)',
        }}
      >
        <span>{isTrainer ? '🏃' : '🤖'}</span>
        <span>{isTrainer ? '자유운동' : '트레이너 모드'}</span>
      </button>
    </div>
  );
}
