export interface FieldDefinition {
  id: string;
  label: string;
  type: string;
}

export type UIFramework =
  | 'tailwind'
  | 'shadcn'
  | 'mui'
  | 'antdesign'
  | 'chakra';

export const UI_FRAMEWORK_OPTIONS: { value: UIFramework; label: string }[] = [
  { value: 'tailwind', label: 'Tailwind CSS' },
  { value: 'shadcn', label: 'shadcn/ui' },
  { value: 'mui', label: 'MUI (Material UI)' },
  { value: 'antdesign', label: 'Ant Design' },
  { value: 'chakra', label: 'Chakra UI' },
];

export const TS_TYPE_OPTIONS = [
  'string',
  'number',
  'boolean',
  'Date',
  'string[]',
  'number[]',
];
