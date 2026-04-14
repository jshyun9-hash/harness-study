import { useState } from 'react';
import { HARNESS_DOCS, getStackSummary } from './harnessLoader';
import {
  FIELD_TYPES,
  generateSpecMd,
  inferSpec,
  inferSearchFields,
  inferFormFields,
} from './specGenerator';
import { inferWithGemini, refineWithGemini, getPromptStats } from './geminiApi';
import type { RelatedFeature } from './geminiApi';
import type {
  FieldSpec,
  SearchFieldSpec,
  FormFieldSpec,
} from './specGenerator';

type View = 'generator' | 'files';
type Step = 'input' | 'fields' | 'search-form' | 'result';

export default function App() {
  const [view, setView] = useState<View>('generator');
  const [step, setStep] = useState<Step>('input');
  const [description, setDescription] = useState('');
  const [featureName, setFeatureName] = useState('');
  const [fields, setFields] = useState<FieldSpec[]>([]);
  const [searchFields, setSearchFields] = useState<SearchFieldSpec[]>([]);
  const [formFields, setFormFields] = useState<FormFieldSpec[]>([]);
  const [relatedFeatures, setRelatedFeatures] = useState<RelatedFeature[]>([]);
  const [generated, setGenerated] = useState('');
  const [copied, setCopied] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const stack = getStackSummary();

  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // 로컬 키워드 기반 추론
  const handleInfer = () => {
    if (!description.trim()) return;
    const result = inferSpec(description);
    setFeatureName(result.featureName);
    setFields(result.fields);
    setSearchFields(inferSearchFields(result.fields));
    setFormFields(inferFormFields(result.fields));
    setGenerated('');
    setStep('fields');
  };

  // AI 기반 추론 (Gemini 직접 호출 — 백엔드 불필요)
  const handleAiInfer = async () => {
    if (!description.trim()) return;
    setAiLoading(true);
    setAiError(null);
    try {
      const result = await inferWithGemini(description);
      const aiFields: FieldSpec[] = result.fields.map((f) => ({
        id: Math.random().toString(36).slice(2, 10),
        name: f.name,
        type: f.type,
        label: f.label,
        required: f.required,
      }));
      setFeatureName(result.featureName);
      setFields(aiFields);
      setSearchFields(inferSearchFields(aiFields));
      setFormFields(inferFormFields(aiFields));
      setRelatedFeatures(result.relatedFeatures ?? []);
      setGenerated('');
      setStep('fields');
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'AI 호출 실패');
    } finally {
      setAiLoading(false);
    }
  };

  const [refineFeedback, setRefineFeedback] = useState('');
  const [refineLoading, setRefineLoading] = useState(false);

  // AI 보완 요청 (현재 상태 + 피드백 → 수정된 결과)
  const handleRefine = async () => {
    if (!refineFeedback.trim()) return;
    setRefineLoading(true);
    setAiError(null);
    try {
      const currentState = {
        featureName,
        fields: fields.map((f) => ({
          name: f.name,
          type: f.type,
          label: f.label,
          required: f.required,
        })),
        relatedFeatures,
      };
      const result = await refineWithGemini(currentState, refineFeedback);
      const aiFields: FieldSpec[] = result.fields.map((f) => ({
        id: Math.random().toString(36).slice(2, 10),
        name: f.name,
        type: f.type,
        label: f.label,
        required: f.required,
      }));
      setFeatureName(result.featureName);
      setFields(aiFields);
      setSearchFields(inferSearchFields(aiFields));
      setFormFields(inferFormFields(aiFields));
      setRelatedFeatures(result.relatedFeatures ?? []);
      setRefineFeedback('');
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'AI 보완 요청 실패');
    } finally {
      setRefineLoading(false);
    }
  };

  const promptStats = getPromptStats();

  const handleGoToSearchForm = () => {
    // 필드가 변경됐으면 검색/폼 추론 갱신
    setSearchFields(inferSearchFields(fields));
    setFormFields(inferFormFields(fields));
    setStep('search-form');
  };

  const toggleSearchField = (fieldKey: string) => {
    setSearchFields((prev) =>
      prev.map((f) =>
        f.fieldKey === fieldKey ? { ...f, enabled: !f.enabled } : f,
      ),
    );
  };

  const handleAddField = () => {
    setFields((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).slice(2, 10),
        name: '',
        type: 'String',
        label: '',
        required: false,
      },
    ]);
  };

  const updateField = (
    id: string,
    key: keyof FieldSpec,
    value: string | boolean,
  ) => {
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [key]: value } : f)),
    );
  };

  const removeField = (id: string) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
  };

  const handleGenerate = () => {
    if (!featureName.trim() || fields.length === 0) return;
    const md = generateSpecMd({
      featureName,
      description,
      fields,
      searchFields,
      formFields,
      relatedFeatures,
    });
    setGenerated(md);
    setStep('result');
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generated);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentDoc = selectedFile
    ? HARNESS_DOCS.find((d) => d.path === selectedFile)
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-[#1e3a5f] text-white px-6 py-3 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold tracking-tight">
              Harness Studio — Spec Tool
            </h1>
            <p className="text-xs text-white/70">
              하네스 기반 기능 명세 MD 생성기
            </p>
          </div>
          <nav className="flex gap-1 bg-white/10 rounded-lg p-0.5">
            <button
              onClick={() => setView('generator')}
              className={`px-3 py-1.5 text-xs rounded-md ${
                view === 'generator'
                  ? 'bg-white text-[#1e3a5f] font-medium'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              명세 생성
            </button>
            <button
              onClick={() => setView('files')}
              className={`px-3 py-1.5 text-xs rounded-md ${
                view === 'files'
                  ? 'bg-white text-[#1e3a5f] font-medium'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              하네스 파일 ({HARNESS_DOCS.length})
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-6">
        {view === 'generator' && (
          <div className="space-y-6">
            {/* 스텝 표시 */}
            <div className="flex items-center gap-1 text-sm">
              {[
                { key: 'input', label: '1. 요구사항' },
                { key: 'fields', label: '2. 필드 정의' },
                { key: 'search-form', label: '3. 검색/폼 설정' },
                { key: 'result', label: '4. MD 생성' },
              ].map((s, i) => (
                <div key={s.key} className="flex items-center">
                  {i > 0 && <span className="text-gray-300 mx-1">→</span>}
                  <span
                    className={`px-2 py-0.5 rounded ${
                      step === s.key
                        ? 'bg-[#1e3a5f] text-white font-medium'
                        : 'text-gray-400'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
              <div className="ml-auto">
                <span className="text-xs text-gray-400">
                  하네스 {HARNESS_DOCS.length}개 |{' '}
                  {stack.frontend.split('+')[0].trim()} +{' '}
                  {stack.backend.split('+')[0].trim()}
                </span>
              </div>
            </div>

            {/* Step 1: 요구사항 입력 */}
            {step === 'input' && (
              <div className="max-w-2xl">
                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                  <h2 className="text-base font-semibold text-gray-800 mb-3">
                    요구사항 입력
                  </h2>
                  <textarea
                    className="w-full h-32 bg-white border border-gray-300 rounded-md p-3 text-sm text-gray-700 focus:outline-none focus:border-[#1e3a5f] focus:ring-1 focus:ring-[#1e3a5f] resize-none"
                    placeholder="예: 조회수와 좋아요가 있는 공지사항 게시판. 고정 기능과 카테고리 분류 필요."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={handleInfer}
                      disabled={!description.trim()}
                      className="px-5 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 rounded-md text-sm font-medium"
                    >
                      키워드 추론
                    </button>
                    <button
                      onClick={handleAiInfer}
                      disabled={!description.trim() || aiLoading}
                      className="px-5 py-2 bg-[#b8860b] hover:bg-[#a67809] disabled:bg-gray-300 text-white rounded-md text-sm font-medium"
                    >
                      {aiLoading ? 'AI 분석 중...' : 'AI 추론 (Gemini) →'}
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-gray-400">
                    AI 추론 시 하네스 {promptStats.fileCount}개 파일 (~
                    {Math.round(promptStats.charCount / 1000)}KB) 전송
                  </p>
                  {aiError && (
                    <p className="mt-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded p-2">
                      {aiError}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: 필드 정의 */}
            {step === 'fields' && (
              <div className="max-w-3xl">
                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                  <h2 className="text-base font-semibold text-gray-800 mb-3">
                    기능명 + 필드 정의
                  </h2>

                  <div className="mb-4">
                    <label className="text-xs font-medium text-gray-600 block mb-1">
                      기능명 (PascalCase)
                    </label>
                    <input
                      type="text"
                      value={featureName}
                      onChange={(e) => setFeatureName(e.target.value)}
                      className="w-64 bg-white border border-gray-300 rounded-md px-3 py-2 text-sm font-mono text-gray-700 focus:outline-none focus:border-[#1e3a5f] focus:ring-1 focus:ring-[#1e3a5f]"
                    />
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium text-gray-600">
                      필드 ({fields.length})
                    </label>
                    <button
                      onClick={handleAddField}
                      className="text-xs text-[#1e3a5f] hover:underline"
                    >
                      + 추가
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    {fields.map((f) => (
                      <div
                        key={f.id}
                        className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-md p-1.5"
                      >
                        <input
                          value={f.name}
                          onChange={(e) =>
                            updateField(f.id, 'name', e.target.value)
                          }
                          placeholder="name"
                          className="flex-1 min-w-0 border border-gray-300 rounded px-2 py-1 text-xs font-mono"
                        />
                        <select
                          value={f.type}
                          onChange={(e) =>
                            updateField(f.id, 'type', e.target.value)
                          }
                          className="bg-white border border-gray-300 rounded px-1 py-1 text-xs font-mono"
                        >
                          {FIELD_TYPES.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                        <input
                          value={f.label}
                          onChange={(e) =>
                            updateField(f.id, 'label', e.target.value)
                          }
                          placeholder="라벨"
                          className="w-20 border border-gray-300 rounded px-2 py-1 text-xs"
                        />
                        <label className="flex items-center gap-1 text-xs text-gray-500">
                          <input
                            type="checkbox"
                            checked={f.required}
                            onChange={(e) =>
                              updateField(f.id, 'required', e.target.checked)
                            }
                            className="accent-[#1e3a5f]"
                          />
                          필수
                        </label>
                        <button
                          onClick={() => removeField(f.id)}
                          className="text-gray-400 hover:text-red-500 px-1"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* 연관 기능 편집 */}
                  {relatedFeatures.length > 0 &&
                    relatedFeatures.map((rf, rfIdx) => (
                      <div
                        key={rf.name}
                        className="mt-4 bg-[#fdf6e3] border border-[#d4a843] rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-[#b8860b]">
                              연관 기능
                            </span>
                            <input
                              value={rf.name}
                              onChange={(e) => {
                                const updated = [...relatedFeatures];
                                updated[rfIdx] = {
                                  ...rf,
                                  name: e.target.value,
                                };
                                setRelatedFeatures(updated);
                              }}
                              className="bg-white border border-[#d4a843]/50 rounded px-2 py-1 text-sm font-mono w-32"
                            />
                            <input
                              value={rf.description}
                              onChange={(e) => {
                                const updated = [...relatedFeatures];
                                updated[rfIdx] = {
                                  ...rf,
                                  description: e.target.value,
                                };
                                setRelatedFeatures(updated);
                              }}
                              placeholder="설명"
                              className="bg-white border border-[#d4a843]/50 rounded px-2 py-1 text-xs w-48"
                            />
                          </div>
                          <button
                            onClick={() =>
                              setRelatedFeatures((prev) =>
                                prev.filter((_, i) => i !== rfIdx),
                              )
                            }
                            className="text-[#b8860b] hover:text-red-500 text-xs"
                          >
                            연관 기능 제거
                          </button>
                        </div>

                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-[#b8860b]">
                            필드 ({rf.fields.length})
                          </span>
                          <button
                            onClick={() => {
                              const updated = [...relatedFeatures];
                              updated[rfIdx] = {
                                ...rf,
                                fields: [
                                  ...rf.fields,
                                  {
                                    name: '',
                                    type: 'String',
                                    label: '',
                                    required: false,
                                  },
                                ],
                              };
                              setRelatedFeatures(updated);
                            }}
                            className="text-xs text-[#b8860b] hover:underline"
                          >
                            + 추가
                          </button>
                        </div>

                        <div className="space-y-1">
                          {rf.fields.map((f, fIdx) => (
                            <div
                              key={fIdx}
                              className="flex items-center gap-1.5 bg-white/70 border border-[#d4a843]/30 rounded-md p-1.5"
                            >
                              <input
                                value={f.name}
                                onChange={(e) => {
                                  const updated = [...relatedFeatures];
                                  const newFields = [...rf.fields];
                                  newFields[fIdx] = {
                                    ...f,
                                    name: e.target.value,
                                  };
                                  updated[rfIdx] = { ...rf, fields: newFields };
                                  setRelatedFeatures(updated);
                                }}
                                placeholder="name"
                                className="flex-1 min-w-0 border border-gray-300 rounded px-2 py-1 text-xs font-mono"
                              />
                              <select
                                value={f.type}
                                onChange={(e) => {
                                  const updated = [...relatedFeatures];
                                  const newFields = [...rf.fields];
                                  newFields[fIdx] = {
                                    ...f,
                                    type: e.target.value,
                                  };
                                  updated[rfIdx] = { ...rf, fields: newFields };
                                  setRelatedFeatures(updated);
                                }}
                                className="bg-white border border-gray-300 rounded px-1 py-1 text-xs font-mono"
                              >
                                {FIELD_TYPES.map((t) => (
                                  <option key={t} value={t}>
                                    {t}
                                  </option>
                                ))}
                              </select>
                              <input
                                value={f.label}
                                onChange={(e) => {
                                  const updated = [...relatedFeatures];
                                  const newFields = [...rf.fields];
                                  newFields[fIdx] = {
                                    ...f,
                                    label: e.target.value,
                                  };
                                  updated[rfIdx] = { ...rf, fields: newFields };
                                  setRelatedFeatures(updated);
                                }}
                                placeholder="라벨"
                                className="w-20 border border-gray-300 rounded px-2 py-1 text-xs"
                              />
                              <label className="flex items-center gap-1 text-xs text-gray-500">
                                <input
                                  type="checkbox"
                                  checked={f.required}
                                  onChange={(e) => {
                                    const updated = [...relatedFeatures];
                                    const newFields = [...rf.fields];
                                    newFields[fIdx] = {
                                      ...f,
                                      required: e.target.checked,
                                    };
                                    updated[rfIdx] = {
                                      ...rf,
                                      fields: newFields,
                                    };
                                    setRelatedFeatures(updated);
                                  }}
                                  className="accent-[#b8860b]"
                                />
                                필수
                              </label>
                              <button
                                onClick={() => {
                                  const updated = [...relatedFeatures];
                                  updated[rfIdx] = {
                                    ...rf,
                                    fields: rf.fields.filter(
                                      (_, i) => i !== fIdx,
                                    ),
                                  };
                                  setRelatedFeatures(updated);
                                }}
                                className="text-gray-400 hover:text-red-500 px-1"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                  {/* AI 보완 요청 */}
                  <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="text-xs font-semibold text-gray-700 mb-2">
                      AI에게 보완 요청
                    </h4>
                    <div className="flex gap-2">
                      <input
                        value={refineFeedback}
                        onChange={(e) => setRefineFeedback(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !refineLoading) {
                            e.preventDefault();
                            handleRefine();
                          }
                        }}
                        placeholder="예: 첨부파일 기능도 추가해줘 / 카테고리를 enum으로 / 대댓글도 필요해"
                        className="flex-1 bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#b8860b] focus:ring-1 focus:ring-[#b8860b]"
                      />
                      <button
                        onClick={handleRefine}
                        disabled={!refineFeedback.trim() || refineLoading}
                        className="px-4 py-2 bg-[#b8860b] hover:bg-[#a67809] disabled:bg-gray-300 text-white rounded-md text-sm font-medium shrink-0"
                      >
                        {refineLoading ? '분석 중...' : 'AI 보완'}
                      </button>
                    </div>
                    {aiError && (
                      <p className="mt-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded p-2">
                        {aiError}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => setStep('input')}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm"
                    >
                      ← 이전
                    </button>
                    <button
                      onClick={handleGoToSearchForm}
                      disabled={!featureName.trim() || fields.length === 0}
                      className="px-5 py-2 bg-[#1e3a5f] hover:bg-[#2d4a6f] disabled:bg-gray-300 text-white rounded-md text-sm font-medium"
                    >
                      검색/폼 설정 →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: 검색/폼 설정 */}
            {step === 'search-form' && (
              <div className="grid grid-cols-2 gap-6">
                {/* 검색 필드 선택 */}
                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                  <h2 className="text-base font-semibold text-gray-800 mb-1">
                    검색 조건 (SearchCard)
                  </h2>
                  <p className="text-xs text-gray-500 mb-4">
                    체크하면 검색 카드에 포함됩니다
                  </p>
                  <div className="space-y-2">
                    {searchFields.map((sf) => (
                      <label
                        key={sf.fieldKey}
                        className={`flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-all ${
                          sf.enabled
                            ? 'bg-[#f0f4f8] border-[#1e3a5f]/30'
                            : 'bg-white border-gray-200'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={sf.enabled}
                          onChange={() => toggleSearchField(sf.fieldKey)}
                          className="accent-[#1e3a5f]"
                        />
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-800">
                            {sf.label}
                          </span>
                          <span className="text-xs text-gray-400 font-mono ml-2">
                            {sf.fieldKey}
                          </span>
                        </div>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-mono">
                          {sf.searchType}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 폼 필드 표시 (읽기 전용) */}
                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                  <h2 className="text-base font-semibold text-gray-800 mb-1">
                    입력/수정 폼 (FormCard)
                  </h2>
                  <p className="text-xs text-gray-500 mb-4">
                    필드 정의를 기반으로 자동 구성됩니다
                  </p>
                  <div className="space-y-2">
                    {formFields.map((ff) => {
                      const field = fields.find((f) => f.name === ff.fieldKey);
                      return (
                        <div
                          key={ff.fieldKey}
                          className={`flex items-center gap-3 p-2.5 rounded-lg border ${
                            ff.enabled
                              ? 'bg-[#f0f4f8] border-[#1e3a5f]/30'
                              : 'bg-gray-50 border-gray-200 opacity-50'
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              ff.enabled ? 'bg-[#1e3a5f]' : 'bg-gray-300'
                            }`}
                          />
                          <div className="flex-1">
                            <span className="text-sm font-medium text-gray-800">
                              {ff.label}
                            </span>
                            <span className="text-xs text-gray-400 font-mono ml-2">
                              {ff.fieldKey}
                            </span>
                            {field?.required && (
                              <span className="text-xs text-red-500 ml-1">
                                *필수
                              </span>
                            )}
                          </div>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-mono">
                            {ff.formType}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 하단 버튼 */}
                <div className="col-span-2 flex gap-2">
                  <button
                    onClick={() => setStep('fields')}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm"
                  >
                    ← 이전
                  </button>
                  <button
                    onClick={handleGenerate}
                    className="px-5 py-2 bg-[#b8860b] hover:bg-[#a67809] text-white rounded-md text-sm font-medium"
                  >
                    명세 MD 생성 →
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: 결과 */}
            {step === 'result' && generated && (
              <div>
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-800">
                        생성된 명세 MD
                      </h3>
                      <p className="text-xs text-gray-500">
                        복사해서 Claude Code 채팅에 붙여넣으세요
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setStep('search-form')}
                        className="px-3 py-2 border border-gray-300 text-gray-700 rounded-md text-xs"
                      >
                        ← 수정
                      </button>
                      <button
                        onClick={handleCopy}
                        className={`px-4 py-2 rounded-md text-xs font-medium transition-colors ${
                          copied
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-[#1e3a5f] text-white hover:bg-[#2d4a6f]'
                        }`}
                      >
                        {copied ? '✓ 복사됨!' : '클립보드에 복사'}
                      </button>
                    </div>
                  </div>
                  <pre className="bg-gray-800 p-4 text-xs font-mono text-gray-300 overflow-auto max-h-[calc(100vh-240px)] leading-relaxed whitespace-pre-wrap">
                    {generated}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}

        {view === 'files' && (
          <div className="grid grid-cols-4 gap-4">
            {/* 파일 트리 */}
            <div className="col-span-1 bg-white border border-gray-200 rounded-lg shadow-sm p-3">
              <h3 className="text-xs font-semibold text-gray-700 mb-2 px-2">
                studio/
              </h3>
              <div className="space-y-0.5 text-sm">
                {['root', 'harness', 'skills'].map((group) => (
                  <div key={group}>
                    {group !== 'root' && (
                      <div className="text-xs font-medium text-gray-500 px-2 py-1 mt-2">
                        {group}/
                      </div>
                    )}
                    {HARNESS_DOCS.filter((d) => d.group === group).map((d) => (
                      <button
                        key={d.path}
                        onClick={() => setSelectedFile(d.path)}
                        className={`w-full text-left px-2 py-1.5 rounded text-xs font-mono ${
                          selectedFile === d.path
                            ? 'bg-[#f0f4f8] text-[#1e3a5f] font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                        } ${group !== 'root' ? 'ml-3' : ''}`}
                      >
                        {d.name}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* 파일 내용 */}
            <div className="col-span-3">
              {currentDoc ? (
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                    <span className="text-xs font-mono font-medium text-gray-700">
                      {currentDoc.path}
                    </span>
                    <span className="text-xs text-gray-400 ml-2">
                      {currentDoc.content.length.toLocaleString()} chars
                    </span>
                  </div>
                  <pre className="bg-gray-800 p-4 text-xs font-mono text-gray-300 overflow-auto max-h-[calc(100vh-200px)] leading-relaxed whitespace-pre-wrap">
                    {currentDoc.content}
                  </pre>
                </div>
              ) : (
                <div className="bg-white border border-gray-200 border-dashed rounded-lg p-12 text-center">
                  <p className="text-sm text-gray-500">
                    왼쪽에서 파일을 선택하세요.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
