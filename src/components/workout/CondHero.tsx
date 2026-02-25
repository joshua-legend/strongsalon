'use client';

export default function CondHero() {
  return (
    <div
      className="px-5 pt-8 pb-6 relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, rgba(255,77,0,.2) 0%, var(--og-bg, #1a0900) 100%)',
      }}
    >
      <p className="font-space text-[9px] tracking-[2px] mb-2" style={{ color: 'var(--text3, var(--muted))' }}>
        READY TO START
      </p>
      <h1 className="font-bebas text-[42px] leading-none tracking-wide mb-2" style={{ color: 'var(--text)' }}>
        CHEST & TRICEPS
      </h1>
      <p className="text-[12px]" style={{ color: 'var(--text2, var(--muted2))' }}>
        가슴 + 삼두 데이 · 4종목 13세트
      </p>
    </div>
  );
}
