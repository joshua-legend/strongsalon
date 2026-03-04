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
      <div className="relative w-full max-w-sm rounded-2xl bg-neutral-900 border border-neutral-700 p-6 shadow-xl">
        <h3 className="font-bebas text-xl text-white tracking-wider mb-2">
          목표 다시 설정하기
        </h3>
        <p className="text-sm text-neutral-400 mb-6">
          목표와 진행 기록이 모두 삭제됩니다. 정말 다시 설정하시겠습니까?
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl font-bold bg-neutral-800 text-white hover:bg-neutral-700 transition-colors border border-neutral-700"
          >
            아니오
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 py-3 rounded-xl font-bold bg-lime-400 text-black hover:brightness-110 transition-all"
          >
            예
          </button>
        </div>
      </div>
    </div>
  );
}
