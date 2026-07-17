 import { Component,Output, Input,EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { GovernmentUser } from '../../models/government-user';
import { MatTooltipModule } from '@angular/material/tooltip';
@Component({
  selector: 'app-government-user-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule
  ],
  templateUrl: './government-user-table.html',
  styleUrl: './government-user-table.scss'
})  
export class GovernmentUserTable {
@Input()
 users: GovernmentUser[] = [];
 
@Output() view = new EventEmitter<GovernmentUser>();

@Output() edit = new EventEmitter<GovernmentUser>();

@Output() suspend = new EventEmitter<GovernmentUser>();

 

 displayedColumns = [
  'no',
  'fullName',
  'personalNumber',
  'username',
  'designation',
  'county',
  'status',
  'actions'
];



}