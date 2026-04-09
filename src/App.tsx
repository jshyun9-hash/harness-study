import { useState } from 'react';
import type { FieldDefinition, UIFramework } from './types';
import { UI_FRAMEWORK_OPTIONS, TS_TYPE_OPTIONS } from './types';
import { parseRequirement } from './parseRequirement';
import { generateHarnessMd } from './generateHarnessMd';

type Step = 'input' | 'edit' | 'result';

function App() {
  const [step, setStep] = useState<Step>('input');
  const [requirement, setRequirement] = useState('');
  const [typeName, setTypeName] = useState('Post');
  const [fields, setFields] = useState<FieldDefinition[]>([]);
  const [uiFramework, setUiFramework] = useState<UIFramework>('tailwind');
  const [harnessMd, setHarnessMd] = useState('');

  const handleParse = () => {
    if (!requirement.trim()) return;
    const result = parseRequirement(requirement);
    setTypeName(result.typeName);
    setFields(result.fields);
    setStep('edit');
  };

  const handleFieldChange = (
    id: string,
    key: 'label' | 'type',
    value: string,
  ) => {
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [key]: value } : f)),
    );
  };

  const handleAddField = () => {
    setFields((prev) => [
      ...prev,
      { id: crypto.randomUUID(), label: '', type: 'string' },
    ]);
  };

  const handleRemoveField = (id: string) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
  };

  const handleGenerate = () => {
    const md = generateHarnessMd({
      requirement,
      fields,
      uiFramework,
      typeName,
    });
    setHarnessMd(md);
    setStep('result');
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(harnessMd);
  };

  const handleReset = () => {
    setStep('input');
    setRequirement('');
    setTypeName('Post');
    setFields([]);
    setHarnessMd('');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">
            Harness Studio
          </h1>
          <div className="flex gap-1 text-sm text-gray-500">
            <span
              className={step === 'input' ? 'text-blue-400 font-semibold' : ''}
            >
              1. 요구사항
            </span>
            <span>→</span>
            <span
              className={step === 'edit' ? 'text-blue-400 font-semibold' : ''}
            >
              2. 타입 편집
            </span>
            <span>→</span>
            <span
              className={step === 'result' ? 'text-blue-400 font-semibold' : ''}
            >
              3. 결과
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8">
        {/* Step 1: 요구사항 입력 */}
        {step === 'input' && (
          <section className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">고객 요구사항 입력</h2>
              <p className="text-sm text-gray-400 mb-4">
                게시판 페이지에 대한 요구사항을 텍스트로 입력하세요. 키워드에 따라
                TypeScript 타입이 자동 생성됩니다.
              </p>
              <textarea
                className="w-full h-48 bg-gray-900 border border-gray-700 rounded-lg p-4 text-gray-100 placeholder-gray-600 focus:outline-none focus:border-blue-500 resize-none"
                placeholder="예: 조회수와 좋아요가 있는 자유게시판을 만들어주세요. 카테고리 분류가 필요하고, 태그 기능도 있으면 좋겠습니다."
                value={requirement}
                onChange={(e) => setRequirement(e.target.value)}
              />
            </div>
            <button
              onClick={handleParse}
              disabled={!requirement.trim()}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 rounded-lg font-medium transition-colors"
            >
              타입 생성
            </button>
          </section>
        )}

        {/* Step 2: 타입 편집 + 설정 */}
        {step === 'edit' && (
          <section className="space-y-8">
            {/* 요구사항 미리보기 */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-400 mb-1">
                요구사항
              </h3>
              <p className="text-gray-300 text-sm">{requirement}</p>
            </div>

            {/* 설정 선택 */}
            <div className="grid grid-cols-2 gap-6">
              {/* UI 프레임워크 */}
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-3">
                  UI 프레임워크
                </h3>
                <div className="space-y-2">
                  {UI_FRAMEWORK_OPTIONS.map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        uiFramework === opt.value
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="uiFramework"
                        value={opt.value}
                        checked={uiFramework === opt.value}
                        onChange={() => setUiFramework(opt.value)}
                        className="accent-blue-500"
                      />
                      <span className="text-sm">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 타입 정의 */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-400">
                    TypeScript 타입
                  </h3>
                  <button
                    onClick={handleAddField}
                    className="text-xs text-blue-400 hover:text-blue-300"
                  >
                    + 필드 추가
                  </button>
                </div>

                {/* 타입 이름 */}
                <div className="mb-3">
                  <label className="text-xs text-gray-500 mb-1 block">
                    interface 이름
                  </label>
                  <input
                    type="text"
                    value={typeName}
                    onChange={(e) => setTypeName(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-1.5 text-sm font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* 필드 목록 */}
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {fields.map((field) => (
                    <div
                      key={field.id}
                      className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-lg p-2"
                    >
                      <input
                        type="text"
                        value={field.label}
                        onChange={(e) =>
                          handleFieldChange(field.id, 'label', e.target.value)
                        }
                        placeholder="필드명"
                        className="flex-1 bg-transparent border border-gray-700 rounded px-2 py-1 text-sm font-mono focus:outline-none focus:border-blue-500"
                      />
                      <select
                        value={field.type}
                        onChange={(e) =>
                          handleFieldChange(field.id, 'type', e.target.value)
                        }
                        className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm font-mono focus:outline-none focus:border-blue-500"
                      >
                        {TS_TYPE_OPTIONS.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleRemoveField(field.id)}
                        className="text-gray-500 hover:text-red-400 px-1"
                        title="삭제"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 타입 미리보기 */}
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">
                타입 미리보기
              </h3>
              <pre className="bg-gray-900 border border-gray-800 rounded-lg p-4 text-sm font-mono text-green-400 overflow-x-auto">
                {`interface ${typeName} {\n${fields.map((f) => `  ${f.label}: ${f.type};`).join('\n')}\n}`}
              </pre>
            </div>

            {/* 버튼 */}
            <div className="flex gap-3">
              <button
                onClick={() => setStep('input')}
                className="px-5 py-2.5 border border-gray-700 hover:border-gray-600 rounded-lg text-sm transition-colors"
              >
                이전
              </button>
              <button
                onClick={handleGenerate}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors"
              >
                하네스 MD 생성
              </button>
            </div>
          </section>
        )}

        {/* Step 3: 결과 */}
        {step === 'result' && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">하네스 문서 결과</h2>
              <div className="flex gap-3">
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 text-sm border border-gray-700 hover:border-gray-600 rounded-lg transition-colors"
                >
                  복사
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
                >
                  새로 만들기
                </button>
              </div>
            </div>
            <pre className="bg-gray-900 border border-gray-800 rounded-lg p-6 text-sm font-mono text-gray-300 overflow-x-auto whitespace-pre-wrap">
              {harnessMd}
            </pre>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
