import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UpperCasePipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, UpperCasePipe],
  template: `
    <nav class="navbar">
      <div class="navbar-inner">
        <a routerLink="/dashboard" class="navbar-brand">
          <span class="brand-icon">🧩</span>
          <span class="brand-text">RiddleCraft</span>
        </a>
        <div class="nav-links">
          <a routerLink="/dashboard" class="nav-link" routerLinkActive="nav-link-active">Daily</a>
          <a routerLink="/riddles" class="nav-link" routerLinkActive="nav-link-active">Browse</a>
          <a routerLink="/leaderboard/daily" class="nav-link" routerLinkActive="nav-link-active">🏆</a>
        </div>
        <div class="nav-user">
          @if (auth.user(); as user) {
            <span class="streak-badge">🔥 {{ streak() }}</span>
            <div class="user-menu">
              <a routerLink="/profile/{{ user.username }}" class="user-avatar" routerLinkActive="nav-link-active">
                {{ user.username[0] | uppercase }}
              </a>
              <div class="user-dropdown">
                <a routerLink="/profile/{{ user.username }}">Profile</a>
                <a routerLink="/achievements">Achievements</a>
                <a routerLink="/settings">Settings</a>
                @if (user.role === 'admin') {
                  <a routerLink="/admin">Admin</a>
                }
                <a (click)="auth.logout(); $event.preventDefault()" href="/login">Logout</a>
              </div>
            </div>
          } @else {
            <a routerLink="/login" class="btn btn-ghost btn-sm">Login</a>
            <a routerLink="/register" class="btn btn-primary btn-sm">Register</a>
          }
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: var(--color-surface);
      border-bottom: 1px solid var(--color-border);
      position: sticky;
      top: 0;
      z-index: 50;
    }
    .navbar-inner {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem 1.5rem;
      gap: 1rem;
    }
    .navbar-brand {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      color: var(--color-ink);
      font-weight: 700;
      font-size: 1.125rem;
    }
    .brand-icon { font-size: 1.25rem; }
    .nav-links { display: flex; gap: 0.25rem; flex: 1; justify-content: center; }
    .nav-link {
      padding: 0.375rem 0.75rem;
      border-radius: 6px;
      text-decoration: none;
      color: var(--color-ink-muted);
      font-size: 0.875rem;
      font-weight: 500;
      transition: all 0.15s;
    }
    .nav-link:hover { color: var(--color-ink); background: var(--color-surface-secondary); }
    .nav-link-active { color: var(--color-primary); background: var(--color-primary-muted); }
    .nav-user { display: flex; align-items: center; gap: 0.75rem; }
    .streak-badge { font-size: 0.8125rem; font-weight: 600; }
    .user-menu { position: relative; }
    .user-avatar {
      width: 32px; height: 32px; border-radius: 50%;
      background: var(--color-primary); color: white;
      display: flex; align-items: center; justify-content: center;
      font-weight: 600; cursor: pointer; text-decoration: none;
      font-size: 0.8125rem;
    }
    .user-dropdown {
      display: none;
      position: absolute; right: 0; top: 100%;
      background: var(--color-surface); border: 1px solid var(--color-border);
      border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      min-width: 160px; padding: 0.5rem; margin-top: 0.5rem;
    }
    .user-menu:hover .user-dropdown { display: block; }
    .user-dropdown a {
      display: block; padding: 0.5rem 0.75rem; border-radius: 6px;
      text-decoration: none; color: var(--color-ink); font-size: 0.8125rem;
    }
    .user-dropdown a:hover { background: var(--color-surface-secondary); cursor: pointer; }
    @media (max-width: 767px) {
      .nav-links { display: none; }
    }
  `]
})
export class NavbarComponent {
  protected readonly auth = inject(AuthService);
  protected streak = () => 0;
}
