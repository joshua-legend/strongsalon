'use client';

import type { TrainerProg } from '@/types';
import ProgBarCard from './ProgBarCard';
import TrainerExCard from './TrainerExCard';

interface TrainerAreaProps {
  trainerProg: TrainerProg;
  onAddSet: (exId: string) => void;
  onCopyLastSet: (exId: string) => void;
  onDeleteSet: (exId: string, setId: string) => void;
  onSetChange: (exId: string, setId: string, weight: number, reps: number) => void;
  onCheckPR: (name: string, diff: number) => void;
}

export default function TrainerArea({
  trainerProg,
  onAddSet,
  onCopyLastSet,
  onDeleteSet,
  onSetChange,
  onCheckPR,
}: TrainerAreaProps) {
  const total = trainerProg.exercises.length;
  const done = trainerProg.exercises.filter(
    (ex) => ex.sets.filter((s) => s.weight > 0 && s.reps > 0).length >= ex.tSets
  ).length;

  return (
    <div>
      <ProgBarCard doneCount={done} totalCount={total} />
      <div className="flex flex-col gap-3 mt-3">
        {trainerProg.exercises.map((ex, idx) => (
          <TrainerExCard
            key={ex.id}
            index={idx}
            exercise={ex}
            onAddSet={onAddSet}
            onCopyLastSet={onCopyLastSet}
            onDeleteSet={onDeleteSet}
            onSetChange={onSetChange}
            onCheckPR={onCheckPR}
          />
        ))}
      </div>
    </div>
  );
}
