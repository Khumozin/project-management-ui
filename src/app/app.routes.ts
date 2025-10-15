import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./core/components/main-layout'),
    children: [
      {
        path: 'projects',
        loadChildren: () => import('./features/projects/projects.routes'),
        data: {
          breadcrumb: 'Projects',
        },
      },
      {
        path: '',
        loadChildren: () => import('./features/dashboard/dashboard.routes'),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
