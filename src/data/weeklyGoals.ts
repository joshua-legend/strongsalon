import type { WeeklyGoal } from '@/types';

export const weeklyGoals: WeeklyGoal[] = [
  {
    id: 'wg1',
    label: '벤치프레스',
    category: 'strength',
    exerciseKey: 'bench',
    targetValue: 80,
    currentValue: 50,
    unit: 'reps',
    icon: '🏋️',
  },
  {
    id: 'wg2',
    label: '런닝',
    category: 'cardio',
    targetValue: 15,
    currentValue: 5,
    unit: 'km',
    icon: '🏃',
  },
  {
    id: 'wg3',
    label: '출석',
    category: 'attendance',
    targetValue: 4,
    currentValue: 3,
    unit: '회',
    icon: '📅',
  },
];
