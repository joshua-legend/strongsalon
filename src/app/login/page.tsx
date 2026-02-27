'use client';

import Link from 'next/link';

export default function LoginPage() {
  const handleGoogleLogin = () => {
    // TODO: OAuth - signIn('google') or redirect to Google OAuth URL
    window.location.href = '/';
  };

  const handleKakaoLogin = () => {
    // TODO: OAuth - redirect to Kakao OAuth URL
    window.location.href = '/';
  };

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
        <p className="text-[13px] mb-10 text-center text-neutral-400">
          구글이나 카카오로 간편하게 시작하세요
        </p>

        <div className="w-full flex flex-col gap-3">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full h-12 rounded-xl flex items-center justify-center gap-3 font-medium text-[14px] transition-opacity active:opacity-90 bg-neutral-900 border border-neutral-700 text-white"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google로 계속하기
          </button>

          <button
            type="button"
            onClick={handleKakaoLogin}
            className="w-full h-12 rounded-xl flex items-center justify-center gap-3 font-medium text-[14px] transition-opacity active:opacity-90"
            style={{
              background: '#FEE500',
              border: 'none',
              color: '#191919',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#191919">
              <path d="M12 3c-5.8 0-10.5 3.66-10.5 8.18 0 2.84 1.7 5.35 4.28 6.87-.22.82-.82 3.02-.94 3.48 0 0-.02.12.07.17.09.06.13.05.2-.02.04-.04 1.5-1.94 2.1-2.72.68.1 1.4.15 2.14.15 5.8 0 10.5-3.66 10.5-8.18S17.8 3 12 3z" />
            </svg>
            카카오로 계속하기
          </button>
        </div>

        <p className="mt-8 text-[11px] text-center text-neutral-400">
          로그인 시 서비스 이용약관 및 개인정보 처리방침에 동의하게 됩니다.
        </p>
      </div>
    </div>
  );
}
