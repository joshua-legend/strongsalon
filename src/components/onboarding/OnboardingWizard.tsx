"use client";

import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { useQuest } from "@/context/QuestContext";
import { purposeOptions } from "@/config/purposeOptions";
import type { PurposeOptionWithIcon } from "@/config/purposeOptions";
import type { BodyFormData } from "./BodyInfo";
import GoalSelect from "./GoalSelect";
import BodyInfo from "./BodyInfo";
import TargetSet from "./TargetSet";
import InbodyTargetSet from "./InbodyTargetSet";
import type { UserProfile } from "@/types/quest";
import type { InbodyGoal } from "@/types/quest";

const defaultBodyForm: BodyFormData = {
  height: 170,
  weight: 70,
  muscleMass: null,
  bodyFatPct: null,
  liftMax: null,
  cardioTime: null,
};

export default function OnboardingWizard() {
  const { setUserProfile } = useQuest();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedPurpose, setSelectedPurpose] =
    useState<PurposeOptionWithIcon | null>(null);
  const [bodyForm, setBodyForm] = useState<BodyFormData>(defaultBodyForm);
  const [targetValue, setTargetValue] = useState<number>(0);

  useEffect(() => {
    if (!selectedPurpose) return;
    setBodyForm((prev) => ({
      ...prev,
      muscleMass: null,
      bodyFatPct: null,
      liftMax: null,
      cardioTime: null,
    }));
  }, [selectedPurpose?.id]);

  const handleConfirm = () => {
    if (!selectedPurpose) return;
    const startValue = (() => {
      switch (selectedPurpose.metricKey) {
        case "weight":
          return bodyForm.weight;
        case "muscleMass":
          return bodyForm.muscleMass ?? bodyForm.weight * 0.4;
        case "liftMax":
          return bodyForm.liftMax ?? 100;
        case "cardioTime":
          return bodyForm.cardioTime ?? 10;
        case "fatPercent":
          return bodyForm.bodyFatPct ?? 25;
        default:
          return bodyForm.weight;
      }
    })();
    const delta = Math.abs(selectedPurpose.weeklyDelta);
    const defaultTarget = startValue + selectedPurpose.weeklyDelta * 8;
    const finalTarget = targetValue || defaultTarget;

    const profile: UserProfile = {
      height: bodyForm.height,
      weight: bodyForm.weight,
      muscleMass: bodyForm.muscleMass,
      bodyFatPct: bodyForm.bodyFatPct,
      purpose: selectedPurpose,
      startValue,
      targetValue: finalTarget,
      createdAt: new Date().toISOString(),
    };
    setUserProfile(profile);
  };

  const handleInbodyConfirm = (
    inbodyGoal: InbodyGoal,
    startValue: number,
    finalTarget: number
  ) => {
    if (!selectedPurpose) return;
    const purposeWithMetric = {
      ...selectedPurpose,
      metricKey: inbodyGoal.mainMetric as "weight" | "muscleMass" | "fatPercent",
      unit: inbodyGoal.mainMetric === "fatPercent" ? "%" : "kg",
      weeklyDelta: inbodyGoal.paces[inbodyGoal.mainMetric].weeklyDelta,
    };
    const profile: UserProfile = {
      height: bodyForm.height,
      weight: bodyForm.weight,
      muscleMass: bodyForm.muscleMass,
      bodyFatPct: bodyForm.bodyFatPct,
      purpose: purposeWithMetric,
      startValue,
      targetValue: finalTarget,
      createdAt: new Date().toISOString(),
    };
    setUserProfile({ ...profile, inbodyGoal });
  };

  return (
    <div className="min-h-dvh bg-neutral-950 px-4 py-8 pb-24">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-center gap-2 mb-10">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bebas text-sm ${
                  step > s
                    ? "bg-lime-400 text-black"
                    : step === s
                      ? "bg-lime-400 text-black"
                      : "bg-neutral-800 text-neutral-500"
                }`}
              >
                {step > s ? <Check className="w-4 h-4" /> : s}
              </div>
              {s < 3 && (
                <div
                  className={`w-8 h-0.5 mx-0.5 ${
                    step > s ? "bg-lime-400" : "bg-neutral-800"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {step === 1 && (
          <GoalSelect
            selected={selectedPurpose}
            onSelect={setSelectedPurpose}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && selectedPurpose && (
          <BodyInfo
            purpose={selectedPurpose}
            form={bodyForm}
            onChange={setBodyForm}
            onNext={() => {
              setStep(3);
              const start = (() => {
                switch (selectedPurpose.metricKey) {
                  case "weight":
                    return bodyForm.weight;
                  case "muscleMass":
                    return bodyForm.muscleMass ?? bodyForm.weight * 0.4;
                  case "liftMax":
                    return bodyForm.liftMax ?? 100;
                  case "cardioTime":
                    return bodyForm.cardioTime ?? 10;
                  default:
                    return bodyForm.weight;
                }
              })();
              setTargetValue(start + selectedPurpose.weeklyDelta * 8);
            }}
            onBack={() => setStep(1)}
          />
        )}

        {step === 3 && selectedPurpose && (
          selectedPurpose.id === "cut" || selectedPurpose.id === "bulk" ? (
            <InbodyTargetSet
              purpose={selectedPurpose}
              bodyForm={bodyForm}
              onConfirm={handleInbodyConfirm}
              onBack={() => setStep(2)}
            />
          ) : (
            <TargetSet
              purpose={selectedPurpose}
              bodyForm={bodyForm}
              targetValue={targetValue}
              onTargetChange={setTargetValue}
              onConfirm={handleConfirm}
              onBack={() => setStep(2)}
            />
          )
        )}
      </div>
    </div>
  );
}
