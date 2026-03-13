"use client";

interface ResetGoalConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ResetGoalConfirmModal({
  open,
  onClose,
  onConfirm,
}: ResetGoalConfirmModalProps) {
  if (!open) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative w-full max-w-sm rounded-2xl bg-[var(--bg-card)] border border-[var(--border-light)] p-6 shadow-xl">
        <h3 className="font-bebas text-xl text-[var(--text-main)] tracking-wider mb-2">
          목표 다시 설정하기
        </h3>
        <p className="text-sm text-[var(--text-sub)] mb-6">
          목표와 진행 기록이 모두 삭제됩니다. 정말 다시 설정하시겠습니까?
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl font-bold bg-[var(--bg-card-hover)] text-[var(--text-main)] hover:bg-[var(--border-light)] transition-colors border border-[var(--border-light)]"
          >
            아니오
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 py-3 rounded-xl font-bold bg-[var(--accent-main)] text-[var(--accent-text)] hover:brightness-110 transition-all"
          >
            예
          </button>
        </div>
      </div>
    </div>
  );
}
