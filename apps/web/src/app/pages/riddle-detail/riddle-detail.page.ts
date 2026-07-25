import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { RiddleService } from '../../services/riddle.service';
import { SolveService } from '../../services/solve.service';
import { NavbarComponent } from '../../shared/components/navbar.component';
import { BottomNavComponent } from '../../shared/components/bottom-nav.component';
import { BadgeComponent } from '../../shared/components/badge.component';
import { Riddle, Hint, Comment } from '../../interfaces';

@Component({
  selector: 'app-riddle-detail-page',
  imports: [RouterModule, FormsModule, DatePipe, NavbarComponent, BottomNavComponent, BadgeComponent],
  template: `
    <app-navbar />
    <div class="page-container" style="max-width:700px">
      @if (loading()) {
        <div class="card skeleton skeleton-card" style="height:300px"></div>
      } @else if (riddle(); as r) {
        <div class="card riddle-detail-card">
          <div class="detail-header">
            <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
              <app-badge variant="category">{{ r.category?.name || 'General' }}</app-badge>
              <app-badge [variant]="r.difficulty">{{ r.difficulty }}</app-badge>
            </div>
            <div class="detail-meta">
              <span>⭐ {{ r.averageRating.toFixed(1) }} ({{ r.ratingCount }})</span>
              <span>{{ r.timesSolved }} solves</span>
            </div>
          </div>

          <h2 class="detail-title">{{ r.title }}</h2>
          <p class="detail-question">"{{ r.question }}"</p>
          <p class="detail-creator">por @{{ r.creator?.username || 'unknown' }}</p>

          <!-- Inline solve -->
          @if (!solved()) {
            <form (ngSubmit)="submitAnswer()" class="inline-solve">
              <input type="text" class="input" [(ngModel)]="answer" name="answer" placeholder="Escribe tu respuesta..." />
              <button type="submit" class="btn btn-primary" [disabled]="!answer">Responder</button>
            </form>
            @if (solveError()) {
              <p style="color:var(--color-error);font-size:0.8125rem">{{ solveError() }}</p>
            }
          } @else {
            <div class="solved-banner">
              <span>✅ Resuelto</span>
              <a [routerLink]="['/result', attemptId()]" class="btn btn-secondary btn-sm">Ver resultado</a>
            </div>
          }
        </div>

        <!-- Comments -->
        <div class="card comments-section" style="margin-top:1rem">
          <h3 style="font-size:1rem;font-weight:600;margin:0 0 1rem">Comments</h3>
          <form (ngSubmit)="addComment()" class="comment-form">
            <input type="text" class="input" [(ngModel)]="commentText" name="commentText" placeholder="Add a comment..." />
            <button type="submit" class="btn btn-primary btn-sm" [disabled]="!commentText">Post</button>
          </form>
          @if (comments().length === 0) {
            <p style="font-size:0.875rem;color:var(--color-ink-muted)">No comments yet.</p>
          } @else {
            @for (c of comments(); track c.id) {
              <div class="comment-item">
                <strong>@{{ c.username }}</strong>
                <p>{{ c.text }}</p>
                <span class="comment-date">{{ c.createdAt | date:'short' }}</span>
              </div>
            }
          }
        </div>
      }
    </div>
    <app-bottom-nav />
  `,
  styles: [`
    .riddle-detail-card { padding: 2rem; }
    .detail-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem; }
    .detail-meta { display: flex; gap: 1rem; font-size: 0.75rem; color: var(--color-ink-muted); }
    .detail-title { font-size: 1.25rem; font-weight: 600; margin: 0 0 0.75rem; }
    .detail-question { font-size: 1.125rem; line-height: 1.6; font-style: italic; margin: 0 0 1rem; }
    .detail-creator { font-size: 0.8125rem; color: var(--color-ink-muted); margin-bottom: 1.5rem; }
    .inline-solve { display: flex; gap: 0.5rem; }
    .solved-banner { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: #d1fae5; border-radius: 6px; color: #065f46; font-weight: 500; }
    html.dark .solved-banner { background: #064e3b; color: #34d399; }
    .comments-section { padding: 1.5rem; }
    .comment-form { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
    .comment-item { padding: 0.75rem 0; border-bottom: 1px solid var(--color-border); }
    .comment-item:last-child { border-bottom: none; }
    .comment-item p { margin: 0.25rem 0; font-size: 0.875rem; }
    .comment-date { font-size: 0.75rem; color: var(--color-ink-muted); }
  `]
})
export class RiddleDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly riddleService = inject(RiddleService);
  private readonly solveService = inject(SolveService);

  protected readonly riddle = signal<Riddle | null>(null);
  protected readonly comments = signal<Comment[]>([]);
  protected readonly loading = signal(true);
  protected readonly solved = signal(false);
  protected readonly attemptId = signal('');
  protected readonly solveError = signal('');
  protected answer = '';
  protected commentText = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') || '';
    this.riddleService.getById(id).subscribe({
      next: (res) => {
        this.riddle.set(res.riddle);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  submitAnswer(): void {
    if (!this.answer) return;
    const riddleId = this.riddle()!.id;
    this.solveService.startAttempt(riddleId).subscribe({
      next: (attempt) => {
        this.solveService.submitAnswer(attempt.id, this.answer).subscribe({
          next: (res) => {
            if (res.correct) {
              this.solved.set(true);
              this.attemptId.set(attempt.id);
            } else {
              this.solveError.set('❌ Incorrect. Try again!');
              setTimeout(() => this.solveError.set(''), 2000);
            }
          },
          error: () => this.solveError.set('Error submitting answer'),
        });
      },
      error: () => this.solveError.set('Error starting attempt'),
    });
  }

  addComment(): void {
    // Comments not implemented yet
    this.commentText = '';
  }
}
