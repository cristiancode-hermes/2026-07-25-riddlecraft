import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service';
import { ThemeService } from './services/theme.service';
import { ToastService } from './services/toast.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterModule, NgClass],
  template: `
    <router-outlet></router-outlet>
    @if (toastService.messages().length > 0) {
      <div class="toast-container">
        @for (msg of toastService.messages(); track msg.id) {
          <div class="toast toast-{{ msg.type }}" (click)="toastService.dismiss(msg.id)">
            {{ msg.text }}
          </div>
        }
      </div>
    }
  `,
  styles: [`
    :host { display: block; min-height: 100vh; }
  `]
})
export class AppComponent implements OnInit {
  private readonly auth = inject(AuthService);
  protected readonly toastService = inject(ToastService);

  ngOnInit(): void {
    this.auth.tryRestoreSession().subscribe();
  }
}
