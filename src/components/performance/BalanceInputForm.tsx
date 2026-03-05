"use client";

export function WeightRepsInput({
  label,
  weight,
  setWeight,
  reps,
  setReps,
}: {
  label: string;
  weight: string;
  setWeight: (v: string) => void;
  reps: string;
  setReps: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs text-neutral-500">{label}</p>
      <div className="flex gap-2">
        <input
          type="number" inputMode="decimal" value={weight}
          onChange={(e) => setWeight(e.target.value)} placeholder="중량"
          className="flex-1 font-mono text-sm bg-neutral-900 border border-neutral-700 px-3 py-2 rounded-lg text-white focus:border-lime-400 focus:outline-none"
        />
        <input
          type="number" inputMode="numeric" value={reps}
          onChange={(e) => setReps(e.target.value)} placeholder="횟수"
          className="w-20 font-mono text-sm bg-neutral-900 border border-neutral-700 px-3 py-2 rounded-lg text-white focus:border-lime-400 focus:outline-none"
        />
        <span className="text-neutral-500 text-sm self-center">회</span>
      </div>
    </div>
  );
}
