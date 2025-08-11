import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { ACCESS_TOKEN } from './constants/auth-storage-keys.const';
import { AuthPayload, AuthResponse } from './types/auth.types';
import { AUTH_ENDPOINTS } from './constants/auth-endpoints.const';
import { isValidToken } from './utils/token.utils';
import { UserStateService } from 'src/app/shared/state/user-state.service';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';
import { APP_ROUTES } from 'src/app/shared/constants/routes';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isInitialized = false;
  private initPromise: Promise<void> | null = null;

  private readonly http = inject(HttpClient);
  private readonly userStateService = inject(UserStateService);
  private readonly storage = inject(Storage);
  private readonly router = inject(Router);

  private accessTokenSubject = new BehaviorSubject<string | null>(null);
  accessToken$ = this.accessTokenSubject.asObservable();

  constructor() {
    this.init().catch(console.error);
  }

  public async ensureInitialized(): Promise<void> {
    if (this.isInitialized) return;
    if (!this.initPromise) {
      this.initPromise = this.init();
    }
    await this.initPromise;
    this.isInitialized = true;
  }

  private async init(): Promise<void> {
    try {
      await this.storage.create();
      const token = await this.storage.get(ACCESS_TOKEN);

      if (isValidToken(token)) {
        this.accessTokenSubject.next(token);
      } else {
        await this.clearAccessToken();
      }
    } catch (error) {
      console.error('Auth init failed:', error);
      await this.clearAccessToken();
      throw error;
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
    const token = this.getTokenSync();
    if (token) {
      await firstValueFrom(
        this.http.post<void>(AUTH_ENDPOINTS.logout, null, {
          withCredentials: true,
        }),
      );
    }
    await this.clearAccessToken();
    this.userStateService.clearUser();
    this.router.navigate([APP_ROUTES.home]);
  }

  getTokenSync(): string | null {
    return this.accessTokenSubject.value;
  }

  private async clearAccessToken(): Promise<void> {
    this.accessTokenSubject.next(null);
    await this.storage.remove(ACCESS_TOKEN);
  }

  private async setAccessToken(token: string): Promise<void> {
    this.accessTokenSubject.next(token);
    await this.storage.set(ACCESS_TOKEN, token);
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
