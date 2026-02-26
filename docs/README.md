# FitLog v3.0

모바일 퍼스트 피트니스 기록·통계·랭킹 웹앱. **프론트엔드(Next.js)** 와 **백엔드(NestJS, 예정)** 로 구성됩니다.

---

## 한 줄 소개

회원·트레이너용 운동 프로그램, 출석, 체성분·근력·체력 기록과 통계·랭킹을 한 곳에서 관리하는 FitLog v3.0입니다.

---

## 프로젝트 구조

```
strongsalon/                    # 프로젝트 루트
├── src/                        # Next.js 프론트엔드 (FitLog v3.0)
│   ├── app/                    # App Router 페이지
│   │   ├── login/              # 로그인 (Google/Kakao 예정)
│   │   ├── stats/              # 통계 탭
│   │   ├── workout/            # 💪 운동 탭
│   │   ├── performance/        # 수행능력 탭
│   │   ├── ranking/            # 랭킹 탭
│   │   └── ...
│   ├── components/             # UI 컴포넌트 (home, stats, performance, ranking 등)
│   ├── context/                # 테마·인증 등 전역 상태
│   ├── data/                   # 목업 데이터 (member, exercises, attendance)
│   ├── types/                  # TypeScript 타입 정의
│   └── utils/                  # 유틸 (scoring, formatters)
├── docs/
│   └── BACKEND_README.md       # 백엔드(NestJS) 엔티티·API 설계
├── README.md                   # 이 파일 (전체 프로젝트 개요)
└── package.json
```

- **백엔드**: NestJS로 별도 구현 예정. 엔티티·API 스펙은 [docs/BACKEND_README.md](docs/BACKEND_README.md) 참고.

---

## 기술 스택

| 구분 | 스택 |
|------|------|
| **프론트** | Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion |
| **백엔드(예정)** | NestJS, TypeORM/Prisma, PostgreSQL, Passport (Google/Kakao), JWT |

---

## 실행 방법

### 프론트엔드 (현재)

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속.

### 백엔드 (예정)

NestJS 프로젝트 생성 후 `docs/BACKEND_README.md`의 엔티티·API를 기준으로 구현.  
실행 방법은 백엔드 저장소/폴더의 README에 작성 예정.

---

## 주요 기능 (프론트 기준)

- **홈**: Hero 배너, 오늘의 프로그램·트레이너 메시지, 바디맵, 주간 출석, 미니 피드
- **통계**: 기간별 볼륨·컨디션, 체성분·인바디, 체력(카디오)·근력(1RM) 기록
- **💪 운동**: 오늘의 프로그램 기반 운동 모드 (세트 기록, 완료)
- **수행능력**: 체성분·체력·근력 상세 및 추이
- **랭킹**: 종합 점수·등급(ELITE/PLATINUM/GOLD/SILVER/BRONZE), 레이더 차트
- **로그인**: Google / Kakao 버튼 (실제 OAuth 연동은 백엔드 연동 시)

---

## 환경 변수 (예정)

- **프론트**: `NEXT_PUBLIC_API_URL` (백엔드 API 베이스 URL)
- **백엔드**: DB URL, JWT 시크릿, Google/Kakao OAuth 클라이언트 정보 등 (BACKEND_README 참고)

---

## 참고 문서

- [백엔드 설계 (엔티티·API)](docs/BACKEND_README.md) — NestJS 구현 시 참고

---

## 라이선스

프로젝트 정책에 따릅니다.
