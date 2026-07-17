import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../../core/services/dashboard';
import { AuthService } from '../../../core/services/auth';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService,
  ) {}

  role ='';
  dashboard: any;
currentUser: any;
  ngOnInit(): void {
this.currentUser = this.authService.getUser();
    this.role = this.authService.getRole() || '';
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.dashboardService.getDashboard().subscribe({
      next: (response) => {
        this.dashboard = response.data;

        console.log(this.dashboard);
      },

      error: (error) => {
        console.error(error);
      },
    });
  }
  refresh() {
    this.loadDashboard();
  }
}
