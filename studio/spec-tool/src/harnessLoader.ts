/**
 * studio/harness/, studio/skills/ 의 MD 파일들을
 * Vite의 ?raw 쿼리로 string import해 온다.
 * 실제 하네스 내용을 기반으로 명세를 생성하기 위함.
 */

import claudeMd from '../../CLAUDE.md?raw';
import stackMd from '../../harness/stack.md?raw';
import structureMd from '../../harness/structure.md?raw';
import codingMd from '../../harness/coding.md?raw';
import architectureMd from '../../harness/architecture.md?raw';
import componentsMd from '../../harness/components.md?raw';
import styleGuideMd from '../../harness/style-guide.md?raw';
import uxMd from '../../harness/ux.md?raw';
import namingMd from '../../harness/naming.md?raw';
import schemaMd from '../../harness/schema.md?raw';
import crudPageMd from '../../skills/crud-page.md?raw';

export interface HarnessDoc {
  path: string;
  name: string;
  content: string;
  group: 'root' | 'harness' | 'skills';
}

export const HARNESS_DOCS: HarnessDoc[] = [
  { path: 'CLAUDE.md', name: 'CLAUDE.md', content: claudeMd, group: 'root' },
  {
    path: 'harness/stack.md',
    name: 'stack.md',
    content: stackMd,
    group: 'harness',
  },
  {
    path: 'harness/structure.md',
    name: 'structure.md',
    content: structureMd,
    group: 'harness',
  },
  {
    path: 'harness/coding.md',
    name: 'coding.md',
    content: codingMd,
    group: 'harness',
  },
  {
    path: 'harness/architecture.md',
    name: 'architecture.md',
    content: architectureMd,
    group: 'harness',
  },
  {
    path: 'harness/components.md',
    name: 'components.md',
    content: componentsMd,
    group: 'harness',
  },
  {
    path: 'harness/style-guide.md',
    name: 'style-guide.md',
    content: styleGuideMd,
    group: 'harness',
  },
  { path: 'harness/ux.md', name: 'ux.md', content: uxMd, group: 'harness' },
  {
    path: 'harness/naming.md',
    name: 'naming.md',
    content: namingMd,
    group: 'harness',
  },
  {
    path: 'harness/schema.md',
    name: 'schema.md',
    content: schemaMd,
    group: 'harness',
  },
  {
    path: 'skills/crud-page.md',
    name: 'crud-page.md',
    content: crudPageMd,
    group: 'skills',
  },
];

/**
 * MD에서 섹션별 추출 (## 제목 기준)
 */
export function extractSection(
  md: string,
  sectionTitle: string,
): string | null {
  const regex = new RegExp(
    `##\\s+${sectionTitle}[\\s\\S]*?(?=\\n##\\s|$)`,
    'i',
  );
  const match = md.match(regex);
  return match ? match[0].trim() : null;
}

/**
 * 하네스 기반 기술 스택 요약
 */
export function getStackSummary(): {
  frontend: string;
  backend: string;
  db: string;
} {
  return {
    frontend: 'React 19 + TypeScript + Tailwind CSS + Vite',
    backend: 'Spring Boot 3 + Java 17/21 + JPA (Hibernate)',
    db: 'H2 (파일 모드, data/studiodb)',
  };
}
