import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LeaderboardResponse, Achievement, UserAchievement, UserProfile, UserStats, Comment, UserSettings, AdminStats, DailyScheduleEntry } from '../interfaces';

@Injectable({ providedIn: 'root' })
export class LeaderboardService {
  private readonly http = inject(HttpClient);

  getDaily(page = 1, limit = 50): Observable<LeaderboardResponse> {
    return this.http.get<LeaderboardResponse>('/api/leaderboard/daily', { params: { page, limit } as any });
  }

  getAlltime(page = 1, limit = 50): Observable<LeaderboardResponse> {
    return this.http.get<LeaderboardResponse>('/api/leaderboard/alltime', { params: { page, limit } as any });
  }
}

@Injectable({ providedIn: 'root' })
export class AchievementService {
  private readonly http = inject(HttpClient);

  getAll(): Observable<{ items: Achievement[] }> {
    return this.http.get<{ items: Achievement[] }>('/api/achievements');
  }

  getUserAchievements(): Observable<{ items: UserAchievement[] }> {
    return this.http.get<{ items: UserAchievement[] }>('/api/achievements/user');
  }
}

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly http = inject(HttpClient);

  getProfile(username: string): Observable<any> {
    return this.http.get(`/api/users/${username}`);
  }

  getSolves(username: string, page = 1): Observable<any> {
    return this.http.get(`/api/users/${username}/solves`, { params: { page } as any });
  }

  getAchievements(username: string): Observable<{ items: UserAchievement[] }> {
    return this.http.get<{ items: UserAchievement[] }>(`/api/users/${username}/achievements`);
  }

  getSettings(): Observable<UserSettings> {
    return this.http.get<UserSettings>('/api/settings');
  }

  updateSettings(data: Partial<UserSettings>): Observable<UserSettings> {
    return this.http.put<UserSettings>('/api/settings', data);
  }
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly http = inject(HttpClient);

  getStats(): Observable<AdminStats> {
    return this.http.get<AdminStats>('/api/admin/stats');
  }

  getReports(): Observable<{ items: any[] }> {
    return this.http.get<{ items: any[] }>('/api/admin/reports');
  }

  approveRiddle(id: string): Observable<void> {
    return this.http.post<void>(`/api/admin/riddles/${id}/approve`, {});
  }

  rejectRiddle(id: string, reason?: string): Observable<void> {
    return this.http.post<void>(`/api/admin/riddles/${id}/reject`, { reason });
  }

  banUser(id: string, reason?: string): Observable<void> {
    return this.http.post<void>(`/api/admin/users/${id}/ban`, { reason });
  }

  setDailyRiddle(data: { riddleId: string; date: string }): Observable<void> {
    return this.http.post<void>('/api/admin/daily', data);
  }

  getDailySchedule(): Observable<{ items: DailyScheduleEntry[] }> {
    return this.http.get<{ items: DailyScheduleEntry[] }>('/api/admin/daily/schedule');
  }

  removeDailyRiddle(id: string): Observable<void> {
    return this.http.delete<void>(`/api/admin/daily/${id}`);
  }
}
