# 셋팅 경험 기록 (Lessons Learned)

> studio 프로젝트에서 얻은 교훈을 example에도 적용한다.
> 새로운 이슈 발생 시 이 파일에 추가한다.

## studio에서 가져온 교훈

1. **사전 환경 체크 필수** — Java/Node 미설치 시 빌드 실패
2. **Spring Boot 버전 고정 금지** — Initializr `bootVersion` 생략이 안전
3. **Vite 데모 파일 정리** — 스캐폴딩 직후 assets/App.css/public 삭제
4. **application.properties → yml 교체** — Initializr 기본 파일 즉시 삭제
5. **GlobalExceptionHandler 필수** — 없으면 프론트 파싱 실패
6. **프록시 target은 127.0.0.1** — localhost의 IPv6 문제 방지
7. **Gradle 8.x 고정** — Spring Boot 3.x는 Gradle 9와 비호환
8. **TypeScript 제네릭은 느슨하게** — `<T>` 또는 `<T extends object>` 권장

## example에서 발견한 교훈

9. **인증 보호 페이지에서 authLoading 체크 필수** — `useAuth()`의 `member`가 null인 이유가 "비로그인"인지 "세션 확인 중"인지 구분해야 함. `authLoading`이 끝나기 전에 `!member`로 리다이렉트하면 로그인 상태여도 로그인 페이지로 튕김.
   ```tsx
   // ❌ 잘못된 패턴
   useEffect(() => {
     if (!member) navigate('/login');
   }, [member]);

   // ✅ 올바른 패턴
   useEffect(() => {
     if (authLoading) return;          // 세션 확인 완료 대기
     if (!member) navigate('/login');   // 진짜 비로그인일 때만
   }, [member, authLoading]);
   ```

10. **모바일 메뉴는 풀스크린 서랍(Drawer) 패턴 사용** — Header 아래로 펼치는 드롭다운은 컨텐츠를 밀어내서 UX가 나쁨. 화면 전체를 덮는 서랍이 표준.
    - `fixed inset-0 w-full` 풀스크린 + `translate-x` 애니메이션
    - 서랍 열린 상태에서 `body overflow: hidden` (배경 스크롤 방지)
    - 페이지 이동 시(`location.pathname` 변경) 자동 닫힘
    - 회원정보/로그아웃은 메뉴 항목과 분리하여 하단 고정 (`flex-col` + `border-t`)

11. **네비게이션 현재 페이지 활성 표시 필수** — 메뉴에 활성 상태 스타일이 없으면 사용자가 현재 위치를 인지할 수 없음. `useLocation()`으로 현재 경로를 판단하고 활성 메뉴에 차별 스타일 적용.
    - 데스크톱: `text-indigo-600 border-b-2 border-indigo-600`
    - 모바일 서랍: `bg-indigo-50 text-indigo-600`
