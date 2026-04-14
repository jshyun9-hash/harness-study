/**
 * 하네스 규칙을 참고하여 기능 명세 MD를 생성한다.
 */
import { HARNESS_DOCS } from './harnessLoader';

export interface FieldSpec {
  id: string;
  name: string;
  type: string;
  label: string;
  required: boolean;
}

export interface SearchFieldSpec {
  fieldKey: string;
  label: string;
  searchType: 'text' | 'select' | 'checkbox'; // SearchCard 타입
  enabled: boolean;
}

export interface FormFieldSpec {
  fieldKey: string;
  label: string;
  formType: 'text' | 'textarea' | 'select' | 'checkbox' | 'number'; // FormCard 타입
  enabled: boolean;
}

export interface RelatedFeatureSpec {
  name: string;
  description: string;
  fields: { name: string; type: string; label: string; required: boolean }[];
}

export interface SpecInput {
  featureName: string;
  description: string;
  fields: FieldSpec[];
  searchFields: SearchFieldSpec[];
  formFields: FormFieldSpec[];
  relatedFeatures?: RelatedFeatureSpec[];
}

/**
 * 필드 정의 → 검색 필드 자동 추론
 * String → text 검색, Boolean → checkbox, 나머지는 기본 비활성
 */
export function inferSearchFields(fields: FieldSpec[]): SearchFieldSpec[] {
  return fields.map((f) => {
    // 자동 추론 규칙
    if (f.name === 'title' || f.name === 'content') {
      return {
        fieldKey: f.name,
        label: f.label,
        searchType: 'text' as const,
        enabled: true,
      };
    }
    if (f.name === 'category' || f.name === 'status') {
      return {
        fieldKey: f.name,
        label: f.label,
        searchType: 'select' as const,
        enabled: true,
      };
    }
    if (f.type === 'Boolean') {
      return {
        fieldKey: f.name,
        label: f.label,
        searchType: 'checkbox' as const,
        enabled: false,
      };
    }
    return {
      fieldKey: f.name,
      label: f.label,
      searchType: 'text' as const,
      enabled: false,
    };
  });
}

/**
 * 필드 정의 → 폼 필드 자동 추론
 * 기본: 전부 활성, id/viewCount/likeCount/createdAt/updatedAt은 비활성
 */
export function inferFormFields(fields: FieldSpec[]): FormFieldSpec[] {
  const EXCLUDE_FROM_FORM = ['viewCount', 'likeCount'];

  return fields.map((f) => {
    let formType: FormFieldSpec['formType'] = 'text';
    if (f.name === 'content') formType = 'textarea';
    else if (f.name === 'category' || f.name === 'status') formType = 'select';
    else if (f.type === 'Boolean') formType = 'checkbox';
    else if (
      f.type === 'Integer' ||
      f.type === 'Long' ||
      f.type === 'BigDecimal'
    )
      formType = 'number';

    const enabled = !EXCLUDE_FROM_FORM.includes(f.name);

    return { fieldKey: f.name, label: f.label, formType, enabled };
  });
}

export const FIELD_TYPES = [
  'String',
  'Long',
  'Integer',
  'Boolean',
  'LocalDateTime',
  'BigDecimal',
];

/**
 * 자연어 요구사항 → 기능명/필드 자동 추론
 */
export function inferSpec(description: string): {
  featureName: string;
  fields: FieldSpec[];
} {
  const lower = description.toLowerCase();

  let featureName = 'Post';
  if (lower.includes('공지') || lower.includes('notice'))
    featureName = 'Notice';
  else if (lower.includes('자유')) featureName = 'FreeBoard';
  else if (lower.includes('qna') || lower.includes('질문')) featureName = 'Qna';
  else if (lower.includes('faq')) featureName = 'Faq';
  else if (lower.includes('회원') || lower.includes('user'))
    featureName = 'User';
  else if (lower.includes('상품') || lower.includes('product'))
    featureName = 'Product';
  else if (lower.includes('주문') || lower.includes('order'))
    featureName = 'Order';
  else if (lower.includes('댓글') || lower.includes('comment'))
    featureName = 'Comment';

  const fields: FieldSpec[] = [
    { id: uid(), name: 'title', type: 'String', label: '제목', required: true },
    {
      id: uid(),
      name: 'content',
      type: 'String',
      label: '내용',
      required: true,
    },
    {
      id: uid(),
      name: 'author',
      type: 'String',
      label: '작성자',
      required: true,
    },
  ];

  const addField = (name: string, type: string, label: string) =>
    fields.push({ id: uid(), name, type, label, required: false });

  if (lower.includes('조회') || lower.includes('view'))
    addField('viewCount', 'Integer', '조회수');
  if (lower.includes('좋아요') || lower.includes('like'))
    addField('likeCount', 'Integer', '좋아요');
  if (lower.includes('카테고리') || lower.includes('category'))
    addField('category', 'String', '카테고리');
  if (lower.includes('태그') || lower.includes('tag'))
    addField('tags', 'String', '태그');
  if (lower.includes('상태') || lower.includes('status'))
    addField('status', 'String', '상태');
  if (lower.includes('고정') || lower.includes('pin'))
    addField('isPinned', 'Boolean', '고정여부');
  if (lower.includes('공개') || lower.includes('publish'))
    addField('isPublished', 'Boolean', '공개여부');
  if (lower.includes('가격') || lower.includes('price'))
    addField('price', 'BigDecimal', '가격');
  if (lower.includes('수량') || lower.includes('quantity'))
    addField('quantity', 'Integer', '수량');

  return { featureName, fields };
}

function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

/**
 * CamelCase → snake_case 변환
 */
function toSnakeCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '');
}

/**
 * 자바 타입 → SQL 타입
 */
function javaToSql(type: string): string {
  switch (type) {
    case 'String':
      return 'VARCHAR(500)';
    case 'Long':
      return 'BIGINT';
    case 'Integer':
      return 'INTEGER';
    case 'Boolean':
      return 'BOOLEAN DEFAULT FALSE';
    case 'LocalDateTime':
      return 'TIMESTAMP';
    case 'BigDecimal':
      return 'DECIMAL(19, 2)';
    default:
      return 'VARCHAR(255)';
  }
}

/**
 * 하네스 + 스킬 기반으로 기능 명세 MD 생성
 */
export function generateSpecMd(input: SpecInput): string {
  const {
    featureName,
    description,
    fields,
    searchFields,
    formFields,
    relatedFeatures = [],
  } = input;
  const activeSearchFields = searchFields.filter((f) => f.enabled);
  const activeFormFields = formFields.filter((f) => f.enabled);
  const tableName = toSnakeCase(featureName) + '_board';
  const pkName = tableName + '_id';

  // 필드 테이블
  const fieldTable = fields
    .map(
      (f) =>
        `| ${f.name} | ${f.type} | ${f.label} | ${f.required ? '필수' : '선택'} |`,
    )
    .join('\n');

  // DDL 컬럼
  const ddlColumns = fields
    .map((f) => {
      const colName = toSnakeCase(f.name);
      const colType = javaToSql(f.type);
      const notNull = f.required ? ' NOT NULL' : '';
      return `    ${colName} ${colType}${notNull}`;
    })
    .join(',\n');

  // validation 규칙
  const validationRules = fields
    .filter((f) => f.required)
    .map((f) => {
      if (f.type === 'String') {
        const maxLen = f.name === 'content' ? '' : ', 최대 200자';
        return `- ${f.name}: 필수${maxLen}`;
      }
      return `- ${f.name}: 필수`;
    })
    .join('\n');

  const lowerName = featureName.toLowerCase();

  return `# 기능 명세: ${featureName}

## 설명
${description}

## 기능명
${featureName}

## 필드 정의

| 필드명 | 타입 | 설명 | 필수 |
|--------|------|------|------|
${fieldTable}

## 생성할 파일

### 백엔드
- \`domain/${lowerName}/entity/${featureName}.java\`
- \`domain/${lowerName}/repository/${featureName}Repository.java\`
- \`domain/${lowerName}/controller/${featureName}Controller.java\`
- \`domain/${lowerName}/service/${featureName}Service.java\`
- \`domain/${lowerName}/dto/${featureName}Request.java\`
- \`domain/${lowerName}/dto/${featureName}Response.java\`
- \`domain/${lowerName}/dto/${featureName}SearchCondition.java\`

### 프론트엔드
- \`types/${featureName}.ts\`
- \`api/${lowerName}Api.ts\`
- \`hooks/use${featureName}.ts\`
- \`components/${featureName}/${featureName}Table.tsx\`
- \`components/${featureName}/${featureName}Form.tsx\`
- \`components/${featureName}/${featureName}Detail.tsx\`
- \`pages/${featureName}/${featureName}ListPage.tsx\`

## 예상 API

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | /api/${lowerName}s | 목록 조회 (페이징, 검색) |
| GET | /api/${lowerName}s/{id} | 상세 조회 |
| POST | /api/${lowerName}s | 생성 |
| PUT | /api/${lowerName}s/{id} | 수정 |
| DELETE | /api/${lowerName}s/{id} | 삭제 |

## UI 요구사항 — 검색 (SearchCard)

공통 SearchCard 컴포넌트를 사용한다. 아래 검색 필드를 선언적으로 정의한다.

| 필드 | 검색 타입 | 라벨 |
|------|----------|------|
${activeSearchFields.map((sf) => `| ${sf.fieldKey} | ${sf.searchType} | ${sf.label} |`).join('\n')}

\`\`\`tsx
const SEARCH_FIELDS: SearchField[] = [
${activeSearchFields.map((sf) => `  { key: '${sf.fieldKey}', type: '${sf.searchType}', label: '${sf.label}'${sf.searchType === 'select' ? `, options: [/* 옵션 정의 */]` : ''} },`).join('\n')}
];
\`\`\`

## UI 요구사항 — 입력/수정 폼 (FormCard)

공통 FormCard 컴포넌트를 사용한다. 아래 폼 필드를 선언적으로 정의한다.

| 필드 | 입력 타입 | 라벨 | 필수 |
|------|----------|------|------|
${activeFormFields
  .map((ff) => {
    const field = fields.find((f) => f.name === ff.fieldKey);
    return `| ${ff.fieldKey} | ${ff.formType} | ${ff.label} | ${field?.required ? '필수' : '선택'} |`;
  })
  .join('\n')}

\`\`\`tsx
const FORM_FIELDS: FormFieldDef[] = [
${activeFormFields
  .map((ff) => {
    const field = fields.find((f) => f.name === ff.fieldKey);
    const opts: string[] = [];
    opts.push(`key: '${ff.fieldKey}'`);
    opts.push(`type: '${ff.formType}'`);
    opts.push(`label: '${ff.label}'`);
    if (field?.required) opts.push(`required: true`);
    if (ff.formType === 'textarea') opts.push(`rows: 8`);
    if (ff.formType === 'select') opts.push(`options: [/* 옵션 정의 */]`);
    return `  { ${opts.join(', ')} },`;
  })
  .join('\n')}
];
\`\`\`

## UI 요구사항 — 공통
- 목록 페이지: SearchCard + DataTable 사용
- 상세보기: 다이얼로그 (lg 사이즈)
- 작성/수정: 다이얼로그 (lg 사이즈) + FormCard
- 삭제: 확인 다이얼로그 (sm 사이즈)
- 로딩/에러/빈상태 모두 처리

## 검증 규칙
${validationRules}

## 예상 DDL (참고용)

\`\`\`sql
CREATE TABLE ${tableName} (
    ${pkName} BIGINT AUTO_INCREMENT PRIMARY KEY,
${ddlColumns},
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

> JPA ddl-auto=update로 자동 생성되므로 별도 작성 불필요.

${relatedFeatures.length > 0 ? generateRelatedFeaturesMd(relatedFeatures) : ''}
## 적용할 하네스 규칙
- harness/stack.md → 기술 스택 (React + Spring Boot + JPA + H2)
- harness/structure.md → 폴더 구조, 네이밍
- harness/coding.md → 코딩 컨벤션 (Entity, Repository, Service 패턴)
- harness/architecture.md → 레이어 경계, API 표준
- harness/components.md → 공통 컴포넌트 강제 사용 (Input, DataTable, Dialog, FormContainer 등)
- harness/style-guide.md → 비즈니스 테마 (Navy + Gold)
- harness/ux.md → 다이얼로그 규칙, 로딩/빈상태/에러
- skills/crud-page.md → CRUD 생성 순서

---
> 이 명세를 Claude Code 채팅에 붙여넣고 "이 명세대로 studio/에 만들어줘" 라고 입력하세요.
> 메인 기능(${featureName})${relatedFeatures.length > 0 ? ` + 연관 기능(${relatedFeatures.map((r) => r.name).join(', ')})` : ''}을 한 번에 생성합니다.
> 참조된 하네스 파일 ${HARNESS_DOCS.length}개를 기반으로 생성된 명세입니다.
`;
}

function generateRelatedFeaturesMd(
  relatedFeatures: RelatedFeatureSpec[],
): string {
  let md = '';

  for (const rf of relatedFeatures) {
    const rfLower = rf.name.toLowerCase();
    const rfTable = toSnakeCase(rf.name);
    const rfPk = rfTable + '_id';

    const rfFieldTable = rf.fields
      .map(
        (f) =>
          `| ${f.name} | ${f.type} | ${f.label} | ${f.required ? '필수' : '선택'} |`,
      )
      .join('\n');

    const rfDdlColumns = rf.fields
      .map((f) => {
        const colName = toSnakeCase(f.name);
        const colType = javaToSql(f.type);
        const notNull = f.required ? ' NOT NULL' : '';
        return `    ${colName} ${colType}${notNull}`;
      })
      .join(',\n');

    md += `
---

## 연관 기능: ${rf.name}

### 설명
${rf.description}

### 필드 정의

| 필드명 | 타입 | 설명 | 필수 |
|--------|------|------|------|
${rfFieldTable}

### 생성할 파일

#### 백엔드
- \`domain/${rfLower}/entity/${rf.name}.java\`
- \`domain/${rfLower}/repository/${rf.name}Repository.java\`
- \`domain/${rfLower}/controller/${rf.name}Controller.java\`
- \`domain/${rfLower}/service/${rf.name}Service.java\`
- \`domain/${rfLower}/dto/${rf.name}Request.java\`
- \`domain/${rfLower}/dto/${rf.name}Response.java\`

#### 프론트엔드
- \`types/${rf.name}.ts\`
- \`api/${rfLower}Api.ts\`
- \`hooks/use${rf.name}.ts\`
- \`components/${rf.name}/${rf.name}List.tsx\` (게시글 상세 다이얼로그 내에 표시)
- \`components/${rf.name}/${rf.name}Form.tsx\`

### 예상 API

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | /api/${rfLower}s?boardId={id} | 목록 조회 (부모 기준) |
| POST | /api/${rfLower}s | 생성 |
| DELETE | /api/${rfLower}s/{id} | 삭제 |

### 예상 DDL (참고용)

\`\`\`sql
CREATE TABLE ${rfTable} (
    ${rfPk} BIGINT AUTO_INCREMENT PRIMARY KEY,
${rfDdlColumns},
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

`;
  }

  return md;
}
