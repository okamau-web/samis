import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { Login } from './features/auth/login/login';
import { Dashboard } from './features/dashboard/dashboard/dashboard';
import { MainLayout } from './layouts/main-layout/main-layout';
import { Cases } from './features/cases/cases/cases';
import { Reports } from './features/reports/reports/reports';
import { Clients } from './features/clients/clients/clients';
 
 
import { roleGuard } from './core/guards/role-guard';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
  },
{
  path: 'government-users',
  loadChildren: () =>
    import('./features/government-users/government-users.routes')
      .then(m => m.GOVERNMENT_USERS_ROUTES)
},

  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        component: Dashboard,
      },

      {
        path: 'cases',
        component: Cases,
      },

      {
        path: 'clients',
        component: Clients,
      },

      {
        path: 'reports',
        component: Reports,
      },

    
    ],
  },

  {
    path: '**',
    redirectTo: 'login',
  },
];
