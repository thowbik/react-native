import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SchoolSelectionComponent } from './school-selection.component';

const routes: Routes = [
  {
    path: '',
    component: SchoolSelectionComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SchoolSelectionComponent]
})
export class SchoolselectionModule {}
