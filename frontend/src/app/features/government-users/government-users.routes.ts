import { Routes } from '@angular/router';
import { GovernmentUsersList } from './pages/government-users-list/government-users-list';

export const GOVERNMENT_USERS_ROUTES: Routes = [
  {
    path: '',
    component: GovernmentUsersList
  }
];