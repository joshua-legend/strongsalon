"use client";

import HeroBanner from "./HeroBanner";
import ChallengeCards from "./ChallengeCards";
import WeekDots from "./WeekDots";
import LevelMini from "./LevelMini";
import BodyMap from "./BodyMap";

export default function HomeTab() {
  return (
    <div className="px-4 py-4 flex flex-col gap-4">
      <div className="fade-up">
        <HeroBanner />
      </div>
      <div className="fade-up fade-in-1">
        <ChallengeCards />
      </div>
      <div className="fade-up fade-in-2">
        <WeekDots />
      </div>
      {/* <div className="fade-up fade-in-3">
        <LevelMini />
      </div> */}
      <div className="fade-up fade-in-4">
        <BodyMap />
      </div>
      <div className="h-4" />
    </div>
  );
}
