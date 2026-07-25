import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  imports: [RouterModule],
  template: `
    <div class="landing">
      <header class="landing-header">
        <div class="logo">🧩 <span>RiddleCraft</span></div>
        <div class="header-actions">
          <a routerLink="/login" class="btn btn-ghost btn-sm">Login</a>
          <a routerLink="/register" class="btn btn-primary btn-sm">Register</a>
        </div>
      </header>

      <main class="hero">
        <div class="hero-content">
          <div class="daily-card card">
            <div class="daily-label">✦ DAILY RIDDLE ✦</div>
            <div class="daily-date">{{ today }}</div>
            <p class="daily-question">"I speak without a mouth and hear without ears. I have no body, but I come alive with the wind. What am I?"</p>
            <a routerLink="/register" class="btn btn-primary btn-lg">🗓️ Solve Today</a>
          </div>

          <div class="kpi-grid stats-row">
            <div class="card kpi-card">
              <span class="kpi-icon">🧠</span>
              <div><div class="kpi-value">200+</div><div class="kpi-label">Riddles</div></div>
            </div>
            <div class="card kpi-card">
              <span class="kpi-icon">🔥</span>
              <div><div class="kpi-value">Daily</div><div class="kpi-label">Streaks</div></div>
            </div>
            <div class="card kpi-card">
              <span class="kpi-icon">🏆</span>
              <div><div class="kpi-value">Global</div><div class="kpi-label">Ranking</div></div>
            </div>
          </div>

          <div class="cta-section">
            <p>Created by users like you • <a routerLink="/register" class="cta-link">🌟 Create Yours</a></p>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .landing { min-height: 100vh; display: flex; flex-direction: column; }
    .landing-header {
      display: flex; justify-content: space-between; align-items: center;
      padding: 1rem 1.5rem; border-bottom: 1px solid var(--color-border);
    }
    .logo { font-size: 1.25rem; font-weight: 700; display: flex; align-items: center; gap: 0.5rem; }
    .header-actions { display: flex; gap: 0.5rem; }
    .hero { flex: 1; display: flex; align-items: center; justify-content: center; padding: 2rem 1.5rem; }
    .hero-content { max-width: 600px; width: 100%; }
    .daily-card { text-align: center; padding: 2.5rem; margin-bottom: 2rem; }
    .daily-label { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: var(--color-primary); margin-bottom: 0.25rem; }
    .daily-date { font-size: 0.8125rem; color: var(--color-ink-muted); margin-bottom: 1.5rem; }
    .daily-question { font-size: 1.125rem; line-height: 1.6; color: var(--color-ink); margin-bottom: 1.5rem; font-style: italic; }
    .stats-row { margin-bottom: 2rem; }
    .cta-section { text-align: center; color: var(--color-ink-muted); font-size: 0.875rem; }
    .cta-link { color: var(--color-primary); text-decoration: none; font-weight: 500; }
    .cta-link:hover { text-decoration: underline; }
  `]
})
export class LandingPageComponent {
  protected readonly today = new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}
