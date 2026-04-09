import type { FieldDefinition, UIFramework } from '../types';

interface GeneratedFile {
  path: string;
  content: string;
}

export function generateCode(params: {
  typeName: string;
  fields: FieldDefinition[];
  uiFramework: UIFramework;
}): GeneratedFile[] {
  const { typeName, fields, uiFramework } = params;
  const files: GeneratedFile[] = [];

  files.push({
    path: `types/${typeName}.ts`,
    content: generateTypeFile(typeName, fields),
  });

  files.push({
    path: `hooks/use${typeName}.ts`,
    content: generateHookFile(typeName),
  });

  files.push({
    path: `components/${typeName}Table.tsx`,
    content: generateTableComponent(typeName, fields, uiFramework),
  });

  files.push({
    path: `components/${typeName}Form.tsx`,
    content: generateFormComponent(typeName, fields, uiFramework),
  });

  files.push({
    path: `pages/${typeName}ListPage.tsx`,
    content: generateListPage(typeName, uiFramework),
  });

  files.push({
    path: `pages/${typeName}DetailPage.tsx`,
    content: generateDetailPage(typeName, fields, uiFramework),
  });

  files.push({
    path: `pages/${typeName}FormPage.tsx`,
    content: generateFormPage(typeName),
  });

  return files;
}

function generateTypeFile(typeName: string, fields: FieldDefinition[]): string {
  const props = fields.map((f) => `  ${f.label}: ${f.type};`).join('\n');
  return `export interface ${typeName} {
${props}
}

export interface ${typeName}ListParams {
  page: number;
  size: number;
  keyword?: string;
  sort?: 'latest' | 'oldest';
}
`;
}

function generateHookFile(typeName: string): string {
  const lower = typeName.toLowerCase();
  return `import { useState, useEffect, useCallback } from 'react';
import type { ${typeName}, ${typeName}ListParams } from '../types/${typeName}';

const MOCK_API_DELAY = 300;

export function use${typeName}() {
  const [items, setItems] = useState<${typeName}[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchList = useCallback(async (params: ${typeName}ListParams) => {
    setLoading(true);
    // TODO: 실제 API 연동
    await new Promise((r) => setTimeout(r, MOCK_API_DELAY));
    console.log('fetch ${lower} list', params);
    setLoading(false);
  }, []);

  const fetchDetail = useCallback(async (id: number) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, MOCK_API_DELAY));
    console.log('fetch ${lower} detail', id);
    setLoading(false);
    return null as ${typeName} | null;
  }, []);

  const create = useCallback(async (data: Omit<${typeName}, 'id'>) => {
    await new Promise((r) => setTimeout(r, MOCK_API_DELAY));
    console.log('create ${lower}', data);
  }, []);

  const update = useCallback(async (id: number, data: Partial<${typeName}>) => {
    await new Promise((r) => setTimeout(r, MOCK_API_DELAY));
    console.log('update ${lower}', id, data);
  }, []);

  const remove = useCallback(async (id: number) => {
    await new Promise((r) => setTimeout(r, MOCK_API_DELAY));
    console.log('remove ${lower}', id);
  }, []);

  useEffect(() => {
    fetchList({ page: 1, size: 10 });
  }, [fetchList]);

  return { items, loading, total, fetchList, fetchDetail, create, update, remove };
}
`;
}

function getImportStatement(uiFramework: UIFramework): string {
  switch (uiFramework) {
    case 'tailwind':
      return '// Tailwind CSS - 별도 import 불필요';
    case 'shadcn':
      return "import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';\nimport { Button } from '@/components/ui/button';\nimport { Input } from '@/components/ui/input';";
    case 'mui':
      return "import { Table, TableBody, TableCell, TableHead, TableRow, Button, TextField, Pagination } from '@mui/material';";
    case 'antdesign':
      return "import { Table, Button, Input, Space } from 'antd';\nimport type { ColumnsType } from 'antd/es/table';";
    case 'chakra':
      return "import { Table, Thead, Tbody, Tr, Th, Td, Button, Input, HStack } from '@chakra-ui/react';";
  }
}

function generateTableComponent(
  typeName: string,
  fields: FieldDefinition[],
  uiFramework: UIFramework,
): string {
  const headers = fields
    .map(
      (f) =>
        `          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">${f.label}</th>`,
    )
    .join('\n');
  const cells = fields
    .map(
      (f) =>
        `            <td className="px-4 py-3 text-sm">{String(item.${f.label})}</td>`,
    )
    .join('\n');

  return `import type { ${typeName} } from '../types/${typeName}';
${getImportStatement(uiFramework)}

interface Props {
  items: ${typeName}[];
  onRowClick?: (item: ${typeName}) => void;
}

export default function ${typeName}Table({ items, onRowClick }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b-2 border-gray-200">
${headers}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.id}
              className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
              onClick={() => onRowClick?.(item)}
            >
${cells}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
`;
}

function generateFormComponent(
  typeName: string,
  fields: FieldDefinition[],
  uiFramework: UIFramework,
): string {
  const editableFields = fields.filter(
    (f) => f.label !== 'id' && f.type !== 'Date',
  );

  const formFields = editableFields
    .map((f) => {
      if (f.type === 'boolean') {
        return `      <div>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="${f.label}" className="w-4 h-4" />
          <span className="text-sm font-medium text-gray-700">${f.label}</span>
        </label>
      </div>`;
      }
      if (f.label === 'content') {
        return `      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">${f.label}</label>
        <textarea
          name="${f.label}"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm resize-none h-32"
          placeholder="${f.label}을(를) 입력하세요"
        />
      </div>`;
      }
      return `      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">${f.label}</label>
        <input
          type="${f.type === 'number' ? 'number' : 'text'}"
          name="${f.label}"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          placeholder="${f.label}을(를) 입력하세요"
        />
      </div>`;
    })
    .join('\n');

  return `import type { ${typeName} } from '../types/${typeName}';
${getImportStatement(uiFramework)}

interface Props {
  initialData?: ${typeName};
  onSubmit: (data: Omit<${typeName}, 'id'>) => void;
  onCancel: () => void;
}

export default function ${typeName}Form({ initialData, onSubmit, onCancel }: Props) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 폼 데이터 수집 및 유효성 검사
    console.log('submit', initialData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
${formFields}
      <div className="flex gap-2 pt-4">
        <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600">
          저장
        </button>
        <button type="button" onClick={onCancel} className="px-6 py-2 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50">
          취소
        </button>
      </div>
    </form>
  );
}
`;
}

function generateListPage(typeName: string, uiFramework: UIFramework): string {
  return `import { useState } from 'react';
import ${typeName}Table from '../components/${typeName}Table';
import { use${typeName} } from '../hooks/use${typeName}';
import type { ${typeName} } from '../types/${typeName}';
${getImportStatement(uiFramework)}

export default function ${typeName}ListPage() {
  const { items, loading } = use${typeName}();
  const [keyword, setKeyword] = useState('');

  const handleRowClick = (item: ${typeName}) => {
    // TODO: 상세 페이지로 이동
    console.log('navigate to detail', item.id);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">${typeName} 목록</h1>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600">
          새 글 작성
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="검색어를 입력하세요"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
        />
        <button className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600">
          검색
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500 py-8">로딩 중...</p>
      ) : (
        <${typeName}Table items={items} onRowClick={handleRowClick} />
      )}
    </div>
  );
}
`;
}

function generateDetailPage(
  typeName: string,
  fields: FieldDefinition[],
  uiFramework: UIFramework,
): string {
  const fieldRows = fields
    .map(
      (f) =>
        `          <div className="flex py-3 border-b border-gray-100">
            <span className="w-32 text-sm font-medium text-gray-500">${f.label}</span>
            <span className="text-sm">{String(item.${f.label})}</span>
          </div>`,
    )
    .join('\n');

  return `import { useEffect, useState } from 'react';
import { use${typeName} } from '../hooks/use${typeName}';
import type { ${typeName} } from '../types/${typeName}';
${getImportStatement(uiFramework)}

interface Props {
  id: number;
}

export default function ${typeName}DetailPage({ id }: Props) {
  const { fetchDetail, remove } = use${typeName}();
  const [item, setItem] = useState<${typeName} | null>(null);

  useEffect(() => {
    fetchDetail(id).then(setItem);
  }, [id, fetchDetail]);

  if (!item) return <p className="text-center text-gray-500 py-8">로딩 중...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">${typeName} 상세</h1>
      <div className="border border-gray-200 rounded-lg p-4 mb-6">
${fieldRows}
      </div>
      <div className="flex gap-2">
        <button className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600">
          수정
        </button>
        <button
          onClick={() => remove(id)}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50"
        >
          삭제
        </button>
        <button className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50">
          목록으로
        </button>
      </div>
    </div>
  );
}
`;
}

function generateFormPage(typeName: string): string {
  return `import ${typeName}Form from '../components/${typeName}Form';
import type { ${typeName} } from '../types/${typeName}';

interface Props {
  initialData?: ${typeName};
}

export default function ${typeName}FormPage({ initialData }: Props) {
  const handleSubmit = (data: Omit<${typeName}, 'id'>) => {
    // TODO: API 호출
    console.log('submit', data);
  };

  const handleCancel = () => {
    // TODO: 목록으로 이동
    console.log('cancel');
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        {initialData ? '수정' : '작성'}
      </h1>
      <${typeName}Form
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}
`;
}
