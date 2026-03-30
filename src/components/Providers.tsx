"use client";

import { AppProvider } from "@/context/AppContext";
import { AuthProvider } from "@/context/AuthContext";
import { ChartDataProvider } from "@/context/ChartDataContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { UserProvider } from "@/context/UserContext";
import { ProfileProvider } from "@/context/ProfileContext";
import { GoalProvider } from "@/context/GoalContext";
import { AttendanceProvider } from "@/context/AttendanceContext";
import { InbodyProvider } from "@/context/InbodyContext";
import { WorkoutRecordProvider } from "@/context/WorkoutRecordContext";
import { LevelThemeProvider } from "@/context/LevelThemeContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ChartDataProvider>
          <AppProvider>
            <UserProvider>
              <ProfileProvider>
                <LevelThemeProvider>
                  <GoalProvider>
                    <AttendanceProvider>
                      <WorkoutRecordProvider>
                        <InbodyProvider>{children}</InbodyProvider>
                      </WorkoutRecordProvider>
                    </AttendanceProvider>
                  </GoalProvider>
                </LevelThemeProvider>
              </ProfileProvider>
            </UserProvider>
          </AppProvider>
        </ChartDataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
