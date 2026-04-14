# 공통 컴포넌트 설계

## 공통 컴포넌트 목록

```
frontend/src/
├── components/
│   └── common/
│       ├── form/                    # 기본 입력 컴포넌트
│       │   ├── FormField.tsx        # 라벨 + 입력 + 에러 래퍼
│       │   ├── Input.tsx            # 텍스트 입력
│       │   ├── Textarea.tsx         # 멀티라인 입력
│       │   ├── Checkbox.tsx         # 체크박스
│       │   ├── Radio.tsx            # 라디오 버튼
│       │   ├── Select.tsx           # 셀렉트 박스
│       │   └── Label.tsx            # 라벨
│       ├── FormContainer.tsx        # 공통 입력 폼 (render props, validation)
│       ├── FormCard.tsx             # 선언적 폼 (필드 배열로 자동 UI 생성)
│       ├── Button.tsx               # 공통 버튼
│       ├── SearchBar.tsx            # 단순 검색 (Input 1개 + 버튼)
│       ├── SearchCard.tsx           # 선언적 검색 (조건 배열로 자동 UI 생성)
│       ├── DataTable.tsx            # 공통 결과 테이블
│       ├── Pagination.tsx           # 페이지네이션
│       ├── Dialog.tsx               # 공통 다이얼로그
│       └── DialogProvider.tsx       # 다이얼로그 Context Provider
├── hooks/
│   └── useDialog.ts                # 다이얼로그 호출 훅
└── types/
    └── common.ts                   # 공통 타입
```

---

## 1. 기본 UI 컴포넌트

> 모든 입력/표시 요소는 아래 공통 컴포넌트를 사용한다.
> HTML 태그를 직접 사용하는 것을 **금지**한다.

### Label

```tsx
interface LabelProps {
  htmlFor?: string;
  required?: boolean;
  children: React.ReactNode;
}

export default function Label({ htmlFor, required, children }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}
```

### Input

```tsx
interface InputProps {
  id?: string;
  type?: 'text' | 'number' | 'email' | 'password' | 'tel';
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
}

export default function Input({
  id, type = 'text', value, onChange, placeholder, disabled, error
}: InputProps) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full px-3 py-2 border rounded-md text-sm
        focus:outline-none focus:ring-1
        ${error
          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}
        ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
    />
  );
}
```

### Textarea

```tsx
interface TextareaProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  error?: string;
}

export default function Textarea({
  id, value, onChange, placeholder, rows = 4, disabled, error
}: TextareaProps) {
  return (
    <textarea
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      className={`w-full px-3 py-2 border rounded-md text-sm resize-none
        focus:outline-none focus:ring-1
        ${error
          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}
        ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
    />
  );
}
```

### Checkbox

```tsx
interface CheckboxProps {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
}

export default function Checkbox({ id, checked, onChange, label, disabled }: CheckboxProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="w-4 h-4 accent-blue-600 rounded"
      />
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
}
```

### Radio

```tsx
interface RadioOption {
  value: string;
  label: string;
}

interface RadioProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  direction?: 'horizontal' | 'vertical';
  disabled?: boolean;
}

export default function Radio({
  name, value, onChange, options, direction = 'horizontal', disabled
}: RadioProps) {
  return (
    <div className={`flex ${direction === 'vertical' ? 'flex-col gap-2' : 'gap-4'}`}>
      {options.map((opt) => (
        <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            disabled={disabled}
            className="w-4 h-4 accent-blue-600"
          />
          <span className="text-sm text-gray-700">{opt.label}</span>
        </label>
      ))}
    </div>
  );
}
```

### Select

```tsx
interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  error?: string;
}

export default function Select({
  id, value, onChange, options, placeholder, disabled, error
}: SelectProps) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`w-full px-3 py-2 border rounded-md text-sm
        focus:outline-none focus:ring-1
        ${error
          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}
        ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}
```

### Button

```tsx
interface ButtonProps {
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md';
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

const VARIANT_STYLES = {
  primary: 'bg-blue-600 text-white hover:bg-blue-500 disabled:bg-gray-300',
  secondary: 'border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:bg-gray-100',
  danger: 'bg-red-600 text-white hover:bg-red-500 disabled:bg-gray-300',
};

const SIZE_STYLES = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
};

export default function Button({
  type = 'button', variant = 'primary', size = 'md',
  onClick, disabled, children
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-md font-medium transition-colors
        ${VARIANT_STYLES[variant]} ${SIZE_STYLES[size]}
        ${disabled ? 'cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
}
```

---

## 2. FormField (라벨 + 입력 + 에러 래퍼)

모든 폼 입력은 FormField로 감싼다. 라벨, 에러 메시지를 일관되게 처리한다.

```tsx
interface FormFieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

export default function FormField({
  label, htmlFor, required, error, children
}: FormFieldProps) {
  return (
    <div>
      <Label htmlFor={htmlFor} required={required}>{label}</Label>
      {children}
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
```

### 사용 예시
```tsx
<FormField label="제목" htmlFor="title" required error={errors.title}>
  <Input id="title" value={form.title} onChange={(v) => setField('title', v)} />
</FormField>

<FormField label="내용" htmlFor="content" required error={errors.content}>
  <Textarea id="content" value={form.content} onChange={(v) => setField('content', v)} rows={6} />
</FormField>

<FormField label="카테고리" htmlFor="category" error={errors.category}>
  <Select id="category" value={form.category} onChange={(v) => setField('category', v)}
    options={[{ value: '공지', label: '공지' }, { value: '일반', label: '일반' }]}
    placeholder="선택하세요"
  />
</FormField>

<FormField label="고정 여부">
  <Checkbox checked={form.isPinned} onChange={(v) => setField('isPinned', v)} label="상단 고정" />
</FormField>
```

---

## 3. FormContainer (공통 폼 + validation)

모든 추가/수정 폼은 FormContainer를 사용한다.
validation 규칙을 선언적으로 정의하고 자동 검증한다.

```tsx
interface FieldRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  message?: string;               // 커스텀 에러 메시지
}

interface FormContainerProps<T extends Record<string, unknown>> {
  initialValues: T;
  rules: Partial<Record<keyof T, FieldRule>>;
  onSubmit: (values: T) => void | Promise<void>;
  children: (props: {
    values: T;
    errors: Partial<Record<keyof T, string>>;
    setField: (key: keyof T, value: unknown) => void;
    isSubmitting: boolean;
  }) => React.ReactNode;
  submitLabel?: string;
  onCancel?: () => void;
}
```

### 사용 예시
```tsx
<FormContainer
  initialValues={{ title: '', content: '', category: '', isPinned: false }}
  rules={{
    title: { required: true, maxLength: 200, message: '제목을 입력하세요' },
    content: { required: true, message: '내용을 입력하세요' },
  }}
  onSubmit={async (values) => {
    await createNotice(values);
    closeDialog();
  }}
  onCancel={closeDialog}
  submitLabel="저장"
>
  {({ values, errors, setField }) => (
    <>
      <FormField label="제목" required error={errors.title}>
        <Input value={values.title} onChange={(v) => setField('title', v)} />
      </FormField>
      <FormField label="내용" required error={errors.content}>
        <Textarea value={values.content} onChange={(v) => setField('content', v)} />
      </FormField>
      <FormField label="카테고리">
        <Select value={values.category} onChange={(v) => setField('category', v)}
          options={categoryOptions} placeholder="선택" />
      </FormField>
      <FormField label="고정">
        <Checkbox checked={values.isPinned} onChange={(v) => setField('isPinned', v)} label="상단 고정" />
      </FormField>
    </>
  )}
</FormContainer>
```

### validation 동작
- submit 시 rules에 따라 자동 검증
- 에러 발생 시 해당 필드에 에러 메시지 표시
- 모든 검증 통과 시에만 onSubmit 호출
- 기본 에러 메시지:
  - required → "필수 입력 항목입니다"
  - minLength → "{n}자 이상 입력하세요"
  - maxLength → "{n}자 이하로 입력하세요"
  - pattern → "올바른 형식이 아닙니다"

---

## 4. 공통 검색창 (SearchBar)

모든 목록 페이지에서 동일한 검색 UI를 사용한다.

```tsx
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, onSearch, placeholder }: SearchBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') onSearch();
  };

  return (
    <div className="flex gap-2 mb-4">
      <Input
        value={value}
        onChange={onChange}
        placeholder={placeholder ?? '검색어를 입력하세요'}
      />
      <Button onClick={onSearch}>검색</Button>
    </div>
  );
}
```

> SearchBar 내부도 공통 Input, Button을 사용한다.

---

## 5. 공통 결과 테이블 (DataTable)

모든 목록 페이지에서 동일한 테이블 구조를 사용한다.

```tsx
interface Column<T> {
  key: keyof T | string;
  header: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
}
```

---

## 6. 공통 다이얼로그 (Dialog + Context)

상세보기, 추가/수정 폼은 다이얼로그로 처리한다.
Context + Provider 패턴으로 어디서든 호출 가능.

```tsx
interface DialogOptions {
  title: string;
  content: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showClose?: boolean;
  onClose?: () => void;
}

const SIZE_MAP = {
  sm: 'max-w-sm',     // 384px
  md: 'max-w-lg',     // 512px
  lg: 'max-w-2xl',    // 672px
  xl: 'max-w-4xl',    // 896px
};
```

---

## 7. 스타일 가이드

> 상세 스타일 가이드는 **harness/style-guide.md** 참조.
> 색상 체계, 타이포그래피, 간격, 버튼/입력필드/카드/테이블/다이얼로그 스타일이 정의되어 있다.
> 비즈니스 테마: Navy(#1e3a5f) + Gold(#b8860b)

---

## SearchCard — 선언적 검색 카드

검색 조건을 **필드 배열로 정의**하면 자동으로 UI가 생성된다.
검색 + 초기화 버튼 포함. Enter 검색 지원.

```tsx
const SEARCH_FIELDS: SearchField[] = [
  { key: 'keyword', type: 'text', label: '검색어', placeholder: '제목/내용' },
  { key: 'category', type: 'select', label: '카테고리', width: '160px',
    options: [{ value: '공지', label: '공지' }, { value: '일반', label: '일반' }] },
  { key: 'onlyPinned', type: 'checkbox', label: '고정 글만' },
];

<SearchCard
  fields={SEARCH_FIELDS}
  onSearch={(values) => fetchList(values)}
  onReset={() => fetchList({})}
/>
```

### SearchField 타입

| 속성 | 타입 | 설명 |
|------|------|------|
| key | string | 필드 키 |
| type | 'text' \| 'select' \| 'checkbox' | 입력 타입 |
| label | string | 라벨 |
| placeholder? | string | 힌트 |
| options? | { value, label }[] | select용 옵션 |
| width? | string | 너비 (기본 flex-1) |

---

## FormCard — 선언적 폼 카드

폼 필드를 **배열로 정의**하면 자동으로 입력 UI + validation이 생성된다.
저장/취소 버튼 포함.

```tsx
const FORM_FIELDS: FormFieldDef[] = [
  { key: 'title', type: 'text', label: '제목', required: true, maxLength: 200 },
  { key: 'content', type: 'textarea', label: '내용', required: true, rows: 8 },
  { key: 'category', type: 'select', label: '카테고리',
    options: [{ value: '공지', label: '공지' }] },
  { key: 'isPinned', type: 'checkbox', label: '상단 고정' },
];

<FormCard
  fields={FORM_FIELDS}
  initialValues={{ title: '수정할 제목', ... }}
  onSubmit={(values) => saveData(values)}
  onCancel={closeDialog}
  submitLabel="저장"
/>
```

### FormFieldDef 타입

| 속성 | 타입 | 설명 |
|------|------|------|
| key | string | 필드 키 |
| type | 'text' \| 'number' \| 'textarea' \| 'select' \| 'checkbox' \| 'radio' \| 'email' \| 'password' | 입력 타입 |
| label | string | 라벨 |
| required? | boolean | 필수 여부 |
| placeholder? | string | 힌트 |
| maxLength? | number | 최대 길이 |
| minLength? | number | 최소 길이 |
| rows? | number | textarea 행수 |
| options? | { value, label }[] | select, radio용 |
| radioDirection? | 'horizontal' \| 'vertical' | 라디오 방향 |
| message? | string | 커스텀 에러 메시지 |

### 기능 컴포넌트에서 사용 패턴

```tsx
// 기능별 필드 정의만 선언
const NOTICE_FORM_FIELDS: FormFieldDef[] = [ ... ];

// FormCard에 넘기면 끝
export default function NoticeForm({ initialData, onSubmit, onCancel }: Props) {
  return (
    <FormCard
      fields={NOTICE_FORM_FIELDS}
      initialValues={initialData}
      onSubmit={onSubmit}
      onCancel={onCancel}
    />
  );
}
```

---

## 강제 사용 규칙 요약

> 아래 HTML 태그를 직접 사용하는 것을 **금지**한다.
> 반드시 공통 컴포넌트를 사용한다.

| 금지 | 대신 사용 |
|------|----------|
| `<input type="text">` | `<Input />` |
| `<textarea>` | `<Textarea />` |
| `<input type="checkbox">` | `<Checkbox />` |
| `<input type="radio">` | `<Radio />` |
| `<select>` | `<Select />` |
| `<label>` | `<Label />` 또는 `<FormField />` |
| `<button>` | `<Button />` |
| `<table>` | `<DataTable />` |
| `window.confirm()` | `useDialog()` |
| 직접 모달 구현 | `<Dialog />` |
| 직접 검색 UI 조합 | `<SearchCard fields={[...]} />` |
| 직접 폼 UI 조합 | `<FormCard fields={[...]} />` |
| 직접 폼 validation | `<FormCard />` 또는 `<FormContainer />` |
