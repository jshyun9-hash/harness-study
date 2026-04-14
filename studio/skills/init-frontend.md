# Frontend 초기 셋팅 스킬

## 트리거
- `studio/frontend/` 폴더가 **없을 때** 자동 실행
- 또는 사용자가 "프론트 셋팅 해줘" 요청 시

## 목적
React 기반 프론트엔드 프로젝트를 초기화하고,
공통 컴포넌트를 harness/components.md 명세대로 미리 만들어 둔다.

## 기술 스택
harness/stack.md 참조:
- React 19 + TypeScript 6
- Vite 8
- Tailwind CSS 4
- 포트: 5175

## 생성 순서

### 1. Vite 프로젝트 스캐폴딩
```bash
cd studio
npm create vite@latest frontend -- --template react-ts
cd frontend
```

### 2. 의존성 설치
```bash
npm install
npm install -D @tailwindcss/vite tailwindcss prettier eslint
```

### 3. 설정 파일 덮어쓰기

#### frontend/vite.config.ts
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5175,
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
});
```

#### frontend/.prettierrc
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

#### frontend/src/index.css
```css
@import 'tailwindcss';
```

#### frontend/src/main.tsx
```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { DialogProvider } from './components/common/DialogProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DialogProvider>
      <App />
    </DialogProvider>
  </StrictMode>,
);
```

### 4. 공통 컴포넌트 생성

harness/components.md 명세대로 아래 파일들을 모두 생성한다.
스타일은 harness/style-guide.md의 비즈니스 테마(Navy + Gold) 준수.

**기본 UI 컴포넌트**:
- `src/components/common/form/Label.tsx`
- `src/components/common/form/Input.tsx`
- `src/components/common/form/Textarea.tsx`
- `src/components/common/form/Checkbox.tsx`
- `src/components/common/form/Radio.tsx`
- `src/components/common/form/Select.tsx`

**조합 컴포넌트**:
- `src/components/common/Button.tsx`
- `src/components/common/FormField.tsx`
- `src/components/common/FormContainer.tsx`
- `src/components/common/SearchBar.tsx`
- `src/components/common/DataTable.tsx`
- `src/components/common/Pagination.tsx`

**다이얼로그 시스템**:
- `src/components/common/Dialog.tsx`
- `src/components/common/DialogProvider.tsx`
- `src/hooks/useDialog.ts`

**공통 타입**:
- `src/types/common.ts` — `ApiResponse<T>`, `PageResponse<T>` 등

### 5. App.tsx (빈 상태)
```tsx
export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#1e3a5f] text-white px-6 py-3 shadow-md">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-lg font-bold tracking-tight">서비스명</h1>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-6">
        <p className="text-sm text-gray-500">기능이 추가되면 여기에 표시됩니다.</p>
      </main>
    </div>
  );
}
```

### 6. 검증
```bash
cd frontend
npx tsc -b
npx vite build
```

모두 통과하면 셋팅 완료.

## 주의사항
- 공통 컴포넌트는 반드시 harness/components.md 스펙대로 생성
- 스타일은 harness/style-guide.md 비즈니스 테마 준수
- 하나라도 생략하지 말 것 (나중에 기능 생성 시 전부 사용됨)
