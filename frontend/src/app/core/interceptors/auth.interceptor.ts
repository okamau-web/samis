 import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { SnackbarService } from '../services/snackbar';
import { AuthService } from '../services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const router = inject(Router);

  const snackbar = inject(SnackbarService);

  const authService: AuthService = inject(AuthService);

  const token = authService.getToken();

  let authRequest = req;

  if (token) {

    authRequest = req.clone({

      setHeaders: {

        Authorization: `Bearer ${token}`

      }

    });

  }

  return next(authRequest).pipe(

    catchError(error => {

      if (error.status === 401) {

        authService.logout();

        snackbar.error("Your session has expired.");

        router.navigate(['/login']);

      }

      if (error.status === 403) {

        authService.logout();

        snackbar.error(error.error.message);

        router.navigate(['/login']);

      }

      return throwError(() => error);

    })

  );

};