"use client";

import { motion } from "framer-motion";
import { X, Zap } from "lucide-react";
import type { ExerciseInfoItem } from "@/types";

interface ExerciseDetailProps {
  item: ExerciseInfoItem | null;
  onClose: () => void;
}

// 테스트용 YouTube Shorts 영상 ID (autoplay는 mute 필수)
const TEST_SHORTS_ID = "NIh2jqw0ASE";
const EMBED_URL = `https://www.youtube.com/embed/${TEST_SHORTS_ID}?autoplay=1&mute=1&loop=1&playlist=${TEST_SHORTS_ID}&playsinline=1`;

export default function ExerciseDetail({ item, onClose }: ExerciseDetailProps) {
  if (!item) return null;

  // 테스트용 더미 진행 데이터 (실제로는 workout state에서 가져옴)
  const current = 50;
  const target = 80;
  const unit = "reps";
  const progress = Math.min(100, (current / target) * 100);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm transition-all"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-sm aspect-[9/16] bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl border border-neutral-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. YouTube Shorts (autoplay + mute 필수) */}
        <iframe
          src={EMBED_URL}
          title="Exercise Shorts"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />

        {/* 2. 하단 그라데이션 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-black/40 pointer-events-none" />

        {/* 3. 우측 상단 닫기 버튼 */}
        <button
          className="absolute top-4 right-4 bg-black/40 hover:bg-black/70 p-2 rounded-full text-white transition-colors z-10"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>

        {/* 4. 하단 정보 오버레이 */}
        <div className="absolute bottom-6 left-5 right-5 pointer-events-none z-10">
          {/* 태그 영역 */}
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block px-2 py-0.5 text-[10px] font-bold italic uppercase -skew-x-12 text-black bg-lime-400">
              <span className="skew-x-12 block">{item.category}</span>
            </span>
            <span className="bg-neutral-800/80 backdrop-blur text-white text-[10px] font-bebas px-2 py-0.5 rounded uppercase flex items-center gap-1 border border-neutral-700">
              <Zap className="w-3 h-3 text-lime-400 fill-lime-400" /> In
              Progress
            </span>
          </div>

          {/* 메인 타이틀 */}
          <h3 className="text-4xl font-bebas text-white tracking-wide mb-1 drop-shadow-md">
            {item.name}
          </h3>

          {/* 타겟 수치 및 진행률 */}
          <div className="text-sm font-bebas text-neutral-300 flex items-center gap-2">
            <span>TARGET:</span>
            <span className="text-white font-bold text-lg">
              {current}{" "}
              <span className="text-neutral-500 text-sm">/ {target}</span>
            </span>
            <span className="text-[10px] text-neutral-500">{unit}</span>
          </div>

          {/* 미니 프로그레스 바 */}
          <div className="w-full h-1 bg-neutral-800/50 rounded-full mt-3 overflow-hidden backdrop-blur">
            <div
              className="h-full bg-lime-400 transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
