import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../core/services/auth';
import { LayoutService } from '../../core/services/layout.service';

import { RouterModule } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { UpperCasePipe } from '@angular/common';
@Component({
  selector: 'app-top-toolbar',
  standalone: true,
  imports: [
    UpperCasePipe,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatTooltipModule,
    MatBadgeModule,
  ],
  templateUrl: './top-toolbar.html',
  styleUrl: './top-toolbar.scss',
})
export class TopToolbar {
  constructor(
    public layoutService: LayoutService,
    private authService: AuthService,
    private router: Router,
  ) {}

  notificationCount = 3;
get role(): string {

  return this.authService.getRole() ?? '';

}
  get fullName(): string {
    return this.authService.getFullName();
  }

  get designation(): string {
    return this.authService.getDesignation();
  }

  get initials(): string {
    return this.authService.getInitials();
  }

  logout(): void {
    this.authService.logout();

    this.router.navigate(['/login']);
  }
}
