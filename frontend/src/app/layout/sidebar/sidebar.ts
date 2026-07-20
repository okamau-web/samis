import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

import { LayoutService } from '../../core/services/layout.service';
import { AuthService } from '../../core/services/auth';

import { MENU_ITEMS, MenuItem } from '../../core/navigation/menu';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, MatListModule, MatIconModule, MatDividerModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  //Navigation menu
  menuItems: MenuItem[] = MENU_ITEMS;

  //Current logged in user's role
  currentRole: string | null;

  //Expanded menu groups
  expandedGroups = signal<Record<string, boolean>>({
    'User Management': true,
  });

  constructor(
    public layoutService: LayoutService,
    private authService: AuthService,
  ) {
    this.currentRole = this.authService.getRole();
      
  }

  // Expand/Collapse menu group

  toggleGroup(title: string): void {
    this.expandedGroups.update((groups) => ({
      ...groups,

      [title]: !groups[title],
    }));
  }

  // Check whether group is expanded

  isExpanded(title: string): boolean {
    return !!this.expandedGroups()[title];
  }

  // Checks if current user can view menu

  hasAccess(item: MenuItem): boolean {
    if (!item.roles || item.roles.length === 0) {
      return true;
    }

    return !!this.currentRole && item.roles.includes(this.currentRole);
  }
}
