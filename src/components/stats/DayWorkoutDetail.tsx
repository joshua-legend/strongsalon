"use client";

type WorkoutRecord = {
  date: string;
  type: string;
  exercises: { icon: string; name: string; sets: { weight: number; reps: number }[] }[];
  cardio?: { type: string; label: string; value: string };
};

function formatDisplayDate(dateKey: string): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  return `${y}년 ${m}월 ${d}일`;
}

interface DayWorkoutDetailProps {
  dateKey: string;
  record: WorkoutRecord | undefined;
  attendType?: string;
  typeColor: Record<string, string>;
  typeLabel: Record<string, string>;
  onClose: () => void;
}

export default function DayWorkoutDetail({
  dateKey,
  record,
  attendType,
  typeColor,
  typeLabel,
  onClose,
}: DayWorkoutDetailProps) {
  if (!record && !attendType) {
    return (
      <div className="mt-4 pt-3 flex flex-col gap-2 border-t border-neutral-800">
        <div className="flex items-center justify-between">
          <span className="font-bebas text-[10px] text-neutral-400">
            {formatDisplayDate(dateKey)}
          </span>
          <button onClick={onClose} className="text-[12px] px-2 py-1 rounded text-neutral-400 bg-neutral-950">
            닫기
          </button>
        </div>
        <p className="font-bebas text-[10px] py-4 text-center text-neutral-400">
          해당 날짜에 운동 기록이 없습니다
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 pt-3 flex flex-col gap-3 border-t border-neutral-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-bebas text-[10px] text-neutral-400">
            {formatDisplayDate(dateKey)}
          </span>
          {attendType && (
            <span
              className="font-bebas text-[8px] px-1.5 py-0.5 rounded"
              style={{
                background: `${typeColor[attendType]}25`,
                color: typeColor[attendType],
              }}
            >
              {typeLabel[attendType]}
            </span>
          )}
        </div>
        <button onClick={onClose} className="text-[12px] px-2 py-1 rounded text-neutral-400 bg-neutral-950">
          닫기
        </button>
      </div>

      {record?.exercises && record.exercises.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="font-bebas text-[9px] text-neutral-500">운동 기록</p>
          {record.exercises.map((ex, idx) => (
            <div key={idx} className="rounded-lg p-2.5 bg-neutral-900 border border-neutral-800">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[14px]">{ex.icon}</span>
                <span className="font-bebas text-[11px] text-white">{ex.name}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {ex.sets.map((s, si) => (
                  <span
                    key={si}
                    className="font-bebas text-[9px] px-2 py-1 rounded"
                    style={{ background: "rgb(23,23,23)", color: "rgb(163,163,163)" }}
                  >
                    {s.weight > 0 ? `${s.weight}kg × ${s.reps}회` : `${s.reps}회`}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {record?.cardio && (
        <div className="rounded-lg p-2.5 flex items-center justify-between bg-neutral-900 border border-neutral-800">
          <span className="font-bebas text-[11px] text-white">🏃 {record.cardio.label}</span>
          <span className="font-bebas text-[10px] text-neutral-400">{record.cardio.value}</span>
        </div>
      )}

      {attendType && !record?.exercises?.length && (
        <p className="font-bebas text-[10px] py-2 text-neutral-400">상세 운동 기록이 없습니다</p>
      )}
    </div>
  );
}
