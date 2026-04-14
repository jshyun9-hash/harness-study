/**
 * 활성화된 규칙 기반으로 하네스 MD 파일 트리를 생성한다.
 * 규칙 ON/OFF에 따라 폴더와 파일이 달라진다.
 */
import type { HarnessRule } from './generateStudyCode';

export interface HarnessFile {
  path: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  ruleIds: string[]; // 이 파일에 포함된 규칙 ID들
}

export function generateHarnessTree(rules: HarnessRule[]): HarnessFile[] {
  const enabled = rules.filter((r) => r.enabled);
  const isOn = (id: string) => enabled.some((r) => r.id === id);

  const files: HarnessFile[] = [];

  // CLAUDE.md — 항상 존재 (진입점)
  files.push({
    path: 'CLAUDE.md',
    name: 'CLAUDE.md',
    type: 'file',
    ruleIds: [],
    content: generateClaudeMd(enabled),
  });

  // AGENT.md — 항상 존재
  files.push({
    path: 'AGENT.md',
    name: 'AGENT.md',
    type: 'file',
    ruleIds: [],
    content: generateAgentMd(enabled),
  });

  // harness/ 폴더
  const hasContext = isOn('folder-structure') || isOn('naming-convention');
  const hasCicd =
    isOn('no-any') || isOn('no-console') || isOn('no-var') || isOn('eqeqeq');
  const hasBoundary = isOn('api-boundary') || isOn('error-handling');
  const hasFeedback = isOn('empty-state') || isOn('loading-state');

  if (hasContext || hasCicd || hasBoundary || hasFeedback) {
    files.push({
      path: 'harness',
      name: 'harness/',
      type: 'folder',
      ruleIds: [],
    });
  }

  if (hasContext) {
    const ruleIds: string[] = [];
    if (isOn('folder-structure')) ruleIds.push('folder-structure');
    if (isOn('naming-convention')) ruleIds.push('naming-convention');
    files.push({
      path: 'harness/structure.md',
      name: 'structure.md',
      type: 'file',
      ruleIds,
      content: generateStructureMd(rules),
    });
  }

  if (hasCicd) {
    const ruleIds: string[] = [];
    if (isOn('no-any')) ruleIds.push('no-any');
    if (isOn('no-console')) ruleIds.push('no-console');
    if (isOn('no-var')) ruleIds.push('no-var');
    if (isOn('eqeqeq')) ruleIds.push('eqeqeq');
    files.push({
      path: 'harness/coding.md',
      name: 'coding.md',
      type: 'file',
      ruleIds,
      content: generateCodingMd(rules),
    });
  }

  if (hasBoundary) {
    const ruleIds: string[] = [];
    if (isOn('api-boundary')) ruleIds.push('api-boundary');
    if (isOn('error-handling')) ruleIds.push('error-handling');
    files.push({
      path: 'harness/architecture.md',
      name: 'architecture.md',
      type: 'file',
      ruleIds,
      content: generateArchitectureMd(rules),
    });
  }

  if (hasFeedback) {
    const ruleIds: string[] = [];
    if (isOn('empty-state')) ruleIds.push('empty-state');
    if (isOn('loading-state')) ruleIds.push('loading-state');
    files.push({
      path: 'harness/ux.md',
      name: 'ux.md',
      type: 'file',
      ruleIds,
      content: generateUxMd(rules),
    });
  }

  // skills/ 폴더 — 항상 존재
  files.push({
    path: 'skills',
    name: 'skills/',
    type: 'folder',
    ruleIds: [],
  });
  files.push({
    path: 'skills/crud-page.md',
    name: 'crud-page.md',
    type: 'file',
    ruleIds: [],
    content: generateCrudSkillMd(enabled),
  });

  return files;
}

function generateClaudeMd(enabled: HarnessRule[]): string {
  const harnessFiles: string[] = [];
  const hasContext = enabled.some(
    (r) => r.id === 'folder-structure' || r.id === 'naming-convention',
  );
  const hasCicd = enabled.some(
    (r) =>
      r.id === 'no-any' ||
      r.id === 'no-console' ||
      r.id === 'no-var' ||
      r.id === 'eqeqeq',
  );
  const hasBoundary = enabled.some(
    (r) => r.id === 'api-boundary' || r.id === 'error-handling',
  );
  const hasFeedback = enabled.some(
    (r) => r.id === 'empty-state' || r.id === 'loading-state',
  );

  if (hasContext)
    harnessFiles.push('- harness/structure.md — 폴더 구조, 네이밍');
  if (hasCicd) harnessFiles.push('- harness/coding.md — 코딩 컨벤션, 린트');
  if (hasBoundary)
    harnessFiles.push('- harness/architecture.md — 아키텍처, API 경계');
  if (hasFeedback) harnessFiles.push('- harness/ux.md — UX 패턴');

  return `# 프로젝트 하네스

## 기술 스택
- React 19 + TypeScript
- Tailwind CSS

## 하네스 규칙
아래 파일의 규칙을 **반드시** 따른다.

${harnessFiles.length > 0 ? harnessFiles.join('\n') : '(활성화된 하네스 규칙 없음)'}

## 스킬
- skills/crud-page.md — CRUD 페이지 생성 레시피

## 활성 규칙 수
${enabled.length}개 규칙 활성`;
}

function generateAgentMd(enabled: HarnessRule[]): string {
  const steps: string[] = [];
  const hasContext = enabled.some(
    (r) => r.id === 'folder-structure' || r.id === 'naming-convention',
  );
  const hasCicd = enabled.some(
    (r) =>
      r.id === 'no-any' ||
      r.id === 'no-console' ||
      r.id === 'no-var' ||
      r.id === 'eqeqeq',
  );
  const hasBoundary = enabled.some(
    (r) => r.id === 'api-boundary' || r.id === 'error-handling',
  );
  const hasFeedback = enabled.some(
    (r) => r.id === 'empty-state' || r.id === 'loading-state',
  );

  steps.push('1. CLAUDE.md 를 읽고 프로젝트 규칙을 파악한다');
  if (hasContext)
    steps.push('2. harness/structure.md 를 읽고 폴더/네이밍 규칙을 확인한다');
  if (hasCicd)
    steps.push(
      `${steps.length + 1}. harness/coding.md 를 읽고 코딩 규칙을 확인한다`,
    );
  if (hasBoundary)
    steps.push(
      `${steps.length + 1}. harness/architecture.md 를 읽고 아키텍처 경계를 확인한다`,
    );
  if (hasFeedback)
    steps.push(`${steps.length + 1}. harness/ux.md 를 읽고 UX 패턴을 확인한다`);
  steps.push(
    `${steps.length + 1}. skills/ 에서 해당 스킬의 레시피를 따라 코드를 생성한다`,
  );
  steps.push(
    `${steps.length + 1}. 생성된 코드가 모든 하네스 규칙을 준수하는지 검증한다`,
  );

  return `# AI 에이전트 행동 규칙

## 코드 생성 순서
${steps.join('\n')}

## 금지 사항
- 하네스 규칙을 읽지 않고 코드를 생성하는 것
- 규칙에 없는 패턴을 임의로 적용하는 것
- 에러가 나면 규칙을 무시하고 우회하는 것`;
}

function generateStructureMd(rules: HarnessRule[]): string {
  const isOn = (id: string) => rules.find((r) => r.id === id)?.enabled ?? false;
  const sections: string[] = ['# 구조 및 네이밍 규칙'];

  if (isOn('folder-structure')) {
    sections.push(`
## 폴더 구조

\`\`\`
src/
├── pages/          # 페이지 컴포넌트
│   └── {타입명}ListPage.tsx
│   └── {타입명}DetailPage.tsx
│   └── {타입명}FormPage.tsx
├── components/     # 재사용 UI 컴포넌트
│   └── {타입명}Table.tsx
│   └── {타입명}Form.tsx
│   └── SearchBar.tsx
├── hooks/          # 커스텀 훅
│   └── use{타입명}.ts
└── types/          # 타입 정의
    └── {타입명}.ts
\`\`\`

> 루트에 컴포넌트 파일을 두지 않는다.
> 반드시 위 디렉토리 분류를 따른다.`);
  }

  if (isOn('naming-convention')) {
    sections.push(`
## 네이밍 규칙

| 대상 | 규칙 | 예시 |
|------|------|------|
| 파일명 | PascalCase | NoticeTable.tsx |
| 컴포넌트 | PascalCase | export default function NoticeTable |
| 변수/프로퍼티 | camelCase | createdAt, isPinned |
| 타입 정의 | interface 사용 | interface Notice { } |
| 훅 | use 접두사 | useNotice |

### 금지
- snake_case (created_at, is_pinned)
- type alias (type Notice = { })
- 약어 사용 (btn, tbl, pg)`);
  }

  return sections.join('\n');
}

function generateCodingMd(rules: HarnessRule[]): string {
  const isOn = (id: string) => rules.find((r) => r.id === id)?.enabled ?? false;
  const sections: string[] = ['# 코딩 컨벤션'];

  if (isOn('no-any')) {
    sections.push(`
## no-any

\`any\` 타입 사용을 금지한다.

\`\`\`typescript
// ✅
const [items, setItems] = useState<Notice[]>([]);
function handle(e: React.ChangeEvent<HTMLInputElement>) { }

// ❌
const [items, setItems] = useState(null);
function handle(e: any) { }
\`\`\`

설정:
\`\`\`json
// eslint: "@typescript-eslint/no-explicit-any": "error"
// tsconfig: "noImplicitAny": true
\`\`\``);
  }

  if (isOn('no-console')) {
    sections.push(`
## no-console

console.log 를 프로덕션 코드에서 사용하지 않는다.

\`\`\`typescript
// ✅ 에러는 상태로 관리
setError(err instanceof Error ? err : new Error('Unknown'));

// ❌
console.log('error:', e);
\`\`\`

설정: \`"no-console": "warn"\``);
  }

  if (isOn('no-var')) {
    sections.push(`
## no-var

\`var\` 대신 \`const\` / \`let\` 을 사용한다.

\`\`\`typescript
// ✅
const res = await fetch(url);

// ❌
var res = await fetch(url);
\`\`\`

설정: \`"no-var": "error", "prefer-const": "error"\``);
  }

  if (isOn('eqeqeq')) {
    sections.push(`
## eqeqeq (=== 강제)

\`==\` 대신 \`===\` 를 사용한다.

\`\`\`typescript
// ✅
if (item.isPinned === true) { }

// ❌ 타입 강제변환 위험
if (item.is_pinned == true) { }
\`\`\`

설정: \`"eqeqeq": "error"\``);
  }

  return sections.join('\n');
}

function generateArchitectureMd(rules: HarnessRule[]): string {
  const isOn = (id: string) => rules.find((r) => r.id === id)?.enabled ?? false;
  const sections: string[] = ['# 아키텍처 규칙'];

  if (isOn('api-boundary')) {
    sections.push(`
## API 접근 경계

- \`fetch\` / \`axios\` 호출은 **hooks/ 내부에서만** 수행한다
- 컴포넌트(pages/, components/)에서 직접 API를 호출하지 않는다
- URL 조합 시 \`URLSearchParams\` 를 사용한다 (문자열 연결 금지)
- API base URL은 상수로 관리한다

\`\`\`typescript
// ✅ hooks/useNotice.ts
const API_BASE = '/api/notices';
const res = await fetch(\`\${API_BASE}?\${new URLSearchParams(params)}\`);

// ❌ components/NoticeTable.tsx 에서
await fetch('/api/notices?page=' + page);
\`\`\``);
  }

  if (isOn('error-handling')) {
    sections.push(`
## 에러 핸들링

- API 호출은 반드시 \`try/catch\` 로 감싼다
- HTTP 상태가 ok 가 아니면 \`Error\` 를 throw 한다
- 에러를 \`useState\` 로 관리하고 UI에 표시한다
- catch 에서 \`console.log\` 만 하는 것은 금지

\`\`\`typescript
// ✅
const [error, setError] = useState<Error | null>(null);
try {
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
} catch (err) {
  setError(err instanceof Error ? err : new Error('Unknown'));
}

// ❌
try { ... } catch (e) { console.log(e); }
\`\`\``);
  }

  return sections.join('\n');
}

function generateUxMd(rules: HarnessRule[]): string {
  const isOn = (id: string) => rules.find((r) => r.id === id)?.enabled ?? false;
  const sections: string[] = ['# UX 패턴 규칙'];

  if (isOn('empty-state')) {
    sections.push(`
## 빈 상태 처리

데이터가 0건일 때 반드시 안내 메시지를 표시한다.
빈 테이블을 그대로 렌더링하지 않는다.

\`\`\`tsx
if (items.length === 0) {
  return <p className="text-center text-gray-500 py-8">
    등록된 공지사항이 없습니다.
  </p>;
}
\`\`\`

> 이 규칙은 QA 피드백에서 추가됨:
> "빈 화면만 보이면 에러인지 데이터가 없는 건지 구분 불가"`);
  }

  if (isOn('loading-state')) {
    sections.push(`
## 로딩 상태 표시

비동기 데이터를 불러오는 동안 로딩 UI를 표시한다.
로딩 중에 빈 콘텐츠가 보이면 안 된다.

\`\`\`tsx
{loading ? (
  <p className="text-center text-gray-500 py-8">로딩 중...</p>
) : (
  <NoticeTable items={items} />
)}
\`\`\`

> 이 규칙은 사용자 피드백에서 추가됨:
> "데이터 로드 전에 빈 테이블이 깜빡거려서 불안함"`);
  }

  return sections.join('\n');
}

function generateCrudSkillMd(enabled: HarnessRule[]): string {
  const refs: string[] = [];
  const hasContext = enabled.some(
    (r) => r.id === 'folder-structure' || r.id === 'naming-convention',
  );
  const hasCicd = enabled.some(
    (r) =>
      r.id === 'no-any' ||
      r.id === 'no-console' ||
      r.id === 'no-var' ||
      r.id === 'eqeqeq',
  );
  const hasBoundary = enabled.some(
    (r) => r.id === 'api-boundary' || r.id === 'error-handling',
  );
  const hasFeedback = enabled.some(
    (r) => r.id === 'empty-state' || r.id === 'loading-state',
  );

  if (hasContext) refs.push('- harness/structure.md → 파일 위치, 네이밍');
  if (hasCicd) refs.push('- harness/coding.md → 타입, 린트 규칙');
  if (hasBoundary)
    refs.push('- harness/architecture.md → API 경계, 에러 핸들링');
  if (hasFeedback) refs.push('- harness/ux.md → 로딩, 빈상태 처리');

  return `# CRUD 페이지 생성 스킬

## 입력
- 타입명: {typeName}
- 필드 목록: {fields}

## 생성 순서
1. types/{typeName}.ts — 타입 정의
2. hooks/use{typeName}.ts — API 훅
3. components/{typeName}Table.tsx — 테이블 컴포넌트
4. components/{typeName}Form.tsx — 폼 컴포넌트
5. pages/{typeName}ListPage.tsx — 목록 페이지
6. pages/{typeName}DetailPage.tsx — 상세 페이지

## 참조할 하네스 규칙
${refs.length > 0 ? refs.join('\n') : '(활성화된 하네스 없음 — 자유 생성)'}

## 검증
- 모든 파일이 harness/ 규칙을 준수하는지 확인
- 위반 시 수정 후 재생성`;
}
