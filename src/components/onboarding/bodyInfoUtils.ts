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

const FIELD_RANGES: Record<keyof BodyFormData, { min: number; max: number } | null> = {
  height: { min: 100, max: 250 },
  weight: { min: 30, max: 300 },
  muscleMass: { min: 20, max: 60 },
  bodyFatPct: { min: 5, max: 50 },
  liftMax: { min: 20, max: 500 },
  cardioTime: { min: 1, max: 120 },
};

function getRequiredFields(id: PurposeId): (keyof BodyFormData)[] {
  switch (id) {
    case "cut": return ["height", "weight"];
    case "bulk": return ["height", "weight", "muscleMass"];
    case "strength": return ["height", "weight", "liftMax"];
    case "endure": return ["height", "weight", "cardioTime"];
    default: return ["height", "weight"];
  }
}

function isInRange(key: keyof BodyFormData, val: number | null | undefined): boolean {
  const range = FIELD_RANGES[key];
  if (!range || val == null) return true;
  if (typeof val !== "number" || isNaN(val)) return false;
  return val >= range.min && val <= range.max;
}

export function isStep2Valid(purpose: PurposeOptionWithIcon, form: BodyFormData): boolean {
  const required = getRequiredFields(purpose.id);
  for (const key of required) {
    const val = form[key];
    if (val == null || (typeof val === "number" && (val <= 0 || isNaN(val)))) return false;
    if (!isInRange(key, val)) return false;
  }
  if (form.bodyFatPct != null && form.bodyFatPct > 0 && !isInRange("bodyFatPct", form.bodyFatPct))
    return false;
  return true;
}
