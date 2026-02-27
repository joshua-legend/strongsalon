import type { CarrotCredit } from '@/types';

export const carrotHistory: CarrotCredit[] = [
  { id: 'c1', amount: 1, reason: 'weekly_attend', createdAt: '2026-2-17' },
  { id: 'c2', amount: 2, reason: 'streak_bonus', createdAt: '2026-2-14' },
  { id: 'c3', amount: 1, reason: 'weekly_attend', createdAt: '2026-2-10' },
  { id: 'c4', amount: 2, reason: 'pr_achieved', createdAt: '2026-2-8' },
  { id: 'c5', amount: -5, reason: 'shop_purchase', relatedId: 'shop1', createdAt: '2026-2-5' },
];

export function getCarrotBalance(): number {
  const sum = carrotHistory.reduce((a, c) => a + c.amount, 0);
  return Math.max(0, sum);
}
