import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { StudentListPage } from './student-list.page';
import { IonicSelectableModule } from 'ionic-selectable';
import {IonicRatingModule} from 'ionic4-rating'

const routes: Routes = [
  {
    path: '',
    component: StudentListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    IonicSelectableModule,
    IonicRatingModule
  ],
  declarations: [StudentListPage]
})
export class StudentListPageModule {}
