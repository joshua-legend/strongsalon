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
      <p className="text-xs" style={{ color: "var(--text-sub)" }}>{label}</p>
      <div className="flex gap-2">
        <input
          type="number" inputMode="decimal" value={weight}
          onChange={(e) => setWeight(e.target.value)} placeholder="중량"
          className="flex-1 font-mono text-sm px-3 py-2 rounded-lg focus:outline-none focus:border-[var(--border-focus)]"
          style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-light)", color: "var(--text-main)" }}
        />
        <input
          type="number" inputMode="numeric" value={reps}
          onChange={(e) => setReps(e.target.value)} placeholder="횟수"
          className="w-20 font-mono text-sm px-3 py-2 rounded-lg focus:outline-none focus:border-[var(--border-focus)]"
          style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-light)", color: "var(--text-main)" }}
        />
        <span className="text-sm self-center" style={{ color: "var(--text-sub)" }}>회</span>
      </div>
    </div>
  );
}
