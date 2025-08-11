import { Routes } from '@angular/router';
import { TabsPage } from './tabs/tabs.page';

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./pages/home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'auth',
        loadComponent: () =>
          import('./pages/auth/auth.page').then((m) => m.AuthPage),
      },
      {
        path: 'timer',
        loadComponent: () =>
          import('./pages/timer/timer.page').then((m) => m.TimerPage),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'timer-execution',
    loadComponent: () =>
      import('./pages/timer-execution/timer-execution.page').then(
        (m) => m.TimerExecutionPage,
      ),
  },
];
