import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  template: `
    <div class="empty-state">
      <div class="empty-icon">{{ icon() }}</div>
      <h3 class="empty-title">{{ title() }}</h3>
      <p class="empty-message">{{ message() }}</p>
      @if (actionLabel()) {
        <button class="btn btn-primary" (click)="action.emit()">{{ actionLabel() }}</button>
      }
    </div>
  `,
  styles: [`
    .empty-state {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      padding: 3rem 1.5rem; text-align: center;
    }
    .empty-icon { font-size: 3rem; margin-bottom: 1rem; }
    .empty-title { font-size: 1.25rem; font-weight: 600; color: var(--color-ink); margin: 0 0 0.5rem; }
    .empty-message { font-size: 0.875rem; color: var(--color-ink-muted); margin: 0 0 1.5rem; max-width: 400px; }
  `]
})
export class EmptyStateComponent {
  readonly icon = input('📭');
  readonly title = input('Nothing here');
  readonly message = input('');
  readonly actionLabel = input('');
  readonly action = output<void>();
}
