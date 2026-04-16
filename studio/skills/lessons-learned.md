# 셋팅 경험 기록 (Lessons Learned)

> 실제 프로젝트를 처음 생성하며 겪은 문제와 보완 사항.
> 다음번 셋팅 시 같은 실수를 반복하지 않기 위해 기록한다.

## 1. 사전 환경 체크 누락

### 문제
`./gradlew build` 실행 시 `JAVA_HOME is not set` 오류 발생.
Java 17 설치 여부를 먼저 확인하지 않았음.

### 해결
**skills/precheck.md 스킬 생성** — 셋팅 전 반드시 실행.
- Java 17+, Node 18+, npm, curl, unzip 체크
- 하나라도 없으면 **즉시 중단** + 설치 안내
- 사용자가 "일단 진행해줘" 해도 거부

### 반영 위치
- skills/precheck.md 신규 작성
- CLAUDE.md 자동 흐름 0단계로 삽입

---

## 2. Spring Boot 버전

### 문제
`start.spring.io`에서 `bootVersion=3.3.5` 요청 시
`Spring Boot compatibility range is >=3.5.0` 에러.

### 해결
- Spring Initializr는 **현재 지원 중인 버전만 허용**한다
- 버전을 하드코딩하지 말고, 최신 GA 버전을 조회하거나 안전 범위(3.5.x)를 사용
- `bootVersion` 파라미터를 생략하면 서버가 기본값을 준다 (가장 안전)

### 반영 위치
skills/init-backend.md에 Spring Initializr API 사용 예시 업데이트

---

## 3. Vite 프로젝트 기본 파일 정리

### 문제
`npm create vite@latest` 로 생성 시
`src/assets/`, `src/App.css`, `public/vite.svg` 같은 **데모 파일들**이 함께 생성됨.
이것들이 하네스 구조에 맞지 않아 수작업 삭제 필요.

### 해결
init-frontend 진행 순서:
1. `npm create vite@latest frontend -- --template react-ts`
2. **바로 다음에** 아래 파일들 삭제:
   ```bash
   rm -rf src/assets src/App.css public
   rm -f src/App.tsx  # 새로 덮어쓸 예정
   ```
3. `package.json`의 불필요한 import(`./App.css` 등) 제거

### 반영 위치
skills/init-frontend.md **"데모 파일 정리"** 단계 추가

---

## 4. TypeScript 제네릭 제약

### 문제
`DataTable<T extends Record<string, unknown>>` 로 제약했더니
`Notice` 같은 구체 인터페이스가 이 제약을 만족하지 못함
(TypeScript는 interface를 index signature와 호환으로 보지 않음).

### 해결
- 컨테이너 컴포넌트의 제네릭 제약은 **되도록 느슨하게** 사용
  - `<T>` (제약 없음) 또는 `<T extends object>` 권장
- 내부에서 `keyof T` 필요 시 `string` 키 접근은 `as unknown as Record<string, unknown>` 캐스팅

### 반영 위치
harness/components.md **"제네릭 제약 주의"** 노트 추가

---

## 5. Spring Boot 기본 파일 교체

### 문제
Spring Initializr가 자동으로 `src/main/resources/application.properties`를 만들어주는데,
하네스는 `application.yml`을 사용한다. 중복 파일 존재 시 동작 예측 불가.

### 해결
init-backend 시:
1. 스캐폴딩 직후 `application.properties` 삭제
2. `application.yml` 로 새로 작성

### 반영 위치
skills/init-backend.md 파일 교체 순서 명시

---

## 6. GlobalExceptionHandler 누락

### 문제
init-backend.md에 공통 클래스로 `ApiResponse`, `PageResponse`만 명시되어 있었지만,
실제로는 `GlobalExceptionHandler`도 필수.
없으면 유효성 검증 실패(`MethodArgumentNotValidException`)가
ApiResponse 포맷으로 래핑되지 않아 프론트가 파싱 실패.

### 해결
init-backend.md에 `GlobalExceptionHandler` 파일 생성 추가.
- `IllegalArgumentException` → 400 + 메시지
- `MethodArgumentNotValidException` → 400 + 첫 번째 필드 에러
- `Exception` → 500

### 반영 위치
skills/init-backend.md `global/config/GlobalExceptionHandler.java` 섹션 추가

---

## 7. 프론트/백엔드 포트 + 프록시

### 주의점
- 프론트: 5175
- 백엔드: 8080
- 프론트 `vite.config.ts`에 `proxy: { '/api': 'http://localhost:8080' }` **필수**
- 백엔드 CORS는 `http://localhost:5175` 허용 **필수**

### IPv6 프록시 오류 (localhost → ::1)
- `localhost`가 IPv6(`::1`)로 resolve되면 백엔드(IPv4만 listen)에 연결 실패
- 에러: `connect ECONNREFUSED ::1:8080`
- **해결**: proxy target을 `http://127.0.0.1:8080`으로 명시
  ```ts
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:8080',
    },
  }
  ```

### 반영 위치
harness/architecture.md 포트 매핑 표 추가 고려

---

## 8. H2 DB 경로

### 주의점
- 파일 경로: `jdbc:h2:file:../data/studiodb;AUTO_SERVER=TRUE`
- `backend/`에서 상대 경로라 실제 위치는 `studio/data/studiodb.mv.db`
- `AUTO_SERVER=TRUE` 없으면 **H2 콘솔과 앱이 동시에 접근 불가**

### 반영 위치
harness/stack.md 이미 포함되어 있음 (확인 완료)

---

## 9. 검증 단계 순서

### 문제
빌드 검증 순서를 명확히 안 했더니 한 번에 다 실행하려다 실패 피드백이 섞임.

### 권장 순서
1. 프론트 `npx tsc -b` (타입만)
2. 프론트 `npx vite build` (번들)
3. 백엔드 `./gradlew build -x test` (테스트 제외)
4. 실행 테스트 (수동)

### 반영 위치
skills/crud-page.md **"검증 순서"** 명시

---

## 11. Spring Initializr 기본값 vs 하네스 고정 버전

### 문제
Spring Initializr는 **현재 최신 GA**(예: Boot 4.0.5 + Gradle 9.4.1)를 기본값으로 내려줌.
하지만 하네스 `init-backend.md`는 Spring Boot **3.3.0** 고정 → Gradle 9.x와 비호환.
스캐폴딩 직후 `./gradlew build` 실행 시 플러그인 호환성 에러 발생.

### 해결
스캐폴딩 후 **Gradle Wrapper를 8.8로 다운그레이드**한다.
`backend/gradle/wrapper/gradle-wrapper.properties`의 `distributionUrl`을
`gradle-8.8-bin.zip`로 수정 후 빌드.

또는 `build.gradle.kts`의 Spring Boot 버전을 최신(4.0.x)로 올리고 Java 버전도 맞춰 올리는 대안도 있음.
하네스 정책(Spring Boot 3.x)을 유지하려면 Gradle 8.x 고정이 정답.

### 반영 위치
skills/init-backend.md에 Gradle 8.8 강제 단계 추가 고려

---

## 10. 필요한 공통 컴포넌트 범위

### 확인된 사실
CRUD 페이지 하나(Notice) 만드는데 아래가 **전부 필요**:
- Input, Textarea, Select, Checkbox, Radio, Label
- Button (variant: primary / secondary / danger / ghost)
- FormField, FormContainer (validation)
- SearchBar
- DataTable, Pagination
- Dialog, DialogProvider, useDialog

→ `init-frontend` 시 **전부 한 번에** 생성해야 함.
하나라도 빠지면 CRUD 만들 때 다시 돌아가야 함.

### 반영 위치
skills/init-frontend.md **"공통 컴포넌트 체크리스트"** 명시
