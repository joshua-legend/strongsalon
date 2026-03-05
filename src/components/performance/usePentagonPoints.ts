'use client';

import type { AbilityResults } from "@/types";
import { ABILITY_CATEGORIES } from "@/config/abilityConfig";

export function pentagonPoint(cx: number, cy: number, radius: number, index: number) {
  const angle = (Math.PI * 2 * index) / 5 - Math.PI / 2;
  return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
}

function makePentagonPath(cx: number, cy: number, radius: number): string {
  const pts = [0, 1, 2, 3, 4].map((i) => pentagonPoint(cx, cy, radius, i));
  return pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";
}

export interface PentagonVertex {
  index: number;
  score: number | null;
  label: string;
  color: string;
  isUnmeasured: boolean;
  dotX: number;
  dotY: number;
  outerX: number;
  outerY: number;
  labelX: number;
  labelY: number;
}

export function usePentagonPoints(
  results: AbilityResults,
  cx: number,
  cy: number,
  maxRadius: number
) {
  const gridLevels = [0.33, 0.66, 1];

  const scores = ABILITY_CATEGORIES.map((cat) => {
    const r = results[cat.id];
    return r ? r.score : null;
  });

  const hasAnyData = scores.some((s) => s !== null);

  const gridPaths = gridLevels.map((level) => ({
    level,
    path: makePentagonPath(cx, cy, maxRadius * level),
  }));

  const axisLines = [0, 1, 2, 3, 4].map((i) => {
    const end = pentagonPoint(cx, cy, maxRadius, i);
    return { index: i, x2: end.x, y2: end.y };
  });

  const dataPolygonPath = hasAnyData
    ? [0, 1, 2, 3, 4]
        .map((i) => {
          const s = scores[i] ?? 0;
          const p = pentagonPoint(cx, cy, maxRadius * (s / 100), i);
          return `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`;
        })
        .join(" ") + " Z"
    : null;

  const vertices: PentagonVertex[] = [0, 1, 2, 3, 4].map((i) => {
    const s = scores[i];
    const cat = ABILITY_CATEGORIES[i];
    const dot = pentagonPoint(cx, cy, maxRadius * ((s ?? 0) / 100), i);
    const outer = pentagonPoint(cx, cy, maxRadius, i);
    const label = pentagonPoint(cx, cy, maxRadius + 18, i);
    return {
      index: i,
      score: s,
      label: cat.label,
      color: cat.color,
      isUnmeasured: s === null,
      dotX: dot.x,
      dotY: dot.y,
      outerX: outer.x,
      outerY: outer.y,
      labelX: label.x,
      labelY: label.y,
    };
  });

  return { scores, hasAnyData, gridPaths, axisLines, dataPolygonPath, vertices };
}
