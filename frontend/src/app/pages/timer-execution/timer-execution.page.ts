import {
  Component,
  OnInit,
  OnDestroy,
  signal,
  computed,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, AlertController } from '@ionic/angular';
import { APP_ROUTES } from 'src/app/shared/constants/routes';
import { Timer } from 'src/app/shared/types/timer.types';
import { HeaderComponent } from 'src/app/components/layout/header/header.component';
import { TimerStateService } from 'src/app/shared/state/timer-state.service';

type TimerPhase = 'exercise' | 'rest' | 'finished';

@Component({
  selector: 'app-timer-execution',
  imports: [IonicModule, HeaderComponent],
  templateUrl: 'timer-execution.page.html',
  styleUrl: 'timer-execution.page.scss',
})
export class TimerExecutionPage implements OnInit, OnDestroy {
  private router = inject(Router);
  private alertController = inject(AlertController);
  private timerState = inject(TimerStateService);

  timer = signal<Timer | null>(null);
  currentPhase = signal<TimerPhase>('exercise');
  currentRound = signal(1);
  timeLeft = signal(0);
  isPaused = signal(false);

  private intervalId: number | null = null;
  private startTime: number = 0;
  private pausedTime: number = 0;

  roundProgress = computed(() => {
    const timer = this.timer();
    if (!timer) return 0;
    return this.currentRound() / timer.rounds;
  });

  totalExerciseTime = computed(() => {
    const timer = this.timer();
    return timer ? timer.exerciseTime * timer.rounds : 0;
  });

  totalRestTime = computed(() => {
    const timer = this.timer();
    return timer ? timer.restTime * (timer.rounds - 1) : 0;
  });

  totalWorkoutTime = computed(() => {
    return this.totalExerciseTime() + this.totalRestTime();
  });

  ngOnInit() {
    const selectedTimer = this.timerState.selectedTimer();
    if (selectedTimer) {
      this.timer.set(selectedTimer);
      this.initializeTimer();
    } else {
      this.goBack();
    }
  }

  ngOnDestroy() {
    this.clearInterval();
  }

  private initializeTimer() {
    const timer = this.timer();
    if (!timer) return;

    this.currentPhase.set('exercise');
    this.currentRound.set(1);
    this.timeLeft.set(timer.exerciseTime);
    this.isPaused.set(false);
    this.startTimer();
  }

  private startTimer() {
    if (this.intervalId) return;

    this.startTime = Date.now() - this.pausedTime;

    this.intervalId = window.setInterval(() => {
      if (this.isPaused()) return;

      const currentTime = this.timeLeft();

      if (currentTime <= 1) {
        this.handlePhaseComplete();
      } else {
        this.timeLeft.set(currentTime - 1);
      }
    }, 1000);
  }

  private handlePhaseComplete() {
    const timer = this.timer();
    if (!timer) return;

    const phase = this.currentPhase();
    const round = this.currentRound();

    if (phase === 'exercise') {
      if (round < timer.rounds) {
        this.currentPhase.set('rest');
        this.timeLeft.set(timer.restTime);
      } else {
        this.finishWorkout();
      }
    } else if (phase === 'rest') {
      this.currentRound.set(round + 1);
      this.currentPhase.set('exercise');
      this.timeLeft.set(timer.exerciseTime);
    }
  }

  private finishWorkout() {
    this.clearInterval();
    this.currentPhase.set('finished');
    this.showWorkoutCompleteAlert();
  }

  private async showWorkoutCompleteAlert() {
    const alert = await this.alertController.create({
      header: 'Workout Complete! 🎉',
      message: `Congratulations! You've completed all ${
        this.timer()?.rounds
      } rounds of "${this.timer()?.name}".`,
      buttons: ['Awesome!'],
    });
    await alert.present();
  }

  pauseTimer() {
    this.isPaused.set(true);
    this.pausedTime = Date.now() - this.startTime;
  }

  resumeTimer() {
    this.isPaused.set(false);
    this.startTime = Date.now() - this.pausedTime;
  }

  async stopTimer() {
    const alert = await this.alertController.create({
      header: 'Stop Workout',
      message: 'Are you sure you want to stop this workout?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Stop',
          role: 'destructive',
          handler: () => {
            this.clearInterval();
            this.goBack();
          },
        },
      ],
    });
    await alert.present();
  }

  restartTimer() {
    this.clearInterval();
    this.pausedTime = 0;
    this.initializeTimer();
  }

  private clearInterval() {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  goBack() {
    this.clearInterval();
    this.timerState.clearSelectedTimer();
    this.router.navigate([APP_ROUTES.timer]);
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}
