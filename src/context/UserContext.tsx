"use client";

import React, { createContext, useContext, useCallback } from "react";
import type { User } from "@/types/user";
import { useAuth } from "./AuthContext";

interface UserContextValue {
  user: User | null;
  setUser: (u: User | null) => void;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { accountData } = useAuth();
  const user = accountData?.user ?? null;

  const setUser = useCallback((_u: User | null) => {
    // 읽기 전용: accountData에서 제공
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
