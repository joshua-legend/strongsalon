export type Gender = "male" | "female";

export type Experience = "untrained" | "novice" | "intermediate" | "advanced" | "elite";

export interface UserProfile {
  nickname: string;
  gender: Gender;
  birthDate: string;
  height: number;
  weight: number;
  experience: Experience;
  createdAt: string;
}
