import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LeaderboardService } from '../../services/data-services';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from '../../shared/components/navbar.component';
import { BottomNavComponent } from '../../shared/components/bottom-nav.component';
import { LeaderboardEntry } from '../../interfaces';

@Component({
  selector: 'app-leaderboard-page',
  imports: [RouterModule, NavbarComponent, BottomNavComponent],
  template: `
    <app-navbar />
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">🏆 Tabla de Clasificación</h1>
      </div>

      <div class="tabs">
        <a routerLink="/leaderboard/daily" class="tab" [class.tab-active]="type() === 'daily'">📅 Daily</a>
        <a routerLink="/leaderboard/alltime" class="tab" [class.tab-active]="type() === 'alltime'">🌐 All-Time</a>
      </div>

      @if (loading()) {
        <div class="card" style="padding:1rem">
          @for (_ of [1,2,3,4,5]; track _) {
            <div class="skeleton" style="height:2rem;margin-bottom:0.5rem"></div>
          }
        </div>
      } @else if (error()) {
        <div class="card" style="text-align:center;padding:2rem">
          <p style="color:var(--color-error)">{{ error() }}</p>
          <button class="btn btn-primary" (click)="loadLeaderboard()">Retry</button>
        </div>
      } @else {
        <div class="card" style="padding:0;overflow:hidden">
          <table class="leaderboard-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Usuario</th>
                @if (type() === 'daily') {
                  <th>Score</th>
                  <th>Tiempo</th>
                  <th>💡</th>
                  <th>🔥</th>
                } @else {
                  <th>XP</th>
                  <th>Nivel</th>
                  <th>Resueltos</th>
                }
              </tr>
            </thead>
            <tbody>
              @for (entry of entries(); track entry.rank) {
                <tr [class.current-user]="entry.username === currentUsername()">
                  <td><span class="rank-badge" [class]="'rank-' + entry.rank">{{ entry.rank }}</span></td>
                  <td><strong>@{{ entry.username }}</strong></td>
                  @if (type() === 'daily') {
                    <td><strong>{{ entry.score.toLocaleString() }}</strong></td>
                    <td>{{ entry.timeSeconds }}s</td>
                    <td>{{ entry.hintsUsed || 0 }}</td>
                    <td>🔥{{ entry.streak || 0 }}</td>
                  } @else {
                    <td>{{ entry.xp?.toLocaleString() || 0 }}</td>
                    <td>{{ entry.level || 0 }}</td>
                    <td>{{ entry.totalSolved || 0 }}</td>
                  }
                </tr>
              }
            </tbody>
          </table>
        </div>

        @if (userPosition(); as pos) {
          <div class="card user-position">
            <span>👤 Tu posición: <strong>#{{ pos.rank }}</strong> — {{ pos.score.toLocaleString() }} pts</span>
          </div>
        }
      }
    </div>
    <app-bottom-nav />
  `,
  styles: [`
    .tabs { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; }
    .tab { padding: 0.5rem 1rem; border-radius: 6px; font-size: 0.875rem; font-weight: 500; text-decoration: none; color: var(--color-ink-muted); background: var(--color-surface); border: 1px solid var(--color-border); }
    .tab-active { background: var(--color-primary-muted); color: var(--color-primary); border-color: var(--color-primary); }
    .rank-badge { font-weight: 700; }
    .rank-1 { color: #FFD700; }
    .rank-2 { color: #C0C0C0; }
    .rank-3 { color: #CD7F32; }
    .current-user { background: var(--color-primary-muted); }
    .user-position { margin-top: 1rem; padding: 1rem; text-align: center; font-size: 0.875rem; }
  `]
})
export class LeaderboardPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly leaderboardService = inject(LeaderboardService);

  protected readonly type = signal<'daily' | 'alltime'>('daily');
  protected readonly entries = signal<LeaderboardEntry[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal('');
  protected readonly userPosition = signal<{ rank: number; score: number } | null>(null);
  protected authUser$: any; // placeholder
  private readonly auth = inject(AuthService);
  protected currentUsername = () => this.auth.user()?.username || '';

  ngOnInit(): void {
    this.type.set(this.route.snapshot.url[0]?.path === 'alltime' ? 'alltime' : 'daily');
    this.loadLeaderboard();
  }

  protected loadLeaderboard(): void {
    this.loading.set(true);
    this.error.set('');
    
    const obs = this.type() === 'daily' 
      ? this.leaderboardService.getDaily()
      : this.leaderboardService.getAlltime();

    obs.subscribe({
      next: (res) => {
        this.entries.set(res.items);
        this.userPosition.set(res.userPosition || null);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load leaderboard');
        this.loading.set(false);
      },
    });
  }
}
