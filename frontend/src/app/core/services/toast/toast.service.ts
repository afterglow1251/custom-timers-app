import { inject, Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly toastController = inject(ToastController);

  async show(
    message: string,
    color: 'success' | 'danger' = 'success',
    duration: number = 3000,
    position: 'top' | 'bottom' = 'top',
  ) {
    const toast = await this.toastController.create({
      message,
      duration,
      color,
      position,
    });
    await toast.present();
  }
}
