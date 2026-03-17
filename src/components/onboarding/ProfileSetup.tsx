"use client";

import { useState } from "react";
import type { UserProfile, Gender, Experience } from "@/types/profile";
import { InputRow } from "./BodyInfoInputRow";

interface ProfileSetupProps {
  onComplete: (profile: UserProfile) => void;
}

const EXPERIENCE_OPTIONS: { id: Experience; label: string }[] = [
  { id: "untrained", label: "언트레인드" },
  { id: "novice", label: "노비스" },
  { id: "intermediate", label: "인터미디어트" },
  { id: "advanced", label: "어드밴스드" },
  { id: "elite", label: "엘리트" },
];

export default function ProfileSetup({ onComplete }: ProfileSetupProps) {
  const [nickname, setNickname] = useState("");
  const [gender, setGender] = useState<Gender | null>(null);
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(70);
  const [experience, setExperience] = useState<Experience>("novice");

  const birthDate =
    birthYear && birthMonth && birthDay
      ? `${birthYear.padStart(4, "0")}-${birthMonth.padStart(2, "0")}-${birthDay.padStart(2, "0")}`
      : "";

  const isValid =
    nickname.trim().length > 0 &&
    gender !== null &&
    birthYear.length === 4 &&
    birthMonth.length >= 1 &&
    birthDay.length >= 1 &&
    height >= 100 &&
    height <= 250 &&
    weight >= 30 &&
    weight <= 300;

  const handleSubmit = () => {
    if (!isValid || !gender) return;
    const profile: UserProfile = {
      nickname: nickname.trim(),
      gender,
      birthDate,
      height,
      weight,
      experience,
      createdAt: new Date().toISOString(),
    };
    onComplete(profile);
  };

  return (
    <div className="animate-slide-up-quest">
      <h2 className="font-bebas text-2xl text-white tracking-wider mb-2">
        FitLog에 오신 것을 환영합니다
      </h2>
      <p className="text-sm text-neutral-500 mb-6">
        기본 정보를 입력해주세요
      </p>

      <div className="space-y-4 mb-8">
        <div>
          <label className="text-xs text-neutral-500 block mb-1">
            닉네임 <span className="text-orange-400">*</span>
          </label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Joshua"
            className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-lg text-white focus:border-lime-400 focus:outline-none placeholder:text-neutral-600"
          />
        </div>

        <div>
          <label className="text-xs text-neutral-500 block mb-2">
            성별 <span className="text-orange-400">*</span>
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setGender("male")}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                gender === "male"
                  ? "bg-lime-400 text-black"
                  : "bg-neutral-900 border border-neutral-800 text-neutral-500"
              }`}
            >
              남성
            </button>
            <button
              type="button"
              onClick={() => setGender("female")}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                gender === "female"
                  ? "bg-lime-400 text-black"
                  : "bg-neutral-900 border border-neutral-800 text-neutral-500"
              }`}
            >
              여성
            </button>
          </div>
        </div>

        <div>
          <label className="text-xs text-neutral-500 block mb-2">
            생년월일 <span className="text-orange-400">*</span>
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              inputMode="numeric"
              value={birthYear}
              onChange={(e) => setBirthYear(e.target.value.slice(0, 4))}
              placeholder="1995"
              min={1900}
              max={2010}
              className="flex-1 px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 font-mono text-lg text-white focus:border-lime-400 focus:outline-none placeholder:text-neutral-600"
            />
            <span className="text-neutral-500 self-center">/</span>
            <input
              type="number"
              inputMode="numeric"
              value={birthMonth}
              onChange={(e) => setBirthMonth(e.target.value.slice(0, 2))}
              placeholder="03"
              min={1}
              max={12}
              className="w-16 px-3 py-3 rounded-xl bg-neutral-900 border border-neutral-800 font-mono text-lg text-white focus:border-lime-400 focus:outline-none placeholder:text-neutral-600 text-center"
            />
            <span className="text-neutral-500 self-center">/</span>
            <input
              type="number"
              inputMode="numeric"
              value={birthDay}
              onChange={(e) => setBirthDay(e.target.value.slice(0, 2))}
              placeholder="15"
              min={1}
              max={31}
              className="w-16 px-3 py-3 rounded-xl bg-neutral-900 border border-neutral-800 font-mono text-lg text-white focus:border-lime-400 focus:outline-none placeholder:text-neutral-600 text-center"
            />
          </div>
        </div>

        <InputRow
          label="키"
          value={height}
          onChangeVal={setHeight}
          unit="cm"
          placeholder="178"
          min={100}
          max={250}
          step={0.1}
          isRequired
        />
        <InputRow
          label="몸무게"
          value={weight}
          onChangeVal={setWeight}
          unit="kg"
          placeholder="80"
          min={30}
          max={300}
          step={0.1}
          isRequired
        />

        <div>
          <label className="text-xs text-neutral-500 block mb-2">
            훈련 수준 (선택)
          </label>
          <div className="grid grid-cols-5 gap-2">
            {EXPERIENCE_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setExperience(opt.id)}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                  experience === opt.id
                    ? "bg-lime-400 text-black"
                    : "bg-neutral-900 border border-neutral-800 text-neutral-500"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!isValid}
        className="w-full py-4 rounded-xl font-bold text-lg bg-lime-400 text-black disabled:opacity-40 disabled:pointer-events-none hover:brightness-110 transition-all"
      >
        다음
      </button>
    </div>
  );
}
