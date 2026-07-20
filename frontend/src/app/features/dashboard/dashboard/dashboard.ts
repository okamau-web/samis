import { Component } from '@angular/core';
import { DashboardService } from '../../../core/services/dashboard';
import { AuthService } from '../../../core/services/auth';
import { CommonModule } from '@angular/common';
import { StatsCard } from '../../../shared/components/stats-card/stats-card';
import { RecentActivity } from '../../../shared/components/recent-activity/recent-activity';
import { ActionCard } from '../../../shared/components/action-card/action-card';
import { Router } from '@angular/router';
import { DashboardStat } from '../../../shared/models/dashboard-stat';
 import { Activity } from '../../../shared/models/activity.model';
import { Action } from '../../../shared/models/action.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, StatsCard, RecentActivity, ActionCard],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class Dashboard {
  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService,
    private router: Router
  ) {
  }


  activities:Activity[] = [
    {
      id: 1,
      title: 'Citizen registered successfully',
      time: '5 minutes ago',
      color: '#4CAF50',
    },

    {
      id: 2,
      title: 'New case assigned',
      time: '20 minutes ago',
      color: '#FF9800',
    },

    {
      id: 3,
      title: 'Government user created',
      time: '1 hour ago',
      color: '#1976D2',
    },

    {
      id: 4,
      title: 'Monthly report submitted',
      time: 'Yesterday',
      color: '#9C27B0',
    },
  ];

  stats: DashboardStat[] = [
    {
      title: 'Open Cases',
      value: 124,
      icon: 'folder_open',
      color: '#1976D2',
      change: '2 today',
      trend: 'neutral',
      route: '/cases',
    },
    {
      title: 'Pending Cases',
      value: 18,
      icon: 'schedule',
      color: '#FB8C00',
      change: '-3 Today',
      trend: 'down',
      route: '/cases',
    },
    {
      title: 'Resolved Cases',
      value: 98,
      icon: 'check_circle',
      color: '#43A047',
      change: '+8 today',
      trend: 'up',
      route: '/cases',
    },
    {
      title: 'Citizens',
      value: 3281,
      icon: 'groups',
      color: '#8E24AA',
      change: '+24 this week',
      trend: 'up',
      route: '/citizens',
    },
    {
      title: 'Clients',
      value: 281,
      icon: 'groups',
      color: '#c5063f',
      change: '+4 this week',
      trend: 'up',
      route: '/clients',
    },
    {
      title: 'Reports',
      value: 84,
      icon: 'description',
      color: '#00897B',
      change: '+6 today',
      trend: 'up',
      route: '/reports',
    },
    {
      title: 'Government Users',
      value: 26,
      icon: 'badge',
      color: '#5E35B1',
      change: '+1 this month',
      trend: 'up',
      route: '/government-users',
    },
  ];
  actions:Action[] = [
    {
      title: 'Register Citizen',
      subtitle: 'Create a new citizen record',
      icon: 'person_add',
      color: '#1976D2',
      route: '/citizens/create',
    },
    {
      title: 'Open Case',
      subtitle: 'Register a new case',
      icon: 'folder_open',
      color: '#43A047',
      route: '/cases/create',
    },
    {
      title: 'Submit Report',
      subtitle: 'Create a daily report',
      icon: 'description',
      color: '#FB8C00',
      route: '/reports/create',
    },
    {
      title: 'Government Users',
      subtitle: 'Manage system users',
      icon: 'groups',
      color: '#8E24AA',
      route: '/government-users',
    },
  ];

  navigate(route: string): void {
    this.router.navigate([route]);
  }
}
