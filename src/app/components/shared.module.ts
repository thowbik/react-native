import { NgModule } from '@angular/core';
import { ProgressComponent } from './progress/progress.component';
import { IonicModule } from '@ionic/angular';
import { NavigationComponent } from './navigation/navigation.component';
import { ClassroommodalComponent } from './classroommodal/classroommodal.component';
import { AssessmentmodalComponent } from './assessmentmodal/assessmentmodal.component';
import { ObservationmodalComponent } from './observationmodal/observationmodal.component';
import { AttendancemodalComponent } from './attendancemodal/attendancemodal.component';
import { DashboardmodalComponent } from './dashboardmodal/dashboardmodal.component';
import { EmimodalComponent } from './emimodal/emimodal.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuestionsComponent } from './questions/questions.component';
import { NotificationComponent } from './notification/notification.component';
import { NotificationModalComponent } from './notification-modal/notification-modal.component';

@NgModule({
  declarations: [
    ProgressComponent,
    NavigationComponent,
    ClassroommodalComponent,
    AssessmentmodalComponent,
    ObservationmodalComponent,
    AttendancemodalComponent,
    DashboardmodalComponent,
    EmimodalComponent,
    QuestionsComponent,
    NotificationComponent,
    NotificationModalComponent
  ],
  entryComponents: [
    NavigationComponent,
    ClassroommodalComponent,
    AssessmentmodalComponent,
    ObservationmodalComponent,
    AttendancemodalComponent,
    DashboardmodalComponent,
    QuestionsComponent,
    EmimodalComponent,
    NotificationComponent,
    NotificationModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  providers: [

  ],
  exports: [ProgressComponent,
    NavigationComponent,
    ClassroommodalComponent,
    AssessmentmodalComponent,
    ObservationmodalComponent,
    AttendancemodalComponent,
    DashboardmodalComponent,
    QuestionsComponent,
    EmimodalComponent,
    NotificationComponent,
    NotificationModalComponent],
})
export class SharedModule {}
