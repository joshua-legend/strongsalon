"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import type { InbodyRecord } from "@/types/workout";
import { mockInbodyHistory } from "@/data/mockUserData";
import { loadCategorySettings } from "./useCategoryStorage";
import { appendChartPoint } from "./useChartDataStorage";

interface InbodyContextValue {
  inbodyHistory: InbodyRecord[];
  addInbodyRecord: (record: InbodyRecord) => void;
  loadInbodyHistory: () => void;
}

const InbodyContext = createContext<InbodyContextValue | null>(null);

export function InbodyProvider({ children }: { children: React.ReactNode }) {
  const [inbodyHistory, setInbodyHistory] = useState<InbodyRecord[]>(
    () => structuredClone(mockInbodyHistory)
  );

  const load = useCallback(() => {
    setInbodyHistory(structuredClone(mockInbodyHistory));
  }, []);

  const addInbodyRecord = useCallback((record: InbodyRecord) => {
    setInbodyHistory((prev) => {
      const filtered = prev.filter((r) => r.date !== record.date);
      return [...filtered, record].sort((a, b) => b.date.localeCompare(a.date));
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
