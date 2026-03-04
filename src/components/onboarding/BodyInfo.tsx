"use client";

import type { PurposeOptionWithIcon } from "@/config/purposeOptions";
import type { PurposeId } from "@/types/quest";

export interface BodyFormData {
  height: number;
  weight: number;
  muscleMass: number | null;
  bodyFatPct: number | null;
  liftMax: number | null;
  cardioTime: number | null;
}

interface BodyInfoProps {
  purpose: PurposeOptionWithIcon;
  form: BodyFormData;
  onChange: (form: BodyFormData) => void;
  onNext: () => void;
  onBack: () => void;
}

const FIELD_RANGES: Record<
  keyof BodyFormData,
  { min: number; max: number } | null
> = {
  height: { min: 100, max: 250 },
  weight: { min: 30, max: 300 },
  muscleMass: { min: 20, max: 60 },
  bodyFatPct: { min: 5, max: 50 },
  liftMax: { min: 20, max: 500 },
  cardioTime: { min: 1, max: 120 },
};

function getRequiredFields(id: PurposeId): (keyof BodyFormData)[] {
  switch (id) {
    case "cut":
      return ["height", "weight"];
    case "bulk":
      return ["height", "weight", "muscleMass"];
    case "strength":
      return ["height", "weight", "liftMax"];
    case "endure":
      return ["height", "weight", "cardioTime"];
    default:
      return ["height", "weight"];
  }
}

function isInRange(
  key: keyof BodyFormData,
  val: number | null | undefined
): boolean {
  const range = FIELD_RANGES[key];
  if (!range || val == null) return true;
  if (typeof val !== "number" || isNaN(val)) return false;
  return val >= range.min && val <= range.max;
}

export function isStep2Valid(
  purpose: PurposeOptionWithIcon,
  form: BodyFormData
): boolean {
  const required = getRequiredFields(purpose.id);
  for (const key of required) {
    const val = form[key];
    if (val == null || (typeof val === "number" && (val <= 0 || isNaN(val))))
      return false;
    if (!isInRange(key, val)) return false;
  }
  if (form.bodyFatPct != null && form.bodyFatPct > 0 && !isInRange("bodyFatPct", form.bodyFatPct))
    return false;
  return true;
}

interface InputRowProps {
  label: string;
  value: number;
  onChangeVal: (v: number) => void;
  unit: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  isRequired?: boolean;
}

function InputRow({
  label,
  value,
  onChangeVal,
  unit,
  placeholder,
  min = 0,
  max = 300,
  step = 0.1,
  isRequired,
}: InputRowProps) {
  const displayValue = value === 0 ? "" : String(value);
  return (
    <div className={isRequired ? "border-l-2 border-lime-400/50 pl-3" : ""}>
      <label className="text-xs text-neutral-500 flex justify-between mb-1">
        <span>{label}</span>
        <span className="font-mono text-lg text-lime-400">
          {value ? `${value}${unit}` : ""}
        </span>
      </label>
      <input
        type="number"
        inputMode="decimal"
        min={min}
        max={max}
        step={step}
        value={displayValue}
        placeholder={placeholder}
        onChange={(e) => {
          const raw = e.target.value;
          if (raw === "") {
            onChangeVal(0);
            return;
          }
          const num = Number(raw);
          onChangeVal(isNaN(num) ? 0 : num);
        }}
        className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 font-mono text-lg text-white focus:border-lime-400 focus:outline-none placeholder:text-neutral-600"
      />
    </div>
  );
}

export default function BodyInfo({
  purpose,
  form,
  onChange,
  onNext,
  onBack,
}: BodyInfoProps) {
  const isValid = isStep2Valid(purpose, form);

  return (
    <div className="animate-slide-up-quest">
      <h2 className="font-bebas text-2xl text-white tracking-wider mb-6">
        현재 상태를 알려주세요
      </h2>
      <div className="space-y-4 mb-8">
        <InputRow
          label="키 (cm)"
          value={form.height}
          onChangeVal={(v) => onChange({ ...form, height: v })}
          unit="cm"
          placeholder="170"
          min={100}
          max={250}
          step={0.1}
          isRequired
        />
        <InputRow
          label="몸무게 (kg)"
          value={form.weight}
          onChangeVal={(v) => onChange({ ...form, weight: v })}
          unit="kg"
          placeholder="70"
          min={30}
          max={300}
          step={0.1}
          isRequired
        />
        {purpose.id === "bulk" && (
          <InputRow
            label="골격근량 (kg)"
            value={form.muscleMass ?? 0}
            onChangeVal={(v) =>
              onChange({ ...form, muscleMass: v > 0 ? v : null })
            }
            unit="kg"
            placeholder="30"
            min={20}
            max={60}
            step={0.1}
            isRequired
          />
        )}
        {purpose.id === "cut" && (
          <InputRow
            label="체지방률 (%) - 선택"
            value={form.bodyFatPct ?? 0}
            onChangeVal={(v) =>
              onChange({ ...form, bodyFatPct: v > 0 ? v : null })
            }
            unit="%"
            placeholder="20 (선택)"
            min={5}
            max={50}
            step={0.1}
          />
        )}
        {purpose.id === "strength" && (
          <InputRow
            label="1RM 중량 (kg)"
            value={form.liftMax ?? 0}
            onChangeVal={(v) =>
              onChange({ ...form, liftMax: v > 0 ? v : null })
            }
            unit="kg"
            placeholder="100"
            min={20}
            max={500}
            step={2.5}
            isRequired
          />
        )}
        {purpose.id === "endure" && (
          <InputRow
            label="연속 유산소 시간 (분)"
            value={form.cardioTime ?? 0}
            onChangeVal={(v) =>
              onChange({ ...form, cardioTime: v > 0 ? v : null })
            }
            unit="분"
            placeholder="30"
            min={1}
            max={120}
            step={1}
            isRequired
          />
        )}
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-3 text-neutral-500 hover:text-white transition-colors"
        >
          이전
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!isValid}
          className="flex-1 py-4 rounded-xl font-bold text-lg bg-lime-400 text-black disabled:opacity-40 disabled:pointer-events-none hover:brightness-110 transition-all"
        >
          다음
        </button>
      </div>
    </div>
  );
}
