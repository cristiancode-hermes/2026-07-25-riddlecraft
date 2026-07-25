# RiddleCraft — Architecture

## Overview

RiddleCraft is a gamified daily riddle/puzzle platform built as an Angular 22 + NestJS 11 full-stack application in a monorepo structure.

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | Angular (standalone, zoneless, signals) | 22.0.x |
| Backend | NestJS | 11.x |
| Database | SQLite (dev) / PostgreSQL via Neon (prod) | — |
| ORM | TypeORM | 1.x |
| Auth | JWT + Passport + bcryptjs | — |
| CSS | Tailwind CSS v4 + custom design tokens | 4.x |
| Build | npm workspaces, tsc (API), Angular CLI (web) | — |

## Project Structure

```
riddlecraft/
├── apps/
│   ├── api/                          # NestJS backend
│   │   ├── src/
│   │   │   ├── main.ts               # Bootstrap with global prefix, CORS, Swagger
│   │   │   ├── app.module.ts         # Root module importing all feature modules
│   │   │   ├── entities.ts           # Barrel export for TypeORM entities
│   │   │   ├── auth/                 # Auth module (register, login, JWT strategy)
│   │   │   ├── users/                # User entity + settings
│   │   │   ├── categories/           # Riddle categories
│   │   │   ├── riddles/              # Riddle CRUD
│   │   │   ├── hints/                # Hint management (nested under riddles)
│   │   │   ├── daily-riddle/         # Daily riddle scheduling
│   │   │   ├── solve-attempts/       # Solve attempt tracking + scoring
│   │   │   ├── achievements/         # Achievement definitions
│   │   │   ├── user-achievements/    # User achievement unlocks
│   │   │   ├── comments/             # Riddle comments
│   │   │   ├── leaderboard/          # Daily + all-time leaderboards
│   │   │   ├── admin/                # Admin panel endpoints
│   │   │   ├── seed/                 # Database seeding (OnModuleInit)
│   │   │   └── common/               # Guards, decorators, filters, interfaces
│   │   └── data/                     # SQLite database files (dev)
│   └── web/                          # Angular 22 frontend
│       └── src/
│           ├── main.ts               # Bootstrap
│           ├── index.html            # Entry HTML with font links
│           ├── styles.css            # Design system + Tailwind v4 @import
│           └── app/
│               ├── app.config.ts     # App configuration
│               ├── app.routes.ts     # Lazy-loaded routes
│               ├── app.component.ts  # Root component
│               ├── services/         # Auth, Riddle, Solve, Theme, Toast, etc.
│               ├── guards/           # Auth guard, Admin guard
│               ├── interceptors/     # Auth HTTP interceptor
│               ├── interfaces/       # Shared TypeScript interfaces
│               ├── shared/components/ # Navbar, BottomNav, Badge, Timer, EmptyState
│               └── pages/            # Lazy-loaded route pages
├── docs/                             # Project documentation
├── tsconfig.json                     # Root TypeScript config
└── package.json                      # npm workspaces root
```

## Data Flow

```
Browser → Angular → HttpClient → authInterceptor (Bearer JWT) → NestJS API → TypeORM → SQLite/Neon
```

## Authentication Flow

1. User registers/logs in → server returns JWT token
2. Token stored in localStorage
3. authInterceptor attaches `Authorization: Bearer <token>` to all /api requests
4. JwtAuthGuard validates on server side
5. AdminGuard additionally checks role === 'admin'

## Scoring Logic

- Base: `difficultyMultiplier × (300 - timeSeconds × 2) + streakBonus`
- Hint penalty: `finalScore = Math.round(baseScore × (1 - hintPenalty / 100))`
- Streak multiplier: `1.0 + (Math.floor(streak / 5) × 0.1)` max 2.0x
- Level: `xpForLevel(level) = Math.round(500 × level^1.5)`
