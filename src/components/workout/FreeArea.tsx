'use client';

import type { FreeExercise } from '@/types';
import AddExerciseCard from './AddExerciseCard';
import FreeExCard from './FreeExCard';

interface FreeAreaProps {
  freeExercises: Record<string, FreeExercise>;
  prData: Record<string, number>;
  selectedFavNames: Set<string>;
  onToggleFav: (icon: string, name: string) => void;
  onAddCustom: (name: string) => void;
  onAddSet: (exId: string) => void;
  onCopyLastSet: (exId: string) => void;
  onDeleteSet: (exId: string, setId: string) => void;
  onSetChange: (exId: string, setId: string, weight: number, reps: number) => void;
  onRemove: (exId: string) => void;
  onCheckPR: (name: string, diff: number) => void;
}

export default function FreeArea({
  freeExercises,
  prData,
  selectedFavNames,
  onToggleFav,
  onAddCustom,
  onAddSet,
  onCopyLastSet,
  onDeleteSet,
  onSetChange,
  onRemove,
  onCheckPR,
}: FreeAreaProps) {
  const ids = Object.keys(freeExercises);

  return (
    <div className="flex flex-col gap-4">
      <AddExerciseCard
        selectedNames={selectedFavNames}
        onToggleFav={onToggleFav}
        onAddCustom={onAddCustom}
      />
      <div className="flex flex-col gap-3">
        {ids.length > 0 && (
          <h3 className="text-xs font-semibold px-0.5" style={{ color: 'var(--text)' }}>
            내 운동 ({ids.length}종목)
          </h3>
        )}
        {ids.map((id, idx) => (
          <FreeExCard
            key={id}
            id={id}
            index={idx}
            exercise={freeExercises[id]}
            prWeight={prData[freeExercises[id].name]}
            onAddSet={onAddSet}
            onCopyLastSet={onCopyLastSet}
            onDeleteSet={onDeleteSet}
            onSetChange={onSetChange}
            onRemove={onRemove}
            onCheckPR={onCheckPR}
          />
        ))}
      </div>
    </div>
  );
}
