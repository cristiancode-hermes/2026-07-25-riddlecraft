import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly THEME_KEY = 'riddlecraft_theme';
  
  private readonly themeSignal = signal<'light' | 'dark' | 'system'>(
    (localStorage.getItem(this.THEME_KEY) as 'light' | 'dark' | 'system') || 'system'
  );
  readonly theme = this.themeSignal.asReadonly();

  constructor() {
    this.applyTheme(this.themeSignal());
  }

  setTheme(theme: 'light' | 'dark' | 'system'): void {
    localStorage.setItem(this.THEME_KEY, theme);
    this.themeSignal.set(theme);
    this.applyTheme(theme);
  }

  private applyTheme(theme: 'light' | 'dark' | 'system'): void {
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', isDark);
  }
}
