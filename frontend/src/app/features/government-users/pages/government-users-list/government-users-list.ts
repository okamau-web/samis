import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

import { GovernmentUserTable } from '../../components/government-user-table/government-user-table';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GovernmentUserForm } from '../../components/government-user-form/government-user-form';
import { GovernmentUserService } from '../../services/government-user';
import { GovernmentUser } from '../../models/government-user';
import { GovernmentUserView } from '../../components/government-user-view/government-user-view';
import { SnackbarService } from '../../../../core/services/snackbar';
import { ConfirmationDialog } from '../../../../shared/components/confirmation-dialog/confirmation-dialog';
import { Router } from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
@Component({
  selector: 'app-government-users-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    GovernmentUserTable,
    ReactiveFormsModule,
    FormsModule,
    PageHeader,
    MatPaginatorModule,
     
  ],
  templateUrl: './government-users-list.html',
  styleUrl: './government-users-list.scss',
})
export class GovernmentUsersList {
  private dialog = inject(MatDialog);
  private governmentUserService = inject(GovernmentUserService);
  private snackbar = inject(SnackbarService);
  private router = inject(Router);

  search = '';
  selectedRole = '';
  selectedStatus = '';
  page = 1;

  pageSize = 10;

  totalRecords = 0;
  loading = false;

  governmentUsers: GovernmentUser[] = [];

  ngOnInit() {
    this.loadGovernmentUsers();

    this.searchControl.valueChanges
      .pipe(
        debounceTime(400),

        distinctUntilChanged(),
      )
      .subscribe((value) => {
        this.search = value;

        this.loadGovernmentUsers();
      });
  }
  searchControl = new FormControl('', {
    nonNullable: true,
  });
  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  loadGovernmentUsers() {

    this.loading = true;

    this.governmentUserService.getAll({

        search: this.search,

        role: this.selectedRole,

        status: this.selectedStatus,

        page: this.page,

        limit: this.pageSize

    }).subscribe({

        next: response => {

            this.loading = false;

            this.governmentUsers = response.data;

            this.totalRecords = response.total ?? 0;

        },

        error: () => {

            this.loading = false;

        }

    });

}

  openRegisterDialog(): void {
    const dialogRef = this.dialog.open(GovernmentUserForm, {
      width: '950px',

      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadGovernmentUsers();
      }
    });
  }

  viewGovernmentUser(user: GovernmentUser): void {
    this.governmentUserService.getById(user.userId).subscribe({
      next: (response) => {
        this.dialog.open(GovernmentUserView, {
          width: '700px',
          data: response.data,
        });
      },
    });
  }

  editGovernmentUser(user: GovernmentUser): void {
    this.governmentUserService.getById(user.userId).subscribe({
      next: (response) => {
        const dialogRef = this.dialog.open(GovernmentUserForm, {
          width: '950px',

          disableClose: true,

          data: {
            mode: 'edit',

            user: response.data,
          },
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.loadGovernmentUsers();
          }
        });
      },
    });
  }
  toggleGovernmentUserStatus(user: GovernmentUser): void {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      width: '420px',

      disableClose: true,

      data: {
        title: user.status === 'Active' ? 'Suspend Government User' : 'Activate Government User',

        message:
          user.status === 'Active'
            ? `Are you sure you want to suspend ${user.fullName}? The user will no longer be able to access SAMIS.`
            : `Are you sure you want to activate ${user.fullName}? The user will regain access to SAMIS.`,

        confirmButton: user.status === 'Active' ? 'Suspend' : 'Activate',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;

      this.governmentUserService.toggleStatus(user.userId).subscribe({
        next: (response) => {
          this.snackbar.success(response.message);

          this.loadGovernmentUsers();
        },

        error: (error) => {
          this.snackbar.error(error.error?.message ?? 'Unable to update user status.');
        },
      });
    });
  }
  onPageChange(event: PageEvent): void {

    this.page = event.pageIndex + 1;

    this.pageSize = event.pageSize;

    this.loadGovernmentUsers();

}
}
