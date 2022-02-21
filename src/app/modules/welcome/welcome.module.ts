import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomeComponent } from './welcome.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AlertModule } from '../alert/alert.module';



@NgModule({
  declarations: [
    WelcomeComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AlertModule,
    RouterModule.forChild([
      {
        path: '',
        component: WelcomeComponent
      }
    ])
  ]
})
export class WelcomeModule { }
