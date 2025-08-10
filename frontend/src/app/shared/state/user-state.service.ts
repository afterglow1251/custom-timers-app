import { Injectable, signal, computed } from '@angular/core';
import { User } from '../types/user.types';

const USER_KEY = 'currentUser';

@Injectable({ providedIn: 'root' })
export class UserStateService {
  private readonly _currentUser = signal<User | null>(this.loadUser());

  readonly currentUser = this._currentUser.asReadonly();

  setUser(user: User): void {
    this._currentUser.set(user);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  clearUser(): void {
    this._currentUser.set(null);
    localStorage.removeItem(USER_KEY);
  }

  private loadUser(): User | null {
    const json = localStorage.getItem(USER_KEY);
    if (!json) return null;
    try {
      return JSON.parse(json);
    } catch {
      return null;
    }
  }
}
