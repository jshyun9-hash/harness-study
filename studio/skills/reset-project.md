# 프로젝트 초기화 스킬

## 트리거
사용자가 아래와 같이 요청할 때 실행한다.
- "studio 초기화 해줘"
- "프로젝트 초기화 해줘"
- "전부 지워줘"
- "리셋 해줘"

## 목적
생성된 코드(frontend/, backend/, data/)를 전부 삭제하고
하네스 MD 파일만 남아있는 초기 상태로 되돌린다.

## 삭제 대상
- `studio/frontend/` — React 프로젝트
- `studio/backend/` — Spring Boot 프로젝트
- `studio/data/` — H2 DB 파일
- `studio/harness/schema.md` — 테이블 목록/관계도 내용을 초기 템플릿으로 되돌림

## 보존 대상 (절대 삭제 금지)
- `studio/CLAUDE.md`
- `studio/harness/*.md`
- `studio/skills/*.md`
- `studio/reset.sh`
- `studio/.gitignore`

## 실행 순서

1. **확인**: 삭제 대상 폴더가 실제로 존재하는지 체크
2. **사용자 확인**: 삭제 전 반드시 "정말 초기화하시겠습니까?" 확인 받기
3. **삭제 실행**:
   ```bash
   rm -rf studio/frontend studio/backend studio/data
   ```
   또는 프로세스가 파일을 잡고 있다면 먼저 dev 서버 종료 안내
4. **schema.md 초기화**: 테이블 목록/관계도를 빈 템플릿으로 되돌림
   ```markdown
   # DB 스키마 현황

   > 이 파일은 현재 프로젝트의 DB 테이블 구조를 기록한다.
   > 기능이 추가/수정될 때마다 이 파일을 업데이트한다.
   > AI 추론 시 이 파일을 참조하여 기존 테이블과의 관계를 파악한다.

   ## 테이블 목록

   (없음)

   ## 테이블 관계도

   (없음)
   ```
5. **결과 보고**: 삭제된 폴더 목록 + 남은 파일 확인

## 주의사항
- dev 서버(npm run dev, gradle bootRun)가 실행 중이면 파일 잠김 발생 가능
  → 사용자에게 서버 종료 후 재시도 안내
- 삭제는 **되돌릴 수 없음** → 반드시 확인 받기
- harness/, skills/ 폴더는 **어떤 경우에도 삭제하지 않음**

## 관련 대안
- 사용자가 PowerShell에서 직접 `studio-reset` 실행 가능 (동일 동작)
- 사용자가 bash에서 `bash studio/reset.sh` 실행 가능
