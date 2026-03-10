"use client";

import { createPortal } from "react-dom";

interface CategoryResetConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  categoryLabel: string;
}

export default function CategoryResetConfirmModal({
  open,
  onClose,
  onConfirm,
  categoryLabel,
}: CategoryResetConfirmModalProps) {
  if (!open) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const modal = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 z-[9999] bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative z-[10000] w-full max-w-sm rounded-2xl bg-neutral-900 border border-neutral-700 p-6 shadow-xl">
        <h3 className="font-bebas text-xl text-white tracking-wider mb-2">
          {categoryLabel} 목표 다시 설정
        </h3>
        <p className="text-sm text-neutral-400 mb-6">
          {categoryLabel} 목표를 다시 설정할까요? 현재 진행 기록은 히스토리로 보관되며, 새로운 4주 사이클이 시작됩니다.
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl font-bold bg-neutral-800 text-white hover:bg-neutral-700 transition-colors border border-neutral-700"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 py-3 rounded-xl font-bold bg-lime-400 text-black hover:brightness-110 transition-all"
          >
            다시 설정
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
