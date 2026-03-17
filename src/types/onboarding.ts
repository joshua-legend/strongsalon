/** 가입 시 수집하는 온보딩 정보 (5~6개) */

export type OnboardingGoal =
  | "diet"      // 감량
  | "bulk"      // 근비대
  | "fitness"   // 체력증진
  | "rehab"     // 재활성운동
  | "maintain"; // 유지

export type OnboardingExperience =
  | "first"      // 퍼스트 (처음)
  | "under3m"    // 3개월 미만
  | "3m_to_1y"   // 3개월~1년
  | "1y_to_2y"   // 1년~2년
  | "over2y";    // 2년 이상

export type OnboardingDaysPerWeek = "2" | "3" | "4" | "5+";

export type OnboardingSessionMinutes = "30" | "45" | "60" | "90+";

export type OnboardingInjury =
  | "none"
  | "shoulder"
  | "back"
  | "knee"
  | "other";

export type OnboardingAgeRange = "teens" | "20s" | "30s" | "40s+";

export interface OnboardingProfile {
  goal: OnboardingGoal;
  experience: OnboardingExperience;
  daysPerWeek: OnboardingDaysPerWeek;
  sessionMinutes: OnboardingSessionMinutes;
  injury: OnboardingInjury;
  gender: "male" | "female";
  ageRange: OnboardingAgeRange;
}
