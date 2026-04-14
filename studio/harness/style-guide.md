# 스타일 가이드 — 비즈니스 테마

## 디자인 토큰

### 색상 체계

#### 주요 색상 (Primary — Navy)
| 용도 | 색상 | Tailwind |
|------|------|----------|
| 기본 | #1e3a5f | `bg-[#1e3a5f]` |
| hover | #2d4a6f | `hover:bg-[#2d4a6f]` |
| 밝은 배경 | #f0f4f8 | `bg-[#f0f4f8]` |
| 텍스트 | #1e3a5f | `text-[#1e3a5f]` |

#### 보조 색상 (Accent — Gold)
| 용도 | 색상 | Tailwind |
|------|------|----------|
| 강조 | #b8860b | `text-[#b8860b]` |
| 강조 배경 | #fdf6e3 | `bg-[#fdf6e3]` |
| 강조 테두리 | #d4a843 | `border-[#d4a843]` |

#### 상태 색상
| 상태 | 배경 | 텍스트 | 테두리 |
|------|------|--------|--------|
| 성공 | `bg-emerald-50` | `text-emerald-700` | `border-emerald-200` |
| 에러 | `bg-red-50` | `text-red-700` | `border-red-200` |
| 경고 | `bg-amber-50` | `text-amber-700` | `border-amber-200` |
| 정보 | `bg-blue-50` | `text-blue-700` | `border-blue-200` |

#### 중립 색상 (Gray 체계)
| 용도 | Tailwind |
|------|----------|
| 페이지 배경 | `bg-gray-50` |
| 카드 배경 | `bg-white` |
| 테이블 헤더 | `bg-gray-100` |
| 테두리 | `border-gray-200` |
| 비활성 텍스트 | `text-gray-400` |
| 보조 텍스트 | `text-gray-500` |
| 본문 텍스트 | `text-gray-700` |
| 제목 텍스트 | `text-gray-900` |

---

### 타이포그래피

| 용도 | 클래스 |
|------|--------|
| 페이지 제목 | `text-xl font-bold text-gray-900` |
| 섹션 제목 | `text-base font-semibold text-gray-800` |
| 다이얼로그 제목 | `text-lg font-semibold text-gray-900` |
| 라벨 | `text-sm font-medium text-gray-700` |
| 본문 | `text-sm text-gray-700 leading-relaxed` |
| 보조/안내 | `text-sm text-gray-500` |
| 에러 메시지 | `text-xs text-red-600` |
| 테이블 헤더 | `text-xs font-semibold text-gray-600 uppercase tracking-wider` |
| 테이블 셀 | `text-sm text-gray-700` |
| 배지/태그 | `text-xs font-medium` |

---

### 간격 시스템

| 용도 | 클래스 |
|------|--------|
| 페이지 외부 패딩 | `px-6 py-6` |
| 페이지 최대 너비 | `max-w-6xl mx-auto` |
| 카드 내부 패딩 | `p-5` |
| 섹션 간 간격 | `space-y-6` |
| 폼 필드 간 간격 | `space-y-5` |
| 버튼 그룹 간격 | `flex gap-3` |
| 테이블 셀 패딩 | `px-4 py-3` |
| 다이얼로그 내부 | `px-6 py-5` |

---

### 버튼 스타일

| 종류 | 클래스 |
|------|--------|
| Primary | `bg-[#1e3a5f] text-white hover:bg-[#2d4a6f] px-4 py-2 rounded-md text-sm font-medium` |
| Secondary | `border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 px-4 py-2 rounded-md text-sm font-medium` |
| Danger | `bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-md text-sm font-medium` |
| Ghost | `text-gray-500 hover:text-gray-700 hover:bg-gray-100 px-3 py-1.5 rounded-md text-sm` |
| Disabled | `bg-gray-200 text-gray-400 cursor-not-allowed px-4 py-2 rounded-md text-sm` |

### 버튼 크기
| 크기 | 클래스 |
|------|--------|
| sm | `px-3 py-1.5 text-xs` |
| md (기본) | `px-4 py-2 text-sm` |
| lg | `px-6 py-2.5 text-sm` |

---

### 입력 필드 스타일

#### 기본 상태
```
className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700
           bg-white focus:outline-none focus:border-[#1e3a5f] focus:ring-1 focus:ring-[#1e3a5f]"
```

#### 에러 상태
```
className="w-full px-3 py-2 border border-red-300 rounded-md text-sm text-gray-700
           bg-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
```

#### 비활성 상태
```
className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm text-gray-400
           bg-gray-100 cursor-not-allowed"
```

---

### 카드 / 패널

```
className="bg-white border border-gray-200 rounded-lg shadow-sm"
```

#### 카드 + 헤더
```tsx
<div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
  <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
    <h3 className="text-base font-semibold text-gray-800">제목</h3>
  </div>
  <div className="p-5">
    {/* 내용 */}
  </div>
</div>
```

---

### 테이블 스타일

```tsx
{/* 헤더 */}
<thead>
  <tr className="bg-gray-100 border-b border-gray-200">
    <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider text-left">
      컬럼명
    </th>
  </tr>
</thead>

{/* 행 */}
<tr className="border-b border-gray-100 hover:bg-[#f0f4f8] transition-colors">
  <td className="px-4 py-3 text-sm text-gray-700">값</td>
</tr>

{/* 선택된 행 */}
<tr className="bg-[#f0f4f8] border-b border-gray-200">
```

---

### 다이얼로그 스타일

```tsx
{/* 오버레이 */}
<div className="fixed inset-0 bg-black/40 z-50" />

{/* 본체 */}
<div className="bg-white rounded-lg shadow-2xl border border-gray-200">
  {/* 헤더 */}
  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
    <h2 className="text-lg font-semibold text-gray-900">제목</h2>
  </div>
  {/* 본문 */}
  <div className="px-6 py-5">...</div>
  {/* 푸터 (버튼 영역) */}
  <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg flex justify-end gap-3">
    <Button variant="secondary">취소</Button>
    <Button variant="primary">저장</Button>
  </div>
</div>
```

---

### 배지 / 태그

| 종류 | 클래스 |
|------|--------|
| 기본 | `bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-medium` |
| 주요 | `bg-[#f0f4f8] text-[#1e3a5f] px-2 py-0.5 rounded text-xs font-medium` |
| 강조 | `bg-[#fdf6e3] text-[#b8860b] px-2 py-0.5 rounded text-xs font-medium` |
| 성공 | `bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-xs font-medium` |
| 위험 | `bg-red-50 text-red-700 px-2 py-0.5 rounded text-xs font-medium` |

---

### 페이지네이션

```tsx
{/* 현재 페이지 */}
<button className="w-8 h-8 rounded-md bg-[#1e3a5f] text-white text-sm font-medium">1</button>

{/* 다른 페이지 */}
<button className="w-8 h-8 rounded-md border border-gray-300 text-gray-600 text-sm hover:bg-gray-50">2</button>

{/* 비활성 (이전/다음) */}
<button className="w-8 h-8 rounded-md border border-gray-200 text-gray-300 cursor-not-allowed">‹</button>
```

---

### 전체 페이지 레이아웃

```tsx
{/* 앱 껍데기 */}
<div className="min-h-screen bg-gray-50">
  {/* 상단 네비게이션 */}
  <header className="bg-[#1e3a5f] text-white px-6 py-3 shadow-md">
    <div className="max-w-6xl mx-auto flex items-center justify-between">
      <h1 className="text-lg font-bold tracking-tight">Harness Studio</h1>
      <nav className="flex gap-4 text-sm text-white/80">
        <a className="hover:text-white">메뉴1</a>
        <a className="hover:text-white">메뉴2</a>
      </nav>
    </div>
  </header>

  {/* 본문 */}
  <main className="max-w-6xl mx-auto px-6 py-6">
    {/* 페이지 내용 */}
  </main>
</div>
```
