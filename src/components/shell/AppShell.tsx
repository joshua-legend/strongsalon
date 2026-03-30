'use client';

import { useMemo, type CSSProperties } from "react";
import { useApp } from '@/context/AppContext';
import { useLevelTheme } from "@/context/LevelThemeContext";
import Topbar from './Topbar';
import BottomNav from './BottomNav';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { scrollBodyRef } = useApp();
  const { activeTier } = useLevelTheme();

  const tierVars = useMemo(
    () =>
      ({
        "--accent-main": activeTier.color,
        "--accent-sub": `color-mix(in srgb, ${activeTier.color} 72%, #22c55e 28%)`,
        "--accent-bg": activeTier.softBg,
        "--border-focus": activeTier.color,
        "--dynamic-theme-color": activeTier.color,
        "--dynamic-theme-bg": activeTier.softBg,
      }) as CSSProperties,
    [activeTier.color, activeTier.softBg]
  );

  return (
    <div className="app-container" style={tierVars}>
      <Topbar />
      <div ref={scrollBodyRef} className="scroll-body">
        {children}
      </div>
      <BottomNav />
    </div>
  );
}
