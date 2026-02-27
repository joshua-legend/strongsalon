"use client";

import { useApp } from "@/context/AppContext";
import { useWorkoutLog } from "./useWorkoutLog";
import WorkoutTopbar from "./WorkoutTopbar";
import DateBox from "./DateBox";
import CondBox from "./CondBox";
import ModeBanner from "./ModeBanner";
import TrainerArea from "./TrainerArea";
import FreeArea from "./FreeArea";
import CardioArea from "./CardioArea";

export default function WorkoutPage() {
  const log = useWorkoutLog();
  const { exitWorkout } = useApp();

  const handleComplete = () => {
    log.completeWorkout();
    exitWorkout();
  };

  return (
    <div className="min-h-full flex flex-col bg-neutral-950">
      <WorkoutTopbar elapsedSec={log.elapsedSec} />
      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-1 gap-4 max-w-4xl mx-auto">
          <div className="flex flex-col gap-3.5">
            <DateBox value={log.workoutDate} onChange={log.setWorkoutDate} />
            <CondBox value={log.condition} onChange={log.setCondition} />
            <ModeBanner
              mode={log.mode}
              onSelectMode={log.selectMode}
              onShowModeChoice={log.showModeChoice}
            />

            {log.mode === null && (
              <p className="text-center text-xs py-6 text-neutral-400">
                위에서 운동 모드를 선택하세요
              </p>
            )}

            {log.mode === "trainer" && (
              <>
                <TrainerArea
                  trainerProg={log.trainerProg}
                  onAddSet={log.addTSet}
                  onCopyLastSet={log.copyLastTSet}
                  onDeleteSet={log.delTSet}
                  onSetChange={log.onTSetChange}
                  onCheckPR={log.showPR}
                />
                <CardioArea
                  entries={log.cardioEntries}
                  onAdd={log.addCardio}
                  onUpdate={log.updateCardio}
                  onRemove={log.removeCardio}
                />
              </>
            )}

            {log.mode === "free" && (
              <>
                <div className="flex flex-col gap-2">
                  <h3 className="text-xs font-semibold px-0.5 text-white">
                    근력
                  </h3>
                  <FreeArea
                    freeExercises={log.freeExercises}
                    prData={log.prData}
                    selectedFavNames={log.selectedFavNames}
                    onToggleFav={log.toggleFav}
                    onAddCustom={log.addCustomEx}
                    onAddSet={(id) => log.addFreeSet(id)}
                    onCopyLastSet={log.copyLastFreeSet}
                    onDeleteSet={log.delFreeSet}
                    onSetChange={log.onFSetChange}
                    onRemove={log.removeFreeEx}
                    onCheckPR={log.showPR}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <CardioArea
                    entries={log.cardioEntries}
                    onAdd={log.addCardio}
                    onUpdate={log.updateCardio}
                    onRemove={log.removeCardio}
                  />
                </div>
              </>
            )}

            {log.mode !== null && (
              <button
                type="button"
                onClick={handleComplete}
                className="w-full py-5 rounded-2xl border-0 text-white text-lg font-black tracking-wide transition-all active:scale-[0.98] mt-2 flex items-center justify-center gap-2 bg-gradient-to-br from-orange-500 to-orange-500/80 shadow-[0_4px_20px_rgba(249,115,22,.35)]"
              >
                <span>✅</span>
                <span>오운완</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
