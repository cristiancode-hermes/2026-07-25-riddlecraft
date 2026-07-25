import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AchievementService } from '../../services/data-services';
import { NavbarComponent } from '../../shared/components/navbar.component';
import { BottomNavComponent } from '../../shared/components/bottom-nav.component';
import { Achievement, UserAchievement } from '../../interfaces';

@Component({
  selector: 'app-achievements-page',
  imports: [RouterModule, NavbarComponent, BottomNavComponent],
  template: `
    <app-navbar />
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">🎯 Achievements</h1>
        <p style="color:var(--color-ink-muted);font-size:0.875rem">
          {{ unlockedCount() }} / {{ achievements().length }} unlocked
        </p>
      </div>

      @if (loading()) {
        <div class="riddle-grid">
          @for (_ of [1,2,3,4,5,6]; track _) {
            <div class="card skeleton skeleton-card" style="height:120px"></div>
          }
        </div>
      } @else {
        <div class="achievement-grid">
          @for (a of achievements(); track a.id) {
            <div class="card achievement-card" [class.locked]="!isUnlocked(a.id)">
              <div class="ach-icon">{{ isUnlocked(a.id) ? '🏆' : '🔒' }}</div>
              <div class="ach-info">
                <h3 class="ach-name">{{ a.name }}</h3>
                <p class="ach-desc">{{ a.description }}</p>
                <span class="ach-xp">+{{ a.xpReward }} XP</span>
              </div>
            </div>
          }
        </div>
      }
    </div>
    <app-bottom-nav />
  `,
  styles: [`
    .achievement-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 0.75rem; }
    .achievement-card { display: flex; gap: 1rem; align-items: center; padding: 1rem; }
    .achievement-card.locked { opacity: 0.5; }
    .ach-icon { font-size: 2rem; }
    .ach-info { flex: 1; }
    .ach-name { font-size: 0.9375rem; font-weight: 600; margin: 0 0 0.25rem; }
    .ach-desc { font-size: 0.8125rem; color: var(--color-ink-muted); margin: 0 0 0.25rem; }
    .ach-xp { font-size: 0.75rem; color: var(--color-accent); font-weight: 600; }
  `]
})
export class AchievementsPageComponent implements OnInit {
  private readonly achievementService = inject(AchievementService);

  protected readonly achievements = signal<Achievement[]>([]);
  protected readonly userAchievements = signal<Set<string>>(new Set());
  protected readonly loading = signal(true);

  protected unlockedCount = () => this.userAchievements().size;

  isUnlocked(achievementId: string): boolean {
    return this.userAchievements().has(achievementId);
  }

  ngOnInit(): void {
    this.achievementService.getAll().subscribe({
      next: (achs) => {
        this.achievements.set(achs);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });

    this.achievementService.getUserAchievements().subscribe({
      next: (userAchs) => {
        this.userAchievements.set(new Set(userAchs.map(ua => ua.achievementId)));
      },
    });
  }
}
