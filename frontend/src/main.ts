import { IonicStorageModule } from '@ionic/storage-angular';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  RouteReuseStrategy,
  provideRouter,
  withPreloading,
  PreloadAllModules,
} from '@angular/router';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { authInterceptor } from './app/core/services/auth/interceptors/auth.interceptor';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { addIcons } from 'ionicons';
import {
  arrowBack,
  arrowBackOutline,
  eye,
  eyeOff,
  mail,
  personCircle,
} from 'ionicons/icons';
import { importProvidersFrom } from '@angular/core';
import { AuthService } from './app/core/services/auth/auth.service'; // Додайте імпорт

addIcons({
  'arrow-back': arrowBack,
  mail: mail,
  eye: eye,
  'eye-off': eyeOff,
  'person-circle': personCircle,
  'arrow-back-outline': arrowBackOutline,
});

async function initializeApp(authService: AuthService) {
  try {
    await authService.ensureInitialized();
    console.log('AuthService initialized successfully');
  } catch (error) {
    console.error('AuthService initialization failed', error);
  }
}

const providers = [
  { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  provideIonicAngular(),
  provideRouter(routes, withPreloading(PreloadAllModules)),
  provideHttpClient(withInterceptors([authInterceptor])),
  importProvidersFrom(IonicStorageModule.forRoot()),
];

bootstrapApplication(AppComponent, { providers }).then((appRef) => {
  const authService = appRef.injector.get(AuthService);
  initializeApp(authService).catch(console.error);
});
