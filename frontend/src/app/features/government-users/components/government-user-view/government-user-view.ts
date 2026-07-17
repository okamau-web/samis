 import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule
} from '@angular/material/dialog';

@Component({
  selector: 'app-government-user-view',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './government-user-view.html',
  styleUrl: './government-user-view.scss'
})
export class GovernmentUserView {

  data = inject(MAT_DIALOG_DATA);

}