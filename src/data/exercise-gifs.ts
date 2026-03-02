const baseUrl = "https://fitnessprogramer.com/wp-content/uploads/2021/02/";

const exerciseGifMap: Record<string, string> = {
  ex1: "Barbell-Bench-Press.gif",
  ex2: "Barbell-Squat.gif",
  ex3: "Barbell-Deadlift.gif",
  ex4: "Barbell-Shoulder-Press.gif",
  ex5: "Barbell-Bent-Over-Row.gif",
  ex6: "Pull-up.gif",
  ex7: "Incline-Dumbbell-Press.gif",
  ex8: "Chest-Dips.gif",
  ex8b: "Chest-Press-Machine.gif",
  ex9: "Leg-Press.gif",
  ex10: "Lying-Leg-Curl.gif",
  ex11: "Leg-Extension.gif",
  ex12: "Lat-Pulldown.gif",
  ex13: "Seated-Cable-Row.gif",
  ex14: "Dumbbell-Lateral-Raise.gif",
  ex15: "Barbell-Biceps-Curl.gif",
  ex16: "Triceps-Pushdown.gif",
  ex17: "Plank.gif",
  ex18: "Treadmill-Running.gif",
  ex19: "Rowing-Machine.gif",
  ex20: "SkiErg.gif",
};

export const getExerciseGif = (id: string) =>
  exerciseGifMap[id] ? `${baseUrl}${exerciseGifMap[id]}` : null;
