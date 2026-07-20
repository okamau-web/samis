 import { Component,Output, Input,EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { GovernmentUser } from '../../../../shared/models/government-user';
import { MatTooltipModule } from '@angular/material/tooltip';
import {  MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';


@Component({
  selector: 'app-government-user-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    MatPaginatorModule,
      MatSortModule
  ],
  templateUrl: './government-user-table.html',
  styleUrl: './government-user-table.scss'
})  
export class GovernmentUserTable {
@Output() sortChange = new EventEmitter<Sort>();
@Input()users: GovernmentUser[] = [];
 
@Output() viewGovernmentUser = new EventEmitter<GovernmentUser>();

@Output() editGovernmentUser = new EventEmitter<GovernmentUser>();
@Output() pageChange = new EventEmitter<PageEvent>();
 
@Output() toggleGovernmentUserStatus = new EventEmitter<GovernmentUser>();

@Input() loading = false;

@Input() page = 1;

@Input() pageSize = 10;

@Input() totalRecords = 0;
 
 
onSortChange(event: Sort): void {

  this.sortChange.emit(event);

}
onPageChange(event: PageEvent): void {

  this.pageChange.emit(event);

}

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