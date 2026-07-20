import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-stats-card',
  standalone: true,
  imports: [MatIconModule,CommonModule],
  templateUrl: './stats-card.html',
  styleUrl: './stats-card.scss',
})
export class StatsCard {
     @Input() title = '';

  @Input() value: number | string = 0;

  @Input() icon = '';

  @Input() color = '#1976D2';

  @Input() change = '';

  @Input() trend: 'up' | 'down' | 'neutral' = 'up';

  @Input() route = '';

  @Output() cardClick = new EventEmitter<string>();

  openCard() {

    this.cardClick.emit(this.route);

  }


}
