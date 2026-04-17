# 프로젝트 초기화 스킬

## 트리거
사용자가 "{projectId} 초기화 해줘", "리셋 해줘" 등 요청 시.

projectId 가 명시되지 않으면 **반드시 사용자에게 물어본 후** 진행.

## 삭제 대상
- `example/projects/{projectId}/` **전체**
  - backend/
  - frontend/
  - data/
  - schema.md

## 보존 대상 (절대 삭제 금지)
- `example/CLAUDE.md`
- `example/harness/*.md`
- `example/skills/*.md`
- `example/spec-requests/{projectId}/` — 요구사항 원문 (버전별)
- `example/specs/{projectId}/` — YML 명세 (버전별) + log.md
- `example/log/` — 빌드 로그 (이력 보존)
- `example/projects/` 아래 **다른 projectId 폴더들** — 이 리셋은 단일 프로젝트 단위

## 실행 순서

1. 삭제 대상 폴더 존재 체크
   - `projects/{projectId}/` 없으면 "이미 초기화되어 있다" 안내 후 종료
2. **사용자 확인 받기** (삭제 전 반드시)
   - 어느 프로젝트인지, 어떤 파일들이 지워지는지 명시
3. 삭제 실행:
   ```bash
   rm -rf example/projects/{projectId}
   ```
4. 결과 보고:
   - 지워진 경로
   - 보존된 경로 (spec-requests, specs, log)
   - 재생성 방법 안내 ("specs/{id}/ 의 최신 YML로 다시 만들 수 있습니다")

## 주의사항
- **다른 프로젝트에 영향 없음** — `projects/{projectId}/` 만 지우면 다른 프로젝트 DB/코드는 그대로
- YML과 log는 보존되므로 동일 projectId 로 재생성 시 이전 명세/이력을 이어서 쓸 수 있다
