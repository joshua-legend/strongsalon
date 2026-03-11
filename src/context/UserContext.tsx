"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";
import type { User } from "@/types/user";
import { mockUser } from "@/data/mockUserData";

interface UserContextValue {
  user: User | null;
  setUser: (u: User | null) => void;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(mockUser);

  const setUser = useCallback((u: User | null) => {
    setUserState(u);
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
