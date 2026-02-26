# FitLog 백엔드 (NestJS) 설계

프론트엔드 FitLog v3.0과 연동하기 위한 NestJS 백엔드의 엔티티 및 API 설계 문서입니다.

---

## 기술 스택 (권장)

- **Runtime**: Node.js 20+
- **Framework**: NestJS 10+
- **ORM**: TypeORM 또는 Prisma
- **DB**: PostgreSQL (또는 SQLite 개발용)
- **인증**: Passport (Google OAuth2, Kakao Strategy) + JWT (Access / Refresh)
- **검증**: class-validator, class-transformer

---

## 엔티티 (Entity)

### 1. User

OAuth 로그인 계정. 구글/카카오 중복 가입 방지를 위해 이메일 또는 provider+providerId 조합으로 식별.

| 필드 | 타입 | 설명 |
|------|------|------|
| id | UUID (PK) | |
| email | string (nullable) | Google 이메일 등 |
| provider | enum | `google` \| `kakao` |
| providerId | string | OAuth 제공처 고유 ID |
| name | string | 표시 이름 |
| profileImageUrl | string (nullable) | 프로필 이미지 URL |
| createdAt | timestamp | |
| updatedAt | timestamp | |

- **Unique**: `(provider, providerId)`

---

### 2. Member (회원 프로필)

User와 1:1. 트레이너 배정, 레벨, 대시보드 집계용 필드.

| 필드 | 타입 | 설명 |
|------|------|------|
| id | UUID (PK) | |
| userId | UUID (FK → User, unique) | |
| trainerId | UUID (FK → Trainer, nullable) | |
| name | string | 실명 (예: 김민준) |
| initial | string | 아바타용 이니셜 (예: 김) |
| avatarGradient | string | CSS gradient 문자열 |
| level | enum | `NOVICE` \| `INTERMEDIATE` \| `ADVANCED` |
| bodyWeight | decimal | 현재 체중 (kg) |
| liftTotal | int | 3대 합계 (kg) — 캐시 또는 집계 |
| streak | int | 연속 출석일 |
| monthAttendRate | int | 이달 출석률 (0–100) |
| avgVolume | string | 평균 볼륨 표시 (예: 9.2k) |
| avgCondition | decimal | 평균 컨디션 (1–5) |
| createdAt | timestamp | |
| updatedAt | timestamp | |

---

### 3. Trainer

트레이너 계정. 회원에게 배정되며, 오늘의 운동/메시지 작성.

| 필드 | 타입 | 설명 |
|------|------|------|
| id | UUID (PK) | |
| userId | UUID (FK → User, unique) | 로그인 계정 (선택) |
| name | string | 예: 이준호 |
| avatarGradient | string | |
| createdAt | timestamp | |
| updatedAt | timestamp | |

---

### 4. Exercise (운동 종목 마스터)

트레이너가 프로그램에 넣을 수 있는 운동 정의.

| 필드 | 타입 | 설명 |
|------|------|------|
| id | UUID (PK) | |
| name | string | 예: 벤치프레스 |
| emoji | string | |
| cat | string | 카테고리 (가슴, 삼두 등) |
| svgIllust | string | 프론트 SVG 키 (bench, incline 등) |
| createdAt | timestamp | |

---

### 5. WorkoutProgram (오늘의 운동 프로그램)

트레이너가 특정 일자에 배포한 프로그램. 회원별·일자별 1건.

| 필드 | 타입 | 설명 |
|------|------|------|
| id | UUID (PK) | |
| memberId | UUID (FK → Member) | |
| trainerId | UUID (FK → Trainer) | |
| programDate | date | 배포일 (YYYY-MM-DD) |
| title | string | 예: CHEST & TRICEPS |
| message | text (nullable) | 트레이너 오늘 메시지 |
| createdAt | timestamp | |

---

### 6. WorkoutProgramExercise (프로그램별 운동)

한 프로그램에 포함되는 운동 종목 + 세트 정보.

| 필드 | 타입 | 설명 |
|------|------|------|
| id | UUID (PK) | |
| workoutProgramId | UUID (FK) | |
| exerciseId | UUID (FK → Exercise) | |
| sortOrder | int | 1, 2, 3… |
| intensity | string | 예: 102.5kg (80%1RM) |
| sets | jsonb | `[{ "label": "SET1", "kg": 102.5, "reps": 5 }, …]` |

- **sets** 구조: `{ label: string, kg: number, reps: number }[]` (done은 세션 기록용)

---

### 7. WorkoutSession (운동 세션)

회원이 “오늘의 운동”을 시작해 완료/중단한 1회 기록.

| 필드 | 타입 | 설명 |
|------|------|------|
| id | UUID (PK) | |
| memberId | UUID (FK) | |
| workoutProgramId | UUID (FK, nullable) | 오늘의 프로그램 참조 |
| condition | enum | `최고` \| `좋음` \| `보통` \| `피로` \| `최악` |
| startedAt | timestamp | |
| completedAt | timestamp (nullable) | |
| totalVolume | int (nullable) | 완료 시 집계 |
| totalSets | int (nullable) | |

---

### 8. WorkoutSetRecord (세트별 기록)

세트 단위 수행 결과 (무게, 횟수, 완료 여부).

| 필드 | 타입 | 설명 |
|------|------|------|
| id | UUID (PK) | |
| workoutSessionId | UUID (FK) | |
| workoutProgramExerciseId | UUID (FK) | |
| setLabel | string | WU1, SET1 등 |
| kg | decimal | |
| reps | int | |
| done | boolean | |
| sortOrder | int | |

---

### 9. Attendance (출석)

일자별 출석 타입 (PT/개인/둘 다).

| 필드 | 타입 | 설명 |
|------|------|------|
| id | UUID (PK) | |
| memberId | UUID (FK) | |
| date | date | YYYY-MM-DD |
| type | enum | `pt` \| `self` \| `both` |
| createdAt | timestamp | |

- **Unique**: `(memberId, date)`

---

### 10. BodyComposition (체성분)

인바디 등 체성분 측정 이력.

| 필드 | 타입 | 설명 |
|------|------|------|
| id | UUID (PK) | |
| memberId | UUID (FK) | |
| measuredAt | date | 측정일 |
| weight | decimal | 체중 (kg) |
| muscle | decimal | 골격근량 (kg) |
| fatPct | decimal | 체지방률 (%) |
| bmi | decimal | |
| createdAt | timestamp | |

- 집계/대시용: 최신 1건 조회, 6개월 추이용 리스트 조회.

---

### 11. LiftRecord (근력 1RM 기록)

3대 운동 등 1RM 이력. 등급/백분위는 서비스 레이어 또는 프론트에서 계산 가능.

| 필드 | 타입 | 설명 |
|------|------|------|
| id | UUID (PK) | |
| memberId | UUID (FK) | |
| exerciseKey | string | bench \| squat \| deadlift |
| weight | decimal | 1RM (kg) |
| recordedAt | date | |
| createdAt | timestamp | |

- **PR 조회**: member별 exerciseKey별 최대 weight.

---

### 12. CardioRecord (체력 기록)

유산소 기록. 오늘 운동 플로우에서는 **런닝 · 싸이클 · 로잉** 타입에 **거리(km) + 시간**만 입력.

| 필드 | 타입 | 설명 |
|------|------|------|
| id | UUID (PK) | |
| memberId | UUID (FK) | |
| type | enum | `run` \| `cycle` \| `row` (런닝 / 싸이클 / 로잉) |
| distanceKm | decimal | 거리 (km) |
| timeSeconds | int | 소요 시간 (초) |
| recordDate | date | 기록일 (YYYY-MM-DD) |
| stats | jsonb (nullable) | 추가 메타 `[{ "label": "거리", "value": "5.2km" }, …]` |
| createdAt | timestamp | |

- PR: member별 type별로 동일 거리 기준 최소 timeSeconds, 또는 거리 무관 최대 distanceKm 등 서비스 정책에 따라 정의.

---

### 13. MuscleCondition (선택)

신체 컨디션 맵 부위별 상태. 프론트에서 로컬만 쓸 경우 생략 가능.

| 필드 | 타입 | 설명 |
|------|------|------|
| id | UUID (PK) | |
| memberId | UUID (FK) | |
| bodyPartId | string | chest, shoulder, … |
| status | enum | `none` \| `injury` \| `worked` \| `fatigue` \| `recover` |
| detail | string (nullable) | |
| updatedAt | timestamp | |

---

## API 목록 (프론트 연동 기준)

### 인증 (Auth)

| Method | Path | 설명 |
|--------|------|------|
| GET | /auth/google | Google OAuth 리다이렉트 |
| GET | /auth/google/callback | Google callback, JWT 발급 후 리다이렉트 |
| GET | /auth/kakao | Kakao OAuth 리다이렉트 |
| GET | /auth/kakao/callback | Kakao callback, JWT 발급 후 리다이렉트 |
| POST | /auth/refresh | Refresh token으로 Access token 재발급 |
| POST | /auth/logout | 로그아웃 (refresh 무효화 등) |
| GET | /auth/me | 현재 로그인 사용자 + Member 프로필 요약 |

---

### 회원 (Member)

| Method | Path | 설명 |
|--------|------|------|
| GET | /members/me | 내 프로필 전체 (대시보드용: bodyComp, lifts, cardio, streak, monthAttendRate 등) |
| PATCH | /members/me | 프로필 일부 수정 (name, bodyWeight 등) |

---

### 트레이너 메시지 / 오늘의 프로그램

| Method | Path | 설명 |
|--------|------|------|
| GET | /members/me/trainer-message | 오늘 트레이너 메시지 (텍스트) |
| GET | /members/me/today-program | 오늘의 운동 프로그램 (제목, 메시지, 운동 목록+세트) — 없으면 404 또는 빈 구조 |

---

### 운동 세션 (Workout)

| Method | Path | 설명 |
|--------|------|------|
| POST | /workout-sessions | 세션 시작 (workoutProgramId, condition) |
| PATCH | /workout-sessions/:id | 세트 완료/무게·횟수 수정 (WorkoutSetRecord upsert) |
| POST | /workout-sessions/:id/complete | 세션 완료 (completedAt, totalVolume, totalSets) |
| GET | /workout-sessions | 내 최근 세션 목록 (선택, 히스토리용) |

---

### 출석 (Attendance)

| Method | Path | 설명 |
|--------|------|------|
| GET | /attendances | 기간별 출석 목록 (query: from, to) |
| POST | /attendances | 출석 체크 (date, type) |

---

### 체성분 (Body)

| Method | Path | 설명 |
|--------|------|------|
| GET | /body-compositions/latest | 최신 1건 (체중, 골격근량, 체지방률, bmi, delta 등) |
| GET | /body-compositions | 기간별 이력 (6개월 추이 등) |
| POST | /body-compositions | 측정값 등록 |

---

### 근력 (Lift)

| Method | Path | 설명 |
|--------|------|------|
| GET | /lifts/me | 3대 현재 1RM + 등급/백분위 (또는 lifts 배열) |
| GET | /lifts/me/history | 6개월 추이 (bench, squat, deadlift) |
| POST | /lifts | 1RM 기록 등록/갱신 |

---

### 체력 (Cardio)

| Method | Path | 설명 |
|--------|------|------|
| GET | /cardio/me | 최근/PR 포함 카디오 기록 (run, cycle, row · distanceKm, timeSeconds) |
| POST | /cardio | 기록 등록 (type, distanceKm, timeSeconds, recordDate) |

---

### 랭킹 (Ranking)

| Method | Path | 설명 |
|--------|------|------|
| GET | /ranking/me | 내 종합 점수, 등급, 근력/체성분/체력 점수 (레이더용) |
| GET | /ranking/leaderboard | (선택) 전국/지역 순위 |

- 점수 계산은 백엔드에서 하거나, 프론트와 동일한 공식(scoring.ts)을 서버에서 구현해 일치시키면 됨.

---

### 기타

| Method | Path | 설명 |
|--------|------|------|
| GET | /members/me/feed | 최근 활동 피드 (출석, PR, 챌린지 등) — MiniFeed |
| GET | /members/me/challenges | 주간/월간 챌린지 진행률 (선택) |

---

## 기획 보완: 운동 완료 조건 · 지표 연동

엔티티·API만으로는 부족한 부분을 정리합니다. 프론트 완료 조건과 백엔드에서의 지표 반영 규칙을 명시해, 구현 시 일관되게 적용할 수 있도록 합니다.

### 1. 금일 운동 완료 조건 (프론트 · 백 연동)

**완료 버튼 활성화 = 근력 완료 OR 유산소 완료 (둘 중 하나만 충족해도 가능).**

| 구분 | 완료 조건 |
|------|-----------|
| **근력** | 자유 모드: 1종목 이상 + 최소 1세트 유효(무게·횟수) / 트레이너 모드: 1종목이라도 1세트라도 유효 입력 |
| **유산소** | 런닝·싸이클·로잉 중 **1건 이상** 거리(km) + 시간(분) 입력 |

- 완료 버튼 클릭 시: 근력 세션이 있으면 `POST /workout-sessions/:id/complete`, 유산소만 있으면 `POST /cardio`(들) 후 해당 날짜 출석 생성. 둘 다 있으면 세션 완료 + 카디오 저장 + 출석 1회.
- 유효 세트: `weight > 0` 이고 `reps > 0` 인 세트.

### 2. 세션 완료 시 백엔드 처리

- **근력 세션 완료** (`POST /workout-sessions/:id/complete`): WorkoutSession에 `completedAt`, `totalVolume`, `totalSets` 저장 → 해당 날짜 출석 없으면 생성 → Member 캐시(streak, monthAttendRate, avgVolume, avgCondition) 재계산.
- **유산소만 완료** (근력 세션 없이 완료 버튼): `POST /cardio`로 유산소 기록(recordDate = 당일) 저장 후, **해당 날짜 출석 생성**으로 동일하게 streak·출석률 반영. (유산소만으로도 “오늘 운동 완료” = 출석 인정.)
- streak / monthAttendRate 계산 규칙은 서비스 레이어에서 정의 (예: 완료일 기준 전일 대비 연속 여부, 해당 월 출석일/영업일 등).

### 3. 근력 지표 연동

| 항목 | 내용 |
|------|------|
| 1RM 추정 | WorkoutSetRecord 중 3대(벤치/스쿼트/데드)에 해당하는 세트의 kg·reps로 1RM 추정 (예: Epley 공식 등). 추정값이 기존 LiftRecord보다 크면 갱신 |
| LiftRecord | member별 exerciseKey(bench, squat, deadlift)별로 최대 1RM 저장. 세션 완료 시 위 추정 로직으로 upsert |
| Member.liftTotal | 3대 1RM 합계. LiftRecord 갱신 후 필요 시 재계산하여 캐시 필드 업데이트 |

- 자유 모드에서 종목명이 3대와 매핑되는 경우에만 1RM 반영 (매핑 규칙은 백엔드 또는 공통 상수로 정의).

### 4. 체력(유산소) 반영

| 항목 | 내용 |
|------|------|
| 정의 | 체력 지표는 **유산소(CardioRecord)** 를 반영. 근력 세션만으로는 체력 점수/PR이 채워지지 않음 |
| 입력 | 오늘 운동 플로우의 **유산소 블록**: 타입 **런닝 · 싸이클 · 로잉**, **거리(km) + 시간(분)** 만 입력 → `POST /cardio` 시 type, distanceKm, timeSeconds(분→초 변환), recordDate 전달 |
| 연동 | WorkoutSession과 CardioRecord는 별도 엔티티. 같은 날짜로 묶어 대시/체력 지표·랭킹에서 함께 사용 |

- 프론트에는 “오늘 운동”에 유산소 입력(km + 시간) 경로를 두었으며, 완료 시 근력 OR 유산소만으로도 출석·완료 처리 가능.

### 5. 체성분

- **BodyComposition** 은 인바디 등 **측정 이력** 전용. 운동 세션과 직접 연동하는 필드는 없음.
- 체성분 지표는 별도 측정 입력 플로우(`POST /body-compositions`)로만 갱신.

---

## 공통 사항

- **인증**: `Authorization: Bearer <accessToken>` (JWT). Refresh는 쿠키 또는 body.
- **에러**: 4xx/5xx + JSON `{ message, code?, errors? }`.
- **날짜**: ISO 8601 또는 `YYYY-MM-DD` 문자열 통일.
- **CORS**: 프론트 도메인 허용 (localhost, Vercel 도메인 등).

---

## 디렉터리 구조 예시 (NestJS)

```
backend/
├── src/
│   ├── auth/           # Google/Kakao Strategy, JWT
│   ├── user/
│   ├── member/
│   ├── trainer/
│   ├── exercise/
│   ├── workout-program/
│   ├── workout-session/
│   ├── attendance/
│   ├── body-composition/
│   ├── lift/
│   ├── cardio/
│   ├── ranking/
│   └── common/         # guards, decorators, filters
├── prisma/ or typeorm/
├── test/
└── package.json
```

이 문서는 프론트엔드 데이터 구조(`types/index.ts`, `data/member.ts` 등)를 기준으로 작성되었으며, 구현 시 스키마/필드명을 조정해 사용하면 됩니다.
