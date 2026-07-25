import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/data-services';
import { NavbarComponent } from '../../shared/components/navbar.component';
import { BottomNavComponent } from '../../shared/components/bottom-nav.component';
import { AdminStats, DailyScheduleEntry } from '../../interfaces';

@Component({
  selector: 'app-admin-page',
  imports: [RouterModule, FormsModule, NavbarComponent, BottomNavComponent],
  template: `
    <app-navbar />
    <div class="page-container" style="max-width:800px">
      <div class="page-header">
        <h1 class="page-title">⚙️ Admin Panel</h1>
      </div>

      @if (loading()) {
        <div class="kpi-grid">
          @for (_ of [1,2,3,4]; track _) {
            <div class="card skeleton skeleton-card" style="height:100px"></div>
          }
        </div>
      } @else {
        <div class="kpi-grid" style="margin-bottom:1.5rem">
          <div class="card kpi-card"><span class="kpi-icon">👥</span><div><div class="kpi-value">{{ stats()?.userCount || 0 }}</div><div class="kpi-label">Users</div></div></div>
          <div class="card kpi-card"><span class="kpi-icon">🧩</span><div><div class="kpi-value">{{ stats()?.riddleCount || 0 }}</div><div class="kpi-label">Riddles</div></div></div>
          <div class="card kpi-card"><span class="kpi-icon">📅</span><div><div class="kpi-value">{{ stats()?.dailySolveCount || 0 }}</div><div class="kpi-label">Daily solves</div></div></div>
          <div class="card kpi-card"><span class="kpi-icon">🚩</span><div><div class="kpi-value">{{ stats()?.reportsCount || 0 }}</div><div class="kpi-label">Reports</div></div></div>
        </div>

        <div class="card" style="margin-bottom:1rem;padding:1.5rem">
          <h3 style="font-size:1rem;font-weight:600;margin:0 0 1rem">📅 Daily Riddle Schedule</h3>
          @if (schedule().length === 0) {
            <p style="font-size:0.875rem;color:var(--color-ink-muted)">No daily riddles scheduled yet.</p>
          }
          <div class="schedule-list">
            @for (entry of schedule(); track entry.id) {
              <div class="schedule-item">
                <span>{{ entry.date }}</span>
                <span>{{ entry.riddleTitle }}</span>
                <span>x{{ entry.bonusMultiplier }}</span>
              </div>
            }
          </div>
        </div>
      }
    </div>
    <app-bottom-nav />
  `,
  styles: [`
    .schedule-list { display: flex; flex-direction: column; gap: 0.5rem; }
    .schedule-item { display: flex; justify-content: space-between; padding: 0.5rem; background: var(--color-surface-secondary); border-radius: 6px; font-size: 0.8125rem; }
  `]
})
export class AdminPageComponent implements OnInit {
  private readonly adminService = inject(AdminService);

  protected readonly loading = signal(true);
  protected readonly stats = signal<AdminStats | null>(null);
  protected readonly schedule = signal<DailyScheduleEntry[]>([]);

  ngOnInit(): void {
    this.adminService.getStats().subscribe({
      next: (s) => {
        this.stats.set(s);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });

    this.adminService.getDailySchedule().subscribe({
      next: (s) => this.schedule.set(s),
    });
  }
}
