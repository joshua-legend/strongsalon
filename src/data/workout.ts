import type { TrainerProg } from '@/types';

function nextSetId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function createInitialTrainerProg(): TrainerProg {
  const base: TrainerProg = {
  exercises: [
    {
      id: 'tp1',
      icon: '🏋️',
      name: '벤치프레스',
      rx: '4세트 × 6회  ·  RPE 8  ·  80% 1RM',
      tSets: 4,
      prevPR: 100,
      sets: [],
    },
    {
      id: 'tp2',
      icon: '📐',
      name: '인클라인 덤벨 프레스',
      rx: '3세트 × 10회  ·  RPE 7.5',
      tSets: 3,
      prevPR: null,
      sets: [],
    },
    {
      id: 'tp3',
      icon: '🔁',
      name: '딥스 (가중)',
      rx: '3세트 × 8회  ·  체중 + 가중',
      tSets: 3,
      prevPR: null,
      sets: [],
    },
    {
      id: 'tp4',
      icon: '💪',
      name: '케이블 트라이셉스',
      rx: '3세트 × 12회  ·  가볍게 마무리',
      tSets: 3,
      prevPR: null,
      sets: [],
    },
  ],
  };
  return {
    exercises: base.exercises.map((ex) => ({
      ...ex,
      sets: Array.from({ length: ex.tSets }, (_, i) => ({
        id: nextSetId(ex.id),
        weight: 0,
        reps: 0,
      })),
    })),
  };
}

export const FAV_CHIPS: { icon: string; name: string }[] = [
  { icon: '🦵', name: '레그익스텐션' },
  { icon: '🦵', name: '라잉레그컬' },
  { icon: '🦵', name: '시티드레그컬' },
  { icon: '🦿', name: '이너타이' },
  { icon: '🦿', name: '아웃타이' },
  { icon: '🏋️', name: '파워레그프레스' },
  { icon: '🔥', name: '퍼팩트스쿼트' },
  { icon: '⬇️', name: '랫풀다운' },
  { icon: '💪', name: '롱풀' },
  { icon: '🚣', name: '시티드로우' },
  { icon: '🏋️', name: '티바로우' },
  { icon: '🆙', name: '어시스트풀업(스탠딩)' },
  { icon: '🆙', name: '어시스트풀업(닐링)' },
  { icon: '⬇️', name: '어시스트딥스(스탠딩)' },
  { icon: '⬇️', name: '어시스트딥스(닐링)' },
  { icon: '🦋', name: '팩덱플라이' },
  { icon: '🔄', name: '리버스플라이' },
  { icon: '💪', name: '스탠딩체스트프레스' },
  { icon: '🏋️', name: '숄더프레스' },
  { icon: '📐', name: '인클라인프레스' },
  { icon: '🏋️', name: '체스트프레스' },
];

export const PREV_RECORD = {
  title: '지난 벤치프레스',
  ago: '5일 전',
  rows: [
    { n: 'SET 1', val: '60kg × 12', v: '720kg' },
    { n: 'SET 2', val: '80kg × 8', v: '640kg' },
    { n: 'SET 3', val: '95kg × 5', v: '475kg' },
    { n: 'SET 4', val: '100kg × 3', v: '300kg' },
  ],
  total: '2,135 kg',
};
