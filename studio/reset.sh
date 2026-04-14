#!/bin/bash
# studio 프로젝트 초기화
# MD 파일(하네스/스킬)과 설정만 남기고 생성된 코드를 전부 삭제한다.
#
# 사용법: bash reset.sh

echo "=== Studio 프로젝트 초기화 ==="
echo ""

# 삭제 대상 확인
TARGETS=()
[ -d "frontend" ] && TARGETS+=("frontend/")
[ -d "backend" ] && TARGETS+=("backend/")
[ -d "data" ] && TARGETS+=("data/")

if [ ${#TARGETS[@]} -eq 0 ]; then
  echo "초기화할 대상이 없습니다. 이미 깨끗한 상태입니다."
  exit 0
fi

echo "삭제 대상:"
for t in "${TARGETS[@]}"; do
  echo "  - $t"
done
echo ""

read -p "정말 초기화하시겠습니까? (y/N) " confirm
if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
  echo "취소되었습니다."
  exit 0
fi

# 삭제 실행
for t in "${TARGETS[@]}"; do
  rm -rf "$t"
  echo "삭제 완료: $t"
done

echo ""
echo "=== 초기화 완료 ==="
echo ""
echo "남은 파일:"
echo "  CLAUDE.md"
echo "  harness/*.md"
echo "  skills/*.md"
echo "  reset.sh"
echo ""
echo "이제 명세를 넣고 '만들어줘'를 실행하세요."
