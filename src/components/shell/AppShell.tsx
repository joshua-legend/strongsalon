'use client';

import { useApp } from '@/context/AppContext';
import Topbar from './Topbar';
import BottomNav from './BottomNav';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { theme, scrollBodyRef } = useApp();

  return (
    <div className="app-container">
      <Topbar />
      <div ref={scrollBodyRef} className="scroll-body">
        {children}
      </div>
      <BottomNav />
    </div>
  );
}
