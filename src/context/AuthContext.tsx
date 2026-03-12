"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import type { AccountId, AccountData } from "@/data/mockAccounts";
import type { OnboardingProfile } from "@/types/onboarding";
import {
  validateLogin,
  getAccountData,
  registerAccount,
  updateRegisteredAccount,
  isRegisteredAccount,
} from "@/data/mockAccounts";

interface AuthContextValue {
  currentAccountId: AccountId | null;
  ready: boolean;
  login: (id: string, password: string) => boolean;
  register: (id: string, password: string, onboarding: OnboardingProfile, name?: string) => boolean;
  logout: () => void;
  accountData: AccountData | null;
  updateAccountData: (updater: (prev: AccountData) => AccountData) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentAccountId, setCurrentAccountId] = useState<AccountId | null>(null);
  const [accountData, setAccountData] = useState<AccountData | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  const login = useCallback((id: string, password: string) => {
    const accountId = validateLogin(id, password);
    if (accountId) {
      const data = getAccountData(accountId);
      if (data) {
        setCurrentAccountId(accountId);
        setAccountData(structuredClone(data));
        return true;
      }
    }
    return false;
  }, []);

  const register = useCallback(
    (id: string, password: string, onboarding: OnboardingProfile, name?: string) => {
      const ok = registerAccount(id, password, onboarding, name);
      if (ok) return login(id, password);
      return false;
    },
    [login]
  );

  const logout = useCallback(() => {
    setCurrentAccountId(null);
    setAccountData(null);
  }, []);

  const updateAccountData = useCallback(
    (updater: (prev: AccountData) => AccountData) => {
      setAccountData((prev) => {
        if (!prev) return prev;
        const next = updater(structuredClone(prev));
        if (currentAccountId && isRegisteredAccount(currentAccountId)) {
          updateRegisteredAccount(currentAccountId, next);
        }
        return next;
      });
    },
    [currentAccountId]
  );

  return (
    <AuthContext.Provider
      value={{
        currentAccountId,
        ready,
        login,
        register,
        logout,
        accountData,
        updateAccountData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
