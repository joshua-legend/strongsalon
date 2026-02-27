"use client";

import { useState, useMemo } from "react";
import { exercisesInfo } from "@/data/exercises-info";
import type { ExerciseInfoItem } from "@/types";
import ExerciseSearch from "./ExerciseSearch";
import CategoryChips from "./CategoryChips";
import ExerciseList from "./ExerciseList";
import ExerciseDetail from "./ExerciseDetail";

export default function ExerciseInfoTab() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("전체");
  const [selected, setSelected] = useState<ExerciseInfoItem | null>(null);

  const filtered = useMemo(() => {
    return exercisesInfo.filter((ex) => {
      const matchSearch = !search || ex.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "전체" || ex.category === category;
      return matchSearch && matchCat;
    });
  }, [search, category]);

  return (
    <div className="px-4 py-4 flex flex-col gap-4">
      <p className="card-label">📋 운동사전</p>
      <ExerciseSearch value={search} onChange={setSearch} />
      <CategoryChips value={category} onChange={setCategory} />
      <ExerciseList items={filtered} onSelect={setSelected} />
      <ExerciseDetail item={selected} onClose={() => setSelected(null)} />
      <div className="h-4" />
    </div>
  );
}
