'use client';

interface RadarChartProps {
  strength: number;
  body: number;
  cardio: number;
}

export default function RadarChart({ strength, body, cardio }: RadarChartProps) {
  const cx = 100, cy = 100, R = 75;

  const angles = [
    -Math.PI / 2,
    -Math.PI / 2 + (2 * Math.PI) / 3,
    -Math.PI / 2 + (4 * Math.PI) / 3,
  ];

  const labels = [
    { name: '근력', value: strength },
    { name: '체성분', value: body },
    { name: '체력', value: cardio },
  ];

  const getPoint = (angle: number, pct: number) => ({
    x: cx + (R * pct / 100) * Math.cos(angle),
    y: cy + (R * pct / 100) * Math.sin(angle),
  });

  const gridLevels = [25, 50, 75, 100];

  return (
    <svg width="100%" viewBox="0 0 200 200" className="max-w-[200px] mx-auto">
      {gridLevels.map(level => {
        const pts = angles.map(a => getPoint(a, level));
        const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
        return (
          <path key={level} d={path} fill="none" stroke="#404040" strokeWidth="0.5" />
        );
      })}

      {angles.map((a, i) => {
        const end = getPoint(a, 100);
        return <line key={i} x1={cx} y1={cy} x2={end.x} y2={end.y} stroke="#404040" strokeWidth="0.5" />;
      })}

      {(() => {
        const values = [strength, body, cardio];
        const pts = angles.map((a, i) => getPoint(a, values[i]));
        const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
        return (
          <>
            <path d={path} fill="#a855f7" fillOpacity="0.18" stroke="#a855f7" strokeWidth="2" />
            {pts.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r="4" fill="#a855f7" stroke="white" strokeWidth="1.5" />
            ))}
          </>
        );
      })()}

      {labels.map((l, i) => {
        const labelR = R + 18;
        const p = getPoint(angles[i], (labelR / R) * 100);
        return (
          <g key={i}>
            <text
              x={p.x} y={p.y - 6}
              textAnchor="middle" fill="#737373" fontSize="9"
              fontFamily='"Bebas Neue", cursive'
            >
              {l.name}
            </text>
            <text
              x={p.x} y={p.y + 8}
              textAnchor="middle" fill="#a855f7" fontSize="10"
              fontWeight="bold" fontFamily='"Bebas Neue", cursive'
            >
              {l.value}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
