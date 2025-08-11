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

addIcons({
  'arrow-back': arrowBack,
  mail: mail,
  eye: eye,
  'eye-off': eyeOff,
  'person-circle': personCircle,
  'arrow-back-outline': arrowBackOutline,
});

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(withInterceptors([authInterceptor])),
    importProvidersFrom(IonicStorageModule.forRoot()),
  ],
});
