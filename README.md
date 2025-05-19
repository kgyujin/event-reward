# 이벤트/보상 관리 플랫폼

## 프로젝트 환경 및 서버 정보

| 항목      | 버전/설명  |
|-----------|-------|
| Node.js   | 18  |
| NestJS      | 최신/MSA 구조(gateway, auth, event)  |
| DB     | MongoDB  |
| 인증     | JWT  |
| 배포/실행     | Docker + docker-compose  |
| 언어     | TypeScript  |

| 서버      | 포트  |
|-----------|-------|
| Gateway Server   | 3000  |
| Auth Server      | 3001  |
| Event Server     | 3002  |


## 실행 방법 (Docker Compose)
```bash
git clone https://github.com/kgyujin/event-reward
cd event_reward
docker-compose up --build
```

- Gateway: http://localhost:3000
- Auth: http://localhost:3001
- Event: http://localhost:3002

## API 사용 예시

### 회원가입/로그인 (Auth)
- POST `/auth/signup`
- POST `/auth/login`

### 이벤트 생성/조회 (Event)
- POST `/event/events`

### 보상 등록/조회 (Event)
- POST `/event/rewards` (운영자/관리자 권한)
- GET `/event/rewards`
- GET `/event/rewards/event/:id`

### 보상 요청/이력 (Event)
- POST `/event/reward-requests` (유저)
- GET `/event/reward-requests` (유저/운영자/감사자/관리자)
- PATCH `/event/reward-requests/:id/status` (운영자/관리자)

## 설계 및 구조
- **Gateway**: 진입점, 인증/권한 체크 및 라우팅 처리
- **Auth**: 사용자 정보 관리, 역할 및 JWT 토큰 발급
- **Event**: 이벤트 생성, 보상 등록, 보상 요청 처리 등 핵심 비즈니스 로직 담당

## 조건 검증 방식
- 이벤트 생성 시, 조건(`minLevel`, `monsterKillCount` 등) 설정
- 유저 요청 시 조건 충족 여부 서버에서 검증
- 검증 실패 시 요청은 자동 거절, 성공 시 승인 또는 자동 지급 가능

## 추가 사항
- 실제 유저 행동 정보는 외부 시스템에서 연동 필요 → 현재는 테스트를 위해 요청 body로 직접 전달받는 방식 사용
- 인증은 JWT 기반, 역할별 접근 권한 분리 처리
- Postman을 활용한 테스트를 기준으로 작성 및 점검

## Postman 테스트 시나리오

### 1. 회원가입
- POST `/auth/signup`
```bash
Content-Type: application/json
```
```json
{
  "email": "test1@test.com",
  "password": "1q2w3e4r",
  "role": "USER"
}
```
```json
{
  "email": "admin1@test.com",
  "password": "1q2w3e4r",
  "role": "ADMIN"
}
```

### 2. 로그인
- POST `/auth/login`
```bash
Content-Type: application/json
```
```json
{
  "email": "test1@test.com",
  "password": "1q2w3e4r"
}
```
```json
{
  "email": "admin1@test.com",
  "password": "1q2w3e4r"
}
```

### 3. 프로필 조회
- GET `/auth/profile`
```bash
Authorization: Bearer <access_token>
```

### 4. 유저 목록 조회
- GET `/users`
```bash
Authorization: Bearer <access_token>
```

### 5. 유저 상세 조회
- GET `/users/:id`
```bash
Authorization: Bearer <access_token>
```

### 6. 유저 역할 변경
- PATCH `/users/:id`
```bash
Authorization: Bearer <access_token>
```
```json
{
  "role": "USER"
}
```

### 7. 이벤트 생성
- POST `/events`
```bash
Content-Type: application/json
```
```json
{
  "name": "우주전쟁 이벤트",
  "description": "레벨 범위 몬스터 100마리 처치 시 보상 지급",
  "startDate": "2025-05-01T00:00:00.000Z",
  "endDate": "2025-06-01T00:00:00.000Z",
  "monsterKillCount": 50000,
  "minLevel": 101
}
```

### 8. 보상 생성
- POST `/rewards`
```bash
Content-Type: application/json
```
```json
{
  "name": "우주전쟁 의자",
  "point": 50000,
  "eventId": "682b12ab22623f7571483cbf",
  "isUnique": true
}
```

### 9. 전체 보상 조회
- GET `/rewards`
```bash
Content-Type: application/json
```

### 10. 특정 이벤트 보상 조회
- GET `/rewards/event/:id`
```bash
Content-Type: application/json
```

### 11. 보상 요청 생성
- POST `/reward-requests`
```bash
Content-Type: application/json
```
```json
{
  "userId": "682b12c08d92742ab015821f",
  "eventId": "682b12ab22623f7571483cbf",
  "rewardId": "682b12b022623f7571483cc1",
  "message": "[헤이스트] 레벨 범위 몬스터 50,000마리 처치 보상 요청"
}
```

### 12. 보상 요청 조회
- GET `/reward-requests`
```bash
Content-Type: application/json
```

### 13. 보상 요청 상태 변경
- PATCH `/reward-requests/:id/status`
```bash
Content-Type: application/json
```
```json
{
  "status": "APPROVED"
}
```