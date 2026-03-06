"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { useWorkoutLog } from "./useWorkoutLog";
import WorkoutTopbar from "./WorkoutTopbar";
import DateBox from "./DateBox";
import CondBox from "./CondBox";
import FreeArea from "./FreeArea";
import CardioArea from "./CardioArea";

type BigThreeTab = "strength" | "cardio";

export default function WorkoutPage() {
  const log = useWorkoutLog();
  const { exitWorkout } = useApp();
  const [bigThreeTab, setBigThreeTab] = useState<BigThreeTab>("strength");

  const handleComplete = () => {
    log.completeWorkout();
    exitWorkout();
  };

  return (
    <div
      className="min-h-full flex flex-col"
      style={{
        background: '#000',
      }}
    >
      <WorkoutTopbar elapsedSec={log.elapsedSec} />

      <div className="flex-1 overflow-auto px-4 py-4">
        <div className="grid grid-cols-1 gap-4 max-w-4xl mx-auto">
          <div className="flex flex-col gap-3.5">
            <DateBox value={log.workoutDate} onChange={log.setWorkoutDate} />
            <CondBox value={log.condition} onChange={log.setCondition} />

            {/* 근력 3대 | 유산소 3대 토글 */}
            <div className="flex flex-col gap-1.5">
              <div
                className="rounded-full p-1 flex border"
                style={{
                  background: '#0a0a0a',
                  borderColor: 'rgba(163,230,53,.3)',
                }}
              >
                <button
                  type="button"
                  onClick={() => setBigThreeTab("strength")}
                  className={`flex-1 py-2 px-4 rounded-full text-xs font-bold transition-all ${
                    bigThreeTab === "strength"
                      ? "bg-lime-500/20 text-lime-400"
                      : "text-neutral-500"
                  }`}
                >
                  근력 3대
                </button>
                <button
                  type="button"
                  onClick={() => setBigThreeTab("cardio")}
                  className={`flex-1 py-2 px-4 rounded-full text-xs font-bold transition-all ${
                    bigThreeTab === "cardio"
                      ? "bg-cyan-500/20 text-cyan-400"
                      : "text-neutral-500"
                  }`}
                >
                  유산소 3대
                </button>
              </div>
              <p className="text-[10px] text-neutral-500 px-1">
                홈 탭 골 트래커 그래프에 반영됩니다
              </p>
            </div>

            {bigThreeTab === "strength" ? (
              <>
                <div
                  className="flex flex-col gap-2 rounded-xl border border-lime-500/30 p-3"
                  style={{ background: 'rgba(163,230,53,.04)' }}
                >
                  <h3
                    className="font-bebas text-[14px] tracking-wider uppercase px-0.5"
                    style={{
                      color: 'rgb(163, 230, 53)',
                      textShadow: '0 0 10px rgba(163,230,53,.7), 0 0 22px rgba(163,230,53,.3)',
                    }}
                  >
                    근력 3대
                  </h3>
                  <FreeArea
                    freeExercises={log.freeExercises}
                    prData={log.prData}
                    selectedFavNames={log.selectedFavNames}
                    onToggleFav={log.toggleFav}
                    onAddCardio={log.addCardio}
                    onAddSet={(id) => log.addFreeSet(id)}
                    onCopyLastSet={log.copyLastFreeSet}
                    onDeleteSet={log.delFreeSet}
                    onSetChange={log.onFSetChange}
                    onRemove={log.removeFreeEx}
                    onCheckPR={log.showPR}
                  />
                </div>
                <div className="flex flex-col gap-2 opacity-70">
                  <h3
                    className="font-bebas text-[14px] tracking-wider uppercase px-0.5"
                    style={{ color: 'rgba(0,229,255,.8)' }}
                  >
                    유산소 3대
                  </h3>
                  <CardioArea
                    entries={log.cardioEntries}
                    onUpdate={log.updateCardio}
                    onRemove={log.removeCardio}
                  />
                </div>
              </>
            ) : (
              <>
                <div
                  className="flex flex-col gap-2 rounded-xl border border-cyan-500/30 p-3"
                  style={{ background: 'rgba(0,229,255,.04)' }}
                >
                  <h3
                    className="font-bebas text-[14px] tracking-wider uppercase px-0.5"
                    style={{
                      color: 'rgb(0, 229, 255)',
                      textShadow: '0 0 10px rgba(0,229,255,.5)',
                    }}
                  >
                    유산소 3대
                  </h3>
                  <CardioArea
                    entries={log.cardioEntries}
                    onUpdate={log.updateCardio}
                    onRemove={log.removeCardio}
                  />
                </div>
                <div className="flex flex-col gap-2 opacity-70">
                  <h3
                    className="font-bebas text-[14px] tracking-wider uppercase px-0.5"
                    style={{ color: 'rgba(163,230,53,.8)' }}
                  >
                    근력 3대
                  </h3>
                  <FreeArea
                    freeExercises={log.freeExercises}
                    prData={log.prData}
                    selectedFavNames={log.selectedFavNames}
                    onToggleFav={log.toggleFav}
                    onAddCardio={log.addCardio}
                    onAddSet={(id) => log.addFreeSet(id)}
                    onCopyLastSet={log.copyLastFreeSet}
                    onDeleteSet={log.delFreeSet}
                    onSetChange={log.onFSetChange}
                    onRemove={log.removeFreeEx}
                    onCheckPR={log.showPR}
                  />
                </div>
              </>
            )}

            {/* 오운완 버튼 */}
            <button
              type="button"
              onClick={handleComplete}
              className="group relative w-full px-6 py-4 rounded-2xl font-black text-base uppercase italic -skew-x-12 text-white transition-all duration-300 ease-out hover:scale-[1.02] hover:brightness-110 hover:shadow-[0_0_28px_rgba(163,230,53,.6)] active:scale-[0.97] mt-2 flex items-center justify-center"
              style={{
                background: '#a3e635',
                boxShadow: '0 0 20px rgba(163,230,53,.55), 0 0 40px rgba(163,230,53,.2)',
                textShadow: '0 1px 2px rgba(0,0,0,.2)',
              }}
            >
              <div className="absolute inset-0 bg-stripes opacity-20 pointer-events-none transition-opacity duration-300 group-hover:opacity-30" />
              <span className="skew-x-12 flex items-center gap-2">
                <span>✅</span>
                <span>오운완</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
