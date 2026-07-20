 import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TableColumn } from '../../../shared/models/table-column.model';
import { TableAction } from '../../../shared/models/table-action.model';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './data-table.html',
  styleUrl: './data-table.scss'
})
export class DataTableComponent {

  @Input() columns: TableColumn[] = [];

  @Input() data: any[] = [];

  @Input() total = 0;

  @Input() pageSize = 10;

  @Input() loading = false;

  @Output() pageChange = new EventEmitter<PageEvent>();

  @Output() action = new EventEmitter<TableAction>();

  get displayedColumns(): string[] {

    return [

      ...this.columns.map(c => c.key),

      'actions'

    ];

  }

  onPage(event: PageEvent) {

    this.pageChange.emit(event);

  }

  emitAction(action: TableAction['action'], row: any) {

    this.action.emit({

      action,

      row

    });

  }

}