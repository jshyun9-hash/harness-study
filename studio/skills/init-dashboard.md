# 초기 대시보드 셋팅 스킬

## 트리거
사용자가 아래와 같이 요청할 때 실행한다.
- "초기 셋팅 해줘"
- "대시보드 만들어줘"
- "studio 초기화 해줘"

## 목적
studio/ 에 하네스 MD 파일만 있는 초기 상태에서,
프로젝트 관리용 대시보드 UI를 구축한다.

## 기술 스택
- React 19 + TypeScript
- Vite 8
- Tailwind CSS 4
- react-markdown (MD 뷰어)
- 포트: 5174

## 생성 순서

### 1. Vite + React 스캐폴딩
```bash
npm create vite@latest . -- --template react-ts
# 또는 임시 폴더에 생성 후 파일 이동
```

### 2. 의존성 설치
```bash
npm install
npm install -D @tailwindcss/vite tailwindcss prettier
npm install react-markdown remark-gfm
```

### 3. 설정 파일

#### vite.config.ts
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 5174 },
});
```

#### .prettierrc
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "all",
  "printWidth": 80,
  "endOfLine": "auto"
}
```

#### src/index.css
```css
@import 'tailwindcss';
```

### 4. MD 파일 로드 전략

Vite의 `?raw` 쿼리로 harness/, skills/ 경로의 MD 파일들을 문자열로 import한다.

```typescript
// src/harnessFiles.ts
import claudeMd from '../CLAUDE.md?raw';
import stackMd from '../harness/stack.md?raw';
import structureMd from '../harness/structure.md?raw';
// ... 등등

export const HARNESS_FILES = [
  { name: 'CLAUDE.md', desc: '프로젝트 총 규칙 (진입점)', content: claudeMd },
  { name: 'harness/stack.md', desc: '기술 스택', content: stackMd },
  // ...
];
```

### 5. App.tsx 구성

- **헤더**: Navy 배경(#1e3a5f) + 프로젝트명
- **본문**: 하네스 MD 파일 목록 (클릭 시 뷰어 다이얼로그)
- **생성 상태 카드**: Frontend / Backend / Database 상태
- **왼쪽 하단 플로팅 버튼**: "+ 명세 작성" → 슬라이드 패널로 SpecGenerator 열기
- **MD 뷰어 다이얼로그**: react-markdown으로 렌더링, 파일명 클릭 시 열림

### 6. SpecGenerator 컴포넌트

이전 study/ 프로젝트의 SpecGenerator 로직 재사용.
- 요구사항 입력 → 자동 필드 추론
- 필드 편집 UI
- 명세 MD 생성 + 클립보드 복사

## 스타일
harness/style-guide.md 의 비즈니스 테마(Navy + Gold) 준수.

## 완성 후 실행
```bash
npm run dev
# → http://localhost:5174
```
