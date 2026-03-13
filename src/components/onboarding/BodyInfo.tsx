"use client";

import type { PurposeOptionWithIcon } from "@/config/purposeOptions";
import type { BodyFormData } from "./bodyInfoUtils";
import { isStep2Valid } from "./bodyInfoUtils";
import { InputRow } from "./BodyInfoInputRow";

export type { BodyFormData };

interface BodyInfoProps {
  purpose: PurposeOptionWithIcon;
  form: BodyFormData;
  onChange: (form: BodyFormData) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function BodyInfo({ purpose, form, onChange, onNext, onBack }: BodyInfoProps) {
  const isValid = isStep2Valid(purpose, form);

  return (
    <div className="animate-slide-up-quest">
      <h2 className="font-bebas text-2xl text-[var(--text-main)] tracking-wider mb-6">현재 상태를 알려주세요</h2>
      <div className="space-y-4 mb-8">
        <InputRow label="키 (cm)" value={form.height} onChangeVal={(v) => onChange({ ...form, height: v })}
          unit="cm" placeholder="170" min={100} max={250} step={0.1} isRequired />
        <InputRow label="몸무게 (kg)" value={form.weight} onChangeVal={(v) => onChange({ ...form, weight: v })}
          unit="kg" placeholder="70" min={30} max={300} step={0.1} isRequired />

        {(purpose.id === "bulk" || purpose.id === "cut") && (
          <InputRow label="골격근량 (kg)" value={form.muscleMass ?? 0}
            onChangeVal={(v) => onChange({ ...form, muscleMass: v > 0 ? v : null })}
            unit="kg" placeholder="30" min={20} max={60} step={0.1}
            isRequired={purpose.id === "bulk"} />
        )}
        {(purpose.id === "cut" || purpose.id === "bulk") && (
          <InputRow label="체지방률 (%)" value={form.bodyFatPct ?? 0}
            onChangeVal={(v) => onChange({ ...form, bodyFatPct: v > 0 ? v : null })}
            unit="%" placeholder="25" min={5} max={50} step={0.1} />
        )}
        {purpose.id === "strength" && (
          <InputRow label="1RM 중량 (kg)" value={form.liftMax ?? 0}
            onChangeVal={(v) => onChange({ ...form, liftMax: v > 0 ? v : null })}
            unit="kg" placeholder="100" min={20} max={500} step={2.5} isRequired />
        )}
        {purpose.id === "endure" && (
          <InputRow label="연속 유산소 시간 (분)" value={form.cardioTime ?? 0}
            onChangeVal={(v) => onChange({ ...form, cardioTime: v > 0 ? v : null })}
            unit="분" placeholder="30" min={1} max={120} step={1} isRequired />
        )}
      </div>
      <div className="flex gap-3">
        <button type="button" onClick={onBack} className="px-4 py-3 text-[var(--text-sub)] hover:text-[var(--text-main)] transition-colors">
          이전
        </button>
        <button type="button" onClick={onNext} disabled={!isValid}
          className="flex-1 py-4 rounded-xl font-bold text-lg bg-[var(--accent-main)] text-[var(--accent-text)] disabled:opacity-40 disabled:pointer-events-none hover:brightness-110 transition-all">
          다음
        </button>
      </div>
    </div>
  );
}
