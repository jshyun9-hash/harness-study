# 폴더 구조 규칙

## 전체 구조

```
studio/
├── frontend/                    # React 프론트엔드
│   ├── src/
│   │   ├── pages/              # 페이지 컴포넌트
│   │   │   └── {기능명}/
│   │   │       ├── {기능명}ListPage.tsx
│   │   │       ├── {기능명}DetailPage.tsx
│   │   │       └── {기능명}FormPage.tsx
│   │   ├── components/         # 재사용 UI 컴포넌트
│   │   │   └── {기능명}/
│   │   │       ├── {기능명}Table.tsx
│   │   │       └── {기능명}Form.tsx
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
│       ├── java/com/harness/studio/
│       │   ├── HarnessStudioApplication.java
│       │   ├── domain/
│       │   │   └── {기능명}/
│       │   │       ├── entity/{기능명}.java             # JPA Entity
│       │   │       ├── repository/{기능명}Repository.java # JpaRepository
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
    └── studiodb.mv.db
```

## 네이밍 규칙

### 프론트엔드
| 대상 | 규칙 | 예시 |
|------|------|------|
| 페이지 | {기능명}{역할}Page.tsx | NoticeListPage.tsx |
| 컴포넌트 | {기능명}{역할}.tsx | NoticeTable.tsx |
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
| 테이블명 | snake_case (@Table) | notice_board |
| 컬럼명 | snake_case (@Column) | created_at |
| PK | {테이블}_id | notice_board_id |
