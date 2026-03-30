import {
  workoutHistory,
  type DayExercise,
  type DayWorkoutRecord,
} from "@/data/workoutHistory";

export type BodyPartKey =
  | "legs"
  | "chest"
  | "back"
  | "shoulders"
  | "arms"
  | "core"
  | "other";

export interface WeeklyVolumePoint {
  label: string;
  shortLabel: string;
  rangeLabel: string;
  volume: number;
  sessions: number;
  isCurrent: boolean;
}

export interface BodyPartInsight {
  key: BodyPartKey;
  label: string;
  accent: string;
  softAccent: string;
  sets: number;
  sessions: number;
  exerciseCount: number;
  volume: number;
  share: number;
}

const BODY_PART_META: Record<
  BodyPartKey,
  { label: string; accent: string; softAccent: string }
> = {
  legs: {
    label: "하체",
    accent: "#38bdf8",
    softAccent: "rgba(56, 189, 248, 0.15)",
  },
  chest: {
    label: "가슴",
    accent: "#f97316",
    softAccent: "rgba(249, 115, 22, 0.14)",
  },
  back: {
    label: "등",
    accent: "#a3e635",
    softAccent: "rgba(163, 230, 53, 0.15)",
  },
  shoulders: {
    label: "어깨",
    accent: "#facc15",
    softAccent: "rgba(250, 204, 21, 0.14)",
  },
  arms: {
    label: "팔",
    accent: "#c084fc",
    softAccent: "rgba(192, 132, 252, 0.14)",
  },
  core: {
    label: "코어",
    accent: "#14b8a6",
    softAccent: "rgba(20, 184, 166, 0.15)",
  },
  other: {
    label: "기타",
    accent: "#94a3b8",
    softAccent: "rgba(148, 163, 184, 0.14)",
  },
};

const BODY_PART_ORDER: BodyPartKey[] = [
  "legs",
  "chest",
  "back",
  "shoulders",
  "arms",
  "core",
  "other",
];

const BODY_PART_KEYWORDS: Array<{ key: BodyPartKey; keywords: string[] }> = [
  {
    key: "legs",
    keywords: [
      "스쿼트",
      "레그프레스",
      "레그익스텐션",
      "레그컬",
      "런지",
      "힙쓰러스트",
      "힙스러스트",
      "불가리안",
      "카프",
      "데드리프트",
      "굿모닝",
      "legpress",
      "legextension",
      "legcurl",
      "lunge",
      "hipthrust",
      "bulgariansplit",
      "bulgarian",
      "calfraise",
      "deadlift",
      "rdl",
      "squat",
    ],
  },
  {
    key: "chest",
    keywords: [
      "벤치",
      "체스트프레스",
      "인클라인",
      "딥스",
      "푸쉬업",
      "플라이",
      "펙덱",
      "케이블플라이",
      "머신프레스",
      "bench",
      "chestpress",
      "incline",
      "dip",
      "pushup",
      "pecdeck",
      "cablefly",
      "chestfly",
      "chest",
    ],
  },
  {
    key: "back",
    keywords: [
      "랫풀",
      "풀다운",
      "시티드로우",
      "바벨로우",
      "티바로우",
      "로우",
      "풀업",
      "친업",
      "랫",
      "latpull",
      "pulldown",
      "seatedrow",
      "barbellrow",
      "tbarrow",
      "row",
      "pullup",
      "chinup",
      "backextension",
    ],
  },
  {
    key: "shoulders",
    keywords: [
      "숄더프레스",
      "오버헤드프레스",
      "밀리터리프레스",
      "레터럴레이즈",
      "사이드레터럴",
      "프론트레이즈",
      "리버스플라이",
      "업라이트로우",
      "shoulderpress",
      "overheadpress",
      "militarypress",
      "lateralraise",
      "reardelt",
      "frontraise",
      "uprightrow",
      "shoulder",
    ],
  },
  {
    key: "arms",
    keywords: [
      "바이셉",
      "이두",
      "컬",
      "해머컬",
      "프리처컬",
      "트라이셉",
      "삼두",
      "푸시다운",
      "익스텐션",
      "스컬크러셔",
      "biceps",
      "triceps",
      "curl",
      "hammercurl",
      "pushdown",
      "extension",
      "skullcrusher",
      "arm",
    ],
  },
  {
    key: "core",
    keywords: [
      "플랭크",
      "크런치",
      "싯업",
      "시트업",
      "레그레이즈",
      "복근",
      "abwheel",
      "ab",
      "plank",
      "crunch",
      "situp",
      "legraise",
      "core",
      "hangingraise",
    ],
  },
];

function safeNumber(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseRecordDate(dateString: string): Date | null {
  const [year, month, day] = String(dateString)
    .split("-")
    .map((value) => safeNumber(value));
  if (year <= 0 || month <= 0 || day <= 0) return null;
  const parsed = new Date(year, month - 1, day);
  parsed.setHours(0, 0, 0, 0);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function addDays(date: Date, amount: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  next.setHours(0, 0, 0, 0);
  return next;
}

function startOfWeek(date: Date): Date {
  const next = new Date(date);
  const offset = (next.getDay() + 6) % 7;
  next.setDate(next.getDate() - offset);
  next.setHours(0, 0, 0, 0);
  return next;
}

function formatShortDate(date: Date): string {
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

function formatRangeLabel(start: Date, end: Date): string {
  if (start.getMonth() === end.getMonth()) {
    return `${start.getMonth() + 1}/${start.getDate()}-${end.getDate()}`;
  }
  return `${formatShortDate(start)}-${formatShortDate(end)}`;
}

function calcExerciseVolume(exercise: DayExercise): number {
  return (exercise.sets ?? []).reduce((sum, set) => {
    return sum + safeNumber(set.weight) * safeNumber(set.reps);
  }, 0);
}

function calcRecordVolume(record: DayWorkoutRecord): number {
  return record.exercises.reduce(
    (sum, exercise) => sum + calcExerciseVolume(exercise),
    0
  );
}

function normalizeText(value: string): string {
  return String(value)
    .toLowerCase()
    .replace(/\s/g, "")
    .replace(/[()[\]{}\-_/]/g, "");
}

function classifyBodyPart(name: string): BodyPartKey {
  const normalized = normalizeText(name);

  for (const group of BODY_PART_KEYWORDS) {
    if (
      group.keywords.some((keyword) =>
        normalized.includes(normalizeText(keyword))
      )
    ) {
      return group.key;
    }
  }

  return "other";
}

export function getMergedWorkoutRecords(
  userRecords: DayWorkoutRecord[] = []
): DayWorkoutRecord[] {
  const byDate = new Map<string, DayWorkoutRecord>();

  workoutHistory.forEach((record) => {
    byDate.set(record.date, record);
  });

  userRecords.forEach((record) => {
    byDate.set(record.date, record);
  });

  return Array.from(byDate.values()).sort((left, right) => {
    const leftDate = parseRecordDate(left.date)?.getTime() ?? 0;
    const rightDate = parseRecordDate(right.date)?.getTime() ?? 0;
    return leftDate - rightDate;
  });
}

export function getInsightAnchorDate(records: DayWorkoutRecord[] = []): Date {
  const latestRecord = records.reduce<Date | null>((latest, record) => {
    const parsed = parseRecordDate(record.date);
    if (!parsed) return latest;
    if (!latest || parsed.getTime() > latest.getTime()) return parsed;
    return latest;
  }, null);

  if (latestRecord) return latestRecord;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

export function getWeeklyVolumeTrend(
  records: DayWorkoutRecord[] = [],
  weekCount = 8
): WeeklyVolumePoint[] {
  const anchorDate = getInsightAnchorDate(records);
  const latestWeekStart = startOfWeek(anchorDate);

  const weeklyData: WeeklyVolumePoint[] = [];

  for (let index = weekCount - 1; index >= 0; index -= 1) {
    const weekStart = addDays(latestWeekStart, index * -7);
    const weekEnd = addDays(weekStart, 6);

    const weekRecords = records.filter((record) => {
      const recordDate = parseRecordDate(record.date);
      if (!recordDate) return false;
      return (
        recordDate.getTime() >= weekStart.getTime() &&
        recordDate.getTime() <= weekEnd.getTime()
      );
    });

    weeklyData.push({
      label: formatShortDate(weekStart),
      shortLabel: `${weekStart.getMonth() + 1}.${weekStart.getDate()}`,
      rangeLabel: formatRangeLabel(weekStart, weekEnd),
      volume: weekRecords.reduce(
        (sum, record) => sum + calcRecordVolume(record),
        0
      ),
      sessions: weekRecords.length,
      isCurrent: index === 0,
    });
  }

  return weeklyData;
}

export function getBodyPartInsights(
  records: DayWorkoutRecord[] = [],
  windowDays = 28
): BodyPartInsight[] {
  const anchorDate = getInsightAnchorDate(records);
  const windowStart = addDays(anchorDate, -(windowDays - 1));

  const buckets = Object.fromEntries(
    BODY_PART_ORDER.map((key) => [
      key,
      {
        sets: 0,
        sessions: 0,
        volume: 0,
        exerciseNames: new Set<string>(),
      },
    ])
  ) as Record<
    BodyPartKey,
    {
      sets: number;
      sessions: number;
      volume: number;
      exerciseNames: Set<string>;
    }
  >;

  records.forEach((record) => {
    const recordDate = parseRecordDate(record.date);
    if (!recordDate) return;
    if (
      recordDate.getTime() < windowStart.getTime() ||
      recordDate.getTime() > anchorDate.getTime()
    ) {
      return;
    }

    const touchedParts = new Set<BodyPartKey>();

    record.exercises.forEach((exercise) => {
      const bodyPart = classifyBodyPart(exercise.name);
      const bucket = buckets[bodyPart];

      bucket.sets += exercise.sets?.length ?? 0;
      bucket.volume += calcExerciseVolume(exercise);
      bucket.exerciseNames.add(normalizeText(exercise.name));
      touchedParts.add(bodyPart);
    });

    touchedParts.forEach((bodyPart) => {
      buckets[bodyPart].sessions += 1;
    });
  });

  const totalSets = BODY_PART_ORDER.reduce(
    (sum, key) => sum + buckets[key].sets,
    0
  );

  return BODY_PART_ORDER.map((key) => ({
    key,
    label: BODY_PART_META[key].label,
    accent: BODY_PART_META[key].accent,
    softAccent: BODY_PART_META[key].softAccent,
    sets: buckets[key].sets,
    sessions: buckets[key].sessions,
    exerciseCount: buckets[key].exerciseNames.size,
    volume: buckets[key].volume,
    share: totalSets > 0 ? (buckets[key].sets / totalSets) * 100 : 0,
  }))
    .filter((item) => item.sets > 0)
    .sort((left, right) => {
      if (right.sets !== left.sets) return right.sets - left.sets;
      return right.volume - left.volume;
    });
}

export function formatCompactVolume(value: number): string {
  const volume = safeNumber(value);
  const sign = volume < 0 ? "-" : "";
  const abs = Math.abs(volume);
  if (abs >= 1000) return `${sign}${(abs / 1000).toFixed(1)}k`;
  return `${sign}${Math.round(abs)}`;
}
