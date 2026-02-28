"use client";

import { useApp } from "@/context/AppContext";
import { useWorkoutLog } from "./useWorkoutLog";
import WorkoutTopbar from "./WorkoutTopbar";
import DateBox from "./DateBox";
import CondBox from "./CondBox";
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

            <div className="flex flex-col gap-2">
              <h3
                className="font-bebas text-[14px] tracking-wider uppercase px-0.5"
                style={{
                  color: 'rgb(163, 230, 53)',
                  textShadow: '0 0 10px rgba(163,230,53,.7), 0 0 22px rgba(163,230,53,.3)',
                }}
              >
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
