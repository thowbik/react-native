import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RecordVerificationPage } from './record-verification.page';
import {IonicSelectableModule} from 'ionic-selectable'

const routes: Routes = [
  {
    path: '',
    component: RecordVerificationPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    IonicSelectableModule
  ],
  declarations: [RecordVerificationPage]
})
export class RecordVerificationPageModule {}
