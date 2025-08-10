import {
  Component,
  computed,
  inject,
  signal,
  HostListener,
  ElementRef,
} from '@angular/core';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { UserStateService } from 'src/app/shared/state/user-state.service';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.component.html',
  styleUrl: 'profile.component.scss',
  imports: [IonicModule],
})
export class ProfileComponent {
  private userStateService = inject(UserStateService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private elementRef = inject(ElementRef<HTMLElement>);

  readonly user = this.userStateService.currentUser;
  readonly userEmail = computed(() => this.user()?.email ?? '');

  menuOpen = signal(false);

  toggleMenu() {
    this.menuOpen.update((open) => !open);
  }

  logout() {
    this.authService.logout();
    this.menuOpen.set(false);
    this.router.navigate(['/home']);
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.menuOpen()) {
      this.menuOpen.set(false);
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const clickedInside = this.elementRef.nativeElement.contains(
      event.target as Node,
    );
    if (!clickedInside && this.menuOpen()) {
      this.menuOpen.set(false);
    }
  }
}
