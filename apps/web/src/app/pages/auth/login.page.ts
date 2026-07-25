import { Component, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login-page',
  imports: [FormsModule, RouterModule],
  template: `
    <div class="auth-page">
      <div class="auth-card card">
        <div class="auth-header">
          <div class="auth-logo">🧩</div>
          <h1>Welcome back</h1>
          <p class="auth-subtitle">Solve today's riddle and continue your streak</p>
        </div>

        <form (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-group">
            <label class="form-label">Email</label>
            <input type="email" class="input" [(ngModel)]="email" name="email" placeholder="you@example.com" required />
          </div>
          <div class="form-group">
            <label class="form-label">Password</label>
            <input type="password" class="input" [(ngModel)]="password" name="password" placeholder="••••••••" required minlength="8" />
          </div>
          @if (error()) {
            <div class="form-error">{{ error() }}</div>
          }
          <button type="submit" class="btn btn-primary btn-lg" style="width:100%" [disabled]="loading()">
            {{ loading() ? 'Logging in...' : 'Login' }}
          </button>
        </form>

        <div class="auth-footer">
          Don't have an account? <a routerLink="/register">Register</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 1.5rem; }
    .auth-card { width: 100%; max-width: 400px; padding: 2rem; }
    .auth-header { text-align: center; margin-bottom: 1.5rem; }
    .auth-logo { font-size: 2.5rem; margin-bottom: 0.5rem; }
    .auth-header h1 { font-size: 1.5rem; font-weight: 600; margin: 0 0 0.25rem; }
    .auth-subtitle { font-size: 0.875rem; color: var(--color-ink-muted); margin: 0; }
    .auth-form { display: flex; flex-direction: column; gap: 1rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.375rem; }
    .form-label { font-size: 0.8125rem; font-weight: 500; color: var(--color-ink); }
    .form-error { font-size: 0.8125rem; color: var(--color-error); text-align: center; }
    .auth-footer { text-align: center; margin-top: 1rem; font-size: 0.8125rem; color: var(--color-ink-muted); }
    .auth-footer a { color: var(--color-primary); text-decoration: none; font-weight: 500; }
  `]
})
export class LoginPageComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  protected email = '';
  protected password = '';
  protected readonly loading = signal(false);
  protected readonly error = signal('');

  onSubmit(): void {
    if (!this.email || !this.password) return;
    this.loading.set(true);
    this.error.set('');
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.toast.success('Welcome back!');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Invalid credentials');
        this.loading.set(false);
      },
    });
  }
}
