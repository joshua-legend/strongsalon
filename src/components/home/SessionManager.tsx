"use client";

import { useSessionManager, parseDateMs, formatShort } from "./useSessionManager";
import { SessionDots } from "./SessionDots";

function MembershipBar({ start, expiry, color }: { start: string; expiry: string; color: string }) {
  const startMs = parseDateMs(start);
  const expiryMs = parseDateMs(expiry);
  const totalMs = expiryMs - startMs;
  const leftMs = expiryMs - Date.now();
  const pct = totalMs > 0 ? Math.min(100, Math.max(0, Math.round((leftMs / totalMs) * 100))) : 0;
  const totalDays = Math.ceil(totalMs / 86400000);
  const elapsedDays = totalDays - Math.ceil(leftMs / 86400000);

  return (
    <div className="mt-2">
      <div className="h-1.5 rounded-full overflow-hidden bg-[var(--bg-body)]">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
      </div>
      <p className="font-bebas text-[8px] mt-0.5 text-[var(--text-sub)]">등록 후 {elapsedDays}일째 · 잔여 {pct}%</p>
    </div>
  );
}

export default function SessionManager() {
  const { sessions, total, nextDate, expiry, start, daysLeft, ptBg, msBg, ptUrgent, msUrgent } =
    useSessionManager();

  return (
    <div className="card">
      <p className="card-label mb-3">💳 회원 현황</p>

      <div className="grid grid-cols-2 gap-3">
        {/* 잔여 PT */}
        <div
          className={`rounded-xl p-3 bg-[var(--bg-card)] border ${ptUrgent ? "" : "border-[var(--border-light)]"}`}
          style={ptUrgent ? { borderColor: ptBg + "50" } : undefined}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-bebas text-[9px] text-[var(--text-sub)]">잔여 PT</span>
            {ptUrgent && (
              <span className="font-bebas text-[8px] px-1.5 py-0.5 rounded-full animate-pulse"
                style={{ background: ptBg + "25", color: ptBg }}>
                부족
              </span>
            )}
          </div>

          <div className="flex items-end gap-1">
            <span className={`font-bebas text-[40px] leading-none ${ptUrgent ? "animate-pulse" : ""}`}
              style={{ color: ptBg }}>
              {sessions}
            </span>
            <div className="mb-1.5">
              <span className="font-bebas text-[9px] text-[var(--text-sub)]">회</span>
              {total > 0 && <span className="font-bebas text-[8px] text-[var(--text-sub)] ml-1">/ {total}</span>}
            </div>
          </div>

          {total > 0 && <SessionDots remaining={sessions} total={total} color={ptBg} />}

          {nextDate && (
            <div className="mt-2.5 flex items-center gap-1 px-2 py-1 rounded-lg bg-[var(--bg-body)]">
              <span className="text-[10px]">📅</span>
              <span className="font-bebas text-[9px] text-[var(--text-sub)]">다음 PT {formatShort(nextDate)}</span>
            </div>
          )}
        </div>

        {/* 헬스장 이용 */}
        <div
          className={`rounded-xl p-3 bg-[var(--bg-card)] border ${msUrgent ? "" : "border-[var(--border-light)]"}`}
          style={msUrgent ? { borderColor: msBg + "50" } : undefined}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-bebas text-[9px] text-[var(--text-sub)]">헬스장 이용</span>
            {msUrgent && (
              <span className="font-bebas text-[8px] px-1.5 py-0.5 rounded-full animate-pulse"
                style={{ background: msBg + "25", color: msBg }}>
                만료 임박
              </span>
            )}
          </div>

          {daysLeft !== null ? (
            <>
              <div className="flex items-end gap-0.5">
                <span className={`font-bebas text-[32px] leading-none ${msUrgent ? "animate-pulse" : ""}`}
                  style={{ color: msBg }}>
                  D-{Math.max(0, daysLeft)}
                </span>
              </div>
              <p className="font-bebas text-[9px] mt-0.5 text-[var(--text-sub)]">일 남음</p>

              {start && expiry && <MembershipBar start={start} expiry={expiry} color={msBg} />}

              {expiry && (
                <div className="mt-2.5 flex items-center gap-1 px-2 py-1 rounded-lg bg-[var(--bg-body)]">
                  <span className="text-[10px]">🗓️</span>
                  <span className="font-bebas text-[9px] text-[var(--text-sub)]">{formatShort(expiry)} 만료</span>
                </div>
              )}
            </>
          ) : (
            <p className="font-bebas text-[10px] mt-2 text-[var(--text-sub)]">정보 없음</p>
          )}
        </div>
      </div>
    </div>
  );
}
