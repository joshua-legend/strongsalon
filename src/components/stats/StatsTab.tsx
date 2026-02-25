'use client';

import { useState } from 'react';
import PeriodChips from './PeriodChips';
import StatGrid from './StatGrid';
import VolumeChart from './VolumeChart';
import ConditionDonut from './ConditionDonut';
import AttendCalendar from './AttendCalendar';

export default function StatsTab() {
  const [period, setPeriod] = useState('1m');

  return (
    <div className="px-4 py-4 flex flex-col gap-4">
      <div className="fade-up">
        <PeriodChips value={period} onChange={setPeriod} />
      </div>
      <div className="fade-up fade-in-1"><StatGrid /></div>
      <div className="fade-up fade-in-2"><VolumeChart /></div>
      <div className="fade-up fade-in-3"><ConditionDonut /></div>
      <div className="fade-up fade-in-4"><AttendCalendar /></div>
      <div className="h-4" />
    </div>
  );
}
