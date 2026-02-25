'use client';

import { useApp } from '@/context/AppContext';
import type { SubTabId } from '@/types';

const tabs: { id: SubTabId; icon: string; label: string }[] = [
  { id: 'body', icon: '🧬', label: '체성분' },
  { id: 'strength', icon: '🏋️', label: '근력' },
  { id: 'cardio', icon: '🏃', label: '체력' },
];

export default function SubTabs() {
  const { subTab, setSubTab } = useApp();

  return (
    <div className="flex gap-2">
      {tabs.map(t => (
        <button
          key={t.id}
          onClick={() => setSubTab(t.id)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[12px] font-medium transition-all duration-200"
          style={{
            background: subTab === t.id ? 'rgba(255,94,31,.12)' : 'var(--s1)',
            border: `1px solid ${subTab === t.id ? 'rgba(255,94,31,.3)' : 'var(--border)'}`,
            color: subTab === t.id ? 'var(--orange)' : 'var(--muted2)',
          }}
        >
          <span>{t.icon}</span>
          {t.label}
        </button>
      ))}
    </div>
  );
}
