# Harness Study

**하네스 엔지니어링** 스터디 프로젝트.
하네스(규칙 문서)를 기반으로 일관된 품질의 풀스택 코드를 반복 생산하는 방법론을 연구한다.

---

## 프로젝트 구성

```
harness-study/
├── example/          # 사용자용 웹사이트 생성 프로젝트 (Header + Content + Footer)
├── studio/           # 관리자용 어드민 생성 프로젝트 (사이드바 레이아웃)
│   ├── spec-tool/    #   명세 생성 도구 (React + Vite)
│   └── harness/      #   어드민용 하네스 규칙
└── CLAUDE.md         # 프로젝트 공통 설정
```

### [example/](example/) — 사용자용 웹사이트

고객 요구사항을 받아 하네스 규칙에 맞는 **사용자용 반응형 웹사이트**를 생성한다.

- **레이아웃**: Header + Content + Footer
- **스택**: React 19 + TypeScript + Tailwind CSS + Vite / Spring Boot 3 + Java 17 + JPA + H2
- **파이프라인**: 요구사항 수집 → `spec-requests/` → `specs/*.yml` → 코드 생성 → `log/`

### [studio/](studio/) — 관리자용 어드민

하네스 규칙에 맞는 **관리자용 어드민 시스템**을 생성한다.

- **레이아웃**: 사이드바 + 컨텐츠
- **스택**: React 19 + TypeScript + Tailwind CSS + Vite / Spring Boot 3 + Java 17 + JPA + H2
- **특징**: 공통 컴포넌트(Input, Button, DataTable, Dialog 등) 기반, Navy + Gold 테마

### [studio/spec-tool/](studio/spec-tool/) — 명세 생성 도구

요구사항 텍스트를 입력하면 하네스 규칙에 맞는 YML 명세를 생성하는 웹 도구.

---

## 핵심 워크플로우

```
1. FDE가 현업 담당자에게 요구사항 수집
2. spec-requests/ 에 요구사항 원문 작성 (MD)
3. Claude와 대화하며 specs/ 에 구조화된 명세 생성 (YML)
4. YML 명세 기반으로 백엔드 → 프론트엔드 코드 자동 생성
5. 빌드 검증 후 log/ 에 빌드 로그 기록
```

---

## 하네스란?

코드 생성 시 반드시 준수해야 하는 **규칙 문서** 모음.
기술 스택, 폴더 구조, 코딩 컨벤션, 아키텍처, 스타일 가이드, 네이밍, UX 패턴 등을 정의한다.
동일한 하네스를 적용하면 누가 만들어도 일관된 품질의 결과물이 나온다.

## 스킬이란?

코드 생성·관리를 위한 **실행 레시피**.
환경 체크, 초기 셋팅, CRUD 생성, 프로젝트 초기화 등 반복 작업을 단계별로 정의한다.
