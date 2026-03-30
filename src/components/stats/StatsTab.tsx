"use client";

import BodyPartStatus from "./BodyPartStatus";
import ConditionDonut from "./ConditionDonut";
import StatGrid from "./StatGrid";
import VolumeChart from "./VolumeChart";

export default function StatsTab() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      <section className="space-y-3 fade-up fade-in-1">
        <h2
          className="text-xs font-semibold uppercase tracking-wider transition-colors duration-300"
          style={{ color: "var(--text-sub)" }}
        >
          Monthly Stats
        </h2>
        <StatGrid year={year} month={month} />
      </section>
      <div className="fade-up fade-in-2">
        <VolumeChart />
      </div>
      <div className="fade-up fade-in-3">
        <BodyPartStatus />
      </div>
      <div className="fade-up fade-in-4">
        <ConditionDonut />
      </div>
      <div className="h-4" />
    </div>
  );
}
