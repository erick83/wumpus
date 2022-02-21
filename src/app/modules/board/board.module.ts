import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardComponent } from './board.component';
import { RouterModule } from '@angular/router';
import { AlertComponent } from '../alert/alert.component';
import { AlertModule } from '../alert/alert.module';



@NgModule({
  declarations: [
    BoardComponent,
  ],
  imports: [
    CommonModule,
    AlertModule,
    RouterModule.forChild([
      {
        path: '',
        component: BoardComponent
      }
    ])
  ]
})
export class BoardModule { }
