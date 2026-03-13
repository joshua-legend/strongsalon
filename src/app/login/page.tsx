"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { TEST_CREDENTIALS } from "@/data/mockAccounts";

export default function LoginPage() {
  const router = useRouter();
  const { currentAccountId, login } = useAuth();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (currentAccountId) {
      router.replace("/");
    }
  }, [currentAccountId, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const ok = login(id, password);
    if (ok) {
      router.replace("/");
    } else {
      setError("아이디 또는 비밀번호를 확인해주세요");
    }
  };

  const handleQuickLogin = (accountId: string) => {
    const pw = TEST_CREDENTIALS[accountId];
    const ok = login(accountId, pw);
    if (ok) router.replace("/");
  };

  if (currentAccountId) {
    return null;
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-5 bg-[var(--bg-body)] text-[var(--text-main)]">
      <div className="w-full max-w-[400px] flex flex-col items-center">
        <Link href="/" className="font-bebas text-[32px] tracking-wide leading-none mb-2">
          <span className="text-[var(--accent-main)]">Fit</span>
          <span className="text-[var(--text-sub)]">Log</span>
        </Link>
        <p className="font-bebas text-[10px] tracking-widest uppercase mb-12 text-[var(--text-sub)]">
          나의 피트니스 기록
        </p>

        <h1 className="font-bebas text-[28px] tracking-wide mb-2 text-[var(--text-main)]">
          로그인
        </h1>
        <p className="text-[13px] mb-6 text-center text-[var(--text-sub)]">
          테스트 계정으로 로그인하세요
        </p>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3 mb-6">
          <input
            type="text"
            placeholder="아이디"
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="w-full h-12 rounded-xl px-4 bg-[var(--bg-card)] border border-[var(--border-light)] text-[var(--text-main)] placeholder:text-[var(--text-sub)] text-[14px] outline-none focus:border-[var(--border-focus)] transition-colors duration-300"
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-12 rounded-xl px-4 bg-[var(--bg-card)] border border-[var(--border-light)] text-[var(--text-main)] placeholder:text-[var(--text-sub)] text-[14px] outline-none focus:border-[var(--border-focus)] transition-colors duration-300"
          />
          {error && (
            <p className="text-[12px] text-red-400">{error}</p>
          )}
          <button
            type="submit"
            className="w-full h-12 rounded-xl font-bold text-[14px] bg-[var(--accent-main)] text-[var(--accent-text)] hover:brightness-110 transition-all duration-300 active:scale-[0.98]"
          >
            로그인
          </button>
        </form>

        <div className="w-full border-t border-[var(--border-light)] pt-4">
          <p className="text-[11px] text-[var(--text-sub)] mb-3 text-center">
            빠른 테스트 (클릭)
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => handleQuickLogin("민준")}
              className="flex-1 py-3 rounded-xl border border-[var(--border-light)] text-[13px] text-[var(--text-main)] hover:border-[var(--accent-main)]/50 hover:bg-[var(--accent-bg)] transition-colors duration-300 active:scale-95"
            >
              민준 / 1234
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin("지현")}
              className="flex-1 py-3 rounded-xl border border-[var(--border-light)] text-[13px] text-[var(--text-main)] hover:border-[var(--accent-main)]/50 hover:bg-[var(--accent-bg)] transition-colors duration-300 active:scale-95"
            >
              지현 / 1234
            </button>
          </div>
        </div>

        <p className="mt-6 text-center">
          <Link href="/signup" className="text-[13px] text-[var(--text-sub)] hover:text-[var(--text-main)] transition-colors duration-300">
            계정이 없으신가요? 회원가입
          </Link>
        </p>
        <p className="mt-4 text-[11px] text-center text-[var(--text-sub)]">
          로그인 시 서비스 이용약관 및 개인정보 처리방침에 동의하게 됩니다.
        </p>
      </div>
    </div>
  );
}
