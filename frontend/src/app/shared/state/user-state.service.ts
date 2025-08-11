import { inject, Injectable, signal } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { UserNoPassword } from '../types/user.types';

const USER_KEY = 'currentUser';

@Injectable({ providedIn: 'root' })
export class UserStateService {
  private readonly storage = inject(Storage);

  private readonly _currentUser = signal<UserNoPassword | null>(null);
  readonly currentUser = this._currentUser.asReadonly();

  constructor() {
    this.init();
  }

  private async init() {
    await this.storage.create();
    const storedUser = await this.storage.get(USER_KEY);
    if (storedUser) {
      try {
        this._currentUser.set(storedUser as UserNoPassword);
      } catch {
        this._currentUser.set(null);
      }
    }
  }

  async setUser(user: UserNoPassword): Promise<void> {
    this._currentUser.set(user);
    await this.storage.set(USER_KEY, user);
  }

  async clearUser(): Promise<void> {
    this._currentUser.set(null);
    await this.storage.remove(USER_KEY);
  }
}
