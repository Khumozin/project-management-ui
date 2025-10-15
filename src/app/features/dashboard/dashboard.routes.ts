import { Routes } from '@angular/router';

const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard'),
  },
];

export default DASHBOARD_ROUTES;
