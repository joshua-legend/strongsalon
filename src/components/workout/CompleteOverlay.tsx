'use client';

import { useApp } from '@/context/AppContext';
import { useWorkout } from '@/context/WorkoutContext';
import { formatTime, formatVolume } from '@/utils/format';
import { useToast } from '@/components/ui/Toast';

export default function CompleteOverlay() {
  const { exitWorkout } = useApp();
  const { exercises, condition, elapsedSec, totalVolume, doneSets, totalSets, dispatch } = useWorkout();
  const { showToast } = useToast();

  const handleShare = () => {
    showToast('📤 트레이너에게 결과가 전송되었습니다!');
  };

  const handleHome = () => {
    dispatch({ type: 'RESET' });
    exitWorkout();
  };

  const condEmoji = { '최고': '🔥', '좋음': '😊', '보통': '😐', '피로': '😩', '최악': '💀' };

  return (
    <div
      className="min-h-full flex flex-col"
      style={{ background: 'var(--og-bg, #1a0900)' }}
    >
      <div
        className="px-5 pt-10 pb-8 text-center"
        style={{
          background: 'linear-gradient(180deg, rgba(255,77,0,.25) 0%, var(--og-bg, #1a0900) 100%)',
        }}
      >
        <p className="text-[48px] mb-2">🎉</p>
        <h1 className="font-bebas text-[64px] leading-none tracking-wide" style={{ color: 'var(--og, var(--orange))' }}>
          DONE!
        </h1>
        <p className="text-[12px] mt-3" style={{ color: 'var(--text2, var(--muted2))' }}>
          트레이너에게 결과가 자동 전송됩니다
        </p>
        {condition && (
          <p className="text-[11px] mt-2" style={{ color: 'var(--text3, var(--muted))' }}>
            {condEmoji[condition]} 컨디션 {condition} 으로 기록됨
          </p>
        )}
      </div>

      <div className="px-4 flex flex-col gap-4">
        <div className="grid grid-cols-3 gap-3">
          <StatBox label="총 볼륨" value={formatVolume(totalVolume)} color="var(--og, var(--orange))" />
          <StatBox label="완료 세트" value={`${doneSets}/${totalSets}`} color="var(--green)" />
          <StatBox label="운동 시간" value={`${Math.floor(elapsedSec / 60)}분`} color="var(--blue)" />
        </div>

        <div
          className="rounded-2xl p-4"
          style={{ background: 'var(--og-s1, #220c00)', border: '1px solid var(--border)' }}
        >
          <p className="font-space text-[9px] tracking-[1.5px] uppercase mb-3" style={{ color: 'var(--text3, var(--muted))' }}>
            📋 운동별 요약
          </p>
          {exercises.map((ex, i) => {
            const setsDone = ex.sets.filter(s => s.done).length;
            const vol = ex.sets.filter(s => s.done).reduce((a, s) => a + s.kg * s.reps, 0);
            return (
              <div
                key={i}
                className="flex items-center py-2.5"
                style={{ borderTop: i > 0 ? '1px solid var(--border)' : undefined }}
              >
                <span className="text-[16px] mr-3">{ex.emoji}</span>
                <div className="flex-1">
                  <p className="text-[12px] font-medium" style={{ color: 'var(--text)' }}>{ex.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-space text-[9px]" style={{ color: setsDone === ex.sets.length ? 'var(--green)' : 'var(--muted2)' }}>
                    {setsDone}/{ex.sets.length} 세트
                  </p>
                  <p className="font-bebas text-[14px]" style={{ color: 'var(--og, var(--orange))' }}>
                    {formatVolume(vol)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleShare}
          className="w-full py-3.5 rounded-xl text-[14px] font-bold"
          style={{ background: 'var(--og, var(--orange))', color: 'white' }}
        >
          📤 트레이너에게 공유하기
        </button>

        <button
          onClick={handleHome}
          className="w-full py-3 rounded-xl text-[13px]"
          style={{
            background: 'var(--og-s1, #220c00)',
            border: '1px solid var(--border)',
            color: 'var(--text2, var(--muted2))',
          }}
        >
          ← 홈으로
        </button>

        <div className="h-6" />
      </div>
    </div>
  );
}

function StatBox({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div
      className="rounded-xl p-3 text-center"
      style={{ background: 'var(--og-s1, #220c00)', border: '1px solid var(--border)' }}
    >
      <p className="font-space text-[8px] uppercase mb-1" style={{ color: 'var(--text3, var(--muted))' }}>{label}</p>
      <p className="font-bebas text-[24px] leading-none" style={{ color }}>{value}</p>
    </div>
  );
}
