# 사전 환경 체크 스킬

## 트리거
**프로젝트 셋팅 스킬(init-frontend, init-backend)을 실행하기 전 반드시 먼저 실행.**

## 목적
셋팅에 필요한 필수 프로그램이 설치되어 있는지 확인한다.
하나라도 빠져 있으면 **셋팅을 중단**하고 사용자에게 설치를 안내한다.

## 필수 프로그램

| 프로그램 | 최소 버전 | 확인 명령 | 용도 |
|---------|----------|---------|------|
| **Java** | 17 | `java --version` | Spring Boot 빌드/실행 |
| **Node.js** | 18 | `node --version` | Vite, React 빌드 |
| **npm** | 9 | `npm --version` | 패키지 설치 (Node와 함께 설치됨) |
| **curl** | - | `curl --version` | Spring Initializr 다운로드 |
| **unzip** | - | `unzip -v` | zip 압축 해제 |

> `bash`는 Windows에서는 Git Bash로 사용 — Claude Code가 내부적으로 사용하므로 이미 보장됨.
> `gradle`은 gradlew(Gradle Wrapper) 사용하므로 별도 설치 불필요.

## 체크 순서

1. 모든 필수 프로그램을 순서대로 `--version` 실행
2. 하나라도 실패하면:
   - **즉시 중단**
   - 누락된 프로그램 목록과 설치 링크 안내
   - 사용자가 설치 확인 후 다시 요청할 때까지 대기
3. 모두 통과하면 → 다음 스킬 진행

## 설치 안내 메시지 템플릿

체크 실패 시 사용자에게 아래 형식으로 안내한다:

```
다음 프로그램이 필요합니다:

❌ Java 17+ 미설치
   설치: https://adoptium.net/ (Temurin 17 LTS 권장)
   Windows: winget install EclipseAdoptium.Temurin.17.JDK
   macOS: brew install --cask temurin17

❌ Node.js 18+ 미설치
   설치: https://nodejs.org/ (LTS 버전 권장)
   Windows: winget install OpenJS.NodeJS.LTS
   macOS: brew install node

설치 후 새 터미널을 열고 다시 요청해주세요.
```

## 버전 호환성 체크

설치는 되어 있지만 버전이 낮은 경우도 실패로 처리:

```
⚠ Java 11 감지 (17 이상 필요)
→ 17 이상 설치 후 JAVA_HOME 업데이트 필요
```

## 체크 스크립트 예시

```bash
# 1. Java
if ! command -v java &> /dev/null; then
    echo "❌ Java 미설치"
    exit 1
fi
JAVA_VERSION=$(java -version 2>&1 | head -n 1 | awk -F'"' '{print $2}' | awk -F'.' '{print $1}')
if [ "$JAVA_VERSION" -lt 17 ]; then
    echo "❌ Java $JAVA_VERSION 감지 (17 이상 필요)"
    exit 1
fi

# 2. Node
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 미설치"
    exit 1
fi
NODE_VERSION=$(node --version | sed 's/v//' | awk -F'.' '{print $1}')
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js $NODE_VERSION 감지 (18 이상 필요)"
    exit 1
fi

# 3. 나머지
command -v npm &> /dev/null || { echo "❌ npm 미설치"; exit 1; }
command -v curl &> /dev/null || { echo "❌ curl 미설치"; exit 1; }
command -v unzip &> /dev/null || { echo "❌ unzip 미설치"; exit 1; }

echo "✅ 모든 사전 환경 체크 통과"
```

## 주의사항
- **체크를 건너뛰지 않는다** — 한 번 실패하면 나중에 더 큰 문제로 이어짐
- 셋팅 도중 중단되면 부분 생성된 파일이 남아 지저분해짐
- 사용자가 "일단 진행해줘"라고 해도 **거부**하고 설치 먼저 안내
