import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, firstValueFrom, tap } from 'rxjs';
import { scheduleTokenRefresh } from './utils/refresh-token.util';
import { ACCESS_TOKEN } from './constants/auth-storage-keys.const';
import { AuthPayload, AuthResponse } from './types/auth.types';
import { AUTH_ENDPOINTS } from './constants/auth-endpoints.const';
import { isValidToken } from './utils/token.utils';
import { UserStateService } from 'src/app/shared/state/user-state.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly userStateService = inject(UserStateService);

  private accessToken: string | null = localStorage.getItem(ACCESS_TOKEN);
  private refreshTimeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    if (isValidToken(this.accessToken)) {
      this.startTokenRefreshCycle(this.accessToken);
    }
  }

  checkEmail(email: string): Observable<boolean> {
    return this.http
      .post<{ exists: boolean }>(AUTH_ENDPOINTS.checkEmail, { email })
      .pipe(map(({ exists }) => exists));
  }

  login(payload: AuthPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(AUTH_ENDPOINTS.login, payload).pipe(
      tap((response) => {
        this.setAccessToken(response.accessToken);
        this.userStateService.setUser(response.user);
      }),
    );
  }

  register(payload: AuthPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(AUTH_ENDPOINTS.register, payload).pipe(
      tap((response) => {
        this.setAccessToken(response.accessToken);
        this.userStateService.setUser(response.user);
      }),
    );
  }

  logout(): void {
    this.clearAccessToken();
    this.userStateService.clearUser();
  }

  getTokenSync(): string | null {
    return this.accessToken;
  }

  private clearAccessToken(): void {
    this.accessToken = null;
    localStorage.removeItem(ACCESS_TOKEN);
    this.clearRefreshCycle();
  }

  private setAccessToken(token: string): void {
    this.accessToken = token;
    localStorage.setItem(ACCESS_TOKEN, token);
    this.clearRefreshCycle();
    this.startTokenRefreshCycle(token);
  }

  private clearRefreshCycle(): void {
    if (this.refreshTimeoutId !== null) {
      clearTimeout(this.refreshTimeoutId);
      this.refreshTimeoutId = null;
    }
  }

  private startTokenRefreshCycle(token: string): void {
    if (!isValidToken(token)) {
      this.clearAccessToken();
      return;
    }

    this.refreshTimeoutId = scheduleTokenRefresh(
      token,
      () => this.refreshToken(),
      (newToken) => {
        this.setAccessToken(newToken);
      },
    );
  }

  async refreshToken(): Promise<string> {
    const response = await firstValueFrom(
      this.http.post<{ accessToken: string }>(AUTH_ENDPOINTS.refresh, null, {
        withCredentials: true,
      }),
    );
    this.setAccessToken(response.accessToken);
    return response.accessToken;
  }
}
