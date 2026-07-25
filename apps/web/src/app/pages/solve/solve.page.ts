import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RiddleService } from '../../services/riddle.service';
import { SolveService } from '../../services/solve.service';
import { ToastService } from '../../services/toast.service';
import { NavbarComponent } from '../../shared/components/navbar.component';
import { BottomNavComponent } from '../../shared/components/bottom-nav.component';
import { BadgeComponent } from '../../shared/components/badge.component';
import { TimerComponent } from '../../shared/components/timer.component';
import { Riddle, Hint } from '../../interfaces';

@Component({
  selector: 'app-solve-page',
  imports: [RouterModule, FormsModule, NavbarComponent, BottomNavComponent, BadgeComponent, TimerComponent],
  template: `
    <app-navbar />
    <div class="page-container solve-page">
      @if (loading()) {
        <div class="card skeleton skeleton-card" style="height:400px"></div>
      } @else if (riddle(); as r) {
        <div class="solve-header">
          <app-badge variant="category">{{ r.category?.name || 'General' }}</app-badge>
          <app-badge [variant]="r.difficulty">{{ r.difficulty }}</app-badge>
        </div>

        <p class="solve-question">"{{ r.question }}"</p>

        <app-timer [seconds]="timerSeconds()" />

        @if (error()) {
          <div class="solve-error">{{ error() }}</div>
        }

        <form (ngSubmit)="submitAnswer()" class="solve-form">
          <div class="input-group">
            <input type="text" class="input" [(ngModel)]="answer" name="answer" placeholder="Escribe tu respuesta..." [disabled]="solved()" />
            <button type="button" class="btn btn-ghost" (click)="requestHint()" [disabled]="solved() || loadingHint()">💡</button>
            <button type="submit" class="btn btn-primary" [disabled]="solved() || !answer || submitting()">
              {{ submitting() ? '...' : '✅' }}
            </button>
          </div>
        </form>

        @if (hints().length > 0) {
          <div class="hints-panel">
            @for (hint of hints(); track hint.id) {
              <div class="hint-item animate-fade-in">
                <span class="hint-icon">💡</span>
                <div>
                  <div class="hint-text">{{ hint.text }}</div>
                  <div class="hint-penalty">-{{ hint.penaltyPercent }}% score</div>
                </div>
              </div>
            }
          </div>
        }

        <div class="solve-stats">
          Intentos: {{ attempts() }} ❌ • Pistas usadas: {{ hints().length }}
        </div>

        @if (successMessage()) {
          <div class="solve-success animate-bounce-in">
            <div class="success-icon">🎉</div>
            <h2>¡Correcto!</h2>
            <p class="success-score">+{{ lastScore() }} XP</p>
            <a [routerLink]="['/result', attemptId()]" class="btn btn-primary">Ver resultado</a>
          </div>
        }
      }
    </div>
    <app-bottom-nav />
  `,
  styles: [`
    .solve-page { max-width: 700px; }
    .solve-header { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
    .solve-question { font-size: 1.25rem; line-height: 1.7; font-style: italic; margin-bottom: 1.5rem; font-weight: 500; }
    .solve-form { margin-bottom: 1.5rem; }
    .input-group { display: flex; gap: 0.5rem; }
    .input-group .input { flex: 1; }
    .hints-panel { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.5rem; }
    .hint-item { display: flex; gap: 0.75rem; padding: 0.75rem; background: var(--color-surface-secondary); border-radius: 6px; align-items: flex-start; }
    .hint-icon { font-size: 1.25rem; }
    .hint-text { font-size: 0.875rem; }
    .hint-penalty { font-size: 0.75rem; color: var(--color-error); }
    .solve-stats { font-size: 0.8125rem; color: var(--color-ink-muted); text-align: center; }
    .solve-success { text-align: center; padding: 2rem; }
    .success-icon { font-size: 3rem; margin-bottom: 0.5rem; }
    .solve-success h2 { margin: 0 0 0.5rem; font-size: 1.5rem; }
    .success-score { font-size: 1.75rem; font-weight: 700; color: var(--color-accent); margin: 0 0 1rem; }
    .solve-error { color: var(--color-error); font-size: 0.875rem; text-align: center; margin-bottom: 0.5rem; }
  `]
})
export class SolvePageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly riddleService = inject(RiddleService);
  private readonly solveService = inject(SolveService);
  private readonly toast = inject(ToastService);

  protected readonly riddle = signal<Riddle | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal('');
  protected readonly hints = signal<Hint[]>([]);
  protected readonly solved = signal(false);
  protected readonly submitting = signal(false);
  protected readonly loadingHint = signal(false);
  protected readonly successMessage = signal(false);
  protected readonly lastScore = signal(0);
  protected readonly attemptId = signal('');
  protected readonly attempts = signal(0);
  protected readonly timerSeconds = signal(0);
  
  protected answer = '';
  private riddleId = '';
  private attemptIdValue = '';
  private timerInterval: any = null;
  private startTime = 0;

  ngOnInit(): void {
    this.riddleId = this.route.snapshot.paramMap.get('id') || '';
    this.startTime = Date.now();
    this.loadRiddle();
    this.timerInterval = setInterval(() => {
      if (!this.solved()) {
        this.timerSeconds.set(Math.floor((Date.now() - this.startTime) / 1000));
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  private loadRiddle(): void {
    this.riddleService.getById(this.riddleId).subscribe({
      next: (res) => {
        this.riddle.set(res.riddle);
        this.loading.set(false);
        this.startAttempt();
      },
      error: () => {
        this.error.set('Failed to load riddle');
        this.loading.set(false);
      },
    });
  }

  private startAttempt(): void {
    this.solveService.startAttempt(this.riddleId).subscribe({
      next: (attempt) => {
        this.attemptIdValue = attempt.id;
        this.attemptId.set(attempt.id);
        this.attempts.set(attempt.attempts);
      },
      error: () => this.toast.error('Failed to start attempt'),
    });
  }

  submitAnswer(): void {
    if (!this.answer.trim() || !this.attemptIdValue) return;
    this.submitting.set(true);
    this.solveService.submitAnswer(this.attemptIdValue, this.answer).subscribe({
      next: (res) => {
        this.submitting.set(false);
        if (res.correct) {
          this.solved.set(true);
          this.successMessage.set(true);
          this.lastScore.set(res.score || 0);
          this.attemptId.set(this.attemptIdValue);
          if (this.timerInterval) clearInterval(this.timerInterval);
        } else {
          this.error.set('❌ ¡No es correcto! Intenta de nuevo.');
          this.answer = '';
          this.attempts.update(a => a + 1);
          setTimeout(() => this.error.set(''), 2000);
        }
      },
      error: () => {
        this.submitting.set(false);
        this.toast.error('Error submitting answer');
      },
    });
  }

  requestHint(): void {
    if (!this.attemptIdValue) return;
    this.loadingHint.set(true);
    this.solveService.requestHint(this.attemptIdValue).subscribe({
      next: (res) => {
        this.hints.update(h => [...h, res.hint]);
        this.loadingHint.set(false);
      },
      error: () => {
        this.loadingHint.set(false);
        this.toast.error('No more hints available');
      },
    });
  }
}
