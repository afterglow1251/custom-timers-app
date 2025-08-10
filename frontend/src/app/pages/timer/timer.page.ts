import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { UserStateService } from 'src/app/shared/state/user-state.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.page.html',
  styleUrls: ['./timer.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule],
})
export class TimerPage implements OnInit {
  userStateService = inject(UserStateService);

  constructor() {}

  ngOnInit() {
    console.log(this.userStateService.currentUser());
  }
}
