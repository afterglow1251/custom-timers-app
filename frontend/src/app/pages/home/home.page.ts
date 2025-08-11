import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonButton } from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/components/layout/header/header.component';
import { APP_ROUTES } from 'src/app/shared/constants/routes';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrl: 'home.page.scss',
  imports: [IonContent, IonButton, HeaderComponent],
})
export class HomePage {
  private router = inject(Router);

  navigateToAuth() {
    this.router.navigate([APP_ROUTES.auth]);
  }
}
