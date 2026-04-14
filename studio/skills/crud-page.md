# CRUD 페이지 풀스택 생성

## 입력
- 기능명: {기능명} (예: Notice, Product, User)
- 필드 목록: {fields}
- 설명: {description}

## 생성 순서

### Phase 1: 백엔드
1. `domain/{기능명}/entity/{기능명}.java` — JPA Entity
2. `domain/{기능명}/repository/{기능명}Repository.java` — JpaRepository
3. `domain/{기능명}/dto/{기능명}Request.java` — 요청 DTO
4. `domain/{기능명}/dto/{기능명}Response.java` — 응답 DTO
5. `domain/{기능명}/dto/{기능명}SearchCondition.java` — 검색 조건
6. `domain/{기능명}/service/{기능명}Service.java` — 비즈니스 로직
7. `domain/{기능명}/controller/{기능명}Controller.java` — REST API

### Phase 2: 프론트엔드
8. `types/{기능명}.ts` — TypeScript 타입
9. `api/{기능명}Api.ts` — API 호출 함수
10. `hooks/use{기능명}.ts` — 커스텀 훅
11. `components/{기능명}/{기능명}Table.tsx` — 테이블
12. `components/{기능명}/{기능명}Form.tsx` — 폼
13. `pages/{기능명}/{기능명}ListPage.tsx` — 목록 페이지
14. `pages/{기능명}/{기능명}DetailPage.tsx` — 상세 페이지
15. `pages/{기능명}/{기능명}FormPage.tsx` — 작성/수정 페이지

## 각 파일 생성 시 참조
- harness/structure.md → 파일 위치, 네이밍
- harness/coding.md → 코딩 규칙 (프론트 + 백엔드)
- harness/architecture.md → 레이어 경계, API 표준
- harness/ux.md → 로딩/빈상태/에러 처리

## 검증 체크리스트
- [ ] 백엔드: Entity에 @Table, @Column snake_case 매핑 됨
- [ ] 백엔드: Repository가 JpaRepository 상속
- [ ] 백엔드: API 응답이 ApiResponse<T> 로 래핑됨
- [ ] 백엔드: Controller에 비즈니스 로직 없음
- [ ] 백엔드: Service에 @Transactional 적용됨
- [ ] 프론트: tsc --noEmit 통과
- [ ] 프론트: eslint 통과
- [ ] 프론트: 로딩/에러/빈상태 처리 있음
- [ ] 프론트: api/ 레이어에서만 fetch 호출
