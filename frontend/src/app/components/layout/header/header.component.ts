import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ProfileComponent } from '../../profile/profile.component';

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrl: 'header.component.scss',
  standalone: true,
  imports: [IonicModule, ProfileComponent],
})
export class HeaderComponent {}
