import type { Goal } from '@/types';

export const goals: Goal[] = [
  {
    id: 'g1',
    category: 'strength',
    exerciseKey: 'bench',
    label: '벤치프레스',
    targetValue: 110,
    currentValue: 100,
    unit: 'kg',
    deadline: '2026-4-30',
    achieved: false,
    isPrimary: true,
  },
  {
    id: 'g2',
    category: 'body',
    label: '체지방률',
    targetValue: 15,
    currentValue: 16.8,
    unit: '%',
    achieved: false,
    isPrimary: false,
  },
  {
    id: 'g3',
    category: 'attendance',
    label: '이번 달 출석',
    targetValue: 20,
    currentValue: 16,
    unit: '회',
    deadline: '2026-2-28',
    achieved: false,
    isPrimary: false,
  },
];
