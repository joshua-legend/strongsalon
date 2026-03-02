"use client";

const CHALLENGES = [
  {
    id: "gazelle-run",
    name: "가젤의 대이동",
    emoji: "🦌",
    description: "5km 러닝",
    myBest: "24:32",
    unit: "시간",
    topPct: 18,
  },
  {
    id: "grizzly-dead",
    name: "그리즐리 통나무 들기",
    emoji: "🐻",
    description: "데드리프트 1RM",
    myBest: "140kg",
    unit: "kg",
    topPct: 22,
  },
  {
    id: "tiger-row",
    name: "호랑이 사냥 추격전",
    emoji: "🐯",
    description: "로잉 2km",
    myBest: "7:45",
    unit: "시간",
    topPct: 35,
  },
];

export default function WildChallengeCards() {
  return (
    <div className="space-y-3">
      <div className="text-[11px] font-mono text-neutral-500 uppercase tracking-widest mb-2">
        야생의 타임어택 챌린지
      </div>
      {CHALLENGES.map((c) => (
        <div
          key={c.id}
          className="rounded-2xl p-4 border border-neutral-800 bg-neutral-900 hover:border-orange-500/30 transition-colors"
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl shrink-0">{c.emoji}</span>
            <div className="flex-1 min-w-0">
              <h4 className="font-bebas text-base text-white tracking-wider mb-0.5">
                {c.name}
              </h4>
              <p className="text-[11px] text-neutral-500 mb-2">{c.description}</p>
              <div className="flex items-baseline gap-2">
                <span className="font-bebas text-lg text-orange-500">
                  {c.myBest}
                  <span className="text-[10px] text-neutral-500 font-mono ml-1">
                    {c.unit}
                  </span>
                </span>
                <span className="text-[10px] text-neutral-400">
                  상위 {c.topPct}%
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
