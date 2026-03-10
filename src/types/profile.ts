export type Gender = "male" | "female";

export type Experience = "beginner" | "intermediate" | "advanced";

export interface UserProfile {
  nickname: string;
  gender: Gender;
  birthDate: string;
  height: number;
  weight: number;
  experience: Experience;
  createdAt: string;
}
