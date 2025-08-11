import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { TimerService } from 'src/app/core/services/timer/timer.service';
import { APP_ROUTES } from 'src/app/shared/constants/routes';
import { Timer } from 'src/app/shared/types/timer.types';
import { HeaderComponent } from 'src/app/components/layout/header/header.component';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { CreateTimerDto } from 'src/app/core/services/timer/types/dto.types';
import { TimerStateService } from 'src/app/shared/state/timer-state.service';

@Component({
  selector: 'app-timer',
  imports: [IonicModule, ReactiveFormsModule, HeaderComponent],
  templateUrl: 'timer.page.html',
  styleUrl: 'timer.page.scss',
})
export class TimerPage implements OnInit {
  private fb = inject(FormBuilder);
  private timerService = inject(TimerService);
  private toastService = inject(ToastService);
  private alertController = inject(AlertController);
  private router = inject(Router);
  private timerState = inject(TimerStateService);

  timers = signal<Timer[]>([]);
  isLoading = signal(false);
  showModal = signal(false);
  editingTimer = signal<Timer | null>(null);
  isSaving = signal(false);

  timerForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    exerciseTime: [30, [Validators.required, Validators.min(1)]],
    restTime: [10, [Validators.required, Validators.min(1)]],
    rounds: [3, [Validators.required, Validators.min(1)]],
  });

  async ngOnInit() {
    await this.loadTimers();
  }

  async loadTimers() {
    this.isLoading.set(true);
    try {
      const timers = await firstValueFrom(this.timerService.getAllTimers());
      this.timers.set(timers);
    } catch (error: any) {
      await this.toastService.show('Failed to load timers', 'danger');
      console.error('Load timers error:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  showAddTimerModal() {
    this.editingTimer.set(null);
    this.timerForm.reset({
      name: `Timer №${this.timers().length + 1}`,
      exerciseTime: 30,
      restTime: 10,
      rounds: 3,
    });
    this.showModal.set(true);
  }

  editTimer(timer: Timer) {
    this.editingTimer.set(timer);
    this.timerForm.patchValue({
      name: timer.name,
      exerciseTime: timer.exerciseTime,
      restTime: timer.restTime,
      rounds: timer.rounds,
    });
    this.showModal.set(true);
  }

  async saveTimer() {
    if (this.timerForm.invalid || this.isSaving()) {
      return;
    }

    this.isSaving.set(true);

    try {
      const formValue = this.timerForm.value as CreateTimerDto;
      const editingTimer = this.editingTimer();

      if (editingTimer) {
        const updatedTimer = await firstValueFrom(
          this.timerService.updateTimer(editingTimer.id, formValue),
        );
        const currentTimers = this.timers();
        const index = currentTimers.findIndex((t) => t.id === editingTimer.id);
        if (index !== -1) {
          const newTimers = [...currentTimers];
          newTimers[index] = updatedTimer;
          this.timers.set(newTimers);
        }
      } else {
        const newTimer = await firstValueFrom(
          this.timerService.createTimer(formValue),
        );
        this.timers.set([...this.timers(), newTimer]);
      }

      this.closeModal();
    } catch (error: any) {
      const message = error?.error?.message || 'Failed to save timer';
      await this.toastService.show(message, 'danger');
      console.error('Save timer error:', error);
    } finally {
      this.isSaving.set(false);
    }
  }

  async deleteTimer(timer: Timer) {
    const alert = await this.alertController.create({
      header: 'Delete Timer',
      message: `Are you sure you want to delete "${timer.name}"?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: async () => {
            try {
              await firstValueFrom(this.timerService.deleteTimer(timer.id));
              const currentTimers = this.timers();
              this.timers.set(currentTimers.filter((t) => t.id !== timer.id));
            } catch (error: any) {
              const message = error?.error?.message || 'Failed to delete timer';
              await this.toastService.show(message, 'danger');
              console.error('Delete timer error:', error);
            }
          },
        },
      ],
    });

    await alert.present();
  }

  startTimer(timer: Timer) {
    this.timerState.setSelectedTimer(timer);
    this.router.navigate([APP_ROUTES.timerExecution]);
  }

  closeModal() {
    this.showModal.set(false);
    this.editingTimer.set(null);
    this.timerForm.reset();
  }
}
