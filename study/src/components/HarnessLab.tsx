import { useState } from 'react';
import type { HarnessRule } from '../templates/generateStudyCode';
import {
  DEFAULT_RULES,
  FILE_TYPES,
  PILLAR_COLORS,
  generateFromRules,
} from '../templates/generateStudyCode';
import { generateHarnessTree } from '../templates/generateHarnessTree';

type RightTab = 'code' | 'harness';

export default function HarnessLab() {
  const [rules, setRules] = useState<HarnessRule[]>(
    DEFAULT_RULES.map((r) => ({ ...r })),
  );
  const [fileType, setFileType] = useState<
    'type' | 'hook' | 'component' | 'page'
  >('type');
  const [selectedRuleId, setSelectedRuleId] = useState<string | null>(null);
  const [rightTab, setRightTab] = useState<RightTab>('harness');
  const [openFilePath, setOpenFilePath] = useState<string | null>(null);

  const toggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)),
    );
  };

  const setAll = (enabled: boolean) => {
    setRules((prev) => prev.map((r) => ({ ...r, enabled })));
  };

  const selectRule = (id: string) => {
    setSelectedRuleId((prev) => (prev === id ? null : id));
  };

  const result = generateFromRules(rules, fileType);
  const enabledCount = rules.filter((r) => r.enabled).length;
  // 매 렌더마다 최신 규칙 상태로 트리 생성 (실시간 반영)
  const harnessTree = generateHarnessTree(rules);
  // openFilePath에 해당하는 파일을 최신 트리에서 찾음
  const openFile = openFilePath
    ? harnessTree.find((f) => f.path === openFilePath)
    : null;

  const pillars = ['컨텍스트', 'CI/CD', '도구경계', '피드백'] as const;

  return (
    <div className="space-y-5">
      {/* 상단: 전체 ON/OFF + 탭 전환 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500">
            {enabledCount}/{rules.length} 규칙 활성
          </span>
          <button
            onClick={() => setAll(true)}
            className="px-3 py-1 text-xs bg-green-50 text-green-700 border border-green-200 rounded-md hover:bg-green-100"
          >
            전체 ON
          </button>
          <button
            onClick={() => setAll(false)}
            className="px-3 py-1 text-xs bg-red-50 text-red-700 border border-red-200 rounded-md hover:bg-red-100"
          >
            전체 OFF
          </button>
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
          <button
            onClick={() => setRightTab('harness')}
            className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
              rightTab === 'harness'
                ? 'bg-white text-gray-900 shadow-sm font-medium'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            하네스 파일
          </button>
          <button
            onClick={() => setRightTab('code')}
            className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
              rightTab === 'code'
                ? 'bg-white text-gray-900 shadow-sm font-medium'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            생성 코드
          </button>
        </div>
      </div>

      {/* 2단 레이아웃 */}
      <div className="grid grid-cols-5 gap-4">
        {/* 왼쪽: 규칙 패널 (2칸) */}
        <div className="col-span-2 space-y-3">
          {pillars.map((pillar) => {
            const pillarRules = rules.filter((r) => r.pillar === pillar);
            if (pillarRules.length === 0) return null;
            return (
              <div key={pillar}>
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className={`text-xs px-2 py-0.5 rounded border font-medium ${PILLAR_COLORS[pillar]}`}
                  >
                    {pillar}
                  </span>
                </div>
                <div className="space-y-1">
                  {pillarRules.map((rule) => (
                    <div key={rule.id}>
                      <div
                        className={`flex items-start gap-2 p-2 rounded-lg border transition-all ${
                          rule.enabled
                            ? selectedRuleId === rule.id
                              ? 'bg-blue-50 border-blue-300 shadow-sm'
                              : 'bg-white border-gray-200 shadow-sm'
                            : selectedRuleId === rule.id
                              ? 'bg-red-100 border-red-300'
                              : 'bg-red-50 border-red-200'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={rule.enabled}
                          onChange={() => toggleRule(rule.id)}
                          className="mt-0.5 accent-blue-600 cursor-pointer"
                        />
                        <div
                          className="min-w-0 flex-1 cursor-pointer"
                          onClick={() => selectRule(rule.id)}
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-xs font-medium ${rule.enabled ? 'text-gray-800' : 'text-red-700'}`}
                            >
                              {rule.name}
                            </span>
                            <span
                              className={`text-xs ${selectedRuleId === rule.id ? 'text-blue-500' : 'text-gray-300'}`}
                            >
                              {selectedRuleId === rule.id ? '▼' : '▶'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="text-xs text-gray-500 leading-tight flex-1">
                              {rule.description}
                            </div>
                            <span className="text-xs font-mono text-gray-400 shrink-0">
                              {rule.harnessFile.split('/').pop()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* 선택 시 해당 MD 미리보기 */}
                      {selectedRuleId === rule.id &&
                        (() => {
                          const mdFile = harnessTree.find(
                            (f) => f.path === rule.harnessFile,
                          );
                          if (!mdFile?.content) {
                            return (
                              <div className="mt-1 ml-5 p-2 text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg">
                                이 규칙이 OFF 상태라 harness 파일에 포함되지
                                않았습니다
                              </div>
                            );
                          }
                          return (
                            <div className="mt-1 ml-5 border border-gray-200 rounded-lg overflow-hidden">
                              <div className="bg-gray-50 px-3 py-1.5 border-b border-gray-200 flex items-center justify-between">
                                <span className="text-xs font-mono font-medium text-gray-700">
                                  {rule.harnessFile}
                                </span>
                                <button
                                  onClick={() => {
                                    setRightTab('harness');
                                    setOpenFilePath(rule.harnessFile);
                                  }}
                                  className="text-xs text-blue-600 hover:text-blue-500"
                                >
                                  전체 보기
                                </button>
                              </div>
                              <pre className="p-2.5 text-xs font-mono text-gray-700 bg-white overflow-x-auto leading-relaxed whitespace-pre-wrap max-h-32 overflow-y-auto">
                                {mdFile.content}
                              </pre>
                            </div>
                          );
                        })()}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* 오른쪽 (3칸) */}
        <div className="col-span-3 space-y-3">
          {/* 하네스 파일 탭 */}
          {rightTab === 'harness' && (
            <>
              {/* 파일 트리 */}
              <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
                  <span className="text-xs text-gray-600 font-medium">
                    하네스 파일 구조
                  </span>
                  <span className="text-xs text-gray-400 ml-2">
                    규칙 ON/OFF에 따라 파일이 변합니다
                  </span>
                </div>
                <div className="bg-gray-50 p-3">
                  <div className="text-xs font-mono space-y-0.5">
                    <div className="text-gray-500 font-medium mb-1">
                      project/
                    </div>
                    {harnessTree.map((f) => (
                      <div key={f.path}>
                        {f.type === 'folder' ? (
                          <div className="text-gray-500 ml-2 mt-1.5 font-medium">
                            {f.name}
                          </div>
                        ) : (
                          <button
                            onClick={() =>
                              setOpenFilePath(
                                openFilePath === f.path ? null : f.path,
                              )
                            }
                            className={`block w-full text-left px-2 py-1 rounded transition-colors ${
                              f.path.includes('/') ? 'ml-4' : 'ml-2'
                            } ${
                              openFilePath === f.path
                                ? 'bg-blue-100 text-blue-700'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {f.name}
                            {f.ruleIds.length > 0 && (
                              <span className="ml-1 text-gray-400">
                                ({f.ruleIds.length})
                              </span>
                            )}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 선택된 MD 파일 내용 (아래에 펼침) */}
              {openFile?.content && (
                <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                  <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-gray-300">
                        {openFile.path}
                      </span>
                      {openFile.ruleIds.length > 0 && (
                        <span className="text-xs text-gray-500">
                          {openFile.ruleIds.length}개 규칙 포함
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => setOpenFilePath(null)}
                      className="text-xs text-gray-400 hover:text-gray-200 px-2 py-0.5 rounded hover:bg-gray-700"
                    >
                      닫기
                    </button>
                  </div>
                  <pre className="bg-gray-800 p-4 text-xs font-mono text-gray-300 overflow-auto max-h-[400px] leading-relaxed whitespace-pre-wrap">
                    {openFile.content}
                  </pre>
                </div>
              )}
            </>
          )}

          {/* 생성 코드 탭 */}
          {rightTab === 'code' && (
            <>
              <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                {FILE_TYPES.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setFileType(f.key)}
                    className={`flex-1 px-3 py-1.5 text-xs rounded-md transition-colors ${
                      fileType === f.key
                        ? 'bg-white text-gray-900 shadow-sm font-medium'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
                  <span className="text-xs text-gray-600 font-medium">
                    생성된 코드
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      result.violations.length === 0
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {result.violations.length === 0
                      ? '위반 없음'
                      : `${result.violations.length}건 위반`}
                  </span>
                </div>
                <pre className="bg-gray-800 p-4 text-xs font-mono text-gray-300 overflow-x-auto max-h-[420px] overflow-y-auto leading-relaxed">
                  {result.code}
                </pre>
              </div>

              {result.violations.length > 0 && (
                <div className="border border-red-200 rounded-lg bg-red-50 p-3">
                  <h4 className="text-xs font-semibold text-red-700 mb-2">
                    위반사항 ({result.violations.length}건)
                  </h4>
                  <div className="space-y-1.5">
                    {result.violations.map((v, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs">
                        <span className="text-red-400 shrink-0 mt-px">●</span>
                        <div>
                          <span className="font-medium text-red-800">
                            [{v.rule}]
                          </span>{' '}
                          <span className="text-red-700">{v.message}</span>
                          {v.line > 0 && (
                            <span className="text-red-400 ml-1">
                              (line {v.line})
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.violations.length === 0 && (
                <div className="border border-green-200 rounded-lg bg-green-50 p-3">
                  <div className="flex items-center gap-2 text-xs text-green-700">
                    <span className="text-green-500">●</span>
                    <span className="font-medium">
                      모든 하네스 규칙을 준수하는 코드입니다
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
