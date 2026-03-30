"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { useProfile } from "@/context/ProfileContext";
import { useAuth } from "@/context/AuthContext";
import { useInbody } from "@/context/InbodyContext";
import { useGoal } from "@/context/GoalContext";
import { useChartData } from "@/context/ChartDataContext";
import { getDaysLeft, formatExpiry } from "@/utils/homeUtils";
import PtTicketCard from "@/components/home/PtTicketCard";
import GymTicketCard from "@/components/home/GymTicketCard";
import type { OnboardingExperience } from "@/types/onboarding";
import type { Experience } from "@/types/profile";

const ONBOARDING_EXPERIENCE_LABELS: Record<OnboardingExperience, string> = {
  first: "퍼스트",
  under3m: "언더 3개월",
  "3m_to_1y": "3개월~1년",
  "1y_to_2y": "1년~2년",
  over2y: "오버 2년",
};

const EXPERIENCE_LABELS: Record<Experience, string> = {
  untrained: "언트레인드",
  novice: "노비스",
  intermediate: "인터미디어트",
  advanced: "어드밴스드",
  elite: "엘리트",
};

interface MyPageModalProps {
  open: boolean;
  onClose: () => void;
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
  } catch {
    return "-";
  }
}

export default function MyPageModal({ open, onClose }: MyPageModalProps) {
  const router = useRouter();
  const { user } = useUser();
  const { profile } = useProfile();
  const { logout, accountData, updateAccountData } = useAuth();
  const { inbodyHistory } = useInbody();
  const { categorySettings } = useGoal();
  const { chartDataPoints } = useChartData();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editHeight, setEditHeight] = useState("");
  const [editWeight, setEditWeight] = useState("");

  const inbodyStart = categorySettings?.inbody?.startValues;
  const latestInbody = inbodyHistory?.[0];
  const weightFromChart = (() => {
    const arr = chartDataPoints?.["inbody.weight"] ?? [];
    if (arr.length === 0) return null;
    const latest = arr.reduce((a, b) => (a.date >= b.date ? a : b));
    return latest?.value ?? null;
  })();
  const resolvedWeight =
    profile?.weight ??
    latestInbody?.weight ??
    inbodyStart?.weight ??
    user?.bodyComp?.weight ??
    user?.weight ??
    weightFromChart ??
    null;

  if (!open) return null;

  const weight = resolvedWeight;
  const muscleMass = latestInbody?.muscleMass ?? user?.bodyComp?.muscle ?? inbodyStart?.muscleMass ?? null;
  const fatPercent =
    latestInbody?.fatPercent ?? user?.bodyComp?.fatPct ?? inbodyStart?.fatPercent ?? null;
  const height = profile?.height ?? null;
  const createdAt = profile?.createdAt ?? user?.membershipStart ?? null;

  const handleSave = () => {
    const name = (editName.trim() || user?.name) ?? "";
    const heightNum = parseFloat(editHeight);
    const weightNum = parseFloat(editWeight);

    if (accountData) {
      const newHeight = Number.isFinite(heightNum) ? heightNum : (profile?.height ?? user?.height);
      const newWeight = Number.isFinite(weightNum) ? weightNum : (profile?.weight ?? user?.bodyComp?.weight ?? user?.weight);
      updateAccountData((prev) => ({
        ...prev,
        user: { ...prev.user, name },
        profile: {
          ...prev.profile,
          height: newHeight ?? prev.profile.height,
          weight: newWeight ?? prev.profile.weight,
        },
      }));
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditName(user?.name ?? "");
    setEditHeight(String(profile?.height ?? user?.height ?? ""));
    setEditWeight(String(resolvedWeight ?? ""));
    setIsEditing(false);
  };

  const handleClose = () => {
    setIsEditing(false);
    onClose();
  };

  const handleOpenEdit = () => {
    setEditName(user?.name ?? "");
    setEditHeight(String(profile?.height ?? user?.height ?? ""));
    setEditWeight(String(resolvedWeight ?? ""));
    setIsEditing(true);
  };

  const exerciseDuration =
    accountData?.onboarding?.experience != null
      ? ONBOARDING_EXPERIENCE_LABELS[accountData.onboarding.experience]
      : null;
  const proficiency =
    (profile?.experience ?? user?.experience) != null
      ? EXPERIENCE_LABELS[(profile?.experience ?? user?.experience)!]
      : null;

  const ptRemaining = user?.remainingSessions ?? 0;
  const ptTotal = user?.totalSessions ?? 0;
  const membershipExpiry = user?.membershipExpiry;
  const membershipDaysLeft = membershipExpiry ? Math.max(0, getDaysLeft(membershipExpiry)) : null;
  const membershipExpiryFmt = membershipExpiry ? formatExpiry(membershipExpiry) : null;

  const rows: { label: string; value: string | number | null }[] = [
    { label: "회원명", value: user?.name ?? null },
    { label: "키", value: height != null ? `${height} cm` : null },
    { label: "체중", value: weight != null ? `${weight} kg` : null },
    { label: "골격근량", value: muscleMass != null ? `${muscleMass} kg` : null },
    { label: "체지방률", value: fatPercent != null ? `${fatPercent}%` : null },
    { label: "운동 경력", value: exerciseDuration },
    { label: "숙련도", value: proficiency },
    { label: "가입날짜", value: createdAt ? formatDate(createdAt) : null },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden
      />
      <div className="relative w-full max-w-sm max-h-[85vh] overflow-y-auto rounded-2xl border p-6 shadow-xl" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-light)" }}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bebas text-xl tracking-wider" style={{ color: "var(--accent-main)" }}>
            마이페이지
          </h3>
          <button
            type="button"
            onClick={handleClose}
            className="text-sm transition-colors text-[var(--text-sub)] hover:text-[var(--text-main)]"
          >
            닫기
          </button>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs text-[var(--text-sub)] font-mono">회원명</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border text-sm font-mono focus:outline-none"
                style={{ backgroundColor: "var(--bg-body)", borderColor: "var(--border-light)", color: "var(--text-main)" }}
                placeholder="회원명"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs text-[var(--text-sub)] font-mono">키 (cm)</label>
              <input
                type="number"
                value={editHeight}
                onChange={(e) => setEditHeight(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border text-sm font-mono focus:outline-none"
                style={{ backgroundColor: "var(--bg-body)", borderColor: "var(--border-light)", color: "var(--text-main)" }}
                placeholder="키"
                min={100}
                max={250}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs text-[var(--text-sub)] font-mono">체중 (kg)</label>
              <input
                type="number"
                value={editWeight}
                onChange={(e) => setEditWeight(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border text-sm font-mono focus:outline-none"
                style={{ backgroundColor: "var(--bg-body)", borderColor: "var(--border-light)", color: "var(--text-main)" }}
                placeholder="체중"
                min={30}
                max={200}
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 py-2.5 rounded-lg font-bold text-sm hover:brightness-110 transition-colors"
                style={{ backgroundColor: "var(--accent-main)", color: "var(--accent-text)" }}
              >
                저장
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 py-2.5 rounded-lg font-medium text-sm transition-colors border hover:bg-[var(--bg-card-hover)]"
                style={{ backgroundColor: "var(--bg-body)", borderColor: "var(--border-light)", color: "var(--text-main)" }}
              >
                취소
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-6">
              <PtTicketCard
                remaining={ptRemaining}
                total={ptTotal}
                nextPtDate={user?.nextPtDate}
                nextPtTime={user?.nextPtTime}
                trainerName={user?.trainerName}
              />
              <GymTicketCard daysLeft={membershipDaysLeft} expiryFormatted={membershipExpiryFmt} />
            </div>
            <div className="space-y-4">
              {rows.map(({ label, value }) => (
                <div
                  key={label}
                  className="flex justify-between items-baseline py-2 border-b last:border-0"
                  style={{ borderColor: "var(--border-light)" }}
                >
                  <span className="text-xs text-[var(--text-sub)] font-mono">{label}</span>
                  <span className="font-mono text-sm font-bold text-[var(--text-main)]">
                    {value ?? "-"}
                  </span>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleOpenEdit}
              className="w-full mt-6 py-2.5 rounded-lg font-bold text-sm hover:brightness-110 transition-colors"
              style={{ backgroundColor: "var(--accent-main)", color: "var(--accent-text)" }}
            >
              수정하기
            </button>
            <button
              type="button"
              onClick={() => {
                handleClose();
                logout();
                router.replace("/login");
              }}
              className="w-full mt-3 py-2.5 rounded-lg border text-sm transition-colors text-[var(--text-sub)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-main)]"
              style={{ borderColor: "var(--border-light)" }}
            >
              로그아웃
            </button>
          </>
        )}
      </div>
    </div>
  );
}
