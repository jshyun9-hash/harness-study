# UX 패턴 규칙

## 필수 상태 처리

모든 데이터 페이지에 아래 3가지 상태를 반드시 처리한다.

### 1. 로딩 상태
```tsx
{loading && <p className="text-center text-gray-500 py-8">로딩 중...</p>}
```

### 2. 에러 상태
```tsx
{error && <p className="text-red-500 text-sm mb-4">{error.message}</p>}
```

### 3. 빈 상태
```tsx
{items.length === 0 && (
  <p className="text-center text-gray-500 py-8">등록된 데이터가 없습니다.</p>
)}
```

## 다이얼로그 규칙

상세보기, 추가, 수정은 **페이지 이동 없이 다이얼로그**로 처리한다.

### 다이얼로그 사용 기준
| 동작 | 방식 | 다이얼로그 크기 |
|------|------|----------------|
| 상세보기 | 다이얼로그 | lg |
| 추가(작성) | 다이얼로그 | lg |
| 수정 | 다이얼로그 | lg |
| 삭제 | 확인 다이얼로그 | sm |
| 목록 | 페이지 | - |

### 다이얼로그 호출 패턴
```tsx
// 목록에서 행 클릭 → 상세 다이얼로그
const { openDialog, closeDialog } = useDialog();

const handleRowClick = (item: Notice) => {
  openDialog({
    title: '공지사항 상세',
    content: <NoticeDetail id={item.id} onClose={closeDialog} />,
    size: 'lg',
  });
};

// 추가 버튼 클릭 → 폼 다이얼로그
const handleCreate = () => {
  openDialog({
    title: '공지사항 작성',
    content: <NoticeForm onSubmit={handleSubmit} onClose={closeDialog} />,
    size: 'lg',
  });
};

// 삭제 버튼 클릭 → 확인 다이얼로그
const handleDelete = (id: number) => {
  openDialog({
    title: '삭제 확인',
    content: (
      <div>
        <p>정말 삭제하시겠습니까?</p>
        <div className="flex gap-2 mt-4 justify-end">
          <button onClick={closeDialog}>취소</button>
          <button onClick={() => { deleteItem(id); closeDialog(); }}>삭제</button>
        </div>
      </div>
    ),
    size: 'sm',
  });
};
```

### 다이얼로그 금지 사항
- 다이얼로그 안에서 다이얼로그를 열지 않는다 (중첩 금지)
- 다이얼로그에서 페이지 이동하지 않는다
- 저장/수정 성공 시 다이얼로그를 닫고 목록을 갱신한다

## 목록 페이지 필수 기능
- 공통 SearchBar 사용 (harness/components.md 참조)
- 공통 DataTable 사용 (harness/components.md 참조)
- 페이지네이션 (10건 단위)
- 정렬 (최신순 기본)

## 폼 다이얼로그 필수 기능
- 필수 입력값 검증 (빈 값 제출 방지)
- 저장/취소 버튼
- 저장 성공 시 다이얼로그 닫기 + 목록 갱신
