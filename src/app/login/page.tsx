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
    <div className="min-h-dvh flex flex-col items-center justify-center px-5 bg-neutral-950 text-white">
      <div className="w-full max-w-[400px] flex flex-col items-center">
        <Link href="/" className="font-bebas text-[32px] tracking-wide leading-none mb-2">
          <span className="text-orange-500">Fit</span>
          <span className="text-neutral-400">Log</span>
        </Link>
        <p className="font-bebas text-[10px] tracking-widest uppercase mb-12 text-neutral-400">
          나의 피트니스 기록
        </p>

        <h1 className="font-bebas text-[28px] tracking-wide mb-2 text-white">
          로그인
        </h1>
        <p className="text-[13px] mb-6 text-center text-neutral-400">
          테스트 계정으로 로그인하세요
        </p>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3 mb-6">
          <input
            type="text"
            placeholder="아이디"
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="w-full h-12 rounded-xl px-4 bg-neutral-900 border border-neutral-700 text-white placeholder:text-neutral-500 text-[14px]"
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-12 rounded-xl px-4 bg-neutral-900 border border-neutral-700 text-white placeholder:text-neutral-500 text-[14px]"
          />
          {error && (
            <p className="text-[12px] text-red-400">{error}</p>
          )}
          <button
            type="submit"
            className="w-full h-12 rounded-xl font-medium text-[14px] bg-lime-500 text-black hover:bg-lime-400 transition-colors"
          >
            로그인
          </button>
        </form>

        <div className="w-full border-t border-neutral-800 pt-4">
          <p className="text-[11px] text-neutral-500 mb-3 text-center">
            빠른 테스트 (클릭)
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => handleQuickLogin("민준")}
              className="flex-1 py-3 rounded-xl border border-neutral-700 text-[13px] hover:border-lime-500/50 hover:bg-lime-500/10 transition-colors"
            >
              민준 / 1234
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin("지현")}
              className="flex-1 py-3 rounded-xl border border-neutral-700 text-[13px] hover:border-lime-500/50 hover:bg-lime-500/10 transition-colors"
            >
              지현 / 1234
            </button>
          </div>
        </div>

        <p className="mt-6 text-center">
          <Link href="/signup" className="text-[13px] text-neutral-400 hover:text-white transition-colors">
            계정이 없으신가요? 회원가입
          </Link>
        </p>
        <p className="mt-4 text-[11px] text-center text-neutral-400">
          로그인 시 서비스 이용약관 및 개인정보 처리방침에 동의하게 됩니다.
        </p>
      </div>
    </div>
  );
}
