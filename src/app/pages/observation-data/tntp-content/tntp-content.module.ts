import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TntpContentPage } from './tntp-content.page';
import {IonicSelectableModule} from 'ionic-selectable'

const routes: Routes = [
  {
    path: '',
    component: TntpContentPage
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
  ],
  declarations: [TntpContentPage]
})
export class TntpContentPageModule {}
