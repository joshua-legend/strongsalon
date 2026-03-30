"use client";

import { useState } from "react";
import { useInbody } from "@/context/InbodyContext";
import type { InbodyRecord } from "@/types/workout";

interface InbodyInputSheetProps {
  open: boolean;
  onClose: () => void;
  initialDate?: string;
  initialRecord?: InbodyRecord;
}

function todayIsoDate(): string {
  return new Date().toISOString().split("T")[0];
}

export default function InbodyInputSheet({
  open,
  onClose,
  initialDate,
  initialRecord,
}: InbodyInputSheetProps) {
  const { addInbodyRecord } = useInbody();

  const [date, setDate] = useState(
    () => initialDate ?? initialRecord?.date ?? todayIsoDate()
  );
  const [weight, setWeight] = useState(() =>
    initialRecord?.weight ? String(initialRecord.weight) : ""
  );
  const [muscleMass, setMuscleMass] = useState(() =>
    initialRecord?.muscleMass ? String(initialRecord.muscleMass) : ""
  );
  const [fatPercent, setFatPercent] = useState(() =>
    initialRecord?.fatPercent ? String(initialRecord.fatPercent) : ""
  );

  const handleSave = () => {
    const parsedWeight = Number.parseFloat(weight);
    const parsedMuscleMass = Number.parseFloat(muscleMass);
    const parsedFatPercent = Number.parseFloat(fatPercent);

    if (!Number.isFinite(parsedWeight) || parsedWeight <= 0) return;

    const fatMass =
      Number.isFinite(parsedFatPercent) && parsedFatPercent >= 0
        ? Math.round(parsedWeight * (parsedFatPercent / 100) * 10) / 10
        : initialRecord?.fatMass ?? 0;

    const record: InbodyRecord = {
      date,
      weight: parsedWeight,
      muscleMass:
        Number.isFinite(parsedMuscleMass) && parsedMuscleMass > 0
          ? parsedMuscleMass
          : 0,
      fatMass,
      fatPercent:
        Number.isFinite(parsedFatPercent) && parsedFatPercent >= 0
          ? parsedFatPercent
          : 0,
    };

    if (typeof initialRecord?.bmi === "number") {
      record.bmi = initialRecord.bmi;
    }

    if (typeof initialRecord?.bmr === "number") {
      record.bmr = initialRecord.bmr;
    }

    addInbodyRecord(record);
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="max-h-[80vh] w-full max-w-md overflow-auto rounded-t-2xl border p-5 pb-8"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-light)",
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <h3
          className="mb-4 font-bebas text-lg tracking-wide"
          style={{ color: "var(--text-main)" }}
        >
          인바디 기록 입력
        </h3>

        <div className="space-y-3">
          <div>
            <label
              className="mb-1 block text-xs"
              style={{ color: "var(--text-sub)" }}
            >
              날짜
            </label>
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="w-full rounded-xl border px-4 py-2"
              style={{
                backgroundColor: "var(--bg-body)",
                borderColor: "var(--border-light)",
                color: "var(--text-main)",
              }}
            />
          </div>

          <div>
            <label
              className="mb-1 block text-xs"
              style={{ color: "var(--text-sub)" }}
            >
              체중 (kg) *
            </label>
            <input
              type="number"
              inputMode="decimal"
              value={weight}
              onChange={(event) => setWeight(event.target.value)}
              placeholder="70"
              className="w-full rounded-xl border px-4 py-2"
              style={{
                backgroundColor: "var(--bg-body)",
                borderColor: "var(--border-light)",
                color: "var(--text-main)",
              }}
            />
          </div>

          <div>
            <label
              className="mb-1 block text-xs"
              style={{ color: "var(--text-sub)" }}
            >
              골격근량 (kg)
            </label>
            <input
              type="number"
              inputMode="decimal"
              value={muscleMass}
              onChange={(event) => setMuscleMass(event.target.value)}
              placeholder="30"
              className="w-full rounded-xl border px-4 py-2"
              style={{
                backgroundColor: "var(--bg-body)",
                borderColor: "var(--border-light)",
                color: "var(--text-main)",
              }}
            />
          </div>

          <div>
            <label
              className="mb-1 block text-xs"
              style={{ color: "var(--text-sub)" }}
            >
              체지방률 (%)
            </label>
            <input
              type="number"
              inputMode="decimal"
              value={fatPercent}
              onChange={(event) => setFatPercent(event.target.value)}
              placeholder="20"
              className="w-full rounded-xl border px-4 py-2"
              style={{
                backgroundColor: "var(--bg-body)",
                borderColor: "var(--border-light)",
                color: "var(--text-main)",
              }}
            />
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border py-3 text-sm font-semibold transition-colors"
            style={{
              borderColor: "var(--border-light)",
              color: "var(--text-sub)",
              backgroundColor: "var(--bg-body)",
            }}
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!weight || Number.parseFloat(weight) <= 0}
            className="flex-1 rounded-xl py-3 text-sm font-bold transition-all disabled:opacity-40"
            style={{
              backgroundColor: "var(--accent-main)",
              color: "var(--accent-text)",
            }}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
