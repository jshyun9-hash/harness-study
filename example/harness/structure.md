# 폴더 구조 규칙

## 전체 구조

```
example/
├── frontend/                    # React 프론트엔드
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/         # Header + Footer 레이아웃
│   │   │   │   ├── Layout.tsx       # Header + Content + Footer 컨테이너
│   │   │   │   ├── Header.tsx       # 상단 네비게이션 (반응형 햄버거 메뉴)
│   │   │   │   └── Footer.tsx       # 하단 사이트 정보
│   │   │   └── {기능명}/       # 기능별 컴포넌트
│   │   │       ├── {기능명}Card.tsx
│   │   │       └── {기능명}Form.tsx
│   │   ├── pages/              # 페이지 컴포넌트
│   │   │   └── {기능명}/
│   │   │       ├── {기능명}ListPage.tsx
│   │   │       ├── {기능명}DetailPage.tsx
│   │   │       └── {기능명}FormPage.tsx
│   │   ├── hooks/              # 커스텀 훅
│   │   │   └── use{기능명}.ts
│   │   ├── types/              # TypeScript 타입
│   │   │   └── {기능명}.ts
│   │   ├── api/                # API 호출 함수
│   │   │   └── {기능명}Api.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                     # Spring Boot 백엔드
│   └── src/main/
│       ├── java/com/harness/example/
│       │   ├── HarnessExampleApplication.java
│       │   ├── domain/
│       │   │   └── {기능명}/
│       │   │       ├── entity/{기능명}.java
│       │   │       ├── repository/{기능명}Repository.java
│       │   │       ├── controller/{기능명}Controller.java
│       │   │       ├── service/{기능명}Service.java
│       │   │       └── dto/
│       │   │           ├── {기능명}Request.java
│       │   │           ├── {기능명}Response.java
│       │   │           └── {기능명}SearchCondition.java
│       │   └── global/
│       │       └── common/
│       │           ├── ApiResponse.java
│       │           └── PageResponse.java
│       └── resources/
│           └── application.yml
│
└── data/                        # H2 파일 DB 저장소 (자동 생성)
    └── exampledb.mv.db
```

## 레이아웃 구조 (studio와 다른 점)

studio는 **사이드바 + 토픽바** 어드민 레이아웃이지만,
example은 **Header + Content + Footer** 사용자 웹사이트 레이아웃이다.

```
┌─────────────────────────────────────────────────────┐
│  Header (h-16, 고정)                                 │
│  ┌──────────┬──────────────────────┬──────────┐     │
│  │  로고     │  메뉴1  메뉴2  메뉴3 │  액션    │     │
│  └──────────┴──────────────────────┴──────────┘     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Content (flex-1, max-w-6xl mx-auto)                │
│  ┌─────────────────────────────────────────────┐   │
│  │                                             │   │
│  │     페이지 컨텐츠 (가운데 정렬)               │   │
│  │                                             │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
├─────────────────────────────────────────────────────┤
│  Footer (사이트 정보, 카피라이트)                      │
│  ┌─────────────────────────────────────────────┐   │
│  │  © 2026 Example  |  이용약관  |  개인정보    │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

### 모바일 (< 768px)

```
┌──────────────────────┐
│  로고     ☰ (햄버거)  │  ← Header
├──────────────────────┤
│  메뉴1               │  ← 모바일 메뉴 (펼침 시)
│  메뉴2               │
│  메뉴3               │
├──────────────────────┤
│                      │
│  페이지 컨텐츠        │  ← Content (px-4)
│  (풀 너비)            │
│                      │
├──────────────────────┤
│  © 2026 Example      │  ← Footer (세로 쌓임)
│  이용약관 | 개인정보   │
└──────────────────────┘
```

## 네이밍 규칙

### 프론트엔드
| 대상 | 규칙 | 예시 |
|------|------|------|
| 페이지 | {기능명}{역할}Page.tsx | NoticeListPage.tsx |
| 컴포넌트 | {기능명}{역할}.tsx | NoticeCard.tsx |
| 훅 | use{기능명}.ts | useNotice.ts |
| API | {기능명}Api.ts | noticeApi.ts |
| 타입 | {기능명}.ts | Notice.ts |

### 백엔드
| 대상 | 규칙 | 예시 |
|------|------|------|
| Entity | {기능명}.java | Notice.java |
| Repository | {기능명}Repository.java | NoticeRepository.java |
| Controller | {기능명}Controller.java | NoticeController.java |
| Service | {기능명}Service.java | NoticeService.java |
| DTO | {기능명}Request/Response.java | NoticeRequest.java |

### DB (JPA 자동 생성)
| 대상 | 규칙 | 예시 |
|------|------|------|
| 테이블명 | snake_case (@Table) | notice |
| 컬럼명 | snake_case (@Column) | created_at |
| PK | {테이블}_id | notice_id |
