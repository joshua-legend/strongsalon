"use client";

interface CategoryNotConfiguredProps {
  categoryLabel: string;
  onSetupClick: () => void;
}

export default function CategoryNotConfigured({
  categoryLabel,
  onSetupClick,
}: CategoryNotConfiguredProps) {
  return (
    <div className="py-12 px-4 text-center">
      <p className="text-sm text-[var(--text-sub)] mb-4">
        {categoryLabel} 설정을 하지 않았습니다
      </p>
      <p className="text-xs text-[var(--text-sub)] mb-6">
        초기 설정을 완료하면 기록 추이를 확인할 수 있습니다
      </p>
      <button
        type="button"
        onClick={onSetupClick}
        className="px-6 py-3 rounded-xl font-bold bg-[var(--accent-main)] text-[var(--accent-text)] hover:brightness-110 transition-all"
      >
        설정하기
      </button>
    </div>
  );
}
