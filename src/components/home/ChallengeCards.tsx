'use client';

import ProgressBar from '@/components/ui/ProgressBar';

export default function ChallengeCards() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="card">
        <p className="card-label mb-2">🎯 이번 주 챌린지</p>
        <p className="font-bebas text-[26px] leading-none" style={{ color: 'var(--green)' }}>
          3<span className="text-[14px]" style={{ color: 'var(--muted2)' }}>/4</span>
        </p>
        <p className="text-[10px] mt-1 mb-3" style={{ color: 'var(--muted2)' }}>
          🥕 1회 더 출석하면 달성!
        </p>
        <ProgressBar value={75} color="var(--green)" />
      </div>

      <div className="card">
        <p className="card-label mb-2">📅 이번 달 출석</p>
        <p className="font-bebas text-[26px] leading-none" style={{ color: 'var(--orange)' }}>
          16<span className="text-[14px]" style={{ color: 'var(--muted2)' }}>/22회</span>
        </p>
        <p className="text-[10px] mt-1 mb-3" style={{ color: 'var(--muted2)' }}>
          출석률 73%
        </p>
        <ProgressBar value={73} color="var(--orange)" />
      </div>
    </div>
  );
}
