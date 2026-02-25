export function getMonthGrid(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevDays = new Date(year, month, 0).getDate();

  const grid: (number | null)[] = [];
  for (let i = firstDay - 1; i >= 0; i--) {
    grid.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    grid.push(d);
  }
  while (grid.length < 42) {
    grid.push(null);
  }
  return grid;
}

export function getWeekDays(): string[] {
  return ['일', '월', '화', '수', '목', '금', '토'];
}

export function isToday(year: number, month: number, day: number): boolean {
  const now = new Date();
  return now.getFullYear() === year && now.getMonth() === month && now.getDate() === day;
}
