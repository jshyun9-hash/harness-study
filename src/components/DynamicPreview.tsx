import { useState } from 'react';
import type { FieldDefinition, UIFramework } from '../types';

type PreviewTab = 'list' | 'detail' | 'form';

interface Props {
  typeName: string;
  fields: FieldDefinition[];
  uiFramework: UIFramework;
}

function generateSampleData(
  fields: FieldDefinition[],
  count: number,
): Record<string, unknown>[] {
  return Array.from({ length: count }, (_, i) => {
    const row: Record<string, unknown> = {};
    for (const f of fields) {
      switch (f.type) {
        case 'number':
          row[f.label] =
            f.label === 'id' ? i + 1 : Math.floor(Math.random() * 100);
          break;
        case 'boolean':
          row[f.label] = i % 2 === 0;
          break;
        case 'Date':
          row[f.label] = new Date(Date.now() - i * 86400000).toLocaleDateString(
            'ko-KR',
          );
          break;
        case 'string[]':
          row[f.label] = ['태그1', '태그2'].slice(0, (i % 2) + 1).join(', ');
          break;
        default:
          row[f.label] = `${f.label}_${i + 1}`;
      }
    }
    return row;
  });
}

const UI_THEME: Record<
  UIFramework,
  {
    accent: string;
    border: string;
    bg: string;
    headerBg: string;
    btnClass: string;
  }
> = {
  tailwind: {
    accent: '#3b82f6',
    border: '#e5e7eb',
    bg: '#ffffff',
    headerBg: '#f9fafb',
    btnClass: 'bg-blue-500 text-white',
  },
  shadcn: {
    accent: '#18181b',
    border: '#e4e4e7',
    bg: '#ffffff',
    headerBg: '#fafafa',
    btnClass: 'bg-zinc-900 text-white',
  },
  mui: {
    accent: '#1976d2',
    border: '#e0e0e0',
    bg: '#ffffff',
    headerBg: '#f5f5f5',
    btnClass: 'bg-blue-600 text-white',
  },
  antdesign: {
    accent: '#1677ff',
    border: '#d9d9d9',
    bg: '#ffffff',
    headerBg: '#fafafa',
    btnClass: 'bg-blue-500 text-white',
  },
  chakra: {
    accent: '#3182ce',
    border: '#e2e8f0',
    bg: '#ffffff',
    headerBg: '#f7fafc',
    btnClass: 'bg-teal-500 text-white',
  },
};

export default function DynamicPreview({
  typeName,
  fields,
  uiFramework,
}: Props) {
  const [tab, setTab] = useState<PreviewTab>('list');
  const theme = UI_THEME[uiFramework];
  const sampleData = generateSampleData(fields, 5);
  const singleItem = sampleData[0];

  const tabs: { key: PreviewTab; label: string }[] = [
    { key: 'list', label: '목록' },
    { key: 'detail', label: '상세' },
    { key: 'form', label: '작성/수정' },
  ];

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden">
      {/* Preview Header */}
      <div className="flex items-center justify-between bg-gray-800 px-4 py-2 border-b border-gray-700">
        <span className="text-xs text-gray-400">
          미리보기 — {typeName} · {uiFramework}
        </span>
        <div className="flex gap-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-3 py-1 text-xs rounded transition-colors ${
                tab === t.key
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Preview Body - 밝은 배경으로 실제 서비스처럼 보이게 */}
      <div className="p-6" style={{ background: theme.bg, color: '#111' }}>
        {tab === 'list' && (
          <div>
            {/* 헤더 영역 */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">{typeName} 목록</h2>
              <button
                className="px-4 py-2 rounded text-sm font-medium text-white"
                style={{ background: theme.accent }}
              >
                새 글 작성
              </button>
            </div>

            {/* 검색 */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="검색어를 입력하세요"
                className="flex-1 px-3 py-2 text-sm rounded"
                style={{ border: `1px solid ${theme.border}` }}
                readOnly
              />
              <button
                className="px-4 py-2 text-sm rounded text-white"
                style={{ background: theme.accent }}
              >
                검색
              </button>
            </div>

            {/* 테이블 */}
            <table
              className="w-full text-sm"
              style={{ borderCollapse: 'collapse' }}
            >
              <thead>
                <tr style={{ background: theme.headerBg }}>
                  {fields.map((f) => (
                    <th
                      key={f.id}
                      className="px-3 py-2 text-left font-medium text-gray-600"
                      style={{ borderBottom: `2px solid ${theme.border}` }}
                    >
                      {f.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sampleData.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50 cursor-pointer">
                    {fields.map((f) => (
                      <td
                        key={f.id}
                        className="px-3 py-2"
                        style={{ borderBottom: `1px solid ${theme.border}` }}
                      >
                        {f.type === 'boolean'
                          ? row[f.label]
                            ? 'Y'
                            : 'N'
                          : String(row[f.label] ?? '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 페이지네이션 */}
            <div className="flex justify-center gap-1 mt-4">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  className="w-8 h-8 text-sm rounded"
                  style={{
                    background: n === 1 ? theme.accent : 'transparent',
                    color: n === 1 ? '#fff' : '#666',
                    border: `1px solid ${n === 1 ? theme.accent : theme.border}`,
                  }}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        )}

        {tab === 'detail' && singleItem && (
          <div>
            <h2 className="text-lg font-bold mb-4">{typeName} 상세</h2>
            <div
              className="rounded-lg p-4 mb-4"
              style={{ border: `1px solid ${theme.border}` }}
            >
              {fields.map((f) => (
                <div
                  key={f.id}
                  className="flex py-2"
                  style={{ borderBottom: `1px solid ${theme.border}` }}
                >
                  <span className="w-32 text-sm font-medium text-gray-500">
                    {f.label}
                  </span>
                  <span className="text-sm">
                    {f.type === 'boolean'
                      ? singleItem[f.label]
                        ? 'Y'
                        : 'N'
                      : String(singleItem[f.label] ?? '')}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                className="px-4 py-2 text-sm rounded text-white"
                style={{ background: theme.accent }}
              >
                수정
              </button>
              <button
                className="px-4 py-2 text-sm rounded"
                style={{ border: `1px solid ${theme.border}`, color: '#666' }}
              >
                삭제
              </button>
              <button
                className="px-4 py-2 text-sm rounded"
                style={{ border: `1px solid ${theme.border}`, color: '#666' }}
              >
                목록으로
              </button>
            </div>
          </div>
        )}

        {tab === 'form' && (
          <div>
            <h2 className="text-lg font-bold mb-4">{typeName} 작성</h2>
            <div className="space-y-4">
              {fields
                .filter((f) => f.label !== 'id' && f.type !== 'Date')
                .map((f) => (
                  <div key={f.id}>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      {f.label}
                    </label>
                    {f.type === 'boolean' ? (
                      <input type="checkbox" className="w-4 h-4" />
                    ) : f.label === 'content' ? (
                      <textarea
                        className="w-full px-3 py-2 text-sm rounded resize-none h-32"
                        style={{ border: `1px solid ${theme.border}` }}
                        placeholder={`${f.label}을(를) 입력하세요`}
                        readOnly
                      />
                    ) : (
                      <input
                        type={f.type === 'number' ? 'number' : 'text'}
                        className="w-full px-3 py-2 text-sm rounded"
                        style={{ border: `1px solid ${theme.border}` }}
                        placeholder={`${f.label}을(를) 입력하세요`}
                        readOnly
                      />
                    )}
                  </div>
                ))}
            </div>
            <div className="flex gap-2 mt-6">
              <button
                className="px-6 py-2 text-sm rounded text-white"
                style={{ background: theme.accent }}
              >
                저장
              </button>
              <button
                className="px-6 py-2 text-sm rounded"
                style={{ border: `1px solid ${theme.border}`, color: '#666' }}
              >
                취소
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
