import type { MemberProfile, RankGrade } from '@/types';

export function calcStrengthScore(profile: MemberProfile): number {
  const benchPct = Math.min(profile.lifts[0]?.pct ?? 0, 100);
  const squatPct = Math.min(profile.lifts[1]?.pct ?? 0, 100);
  const deadPct = Math.min(profile.lifts[2]?.pct ?? 0, 100);
  return Math.round((benchPct + squatPct + deadPct) / 3);
}

export function calcBodyScore(profile: MemberProfile): number {
  const musclePts = Math.min(profile.bodyComp.muscle / 40 * 100, 100);
  const fatPts = Math.max(0, 100 - (profile.bodyComp.fatPct - 10) * 5);
  return Math.round((musclePts + fatPts) / 2);
}

export function calcCardioScore(profile: MemberProfile): number {
  const run = profile.cardio.find(c => c.type === 'run5k');
  const row = profile.cardio.find(c => c.type === 'row2k');
  const ski = profile.cardio.find(c => c.type === 'ski1k');

  const runPts = run ? Math.max(0, 100 - (run.pr - 1200) / 6) : 0;
  const rowPts = row ? Math.max(0, 100 - (row.pr - 360) / 3) : 0;
  const skiPts = ski ? Math.max(0, 100 - (ski.pr - 180) / 2) : 0;

  return Math.round((runPts + rowPts + skiPts) / 3);
}

export function calcTotalScore(profile: MemberProfile): number {
  const s = calcStrengthScore(profile);
  const b = calcBodyScore(profile);
  const c = calcCardioScore(profile);
  return Math.round(s * 0.4 + b * 0.3 + c * 0.3);
}

export function getGrade(score: number): RankGrade {
  if (score >= 90) return 'ELITE';
  if (score >= 75) return 'PLATINUM';
  if (score >= 60) return 'GOLD';
  if (score >= 40) return 'SILVER';
  return 'BRONZE';
}

export function getGradeColor(grade: RankGrade): string {
  switch (grade) {
    case 'ELITE': return '#ff5e1f';
    case 'PLATINUM': return '#a855f7';
    case 'GOLD': return '#f5c518';
    case 'SILVER': return '#7a849a';
    case 'BRONZE': return '#b45309';
  }
}
