 import { inject } from '@angular/core';
import {
  CanActivateFn,
  ActivatedRouteSnapshot,
  Router
} from '@angular/router';

import { AuthService } from '../services/auth';

export const roleGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot
) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedRoles = route.data['roles'] || [];

  const userRole = authService.getRole();

  if (expectedRoles.includes(userRole)) {
    return true;
  }

  alert('Access Denied');

  router.navigate(['/dashboard']);

  return false;
};