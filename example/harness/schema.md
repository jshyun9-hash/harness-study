# DB 스키마 현황

> 이 파일은 현재 프로젝트의 DB 테이블 구조를 기록한다.
> 기능이 추가/수정될 때마다 이 파일을 업데이트한다.
> AI 추론 시 이 파일을 참조하여 기존 테이블과의 관계를 파악한다.

## 테이블 목록

### member

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| member_id | BIGINT | PK, AUTO_INCREMENT | 회원 ID |
| login_id | VARCHAR(50) | NOT NULL, UNIQUE | 로그인 아이디 |
| password | VARCHAR(255) | NOT NULL | 비밀번호 |
| member_name | VARCHAR(50) | NOT NULL | 이름 |
| phone | VARCHAR(20) | NOT NULL | 연락처 |
| email | VARCHAR(100) | | 이메일 |
| parcel_member_no | VARCHAR(20) | | 분양회원번호 |
| member_type | VARCHAR(10) | NOT NULL | GENERAL / PARCEL |
| created_at | TIMESTAMP | NOT NULL | 생성일시 |
| updated_at | TIMESTAMP | NOT NULL | 수정일시 |

### room

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| room_id | BIGINT | PK, AUTO_INCREMENT | 객실 ID |
| room_code | VARCHAR(20) | NOT NULL, UNIQUE | 객실코드 |
| room_name | VARCHAR(100) | NOT NULL | 객실명 |
| stock_count | INT | NOT NULL | 재고 |
| created_at | TIMESTAMP | NOT NULL | 생성일시 |
| updated_at | TIMESTAMP | NOT NULL | 수정일시 |

### room_price

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| room_price_id | BIGINT | PK, AUTO_INCREMENT | 객실가격 ID |
| room_id | BIGINT | FK → room, NOT NULL | 객실 |
| member_type | VARCHAR(10) | NOT NULL | 회원유형 |
| price | INT | NOT NULL | 금액 |
| created_at | TIMESTAMP | NOT NULL | 생성일시 |
| updated_at | TIMESTAMP | NOT NULL | 수정일시 |

### room_permission

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| room_permission_id | BIGINT | PK, AUTO_INCREMENT | 객실권한 ID |
| room_id | BIGINT | FK → room, NOT NULL | 객실 |
| member_type | VARCHAR(10) | NOT NULL | 예약가능 회원유형 |
| created_at | TIMESTAMP | NOT NULL | 생성일시 |
| updated_at | TIMESTAMP | NOT NULL | 수정일시 |

### reservation

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| reservation_id | BIGINT | PK, AUTO_INCREMENT | 예약 ID |
| reservation_no | VARCHAR(20) | NOT NULL, UNIQUE | 예약번호 |
| member_id | BIGINT | FK → member, NOT NULL | 회원 |
| room_id | BIGINT | FK → room, NOT NULL | 객실 |
| check_in_date | DATE | NOT NULL | 입실일 |
| guest_name | VARCHAR(50) | NOT NULL | 투숙자명 |
| guest_phone | VARCHAR(20) | NOT NULL | 투숙자 연락처 |
| reservation_date | DATE | NOT NULL | 예약일자 |
| status | VARCHAR(10) | NOT NULL | CONFIRMED / CANCELLED |
| created_at | TIMESTAMP | NOT NULL | 생성일시 |
| updated_at | TIMESTAMP | NOT NULL | 수정일시 |

## 테이블 관계도

```
member (1) ──< reservation (N) >── (1) room
                                        │
                                room (1) ──< room_price (N)
                                room (1) ──< room_permission (N)
```
