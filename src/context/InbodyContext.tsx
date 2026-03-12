"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import type { InbodyRecord } from "@/types/workout";
import { useChartData } from "./ChartDataContext";
import { useAuth } from "./AuthContext";

interface InbodyContextValue {
  inbodyHistory: InbodyRecord[];
  addInbodyRecord: (record: InbodyRecord) => void;
  loadInbodyHistory: () => void;
}

const InbodyContext = createContext<InbodyContextValue | null>(null);

export function InbodyProvider({ children }: { children: React.ReactNode }) {
  const { accountData, updateAccountData } = useAuth();
  const { appendChartPoint } = useChartData();
  const [inbodyHistory, setInbodyHistory] = useState<InbodyRecord[]>(() => []);

  useEffect(() => {
    if (accountData) {
      setInbodyHistory(structuredClone(accountData.inbodyHistory));
    } else {
      setInbodyHistory([]);
    }
  }, [accountData]);

  const load = useCallback(() => {
    setInbodyHistory(accountData ? structuredClone(accountData.inbodyHistory) : []);
  }, [accountData]);

  const addInbodyRecord = useCallback(
    (record: InbodyRecord) => {
      if (!accountData) return;
      const next = (() => {
        const prev = accountData.inbodyHistory;
        const filtered = prev.filter((r) => r.date !== record.date);
        return [...filtered, record].sort((a, b) => b.date.localeCompare(a.date));
      })();
      setInbodyHistory(next);
      updateAccountData((prev) => ({ ...prev, inbodyHistory: next }));

      const configuredAt = accountData.categorySettings?.inbody?.configuredAt;
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
    },
    [appendChartPoint, accountData, updateAccountData]
  );

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
