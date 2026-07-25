import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SolveService } from '../../services/solve.service';
import { NavbarComponent } from '../../shared/components/navbar.component';
import { BottomNavComponent } from '../../shared/components/bottom-nav.component';
import { SubmitAnswerResponse } from '../../interfaces';

@Component({
  selector: 'app-result-page',
  imports: [RouterModule, NavbarComponent, BottomNavComponent],
  template: `
    <app-navbar />
    <div class="page-container" style="max-width:600px">
      @if (loading()) {
        <div class="card skeleton skeleton-card" style="height:400px"></div>
      } @else if (result(); as r) {
        <div class="result-card card">
          <div class="result-icon">🎉</div>
          <h1 class="result-title">¡Acertaste!</h1>

          <div class="score-display">
            <div class="score-item">
              <span class="score-label">XP Ganado</span>
              <span class="score-value gold">+{{ r.score || 0 }}</span>
            </div>
            <div class="score-item">
              <span class="score-label">Tiempo</span>
              <span class="score-value">{{ r.attempt?.timeSeconds || 0 }}s</span>
            </div>
            <div class="score-item">
              <span class="score-label">Pistas usadas</span>
              <span class="score-value">{{ r.attempt?.hintsUsed || 0 }}</span>
            </div>
          </div>

          <div class="result-actions">
            <a routerLink="/dashboard" class="btn btn-primary">🏠 Volver al Dashboard</a>
            <a routerLink="/leaderboard/daily" class="btn btn-secondary">🏆 Leaderboard</a>
          </div>
        </div>
      } @else {
        <div class="card" style="text-align:center;padding:2rem">
          <p>Resultado no encontrado</p>
          <a routerLink="/dashboard" class="btn btn-primary">Back to Dashboard</a>
        </div>
      }
    </div>
    <app-bottom-nav />
  `,
  styles: [`
    .result-card { text-align: center; padding: 2.5rem; }
    .result-icon { font-size: 4rem; margin-bottom: 1rem; }
    .result-title { font-size: 1.75rem; font-weight: 700; margin: 0 0 2rem; }
    .score-display { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 2rem; }
    .score-item { display: flex; flex-direction: column; gap: 0.25rem; }
    .score-label { font-size: 0.75rem; color: var(--color-ink-muted); text-transform: uppercase; letter-spacing: 0.05em; }
    .score-value { font-size: 1.5rem; font-weight: 700; }
    .score-value.gold { color: var(--color-accent); }
    .result-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
  `]
})
export class ResultPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly solveService = inject(SolveService);

  protected readonly loading = signal(true);
  protected readonly result = signal<SubmitAnswerResponse | null>(null);

  ngOnInit(): void {
    const attemptId = this.route.snapshot.paramMap.get('attemptId') || '';
    if (attemptId) {
      this.solveService.getAttempt(attemptId).subscribe({
        next: (attempt) => {
          this.result.set({ correct: true, attempt, score: attempt.score });
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
    } else {
      this.loading.set(false);
    }
  }
}
