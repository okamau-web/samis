 import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  private snackBar = inject(MatSnackBar);

  success(message: string) {

    this.snackBar.open(message, 'Close', {

      duration: 2000,

      horizontalPosition: 'right',

      verticalPosition: 'top'

    });

  }

  error(message: string) {

    this.snackBar.open(message, 'Close', {

      duration: 3000,

      horizontalPosition: 'right',

      verticalPosition: 'top'

    });

  }

}