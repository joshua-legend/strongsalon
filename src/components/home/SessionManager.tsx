"use client";

import { member } from "@/data/member";

function parseDateMs(dateStr: string): number {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).getTime();
}

function getDaysLeft(dateStr: string): number {
  return Math.ceil((parseDateMs(dateStr) - Date.now()) / 86400000);
}

function formatShort(dateStr: string): string {
  const [, m, d] = dateStr.split("-").map(Number);
  return `${m}월 ${d}일`;
}

function ptBgColor(remaining: number, total: number): string {
  const ratio = total > 0 ? remaining / total : 0;
  if (ratio >= 0.5)  return "rgb(163,230,53)";
  if (ratio >= 0.25) return "rgb(249,115,22)";
  return "rgb(239,68,68)";
}

function membershipBgColor(days: number): string {
  if (days > 30) return "rgb(163,230,53)";
  if (days > 14) return "rgb(249,115,22)";
  return "rgb(239,68,68)";
}

/** 총 세션 기반 도트 — 사용분 dim, 잔여분 color */
function SessionDots({ remaining, total, color }: { remaining: number; total: number; color: string }) {
  const capped = Math.min(total, 20);
  const used   = total - remaining;

  return (
    <div className="mt-2">
      <div className="flex flex-wrap gap-1">
        {Array.from({ length: capped }).map((_, i) => (
          <span
            key={i}
            className="w-2.5 h-2.5 rounded-full transition-all"
            style={{
              background: i < used ? "rgb(38,38,38)" : color,
              opacity:    i < used ? 0.3 : 1,
            }}
          />
        ))}
        {total > 20 && (
          <span className="font-bebas text-[8px] text-neutral-500 self-center">+{total - 20}</span>
        )}
      </div>
      <p className="font-bebas text-[8px] mt-1 text-neutral-500">
        {used}회 사용 · 총 {total}회
      </p>
    </div>
  );
}

/** 실제 등록 기간 기반 멤버십 진행 바 */
function MembershipBar({ start, expiry, color }: { start: string; expiry: string; color: string }) {
  const startMs  = parseDateMs(start);
  const expiryMs = parseDateMs(expiry);
  const totalMs  = expiryMs - startMs;
  const leftMs   = expiryMs - Date.now();
  const pct      = totalMs > 0 ? Math.min(100, Math.max(0, Math.round((leftMs / totalMs) * 100))) : 0;
  const totalDays   = Math.ceil(totalMs / 86400000);
  const elapsedDays = totalDays - Math.ceil(leftMs / 86400000);

  return (
    <div className="mt-2">
      <div className="h-1.5 rounded-full overflow-hidden bg-neutral-950">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <p className="font-bebas text-[8px] mt-0.5 text-neutral-500">
        등록 후 {elapsedDays}일째 · 잔여 {pct}%
      </p>
    </div>
  );
}

export default function SessionManager() {
  const sessions = member.remainingSessions ?? 0;
  const total    = member.totalSessions     ?? 0;
  const nextDate = member.nextPtDate;
  const expiry   = member.membershipExpiry;
  const start    = member.membershipStart;
  const daysLeft = expiry ? getDaysLeft(expiry) : null;

  const ptBg = ptBgColor(sessions, total);
  const msBg = daysLeft !== null ? membershipBgColor(daysLeft) : "rgb(163,163,163)";

  const ptUrgent = total > 0 && sessions / total < 0.25;
  const msUrgent = daysLeft !== null && daysLeft <= 14;

  return (
    <div className="card">
      <p className="card-label mb-3">💳 회원 현황</p>

      <div className="grid grid-cols-2 gap-3">

        {/* 잔여 PT */}
        <div
          className={`rounded-xl p-3 bg-neutral-900 border ${ptUrgent ? "" : "border-neutral-800"}`}
          style={ptUrgent ? { borderColor: ptBg + "50" } : undefined}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-bebas text-[9px] text-neutral-400">잔여 PT</span>
            {ptUrgent && (
              <span
                className="font-bebas text-[8px] px-1.5 py-0.5 rounded-full animate-pulse"
                style={{ background: ptBg + "25", color: ptBg }}
              >
                부족
              </span>
            )}
          </div>

          <div className="flex items-end gap-1">
            <span
              className={`font-bebas text-[40px] leading-none ${ptUrgent ? "animate-pulse" : ""}`}
              style={{ color: ptBg }}
            >
              {sessions}
            </span>
            <div className="mb-1.5">
              <span className="font-bebas text-[9px] text-neutral-400">회</span>
              {total > 0 && (
                <span className="font-bebas text-[8px] text-neutral-600 ml-1">/ {total}</span>
              )}
            </div>
          </div>

          {total > 0 && (
            <SessionDots remaining={sessions} total={total} color={ptBg} />
          )}

          {nextDate && (
            <div className="mt-2.5 flex items-center gap-1 px-2 py-1 rounded-lg bg-neutral-950">
              <span className="text-[10px]">📅</span>
              <span className="font-bebas text-[9px] text-neutral-500">
                다음 PT {formatShort(nextDate)}
              </span>
            </div>
          )}
        </div>

        {/* 헬스장 이용 */}
        <div
          className={`rounded-xl p-3 bg-neutral-900 border ${msUrgent ? "" : "border-neutral-800"}`}
          style={msUrgent ? { borderColor: msBg + "50" } : undefined}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-bebas text-[9px] text-neutral-400">헬스장 이용</span>
            {msUrgent && (
              <span
                className="font-bebas text-[8px] px-1.5 py-0.5 rounded-full animate-pulse"
                style={{ background: msBg + "25", color: msBg }}
              >
                만료 임박
              </span>
            )}
          </div>

          {daysLeft !== null ? (
            <>
              <div className="flex items-end gap-0.5">
                <span
                  className={`font-bebas text-[32px] leading-none ${msUrgent ? "animate-pulse" : ""}`}
                  style={{ color: msBg }}
                >
                  D-{Math.max(0, daysLeft)}
                </span>
              </div>
              <p className="font-bebas text-[9px] mt-0.5 text-neutral-400">일 남음</p>

              {start && expiry && (
                <MembershipBar start={start} expiry={expiry} color={msBg} />
              )}

              {expiry && (
                <div className="mt-2.5 flex items-center gap-1 px-2 py-1 rounded-lg bg-neutral-950">
                  <span className="text-[10px]">🗓️</span>
                  <span className="font-bebas text-[9px] text-neutral-500">
                    {formatShort(expiry)} 만료
                  </span>
                </div>
              )}
            </>
          ) : (
            <p className="font-bebas text-[10px] mt-2 text-neutral-400">정보 없음</p>
          )}
        </div>

      </div>
    </div>
  );
}
