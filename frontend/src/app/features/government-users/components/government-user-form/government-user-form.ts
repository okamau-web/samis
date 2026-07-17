import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { GovernmentUserService } from '../../services/government-user';
import { GovernmentUserRegistration } from '../../../../core/models/user-registration';
import { SnackbarService } from '../../../../core/services/snackbar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { passwordMatchValidator } from '../../../../core/validators/password-match.validator';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

import { Inject } from '@angular/core';
import { GovernmentUser } from '../../models/government-user';

@Component({
  selector: 'app-government-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,

    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinner,
  ],
  templateUrl: './government-user-form.html',
  styleUrl: './government-user-form.scss',
})
export class GovernmentUserForm {
  private fb = inject(FormBuilder);
  private snackbar = inject(SnackbarService);
  hidePassword = true;
  hideConfirmPassword = true;
  private dialogRef = inject(MatDialogRef<GovernmentUserForm>);

  private governmentUserService = inject(GovernmentUserService);

  readonly data = inject(MAT_DIALOG_DATA, {
    optional: true,
  }) as {
    mode: 'create' | 'edit';
    user?: GovernmentUser;
  };
  isEditMode:boolean = false;
  loading = false;
 

  roles = [
    {
      value: 'CC',
      label: 'County Commissioner',
      designation: 'County Commissioner',
    },
    {
      value: 'DCC',
      label: 'Deputy County Commissioner',
      designation: 'Deputy County Commissioner',
    },
    {
      value: 'ACC',
      label: 'Assistant County Commissioner',
      designation: 'Assistant County Commissioner',
    },
    {
      value: 'Chief',
      label: 'Chief',
      designation: 'Chief',
    },
    {
      value: 'AssistantChief',
      label: 'Assistant Chief',
      designation: 'Assistant Chief',
    },
  ];

  constructor() {
    this.governmentUserForm.controls.role.valueChanges.subscribe((role) => {
      const selectedRole = this.roles.find((r) => r.value === role);

      this.governmentUserForm.patchValue({
        designation: selectedRole?.designation ?? '',
      });
    });
 
    if (this.data?.mode === 'edit' && this.data.user) {

  this.isEditMode = true;

  // Password is not edited
  this.governmentUserForm.controls.password.clearValidators();

  this.governmentUserForm.controls.confirmPassword.clearValidators();

  this.governmentUserForm.controls.password.updateValueAndValidity();

  this.governmentUserForm.controls.confirmPassword.updateValueAndValidity();

  this.governmentUserForm.patchValue({

    personalNumber: this.data.user.personalNumber,

    nationalId: this.data.user.nationalId,

    fullName: this.data.user.fullName,

    phoneNumber: this.data.user.phoneNumber,

    email: this.data.user.email,

    designation: this.data.user.designation,

    county: this.data.user.county,

    subCounty: this.data.user.subCounty,

    division: this.data.user.division,

    location: this.data.user.location,

    subLocation: this.data.user.subLocation,

    village: this.data.user.village,

    role: this.data.user.role

  });

}
  }

  governmentUserForm = this.fb.nonNullable.group(
    {
      password: ['', [Validators.required, Validators.minLength(6)]],

      confirmPassword: ['', Validators.required],

      personalNumber: ['', Validators.required],

      nationalId: ['', Validators.required],

      fullName: ['', Validators.required],

      phoneNumber: ['', Validators.required],

      email: ['', [Validators.required, Validators.email]],

      designation: ['', Validators.required],

      county: ['', Validators.required],

      subCounty: ['', Validators.required],

      division: ['', Validators.required],

      location: ['', Validators.required],

      subLocation: ['', Validators.required],

      village: [''],
      role: ['', Validators.required],
    },
    {
      validators: passwordMatchValidator,
    },
  );

   onSubmit(): void {

  if (this.governmentUserForm.invalid) {

    this.governmentUserForm.markAllAsTouched();

    return;

  }

  this.loading = true;

  const form = this.governmentUserForm.getRawValue();

  const payload: GovernmentUserRegistration = {

    password: form.password,

    userType: 'Government',

    role: form.role,

    personalNumber: form.personalNumber,

    nationalId: form.nationalId,

    fullName: form.fullName,

    phoneNumber: form.phoneNumber,

    email: form.email,

    designation: form.designation,

    county: form.county,

    subCounty: form.subCounty,

    division: form.division,

    location: form.location,

    subLocation: form.subLocation,

    village: form.village

  };

  if (this.isEditMode) {

    this.governmentUserService.update(

      this.data.user!.userId,

      payload

    ).subscribe({

      next: (response) => {

        this.loading = false;

        this.snackbar.success(response.message);

        this.dialogRef.close(true);

      },

      error: (error) => {

        this.loading = false;

        this.snackbar.error(

          error.error?.message || 'Update failed.'

        );

      }

    });

  } else {

    this.governmentUserService.register(payload).subscribe({

      next: (response) => {

        this.loading = false;

        this.snackbar.success(response.message);

        this.dialogRef.close(true);

      },

      error: (error) => {

        this.loading = false;

        this.snackbar.error(

          error.error?.message || 'Registration failed.'

        );

      }

    });

  }

}
}
