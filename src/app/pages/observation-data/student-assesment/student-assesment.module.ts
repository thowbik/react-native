import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';


import { IonicModule } from '@ionic/angular';

import { StudentAssesmentPage } from './student-assesment.page';
import { IonicSelectableModule } from 'ionic-selectable';
// import {StudentListPageModule} from '../student-list/student-list.module'

const routes: Routes = [
  {
    path: '',
    component: StudentAssesmentPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    IonicSelectableModule
    // StudentListPageModule
  ],
  declarations: [StudentAssesmentPage]
})
export class StudentAssesmentPageModule {}
