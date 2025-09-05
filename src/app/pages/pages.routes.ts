import { Routes } from '@angular/router';
import { PagesComponent } from './pages.component';

export const routes: Routes = [
    {
      path: '',
      component: PagesComponent,
      children: [
        {
          path: '',
          pathMatch: 'full',
          redirectTo: 'dashboard',
        },
        {
          path: 'dashboard',
          loadComponent: () =>
            import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
        },
        {
          path: 'history',
          loadComponent: () =>
            import('./history/history.component').then(m => m.HistoryComponent),
        },
        {
          path: 'students',
          loadComponent: () =>
            import('./students/students.component').then(m => m.StudentsComponent),
        },
        {
          path: 'redeem',
          loadComponent: () =>
            import('./redeem/redeem.component').then(m => m.RedeemComponent),
        },
        {
          path: 'utilization',
          loadComponent: () =>
            import('./utilization/utilization.component').then(m => m.UtilizationComponent),
        },
      ],
    },
];