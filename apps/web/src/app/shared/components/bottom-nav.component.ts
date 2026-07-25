import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-bottom-nav',
  imports: [RouterModule],
  template: `
    <nav class="bottom-nav">
      <a routerLink="/dashboard" class="bottom-nav-link">🏠<span>Home</span></a>
      <a routerLink="/riddles" class="bottom-nav-link">🧩<span>Solve</span></a>
      <a routerLink="/leaderboard/daily" class="bottom-nav-link">🏆<span>Rank</span></a>
      <a routerLink="/profile" class="bottom-nav-link">👤<span>Profile</span></a>
      <a routerLink="/settings" class="bottom-nav-link">⚙️<span>Settings</span></a>
    </nav>
  `,
  styles: [`
    .bottom-nav { display: none; }
    @media (max-width: 767px) {
      .bottom-nav {
        display: flex; position: fixed; bottom: 0; left: 0; right: 0;
        background: var(--color-surface); border-top: 1px solid var(--color-border);
        justify-content: space-around; padding: 0.5rem 0; z-index: 100;
      }
      .bottom-nav-link {
        display: flex; flex-direction: column; align-items: center;
        text-decoration: none; color: var(--color-ink-muted); font-size: 0.625rem;
        gap: 2px;
      }
      .bottom-nav-link { font-size: 1.25rem; }
      .bottom-nav-link span { font-size: 0.625rem; }
    }
  `]
})
export class BottomNavComponent {}
