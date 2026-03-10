"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import type { InbodyRecord } from "@/types/workout";
import { loadCategorySettings } from "./useCategoryStorage";
import { appendChartPoint } from "./useChartDataStorage";

const INBODY_HISTORY_KEY = "fitlog-inbody-history";

function loadInbodyHistory(): InbodyRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(INBODY_HISTORY_KEY);
    if (raw) return JSON.parse(raw) as InbodyRecord[];
  } catch {
    // ignore
  }
  return [];
}

function saveInbodyHistory(records: InbodyRecord[]): void {
  try {
    localStorage.setItem(INBODY_HISTORY_KEY, JSON.stringify(records));
  } catch {
    // ignore
  }
}

interface InbodyContextValue {
  inbodyHistory: InbodyRecord[];
  addInbodyRecord: (record: InbodyRecord) => void;
  loadInbodyHistory: () => void;
}

const InbodyContext = createContext<InbodyContextValue | null>(null);

export function InbodyProvider({ children }: { children: React.ReactNode }) {
  const [inbodyHistory, setInbodyHistory] = useState<InbodyRecord[]>([]);

  const load = useCallback(() => {
    setInbodyHistory(loadInbodyHistory());
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addInbodyRecord = useCallback((record: InbodyRecord) => {
    setInbodyHistory((prev) => {
      const filtered = prev.filter((r) => r.date !== record.date);
      const next = [...filtered, record].sort((a, b) => b.date.localeCompare(a.date));
      saveInbodyHistory(next);
      return next;
    });

    const categorySettings = loadCategorySettings();
    const configuredAt = categorySettings.inbody?.configuredAt;
    if (configuredAt) {
      appendChartPoint(
        "inbody.weight",
        { day: 0, value: record.weight, date: record.date },
        configuredAt
      );
      if (record.muscleMass > 0) {
        appendChartPoint(
          "inbody.muscleMass",
          { day: 0, value: record.muscleMass, date: record.date },
          configuredAt
        );
      }
      if (record.fatPercent >= 0) {
        appendChartPoint(
          "inbody.fatPercent",
          { day: 0, value: record.fatPercent, date: record.date },
          configuredAt
        );
      }
    }
  }, []);

  const value = useMemo(
    () => ({
      inbodyHistory,
      addInbodyRecord,
      loadInbodyHistory: load,
    }),
    [inbodyHistory, addInbodyRecord, load]
  );

  return (
    <InbodyContext.Provider value={value}>{children}</InbodyContext.Provider>
  );
}

export function useInbody() {
  const ctx = useContext(InbodyContext);
  if (!ctx) throw new Error("useInbody must be used within InbodyProvider");
  return ctx;
}
