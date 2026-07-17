 
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './page-header.html',
  styleUrl: './page-header.scss'
})
export class PageHeader {

  @Input() title = '';

  @Input() subtitle = '';

  @Input() showBackButton = false;

  @Input() backButtonText = 'Dashboard';

  @Output() back = new EventEmitter<void>();

}