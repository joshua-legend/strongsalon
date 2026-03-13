"use client";

const CHALLENGES = [
  {
    id: "wolf-chase",
    name: "🐺 늑대의 추적",
    image: "/run1.jpg",
    level: "Normal",
    description: "러닝 4km + 사이클 6km (유산소)",
    myBest: "29:50",
    topPct: 10,
  },
  {
    id: "grizzly-iron-dominance",
    name: "🐹 작은 철의 심장",
    image: "/lift.jpg",
    level: "Hard",
    description: "100kg × 50 데드리프트 (Fully Dressed Version)",
    myBest: "도전 전",
    topPct: null,
  },
  {
    id: "tiger-row",
    name: "🐯 호랑이의 연격",
    image: "/burp.jpg",
    level: "Expert",
    description: "버피 50회 + 턱걸이 30회 + 점프스쿼트 50회",
    myBest: "14:22",
    topPct: 8,
  },
];

export default function WildChallengeCards() {
  return (
    <div className="space-y-3">
      <h3 className="font-bebas text-lg font-bold tracking-wider mb-3" style={{ color: "var(--text-main)" }}>
        야생의 타임어택 챌린지
      </h3>
      {CHALLENGES.map((c) => (
        <div
          key={c.id}
          className="rounded-2xl overflow-hidden border hover:border-orange-500/30 transition-colors"
        style={{ borderColor: "var(--border-light)", backgroundColor: "var(--bg-card)" }}
        >
          <div className="w-full h-32 overflow-hidden">
            <img
              src={c.image}
              alt={c.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4">
            <h4 className="font-bebas text-lg font-bold tracking-wider mb-0.5" style={{ color: "var(--text-main)" }}>
              {c.name}
            </h4>
            <p className="text-[11px] mb-2" style={{ color: "var(--text-sub)" }}>{c.description}</p>
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="font-bebas text-lg text-orange-500">
                {c.myBest}
              </span>
              {c.topPct != null && (
                <span className="text-[10px]" style={{ color: "var(--text-sub)" }}>
                  상위 {c.topPct}%
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
