import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap, map } from 'rxjs';
import { UserProfile, AuthResponse, LoginDto, RegisterDto } from '../interfaces';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly TOKEN_KEY = 'riddlecraft_token';
  
  private readonly userSignal = signal<UserProfile | null>(null);
  readonly user = this.userSignal.asReadonly();
  
  private readonly loadingSignal = signal(false);
  readonly loading = this.loadingSignal.asReadonly();

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  tryRestoreSession(): Observable<UserProfile | null> {
    const token = this.getToken();
    if (!token) return of(null);
    
    this.loadingSignal.set(true);
    return this.http.get<{ data: { user: UserProfile } }>('/api/auth/me').pipe(
      map(res => res.data.user),
      tap(user => {
        this.userSignal.set(user);
        this.loadingSignal.set(false);
      })
    );
  }

  login(dto: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/auth/login', dto).pipe(
      tap(res => {
        localStorage.setItem(this.TOKEN_KEY, res.token);
        this.userSignal.set(res.user);
      })
    );
  }

  register(dto: RegisterDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/auth/register', dto).pipe(
      tap(res => {
        localStorage.setItem(this.TOKEN_KEY, res.token);
        this.userSignal.set(res.user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.userSignal.set(null);
  }

  updateProfile(data: { username?: string }): Observable<UserProfile> {
    return this.http.put<{ data: { user: UserProfile } }>('/api/auth/profile', data).pipe(
      map(res => res.data.user),
      tap(user => this.userSignal.set(user))
    );
  }
}
