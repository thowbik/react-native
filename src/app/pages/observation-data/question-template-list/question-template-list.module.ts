import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { QuestionTemplateListPage } from './question-template-list.page';

const routes: Routes = [
  {
    path: '',
    component: QuestionTemplateListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [QuestionTemplateListPage]
})
export class QuestionTemplateListPageModule {}
