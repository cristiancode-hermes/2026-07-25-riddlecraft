import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/landing/landing.page').then(m => m.LandingPageComponent) },
  { path: 'register', loadComponent: () => import('./pages/auth/register.page').then(m => m.RegisterPageComponent) },
  { path: 'login', loadComponent: () => import('./pages/auth/login.page').then(m => m.LoginPageComponent) },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.page').then(m => m.DashboardPageComponent),
    canActivate: [authGuard],
  },
  {
    path: 'solve/:id',
    loadComponent: () => import('./pages/solve/solve.page').then(m => m.SolvePageComponent),
    canActivate: [authGuard],
  },
  {
    path: 'result/:attemptId',
    loadComponent: () => import('./pages/result/result.page').then(m => m.ResultPageComponent),
    canActivate: [authGuard],
  },
  {
    path: 'riddles',
    loadComponent: () => import('./pages/browse/browse.page').then(m => m.BrowsePageComponent),
    canActivate: [authGuard],
  },
  {
    path: 'riddles/create',
    loadComponent: () => import('./pages/create-riddle/create-riddle.page').then(m => m.CreateRiddlePageComponent),
    canActivate: [authGuard],
  },
  {
    path: 'riddles/:id',
    loadComponent: () => import('./pages/riddle-detail/riddle-detail.page').then(m => m.RiddleDetailPageComponent),
    canActivate: [authGuard],
  },
  {
    path: 'leaderboard/daily',
    loadComponent: () => import('./pages/leaderboard/leaderboard.page').then(m => m.LeaderboardPageComponent),
    canActivate: [authGuard],
  },
  {
    path: 'leaderboard/alltime',
    loadComponent: () => import('./pages/leaderboard/leaderboard.page').then(m => m.LeaderboardPageComponent),
    canActivate: [authGuard],
  },
  {
    path: 'profile/:username',
    loadComponent: () => import('./pages/profile/profile.page').then(m => m.ProfilePageComponent),
    canActivate: [authGuard],
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings.page').then(m => m.SettingsPageComponent),
    canActivate: [authGuard],
  },
  {
    path: 'achievements',
    loadComponent: () => import('./pages/achievements/achievements.page').then(m => m.AchievementsPageComponent),
    canActivate: [authGuard],
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin.page').then(m => m.AdminPageComponent),
    canActivate: [authGuard, adminGuard],
  },
  { path: '**', loadComponent: () => import('./pages/not-found/not-found.page').then(m => m.NotFoundPageComponent) },
];
