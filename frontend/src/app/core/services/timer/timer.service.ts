import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Timer } from 'src/app/shared/types/timer.types';
import { CreateTimerDto, UpdateTimerDto } from './types/dto.types';

@Injectable({
  providedIn: 'root',
})
export class TimerService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/timers';

  getAllTimers(): Observable<Timer[]> {
    return this.http.get<Timer[]>(this.apiUrl);
  }

  getTimerById(id: number): Observable<Timer> {
    return this.http.get<Timer>(`${this.apiUrl}/${id}`);
  }

  createTimer(timer: CreateTimerDto): Observable<Timer> {
    return this.http.post<Timer>(this.apiUrl, timer);
  }

  updateTimer(id: number, timer: UpdateTimerDto): Observable<Timer> {
    return this.http.patch<Timer>(`${this.apiUrl}/${id}`, timer);
  }

  deleteTimer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
