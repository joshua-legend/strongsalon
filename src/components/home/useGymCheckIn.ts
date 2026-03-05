import { useState, useCallback } from "react";
import { isWithinGymRadius, haversineDistance } from "@/utils/geolocation";

export type CheckInStatus =
  | "idle"
  | "permission-prompt"
  | "loading"
  | "success"
  | "out-of-range"
  | "error";

export function useGymCheckIn(
  today: string,
  checkedInToday: boolean,
  addAttendance: (date: string, type: "self") => void
) {
  const [checkInStatus, setCheckInStatus] = useState<CheckInStatus>("idle");

  const handleCheckIn = useCallback(() => {
    if (checkedInToday) return;
    setCheckInStatus("loading");

    if (!navigator.geolocation) {
      setCheckInStatus("error");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const gymLat = parseFloat(process.env.NEXT_PUBLIC_GYM_LAT ?? "0");
        const gymLon = parseFloat(process.env.NEXT_PUBLIC_GYM_LNG ?? "0");
        const radiusM = parseFloat(process.env.NEXT_PUBLIC_GYM_RADIUS_M ?? "200");
        const distanceM = haversineDistance(latitude, longitude, gymLat, gymLon);
        const within = isWithinGymRadius(latitude, longitude);

        console.log("[출석체크 디버그]", {
          "현재 위도": latitude, "현재 경도": longitude,
          "헬스장 위도": gymLat, "헬스장 경도": gymLon,
          "헬스장 반경(m)": radiusM,
          "헬스장과의 거리(m)": Math.round(distanceM * 100) / 100,
          "출석 가능 여부": within ? "✓ 가능" : "✗ 불가",
        });

        if (within) {
          addAttendance(today, "self");
          setCheckInStatus("success");
        } else {
          setCheckInStatus("out-of-range");
        }
      },
      (err) => {
        if (err.code === 1) setCheckInStatus("permission-prompt");
        else setCheckInStatus("error");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [addAttendance, today, checkedInToday]);

  const resetStatus = useCallback(() => setCheckInStatus("idle"), []);

  return { checkInStatus, handleCheckIn, resetStatus };
}
