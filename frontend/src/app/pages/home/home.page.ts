import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrl: 'home.page.scss',
  imports: [IonContent, IonButton],
})
export class HomePage {
  private router = inject(Router);

  navigateToAuth() {
    this.router.navigate(['/auth']);
  }
}
