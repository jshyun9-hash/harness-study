/**
 * 개별 하네스 규칙 ON/OFF에 따라 코드가 실시간으로 달라지는 엔진.
 * 규칙을 끄면 해당 부분이 "나쁜 코드"로 바뀌고, 위반사항이 표시된다.
 */

export interface HarnessRule {
  id: string;
  name: string;
  pillar: '컨텍스트' | 'CI/CD' | '도구경계' | '피드백';
  description: string;
  enabled: boolean;
  harnessFile: string; // 이 규칙이 정의된 harness MD 파일 경로
}

export const DEFAULT_RULES: HarnessRule[] = [
  // 기둥 1: 컨텍스트 파일
  {
    id: 'folder-structure',
    name: '폴더 구조 규칙',
    pillar: '컨텍스트',
    description: 'pages/, components/, hooks/, types/ 구조를 따른다',
    enabled: true,
    harnessFile: 'harness/structure.md',
  },
  {
    id: 'naming-convention',
    name: '네이밍 컨벤션',
    pillar: '컨텍스트',
    description: '파일명은 PascalCase, 변수는 camelCase를 따른다',
    enabled: true,
    harnessFile: 'harness/structure.md',
  },
  // 기둥 2: CI/CD 게이트
  {
    id: 'no-any',
    name: 'no-any',
    pillar: 'CI/CD',
    description: 'TypeScript any 타입 사용을 금지한다',
    enabled: true,
    harnessFile: 'harness/coding.md',
  },
  {
    id: 'no-console',
    name: 'no-console',
    pillar: 'CI/CD',
    description: 'console.log 사용을 금지한다',
    enabled: true,
    harnessFile: 'harness/coding.md',
  },
  {
    id: 'no-var',
    name: 'no-var',
    pillar: 'CI/CD',
    description: 'var 대신 const/let을 사용한다',
    enabled: true,
    harnessFile: 'harness/coding.md',
  },
  {
    id: 'eqeqeq',
    name: '===  강제',
    pillar: 'CI/CD',
    description: '== 대신 === 를 사용한다',
    enabled: true,
    harnessFile: 'harness/coding.md',
  },
  // 기둥 3: 도구 경계
  {
    id: 'api-boundary',
    name: 'API 접근 경계',
    pillar: '도구경계',
    description: 'fetch는 훅에서만 호출, 컴포넌트에서 직접 호출 금지',
    enabled: true,
    harnessFile: 'harness/architecture.md',
  },
  {
    id: 'error-handling',
    name: '에러 핸들링 필수',
    pillar: '도구경계',
    description: 'API 호출 시 try/catch와 에러 상태 관리 필수',
    enabled: true,
    harnessFile: 'harness/architecture.md',
  },
  // 기둥 4: 피드백 루프
  {
    id: 'empty-state',
    name: '빈 상태 처리',
    pillar: '피드백',
    description: '데이터가 없을 때 사용자에게 안내 메시지를 보여준다',
    enabled: true,
    harnessFile: 'harness/ux.md',
  },
  {
    id: 'loading-state',
    name: '로딩 상태 표시',
    pillar: '피드백',
    description: '데이터 로딩 중 로딩 UI를 보여준다',
    enabled: true,
    harnessFile: 'harness/ux.md',
  },
];

export interface Violation {
  rule: string;
  line: number;
  message: string;
}

interface GeneratedResult {
  code: string;
  violations: Violation[];
}

/** 규칙 조합에 따라 코드를 조립하고 위반사항을 산출 */
export function generateFromRules(
  rules: HarnessRule[],
  fileType: 'type' | 'hook' | 'component' | 'page',
): GeneratedResult {
  const isOn = (id: string) => rules.find((r) => r.id === id)?.enabled ?? true;

  switch (fileType) {
    case 'type':
      return generateTypeCode(isOn);
    case 'hook':
      return generateHookCode(isOn);
    case 'component':
      return generateComponentCode(isOn);
    case 'page':
      return generatePageCode(isOn);
  }
}

function generateTypeCode(isOn: (id: string) => boolean): GeneratedResult {
  const violations: Violation[] = [];

  const filePath = isOn('folder-structure')
    ? '// types/Notice.ts'
    : '// notice.ts';
  if (!isOn('folder-structure'))
    violations.push({
      rule: '폴더 구조',
      line: 1,
      message: 'types/ 폴더가 아닌 루트에 파일 배치됨',
    });

  const useInterface = isOn('naming-convention');
  const typeDef = useInterface ? 'interface' : 'type';
  if (!useInterface)
    violations.push({
      rule: '네이밍',
      line: 2,
      message: 'interface 대신 type alias 사용',
    });

  const useAny = !isOn('no-any');
  const idType = useAny ? 'any' : 'number';
  const titleType = useAny ? 'any' : 'string';
  const viewsType = useAny ? 'any' : 'number';
  const pinnedType = useAny ? 'any' : 'boolean';
  const dateField = isOn('naming-convention') ? 'createdAt' : 'created_at';
  const pinnedField = isOn('naming-convention') ? 'isPinned' : 'is_pinned';

  if (useAny)
    violations.push({
      rule: 'no-any',
      line: 3,
      message: 'any 타입 5회 사용',
    });
  if (!isOn('naming-convention'))
    violations.push({
      rule: '네이밍',
      line: 7,
      message: 'snake_case 사용 (created_at, is_pinned)',
    });

  const eq = useInterface ? '' : ' =';
  const lines = [
    filePath,
    `export ${typeDef} Notice${eq} {`,
    `  id: ${idType};`,
    `  title: ${titleType};`,
    `  content: string;`,
    `  author: string;`,
    `  ${dateField}: ${useAny ? 'any' : 'Date'};`,
    `  views: ${viewsType};`,
    `  ${pinnedField}: ${pinnedType};`,
    `}`,
  ];

  if (isOn('no-any') && isOn('naming-convention')) {
    lines.push('');
    lines.push('export interface NoticeListParams {');
    lines.push('  page: number;');
    lines.push('  size: number;');
    lines.push('  keyword?: string;');
    lines.push("  sort?: 'latest' | 'oldest';");
    lines.push('}');
  }

  return { code: lines.join('\n'), violations };
}

function generateHookCode(isOn: (id: string) => boolean): GeneratedResult {
  const violations: Violation[] = [];

  const fileName = isOn('folder-structure')
    ? '// hooks/useNotice.ts'
    : '// useData.ts';
  if (!isOn('folder-structure'))
    violations.push({
      rule: '폴더 구조',
      line: 1,
      message: 'hooks/ 폴더 미사용, 파일명 규칙 위반',
    });

  const funcName = isOn('naming-convention') ? 'useNotice' : 'useData';
  const useVar = !isOn('no-var');
  const useConsole = !isOn('no-console');
  const useErrorHandling = isOn('error-handling');
  const useBoundary = isOn('api-boundary');

  if (useVar)
    violations.push({
      rule: 'no-var',
      line: 8,
      message: 'var 사용 감지 (const/let 사용 필요)',
    });
  if (useConsole)
    violations.push({
      rule: 'no-console',
      line: 10,
      message: 'console.log 3회 사용',
    });
  if (!useErrorHandling)
    violations.push({
      rule: '에러 핸들링',
      line: 12,
      message: '에러 상태 관리 없음, catch에서 에러 무시',
    });
  if (!useBoundary)
    violations.push({
      rule: 'API 경계',
      line: 9,
      message: '문자열 연결로 URL 구성 — 인코딩 버그 가능',
    });

  const varKeyword = useVar ? 'var' : 'const';

  let code: string;
  if (useBoundary && useErrorHandling && !useConsole && !useVar) {
    code = `${fileName}
import { useState, useCallback } from 'react';
import type { Notice, NoticeListParams } from '../types/Notice';

const API_BASE = '/api/notices';

export function ${funcName}() {
  const [items, setItems] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchList = useCallback(async (params: NoticeListParams) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(\`\${API_BASE}?\${new URLSearchParams({
        page: String(params.page),
        size: String(params.size),
      })}\`);
      if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
      const data: Notice[] = await res.json();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown'));
    } finally {
      setLoading(false);
    }
  }, []);

  return { items, loading, error, fetchList };
}`;
  } else {
    const stateType = isOn('no-any') ? '<Notice[]>' : '';
    const paramType = isOn('no-any') ? '' : ': any';
    const fetchUrl = useBoundary
      ? 'await fetch(`${API_BASE}?page=${page}`)'
      : `await fetch('/api/notices?page=' + page + '&keyword=' + keyword)`;
    const errorBlock = useErrorHandling
      ? `      setError(err instanceof Error ? err : new Error('Unknown'));`
      : useConsole
        ? `      console.log('error', e);`
        : `      // 에러 무시`;
    const logLines = useConsole ? `    console.log('fetching data...');\n` : '';
    const logData = useConsole ? `      console.log('got data:', json);\n` : '';

    code = `${fileName}
import { useState, useEffect } from 'react';

export function ${funcName}() {
  ${varKeyword} [data, setData] = useState${stateType}(null);
  ${varKeyword} [loading, setLoading] = useState(false);
${useErrorHandling ? `  ${varKeyword} [error, setError] = useState<Error | null>(null);\n` : ''}
  async function getData(page${paramType}, keyword${paramType}) {
    setLoading(true);
${logLines}    try {
      ${varKeyword} res = ${fetchUrl};
      ${varKeyword} json = await res.json();
${logData}      setData(json);
    } catch (e) {
${errorBlock}
    }
    setLoading(false);
  }

  useEffect(() => {
    getData(1, '');
  }, []);

  return { data, loading, getData };
}`;
  }

  return { code, violations };
}

function generateComponentCode(isOn: (id: string) => boolean): GeneratedResult {
  const violations: Violation[] = [];

  const fileName = isOn('folder-structure')
    ? '// components/NoticeTable.tsx'
    : '// Table.tsx';
  if (!isOn('folder-structure'))
    violations.push({
      rule: '폴더 구조',
      line: 1,
      message: 'components/ 폴더 미사용, 파일명 규칙 위반',
    });

  const useTypedProps = isOn('no-any');
  const useEqeqeq = isOn('eqeqeq');
  const useEmptyState = isOn('empty-state');
  const compName = isOn('naming-convention') ? 'NoticeTable' : 'Table';

  if (!useTypedProps)
    violations.push({
      rule: 'no-any',
      line: 2,
      message: 'Props 타입이 any',
    });
  if (!useEqeqeq)
    violations.push({
      rule: 'eqeqeq',
      line: 15,
      message: '== 사용 (=== 필요)',
    });
  if (!useEmptyState)
    violations.push({
      rule: '빈 상태',
      line: 0,
      message: '빈 데이터일 때 안내 메시지 없음',
    });

  const propsLine = useTypedProps
    ? `interface Props {\n  items: Notice[];\n  onRowClick: (item: Notice) => void;\n}\n\nexport default function ${compName}({ items, onRowClick }: Props)`
    : `export default function ${compName}({ data, click }: any)`;

  const importLine = useTypedProps
    ? "import type { Notice } from '../types/Notice';\n\n"
    : '';

  const emptyCheck = useEmptyState
    ? `  if (${useTypedProps ? 'items' : 'data'}.length === 0) {
    return <p className="text-center text-gray-500 py-8">등록된 공지사항이 없습니다.</p>;
  }\n\n`
    : '';

  const pinnedCheck = useEqeqeq
    ? 'item.isPinned === true'
    : 'item.is_pinned == true';

  const dataVar = useTypedProps ? 'items' : 'data';
  const clickVar = useTypedProps ? 'onRowClick' : 'click';
  const keyProp = useTypedProps ? 'item.id' : 'idx';
  const mapParam = useTypedProps ? '(item) =>' : `(item: any, idx: any) =>`;

  const code = `${fileName}
${importLine}${propsLine} {
${emptyCheck}  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b-2 border-gray-200">
            <th className="px-4 py-3 text-left text-sm font-medium">제목</th>
            <th className="px-4 py-3 text-left text-sm font-medium">작성자</th>
            <th className="px-4 py-3 text-right text-sm font-medium">조회수</th>
            <th className="px-4 py-3 text-left text-sm font-medium">작성일</th>
          </tr>
        </thead>
        <tbody>
          {${dataVar} && ${dataVar}.map(${mapParam} (
            <tr key={${keyProp}} onClick={() => ${clickVar}(item)} className="border-b hover:bg-gray-50 cursor-pointer">
              <td className="px-4 py-3 text-sm">
                {${pinnedCheck} ? '[고정] ' : ''}
                {item.title}
              </td>
              <td className="px-4 py-3 text-sm">{item.author}</td>
              <td className="px-4 py-3 text-sm text-right">{item.views}</td>
              <td className="px-4 py-3 text-sm">{String(item.${isOn('naming-convention') ? 'createdAt' : 'created_at'})}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}`;

  return { code, violations };
}

function generatePageCode(isOn: (id: string) => boolean): GeneratedResult {
  const violations: Violation[] = [];

  const fileName = isOn('folder-structure')
    ? '// pages/NoticeListPage.tsx'
    : '// NoticePage.tsx';
  if (!isOn('folder-structure'))
    violations.push({
      rule: '폴더 구조',
      line: 1,
      message: 'pages/ 폴더 미사용',
    });

  const useConsole = !isOn('no-console');
  const useVar = !isOn('no-var');
  const useAny = !isOn('no-any');
  const useLoading = isOn('loading-state');
  const useErrorHandling = isOn('error-handling');

  if (useConsole)
    violations.push({
      rule: 'no-console',
      line: 18,
      message: 'console.log로 클릭 처리',
    });
  if (useVar) violations.push({ rule: 'no-var', line: 6, message: 'var 사용' });
  if (useAny)
    violations.push({
      rule: 'no-any',
      line: 14,
      message: '(e: any) 이벤트 핸들러',
    });
  if (!useLoading)
    violations.push({
      rule: '로딩 상태',
      line: 0,
      message: '로딩 중 UI 없음',
    });
  if (!useErrorHandling)
    violations.push({
      rule: '에러 핸들링',
      line: 0,
      message: '에러 표시 없음',
    });

  const varKw = useVar ? 'var' : 'const';
  const hookName = isOn('naming-convention') ? 'useNotice' : 'useData';
  const tableName = isOn('naming-convention') ? 'NoticeTable' : 'Table';
  const pageName = isOn('naming-convention') ? 'NoticeListPage' : 'NoticePage';
  const hookImport = isOn('folder-structure')
    ? `import { ${hookName} } from '../hooks/${hookName}';`
    : `import { ${hookName} } from './${hookName}';`;
  const tableImport = isOn('folder-structure')
    ? `import ${tableName} from '../components/${tableName}';`
    : `import ${tableName} from './${tableName}';`;

  const eventType = useAny ? ': any' : ': React.ChangeEvent<HTMLInputElement>';
  const rowClick =
    useConsole && useAny
      ? `(item: any) => console.log(item)`
      : `handleRowClick`;

  const errorBlock =
    useErrorHandling && !useConsole
      ? `\n      {error && <p className="text-red-500 text-sm mb-4">{error.message}</p>}\n`
      : '';

  const loadingBlock = useLoading
    ? `{loading ? (
        <p className="text-center text-gray-500 py-8">로딩 중...</p>
      ) : (
        <${tableName} ${isOn('no-any') ? 'items' : 'data'}={${isOn('no-any') ? 'items' : 'data'}} ${isOn('no-any') ? 'onRowClick' : 'click'}={${rowClick}} />
      )}`
    : `<${tableName} ${isOn('no-any') ? 'items' : 'data'}={${isOn('no-any') ? 'items' : 'data'}} ${isOn('no-any') ? 'onRowClick' : 'click'}={${rowClick}} />`;

  const destructure = isOn('no-any')
    ? `{ items, loading, error, fetchList }`
    : `{ data, loading, getData }`;

  const code = `${fileName}
import { useState } from 'react';
${hookImport}
${tableImport}

export default function ${pageName}() {
  ${varKw} ${destructure} = ${hookName}();
  ${varKw} [keyword, setKeyword] = useState('');

  const handleSearch = (e${eventType}) => {
    setKeyword(e.target.value);
  };
${isOn('no-any') ? '' : useConsole ? `\n  // 클릭 시 console.log로 처리` : ''}
${isOn('no-any') ? `  const handleRowClick = (item: Notice) => {\n    // navigate(\`/notices/\${item.id}\`);\n  };\n` : ''}
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">공지사항</h1>
      </div>
      <input
        type="text"
        value={keyword}
        onChange={handleSearch}
        placeholder="검색어를 입력하세요"
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm mb-4"
      />
${errorBlock}
      ${loadingBlock}
    </div>
  );
}`;

  return { code, violations };
}

export const FILE_TYPES = [
  { key: 'type' as const, label: '타입 정의' },
  { key: 'hook' as const, label: '커스텀 훅' },
  { key: 'component' as const, label: '테이블 컴포넌트' },
  { key: 'page' as const, label: '목록 페이지' },
];

export const PILLAR_COLORS: Record<string, string> = {
  컨텍스트: 'bg-purple-100 text-purple-700 border-purple-200',
  'CI/CD': 'bg-blue-100 text-blue-700 border-blue-200',
  도구경계: 'bg-amber-100 text-amber-700 border-amber-200',
  피드백: 'bg-green-100 text-green-700 border-green-200',
};
