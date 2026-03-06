"use client";

import { useState } from "react";
import { useInbody } from "@/context/InbodyContext";
import type { InbodyRecord } from "@/types/workout";

interface InbodyInputSheetProps {
  open: boolean;
  onClose: () => void;
}

export default function InbodyInputSheet({ open, onClose }: InbodyInputSheetProps) {
  const { addInbodyRecord } = useInbody();
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [weight, setWeight] = useState("");
  const [muscleMass, setMuscleMass] = useState("");
  const [fatMass, setFatMass] = useState("");
  const [fatPercent, setFatPercent] = useState("");
  const [bmi, setBmi] = useState("");
  const [bmr, setBmr] = useState("");

  const handleSave = () => {
    const w = parseFloat(weight);
    const m = parseFloat(muscleMass);
    const f = parseFloat(fatMass);
    const fp = parseFloat(fatPercent);
    if (isNaN(w) || w <= 0) return;

    const record: InbodyRecord = {
      date,
      weight: w,
      muscleMass: isNaN(m) || m <= 0 ? 0 : m,
      fatMass: isNaN(f) || f <= 0 ? 0 : f,
      fatPercent: isNaN(fp) || fp < 0 ? 0 : fp,
    };
    if (bmi) {
      const b = parseFloat(bmi);
      if (!isNaN(b)) record.bmi = b;
    }
    if (bmr) {
      const b = parseFloat(bmr);
      if (!isNaN(b)) record.bmr = b;
    }

    addInbodyRecord(record);

    const applyToCheckIn = confirm("체크인에 이 수치를 반영할까요?");
    if (applyToCheckIn) {
      // TODO: recordWeek with weight if diet goal
    }

    setDate(today);
    setWeight("");
    setMuscleMass("");
    setFatMass("");
    setFatPercent("");
    setBmi("");
    setBmr("");
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-t-2xl bg-neutral-900 border border-neutral-800 p-5 pb-8 max-h-[80vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-bebas text-lg text-white mb-4">인바디 입력</h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-neutral-500 block mb-1">날짜</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white"
            />
          </div>
          <div>
            <label className="text-xs text-neutral-500 block mb-1">체중 (kg) *</label>
            <input
              type="number"
              inputMode="decimal"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="70"
              className="w-full px-4 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white"
            />
          </div>
          <div>
            <label className="text-xs text-neutral-500 block mb-1">골격근량 (kg)</label>
            <input
              type="number"
              inputMode="decimal"
              value={muscleMass}
              onChange={(e) => setMuscleMass(e.target.value)}
              placeholder="30"
              className="w-full px-4 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white"
            />
          </div>
          <div>
            <label className="text-xs text-neutral-500 block mb-1">체지방량 (kg)</label>
            <input
              type="number"
              inputMode="decimal"
              value={fatMass}
              onChange={(e) => setFatMass(e.target.value)}
              placeholder="15"
              className="w-full px-4 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white"
            />
          </div>
          <div>
            <label className="text-xs text-neutral-500 block mb-1">체지방률 (%)</label>
            <input
              type="number"
              inputMode="decimal"
              value={fatPercent}
              onChange={(e) => setFatPercent(e.target.value)}
              placeholder="20"
              className="w-full px-4 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white"
            />
          </div>
          <div>
            <label className="text-xs text-neutral-500 block mb-1">BMI</label>
            <input
              type="number"
              inputMode="decimal"
              value={bmi}
              onChange={(e) => setBmi(e.target.value)}
              placeholder="22"
              className="w-full px-4 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white"
            />
          </div>
          <div>
            <label className="text-xs text-neutral-500 block mb-1">기초대사량 (kcal)</label>
            <input
              type="number"
              inputMode="decimal"
              value={bmr}
              onChange={(e) => setBmr(e.target.value)}
              placeholder="1600"
              className="w-full px-4 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white"
            />
          </div>
        </div>
        <div className="flex gap-2 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl font-bold bg-neutral-800 text-white"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!weight || parseFloat(weight) <= 0}
            className="flex-1 py-3 rounded-xl font-bold bg-lime-400 text-black disabled:opacity-40"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
