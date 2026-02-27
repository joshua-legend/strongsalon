# FitLog v3.0 — 기획 수정안 (최종본)

---

## 현재 구현 상태 (2025.02 기준)

| 구분 | 상태 | 비고 |
|------|------|------|
| 탭 구조 | ✅ 완료 | home | stats | workout | performance | exercise-info |
| 내 실력 탭 | ✅ 완료 | ranking → performance 통합 |
| 목표 추적기 | ✅ 완료 | 프로그레스바 UI, GoalEditSheet 연동 |
| 당근 시스템 | ✅ 완료 | CarrotBadge, CarrotShop, CarrotHistory |
| PT 세션 관리 | ✅ 완료 | SessionManager |
| 운동사전 | ✅ 완료 | 검색, 카테고리, 상세 바텀시트 |
| 홈 섹션 순서 | ✅ 완료 | GoalTracker → WhipBanner → HeroBanner → … |

**홈 탭 현재 순서:** GoalTracker → WhipBanner → HeroBanner → SessionManager → WeekDots → ChallengeCards → BodyMap  
*(CarrotBadge, TodayCTA, LevelMini, TrainerMsg, MiniFeed는 선택적 노출)*

---

## 변경 요약

### 탭 구조 변경

**기존 (5탭):**
| 1 | 2 | 3 (센터) | 4 | 5 |
|---|---|----------|---|---|
| 🏠 홈 | 📊 통계 | 💪 운동 | 🏃 수행능력 | 🏅 랭킹 |

**변경 (5탭):**
| 1 | 2 | 3 (센터) | 4 | 5 |
|---|---|----------|---|---|
| 🏠 홈 | 📊 통계 | 💪 운동 | 🏃 내 실력 | 📋 운동사전 |

- 수행능력 + 랭킹 → **"내 실력"** 탭으로 통합
- **"운동사전"** 탭 신규 추가

---

## 1. 🏠 홈 탭 수정

### 1-1. 목표 추적기 (최상단)

홈 최상단에 고정. 동시 목표는 **최대 3개**까지 설정 가능하며, 메인 목표 1개를 크게, 나머지를 소형으로 표시한다.

**목표 유형:**
| 카테고리 | 목표 예시 | 추적 방식 |
|----------|----------|-----------|
| 근력 | 벤치프레스 110kg | 현재 100kg → 110kg (진행률 바) |
| 체성분 | 체지방률 15% 이하 | 현재 16.8% → 15% |
| 체력 | 5km 25분 이내 | 현재 26:40 → 25:00 |
| 출석 | 이번 달 20회 출석 | 현재 16회 → 20회 |
| 체중 | 체중 70kg 달성 | 현재 73.4kg → 70kg |

**UI (현재 구현):**
- 메인 목표: 카드 형태, Bebas Neue 큰 숫자 + **프로그레스바** + "목표까지 -10kg" 텍스트
- 서브 목표: 가로 2칸 배치, 각각 프로그레스바 + 현재/목표 수치 (최대 2개)
- "목표 편집" → 바텀 시트: 종목 선택(드롭다운) + 목표 수치(숫자 키패드) + 기한(선택, 1/2/3개월 칩)
- 기한 미설정 시: 무기한 (채찍 페널티 없음)
- 달성 시: 🎉 축하 애니메이션 + 당근 +3🥕 즉시 지급

### 1-2. 당근 크레딧 시스템

당근은 앱 내 포인트 화폐. 적립하고 상점에서 실제 혜택으로 사용한다.

#### 🥕 획득 조건

| 조건 | 지급 | 주기 |
|------|------|------|
| 주 1회 이상 출석 | +1 🥕 | 매주 월요일 자동 정산 |
| 7일 연속 출석 | +2 🥕 (보너스) | 달성 시 즉시 |
| PR 갱신 (어떤 종목이든) | +2 🥕 | 달성 시 즉시 |
| 목표 달성 | +3 🥕 | 달성 시 즉시 |

#### 🪓 채찍 (차감 조건)

| 조건 | 페널티 | 알림 |
|------|--------|------|
| 주간 출석 0회 | -1 🥕 | 월요일 정산 시 빨간 토스트 |
| 2주 연속 무출석 | -3 🥕 | 홈 상단 경고 배너 표시 |
| 목표 기한 초과 (기한 설정한 경우만) | -1 🥕 | 기한 당일 알림 |

- 당근 잔액이 0 이하로 내려가지 않음 (최소 0)
- 채찍은 동기부여 목적이므로 가벼운 차감 + 눈에 띄는 경고 알림 조합

#### 🥕 상점

| 아이템 | 비용 | 비고 |
|--------|------|------|
| 프로틴 쉐이크 1잔 | 5 🥕 | |
| BCAA / 음료 1잔 | 3 🥕 | |
| 헬스장 1일 이용권 | 10 🥕 | |
| 헬스장 1주 이용권 | 25 🥕 | |
| PT 1회 이용권 | 30 🥕 | |

- 상점 아이템은 **앱 내 고정 목록**으로 시작. 추후 트레이너/관리자 CMS 확장 가능하나 v3.0에서는 고정.
- 구매 시: 잔액 차감 + 토스트 "🥕 -5 프로틴 쉐이크 구매 완료" + 구매 이력 저장
- 잔액 부족 시: 구매 차단 + "잔액이 부족합니다" 토스트

#### 🥕 당근 UI 위치
- 홈: 목표 추적기 바로 아래에 잔액 배지 "🥕 12 · 상점 →" (탭 시 상점 바텀 시트)
- 획득/차감 시: 토스트 알림
- 상점: 바텀 시트 (잔액 + 아이템 그리드 + 획득/사용 이력 탭)

### 1-3. PT 세션 관리

홈 탭에서 잔여 PT 세션을 확인하는 카드.

**UI:**
- "잔여 PT" + 큰 숫자 (Bebas Neue) + 색상 (8+ 초록 / 5~7 노랑 / 3이하 빨간 pulse)
- 다음 PT 예약일 표시 (있으면)
- 하단 "이력 보기" → 구매/사용 이력

### 1-4. 홈 탭 최종 섹션 순서

```
┌─────────────────────────────┐
│  🎯 목표 추적기 (최상단)       │  메인 목표 + 진행률 + 서브 목표 칩
│  🥕 당근 잔액 배지            │  "🥕 12 · 상점 →"
├─────────────────────────────┤
│  인사 배너 (HeroBanner)      │  연속 출석 + 3칸 수치
│  오늘의 운동 CTA              │  TodayCTA
├─────────────────────────────┤
│  PT 세션 관리                 │  잔여 세션 카드
│  이번 주 출석 도트             │  WeekDots (당근 획득 조건 연결 표시)
│  챌린지 카드                  │  주간 당근 챌린지 + 월간 출석
├─────────────────────────────┤
│  스트렝스 레벨 미니            │  LevelMini
│  트레이너 메시지               │  TrainerMsg
│  최근 활동 피드                │  MiniFeed
│  신체 컨디션 맵               │  BodyMap
└─────────────────────────────┘
```

---

## 2. 🏃 내 실력 탭 (수행능력 + 랭킹 통합)

### 구조

```
┌─────────────────────────────┐
│  🏅 종합 랭킹 히어로           │  점수/등급/레이더 차트 (항상 표시)
│     63/100 · GOLD · 상위 37%  │
├─────────────────────────────┤
│  [🧬 체성분] [🏋️ 근력] [🏃 체력] │  서브탭
├─────────────────────────────┤
│  (선택된 서브탭 콘텐츠)        │  상세 데이터 + 해당 영역 랭킹 점수 인라인
├─────────────────────────────┤
│  등급 범례 (Bronze~Elite)     │
│  AI 개선 가이드 (3개 팁)      │
└─────────────────────────────┘
```

- 최상단 RankHero는 항상 노출, 서브탭만 전환
- 각 서브탭 콘텐츠 안에 해당 영역 랭킹 점수·백분위 인라인 포함
  - 예: 근력 서브탭 → 3대 운동 바 + "근력 점수 55점 · 상위 45%"

---

## 3. 📋 운동사전 탭 (신규)

운동 종목 라이브러리. 종목별 정보·자세·타겟 근육을 제공한다.

### 리스트 화면

- 상단: 검색바 (종목명 검색, 실시간 필터)
- 카테고리 칩: 전체 / 가슴 / 등 / 어깨 / 팔 / 하체 / 코어 / 유산소
- 운동 카드: SVG 일러스트 + 종목명 + 카테고리 배지 + 타겟 근육 태그
- 카드 클릭 → 상세 바텀 시트

### 상세 화면 (바텀 시트, 80% 높이)

```
┌─────────────────────────────┐
│  종목명 (Bebas Neue 28px)     │
│  카테고리 배지                 │
├─────────────────────────────┤
│  SVG 일러스트 (큰 사이즈)     │
├─────────────────────────────┤
│  타겟 근육                    │  주동근: 대흉근 / 보조근: 전면 삼각근, 삼두
│  (바디맵 미니 하이라이트)      │
├─────────────────────────────┤
│  운동 설명                    │  자세 포인트 3~4줄 + 주의사항
├─────────────────────────────┤
│  내 기록                      │  PR: 100kg / 최근: 95kg × 8 (있으면)
├─────────────────────────────┤
│  레벨별 권장                  │  NOVICE: 40~60kg 3×10
│                              │  INTER: 70~100kg 4×6
│                              │  ADV: 100~140kg 5×3
└─────────────────────────────┘
```

### 콘텐츠 소스
- v3.0에서는 **앱 내 직접 작성** (data/exercises-info.ts에 목업 데이터)
- 주요 종목 20~30개 우선 작성: 벤치프레스, 스쿼트, 데드리프트, 오버헤드프레스, 바벨로우, 풀업, 인클라인 덤벨, 딥스, 레그프레스, 레그컬, 레그익스텐션, 랫풀다운, 케이블로우, 사이드레터럴, 바이셉컬, 트라이셉스 푸시다운, 플랭크, 러닝머신, 로잉머신, 싸이클링 등
- 추후 외부 API 연동 또는 관리자 CMS 확장 가능

### 컴포넌트 구조

```
components/exercise-info/
├── ExerciseInfoTab.tsx       # 탭 메인 (검색 + 리스트)
├── ExerciseSearch.tsx        # 검색바
├── CategoryChips.tsx         # 카테고리 필터 칩
├── ExerciseList.tsx          # 운동 카드 리스트
└── ExerciseDetail.tsx        # 운동 상세 바텀 시트
```

---

## 4. 영향받는 기존 요소

### AppContext 수정
```typescript
// 변경 전
type TabId = 'home' | 'stats' | 'workout' | 'performance' | 'ranking';

// 변경 후
type TabId = 'home' | 'stats' | 'workout' | 'performance' | 'exercise-info';
```

### BottomNav 수정
```
🏠 홈 / 📊 통계 / 💪 운동(센터) / 🏃 내 실력 / 📋 운동사전
```

### 데이터 파일 추가
```
data/
├── goals.ts              # 목표 목업 (최대 3개)
├── credits.ts            # 당근 잔액 + 획득/사용 이력
├── shop.ts               # 상점 아이템 목록 (5개)
└── exercises-info.ts     # 운동 종목 상세 정보 (20~30개)
```

### 신규 컴포넌트
```
components/
├── home/
│   ├── GoalTracker.tsx         # 목표 추적기
│   ├── GoalEditSheet.tsx       # 목표 편집 바텀 시트
│   ├── CarrotBadge.tsx         # 당근 잔액 배지
│   ├── CarrotShop.tsx          # 당근 상점 바텀 시트
│   ├── CarrotHistory.tsx       # 당근 이력
│   ├── SessionManager.tsx      # PT 세션 관리 카드
│   └── WhipBanner.tsx          # 채찍 경고 배너
├── exercise-info/
│   ├── ExerciseInfoTab.tsx
│   ├── ExerciseSearch.tsx
│   ├── CategoryChips.tsx
│   ├── ExerciseList.tsx
│   └── ExerciseDetail.tsx
```

### 이동되는 컴포넌트
```
components/ranking/ → components/performance/ 안으로 이동
├── RankHero.tsx          → performance/RankHero.tsx
├── RankCards.tsx          → performance/RankCards.tsx
├── RadarChart.tsx         → performance/RadarChart.tsx
└── GradeLegend.tsx        → performance/GradeLegend.tsx
```

ranking/ 폴더 삭제.

---

## 5. 백엔드 영향

### 신규 엔티티

**Goal (목표)**
| 필드 | 타입 | 설명 |
|------|------|------|
| id | UUID | |
| memberId | UUID (FK) | |
| category | enum | strength / body / cardio / attendance / weight |
| exerciseKey | string (nullable) | bench, squat 등 (근력 목표 시) |
| targetValue | decimal | 목표 수치 |
| currentValue | decimal | 현재 수치 |
| unit | string | kg, %, 분, 회 |
| deadline | date (nullable) | 기한 (미설정 시 null) |
| achieved | boolean | 달성 여부 |
| isPrimary | boolean | 메인 목표 여부 |
| createdAt | timestamp | |

**CarrotCredit (당근 이력)**
| 필드 | 타입 | 설명 |
|------|------|------|
| id | UUID | |
| memberId | UUID (FK) | |
| amount | int | +양수(획득) / -음수(차감/사용) |
| reason | string | 'weekly_attend', 'pr_achieved', 'goal_achieved', 'streak_bonus', 'whip_no_attend', 'whip_2week', 'whip_deadline', 'shop_purchase' |
| relatedId | string (nullable) | 관련 엔티티 ID (goalId, shopPurchaseId 등) |
| createdAt | timestamp | |

**ShopItem (상점 아이템)**
| 필드 | 타입 | 설명 |
|------|------|------|
| id | UUID | |
| name | string | 프로틴 쉐이크 |
| cost | int | 5 |
| emoji | string | 🥤 |
| description | string | |
| isActive | boolean | 활성 여부 |
| sortOrder | int | |

**ShopPurchase (구매 이력)**
| 필드 | 타입 | 설명 |
|------|------|------|
| id | UUID | |
| memberId | UUID (FK) | |
| shopItemId | UUID (FK) | |
| cost | int | 구매 시점 비용 |
| purchasedAt | timestamp | |

**ExerciseInfo (운동 종목 상세)**
| 필드 | 타입 | 설명 |
|------|------|------|
| id | UUID | |
| exerciseId | UUID (FK → Exercise) | |
| targetMuscles | jsonb | { primary: ['대흉근'], secondary: ['전면삼각근', '삼두'] } |
| description | text | 자세 설명 |
| tips | text | 주의사항 |
| levelGuide | jsonb | { novice: '40~60kg 3×10', inter: '...', adv: '...' } |

### 신규 API

| Method | Path | 설명 |
|--------|------|------|
| GET | /goals/me | 내 목표 목록 (최대 3개) |
| POST | /goals | 목표 생성 |
| PATCH | /goals/:id | 목표 수정 / 달성 처리 |
| DELETE | /goals/:id | 목표 삭제 |
| GET | /credits/me | 당근 잔액 (sum) + 최근 이력 |
| GET | /credits/me/history | 당근 전체 이력 (페이지네이션) |
| GET | /shop/items | 상점 아이템 목록 |
| POST | /shop/purchase | 아이템 구매 (잔액 차감) |
| GET | /exercises/info | 운동 종목 상세 목록 (검색/카테고리 필터) |
| GET | /exercises/info/:id | 운동 종목 상세 1건 |

### Member 테이블 추가 필드
| 필드 | 타입 | 설명 |
|------|------|------|
| carrotBalance | int | 당근 잔액 (캐시, 기본 0) |
| remainingSessions | int | 잔여 PT 세션 |
| nextPtDate | date (nullable) | 다음 PT 예약일 |

---

## 6. 구현 우선순위 (프론트)

| 순서 | 작업 | 범위 | 상태 |
|------|------|------|------|
| 1 | TabId + BottomNav 변경 | AppContext, BottomNav | ✅ |
| 2 | 랭킹 → 내 실력 탭 통합 | ranking/ → performance/ 이동 | ✅ |
| 3 | 목표 추적기 | GoalTracker + GoalEditSheet + data/goals.ts | ✅ |
| 4 | 당근 크레딧 시스템 | CarrotBadge + CarrotShop + CarrotHistory + WhipBanner | ✅ |
| 5 | PT 세션 관리 | SessionManager | ✅ |
| 6 | 운동사전 탭 | ExerciseInfoTab + data/exercises-info.ts | ✅ |
| 7 | 홈 탭 섹션 순서 재배치 | HomeTab 내부 순서 조정 | ✅ |

---

## 7. 현재 아키텍처

### 프로젝트 구조

```
strongsalon/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Bebas Neue, Space Mono 폰트, AppProvider
│   │   ├── page.tsx            # TabContent + AppShell (단일 페이지)
│   │   ├── login/page.tsx      # Google/Kakao OAuth 버튼 (임시)
│   │   └── globals.css         # CSS 변수, 라이트/다크/운동 테마
│   │
│   ├── components/
│   │   ├── shell/
│   │   │   ├── AppShell.tsx    # Topbar + scroll-body + BottomNav
│   │   │   ├── Topbar.tsx      # 타이틀, 라이트/다크 토글
│   │   │   └── BottomNav.tsx   # 5탭 (홈/통계/운동/내실력/운동사전)
│   │   │
│   │   ├── home/
│   │   │   ├── HomeTab.tsx
│   │   │   ├── GoalTracker.tsx     # 프로그레스바 UI, PrimaryGoalCard + SubGoalCard
│   │   │   ├── GoalEditSheet.tsx   # 목표 편집 바텀시트
│   │   │   ├── CarrotBadge.tsx
│   │   │   ├── CarrotShop.tsx
│   │   │   ├── CarrotHistory.tsx
│   │   │   ├── WhipBanner.tsx      # 2주 무출석 경고
│   │   │   ├── SessionManager.tsx  # 잔여 PT 세션
│   │   │   ├── HeroBanner.tsx
│   │   │   ├── TodayCTA.tsx
│   │   │   ├── WeekDots.tsx
│   │   │   ├── ChallengeCards.tsx
│   │   │   ├── LevelMini.tsx
│   │   │   ├── TrainerMsg.tsx
│   │   │   ├── MiniFeed.tsx
│   │   │   └── BodyMap.tsx         # @mjcdev/react-body-highlighter
│   │   │
│   │   ├── stats/
│   │   │   ├── StatsTab.tsx        # year/month 상태 공유
│   │   │   ├── AttendCalendar.tsx  # 날짜 클릭 → DayWorkoutDetail
│   │   │   ├── StatGrid.tsx        # 월별 통계 6카드
│   │   │   ├── VolumeChart.tsx
│   │   │   ├── ConditionDonut.tsx
│   │   │   └── PeriodChips.tsx
│   │   │
│   │   ├── performance/            # 수행능력 + 랭킹 통합
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
│   │   ├── exercise-info/
│   │   │   ├── ExerciseInfoTab.tsx
│   │   │   ├── ExerciseSearch.tsx
│   │   │   ├── CategoryChips.tsx
│   │   │   ├── ExerciseList.tsx
│   │   │   └── ExerciseDetail.tsx
│   │   │
│   │   ├── workout/                # theme='workout' 시 전체 화면
│   │   │   ├── WorkoutPage.tsx
│   │   │   ├── useWorkoutLog.ts    # mode, trainerProg, freeExercises, cardioEntries
│   │   │   ├── WorkoutTopbar.tsx
│   │   │   ├── ModeBanner.tsx      # AI/자유 모드 선택
│   │   │   ├── TrainerArea.tsx
│   │   │   ├── FreeArea.tsx
│   │   │   ├── CardioArea.tsx
│   │   │   ├── CondBox.tsx
│   │   │   ├── DateBox.tsx
│   │   │   └── ...
│   │   │
│   │   └── ui/
│   │       ├── Toast.tsx
│   │       ├── Badge.tsx
│   │       ├── ProgressBar.tsx
│   │       └── SVGIllust.tsx
│   │
│   ├── context/
│   │   └── AppContext.tsx      # activeTab, subTab, theme, colorMode, setTab, enterWorkout
│   │
│   ├── data/
│   │   ├── member.ts
│   │   ├── attendance.ts
│   │   ├── workout.ts
│   │   ├── workoutHistory.ts
│   │   ├── goals.ts
│   │   ├── credits.ts
│   │   ├── shop.ts
│   │   └── exercises-info.ts
│   │
│   ├── types/index.ts
│   └── utils/
│       ├── calendar.ts
│       ├── monthlyStats.ts
│       ├── format.ts
│       └── scoring.ts
│
├── docs/
│   ├── README.md
│   ├── PLANNING.md
│   └── BACKEND_README.md
└── package.json
```

### TabId 및 라우팅

```typescript
type TabId = 'home' | 'stats' | 'workout' | 'performance' | 'exercise-info';
```

- `theme === 'workout'` → WorkoutPage 전체 화면 (탭 UI 숨김)
- 그 외 → display로 탭 전환 (단일 페이지)

### 운동 기록 (WorkoutPage) 플로우

- **useWorkoutLog**: mode(null|trainer|free), trainerProg, freeExercises, cardioEntries
- **트레이너 모드**: createInitialTrainerProg() 기반 + AI 유산소 자동 생성
- **자유 모드**: FAV_CHIPS에서 근력 추가 + 유산소
- **오운완**: 콘솔 JSON 출력 후 홈 탭으로 이동

### 통계 탭 데이터 흐름

- `getMonthlyStats(year, month)` → PT출석일, 개인출석률, 총볼륨, 운동횟수, 평균운동시간, 연속출석
- AttendCalendar 날짜 클릭 → workoutHistory 기반 DayWorkoutDetail
