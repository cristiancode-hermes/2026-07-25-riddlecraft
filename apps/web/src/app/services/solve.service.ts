import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { SolveAttempt, SubmitAnswerResponse, HintResponse, PaginatedResponse } from '../interfaces';

@Injectable({ providedIn: 'root' })
export class SolveService {
  private readonly http = inject(HttpClient);

  startAttempt(riddleId: string): Observable<SolveAttempt> {
    return this.http.post<{ data: { attempt: SolveAttempt } }>(`/api/riddles/${riddleId}/attempt`, {}).pipe(map(r => r.data.attempt));
  }

  submitAnswer(attemptId: string, answer: string): Observable<SubmitAnswerResponse> {
    return this.http.post<SubmitAnswerResponse>(`/api/attempts/${attemptId}/submit`, { answer });
  }

  requestHint(attemptId: string): Observable<HintResponse> {
    return this.http.post<HintResponse>(`/api/attempts/${attemptId}/hint`, {});
  }

  getAttempt(attemptId: string): Observable<SolveAttempt> {
    return this.http.get<{ data: { attempt: SolveAttempt } }>(`/api/attempts/${attemptId}`).pipe(map(r => r.data.attempt));
  }

  getHistory(page = 1, limit = 20): Observable<PaginatedResponse<SolveAttempt>> {
    return this.http.get<PaginatedResponse<SolveAttempt>>('/api/solves/history', { params: { page, limit } as any });
  }
}
