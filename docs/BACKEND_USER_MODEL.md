# FitLog 유저 데이터 모델 (백엔드 연동용)

프론트엔드 FitLog의 통합 `User` 타입을 기준으로 한 백엔드 연동용 데이터 모델 문서입니다.  
상세 엔티티·API 설계는 [BACKEND_README.md](./BACKEND_README.md)를 참고하세요.

---

## User 엔티티 (프론트 통합 기준)

프론트의 `User` 타입은 온보딩/프로필(`UserProfile`)과 퍼포먼스/멤버십(`MemberProfile`)을 통합한 구조입니다.

| 필드 | 타입 | 설명 |
|------|------|------|
| id | string (UUID) | 유저 고유 ID |
| email | string (nullable) | 로그인 연동 시 이메일 |
| nickname | string | 닉네임 (온보딩 입력) |
| name | string | 실명 (예: 김민준) |
| initial | string | 아바타용 이니셜 (예: 김) |
| gender | enum | `male` \| `female` |
| birthDate | string | 생년월일 (YYYY-MM-DD) |
| height | number | 키 (cm) |
| weight | number | 체중 (kg) |
| experience | enum | `beginner` \| `intermediate` \| `advanced` |
| avatarGradient | string (nullable) | CSS gradient 문자열 |
| createdAt | string | 생성일 (ISO 8601) |

### 트레이너/멤버십 (선택)

| 필드 | 타입 | 설명 |
|------|------|------|
| trainerName | string (nullable) | 배정된 트레이너 이름 |
| membershipExpiry | string (nullable) | 멤버십 만료일 |
| membershipStart | string (nullable) | 멤버십 시작일 |
| remainingSessions | number (nullable) | 남은 PT 횟수 |
| totalSessions | number (nullable) | 총 PT 횟수 |
| nextPtDate | string (nullable) | 다음 PT 예정일 |

### 퍼포먼스용 (선택)

| 필드 | 타입 | 설명 |
|------|------|------|
| level | enum | `NOVICE` \| `INTERMEDIATE` \| `ADVANCED` |
| liftTotal | number (nullable) | 3대 합계 (kg) |
| bodyWeight | number (nullable) | 현재 체중 (kg) |
| bodyComp | BodyComposition (nullable) | 최신 체성분 (인바디) |
| lifts | LiftData[] (nullable) | 3대 1RM 등 근력 기록 |
| cardio | CardioRecord[] (nullable) | 유산소 기록 |
| prMap | Record<string, number> (nullable) | 종목별 PR (JSON) |

- **bodyComp**: `{ weight, muscle, fatPct, bmi, measuredAt }` 등
- **lifts**: `{ exerciseKey, weight, recordedAt }[]` (bench, squat, deadlift)
- **cardio**: `{ type, distanceKm, timeSeconds, recordDate }[]` (run, cycle, row)

---

## API 엔드포인트 (예시)

| Method | Path | 설명 |
|--------|------|------|
| GET | /api/user/me | 현재 로그인 유저 프로필 전체 (bodyComp, lifts, cardio, prMap 포함) |
| PATCH | /api/user/me | 프로필 일부 수정 (nickname, name, height, weight 등) |

### 추후 확장 예시

- 목표(Goal), 출석(Attendance), 인바디 이력, 운동 로그 등은 별도 엔티티/API로 분리 가능
- 상세 설계는 [BACKEND_README.md](./BACKEND_README.md) 참고

---

## 공통 사항

- **인증**: `Authorization: Bearer <accessToken>` (JWT)
- **날짜**: ISO 8601 또는 `YYYY-MM-DD` 문자열 통일
- **에러**: 4xx/5xx + JSON `{ message, code?, errors? }`
