# 프로젝트 초기화 스킬

## 트리거
사용자가 "example 초기화 해줘", "리셋 해줘" 등 요청 시

## 삭제 대상
- `example/frontend/`
- `example/backend/`
- `example/data/`
- `example/harness/schema.md` — 내용을 초기 템플릿으로 되돌림

## 보존 대상 (절대 삭제 금지)
- `example/CLAUDE.md`
- `example/harness/*.md` (schema.md는 내용만 초기화)
- `example/skills/*.md`
- `example/log/` — 빌드 로그 (이력 보존)
- `example/spec-requests/` — 고객 요구사항 원문
- `example/specs/` — YAML 명세

## 실행 순서

1. 삭제 대상 폴더 존재 체크
2. **사용자 확인 받기** (삭제 전 반드시)
3. 삭제 실행: `rm -rf example/frontend example/backend example/data`
4. schema.md 초기화
5. 결과 보고
