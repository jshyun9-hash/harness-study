# 코딩 컨벤션

## 프론트엔드 (TypeScript/React)

### ESLint 규칙
```json
{
  "@typescript-eslint/no-explicit-any": "error",
  "no-console": "warn",
  "no-var": "error",
  "prefer-const": "error",
  "eqeqeq": "error",
  "react-hooks/exhaustive-deps": "warn"
}
```

### TypeScript strict
```json
{
  "strict": true,
  "noImplicitAny": true,
  "strictNullChecks": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true
}
```

### React 패턴
- 컴포넌트는 function 선언 (arrow function 금지)
- Props는 반드시 interface로 정의
- 커스텀 훅으로 비즈니스 로직 분리
- API 호출은 api/ 레이어에서만

```typescript
// ✅ 올바른 예
interface Props {
  items: Notice[];
}

export default function NoticeTable({ items }: Props) { }

// ❌ 금지
const NoticeTable = ({ items }: any) => { }
```

### 공통 컴포넌트 강제 사용 규칙

> 게시판/목록 형태의 UI를 생성할 때 아래 공통 컴포넌트를 **반드시** 사용한다.
> 직접 `<table>`, `<input>`, 모달을 구현하는 것을 **금지**한다.
> 상세 설계는 harness/components.md를 참조한다.

| 기능 | 필수 사용 컴포넌트 | 금지 |
|------|-------------------|------|
| 검색 | `<SearchBar />` | 직접 `<input>` + `<button>` 조합 금지 |
| 목록 테이블 | `<DataTable />` | 직접 `<table>` 작성 금지 |
| 페이지네이션 | `<Pagination />` | 직접 페이지 버튼 구현 금지 |
| 상세/추가/수정 | `useDialog()` + `<Dialog />` | 페이지 이동 금지, 직접 모달 구현 금지 |
| 삭제 확인 | `useDialog()` + `<Dialog size="sm" />` | `window.confirm()` 금지 |

```tsx
// ✅ 올바른 예 — 공통 컴포넌트 사용
import SearchBar from '../components/common/SearchBar';
import DataTable from '../components/common/DataTable';
import { useDialog } from '../../hooks/useDialog';

export default function NoticeListPage() {
  const { openDialog, closeDialog } = useDialog();

  return (
    <div>
      <SearchBar value={keyword} onChange={setKeyword} onSearch={handleSearch} />
      <DataTable columns={columns} data={items} keyField="id" onRowClick={handleRowClick} />
    </div>
  );
}

// ❌ 금지 — 직접 구현
export default function NoticeListPage() {
  return (
    <div>
      <input type="text" />           {/* SearchBar 안 쓰고 직접 구현 */}
      <table><tr><td>...</td></tr></table>  {/* DataTable 안 쓰고 직접 구현 */}
      {showModal && <div className="modal">...</div>}  {/* Dialog 안 쓰고 직접 구현 */}
    </div>
  );
}
```

## 백엔드 (Java/Spring Boot)

### 공통 규칙
- 모든 API 응답은 ApiResponse<T> 로 래핑
- Service 레이어에서 비즈니스 로직 처리
- Controller는 요청 검증 + Service 호출만
- Repository(JPA)는 데이터 접근만 담당

### Entity 패턴
```java
@Entity
@Table(name = "notice_board")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Notice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notice_board_id")
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false, length = 50)
    private String author;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
```

### Repository 패턴
```java
public interface NoticeRepository extends JpaRepository<Notice, Long> {

    Page<Notice> findByTitleContainingOrContentContaining(
            String title, String content, Pageable pageable);
}
```

### Controller 패턴
```java
@RestController
@RequestMapping("/api/notices")
@RequiredArgsConstructor
public class NoticeController {

    private final NoticeService noticeService;

    @GetMapping
    public ApiResponse<PageResponse<NoticeResponse>> getList(
            NoticeSearchCondition condition) {
        return ApiResponse.success(noticeService.getList(condition));
    }

    @GetMapping("/{id}")
    public ApiResponse<NoticeResponse> getDetail(@PathVariable Long id) {
        return ApiResponse.success(noticeService.getDetail(id));
    }

    @PostMapping
    public ApiResponse<Long> create(@Valid @RequestBody NoticeRequest request) {
        return ApiResponse.success(noticeService.create(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<Void> update(@PathVariable Long id,
            @Valid @RequestBody NoticeRequest request) {
        noticeService.update(id, request);
        return ApiResponse.success();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        noticeService.delete(id);
        return ApiResponse.success();
    }
}
```

### Service 패턴
```java
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NoticeService {

    private final NoticeRepository noticeRepository;

    public PageResponse<NoticeResponse> getList(NoticeSearchCondition condition) {
        Pageable pageable = PageRequest.of(
                condition.getPage() - 1, condition.getSize(),
                Sort.by(Sort.Direction.DESC, "createdAt"));
        // ...
    }

    @Transactional
    public Long create(NoticeRequest request) {
        Notice notice = request.toEntity();
        return noticeRepository.save(notice).getId();
    }
}
```
