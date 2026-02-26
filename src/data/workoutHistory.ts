/** 날짜별 운동 기록 (종목 + 세트) */
export interface DayExercise {
  icon: string;
  name: string;
  sets: { weight: number; reps: number }[];
}

export interface DayWorkoutRecord {
  date: string;
  type: 'pt' | 'self' | 'both';
  exercises: DayExercise[];
  cardio?: { type: string; label: string; value: string };
}

export const workoutHistory: DayWorkoutRecord[] = [
  { date: '2026-1-2', type: 'pt', exercises: [{ icon: '🏋️', name: '벤치프레스', sets: [{ weight: 60, reps: 12 }, { weight: 80, reps: 8 }, { weight: 95, reps: 5 }] }, { icon: '📐', name: '인클라인 덤벨 프레스', sets: [{ weight: 12, reps: 10 }, { weight: 12, reps: 10 }] }] },
  { date: '2026-1-3', type: 'self', exercises: [{ icon: '🦵', name: '레그익스텐션', sets: [{ weight: 40, reps: 15 }, { weight: 45, reps: 12 }] }, { icon: '🦵', name: '라잉레그컬', sets: [{ weight: 35, reps: 12 }, { weight: 35, reps: 10 }] }], cardio: { type: 'run', label: '러닝', value: '3km / 18분' } },
  { date: '2026-1-6', type: 'pt', exercises: [{ icon: '⬇️', name: '랫풀다운', sets: [{ weight: 50, reps: 10 }, { weight: 55, reps: 8 }, { weight: 55, reps: 8 }] }, { icon: '🚣', name: '시티드로우', sets: [{ weight: 45, reps: 10 }, { weight: 45, reps: 10 }] }] },
  { date: '2026-1-7', type: 'self', exercises: [{ icon: '🏋️', name: '스쿼트', sets: [{ weight: 60, reps: 10 }, { weight: 80, reps: 8 }, { weight: 80, reps: 6 }] }], cardio: { type: 'row', label: '로잉', value: '2km / 9분' } },
  { date: '2026-1-8', type: 'both', exercises: [{ icon: '🏋️', name: '벤치프레스', sets: [{ weight: 70, reps: 8 }, { weight: 85, reps: 5 }] }, { icon: '💪', name: '케이블 트라이셉스', sets: [{ weight: 25, reps: 12 }, { weight: 25, reps: 12 }] }], cardio: { type: 'cycle', label: '사이클', value: '20분' } },
  { date: '2026-1-10', type: 'pt', exercises: [{ icon: '🏋️', name: '숄더프레스', sets: [{ weight: 40, reps: 10 }, { weight: 45, reps: 8 }, { weight: 45, reps: 6 }] }, { icon: '🦋', name: '팩덱플라이', sets: [{ weight: 20, reps: 12 }, { weight: 22, reps: 10 }] }] },
  { date: '2026-1-13', type: 'pt', exercises: [{ icon: '🏋️', name: '데드리프트', sets: [{ weight: 80, reps: 6 }, { weight: 100, reps: 5 }, { weight: 100, reps: 4 }] }, { icon: '🦵', name: '레그컬', sets: [{ weight: 40, reps: 12 }, { weight: 40, reps: 10 }] }] },
  { date: '2026-1-14', type: 'self', exercises: [{ icon: '⬇️', name: '랫풀다운', sets: [{ weight: 45, reps: 12 }, { weight: 50, reps: 10 }] }, { icon: '💪', name: '바이셉 컬', sets: [{ weight: 12, reps: 12 }, { weight: 12, reps: 10 }] }] },
  { date: '2026-1-15', type: 'both', exercises: [{ icon: '🏋️', name: '벤치프레스', sets: [{ weight: 65, reps: 10 }, { weight: 80, reps: 6 }, { weight: 90, reps: 4 }] }, { icon: '📐', name: '인클라인 프레스', sets: [{ weight: 50, reps: 10 }, { weight: 55, reps: 8 }] }] },
  { date: '2026-1-17', type: 'self', exercises: [{ icon: '🦵', name: '레그프레스', sets: [{ weight: 100, reps: 12 }, { weight: 120, reps: 10 }, { weight: 120, reps: 8 }] }], cardio: { type: 'run', label: '러닝', value: '5km / 28분' } },
  { date: '2026-1-20', type: 'pt', exercises: [{ icon: '🏋️', name: '벤치프레스', sets: [{ weight: 75, reps: 6 }, { weight: 90, reps: 4 }, { weight: 95, reps: 3 }] }, { icon: '🔁', name: '딥스', sets: [{ weight: 0, reps: 10 }, { weight: 0, reps: 8 }] }] },
  { date: '2026-1-21', type: 'self', exercises: [{ icon: '⬇️', name: '랫풀다운', sets: [{ weight: 50, reps: 10 }, { weight: 55, reps: 8 }] }, { icon: '🚣', name: '시티드로우', sets: [{ weight: 40, reps: 12 }, { weight: 45, reps: 10 }] }] },
  { date: '2026-1-22', type: 'pt', exercises: [{ icon: '🏋️', name: '스쿼트', sets: [{ weight: 70, reps: 8 }, { weight: 90, reps: 6 }, { weight: 100, reps: 4 }] }, { icon: '🦵', name: '레그익스텐션', sets: [{ weight: 45, reps: 12 }, { weight: 50, reps: 10 }] }] },
  { date: '2026-1-24', type: 'self', exercises: [{ icon: '🏋️', name: '오버헤드 프레스', sets: [{ weight: 35, reps: 10 }, { weight: 40, reps: 8 }] }, { icon: '🦋', name: '팩덱플라이', sets: [{ weight: 18, reps: 12 }, { weight: 20, reps: 10 }] }] },
  { date: '2026-1-27', type: 'pt', exercises: [{ icon: '⬇️', name: '랫풀다운', sets: [{ weight: 55, reps: 8 }, { weight: 60, reps: 6 }, { weight: 60, reps: 6 }] }, { icon: '💪', name: '바이셉 컬', sets: [{ weight: 14, reps: 10 }, { weight: 14, reps: 10 }] }] },
  { date: '2026-1-28', type: 'both', exercises: [{ icon: '🏋️', name: '벤치프레스', sets: [{ weight: 80, reps: 5 }, { weight: 90, reps: 4 }] }, { icon: '💪', name: '케이블 트라이셉스', sets: [{ weight: 28, reps: 12 }, { weight: 28, reps: 10 }] }], cardio: { type: 'run', label: '러닝', value: '3km / 17분' } },
  { date: '2026-1-29', type: 'self', exercises: [{ icon: '🦵', name: '레그컬', sets: [{ weight: 38, reps: 12 }, { weight: 40, reps: 10 }] }, { icon: '🦵', name: '레그익스텐션', sets: [{ weight: 42, reps: 12 }, { weight: 45, reps: 10 }] }] },
  { date: '2026-1-31', type: 'pt', exercises: [{ icon: '🏋️', name: '데드리프트', sets: [{ weight: 90, reps: 5 }, { weight: 105, reps: 4 }, { weight: 110, reps: 3 }] }, { icon: '🦵', name: '굿모닝', sets: [{ weight: 40, reps: 10 }, { weight: 40, reps: 10 }] }] },
  // 2월
  { date: '2026-2-3', type: 'pt', exercises: [{ icon: '🏋️', name: '벤치프레스', sets: [{ weight: 70, reps: 8 }, { weight: 85, reps: 5 }, { weight: 95, reps: 3 }] }, { icon: '📐', name: '인클라인 덤벨 프레스', sets: [{ weight: 14, reps: 10 }, { weight: 14, reps: 8 }] }] },
  { date: '2026-2-4', type: 'self', exercises: [{ icon: '⬇️', name: '랫풀다운', sets: [{ weight: 52, reps: 10 }, { weight: 55, reps: 8 }] }, { icon: '🚣', name: '시티드로우', sets: [{ weight: 45, reps: 10 }, { weight: 48, reps: 8 }] }] },
  { date: '2026-2-5', type: 'both', exercises: [{ icon: '🏋️', name: '스쿼트', sets: [{ weight: 80, reps: 8 }, { weight: 95, reps: 6 }] }, { icon: '🦵', name: '레그컬', sets: [{ weight: 42, reps: 12 }, { weight: 45, reps: 10 }] }], cardio: { type: 'row', label: '로잉', value: '2km / 8분 30초' } },
  { date: '2026-2-7', type: 'self', exercises: [{ icon: '🏋️', name: '숄더프레스', sets: [{ weight: 42, reps: 10 }, { weight: 45, reps: 8 }] }, { icon: '🦋', name: '팩덱플라이', sets: [{ weight: 22, reps: 12 }, { weight: 24, reps: 10 }] }] },
  { date: '2026-2-10', type: 'pt', exercises: [{ icon: '⬇️', name: '랫풀다운', sets: [{ weight: 55, reps: 8 }, { weight: 60, reps: 6 }, { weight: 62, reps: 6 }] }, { icon: '💪', name: '바이셉 해머컬', sets: [{ weight: 12, reps: 12 }, { weight: 14, reps: 10 }] }] },
  { date: '2026-2-11', type: 'self', exercises: [{ icon: '🏋️', name: '벤치프레스', sets: [{ weight: 65, reps: 10 }, { weight: 75, reps: 6 }, { weight: 80, reps: 4 }] }], cardio: { type: 'run', label: '러닝', value: '4km / 22분' } },
  { date: '2026-2-12', type: 'pt', exercises: [{ icon: '🏋️', name: '데드리프트', sets: [{ weight: 95, reps: 5 }, { weight: 110, reps: 4 }, { weight: 115, reps: 3 }] }, { icon: '🦵', name: '레그익스텐션', sets: [{ weight: 48, reps: 12 }, { weight: 50, reps: 10 }] }] },
  { date: '2026-2-13', type: 'self', exercises: [{ icon: '🦵', name: '레그프레스', sets: [{ weight: 110, reps: 12 }, { weight: 130, reps: 10 }, { weight: 130, reps: 8 }] }] },
  { date: '2026-2-14', type: 'both', exercises: [{ icon: '🏋️', name: '벤치프레스', sets: [{ weight: 75, reps: 6 }, { weight: 88, reps: 4 }, { weight: 92, reps: 3 }] }, { icon: '🔁', name: '딥스', sets: [{ weight: 0, reps: 10 }, { weight: 0, reps: 9 }] }], cardio: { type: 'cycle', label: '사이클', value: '25분' } },
  { date: '2026-2-17', type: 'pt', exercises: [{ icon: '🏋️', name: '스쿼트', sets: [{ weight: 75, reps: 8 }, { weight: 95, reps: 6 }, { weight: 105, reps: 4 }] }, { icon: '🦵', name: '라잉레그컬', sets: [{ weight: 42, reps: 12 }, { weight: 45, reps: 10 }] }] },
  { date: '2026-2-18', type: 'self', exercises: [{ icon: '⬇️', name: '랫풀다운', sets: [{ weight: 50, reps: 10 }, { weight: 55, reps: 8 }] }, { icon: '🚣', name: '시티드로우', sets: [{ weight: 42, reps: 12 }, { weight: 45, reps: 10 }] }] },
  { date: '2026-2-19', type: 'pt', exercises: [{ icon: '🏋️', name: '벤치프레스', sets: [{ weight: 78, reps: 5 }, { weight: 90, reps: 4 }, { weight: 95, reps: 3 }] }, { icon: '📐', name: '인클라인 프레스', sets: [{ weight: 55, reps: 8 }, { weight: 55, reps: 8 }] }] },
  { date: '2026-2-20', type: 'self', exercises: [{ icon: '🏋️', name: '숄더프레스', sets: [{ weight: 40, reps: 10 }, { weight: 45, reps: 8 }, { weight: 45, reps: 6 }] }, { icon: '🔄', name: '리버스플라이', sets: [{ weight: 8, reps: 15 }, { weight: 8, reps: 12 }] }] },
  { date: '2026-2-21', type: 'both', exercises: [{ icon: '⬇️', name: '랫풀다운', sets: [{ weight: 55, reps: 8 }, { weight: 58, reps: 6 }] }, { icon: '💪', name: '바이셉 컬', sets: [{ weight: 14, reps: 10 }, { weight: 14, reps: 10 }] }], cardio: { type: 'run', label: '러닝', value: '3km / 16분' } },
  { date: '2026-2-23', type: 'self', exercises: [{ icon: '🦵', name: '레그프레스', sets: [{ weight: 120, reps: 10 }, { weight: 130, reps: 8 }] }, { icon: '🦵', name: '레그컬', sets: [{ weight: 40, reps: 12 }, { weight: 42, reps: 10 }] }] },
  { date: '2026-2-24', type: 'pt', exercises: [{ icon: '🏋️', name: '데드리프트', sets: [{ weight: 100, reps: 5 }, { weight: 115, reps: 4 }, { weight: 120, reps: 3 }] }, { icon: '🦵', name: '굿모닝', sets: [{ weight: 45, reps: 10 }, { weight: 45, reps: 8 }] }] },
  { date: '2026-2-25', type: 'self', exercises: [{ icon: '🏋️', name: '벤치프레스', sets: [{ weight: 60, reps: 12 }, { weight: 70, reps: 8 }, { weight: 75, reps: 6 }] }, { icon: '💪', name: '케이블 트라이셉스', sets: [{ weight: 25, reps: 12 }, { weight: 28, reps: 10 }] }] },
];
