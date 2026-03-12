/**
 * 추천 모드용 더미 데이터
 * 추후 GET /api/workout/recommendation 응답과 동일한 구조
 */

export interface RecommendationExercise {
  icon: string;
  name: string;
  sets: { weight: number; reps: number }[];
}

export interface RecommendationResponse {
  date: string;
  reason?: string;
  exercises: RecommendationExercise[];
  estMinutes?: number;
}

/** 더미 추천 데이터 - 백엔드 연동 전 테스트용 */
export const MOCK_RECOMMENDATION: RecommendationResponse = {
  date: new Date().toISOString().split("T")[0],
  reason: "지난 상체 푸쉬 후 48시간 경과, 하체 루틴 추천",
  estMinutes: 50,
  exercises: [
    {
      icon: "🔥",
      name: "퍼팩트스쿼트",
      sets: [
        { weight: 60, reps: 12 },
        { weight: 70, reps: 10 },
        { weight: 80, reps: 8 },
        { weight: 80, reps: 8 },
      ],
    },
    {
      icon: "🦵",
      name: "레그익스텐션",
      sets: [
        { weight: 40, reps: 12 },
        { weight: 45, reps: 10 },
        { weight: 45, reps: 10 },
      ],
    },
    {
      icon: "🦵",
      name: "라잉레그컬",
      sets: [
        { weight: 35, reps: 12 },
        { weight: 40, reps: 10 },
        { weight: 40, reps: 10 },
      ],
    },
    {
      icon: "🦿",
      name: "이너타이",
      sets: [
        { weight: 30, reps: 15 },
        { weight: 30, reps: 15 },
      ],
    },
  ],
};

/** 날짜별 더미 추천 반환 (추후 fetch로 교체) */
export function getMockRecommendation(date?: string): RecommendationResponse {
  const d = date ?? new Date().toISOString().split("T")[0];
  return {
    ...MOCK_RECOMMENDATION,
    date: d,
  };
}
