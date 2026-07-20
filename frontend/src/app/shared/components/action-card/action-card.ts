 import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-action-card',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './action-card.html',
  styleUrl: './action-card.scss'
})
export class ActionCard {

  @Input() title = '';

  @Input() subtitle = '';

  @Input() icon = '';

  @Input() color = '#1976D2';

  @Output() clicked = new EventEmitter<void>();

  onClick(): void {
    this.clicked.emit();
  }

}