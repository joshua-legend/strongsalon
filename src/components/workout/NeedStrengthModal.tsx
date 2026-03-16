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
      <div className="rounded-2xl bg-neutral-900 border border-neutral-700 p-6 max-w-sm w-full">
        <h3 className="font-bebas text-lg tracking-wider text-white mb-2">
          추천을 위해 데이터 설정이 필요합니다
        </h3>
        <p className="text-sm text-neutral-400 mb-6">
          인바디·스트렝스·체력 데이터를 먼저 설정해 주세요. 홈에서 스쿼트·벤치·데드리프트(3대) 수치를 입력하면 맞춤 추천 루틴을 받을 수 있어요.
        </p>
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={onGoToHome}
            className="w-full py-3.5 rounded-xl font-bold bg-lime-400 text-black hover:brightness-110"
          >
            홈에서 설정하기
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-xl text-sm text-neutral-400 hover:text-white"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
