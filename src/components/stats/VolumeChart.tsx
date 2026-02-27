'use client';

const weeks = [
  { label: 'W1', value: 7200 },
  { label: 'W2', value: 8500 },
  { label: 'W3', value: 6800 },
  { label: 'W4', value: 9100 },
  { label: 'W5', value: 10200 },
  { label: 'W6', value: 8900 },
  { label: 'W7', value: 11500 },
  { label: 'W8', value: 9800 },
];

const maxVal = 15000;
const chartH = 180;
const chartW = 320;
const barW = 28;
const gap = (chartW - barW * weeks.length) / (weeks.length + 1);

export default function VolumeChart() {
  return (
    <div className="card">
      <p className="card-label mb-4">📊 주간 볼륨 추이</p>
      <svg width="100%" viewBox={`0 0 ${chartW} ${chartH + 40}`} className="overflow-visible">
        {[0, 5000, 10000, 15000].map((tick, i) => {
          const y = chartH - (tick / maxVal) * chartH;
          return (
            <g key={i}>
              <line x1="0" y1={y} x2={chartW} y2={y} stroke="#262626" strokeWidth="1" />
              <text x="-4" y={y + 3} textAnchor="end" fill="#a3a3a3" fontSize="8" fontFamily='"Bebas Neue", cursive'>
                {tick === 0 ? '0' : `${tick / 1000}k`}
              </text>
            </g>
          );
        })}

        {weeks.map((w, i) => {
          const x = gap + i * (barW + gap);
          const h = (w.value / maxVal) * chartH;
          const y = chartH - h;
          const isCurrent = i === weeks.length - 1;

          return (
            <g key={i}>
              <defs>
                {isCurrent && (
                  <linearGradient id={`barGrad${i}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#fb923c" />
                  </linearGradient>
                )}
              </defs>
              <rect
                x={x}
                y={y}
                width={barW}
                height={h}
                rx="4"
                fill={isCurrent ? `url(#barGrad${i})` : '#22d3ee'}
                opacity={isCurrent ? 1 : 0.6}
              >
                <animate attributeName="height" from="0" to={h} dur="0.8s" fill="freeze"
                  calcMode="spline" keySplines="0.4 0 0.2 1" keyTimes="0;1" />
                <animate attributeName="y" from={chartH} to={y} dur="0.8s" fill="freeze"
                  calcMode="spline" keySplines="0.4 0 0.2 1" keyTimes="0;1" />
              </rect>
              {isCurrent && (
                <rect x={x - 2} y={y - 2} width={barW + 4} height={h + 4} rx="5"
                  fill="none" stroke="#f97316" strokeOpacity="0.3" strokeWidth="1" />
              )}
              <text
                x={x + barW / 2} y={y - 6}
                textAnchor="middle" fill={isCurrent ? '#f97316' : '#737373'}
                fontSize="8" fontFamily='"Bebas Neue", cursive'
              >
                {(w.value / 1000).toFixed(1)}k
              </text>
              <text
                x={x + barW / 2} y={chartH + 16}
                textAnchor="middle" fill="#a3a3a3" fontSize="8" fontFamily='"Bebas Neue", cursive'
              >
                {w.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
