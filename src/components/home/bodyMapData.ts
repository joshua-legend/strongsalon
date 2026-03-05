import type { MuscleCondition, MuscleStatus } from '@/types';

export const musclesFront: MuscleCondition[] = [
  { id: 'chest', name: '가슴', status: 'worked', detail: '오늘 운동 부위 — 벤치프레스, 인클라인' },
  { id: 'shoulder', name: '어깨', status: 'recover', detail: '회복 완료 — 2일 전 운동' },
  { id: 'bicep', name: '이두', status: 'fatigue', detail: '피로 누적 — 연속 3일 자극' },
  { id: 'abs', name: '복근', status: 'none', detail: '상태 양호' },
  { id: 'quad', name: '대퇴사두', status: 'recover', detail: '회복 완료 — 3일 전 스쿼트' },
];

export const musclesBack: MuscleCondition[] = [
  { id: 'trap', name: '승모근', status: 'fatigue', detail: '피로 누적 — 데드리프트 후' },
  { id: 'back', name: '등', status: 'recover', detail: '회복 완료 — 4일 전 운동' },
  { id: 'tricep', name: '삼두', status: 'worked', detail: '오늘 운동 부위 — 딥스, 푸시다운' },
  { id: 'glute', name: '둔근', status: 'none', detail: '상태 양호' },
  { id: 'hamstring', name: '햄스트링', status: 'injury', detail: '⚠️ 부상 주의 — 경미한 긴장감' },
];

export const statusToIntensity: Record<MuscleStatus, number> = {
  none: 1, injury: 5, worked: 3, fatigue: 4, recover: 2,
};

export const statusColor: Record<MuscleStatus, string> = {
  none: '#454d62',
  injury: 'rgba(229,55,15,.85)',
  worked: 'rgba(255,94,31,.55)',
  fatigue: 'rgba(255,120,50,.7)',
  recover: 'rgba(255,140,70,.4)',
};

export const statusLabel: Record<MuscleStatus, string> = {
  none: '양호', injury: '부상주의', worked: '오늘운동', fatigue: '피로누적', recover: '회복완료',
};

export const statusBadge: Record<MuscleStatus, 'muted' | 'red' | 'orange' | 'yellow' | 'green'> = {
  none: 'muted', injury: 'red', worked: 'orange', fatigue: 'yellow', recover: 'green',
};

type LibrarySlug = 'chest' | 'deltoids' | 'biceps' | 'abs' | 'quadriceps' | 'trapezius' | 'upper-back' | 'lower-back' | 'triceps' | 'gluteal' | 'hamstring';

const idToSlugs: Record<string, LibrarySlug[]> = {
  chest: ['chest'], shoulder: ['deltoids'], bicep: ['biceps'], abs: ['abs'],
  quad: ['quadriceps'], trap: ['trapezius'], back: ['upper-back', 'lower-back'],
  tricep: ['triceps'], glute: ['gluteal'], hamstring: ['hamstring'],
};

const slugToId: Record<string, string> = {
  chest: 'chest', deltoids: 'shoulder', biceps: 'bicep', abs: 'abs',
  quadriceps: 'quad', trapezius: 'trap', 'upper-back': 'back', 'lower-back': 'back',
  triceps: 'tricep', gluteal: 'glute', hamstring: 'hamstring',
};

export function musclesToBodyData(muscles: MuscleCondition[]): { slug: LibrarySlug; intensity: number }[] {
  const out: { slug: LibrarySlug; intensity: number }[] = [];
  for (const m of muscles) {
    const slugs = idToSlugs[m.id];
    if (!slugs) continue;
    for (const slug of slugs) out.push({ slug, intensity: statusToIntensity[m.status] });
  }
  return out;
}

export function findMuscleBySlug(slug: string, view: 'front' | 'back'): MuscleCondition | null {
  const id = slugToId[slug];
  if (!id) return null;
  const list = view === 'front' ? musclesFront : musclesBack;
  return list.find((m) => m.id === id) ?? null;
}
