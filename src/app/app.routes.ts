import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/uw' },
  { path: 'uw', loadChildren: () => import('./pages/underwriting/uw.routes').then(m => m.UW_ROUTES) }
];
