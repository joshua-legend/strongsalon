/**
 * Haversine formula: 두 위경도 좌표 간 거리(m) 계산
 */
export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // 지구 반경 (m)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * 사용자 위치가 헬스장 반경(200m) 이내인지 확인
 */
export function isWithinGymRadius(userLat: number, userLon: number): boolean {
  const gymLat = parseFloat(process.env.NEXT_PUBLIC_GYM_LAT ?? "0");
  const gymLon = parseFloat(process.env.NEXT_PUBLIC_GYM_LNG ?? "0");
  const radiusM = parseFloat(process.env.NEXT_PUBLIC_GYM_RADIUS_M ?? "200");

  if (!Number.isFinite(gymLat) || !Number.isFinite(gymLon)) {
    return false;
  }
  const dist = haversineDistance(userLat, userLon, gymLat, gymLon);
  return dist <= radiusM;
}
