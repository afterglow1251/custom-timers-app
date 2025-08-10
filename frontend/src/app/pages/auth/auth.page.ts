import { Component, signal, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth/auth.service';

type AuthStep = 'email' | 'password';

@Component({
  selector: 'app-auth',
  imports: [IonicModule, ReactiveFormsModule],
  templateUrl: 'auth.page.html',
  styleUrl: 'auth.page.scss',
})
export class AuthPage {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toastController = inject(ToastController);
  private router = inject(Router);

  currentStep = signal<AuthStep>('email');
  isLogin = signal(false);
  isLoading = signal(false);
  currentEmail = signal('');

  emailForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  passwordForm = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  async onEmailSubmit() {
    if (this.emailForm.invalid || this.isLoading()) {
      return;
    }

    this.isLoading.set(true);

    try {
      const email = this.emailForm.value.email!;
      this.currentEmail.set(email);

      const emailExists = await this.authService.checkEmail(email);

      this.isLogin.set(emailExists);
      this.currentStep.set('password');
    } catch (error: any) {
      const message = error?.error?.message || 'Failed to check email';
      await this.showToast(message, 'danger');
    } finally {
      this.isLoading.set(false);
    }
  }

  async onPasswordSubmit() {
    if (this.passwordForm.invalid || this.isLoading()) {
      return;
    }

    this.isLoading.set(true);

    try {
      const email = this.currentEmail();
      const password = this.passwordForm.value.password!;

      if (this.isLogin()) {
        await this.authService.login({ email, password });
        await this.showToast('Login successful!', 'success');
      } else {
        await this.authService.register({ email, password });
        await this.showToast('Registration successful!', 'success');
      }

      await this.router.navigate(['/timer']);
    } catch (error: any) {
      const message = error?.error?.message || 'Authentication failed';
      await this.showToast(message, 'danger');
    } finally {
      this.isLoading.set(false);
    }
  }

  goBackToEmail() {
    this.currentStep.set('email');
    this.passwordForm.reset();
    this.currentEmail.set('');
    this.isLogin.set(false);
  }

  private async showToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'top',
    });
    await toast.present();
  }

  get emailError() {
    const emailControl = this.emailForm.get('email');
    if (emailControl?.errors?.['required']) {
      return 'Email is required';
    }
    if (emailControl?.errors?.['email']) {
      return 'Please enter a valid email';
    }
    return null;
  }

  get passwordError() {
    const passwordControl = this.passwordForm.get('password');
    if (passwordControl?.errors?.['required']) {
      return 'Password is required';
    }
    if (passwordControl?.errors?.['minlength']) {
      return 'Password must be at least 6 characters';
    }
    return null;
  }
}
