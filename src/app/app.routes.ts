import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'projects',
    loadChildren: () => import('./features/projects/projects.routes'),
  },
  {
    path: '',
    loadComponent: () => import('./core/components/main-layout'),
  },
  {
    path: '**',
    redirectTo: 'projects',
    pathMatch: 'full',
  },
];
