"use client";

import { useState } from "react";
import { Sliders, X, Dumbbell, Activity, Zap } from "lucide-react";
import { strengthConfigs, cardioConfigs } from "@/config/targetConfigs";

export type TargetValues = {
  legs: number;
  chest: number;
  back: number;
  shoulders: number;
  biceps: number;
  triceps: number;
  core: number;
  running: number;
  rowing: number;
  cycling: number;
};

const DEFAULT_TARGETS: TargetValues = {
  legs: 150,
  chest: 120,
  back: 120,
  shoulders: 100,
  biceps: 80,
  triceps: 80,
  core: 150,
  running: 15,
  rowing: 5,
  cycling: 20,
};

interface TargetSliderModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  initialTargets?: Partial<TargetValues>;
}

export default function TargetSliderModal({
  open,
  onClose,
  onConfirm,
  initialTargets = {},
}: TargetSliderModalProps) {
  const [activeTab, setActiveTab] = useState<"STRENGTH" | "CARDIO">("STRENGTH");
  const [targets, setTargets] = useState<TargetValues>({ ...DEFAULT_TARGETS, ...initialTargets });

  if (!open) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-[480px] bg-neutral-950 border-t border-neutral-800 rounded-t-3xl p-5 pt-7 animate-slide-up shadow-[0_-10px_40px_rgba(0,0,0,0.8)] flex flex-col max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-neutral-500 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="mb-5 shrink-0">
          <h2 className="text-4xl font-bebas text-white tracking-wider flex items-center gap-2">
            <Sliders className="w-7 h-7 text-lime-400" /> SET PARAMETERS
          </h2>
        </div>

        <div className="flex border-b border-neutral-800 mb-5 shrink-0">
          <button
            onClick={() => setActiveTab("STRENGTH")}
            className={`flex-1 pb-3 text-sm font-bold font-mono tracking-widest flex items-center justify-center gap-2 transition-colors ${activeTab === "STRENGTH" ? "text-lime-400 border-b-2 border-lime-400" : "text-neutral-600 hover:text-neutral-400"}`}
          >
            <Dumbbell className="w-4 h-4" /> 근력
          </button>
          <button
            onClick={() => setActiveTab("CARDIO")}
            className={`flex-1 pb-3 text-sm font-bold font-mono tracking-widest flex items-center justify-center gap-2 transition-colors ${activeTab === "CARDIO" ? "text-cyan-400 border-b-2 border-cyan-400" : "text-neutral-600 hover:text-neutral-400"}`}
          >
            <Activity className="w-4 h-4" /> 유산소
          </button>
        </div>

        <div className="overflow-y-auto pl-5 pr-3 mb-6 flex-1 space-y-6 min-h-[30vh]">
          {activeTab === "STRENGTH" &&
            strengthConfigs.map((conf) => {
              const val = targets[conf.id as keyof TargetValues];
              return (
                <div key={conf.id}>
                  <div className="flex justify-between items-end mb-2">
                    <span
                      className={`inline-block px-2 py-0.5 ${conf.color} text-black font-bold text-[10px] uppercase italic -skew-x-12`}
                    >
                      <span className="skew-x-12 block">{conf.label}</span>
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span
                        className={`text-3xl font-bebas leading-none transition-all ${val > 0 ? `${conf.text} ${conf.shadow}` : "text-neutral-500"}`}
                      >
                        {val}
                      </span>
                      <span className="text-xs font-mono text-neutral-600">REPS</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={conf.max}
                    step={conf.step}
                    value={val}
                    onChange={(e) => setTargets({ ...targets, [conf.id]: Number(e.target.value) })}
                    className={`tactical-slider ${conf.slider}`}
                  />
                </div>
              );
            })}

          {activeTab === "CARDIO" &&
            cardioConfigs.map((conf) => {
              const val = targets[conf.id as keyof TargetValues];
              return (
                <div key={conf.id}>
                  <div className="flex justify-between items-end mb-2">
                    <span
                      className={`inline-block px-2 py-0.5 ${conf.color} text-black font-bold text-[10px] uppercase italic -skew-x-12`}
                    >
                      <span className="skew-x-12 block">{conf.label}</span>
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span
                        className={`text-3xl font-bebas leading-none transition-all ${val > 0 ? `${conf.text} ${conf.shadow}` : "text-neutral-500"}`}
                      >
                        {val}
                      </span>
                      <span className="text-xs font-mono text-neutral-600">KM</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={conf.max}
                    step={conf.step}
                    value={val}
                    onChange={(e) => setTargets({ ...targets, [conf.id]: Number(e.target.value) })}
                    className={`tactical-slider ${conf.slider}`}
                  />
                </div>
              );
            })}
        </div>

        <div className="shrink-0 mt-auto pb-4">
          <button
            onClick={handleConfirm}
            className="w-full relative bg-white text-black py-4 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] transition-all active:scale-[0.98]"
          >
            <div className="absolute inset-0 bg-stripes opacity-10" />
            <span className="relative z-10 font-bebas text-2xl tracking-widest flex items-center justify-center gap-2">
              <Zap className="w-5 h-5" fill="currentColor" /> AUTHORIZE DIRECTIVE
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
