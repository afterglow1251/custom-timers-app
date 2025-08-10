import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { scheduleTokenRefresh } from './utils/refresh-token.util';
import { ACCESS_TOKEN } from './constants/auth-storage-keys.const';
import { AuthPayload, AuthResponse } from './types/auth.types';
import { AUTH_ENDPOINTS } from './constants/auth-endpoints.const';
import { isValidToken } from './utils/token.utils';
import { UserStateService } from 'src/app/shared/state/user-state.service';
import { Storage } from '@ionic/storage-angular';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly userStateService = inject(UserStateService);
  private readonly storage = inject(Storage);

  private accessToken: string | null = null;
  private refreshTimeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.init().catch(console.error);
  }

  private async init() {
    await this.storage.create();
    this.accessToken = await this.storage.get(ACCESS_TOKEN);
    if (isValidToken(this.accessToken)) {
      this.startTokenRefreshCycle(this.accessToken);
    }
  }

  async checkEmail(email: string): Promise<boolean> {
    const response = await firstValueFrom(
      this.http.post<{ exists: boolean }>(AUTH_ENDPOINTS.checkEmail, { email }),
    );
    return response.exists;
  }

  async login(payload: AuthPayload): Promise<AuthResponse> {
    const response = await firstValueFrom(
      this.http.post<AuthResponse>(AUTH_ENDPOINTS.login, payload),
    );
    await this.setAccessToken(response.accessToken);
    this.userStateService.setUser(response.user);
    return response;
  }

  async register(payload: AuthPayload): Promise<AuthResponse> {
    const response = await firstValueFrom(
      this.http.post<AuthResponse>(AUTH_ENDPOINTS.register, payload),
    );
    await this.setAccessToken(response.accessToken);
    this.userStateService.setUser(response.user);
    return response;
  }

  async logout(): Promise<void> {
    await this.clearAccessToken();
    this.userStateService.clearUser();
  }

  getTokenSync(): string | null {
    return this.accessToken;
  }

  private async clearAccessToken(): Promise<void> {
    this.accessToken = null;
    await this.storage.remove(ACCESS_TOKEN);
    this.clearRefreshCycle();
  }

  private async setAccessToken(token: string): Promise<void> {
    this.accessToken = token;
    await this.storage.set(ACCESS_TOKEN, token);
    this.clearRefreshCycle();
    await this.startTokenRefreshCycle(token);
  }

  private clearRefreshCycle(): void {
    if (this.refreshTimeoutId !== null) {
      clearTimeout(this.refreshTimeoutId);
      this.refreshTimeoutId = null;
    }
  }

  private async startTokenRefreshCycle(token: string): Promise<void> {
    if (!isValidToken(token)) {
      await this.clearAccessToken();
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
    await this.setAccessToken(response.accessToken);
    return response.accessToken;
  }
}
