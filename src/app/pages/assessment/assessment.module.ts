import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AssessmentPage } from './assessment.page';
import { StudentAssessmentComponent } from './student-assessment/student-assessment.component';
import { AssementPerformanceComponent } from './assement-performance/assement-performance.component';
import { SharedModule } from 'src/app/components/shared.module';

const routes: Routes = [
  {
    path: '',
    component: AssessmentPage
  },
  {
    path: 's-assessment',
    component: StudentAssessmentComponent,
  },
  {
    path: 'student-performance',
    component: AssementPerformanceComponent,
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AssessmentPage,
    StudentAssessmentComponent,
    AssementPerformanceComponent],
    exports: [],
    entryComponents: []
})
export class AssessmentPageModule {}
