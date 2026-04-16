# Harness Example 프로젝트

## 개요
하네스 엔지니어링 기반으로 일관된 품질의 **사용자용 웹사이트**를 생성하는 프로젝트.
명세(MD)를 입력하면, 아래 하네스 규칙에 따라 백엔드 → 프론트엔드 코드를 생성한다.

> studio(어드민)와 다른 점: 사이드바 레이아웃이 아닌 **Header + Content + Footer** 반응형 레이아웃.

## 기술 스택
- **프론트엔드**: React 19 + TypeScript + Tailwind CSS + Vite (포트 5176)
- **백엔드**: Spring Boot 3 + Java 17 + JPA (Hibernate) (포트 8081)
- **DB**: H2 (파일 모드, 영구 저장, `data/exampledb`)
- **빌드**: Gradle (backend), npm (frontend)

## 하네스 규칙 (아래 파일의 규칙을 반드시 따른다)
- harness/stack.md — 기술 스택 및 의존성 규칙
- harness/structure.md — 프론트/백엔드 폴더 구조 (Header + Content + Footer)
- harness/coding.md — 코딩 컨벤션 (프론트 + 백엔드)
- harness/architecture.md — 아키텍처 규칙, 레이어 경계
- harness/style-guide.md — 스타일 가이드 (사용자용 클린 테마)
- harness/ux.md — UX 패턴 (로딩, 빈상태, 에러, 반응형)
- harness/naming.md — 테이블/컬럼 명명 규칙 (snake_case, PK/FK/감사컬럼 등)
- harness/schema.md — DB 스키마 현황 (기능 생성 후 반드시 업데이트)

## 스킬 (생성/관리 레시피)
- skills/precheck.md — **사전 환경 체크 (셋팅 전 반드시 먼저 실행)**
- skills/init-frontend.md — 프론트엔드 프로젝트 초기 셋팅
- skills/init-backend.md — 백엔드 프로젝트 초기 셋팅
- skills/crud-page.md — 기능별 CRUD 풀스택 생성
- skills/reset-project.md — 프로젝트 초기화 (frontend/backend/data 삭제)
- skills/lessons-learned.md — 이전 셋팅 경험 기록 (반드시 먼저 읽을 것)
- skills/build-log.md — **빌드 로그 생성 (빌드 완료 후 반드시 실행)**

## 빌드 로그
- log/ 폴더에 `{날짜}_{명세명}.md` 형식으로 저장
- 빌드 과정의 단계별 판단, 참조 하네스/스킬, 소요시간, 토큰 사용량 기록
- 프로젝트 초기화(reset) 시에도 log/는 보존

---

## 사용자 입력 처리 규칙 (중요)

### 명세(feature spec MD)를 받았을 때의 자동 흐름

사용자가 기능 명세를 붙여넣고 "만들어줘" 같은 요청을 하면,
**아래 순서로 체크하며 자동 진행한다. 사용자에게 단계별로 묻지 않는다.**

```
0. 사전 환경 체크 (필수)
   - skills/precheck.md 실행
   - Java 17+, Node 18+, npm, curl, unzip 확인
   - 하나라도 미설치 → 즉시 중단하고 설치 안내
   - 전부 통과 → 다음 단계 진행
   - backend/와 frontend/가 이미 있으면 precheck 생략 가능

1. backend/ 폴더 존재 체크
   - 없음 → skills/init-backend.md 실행 (Spring Boot + JPA + H2 셋팅)
   - 있음 → 스킵

2. frontend/ 폴더 존재 체크
   - 없음 → skills/init-frontend.md 실행 (React + Vite + 공통 레이아웃 셋팅)
   - 있음 → 스킵

3. 명세의 기능 구현
   - skills/crud-page.md 레시피대로 실행
   - 순서: Entity → Repository → DTO → Service → Controller → Frontend 순

4. 검증
   - backend: ./gradlew build
   - frontend: npx tsc -b && npx vite build
   - 하네스 규칙 위반 여부 체크

5. 검증 실패 시 수정 → 하네스 규칙 피드백
   - 빌드 오류 또는 규칙 위반 발견 시:
     a. 원인 분석 후 코드 수정
     b. 수정한 패턴이 **반복 가능한 문제**인지 판단
     c. 반복 가능하면 → 해당 harness/ 규칙 파일에 항목 추가
        (예: coding.md에 컨벤션 추가, architecture.md에 레이어 규칙 추가)
     d. skills/lessons-learned.md에 발생 원인과 해결책 기록
     e. 4번 검증 재실행 → 통과할 때까지 반복
   - 검증 통과 시 → 다음 단계 진행

6. harness/schema.md 업데이트
   - 새로 생성된 테이블 구조를 schema.md에 추가
   - 테이블 관계도 갱신

7. 완료 보고
   - 생성된 파일 목록
   - 실행 방법 (`cd backend && ./gradlew bootRun`, `cd frontend && npm run dev`)

8. 빌드 로그 생성 (필수)
   - skills/build-log.md 레시피대로 실행
   - log/ 폴더에 `{날짜}_{명세명}.md` 형식으로 저장
   - 마지막에 총 토큰 사용량과 전체 소요시간 출력
```

### 주의사항
- **초기 셋팅 단계에서는 하네스 규칙 파일들을 먼저 읽고** 규칙을 파악한 후 생성한다
- 프론트엔드 셋팅 시 **레이아웃 컴포넌트(Header, Footer)를 빠짐없이** 생성한다
- 백엔드 셋팅 시 **공통 클래스(ApiResponse, PageResponse)를** 먼저 생성한다
- 생성된 모든 파일은 **harness/ 규칙을 전부 준수**해야 한다
- **모바일 반응형**을 항상 고려한다

### 명세 없이 "프론트/백 셋팅만 해줘" 요청 시
- 각각 skills/init-frontend.md, skills/init-backend.md 실행
- 기능은 빈 상태로 유지

### "초기화 해줘" / "리셋 해줘" 요청 시
- skills/reset-project.md 실행
- frontend/, backend/, data/ 삭제 (하네스 MD는 보존)
- 삭제 전 반드시 사용자 확인 받기
