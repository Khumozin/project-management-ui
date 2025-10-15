import { Routes } from '@angular/router';

const PROJECTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./projects'),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/project-list'),
      },
    ],
  },
];

export default PROJECTS_ROUTES;
