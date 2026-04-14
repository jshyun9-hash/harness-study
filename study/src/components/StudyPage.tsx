import { useState } from 'react';
import HarnessLab from './HarnessLab';

type Section = 'concept' | 'lab' | 'insight';

const SECTIONS: { key: Section; label: string }[] = [
  { key: 'concept', label: '4기둥 개념' },
  { key: 'lab', label: '하네스 실험실' },
  { key: 'insight', label: '인사이트' },
];

const PILLARS = [
  {
    icon: '1',
    name: '컨텍스트 파일',
    desc: 'CLAUDE.md, .cursorrules 등 AI가 읽을 수 있는 규칙 문서',
    example:
      '"폴더 구조는 pages/components/hooks로 나눈다" → AI가 읽고 동일한 구조로 생성',
  },
  {
    icon: '2',
    name: 'CI/CD 게이트',
    desc: 'ESLint, TypeScript strict 등 자동화된 품질 관문',
    example: 'any 사용 → ESLint 에러 → 머지 차단',
  },
  {
    icon: '3',
    name: '도구 경계',
    desc: '파일, API, DB 접근 범위를 명확히 제어',
    example: 'fetch는 훅에서만, 컴포넌트에서 직접 API 호출 금지',
  },
  {
    icon: '4',
    name: '피드백 루프',
    desc: '생성 결과를 검증하고 하네스를 지속 개선',
    example: '"빈 데이터 처리 누락" 발견 → 규칙 추가 → 다음번엔 자동 포함',
  },
];

export default function StudyPage() {
  const [section, setSection] = useState<Section>('concept');

  return (
    <div className="space-y-6">
      {/* Section Nav */}
      <div className="flex gap-1 border-b border-gray-200">
        {SECTIONS.map((s) => (
          <button
            key={s.key}
            onClick={() => setSection(s.key)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              section === s.key
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* 4기둥 개념 */}
      {section === 'concept' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">하네스의 4가지 기둥</h2>
            <p className="text-sm text-gray-600">
              이 4가지가 함께 작동해야, 누가 작성해도 일관된 품질의 코드가
              나옵니다.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {PILLARS.map((p) => (
              <div
                key={p.icon}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {p.icon}
                  </span>
                  <h3 className="text-sm font-semibold text-gray-900">
                    {p.name}
                  </h3>
                </div>
                <p className="text-xs text-gray-500 mb-2">{p.desc}</p>
                <div className="bg-gray-50 rounded p-2">
                  <p className="text-xs text-gray-600">
                    <span className="font-medium">예시:</span> {p.example}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <h3 className="text-sm font-semibold mb-3">4기둥의 순환</h3>
            <div className="flex items-center gap-2 text-sm flex-wrap">
              <span className="bg-purple-50 text-purple-700 px-3 py-1.5 rounded border border-purple-200">
                컨텍스트
              </span>
              <span className="text-gray-400">→</span>
              <span className="bg-gray-100 px-3 py-1.5 rounded">코드 생성</span>
              <span className="text-gray-400">→</span>
              <span className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded border border-blue-200">
                CI/CD 검증
              </span>
              <span className="text-gray-400">→</span>
              <span className="bg-amber-50 text-amber-700 px-3 py-1.5 rounded border border-amber-200">
                경계 확인
              </span>
              <span className="text-gray-400">→</span>
              <span className="bg-green-50 text-green-700 px-3 py-1.5 rounded border border-green-200">
                피드백 반영
              </span>
              <span className="text-gray-400">↩</span>
            </div>
          </div>
        </div>
      )}

      {/* 하네스 실험실 */}
      {section === 'lab' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-1">하네스 실험실</h2>
            <p className="text-sm text-gray-500">
              왼쪽에서 규칙을 끄면 코드가 즉시 바뀝니다. 어떤 규칙이 빠지면
              어떻게 망가지는지 직접 확인해보세요.
            </p>
          </div>
          <HarnessLab />
        </div>
      )}

      {/* 인사이트 */}
      {section === 'insight' && (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold">핵심 인사이트</h2>

          <div className="space-y-4">
            <InsightCard
              title="4기둥이 함께 작동할 때"
              color="green"
              items={[
                '컨텍스트 파일 → AI/개발자가 같은 규칙을 읽고 일관된 구조 생성',
                'CI/CD 게이트 → any, console.log 등 품질 위반 자동 차단',
                '도구 경계 → 접근 범위 제한으로 사이드이펙트 방지',
                '피드백 루프 → 부족한 규칙 발견 후 하네스 지속 개선',
              ]}
            />
            <InsightCard
              title="기둥이 빠지면 생기는 문제"
              color="yellow"
              items={[
                '컨텍스트 없음 → AI가 매번 다른 구조로 코드 생성',
                'CI/CD 없음 → 타입 에러, 린트 위반이 그대로 머지',
                '경계 없음 → 컴포넌트에서 DB 직접 호출 같은 위반',
                '피드백 없음 → 같은 실수가 계속 반복',
              ]}
            />
            <InsightCard
              title="좋은 하네스의 조건"
              color="blue"
              items={[
                '기계가 읽을 수 있어야 한다 — 사람만 읽는 문서는 하네스가 아님',
                '자동 검증이 가능해야 한다 — CI에서 통과/실패가 명확',
                '점진적으로 강화 — 한번에 모든 규칙을 넣지 않음',
                '피드백 반영 — 실패에서 배운 규칙을 추가할 수 있음',
              ]}
            />
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <h3 className="text-sm font-semibold mb-3 text-blue-600">
              결론: 4기둥이 만드는 차이
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              컨텍스트로 규칙을 정의하고, CI/CD로 자동 검증하고, 경계로 범위를
              통제하고, 피드백으로 계속 개선합니다. 이 4가지가 갖춰지면 누가
              작성해도{' '}
              <span className="text-gray-900 font-medium">
                구조, 품질, 패턴이 일관된
              </span>{' '}
              코드가 만들어집니다.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function InsightCard({
  title,
  color,
  items,
}: {
  title: string;
  color: 'green' | 'yellow' | 'blue';
  items: string[];
}) {
  const colors = {
    green: 'border-green-200 bg-green-50',
    yellow: 'border-yellow-200 bg-yellow-50',
    blue: 'border-blue-200 bg-blue-50',
  };
  const titleColors = {
    green: 'text-green-700',
    yellow: 'text-yellow-700',
    blue: 'text-blue-700',
  };

  return (
    <div className={`border rounded-lg p-4 ${colors[color]}`}>
      <h3 className={`text-sm font-semibold mb-3 ${titleColors[color]}`}>
        {title}
      </h3>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item} className="text-sm text-gray-700 flex gap-2">
            <span className="text-gray-400 shrink-0">-</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
