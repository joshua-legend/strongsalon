"use client";

import { AppProvider } from "@/context/AppContext";
import { AuthProvider } from "@/context/AuthContext";
import { ChartDataProvider } from "@/context/ChartDataContext";
import { UserProvider } from "@/context/UserContext";
import { ProfileProvider } from "@/context/ProfileContext";
import { GoalProvider } from "@/context/GoalContext";
import { AttendanceProvider } from "@/context/AttendanceContext";
import { InbodyProvider } from "@/context/InbodyContext";
import { WorkoutRecordProvider } from "@/context/WorkoutRecordContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ChartDataProvider>
        <AppProvider>
          <UserProvider>
            <ProfileProvider>
              <GoalProvider>
                <AttendanceProvider>
                  <WorkoutRecordProvider>
                    <InbodyProvider>{children}</InbodyProvider>
                  </WorkoutRecordProvider>
                </AttendanceProvider>
              </GoalProvider>
            </ProfileProvider>
          </UserProvider>
        </AppProvider>
      </ChartDataProvider>
    </AuthProvider>
  );
}
