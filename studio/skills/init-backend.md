# Backend 초기 셋팅 스킬

## 트리거
- `studio/backend/` 폴더가 **없을 때** 자동 실행
- 또는 사용자가 "백엔드 셋팅 해줘" 요청 시

## 목적
Spring Boot + JPA + H2 기반 백엔드 프로젝트를 초기화한다.

## 기술 스택
harness/stack.md 참조:
- Spring Boot 3.x + Java 17
- JPA (Hibernate)
- H2 파일 모드 (영구 저장)
- Gradle (Kotlin DSL)
- 포트: 8080

## 강제 규칙 (반드시 준수)

### 빌드 도구
- **Gradle (Kotlin DSL) 만 사용** — `build.gradle.kts`
- Maven (pom.xml) 사용 **금지**
- Gradle Groovy DSL (`build.gradle`) **금지**
- Spring Initializr 호출 시 `type=gradle-project-kotlin`

### 설정 파일
- 모든 설정은 **YAML(.yml)** 로 작성
- `application.properties` 사용 **금지**
- Spring Initializr가 자동 생성한 `application.properties`는
  **즉시 삭제 후 `application.yml`로 교체**

## 사전 체크
- `java --version` → Java 17 이상 설치 확인
- 없으면 사용자에게 Java 17 설치 안내 (Temurin 권장)

## 생성 순서

### 1. Spring Initializr로 스캐폴딩 (권장)

```bash
cd studio
curl -s -o backend.zip "https://start.spring.io/starter.zip?\
dependencies=web,data-jpa,validation,h2,lombok&\
type=gradle-project-kotlin&\
language=java&\
javaVersion=17&\
groupId=com.harness&\
artifactId=backend&\
name=harness-studio-backend&\
packageName=com.harness.studio"
unzip -q backend.zip -d backend
rm backend.zip
```

> `bootVersion` 파라미터는 생략 (서버 기본값 사용 — 호환성 문제 방지)
> `type=gradle-project-kotlin` 고정 (Maven / Groovy Gradle 금지)

### 2. 스캐폴딩 직후 정리
```bash
# application.properties → application.yml 교체
rm backend/src/main/resources/application.properties
# 아래 단계에서 application.yml 작성
```

### 3. 최종 프로젝트 구조
```
backend/
├── build.gradle.kts
├── settings.gradle.kts
├── gradle/
├── gradlew
├── gradlew.bat
└── src/main/
    ├── java/com/harness/studio/
    │   ├── HarnessStudioApplication.java
    │   ├── domain/                    # 기능별 도메인 (비어있음)
    │   └── global/
    │       └── common/
    │           ├── ApiResponse.java
    │           └── PageResponse.java
    └── resources/
        └── application.yml
```

### 2. build.gradle.kts
```kotlin
plugins {
    java
    id("org.springframework.boot") version "3.3.0"
    id("io.spring.dependency-management") version "1.1.5"
}

group = "com.harness"
version = "0.0.1-SNAPSHOT"

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(17)
    }
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-validation")

    compileOnly("org.projectlombok:lombok")
    annotationProcessor("org.projectlombok:lombok")

    runtimeOnly("com.h2database:h2")

    testImplementation("org.springframework.boot:spring-boot-starter-test")
}

tasks.withType<Test> {
    useJUnitPlatform()
}
```

### 3. settings.gradle.kts
```kotlin
rootProject.name = "harness-studio-backend"
```

### 4. application.yml
```yaml
spring:
  application:
    name: harness-studio

  datasource:
    url: jdbc:h2:file:../data/studiodb;AUTO_SERVER=TRUE
    driver-class-name: org.h2.Driver
    username: sa
    password:

  h2:
    console:
      enabled: true
      path: /h2-console

  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        format_sql: true
        dialect: org.hibernate.dialect.H2Dialect

server:
  port: 8080

logging:
  level:
    org.hibernate.SQL: DEBUG
    org.hibernate.orm.jdbc.bind: TRACE
```

> 데이터 파일은 `studio/data/studiodb.mv.db`에 저장됨

### 5. HarnessStudioApplication.java
```java
package com.harness.studio;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class HarnessStudioApplication {
    public static void main(String[] args) {
        SpringApplication.run(HarnessStudioApplication.class, args);
    }
}
```

### 6. 공통 클래스

#### global/common/ApiResponse.java
```java
package com.harness.studio.global.common;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class ApiResponse<T> {
    private final boolean success;
    private final T data;
    private final String message;

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, data, null);
    }

    public static ApiResponse<Void> success() {
        return new ApiResponse<>(true, null, null);
    }

    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, null, message);
    }
}
```

#### global/common/PageResponse.java
```java
package com.harness.studio.global.common;

import java.util.List;
import lombok.Builder;
import lombok.Getter;
import org.springframework.data.domain.Page;

@Getter
@Builder
public class PageResponse<T> {
    private final List<T> items;
    private final long totalCount;
    private final int page;
    private final int size;

    public static <T> PageResponse<T> from(Page<T> page) {
        return PageResponse.<T>builder()
                .items(page.getContent())
                .totalCount(page.getTotalElements())
                .page(page.getNumber() + 1)
                .size(page.getSize())
                .build();
    }
}
```

### 7. CORS 설정 (필요 시)
프론트와 백 포트가 다르므로 개발 중 CORS 허용:

#### global/config/CorsConfig.java
```java
package com.harness.studio.global.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("http://localhost:5175")
                        .allowedMethods("*");
            }
        };
    }
}
```

### 8. 검증
```bash
cd backend
./gradlew build
```

빌드 통과하면 셋팅 완료.

## 실행
```bash
cd backend
./gradlew bootRun
# → http://localhost:8080
# → H2 콘솔: http://localhost:8080/h2-console
```

## 주의사항
- H2 datasource URL에 `AUTO_SERVER=TRUE` 붙여 여러 프로세스(콘솔 + 앱) 동시 접근 허용
- 데이터 파일은 `studio/data/`에 저장 → studio-reset 시 함께 삭제됨
