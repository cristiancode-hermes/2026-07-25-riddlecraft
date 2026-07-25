# RiddleCraft — Frontend Documentation

## Stack

- **Angular 22** — standalone components, zoneless change detection, signals
- **Tailwind CSS v4** — via `@import "tailwindcss"` + custom design tokens
- **TypeScript 6.x** — strict mode
- **Angular Router** — lazy-loaded routes with loadComponent

## Key Patterns

### Signal-First State

All services and components use signals for state management:

```typescript
private readonly itemsSignal = signal<Item[]>([]);
readonly items = this.itemsSignal.asReadonly();
```

### State Triad

Every data-fetching page uses three signals:

```typescript
protected readonly items = signal<Item[]>([]);
protected readonly loading = signal(true);
protected readonly error = signal('');
```

Template renders in priority order: loading → error → empty → normal.

### Lazy-Loaded Routes

```typescript
{
  path: 'dashboard',
  loadComponent: () => import('./pages/dashboard/dashboard.page').then(m => m.DashboardPageComponent),
  canActivate: [authGuard],
}
```

### Functional Interceptors

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('riddlecraft_token');
  if (token && req.url.startsWith('/api')) {
    return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
  }
  return next(req);
};
```

## Design System

### Colors — "Cosmic Mystery"

- Primary: Purple (`#5B21B6` / `#8B5CF6`)
- Accent: Gold (`#D97706` / `#F59E0B`)
- Background: Soft lavender light (`#F5F0FF`) / Cosmic void dark (`#0F0A1A`)
- Success: Emerald, Error: Red, Info: Indigo

### Typography

- Body: Inter (400, 500, 600, 700)
- Monospace: JetBrains Mono (400, 500)

### Components

- `.card` — Surface with border + shadow
- `.btn` — Button variants (primary, secondary, gold, ghost)
- `.input` — Text inputs with focus ring
- `.badge` — Category/difficulty/achievement pills
- `.timer` — Large monospace timer with warning/critical states

## Page Components

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | LandingPageComponent | Public landing with daily preview |
| `/login` | LoginPageComponent | Email + password login |
| `/register` | RegisterPageComponent | Registration form |
| `/dashboard` | DashboardPageComponent | Daily riddle + user stats |
| `/solve/:id` | SolvePageComponent | Riddle solving with timer + hints |
| `/result/:attemptId` | ResultPageComponent | Score breakdown |
| `/riddles` | BrowsePageComponent | Community riddle grid with filters |
| `/riddles/create` | CreateRiddlePageComponent | Riddle creation form |
| `/riddles/:id` | RiddleDetailPageComponent | Riddle detail + inline solve + comments |
| `/leaderboard/:type` | LeaderboardPageComponent | Daily / all-time rankings |
| `/profile/:username` | ProfilePageComponent | User stats + achievements |
| `/settings` | SettingsPageComponent | Profile, theme, notifications |
| `/achievements` | AchievementsPageComponent | Achievement gallery |
| `/admin` | AdminPageComponent | Stats, scheduler, moderation |
| `**` | NotFoundPageComponent | 404 page |

## Services

| Service | Responsibility |
|---------|---------------|
| AuthService | Login, register, logout, token management, session restore |
| RiddleService | CRUD riddles, fetch daily, community browse/search |
| SolveService | Submit answer, hints, track attempts |
| LeaderboardService | Daily + all-time rankings |
| AchievementService | Achievement list + unlocks |
| ProfileService | User profile, settings, stats |
| AdminService | Stats, scheduler, moderation |
| ThemeService | Dark/light/system theme toggle |
| ToastService | Notification toasts (success/error/info) |

## Shared Components

| Component | Usage |
|-----------|-------|
| NavbarComponent | Top navigation with user menu |
| BottomNavComponent | Mobile bottom tab bar |
| BadgeComponent | Category/difficulty/achievement pills |
| TimerComponent | MM:SS countdown display |
| EmptyStateComponent | Empty data fallback with action |
