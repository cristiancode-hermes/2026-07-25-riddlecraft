import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RiddleService } from '../../services/riddle.service';
import { NavbarComponent } from '../../shared/components/navbar.component';
import { BottomNavComponent } from '../../shared/components/bottom-nav.component';
import { BadgeComponent } from '../../shared/components/badge.component';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';
import { Category } from '../../interfaces';

@Component({
  selector: 'app-browse-page',
  imports: [RouterModule, FormsModule, NavbarComponent, BottomNavComponent, BadgeComponent, EmptyStateComponent],
  template: `
    <app-navbar />
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">🧩 Riddles de la Comunidad</h1>
      </div>

      <div class="browse-controls">
        <div class="search-bar">
          <input type="text" class="input" placeholder="🔍 Buscar riddles..." [(ngModel)]="searchQuery" (ngModelChange)="onSearch()" />
        </div>
        <div class="filter-row">
          <div class="filter-pills">
            <button class="pill" [class.pill-active]="!selectedCategory()" (click)="filterByCategory('')">Todas</button>
            @for (cat of categories(); track cat.id) {
              <button class="pill" [class.pill-active]="selectedCategory() === cat.slug" (click)="filterByCategory(cat.slug)">
                {{ cat.icon }} {{ cat.name }}
              </button>
            }
          </div>
          <div class="filter-pills">
            @for (diff of ['', 'easy', 'medium', 'hard']; track diff) {
              <button class="pill" [class.pill-active]="selectedDifficulty() === diff" (click)="filterByDifficulty(diff)">
                {{ diff ? (diff === 'easy' ? '🟢' : diff === 'medium' ? '🟡' : '🔴') : '⚪' }} {{ diff || 'Todas' }}
              </button>
            }
          </div>
        </div>
      </div>

      @if (loading()) {
        <div class="riddle-grid">
          @for (_ of [1,2,3,4,5,6]; track _) {
            <div class="card skeleton skeleton-card" style="height:200px"></div>
          }
        </div>
      } @else if (error()) {
        <div class="card" style="text-align:center;padding:2rem">
          <p style="color:var(--color-error)">{{ error() }}</p>
          <button class="btn btn-primary" (click)="loadRiddles()">Reintentar</button>
        </div>
      } @else if (riddles().length === 0) {
        <app-empty-state icon="📭" title="No riddles found" message="No encontramos riddles con esos filtros." actionLabel="Crear uno" (action)="onCreate()" />
      } @else {
        <div class="riddle-grid">
          @for (riddle of riddles(); track riddle.id) {
            <a [routerLink]="['/riddles', riddle.id]" class="card riddle-card">
              <div class="card-header">
                <app-badge variant="category">{{ riddle.category?.name || 'General' }}</app-badge>
                <app-badge [variant]="riddle.difficulty">{{ riddle.difficulty }}</app-badge>
              </div>
              <h3 class="card-title">{{ riddle.title }}</h3>
              <div class="card-meta">
                <span>⭐ {{ riddle.averageRating.toFixed(1) }}</span>
                <span>{{ riddle.timesSolved }} solves</span>
              </div>
              <div class="card-footer">
                <span class="creator">por @{{ riddle.creator?.username || 'unknown' }}</span>
                <span class="solved-indicator">{{ riddle.solved ? '✅' : '○' }}</span>
              </div>
            </a>
          }
        </div>

        @if (totalPages() > 1) {
          <div class="pagination">
            <button class="btn btn-ghost btn-sm" [disabled]="currentPage() <= 1" (click)="changePage(currentPage() - 1)">←</button>
            <span class="page-info">{{ currentPage() }} / {{ totalPages() }}</span>
            <button class="btn btn-ghost btn-sm" [disabled]="currentPage() >= totalPages()" (click)="changePage(currentPage() + 1)">→</button>
          </div>
        }
      }
    </div>

    <a routerLink="/riddles/create" class="fab">➕</a>
    <app-bottom-nav />
  `,
  styles: [`
    .browse-controls { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.5rem; }
    .search-bar { max-width: 400px; }
    .filter-row { display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center; }
    .filter-pills { display: flex; gap: 0.375rem; flex-wrap: wrap; }
    .pill { padding: 0.25rem 0.625rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 500; cursor: pointer; border: 1px solid var(--color-border); background: transparent; color: var(--color-ink-muted); transition: all 0.15s; }
    .pill:hover { border-color: var(--color-primary); color: var(--color-primary); }
    .pill-active { background: var(--color-primary-muted); color: var(--color-primary); border-color: var(--color-primary); }
    .riddle-card { text-decoration: none; color: inherit; display: block; transition: transform 0.15s, box-shadow 0.15s; }
    .riddle-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
    .card-header { display: flex; gap: 0.5rem; margin-bottom: 0.75rem; }
    .card-title { font-size: 1rem; font-weight: 600; margin: 0 0 0.5rem; line-height: 1.3; }
    .card-meta { display: flex; gap: 1rem; font-size: 0.75rem; color: var(--color-ink-muted); margin-bottom: 0.75rem; }
    .card-footer { display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: var(--color-ink-muted); border-top: 1px solid var(--color-border); padding-top: 0.75rem; }
    .fab { position: fixed; bottom: 5rem; right: 1.5rem; width: 56px; height: 56px; border-radius: 50%; background: var(--color-primary); color: white; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; box-shadow: 0 4px 12px rgba(0,0,0,0.2); text-decoration: none; z-index: 50; transition: transform 0.15s; }
    .fab:hover { transform: scale(1.1); }
    .pagination { display: flex; align-items: center; justify-content: center; gap: 0.75rem; margin-top: 1.5rem; }
    .page-info { font-size: 0.8125rem; color: var(--color-ink-muted); }
  `]
})
export class BrowsePageComponent implements OnInit {
  private readonly riddleService = inject(RiddleService);

  protected readonly riddles = signal<any[]>([]);
  protected readonly categories = signal<Category[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal('');
  protected readonly selectedCategory = signal('');
  protected readonly selectedDifficulty = signal('');
  protected readonly currentPage = signal(1);
  protected readonly totalPages = signal(1);
  protected searchQuery = '';

  ngOnInit(): void {
    this.riddleService.getCategories().subscribe({
      next: (cats) => this.categories.set(cats),
    });
    this.loadRiddles();
  }

  loadRiddles(): void {
    this.loading.set(true);
    this.error.set('');
    this.riddleService.getAll({
      category: this.selectedCategory() || undefined,
      difficulty: this.selectedDifficulty() || undefined,
      search: this.searchQuery || undefined,
      page: this.currentPage(),
      limit: 12,
    }).subscribe({
      next: (res: any) => {
        this.riddles.set(res.items);
        this.totalPages.set(res.totalPages);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Error al cargar riddles.');
        this.loading.set(false);
      },
    });
  }

  onSearch(): void {
    this.currentPage.set(1);
    this.loadRiddles();
  }

  filterByCategory(slug: string): void {
    this.selectedCategory.set(slug);
    this.currentPage.set(1);
    this.loadRiddles();
  }

  filterByDifficulty(diff: string): void {
    this.selectedDifficulty.set(diff);
    this.currentPage.set(1);
    this.loadRiddles();
  }

  changePage(page: number): void {
    this.currentPage.set(page);
    this.loadRiddles();
  }

  onCreate(): void {
    window.location.href = '/riddles/create';
  }
}
