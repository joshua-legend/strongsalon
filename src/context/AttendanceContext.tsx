"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";
import type { AttendanceRecord, AttendType } from "@/types";
import { attendance as staticAttendance } from "@/data/attendance";

function mergeAttendance(
  staticData: AttendanceRecord[],
  userCheckIns: AttendanceRecord[]
): AttendanceRecord[] {
  const byDate = new Map<string, AttendanceRecord>();
  staticData.forEach((a) => byDate.set(a.date, a));
  userCheckIns.forEach((a) => byDate.set(a.date, a));
  return Array.from(byDate.values()).sort((a, b) => {
    const [ay, am, ad] = a.date.split("-").map(Number);
    const [by, bm, bd] = b.date.split("-").map(Number);
    return (
      new Date(ay, am - 1, ad).getTime() - new Date(by, bm - 1, bd).getTime()
    );
  });
}

interface AttendanceContextValue {
  attendance: AttendanceRecord[];
  addAttendance: (date: string, type?: AttendType) => void;
  isCheckedIn: (date: string) => boolean;
}

const AttendanceContext = createContext<AttendanceContextValue | null>(null);

export function AttendanceProvider({ children }: { children: React.ReactNode }) {
  const [userCheckIns, setUserCheckIns] = useState<AttendanceRecord[]>([]);

  const addAttendance = useCallback((date: string, type: AttendType = "self") => {
    setUserCheckIns((prev) => {
      const exists = prev.some((a) => a.date === date);
      if (exists) return prev;
      return [...prev, { date, type }];
    });
  }, []);

  const isCheckedIn = useCallback(
    (date: string) => {
      const merged = mergeAttendance(staticAttendance, userCheckIns);
      return merged.some((a) => a.date === date);
    },
    [userCheckIns]
  );

  const attendance = mergeAttendance(staticAttendance, userCheckIns);

  return (
    <AttendanceContext.Provider
      value={{ attendance, addAttendance, isCheckedIn }}
    >
      {children}
    </AttendanceContext.Provider>
  );
}

export function useAttendance() {
  const ctx = useContext(AttendanceContext);
  if (!ctx) {
    throw new Error("useAttendance must be used within AttendanceProvider");
  }
  return ctx;
}
