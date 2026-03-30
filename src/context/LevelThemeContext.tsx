"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  DEFAULT_MEMBERSHIP_TIER,
  MEMBERSHIP_TIER_STORAGE_KEY,
  getTierTheme,
  isMembershipTier,
  type MembershipTier,
  type TierTheme,
} from "@/config/membershipTierTheme";

interface LevelThemeContextValue {
  selectedTier: MembershipTier;
  activeTier: TierTheme;
  setSelectedTier: (tier: MembershipTier) => void;
}

const LevelThemeContext = createContext<LevelThemeContextValue | null>(null);

function getContrastTextColor(hexColor: string): string {
  const hex = hexColor.replace("#", "");
  const normalized =
    hex.length === 3
      ? `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`
      : hex;
  if (normalized.length !== 6) return "#000000";

  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);
  if ([r, g, b].some(Number.isNaN)) return "#000000";

  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 150 ? "#000000" : "#ffffff";
}

function getInitialTier(): MembershipTier {
  if (typeof window === "undefined") return DEFAULT_MEMBERSHIP_TIER;
  const stored = localStorage.getItem(MEMBERSHIP_TIER_STORAGE_KEY);
  if (stored && isMembershipTier(stored)) {
    return stored;
  }
  return DEFAULT_MEMBERSHIP_TIER;
}

export function LevelThemeProvider({ children }: { children: React.ReactNode }) {
  const [selectedTier, setSelectedTierState] = useState<MembershipTier>(() =>
    getInitialTier()
  );

  useEffect(() => {
    localStorage.setItem(MEMBERSHIP_TIER_STORAGE_KEY, selectedTier);
  }, [selectedTier]);

  const setSelectedTier = useCallback((tier: MembershipTier) => {
    setSelectedTierState(tier);
  }, []);

  const activeTier = useMemo(() => getTierTheme(selectedTier), [selectedTier]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const accentText = getContrastTextColor(activeTier.color);

    root.style.setProperty("--dynamic-theme-color", activeTier.color);
    root.style.setProperty("--dynamic-theme-bg", activeTier.softBg);
    root.style.setProperty("--accent-main", activeTier.color);
    root.style.setProperty("--accent-bg", activeTier.softBg);
    root.style.setProperty("--border-focus", activeTier.color);
    root.style.setProperty("--accent-text", accentText);

    return () => {
      root.style.removeProperty("--dynamic-theme-color");
      root.style.removeProperty("--dynamic-theme-bg");
      root.style.removeProperty("--accent-main");
      root.style.removeProperty("--accent-bg");
      root.style.removeProperty("--border-focus");
      root.style.removeProperty("--accent-text");
    };
  }, [activeTier.color, activeTier.softBg]);

  const value = useMemo(
    () => ({
      selectedTier,
      activeTier,
      setSelectedTier,
    }),
    [selectedTier, activeTier, setSelectedTier]
  );

  return (
    <LevelThemeContext.Provider value={value}>
      {children}
    </LevelThemeContext.Provider>
  );
}

export function useLevelTheme(): LevelThemeContextValue {
  const context = useContext(LevelThemeContext);
  if (!context) {
    throw new Error("useLevelTheme must be used within LevelThemeProvider");
  }
  return context;
}
