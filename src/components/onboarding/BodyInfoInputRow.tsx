"use client";

export interface InputRowProps {
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

export function InputRow({
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
      <label className="text-xs text-neutral-500 block mb-1">
        {label}
        {isRequired && <span className="text-orange-400"> *</span>}
      </label>
      <div className="flex items-center gap-2">
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
            if (raw === "") { onChangeVal(0); return; }
            const num = Number(raw);
            onChangeVal(isNaN(num) ? 0 : num);
          }}
          className="flex-1 px-4 py-3.5 rounded-xl bg-neutral-900 border border-neutral-800 font-mono text-lg text-white focus:border-lime-400 focus:outline-none placeholder:text-neutral-600"
        />
        <span className="text-neutral-600 font-mono text-sm shrink-0">{unit}</span>
      </div>
    </div>
  );
}
