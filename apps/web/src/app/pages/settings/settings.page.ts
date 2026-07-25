import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../services/data-services';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { ThemeService } from '../../services/theme.service';
import { NavbarComponent } from '../../shared/components/navbar.component';
import { BottomNavComponent } from '../../shared/components/bottom-nav.component';
import { UserSettings } from '../../interfaces';

@Component({
  selector: 'app-settings-page',
  imports: [RouterModule, FormsModule, NavbarComponent, BottomNavComponent],
  template: `
    <app-navbar />
    <div class="page-container" style="max-width:600px">
      <div class="page-header"><h1 class="page-title">⚙️ Settings</h1></div>

      @if (loading()) {
        <div class="card skeleton skeleton-card" style="height:200px"></div>
      } @else {
        <div class="card">
          <h3 style="font-size:1rem;font-weight:600;margin:0 0 1rem">Profile</h3>
          <div class="form-group">
            <label class="form-label">Username</label>
            <input type="text" class="input" [(ngModel)]="username" name="username" maxlength="30" />
          </div>
          <button class="btn btn-primary" (click)="updateProfile()" [disabled]="savingProfile()">
            {{ savingProfile() ? 'Saving...' : 'Save' }}
          </button>
        </div>

        <div class="card" style="margin-top:1rem">
          <h3 style="font-size:1rem;font-weight:600;margin:0 0 1rem">Theme</h3>
          <div class="theme-options">
            @for (opt of themeOptions; track opt.value) {
              <button class="theme-btn" [class.theme-active]="(settings()?.theme || 'system') === opt.value"
                (click)="setTheme(opt.value)">
                {{ opt.icon }} {{ opt.label }}
              </button>
            }
          </div>
        </div>

        <div class="card" style="margin-top:1rem">
          <h3 style="font-size:1rem;font-weight:600;margin:0 0 1rem">Notifications</h3>
          <div class="toggle-row">
            <span>Daily reminder</span>
            <button class="toggle" [class.toggle-on]="dailyReminder()" (click)="dailyReminder.set(!dailyReminder()); saveSettings()">
              {{ dailyReminder() ? 'ON' : 'OFF' }}
            </button>
          </div>
          <div class="toggle-row">
            <span>In-app notifications</span>
            <button class="toggle" [class.toggle-on]="notifications()" (click)="notifications.set(!notifications()); saveSettings()">
              {{ notifications() ? 'ON' : 'OFF' }}
            </button>
          </div>
        </div>
      }
    </div>
    <app-bottom-nav />
  `,
  styles: [`
    .card { padding: 1.5rem; }
    .form-group { margin-bottom: 1rem; }
    .form-label { display: block; font-size: 0.8125rem; font-weight: 500; margin-bottom: 0.375rem; }
    .theme-options { display: flex; gap: 0.5rem; }
    .theme-btn { padding: 0.5rem 1rem; border-radius: 6px; border: 1px solid var(--color-border); background: transparent; cursor: pointer; font-size: 0.875rem; }
    .theme-active { background: var(--color-primary-muted); color: var(--color-primary); border-color: var(--color-primary); }
    .toggle-row { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; font-size: 0.875rem; }
    .toggle { padding: 0.375rem 0.75rem; border-radius: 6px; border: 1px solid var(--color-border); background: transparent; cursor: pointer; font-size: 0.75rem; font-weight: 500; min-width: 60px; }
    .toggle-on { background: var(--color-success); color: white; border-color: var(--color-success); }
  `]
})
export class SettingsPageComponent implements OnInit {
  private readonly profileService = inject(ProfileService);
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);
  private readonly themeService = inject(ThemeService);

  protected readonly loading = signal(true);
  protected readonly savingProfile = signal(false);
  protected readonly settings = signal<UserSettings | null>(null);
  protected readonly dailyReminder = signal(false);
  protected readonly notifications = signal(true);
  protected username = '';
  
  protected readonly themeOptions: { value: 'light' | 'dark' | 'system'; icon: string; label: string }[] = [
    { value: 'light', icon: '☀️', label: 'Light' },
    { value: 'dark', icon: '🌙', label: 'Dark' },
    { value: 'system', icon: '💻', label: 'System' },
  ];

  ngOnInit(): void {
    this.username = this.auth.user()?.username || '';
    this.profileService.getSettings().subscribe({
      next: (s) => {
        this.settings.set(s);
        this.dailyReminder.set(s.dailyReminder);
        this.notifications.set(s.notifications);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  setTheme(theme: 'light' | 'dark' | 'system'): void {
    this.themeService.setTheme(theme);
    this.saveSettings();
  }

  updateProfile(): void {
    this.savingProfile.set(true);
    this.auth.updateProfile({ username: this.username }).subscribe({
      next: () => {
        this.toast.success('Profile updated');
        this.savingProfile.set(false);
      },
      error: () => {
        this.toast.error('Failed to update profile');
        this.savingProfile.set(false);
      },
    });
  }

  saveSettings(): void {
    this.profileService.updateSettings({
      theme: this.settings()?.theme || 'system',
      dailyReminder: this.dailyReminder(),
      notifications: this.notifications(),
    }).subscribe();
  }
}
