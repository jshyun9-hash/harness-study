# DB 스키마 현황

> 이 파일은 현재 프로젝트의 DB 테이블 구조를 기록한다.
> 기능이 추가/수정될 때마다 이 파일을 업데이트한다.
> AI 추론 시 이 파일을 참조하여 기존 테이블과의 관계를 파악한다.

## 테이블 목록

(아직 생성된 테이블 없음 — 기능 생성 후 업데이트)

<!--
기능 생성 후 아래 형식으로 추가:

### notice_board
| 컬럼 | 타입 | 설명 | 비고 |
|------|------|------|------|
| notice_board_id | BIGINT PK | 고유 ID | AUTO_INCREMENT |
| title | VARCHAR(200) | 제목 | NOT NULL |
| content | TEXT | 내용 | NOT NULL |
| author | VARCHAR(50) | 작성자 | NOT NULL |
| category | VARCHAR(50) | 카테고리 | |
| view_count | INTEGER | 조회수 | DEFAULT 0 |
| like_count | INTEGER | 좋아요 | DEFAULT 0 |
| is_pinned | BOOLEAN | 고정여부 | DEFAULT FALSE |
| created_at | TIMESTAMP | 생성일 | NOT NULL |
| updated_at | TIMESTAMP | 수정일 | NOT NULL |

## 테이블 관계도

notice_board (1) ──── (N) comment
                          └─ notice_board_id FK
-->
