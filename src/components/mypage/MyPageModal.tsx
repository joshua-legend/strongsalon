"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { useProfile } from "@/context/ProfileContext";
import { useAuth } from "@/context/AuthContext";

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
  const { user, setUser } = useUser();
  const { profile, setProfile } = useProfile();
  const { logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editHeight, setEditHeight] = useState("");
  const [editWeight, setEditWeight] = useState("");

  useEffect(() => {
    if (open) {
      setEditName(user?.name ?? "");
      setEditHeight(String(profile?.height ?? user?.height ?? ""));
      setEditWeight(String(profile?.weight ?? user?.bodyComp?.weight ?? user?.weight ?? ""));
    }
  }, [open, user?.name, user?.height, user?.weight, profile?.height, profile?.weight, user?.bodyComp?.weight]);

  if (!open) return null;

  const height = profile?.height ?? null;
  const weight = profile?.weight ?? user?.bodyComp?.weight ?? null;
  const bodyFatPct = user?.bodyComp?.fatPct ?? null;
  const muscleMass = user?.bodyComp?.muscle ?? null;
  const liftTotal = user?.liftTotal ?? null;
  const createdAt = profile?.createdAt ?? user?.membershipStart ?? null;

  const handleSave = () => {
    const name = (editName.trim() || user?.name) ?? "";
    const heightNum = parseFloat(editHeight);
    const weightNum = parseFloat(editWeight);

    if (user) {
      setUser({ ...user, name });
    }
    if (profile) {
      setProfile({
        ...profile,
        height: Number.isFinite(heightNum) ? heightNum : profile.height,
        weight: Number.isFinite(weightNum) ? weightNum : profile.weight,
      });
    } else if (user && (Number.isFinite(heightNum) || Number.isFinite(weightNum))) {
      setProfile({
        nickname: user.nickname,
        gender: user.gender,
        birthDate: user.birthDate,
        height: Number.isFinite(heightNum) ? heightNum : user.height,
        weight: Number.isFinite(weightNum) ? weightNum : user.weight,
        experience: user.experience,
        createdAt: user.createdAt,
      });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditName(user?.name ?? "");
    setEditHeight(String(profile?.height ?? user?.bodyComp?.weight ?? ""));
    setEditWeight(String(profile?.weight ?? user?.bodyComp?.weight ?? ""));
    setIsEditing(false);
  };

  const rows: { label: string; value: string | number | null }[] = [
    { label: "회원명", value: user?.name ?? null },
    { label: "키", value: height != null ? `${height} cm` : null },
    { label: "몸무게", value: weight != null ? `${weight} kg` : null },
    { label: "체지방량", value: bodyFatPct != null ? `${bodyFatPct}%` : null },
    { label: "골격근량", value: muscleMass != null ? `${muscleMass} kg` : null },
    { label: "1RM 중량", value: liftTotal != null ? `${liftTotal} kg` : null },
    { label: "가입날짜", value: createdAt ? formatDate(createdAt) : null },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative w-full max-w-sm rounded-2xl bg-neutral-900 border border-neutral-800 p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bebas text-xl text-lime-400 tracking-wider">
            마이페이지
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-neutral-400 hover:text-white transition-colors"
          >
            닫기
          </button>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs text-neutral-500 font-mono">회원명</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-sm text-white font-mono focus:outline-none focus:border-lime-500"
                placeholder="회원명"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs text-neutral-500 font-mono">키 (cm)</label>
              <input
                type="number"
                value={editHeight}
                onChange={(e) => setEditHeight(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-sm text-white font-mono focus:outline-none focus:border-lime-500"
                placeholder="키"
                min={100}
                max={250}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs text-neutral-500 font-mono">몸무게 (kg)</label>
              <input
                type="number"
                value={editWeight}
                onChange={(e) => setEditWeight(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-sm text-white font-mono focus:outline-none focus:border-lime-500"
                placeholder="몸무게"
                min={30}
                max={200}
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 py-2.5 rounded-lg bg-lime-500 text-black font-bold text-sm hover:bg-lime-400 transition-colors"
              >
                저장
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 py-2.5 rounded-lg bg-neutral-700 text-white font-medium text-sm hover:bg-neutral-600 transition-colors"
              >
                취소
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {rows.map(({ label, value }) => (
                <div
                  key={label}
                  className="flex justify-between items-baseline py-2 border-b border-neutral-800/80 last:border-0"
                >
                  <span className="text-xs text-neutral-500 font-mono">{label}</span>
                  <span className="font-mono text-sm font-bold text-white">
                    {value ?? "-"}
                  </span>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="w-full mt-6 py-2.5 rounded-lg bg-lime-500 text-black font-bold text-sm hover:bg-lime-400 transition-colors"
            >
              수정하기
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                logout();
                router.replace("/login");
              }}
              className="w-full mt-3 py-2.5 rounded-lg border border-neutral-600 text-neutral-400 text-sm hover:bg-neutral-800 transition-colors"
            >
              로그아웃
            </button>
          </>
        )}
      </div>
    </div>
  );
}
