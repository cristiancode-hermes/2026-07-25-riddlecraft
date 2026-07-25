import { Component, input } from '@angular/core';

@Component({
  selector: 'app-badge',
  template: `
    <span class="badge" [class]="variant()">
      <ng-content></ng-content>
    </span>
  `,
})
export class BadgeComponent {
  readonly variant = input<'category' | 'easy' | 'medium' | 'hard' | 'achievement' | 'info'>('info');
}
