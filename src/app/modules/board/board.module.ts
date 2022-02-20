import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardComponent } from './board.component';
import { RouterModule } from '@angular/router';
import { RevertPipe } from './revert.pipe';



@NgModule({
  declarations: [
    BoardComponent,
    RevertPipe,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: BoardComponent
      }
    ])
  ]
})
export class BoardModule { }
