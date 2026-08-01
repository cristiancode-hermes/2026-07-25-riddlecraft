import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UpperCasePipe } from '@angular/common';
import { ProfileService } from '../../services/data-services';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from '../../shared/components/navbar.component';
import { BottomNavComponent } from '../../shared/components/bottom-nav.component';
import { UserStats, UserAchievement } from '../../interfaces';

@Component({
  selector: 'app-profile-page',
  imports: [RouterModule, UpperCasePipe, NavbarComponent, BottomNavComponent],
  template: `
    <app-navbar />
    <div class="page-container" style="max-width:700px">
      @if (loading()) {
        <div class="card skeleton skeleton-card" style="height:300px"></div>
        <div class="card skeleton skeleton-card" style="height:200px;margin-top:1rem"></div>
      } @else {
        <div class="card profile-header">
          <div class="avatar-lg">{{ username()[0] | uppercase }}</div>
          <h1 class="profile-username">@{{ username() }}</h1>
        </div>

        @if (stats(); as s) {
          <div class="stats-grid">
            <div class="card kpi-card">
              <span class="kpi-icon">⭐</span>
              <div><div class="kpi-value">{{ s.level }}</div><div class="kpi-label">Nivel</div></div>
            </div>
            <div class="card kpi-card">
              <span class="kpi-icon">🔥</span>
              <div><div class="kpi-value">{{ s.currentStreak }} días</div><div class="kpi-label">Racha actual</div></div>
            </div>
            <div class="card kpi-card">
              <span class="kpi-icon">🏆</span>
              <div><div class="kpi-value">{{ s.xp.toLocaleString() }}</div><div class="kpi-label">XP total</div></div>
            </div>
            <div class="card kpi-card">
              <span class="kpi-icon">🧩</span>
              <div><div class="kpi-value">{{ s.totalSolved }}</div><div class="kpi-label">Resueltos</div></div>
            </div>
          </div>

          <div class="level-progress card">
            <div class="level-info">
              <span>Nivel {{ s.level }}</span>
              <span>{{ s.currentLevelXp.toLocaleString() }} / {{ s.nextLevelXp.toLocaleString() }} XP</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" [style.width.%]="progressPercent()"></div>
            </div>
          </div>

          @if (achievements().length > 0) {
            <div class="card achievements-preview">
              <h3 style="font-size:0.875rem;font-weight:600;margin:0 0 0.75rem">🎯 Logros ({{ s.achievementsUnlocked }}/{{ s.achievementsTotal }})</h3>
              <div class="achievement-chips">
                @for (a of achievements().slice(0, 6); track a.id) {
                  <span class="badge badge-achievement">{{ a.achievement?.name || a.achievementId }}</span>
                }
              </div>
            </div>
          }
        }
      }
    </div>
    <app-bottom-nav />
  `,
  styles: [`
    .profile-header { text-align: center; padding: 2rem; }
    .avatar-lg { width: 64px; height: 64px; border-radius: 50%; background: var(--color-primary); color: white; display: inline-flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 700; margin-bottom: 0.75rem; }
    .profile-username { font-size: 1.5rem; font-weight: 700; margin: 0; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 0.75rem; margin: 1rem 0; }
    .level-progress { padding: 1rem; margin-bottom: 1rem; }
    .level-info { display: flex; justify-content: space-between; font-size: 0.8125rem; margin-bottom: 0.5rem; }
    .progress-bar { height: 8px; background: var(--color-surface-secondary); border-radius: 4px; overflow: hidden; }
    .progress-fill { height: 100%; background: var(--color-primary); border-radius: 4px; transition: width 0.3s; }
    .achievements-preview { padding: 1rem; }
    .achievement-chips { display: flex; gap: 0.375rem; flex-wrap: wrap; }
  `]
})
export class ProfilePageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly profileService = inject(ProfileService);
  private readonly auth = inject(AuthService);

  protected readonly username = signal('');
  protected readonly stats = signal<UserStats | null>(null);
  protected readonly achievements = signal<UserAchievement[]>([]);
  protected readonly loading = signal(true);

  protected progressPercent = () => {
    const s = this.stats();
    if (!s) return 0;
    return Math.min(100, (s.currentLevelXp / s.nextLevelXp) * 100);
  };

  ngOnInit(): void {
    const username = this.route.snapshot.paramMap.get('username') || this.auth.user()?.username || '';
    this.username.set(username);
    
    this.profileService.getProfile(username).subscribe({
      next: (res: any) => {
        this.stats.set(res.stats);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });

    this.profileService.getAchievements(username).subscribe({
      next: (ach) => this.achievements.set(ach.items),
    });
  }
}
