import type { FieldDefinition, UIFramework } from './types';

const UI_FRAMEWORK_NAMES: Record<UIFramework, string> = {
  tailwind: 'Tailwind CSS',
  shadcn: 'shadcn/ui',
  mui: 'MUI (Material UI)',
  antdesign: 'Ant Design',
  chakra: 'Chakra UI',
};

export function generateHarnessMd(params: {
  requirement: string;
  fields: FieldDefinition[];
  uiFramework: UIFramework;
  typeName: string;
}): string {
  const { requirement, fields, uiFramework, typeName } = params;
  const uiName = UI_FRAMEWORK_NAMES[uiFramework];

  const typeBlock = fields
    .map((f) => `  ${f.label}: ${f.type};`)
    .join('\n');

  const columnDefs = fields
    .map((f) => `| ${f.label} | ${f.type} | ${getColumnDescription(f)} |`)
    .join('\n');

  return `# Harness: 게시판 페이지 생성

## 요구사항

${requirement}

## 기술 스택

- **프레임워크**: React + TypeScript
- **UI 프레임워크**: ${uiName}

## TypeScript 타입 정의

\`\`\`typescript
interface ${typeName} {
${typeBlock}
}
\`\`\`

## 페이지 구성

### 1. 목록 페이지 (\`${typeName}ListPage\`)

| 컬럼 | 타입 | 설명 |
|------|------|------|
${columnDefs}

**기능 요구사항:**
- 페이지네이션 (10건 단위)
- 검색 (제목, 내용 기반)
- 정렬 (최신순/오래된순)

### 2. 상세 페이지 (\`${typeName}DetailPage\`)

- \`${typeName}\` 의 모든 필드를 표시
- 수정/삭제 버튼
- 목록으로 돌아가기

### 3. 작성/수정 페이지 (\`${typeName}FormPage\`)

- 폼 필드는 \`${typeName}\` 타입 기반으로 자동 생성
- 유효성 검사 포함
- 저장/취소 버튼

## 컴포넌트 구조

\`\`\`
src/
├── pages/
│   ├── ${typeName}ListPage.tsx
│   ├── ${typeName}DetailPage.tsx
│   └── ${typeName}FormPage.tsx
├── components/
│   ├── ${typeName}Table.tsx
│   ├── ${typeName}Form.tsx
│   └── SearchBar.tsx
├── types/
│   └── ${typeName}.ts
└── hooks/
    └── use${typeName}.ts
\`\`\`

## 린트 하네스

> 아래 린트 규칙은 **반드시** 적용되어야 합니다.

### ESLint

\`\`\`json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "react-hooks/exhaustive-deps": "warn",
    "no-console": "warn",
    "eqeqeq": "error",
    "no-var": "error",
    "prefer-const": "error"
  }
}
\`\`\`

### Prettier

\`\`\`json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "all",
  "printWidth": 80
}
\`\`\`

### TypeScript Strict Mode

\`\`\`json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
\`\`\`
`;
}

function getColumnDescription(field: FieldDefinition): string {
  const map: Record<string, string> = {
    id: '고유 식별자',
    title: '제목',
    content: '내용',
    author: '작성자',
    createdAt: '생성일시',
    updatedAt: '수정일시',
    views: '조회수',
    likes: '좋아요 수',
    category: '카테고리',
    tags: '태그 목록',
    status: '상태',
    isPublished: '공개 여부',
  };
  return map[field.label] || field.label;
}
