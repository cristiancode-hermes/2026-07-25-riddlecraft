# RiddleCraft — API Documentation

## Base URL

`/api` (global prefix configured in NestJS)

## Authentication

JWT Bearer token required for protected endpoints.

Headers: `Authorization: Bearer <token>`

## Response Format

```typescript
// Success
{ data: T, meta?: { page, total, totalPages } }

// Error
{ error: { statusCode: number, message: string, details?: any } }
```

## Endpoints

### Auth

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login, return JWT |
| GET | `/api/auth/me` | Yes | Current user info |
| PUT | `/api/auth/profile` | Yes | Update username |

### Categories

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/categories` | Yes | List all categories |

### Riddles

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/riddles/daily` | Yes | Today's daily riddle |
| GET | `/api/riddles` | Yes | Browse community riddles (paginated, filterable) |
| GET | `/api/riddles/:id` | Yes | Riddle detail with hints |
| POST | `/api/riddles` | Yes | Create new riddle |
| PUT | `/api/riddles/:id` | Yes | Update own riddle |
| DELETE | `/api/riddles/:id` | Yes | Delete own riddle |
| POST | `/api/riddles/:id/rate` | Yes | Rate a solved riddle |

### Solve/Attempts

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/riddles/:id/attempt` | Yes | Start solve attempt |
| POST | `/api/attempts/:id/submit` | Yes | Submit answer |
| POST | `/api/attempts/:id/hint` | Yes | Request next hint |
| GET | `/api/attempts/:id` | Yes | Get attempt details |
| GET | `/api/solves/history` | Yes | User's solve history |

### Leaderboard

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/leaderboard/daily` | Yes | Daily leaderboard |
| GET | `/api/leaderboard/alltime` | Yes | All-time XP leaderboard |

### Achievements

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/achievements` | Yes | All achievements |
| GET | `/api/achievements/user` | Yes | User's unlocked achievements |
| GET | `/api/achievements/:id` | Yes | Single achievement detail |

### Users

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/users/:username` | Yes | Public profile + stats |
| GET | `/api/users/:username/solves` | Yes | User's recent solves |
| GET | `/api/users/:username/achievements` | Yes | User's achievements |

### Settings

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/settings` | Yes | Get user settings |
| PUT | `/api/settings` | Yes | Update settings |

### Admin (requires admin role)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/admin/stats` | Dashboard statistics |
| GET | `/api/admin/reports` | Reported riddles |
| POST | `/api/admin/riddles/:id/approve` | Approve riddle |
| POST | `/api/admin/riddles/:id/reject` | Reject riddle |
| POST | `/api/admin/users/:id/ban` | Ban user |
| POST | `/api/admin/daily` | Set daily riddle |
| GET | `/api/admin/daily/schedule` | Daily riddle schedule |
| DELETE | `/api/admin/daily/:id` | Unset daily riddle |

## Query Parameters (Paginated endpoints)

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| page | string | '1' | Page number |
| limit | string | '20' | Items per page |
| category | string | — | Filter by category slug |
| difficulty | string | — | Filter by difficulty |
| search | string | — | Search in title |
| sort | string | — | Sort order |
