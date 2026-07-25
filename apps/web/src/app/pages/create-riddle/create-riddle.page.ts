import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RiddleService } from '../../services/riddle.service';
import { ToastService } from '../../services/toast.service';
import { NavbarComponent } from '../../shared/components/navbar.component';
import { BottomNavComponent } from '../../shared/components/bottom-nav.component';
import { Category } from '../../interfaces';

@Component({
  selector: 'app-create-riddle-page',
  imports: [RouterModule, FormsModule, NavbarComponent, BottomNavComponent],
  template: `
    <app-navbar />
    <div class="page-container" style="max-width:700px">
      <div class="page-header">
        <h1 class="page-title">✍️ Crear un Nuevo Riddle</h1>
      </div>

      <form (ngSubmit)="onSubmit()" class="create-form">
        <div class="form-group">
          <label class="form-label">Título * <span class="char-count">{{ title.length }}/100</span></label>
          <input type="text" class="input" [(ngModel)]="title" name="title" placeholder="El enigma del espejo misterioso..." maxlength="100" required />
        </div>

        <div class="form-group">
          <label class="form-label">Pregunta * <span class="char-count">{{ question.length }}/500</span></label>
          <textarea class="input" rows="4" [(ngModel)]="question" name="question" placeholder="Tengo ciudades, pero no casas. Tengo montañas, pero no árboles..." maxlength="500" required style="resize:vertical"></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">Respuesta * <span class="char-count">{{ answer.length }}/100</span></label>
          <input type="text" class="input" [(ngModel)]="answer" name="answer" placeholder="Un mapa" maxlength="100" required />
        </div>

        <div class="form-group">
          <label class="form-label">Explicación *</label>
          <textarea class="input" rows="3" [(ngModel)]="explanation" name="explanation" placeholder="Un mapa tiene nombres de ciudades, dibuja montañas, ríos y océanos..." required style="resize:vertical"></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Categoría</label>
            <select class="input" [(ngModel)]="categoryId" name="categoryId">
              <option value="">Seleccionar...</option>
              @for (cat of categories(); track cat.id) {
                <option [value]="cat.id">{{ cat.icon }} {{ cat.name }}</option>
              }
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Dificultad</label>
            <select class="input" [(ngModel)]="difficulty" name="difficulty">
              <option value="easy">🟢 Fácil</option>
              <option value="medium">🟡 Media</option>
              <option value="hard">🔴 Difícil</option>
            </select>
          </div>
        </div>

        <div class="hints-section">
          <label class="form-label">Pistas (opcional, hasta 3)</label>
          @for (hint of hints; track i; let i = $index) {
            <div class="hint-input-row">
              <span class="hint-number">{{ i + 1 }}</span>
              <input type="text" class="input" [(ngModel)]="hint.text" [name]="'hint' + i" placeholder="Pista {{ i + 1 }}" maxlength="200" />
              <select class="input hint-penalty" [(ngModel)]="hint.penalty" [name]="'penalty' + i">
                <option [value]="10">-10%</option>
                <option [value]="20">-20%</option>
                <option [value]="30">-30%</option>
              </select>
            </div>
          }
          @if (hints.length < 3) {
            <button type="button" class="btn btn-ghost btn-sm" (click)="addHint()">+ Añadir pista</button>
          }
        </div>

        @if (error()) {
          <div class="form-error">{{ error() }}</div>
        }

        <div class="form-actions">
          <a routerLink="/riddles" class="btn btn-ghost">🗑️ Cancelar</a>
          <button type="submit" class="btn btn-primary btn-lg" [disabled]="submitting()">
            {{ submitting() ? 'Publicando...' : '📤 Publicar' }}
          </button>
        </div>
      </form>
    </div>
    <app-bottom-nav />
  `,
  styles: [`
    .create-form { display: flex; flex-direction: column; gap: 1.25rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.375rem; }
    .form-label { font-size: 0.8125rem; font-weight: 500; display: flex; justify-content: space-between; }
    .char-count { font-weight: 400; color: var(--color-ink-muted); font-size: 0.75rem; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .hints-section { display: flex; flex-direction: column; gap: 0.5rem; }
    .hint-input-row { display: flex; gap: 0.5rem; align-items: center; }
    .hint-number { width: 24px; height: 24px; border-radius: 50%; background: var(--color-primary-muted); color: var(--color-primary); display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 600; flex-shrink: 0; }
    .hint-penalty { width: 100px; }
    .form-error { font-size: 0.8125rem; color: var(--color-error); text-align: center; }
    .form-actions { display: flex; gap: 1rem; justify-content: flex-end; padding-top: 0.5rem; }
    @media (max-width: 600px) { .form-row { grid-template-columns: 1fr; } }
  `]
})
export class CreateRiddlePageComponent implements OnInit {
  private readonly riddleService = inject(RiddleService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  protected categories = signal<Category[]>([]);
  protected title = '';
  protected question = '';
  protected answer = '';
  protected explanation = '';
  protected categoryId = '';
  protected difficulty = 'medium';
  protected hints: { text: string; penalty: number }[] = [];
  protected readonly submitting = signal(false);
  protected readonly error = signal('');

  ngOnInit(): void {
    this.riddleService.getCategories().subscribe({
      next: (cats) => this.categories.set(cats),
    });
  }

  addHint(): void {
    if (this.hints.length < 3) {
      this.hints = [...this.hints, { text: '', penalty: 10 }];
    }
  }

  onSubmit(): void {
    if (!this.title || !this.question || !this.answer || !this.explanation) {
      this.error.set('Please fill all required fields');
      return;
    }
    this.submitting.set(true);
    this.error.set('');

    const dto: any = {
      title: this.title,
      question: this.question,
      answer: this.answer,
      explanation: this.explanation,
      categoryId: this.categoryId,
      difficulty: this.difficulty,
      hints: this.hints.filter(h => h.text).map((h, i) => ({
        hintNumber: i + 1,
        text: h.text,
        penaltyPercent: h.penalty,
      })),
    };

    this.riddleService.create(dto).subscribe({
      next: (riddle) => {
        this.toast.success('Riddle publicado!');
        this.router.navigate(['/riddles', riddle.id]);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Error al publicar');
        this.submitting.set(false);
      },
    });
  }
}
