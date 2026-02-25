'use client';

import { useApp } from '@/context/AppContext';
import SubTabs from './SubTabs';
import InbodySummary from './InbodySummary';
import StrengthGrade from './StrengthGrade';
import CardioRecords from './CardioRecords';

export default function PerformanceTab() {
  const { subTab } = useApp();

  return (
    <div className="px-4 py-4 flex flex-col gap-4">
      <div className="fade-up"><SubTabs /></div>
      {subTab === 'body' && (
        <div className="fade-up fade-in-1"><InbodySummary /></div>
      )}
      {subTab === 'strength' && (
        <div className="fade-up fade-in-1"><StrengthGrade /></div>
      )}
      {subTab === 'cardio' && (
        <div className="fade-up fade-in-1"><CardioRecords /></div>
      )}
      <div className="h-4" />
    </div>
  );
}
