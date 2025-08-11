import { Component, input, booleanAttribute } from '@angular/core';
import { IonHeader } from '@ionic/angular/standalone';
import { ProfileComponent } from '../../profile/profile.component';

@Component({
  selector: 'app-header',
  imports: [IonHeader, ProfileComponent],
  template: `
    <ion-header class="custom-header">
      <div class="left-content">
        <ng-content />
      </div>
      <div class="right-content">
        <app-profile />
      </div>
    </ion-header>
  `,
  styles: `
    .custom-header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 44px; 
      display: flex;
      align-items: center;
      padding: 0 1rem;
      background: #F7F7F7;
      border-bottom: 1px solid #ccc;
      z-index: 1000;
    }

    .left-content {
      margin-right: auto;
    }

    .right-content {
      margin-left: auto; 
    }
  `,
})
export class HeaderComponent {}
