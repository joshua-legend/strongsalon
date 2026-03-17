"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import CustomSelect from "@/components/ui/CustomSelect";
import type { OnboardingProfile } from "@/types/onboarding";

const GOAL_OPTIONS: { value: OnboardingProfile["goal"]; label: string }[] = [
  { value: "diet", label: "감량" },
  { value: "bulk", label: "근비대" },
  { value: "fitness", label: "체력증진" },
  { value: "rehab", label: "재활성운동" },
  { value: "maintain", label: "유지" },
];

const EXPERIENCE_OPTIONS: { value: OnboardingProfile["experience"]; label: string }[] = [
  { value: "first", label: "퍼스트" },
  { value: "under3m", label: "언더 3개월" },
  { value: "3m_to_1y", label: "3개월~1년" },
  { value: "1y_to_2y", label: "1년~2년" },
  { value: "over2y", label: "오버 2년" },
];

const DAYS_OPTIONS: { value: OnboardingProfile["daysPerWeek"]; label: string }[] = [
  { value: "2", label: "2일" },
  { value: "3", label: "3일" },
  { value: "4", label: "4일" },
  { value: "5+", label: "5일 이상" },
];

const MINUTES_OPTIONS: { value: OnboardingProfile["sessionMinutes"]; label: string }[] = [
  { value: "30", label: "30분" },
  { value: "45", label: "45분" },
  { value: "60", label: "60분" },
  { value: "90+", label: "90분 이상" },
];

const INJURY_OPTIONS: { value: OnboardingProfile["injury"]; label: string }[] = [
  { value: "none", label: "없음" },
  { value: "shoulder", label: "어깨" },
  { value: "back", label: "허리" },
  { value: "knee", label: "무릎" },
  { value: "other", label: "기타" },
];

const AGE_OPTIONS: { value: OnboardingProfile["ageRange"]; label: string }[] = [
  { value: "teens", label: "10대" },
  { value: "20s", label: "20대" },
  { value: "30s", label: "30대" },
  { value: "40s+", label: "40대+" },
];

const defaultOnboarding: OnboardingProfile = {
  goal: "fitness",
  experience: "first",
  daysPerWeek: "3",
  sessionMinutes: "60",
  injury: "none",
  gender: "male",
  ageRange: "20s",
};

export default function SignupPage() {
  const router = useRouter();
  const { currentAccountId, register } = useAuth();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [name, setName] = useState("");
  const [onboarding, setOnboarding] = useState<OnboardingProfile>(defaultOnboarding);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!id.trim()) {
      setError("아이디를 입력해주세요");
      return;
    }
    if (password.length < 4) {
      setError("비밀번호는 4자 이상이어야 합니다");
      return;
    }
    if (password !== passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다");
      return;
    }
    const ok = register(id.trim(), password, onboarding, name.trim() || undefined);
    if (ok) {
      router.replace("/");
    } else {
      setError("이미 사용 중인 아이디입니다");
    }
  };

  const updateOnboarding = <K extends keyof OnboardingProfile>(key: K, value: OnboardingProfile[K]) => {
    setOnboarding((prev) => ({ ...prev, [key]: value }));
  };

  if (currentAccountId) {
    router.replace("/");
    return null;
  }

  return (
    <div className="auth-page-scroll flex flex-col items-center px-5 py-8 bg-[var(--bg-body)] text-[var(--text-main)]">
      <div className="w-full max-w-[400px] flex flex-col">
        <Link href="/login" className="font-bebas text-[32px] tracking-wide leading-none mb-2">
          <span className="text-[var(--accent-main)]">Fit</span>
          <span className="text-[var(--text-sub)]">Log</span>
        </Link>
        <p className="font-bebas text-[10px] tracking-widest uppercase mb-8 text-[var(--text-sub)]">
          나의 피트니스 기록
        </p>

        <h1 className="font-bebas text-[28px] tracking-wide mb-2 text-[var(--text-main)]">
          회원가입
        </h1>
        <p className="text-[13px] mb-6 text-[var(--text-sub)]">
          맞춤 운동 추천을 위해 아래 정보를 입력해주세요
        </p>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div>
            <label className="text-xs text-[var(--text-sub)] block mb-1">아이디</label>
            <input
              type="text"
              placeholder="아이디"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="w-full h-12 rounded-xl px-4 bg-[var(--bg-card)] border border-[var(--border-light)] text-[var(--text-main)] placeholder:text-[var(--text-sub)] text-[14px] outline-none focus:border-[var(--border-focus)] transition-colors duration-300"
            />
          </div>
          <div>
            <label className="text-xs text-[var(--text-sub)] block mb-1">비밀번호</label>
            <input
              type="password"
              placeholder="4자 이상"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 rounded-xl px-4 bg-[var(--bg-card)] border border-[var(--border-light)] text-[var(--text-main)] placeholder:text-[var(--text-sub)] text-[14px] outline-none focus:border-[var(--border-focus)] transition-colors duration-300"
            />
          </div>
          <div>
            <label className="text-xs text-[var(--text-sub)] block mb-1">비밀번호 확인</label>
            <input
              type="password"
              placeholder="비밀번호 다시 입력"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className="w-full h-12 rounded-xl px-4 bg-[var(--bg-card)] border border-[var(--border-light)] text-[var(--text-main)] placeholder:text-[var(--text-sub)] text-[14px] outline-none focus:border-[var(--border-focus)] transition-colors duration-300"
            />
          </div>
          <div>
            <label className="text-xs text-[var(--text-sub)] block mb-1">이름 (선택)</label>
            <input
              type="text"
              placeholder="이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-12 rounded-xl px-4 bg-[var(--bg-card)] border border-[var(--border-light)] text-[var(--text-main)] placeholder:text-[var(--text-sub)] text-[14px] outline-none focus:border-[var(--border-focus)] transition-colors duration-300"
            />
          </div>

          <div className="border-t border-[var(--border-light)] pt-4 mt-2">
            <p className="text-[10px] text-[var(--text-sub)] font-bold tracking-widest uppercase mb-4">운동 정보</p>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-[var(--text-sub)] block mb-1">운동 목표</label>
                <CustomSelect
                  value={onboarding.goal}
                  options={GOAL_OPTIONS}
                  onChange={(v) => updateOnboarding("goal", v)}
                />
              </div>
              <div>
                <label className="text-xs text-[var(--text-sub)] block mb-1">운동해온 기간</label>
                <CustomSelect
                  value={onboarding.experience}
                  options={EXPERIENCE_OPTIONS}
                  onChange={(v) => updateOnboarding("experience", v)}
                />
              </div>
              <div>
                <label className="text-xs text-[var(--text-sub)] block mb-1">주당 운동 가능 일수</label>
                <CustomSelect
                  value={onboarding.daysPerWeek}
                  options={DAYS_OPTIONS}
                  onChange={(v) => updateOnboarding("daysPerWeek", v)}
                />
              </div>
              <div>
                <label className="text-xs text-[var(--text-sub)] block mb-1">1회 운동 가능 시간</label>
                <CustomSelect
                  value={onboarding.sessionMinutes}
                  options={MINUTES_OPTIONS}
                  onChange={(v) => updateOnboarding("sessionMinutes", v)}
                />
              </div>
              <div>
                <label className="text-xs text-[var(--text-sub)] block mb-1">부상 또는 통증</label>
                <CustomSelect
                  value={onboarding.injury}
                  options={INJURY_OPTIONS}
                  onChange={(v) => updateOnboarding("injury", v)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[var(--text-sub)] block mb-1">성별</label>
                  <CustomSelect
                    value={onboarding.gender}
                    options={[
                      { value: "male", label: "남성" },
                      { value: "female", label: "여성" },
                    ]}
                    onChange={(v) => updateOnboarding("gender", v)}
                  />
                </div>
                <div>
                  <label className="text-xs text-[var(--text-sub)] block mb-1">연령대</label>
                  <CustomSelect
                    value={onboarding.ageRange}
                    options={AGE_OPTIONS}
                    onChange={(v) => updateOnboarding("ageRange", v)}
                  />
                </div>
              </div>
            </div>
          </div>

          {error && <p className="text-[12px] text-red-400">{error}</p>}

          <button
            type="submit"
            className="w-full h-12 rounded-xl font-bold text-[14px] bg-[var(--accent-main)] text-[var(--accent-text)] hover:brightness-110 transition-all duration-300 active:scale-[0.98] mt-4"
          >
            가입하기
          </button>
        </form>

        <p className="mt-6 text-center">
          <Link href="/login" className="text-[13px] text-[var(--text-sub)] hover:text-[var(--text-main)] transition-colors duration-300">
            이미 계정이 있으신가요? 로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
