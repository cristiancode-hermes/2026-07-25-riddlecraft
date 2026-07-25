import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found-page',
  imports: [RouterModule],
  template: `
    <div class="not-found">
      <div class="not-found-content">
        <div class="nf-icon">🧩</div>
        <h1>404 — Riddle Not Found</h1>
        <p>This page doesn't exist. Maybe it was a trick question?</p>
        <a routerLink="/dashboard" class="btn btn-primary">Go to Dashboard</a>
      </div>
    </div>
  `,
  styles: [`
    .not-found { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 1.5rem; }
    .not-found-content { text-align: center; }
    .nf-icon { font-size: 4rem; margin-bottom: 1rem; }
    .not-found-content h1 { font-size: 1.5rem; font-weight: 600; margin: 0 0 0.5rem; }
    .not-found-content p { color: var(--color-ink-muted); margin: 0 0 1.5rem; }
  `]
})
export class NotFoundPageComponent {}
