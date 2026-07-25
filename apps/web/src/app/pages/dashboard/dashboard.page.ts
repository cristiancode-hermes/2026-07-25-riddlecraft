import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RiddleService } from '../../services/riddle.service';
import { NavbarComponent } from '../../shared/components/navbar.component';
import { BottomNavComponent } from '../../shared/components/bottom-nav.component';
import { BadgeComponent } from '../../shared/components/badge.component';
import { TimerComponent } from '../../shared/components/timer.component';
import { DailyRiddleResponse } from '../../interfaces';

@Component({
  selector: 'app-dashboard-page',
  imports: [RouterModule, NavbarComponent, BottomNavComponent, BadgeComponent, TimerComponent],
  template: `
    <app-navbar />
    <div class="page-container">
      @if (loading()) {
        <div class="kpi-grid" style="margin-bottom:1.5rem">
          @for (_ of [1,2,3]; track _) { <div class="card skeleton skeleton-card"></div> }
        </div>
        <div class="card skeleton skeleton-card" style="height:300px"></div>
      } @else if (error()) {
        <div class="card" style="text-align:center;padding:2rem">
          <p style="color:var(--color-error)">{{ error() }}</p>
          <button class="btn btn-primary" (click)="loadDaily()">Retry</button>
        </div>
      } @else {
        <div class="kpi-grid" style="margin-bottom:1.5rem">
          <div class="card kpi-card">
            <span class="kpi-icon">🔥</span>
            <div><div class="kpi-value">{{ userStats().streak }} días</div><div class="kpi-label">Racha</div></div>
          </div>
          <div class="card kpi-card">
            <span class="kpi-icon">⭐</span>
            <div><div class="kpi-value">{{ userStats().level }}</div><div class="kpi-label">Nivel</div></div>
          </div>
          <div class="card kpi-card">
            <span class="kpi-icon">✨</span>
            <div><div class="kpi-value">{{ userStats().xp.toLocaleString() }}</div><div class="kpi-label">XP</div></div>
          </div>
        </div>

        <div class="card daily-card">
          <div class="daily-header">
            <h2>✦ ACERTIJO DEL DÍA</h2>
            <span style="font-size:0.8125rem;color:var(--color-ink-muted)">{{ today }}</span>
          </div>

          @if (daily(); as d) {
            <div class="daily-meta">
              <app-badge variant="category">{{ d.riddle.category?.name || 'General' }}</app-badge>
              <app-badge [variant]="d.riddle.difficulty">{{ d.riddle.difficulty }}</app-badge>
            </div>

            <p class="daily-question">"{{ d.riddle.question }}"</p>

            @if (d.solved && d.attempt) {
              <div class="solved-state">
                <div class="solved-badge">✅ Resuelto</div>
                <p>Score: <strong>{{ d.attempt.score }}</strong> • Tiempo: {{ d.attempt.timeSeconds }}s • Pistas: {{ d.attempt.hintsUsed }}</p>
                <a [routerLink]="['/result', d.attempt.id]" class="btn btn-secondary">Ver resultado</a>
              </div>
            } @else if (d.attempt && !d.attempt.solved) {
              <div class="active-state">
                <app-timer [seconds]="activeSeconds()" />
                <a [routerLink]="['/solve', d.riddle.id]" class="btn btn-primary btn-lg">▶️ Continuar</a>
              </div>
            } @else {
              <div class="cta-state">
                <a [routerLink]="['/solve', d.riddle.id]" class="btn btn-primary btn-lg">🚀 Comenzar</a>
                <button class="btn btn-ghost" disabled>💡 Ver pistas</button>
              </div>
            }
          } @else {
            <div class="empty-state" style="padding:1rem">
              <p style="color:var(--color-ink-muted)">No hay acertijo para hoy todavía.</p>
            </div>
          }
        </div>
      }
    </div>
    <app-bottom-nav />
  `,
  styles: [`
    .daily-card { padding: 2rem; }
    .daily-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem; }
    .daily-header h2 { font-size: 1rem; font-weight: 600; margin: 0; }
    .daily-meta { display: flex; gap: 0.5rem; margin-bottom: 1rem; flex-wrap: wrap; }
    .daily-question { font-size: 1.25rem; line-height: 1.6; font-style: italic; margin-bottom: 1.5rem; }
    .solved-state { text-align: center; padding: 1rem; }
    .solved-badge { font-size: 1.25rem; font-weight: 600; color: var(--color-success); margin-bottom: 0.5rem; }
    .active-state, .cta-state { display: flex; align-items: center; gap: 1rem; justify-content: center; flex-wrap: wrap; }
  `]
})
export class DashboardPageComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly riddleService = inject(RiddleService);

  protected readonly loading = signal(true);
  protected readonly error = signal('');
  protected readonly daily = signal<DailyRiddleResponse | null>(null);
  protected readonly today = new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  protected readonly userStats = signal({ streak: 0, level: 1, xp: 0 });
  protected readonly activeSeconds = signal(0);

  ngOnInit(): void {
    this.loadDaily();
  }

  protected loadDaily(): void {
    this.loading.set(true);
    this.error.set('');
    this.riddleService.getDaily().subscribe({
      next: (res) => {
        this.daily.set(res);
        this.loading.set(false);
        const user = this.auth.user();
        if (user) {
          const streak = (res.attempt && res.solved) ? (res as any).streak || 0 : 0;
          this.userStats.set({ streak, level: user.level, xp: user.xp });
        }
      },
      error: (err) => {
        this.error.set('No pudimos cargar el acertijo del día.');
        this.loading.set(false);
      },
    });
  }
}
