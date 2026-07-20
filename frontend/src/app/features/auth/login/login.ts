import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { SnackbarService } from '../../../core/services/snackbar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loginForm;
  private snackbar = inject(SnackbarService);
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login() {
    if (this.loginForm.invalid) {
      alert('Please enter Username and Password');
      return;
    }

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {

       
        // Save JWT
        localStorage.setItem('token', response.data.token);
        // Save logged in user
        localStorage.setItem(
  'user',
  JSON.stringify(response.data)
);
      this.snackbar.success(response.message);

        // Redirect
        this.router.navigate(['/dashboard']);
      },

      error: (error) => {
        console.error(error);

         this.snackbar.error(error.error.message);
      },
    });
  }
}
