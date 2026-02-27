# FitLog v3.0 (StrongSalon)

모바일 퍼스트 피트니스 기록·통계·랭킹 웹앱. **프론트엔드(Next.js)** 와 **백엔드(NestJS, 예정)** 로 구성됩니다.

---

## 한 줄 소개

회원·트레이너용 운동 프로그램, 출석, 체성분·근력·체력 기록과 통계·랭킹을 한 곳에서 관리하는 FitLog v3.0입니다.

---

## 📋 기획 수정안 (최종본)

**탭 구조 변경 예정:** 수행능력 + 랭킹 → **"내 실력"** 통합, **"운동사전"** 탭 신규 추가.

| 1 | 2 | 3 (센터) | 4 | 5 |
|---|---|----------|---|---|
| 🏠 홈 | 📊 통계 | 💪 운동 | 🏃 내 실력 | 📋 운동사전 |

- **[기획 수정안 상세](PLANNING.md)** — 목표 추적기, 당근 크레딧, PT 세션, 운동사전, 구현 우선순위

---

## 전체 아키텍처

### 1. 앱 진입점 및 레이아웃

```
app/
├── layout.tsx          # 루트 레이아웃 (AppProvider, 메타, 폰트)
├── page.tsx             # 단일 페이지 (TabContent + AppShell)
├── login/page.tsx       # 로그인 (Google/Kakao 예정)
└── globals.css          # 글로벌 스타일, CSS 변수
```

- **단일 페이지 구조**: `page.tsx`가 `TabContent`를 렌더링하며, `activeTab`에 따라 탭별 컴포넌트를 `display`로 전환.
- **운동 모드**: `theme === 'workout'`이면 `WorkoutPage` 전체 화면으로 전환 (탭 UI 숨김).

### 2. 탭 시스템

**현재:**
| TabId | 컴포넌트 | 설명 |
|-------|----------|------|
| `home` | HomeTab | 홈 대시보드 |
| `performance` | PerformanceTab | 수행능력 (체성분·체력·근력) |
| `stats` | StatsTab | 통계 (출석 캘린더, StatGrid, 차트) |
| `ranking` | RankingTab | 랭킹 |
| `workout` | WorkoutPage | 운동 기록 (전체 화면) |

**현재 (구현 완료):**
| TabId | 컴포넌트 | 설명 |
|-------|----------|------|
| `home` | HomeTab | 홈 (목표 추적기, 당근, PT 세션 등) |
| `stats` | StatsTab | 통계 |
| `workout` | WorkoutPage | 운동 기록 |
| `performance` | PerformanceTab | 내 실력 (수행능력 + 랭킹 통합) |
| `exercise-info` | ExerciseInfoTab | 운동사전 |

- `BottomNav`에서 탭 전환 시 `setTab(tab)` 호출.
- 운동 시작 버튼 → `enterWorkout()` → `theme: 'workout'` → `WorkoutPage` 표시.

### 3. 프로젝트 구조

```
strongsalon/
├── src/
│   ├── app/                    # App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── login/page.tsx
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── shell/              # 공통 레이아웃
│   │   │   ├── AppShell.tsx    # Topbar + scroll-body + BottomNav
│   │   │   ├── Topbar.tsx
│   │   │   └── BottomNav.tsx
│   │   │
│   │   ├── home/               # 홈 탭
│   │   │   ├── HomeTab.tsx
│   │   │   ├── GoalTracker.tsx      # 목표 추적기 (프로그레스바)
│   │   ├── GoalEditSheet.tsx
│   │   ├── CarrotBadge.tsx
│   │   ├── CarrotShop.tsx
│   │   ├── CarrotHistory.tsx
│   │   ├── WhipBanner.tsx
│   │   ├── SessionManager.tsx
│   │   ├── HeroBanner.tsx
│   │   │   ├── TodayCTA.tsx
│   │   │   ├── BodyMap.tsx
│   │   │   ├── WeekDots.tsx
│   │   │   ├── TrainerMsg.tsx
│   │   │   ├── ChallengeCards.tsx
│   │   │   ├── MiniFeed.tsx
│   │   │   └── LevelMini.tsx
│   │   │
│   │   ├── stats/              # 통계 탭
│   │   │   ├── StatsTab.tsx    # year/month 상태, AttendCalendar·StatGrid 공유
│   │   │   ├── AttendCalendar.tsx  # 출석 캘린더, 날짜 클릭 시 DayWorkoutDetail
│   │   │   ├── StatGrid.tsx    # 월별 통계 카드 (PT출석일, 개인출석률, 볼륨 등)
│   │   │   ├── VolumeChart.tsx
│   │   │   ├── ConditionDonut.tsx
│   │   │   └── PeriodChips.tsx
│   │   │
│   │   ├── performance/        # 내 실력 (수행능력 + 랭킹)
│   │   │   ├── PerformanceTab.tsx
│   │   │   ├── SubTabs.tsx
│   │   │   ├── RankHero.tsx
│   │   │   ├── RankCards.tsx
│   │   │   ├── RadarChart.tsx
│   │   │   ├── GradeLegend.tsx
│   │   │   ├── InbodySummary.tsx
│   │   │   ├── CardioRecords.tsx
│   │   │   └── StrengthGrade.tsx
│   │   │
│   │   ├── exercise-info/      # 운동사전 탭
│   │   │   ├── ExerciseInfoTab.tsx
│   │   │   ├── ExerciseSearch.tsx
│   │   │   ├── CategoryChips.tsx
│   │   │   ├── ExerciseList.tsx
│   │   │   └── ExerciseDetail.tsx
│   │   │
│   │   ├── workout/            # 운동 기록 (전체 화면)
│   │   │   ├── WorkoutPage.tsx
│   │   │   ├── useWorkoutLog.ts   # 운동 로그 상태 (trainer/free 모드)
│   │   │   ├── WorkoutTopbar.tsx
│   │   │   ├── DateBox.tsx
│   │   │   ├── CondBox.tsx
│   │   │   ├── ModeBanner.tsx     # 트레이너/자유 모드 선택
│   │   │   ├── TrainerArea.tsx
│   │   │   ├── TrainerExCard.tsx
│   │   │   ├── ProgBarCard.tsx
│   │   │   ├── FreeArea.tsx
│   │   │   ├── FreeExCard.tsx
│   │   │   ├── CardioArea.tsx
│   │   │   ├── PrevRecordCard.tsx
│   │   │   ├── VolCard.tsx
│   │   │   ├── SetRow.tsx
│   │   │   └── AddExerciseCard.tsx
│   │   │
│   │   └── ui/                 # 공통 UI
│   │       ├── Toast.tsx
│   │       ├── Badge.tsx
│   │       ├── ProgressBar.tsx
│   │       └── SVGIllust.tsx
│   │
│   ├── context/
│   │   └── AppContext.tsx      # activeTab, subTab, theme, colorMode, setTab, enterWorkout 등
│   │
│   ├── data/                   # 목업 데이터
│   │   ├── member.ts           # 회원 프로필, 트레이너, 오늘의 프로그램
│   │   ├── attendance.ts       # 출석 기록 (date, type: pt|self|both)
│   │   ├── workout.ts          # 트레이너 프로그램 템플릿, FAV_CHIPS
│   │   ├── workoutHistory.ts   # 날짜별 운동 상세 (종목, 세트, 유산소)
│   │   ├── goals.ts            # 목표 목업
│   │   ├── credits.ts          # 당근 잔액·이력
│   │   ├── shop.ts             # 상점 아이템
│   │   └── exercises-info.ts   # 운동 종목 상세
│   │
│   ├── types/
│   │   └── index.ts            # TabId, WorkoutMode, AttendanceRecord, MemberProfile 등
│   │
│   └── utils/
│       ├── calendar.ts         # getMonthGrid, getWeekDays, isToday
│       ├── monthlyStats.ts     # getMonthlyStats (PT출석일, 개인출석률, 볼륨, 연속출석 등)
│       ├── format.ts
│       └── scoring.ts
│
├── docs/
│   ├── README.md               # 이 파일 (전체 아키텍처)
│   └── BACKEND_README.md       # 백엔드(NestJS) 엔티티·API 설계
│
└── package.json
```

### 4. 상태 관리 (AppContext)

| 상태 | 타입 | 설명 |
|------|------|------|
| `activeTab` | TabId | 현재 탭 (home \| stats \| workout \| performance \| exercise-info) |
| `subTab` | SubTabId | 수행능력 하위 탭 (body \| strength \| cardio) |
| `theme` | 'default' \| 'workout' | 기본 UI vs 운동 화면 |
| `colorMode` | 'light' \| 'dark' | 라이트/다크 모드 (localStorage) |
| `scrollBodyRef` | RefObject | 스크롤 영역 (탭 전환 시 scrollTop=0) |

**액션**: `setTab`, `setSubTab`, `enterWorkout`, `exitWorkout`, `setColorMode`

### 5. 데이터 흐름

| 데이터 | 소스 | 사용처 |
|--------|------|--------|
| 출석 | `attendance` | AttendCalendar, monthlyStats |
| 운동 기록 | `workoutHistory` | AttendCalendar DayWorkoutDetail, monthlyStats |
| 회원/트레이너 | `member` | HomeTab, RankingTab 등 |
| 트레이너 프로그램 | `workout.createInitialTrainerProg()` | useWorkoutLog (trainer 모드) |

### 6. 주요 플로우

**통계 탭 (StatsTab)**  
- `year`, `month` 상태를 AttendCalendar·StatGrid가 공유.  
- `getMonthlyStats(year, month)` → PT 출석일, 개인운동 출석률, 총 볼륨, 운동 횟수, 평균 운동시간, 연속 출석 계산.  
- AttendCalendar에서 날짜 클릭 → `DayWorkoutDetail`에 해당 날짜 운동 기록 표시.

**운동 기록 (WorkoutPage)**  
- `useWorkoutLog`: `mode`(null|trainer|free), `trainerProg`, `freeExercises`, `cardioEntries` 관리.  
- 트레이너 모드: `createInitialTrainerProg()` 기반 세트 기록.  
- 자유 모드: 근력 + 유산소 필수, `FAV_CHIPS`에서 종목 추가.

---

## 기술 스택

| 구분 | 스택 |
|------|------|
| **프론트** | Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion |
| **백엔드(예정)** | NestJS, TypeORM/Prisma, PostgreSQL, Passport (Google/Kakao), JWT |

---

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속.

---

## 주요 기능 (프론트 기준)

- **홈**: Hero 배너, 오늘의 프로그램·트레이너 메시지, 바디맵, 주간 출석, 미니 피드
- **통계**: 출석 캘린더(날짜 클릭 시 운동 기록), 월별 StatGrid(PT출석일, 개인출석률, 볼륨, 운동횟수, 평균운동시간, 연속출석), 볼륨·컨디션 차트
- **운동**: 트레이너/자유 모드, 세트 기록, 유산소, 완료
- **수행능력**: 체성분·체력·근력 상세 및 추이
- **랭킹**: 종합 점수·등급, 레이더 차트
- **로그인**: Google / Kakao 버튼 (실제 OAuth 연동은 백엔드 연동 시)

---

## 참고 문서

- **[기획 수정안 (최종본)](PLANNING.md)** — 탭 변경, 목표 추적기, 당근 크레딧, 운동사전, **현재 아키텍처**, 구현 우선순위
- [백엔드 설계 (엔티티·API)](BACKEND_README.md) — NestJS 구현 시 참고
