import { Injectable, signal } from '@angular/core';
import { Timer } from 'src/app/shared/types/timer.types';

@Injectable({ providedIn: 'root' })
export class TimerStateService {
  private readonly _selectedTimer = signal<Timer | null>(null);
  readonly selectedTimer = this._selectedTimer.asReadonly();

  setSelectedTimer(timer: Timer | null) {
    this._selectedTimer.set(timer);
  }

  clearSelectedTimer() {
    this._selectedTimer.set(null);
  }
}
