/**
 * Gemini API 직접 호출 (브라우저에서)
 * 하네스 MD를 시스템 프롬프트로 보내고, 사용자 요구사항을 분석한다.
 */
import { HARNESS_DOCS } from './harnessLoader';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;
const MODEL = 'gemini-2.5-flash';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

// 필드 추론에 필요한 핵심 파일만 선별 (토큰 절약)
const INFER_FILES = [
  'CLAUDE.md',
  'harness/stack.md',
  'harness/structure.md',
  'harness/coding.md',
  'harness/schema.md',
  'skills/crud-page.md',
];

function buildSystemPrompt(): string {
  let prompt = '# 프로젝트 하네스 규칙\n\n';

  for (const path of INFER_FILES) {
    const doc = HARNESS_DOCS.find((d) => d.path === path);
    if (doc) {
      prompt += `## 파일: ${path}\n\n${doc.content}\n\n`;
    }
  }

  prompt += `
---
위는 이 프로젝트의 하네스(규칙) 파일들입니다.
사용자가 만들고 싶은 기능을 설명하면, 위 규칙에 맞게 기능명과 필드를 추론하세요.

추론 규칙:
- 기능명: PascalCase (harness/structure.md 네이밍 규칙 참고)
- 필드명: camelCase (harness/structure.md 참고)
- 타입: String, Integer, Long, Boolean, LocalDateTime, BigDecimal 중 선택
- Entity 패턴: harness/coding.md의 Entity 패턴 참고
- 기본 필드(title, content, author)는 상황에 맞게 포함 여부 판단
- 요구사항의 맥락을 이해하여 적절한 필드를 추론
- 사용자가 언급한 모든 기능을 빠짐없이 분석해야 한다
- harness/schema.md에 기존 테이블이 있으면 반드시 참조하여 FK 관계를 정확히 잡아야 한다
- 기존 테이블의 PK 컬럼명을 확인하고, 새 테이블의 FK는 기존 PK를 참조해야 한다
- "댓글", "대댓글", "첨부파일" 등 연관 기능이 있으면 commentCount, hasAttachment 같은 카운트/참조 필드를 메인 Entity에 추가하고, relatedFeatures에 별도 기능으로 명시한다

반드시 아래 JSON 형식으로만 응답하세요. 설명이나 마크다운 없이 순수 JSON만:
{
  "featureName": "FreeBoard",
  "fields": [
    { "name": "title", "type": "String", "label": "제목", "required": true },
    { "name": "content", "type": "String", "label": "내용", "required": true },
    { "name": "author", "type": "String", "label": "작성자", "required": true },
    { "name": "likeCount", "type": "Integer", "label": "좋아요 수", "required": false },
    { "name": "commentCount", "type": "Integer", "label": "댓글 수", "required": false }
  ],
  "relatedFeatures": [
    {
      "name": "Comment",
      "description": "게시글 댓글",
      "fields": [
        { "name": "content", "type": "String", "label": "댓글 내용", "required": true },
        { "name": "author", "type": "String", "label": "작성자", "required": true },
        { "name": "boardId", "type": "Long", "label": "게시글 ID", "required": true }
      ]
    }
  ]
}

relatedFeatures가 없으면 빈 배열 []로 응답.
`;

  return prompt;
}

/**
 * 보완 요청: 현재 필드 + 사용자 추가 요청을 AI에게 보내서 피드백 받기
 */
export async function refineWithGemini(
  currentState: {
    featureName: string;
    fields: InferredField[];
    relatedFeatures: RelatedFeature[];
  },
  userFeedback: string,
): Promise<InferResult> {
  const systemPrompt = buildSystemPrompt();

  const userMessage = `
현재 설계된 상태:
- 기능명: ${currentState.featureName}
- 메인 필드:
${JSON.stringify(currentState.fields, null, 2)}
${currentState.relatedFeatures.length > 0 ? `- 연관 기능:\n${JSON.stringify(currentState.relatedFeatures, null, 2)}` : '- 연관 기능: 없음'}

사용자 보완 요청:
${userFeedback}

위 현재 상태를 기반으로, 사용자의 보완 요청을 반영하여 수정된 전체 구조를 JSON으로 응답하세요.
기존 필드를 유지하면서 필요한 부분만 추가/수정/삭제하세요.
동일한 JSON 형식(featureName, fields, relatedFeatures)으로 응답하세요.
`;

  const body = {
    system_instruction: {
      parts: [{ text: systemPrompt }],
    },
    contents: [
      {
        parts: [{ text: userMessage }],
      },
    ],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 4096,
    },
  };

  console.group('[Gemini API] 보완 요청');
  console.log('현재 기능명:', currentState.featureName);
  console.log('현재 필드:', currentState.fields.length + '개');
  console.log('연관 기능:', currentState.relatedFeatures.length + '개');
  console.log('사용자 피드백:', userFeedback);
  console.groupEnd();

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('[Gemini API] 보완 오류:', res.status, err);
    throw new Error(`Gemini API 오류 (${res.status}): ${err}`);
  }

  const json = await res.json();
  const text: string = json?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

  let jsonStr = text.trim();
  if (jsonStr.includes('```')) {
    const start = jsonStr.indexOf('{');
    const end = jsonStr.lastIndexOf('}');
    if (start >= 0 && end > start) {
      jsonStr = jsonStr.substring(start, end + 1);
    }
  }

  const raw = JSON.parse(jsonStr);
  const parsed: InferResult = {
    featureName: raw.featureName,
    fields: raw.fields ?? [],
    relatedFeatures: raw.relatedFeatures ?? [],
  };

  return parsed;
}

export interface InferredField {
  name: string;
  type: string;
  label: string;
  required: boolean;
}

export interface RelatedFeature {
  name: string;
  description: string;
  fields: InferredField[];
}

export interface InferResult {
  featureName: string;
  fields: InferredField[];
  relatedFeatures: RelatedFeature[];
}

export async function inferWithGemini(
  description: string,
): Promise<InferResult> {
  const systemPrompt = buildSystemPrompt();

  const body = {
    system_instruction: {
      parts: [{ text: systemPrompt }],
    },
    contents: [
      {
        parts: [{ text: description }],
      },
    ],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 4096,
    },
  };

  console.group('[Gemini API] 요청');
  console.log('모델:', MODEL);
  console.log('사용자 입력:', description);
  console.log(
    '시스템 프롬프트 크기:',
    systemPrompt.length,
    'chars (~' + Math.round(systemPrompt.length / 4),
    'tokens)',
  );
  console.log('요청 시간:', new Date().toLocaleTimeString());
  console.groupEnd();

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('[Gemini API] 오류:', res.status, err);
    throw new Error(`Gemini API 오류 (${res.status}): ${err}`);
  }

  const json = await res.json();
  const text: string = json?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

  // JSON 추출 (```json ... ``` 블록 처리)
  let jsonStr = text.trim();
  if (jsonStr.includes('```')) {
    const start = jsonStr.indexOf('{');
    const end = jsonStr.lastIndexOf('}');
    if (start >= 0 && end > start) {
      jsonStr = jsonStr.substring(start, end + 1);
    }
  }

  const raw = JSON.parse(jsonStr);
  const parsed: InferResult = {
    featureName: raw.featureName,
    fields: raw.fields ?? [],
    relatedFeatures: raw.relatedFeatures ?? [],
  };

  return parsed;
}

/**
 * 시스템 프롬프트 크기 확인용 (디버그)
 */
export function getPromptStats(): { fileCount: number; charCount: number } {
  const prompt = buildSystemPrompt();
  return {
    fileCount: INFER_FILES.length,
    charCount: prompt.length,
  };
}
