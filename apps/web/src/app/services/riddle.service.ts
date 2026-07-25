import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import {
  Riddle, DailyRiddleResponse, Category, PaginatedResponse,
} from '../interfaces';

@Injectable({ providedIn: 'root' })
export class RiddleService {
  private readonly http = inject(HttpClient);

  getDaily(): Observable<DailyRiddleResponse> {
    return this.http.get<DailyRiddleResponse>('/api/riddles/daily');
  }

  getAll(params?: { category?: string; difficulty?: string; search?: string; sort?: string; page?: number; limit?: number }): Observable<PaginatedResponse<Riddle>> {
    return this.http.get<PaginatedResponse<Riddle>>('/api/riddles', { params: params as any });
  }

  getById(id: string): Observable<{ riddle: Riddle; hints: any[] }> {
    return this.http.get<{ riddle: Riddle; hints: any[] }>(`/api/riddles/${id}`);
  }

  create(data: any): Observable<Riddle> {
    return this.http.post<{ data: { riddle: Riddle } }>('/api/riddles', data).pipe(map(r => r.data.riddle));
  }

  update(id: string, data: any): Observable<Riddle> {
    return this.http.put<{ data: { riddle: Riddle } }>(`/api/riddles/${id}`, data).pipe(map(r => r.data.riddle));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`/api/riddles/${id}`);
  }

  rate(id: string, data: { rating: number }): Observable<void> {
    return this.http.post<void>(`/api/riddles/${id}/rate`, data);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>('/api/categories');
  }
}
