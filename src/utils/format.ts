export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function formatVolume(v: number): string {
  if (v >= 1000) return `${(v / 1000).toFixed(1)}k`;
  return String(v);
}

export function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return '좋은 아침이에요';
  if (h < 18) return '좋은 오후에요';
  return '좋은 저녁이에요';
}

/** 요일(0=일~6=토)과 시간대에 따라 히어로 문구 반환 */
export function getDailyHeroMessage(): string {
  const now = new Date();
  const day = now.getDay();
  const h = now.getHours();

  const isMorning = h < 12;
  const isAfternoon = h < 18;
  const isEvening = h >= 18;

  const dayLabels = ['일', '월', '화', '수', '목', '금', '토'];
  const dayName = dayLabels[day];
  const isWeekend = day === 0 || day === 6;

  if (isWeekend) {
    if (isMorning) return `주말 아침, ${dayName}요일도 강해지기 💪`;
    if (isAfternoon) return `주말 오후, ${dayName}요일 파이팅! 💪`;
    return `주말 저녁, ${dayName}요일까지 잘 버텼어요 💪`;
  }

  if (day === 1) {
    if (isMorning) return '월요일 아침, 한 주 시작! 💪';
    if (isAfternoon) return '월요일 오후, 오늘도 화이팅 💪';
    return '월요일 저녁, 좋은 하루 보냈어요 💪';
  }
  if (day === 5) {
    if (isMorning) return '금요일 아침, 주말 전 한 번 더! 💪';
    if (isAfternoon) return '금요일 오후, 거의 다 왔어요 💪';
    return '금요일 저녁, 이번 주 수고했어요 💪';
  }

  if (isMorning) return `${dayName}요일도 강해지는 날 💪`;
  if (isAfternoon) return `오늘 오후, ${dayName}요일 파이팅 💪`;
  return `오늘 저녁, ${dayName}요일 마무리 잘해요 💪`;
}

export function formatTimeMmSs(totalSec: number): string {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}
