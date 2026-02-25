'use client';

import HeroBanner from './HeroBanner';
import TodayCTA from './TodayCTA';
import ChallengeCards from './ChallengeCards';
import WeekDots from './WeekDots';
import LevelMini from './LevelMini';
import TrainerMsg from './TrainerMsg';
import MiniFeed from './MiniFeed';
import BodyMap from './BodyMap';

export default function HomeTab() {
  return (
    <div className="px-4 py-4 flex flex-col gap-4">
      <div className="fade-up"><HeroBanner /></div>
      <div className="fade-up fade-in-1"><TodayCTA /></div>
      <div className="fade-up fade-in-2"><ChallengeCards /></div>
      <div className="fade-up fade-in-3"><WeekDots /></div>
      <div className="fade-up fade-in-4"><LevelMini /></div>
      <div className="fade-up fade-in-5"><TrainerMsg /></div>
      <div className="fade-up fade-in-6"><MiniFeed /></div>
      <div className="fade-up fade-in-7"><BodyMap /></div>
      <div className="h-4" />
    </div>
  );
}
