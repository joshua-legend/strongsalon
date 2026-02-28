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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/90 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />
      <div
        className="relative w-full max-w-[480px] rounded-t-3xl p-5 pt-7 animate-slide-up flex flex-col max-h-[90vh]"
        style={{
          background: "#030303",
          borderTop: "1px solid rgba(163,230,53,.3)",
          boxShadow: "0 -20px 60px rgba(0,0,0,.95), 0 -1px 0 rgba(163,230,53,.2)",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 transition-all text-neutral-700 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Title */}
        <div className="mb-5 shrink-0">
          <h2 className="text-4xl font-bebas tracking-wider flex items-center gap-2 text-white">
            <Sliders
              className="w-7 h-7"
              style={{
                color: "#a3e635",
                filter: "drop-shadow(0 0 8px rgba(163,230,53,.6))",
              }}
            />
            <span style={{ textShadow: "0 0 15px rgba(163,230,53,.25)" }}>
              SET PARAMETERS
            </span>
          </h2>
        </div>

        {/* Tabs */}
        <div
          className="flex border-b mb-5 shrink-0"
          style={{ borderColor: "rgba(255,255,255,.06)" }}
        >
          <button
            onClick={() => setActiveTab("STRENGTH")}
            className={`flex-1 pb-3 text-sm font-bold font-mono tracking-widest flex items-center justify-center gap-2 transition-all ${
              activeTab === "STRENGTH"
                ? "border-b-2 border-lime-400"
                : "text-neutral-700 hover:text-neutral-500"
            }`}
            style={
              activeTab === "STRENGTH"
                ? { color: "#a3e635", textShadow: "0 0 8px rgba(163,230,53,.5)" }
                : {}
            }
          >
            <Dumbbell className="w-4 h-4" /> 근력
          </button>
          <button
            onClick={() => setActiveTab("CARDIO")}
            className={`flex-1 pb-3 text-sm font-bold font-mono tracking-widest flex items-center justify-center gap-2 transition-all ${
              activeTab === "CARDIO"
                ? "text-cyan-400 border-b-2 border-cyan-400"
                : "text-neutral-700 hover:text-neutral-500"
            }`}
            style={
              activeTab === "CARDIO"
                ? { textShadow: "0 0 8px rgba(0,229,255,.5)" }
                : {}
            }
          >
            <Activity className="w-4 h-4" /> 유산소
          </button>
        </div>

        {/* Slider content */}
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
                        className={`text-3xl font-bebas leading-none transition-all ${
                          val > 0 ? `${conf.text} ${conf.shadow}` : "text-neutral-700"
                        }`}
                      >
                        {val}
                      </span>
                      <span className="text-xs font-mono text-neutral-700">REPS</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={conf.max}
                    step={conf.step}
                    value={val}
                    onChange={(e) =>
                      setTargets({ ...targets, [conf.id]: Number(e.target.value) })
                    }
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
                        className={`text-3xl font-bebas leading-none transition-all ${
                          val > 0 ? `${conf.text} ${conf.shadow}` : "text-neutral-700"
                        }`}
                      >
                        {val}
                      </span>
                      <span className="text-xs font-mono text-neutral-700">KM</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={conf.max}
                    step={conf.step}
                    value={val}
                    onChange={(e) =>
                      setTargets({ ...targets, [conf.id]: Number(e.target.value) })
                    }
                    className={`tactical-slider ${conf.slider}`}
                  />
                </div>
              );
            })}
        </div>

        {/* Confirm button */}
        <div className="shrink-0 mt-auto pb-4">
          <button
            onClick={handleConfirm}
            className="w-full relative py-4 rounded-xl overflow-hidden transition-all active:scale-[0.98] text-black font-bebas text-2xl tracking-widest flex items-center justify-center gap-2 hover:brightness-110"
            style={{
              background: "#a3e635",
              boxShadow: "0 0 25px rgba(163,230,53,.55), 0 0 50px rgba(163,230,53,.2)",
            }}
          >
            <div className="absolute inset-0 bg-stripes opacity-10" />
            <span className="relative z-10 flex items-center gap-2">
              <Zap className="w-5 h-5" fill="currentColor" /> AUTHORIZE DIRECTIVE
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
