"use client";

interface NeedStrengthModalProps {
  open: boolean;
  onClose: () => void;
  onGoToHome: () => void;
}

export default function NeedStrengthModal({
  open,
  onClose,
  onGoToHome,
}: NeedStrengthModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl border p-6" style={{ borderColor: "var(--border-light)", backgroundColor: "var(--bg-card)" }}>
        <h3 className="mb-2 font-bebas text-lg tracking-wider text-[var(--text-main)]">
          추천을 위해 데이터 설정이 필요합니다
        </h3>
        <p className="mb-6 text-sm text-[var(--text-sub)]">
          인바디·스트렝스·체력 데이터를 먼저 설정해 주세요. 레벨 탭에서
          스쿼트·벤치·데드리프트(3대) 수치를 입력하면 맞춤 추천 루틴을 받을 수
          있어요.
        </p>
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={onGoToHome}
            className="w-full rounded-xl py-3.5 font-bold hover:brightness-110"
            style={{ backgroundColor: "var(--accent-main)", color: "var(--accent-text)" }}
          >
            레벨 탭에서 설정하기
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl py-3 text-sm text-[var(--text-sub)] hover:text-[var(--text-main)]"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
