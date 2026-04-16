# Harness Studio 프로젝트

## 개요
하네스 엔지니어링 기반으로 일관된 품질의 풀스택 애플리케이션을 생성하는 프로젝트.
명세(MD)를 입력하면, 아래 하네스 규칙에 따라 백엔드 → 프론트엔드 코드를 생성한다.

## 기술 스택
- **프론트엔드**: React 19 + TypeScript + Tailwind CSS + Vite (포트 5175)
- **백엔드**: Spring Boot 3 + Java 17 + JPA (Hibernate) (포트 8080)
- **DB**: H2 (파일 모드, 영구 저장, `data/studiodb`)
- **빌드**: Gradle (backend), npm (frontend)

## 하네스 규칙 (아래 파일의 규칙을 반드시 따른다)
- harness/stack.md — 기술 스택 및 의존성 규칙
- harness/structure.md — 프론트/백엔드 폴더 구조
- harness/coding.md — 코딩 컨벤션 (프론트 + 백엔드)
- harness/architecture.md — 아키텍처 규칙, 레이어 경계
- harness/components.md — 공통 컴포넌트 (Input, Button, DataTable, Dialog, FormContainer 등)
- harness/style-guide.md — 스타일 가이드 (비즈니스 테마: Navy + Gold)
- harness/ux.md — UX 패턴 (로딩, 빈상태, 에러, 다이얼로그)
- harness/naming.md — 테이블/컬럼 명명 규칙 (snake_case, PK/FK/감사컬럼 등)
- harness/schema.md — DB 스키마 현황 (기능 생성 후 반드시 업데이트)

## 스킬 (생성/관리 레시피)
- skills/precheck.md — **사전 환경 체크 (셋팅 전 반드시 먼저 실행)**
- skills/init-dashboard.md — studio 관리 대시보드 셋팅
- skills/init-frontend.md — 프론트엔드 프로젝트 초기 셋팅
- skills/init-backend.md — 백엔드 프로젝트 초기 셋팅
- skills/crud-page.md — 기능별 CRUD 풀스택 생성
- skills/reset-project.md — 프로젝트 초기화 (frontend/backend/data 삭제)
- skills/lessons-learned.md — 이전 셋팅 경험 기록 (반드시 먼저 읽을 것)

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
   - 없음 → skills/init-frontend.md 실행 (React + Vite + 공통 컴포넌트 셋팅)
   - 있음 → 스킵

3. 명세의 기능 구현
   - skills/crud-page.md 레시피대로 실행
   - 순서: Entity → Repository → DTO → Service → Controller → Frontend 순

4. 검증
   - backend: ./gradlew build
   - frontend: npx tsc -b && npx vite build
   - 하네스 규칙 위반 여부 체크

5. harness/schema.md 업데이트
   - 새로 생성된 테이블 구조를 schema.md에 추가
   - 테이블 관계도 갱신

6. 완료 보고
   - 생성된 파일 목록
   - 실행 방법 (`cd backend && ./gradlew bootRun`, `cd frontend && npm run dev`)
```

### 주의사항
- **초기 셋팅 단계에서는 하네스 규칙 파일들을 먼저 읽고** 규칙을 파악한 후 생성한다
- 프론트엔드 셋팅 시 **공통 컴포넌트(harness/components.md)를 빠짐없이** 생성한다
- 백엔드 셋팅 시 **공통 클래스(ApiResponse, PageResponse)를** 먼저 생성한다
- 기능 구현 시 **공통 컴포넌트를 반드시 사용**한다 (직접 `<input>`, `<table>`, `<button>` 금지)
- 생성된 모든 파일은 **harness/ 규칙을 전부 준수**해야 한다

### "초기 셋팅 해줘" 요청 시
- skills/init-dashboard.md 실행 (studio/ 자체의 관리 UI 생성)
- 이건 명세 없이 studio 자체를 관리하는 대시보드

### 명세 없이 "프론트/백 셋팅만 해줘" 요청 시
- 각각 skills/init-frontend.md, skills/init-backend.md 실행
- 기능은 빈 상태로 유지

### "초기화 해줘" / "리셋 해줘" 요청 시
- skills/reset-project.md 실행
- frontend/, backend/, data/ 삭제 (하네스 MD는 보존)
- 삭제 전 반드시 사용자 확인 받기
