"use client";

import GoalTracker from "./GoalTracker";
import WhipBanner from "./WhipBanner";
import HeroBanner from "./HeroBanner";
import SessionManager from "./SessionManager";
import WeekDots from "./WeekDots";

export default function HomeTab() {
  return (
    <div className="px-4 py-4 flex flex-col gap-4">
      <div className="fade-up">
        <GoalTracker />
      </div>
      <div className="fade-up fade-in-1">
        <WhipBanner />
      </div>
      <div className="fade-up fade-in-2">
        <HeroBanner />
      </div>
      <div className="fade-up fade-in-3">
        <SessionManager />
      </div>
      <div className="fade-up fade-in-4">
        <WeekDots />
      </div>
      <div className="h-4" />
    </div>
  );
}
