import { Component, signal, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { APP_ROUTES } from 'src/app/shared/constants/routes';
import { HeaderComponent } from 'src/app/components/layout/header/header.component';
import { strictEmailValidator } from 'src/app/shared/utils/validation/email';
import { ToastService } from 'src/app/core/services/toast/toast.service';

type CurrentStep = 'email' | 'password';

@Component({
  selector: 'app-auth',
  imports: [IonicModule, ReactiveFormsModule, HeaderComponent],
  templateUrl: 'auth.page.html',
  styleUrl: 'auth.page.scss',
})
export class AuthPage {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  currentStep = signal<CurrentStep>('email');
  currentEmail = signal('');
  isLogin = signal(false);
  isLoading = signal(false);

  emailForm = this.fb.group({
    email: ['', [Validators.required, strictEmailValidator()]],
  });

  passwordForm = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  ionViewWillEnter() {
    this.resetState();
  }

  async onEmailSubmit() {
    if (this.emailForm.invalid || this.isLoading()) {
      return;
    }

    this.isLoading.set(true);

    try {
      const email = this.emailForm.value.email!.trim().toLowerCase();
      this.currentEmail.set(email);

      const emailExists = await this.authService.checkEmail(email);

      this.isLogin.set(emailExists);
      this.currentStep.set('password');
    } catch (error: any) {
      const message = error?.error?.message || 'Failed to check email';
      await this.toastService.show(message, 'danger');
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
      } else {
        await this.authService.register({ email, password });
      }

      this.router.navigate([APP_ROUTES.timer]);
    } catch (error: any) {
      const message = error?.error?.message || 'Authentication failed';
      await this.toastService.show(message, 'danger');
    } finally {
      this.isLoading.set(false);
    }
  }

  goBackToEmail() {
    this.currentStep.set('email');
    this.passwordForm.reset();
    this.isLogin.set(false);
  }

  resetState() {
    this.currentStep.set('email');
    this.currentEmail.set('');
    this.isLogin.set(false);
    this.isLoading.set(false);
    this.emailForm.reset();
    this.passwordForm.reset();
  }
}
