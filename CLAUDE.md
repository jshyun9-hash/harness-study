# Harness Study

하네스 엔지니어링을 학습하고 실전 적용하는 프로젝트.

## 컨셉

하네스 규칙(MD 파일)을 정의해두면, 어떤 기능 명세가 들어와도 **동일한 품질**의 풀스택 코드가 생성되는 구조.

```
spec-tool에서 명세 작성 → 채팅창에 전달 → harness 규칙 기반 back/front 자동 구현
```

## 프로젝트 구조

```
harness-study/
├── studio/                    # 핵심: 하네스 기반 풀스택 코드 생성
│   ├── CLAUDE.md              # studio 워크플로우 규칙 (여기가 메인)
│   ├── harness/               # 8개 하네스 규칙 파일
│   ├── skills/                # 7개 생성 레시피
│   ├── spec-tool/             # 명세 생성 UI (React + Gemini API)
│   ├── frontend/              # (생성됨) React 프론트엔드
│   └── backend/               # (생성됨) Spring Boot 백엔드
└── study/                     # 교육용: 하네스 4기둥 개념 학습
```

## 핵심 흐름 (studio)

1. **spec-tool**에서 기능 명세 작성 (또는 직접 MD 작성)
2. 채팅창에 명세를 붙여넣기
3. `studio/CLAUDE.md`의 자동 흐름 실행:
   - backend/ 없으면 → 초기 셋팅
   - frontend/ 없으면 → 초기 셋팅
   - crud-page 레시피로 기능 구현
   - 빌드 검증 + schema 업데이트

## 작업 시 주의

- **studio 작업 시**: `studio/CLAUDE.md`를 반드시 먼저 읽을 것
- **harness 규칙**: 생성되는 모든 코드는 `studio/harness/` 규칙을 준수
- **study 폴더**: 교육/학습 목적, studio와 독립적
