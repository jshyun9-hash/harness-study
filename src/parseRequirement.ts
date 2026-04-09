import type { FieldDefinition } from './types';

/**
 * 요구사항 텍스트에서 게시판 타입의 기본 필드를 추론합니다.
 * 키워드 기반으로 필드를 생성하며, 추후 AI 연동으로 확장 가능합니다.
 */
export function parseRequirement(text: string): {
  typeName: string;
  fields: FieldDefinition[];
} {
  const lower = text.toLowerCase();

  // 기본 필드 (항상 포함)
  const fields: FieldDefinition[] = [
    { id: crypto.randomUUID(), label: 'id', type: 'number' },
    { id: crypto.randomUUID(), label: 'title', type: 'string' },
    { id: crypto.randomUUID(), label: 'content', type: 'string' },
    { id: crypto.randomUUID(), label: 'author', type: 'string' },
    { id: crypto.randomUUID(), label: 'createdAt', type: 'Date' },
  ];

  // 키워드 기반 추가 필드
  if (lower.includes('조회') || lower.includes('view')) {
    fields.push({ id: crypto.randomUUID(), label: 'views', type: 'number' });
  }
  if (lower.includes('좋아요') || lower.includes('like')) {
    fields.push({ id: crypto.randomUUID(), label: 'likes', type: 'number' });
  }
  if (lower.includes('카테고리') || lower.includes('category')) {
    fields.push({ id: crypto.randomUUID(), label: 'category', type: 'string' });
  }
  if (lower.includes('태그') || lower.includes('tag')) {
    fields.push({ id: crypto.randomUUID(), label: 'tags', type: 'string[]' });
  }
  if (lower.includes('수정') || lower.includes('update')) {
    fields.push({ id: crypto.randomUUID(), label: 'updatedAt', type: 'Date' });
  }
  if (lower.includes('상태') || lower.includes('status')) {
    fields.push({ id: crypto.randomUUID(), label: 'status', type: 'string' });
  }
  if (lower.includes('공개') || lower.includes('publish')) {
    fields.push({
      id: crypto.randomUUID(),
      label: 'isPublished',
      type: 'boolean',
    });
  }

  // 타입 이름 추론
  let typeName = 'Post';
  if (lower.includes('공지') || lower.includes('notice')) {
    typeName = 'Notice';
  } else if (lower.includes('qna') || lower.includes('질문')) {
    typeName = 'QnA';
  } else if (lower.includes('faq')) {
    typeName = 'FAQ';
  } else if (lower.includes('자유')) {
    typeName = 'FreePost';
  }

  return { typeName, fields };
}
