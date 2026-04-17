# Example — 하네스 기반 풀스택 생성 프로젝트

고객 요구사항을 받아 **하네스 규칙에 맞는 풀스택 코드**를 일관된 품질로 생성하는 예제 프로젝트.

---

## 전체 흐름

```
1. FDE가 현업 담당자에게 요구사항 수집
2. spec-requests/ 에 요구사항 원문 작성 (MD)
3. Claude와 대화하며 하네스 규칙에 맞게 specs/ 에 구조화된 명세 생성 (YML)
4. YML 명세 기반으로 백엔드 → 프론트엔드 코드 자동 생성
5. 빌드·검증 완료 후 log/ 에 빌드 로그 기록
```

---

## 디렉토리 구조

```
example/
├── harness/              # 하네스 규칙 (코드 생성 시 반드시 준수)
│   ├── stack.md          #   기술 스택 및 의존성
│   ├── structure.md      #   프론트/백엔드 폴더 구조
│   ├── architecture.md   #   아키텍처 규칙, 레이어 경계
│   ├── coding.md         #   코딩 컨벤션
│   ├── style-guide.md    #   스타일 가이드
│   ├── naming.md         #   테이블/컬럼 명명 규칙
│   ├── schema.md         #   DB 스키마 현황
│   ├── spec-format.md    #   YML 명세 포맷 정의
│   └── ux.md             #   UX 패턴 (로딩, 빈상태, 에러, 반응형)
│
├── skills/               # 스킬 (생성/관리 레시피)
│   ├── precheck.md       #   사전 환경 체크 (최초 1회)
│   ├── init-backend.md   #   백엔드 초기 셋팅
│   ├── init-frontend.md  #   프론트엔드 초기 셋팅
│   ├── crud-page.md      #   기능별 CRUD 풀스택 생성
│   ├── build-log.md      #   빌드 로그 생성
│   ├── lessons-learned.md #  이전 셋팅 경험 기록
│   └── reset-project.md  #   프로젝트 초기화
│
├── spec-requests/        # 요구사항 원문 (FDE가 현업에서 수집한 그대로)
│   └── resort-reservation.md
│
├── specs/                # 구조화된 기능 명세 (하네스 규칙 기반 YML)
│   └── resort-reservation.yml
│
├── log/                  # 빌드 로그 (생성 과정 기록)
│   └── 2026-04-16_resort-reservation.md
│
└── CLAUDE.md             # 프로젝트 설정 및 자동 실행 규칙
```

---

## 사용 방법

### 1. 요구사항 작성

FDE가 현업 담당자에게 받은 요구사항을 `spec-requests/` 에 마크다운으로 작성한다.

```
spec-requests/resort-reservation.md
```

### 2. 명세(YML) 생성

Claude와 대화하며 `harness/spec-format.md` 포맷에 맞게 YML 명세를 생성한다.

```
specs/resort-reservation.yml
```

### 3. 코드 생성

YML 명세를 Claude에게 전달하면 아래 순서로 자동 생성된다.

```
환경 체크 → 백엔드 셋팅 → 프론트엔드 셋팅 → CRUD 구현 → 빌드 검증 → 스키마 업데이트
```

### 4. 빌드 로그 확인

생성 완료 후 `log/` 에 단계별 판단·참조 하네스·소요시간이 기록된다.

```
log/2026-04-16_resort-reservation.md
```

---

## 기술 스택

| 구분 | 스택 |
|------|------|
| 프론트엔드 | React 19 + TypeScript + Tailwind CSS + Vite |
| 백엔드 | Spring Boot 3 + Java 17 + JPA (Hibernate) |
| DB | H2 (파일 모드) |

---

## 핵심 원칙

- 모든 생성 코드는 `harness/` 규칙을 **전부 준수**해야 한다
- 빌드 검증 실패 시 수정 후 **하네스 규칙에 피드백** (반복 가능한 문제는 규칙에 추가)
- 프로젝트 초기화(reset) 시에도 `harness/`, `skills/`, `spec-requests/`, `specs/`, `log/` 는 **보존**된다
