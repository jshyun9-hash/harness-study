# Harness Studio

고객 요구사항을 입력하면 일관된 품질의 화면/기능을 생성하는 **하네스 엔지니어링** 스터디 프로젝트.

## 컨셉

```
고객 요구사항(텍스트) → TypeScript 타입 자동 생성 → 타입 편집 → 하네스 MD 문서 출력
```

하네스 MD 문서를 기반으로 동일한 품질의 React 페이지를 찍어낼 수 있도록 하는 것이 목표.

## 기술 스택

- **React 19** + **TypeScript 6**
- **Vite 8** (빌드/개발 서버)
- **Tailwind CSS 4** (이 도구 자체의 스타일링)

## 프로젝트 구조

```
src/
├── App.tsx                 # 메인 UI (3단계: 입력 → 편집 → 결과)
├── types.ts                # FieldDefinition, UIFramework 타입 및 옵션 상수
├── parseRequirement.ts     # 요구사항 텍스트 → 타입/필드 자동 추론 (키워드 기반)
├── generateHarnessMd.ts    # 하네스 MD 문서 생성 (린트 하네스 포함)
└── main.tsx                # 엔트리포인트
```

## 주요 명령어

```bash
npm run dev      # 개발 서버 실행
npm run build    # 타입 체크 + 프로덕션 빌드
npm run lint     # ESLint 실행
npm run preview  # 빌드 결과 미리보기
```

## 앱 동작 흐름

### Step 1. 요구사항 입력
- 관리자가 고객 요구사항을 텍스트로 입력
- 키워드 인식: "조회수" → `views: number`, "태그" → `tags: string[]`, "공지" → 타입명 `Notice` 등

### Step 2. 타입 편집 + 설정 선택
- 자동 생성된 TypeScript 타입의 라벨/타입을 수정 가능
- 필드 추가/삭제 가능
- UI 프레임워크 선택: Tailwind / shadcn / MUI / Ant Design / Chakra UI
- 프레임워크는 React 고정

### Step 3. 하네스 MD 문서 출력
- 요구사항, 기술 스택, 타입 정의, 페이지 구성, 컴포넌트 구조 포함
- **린트 하네스 (ESLint + Prettier + TS strict)는 항상 포함**
- 클립보드 복사 지원

## 규칙

- 생성되는 하네스 MD 문서에는 린트 관련 하네스가 **반드시** 포함되어야 함
- 프레임워크 선택지는 React만 제공 (Vue 제외)
- UI 프레임워크 옵션: Tailwind CSS, shadcn/ui, MUI, Ant Design, Chakra UI
