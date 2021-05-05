import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AttendancePage } from './attendance.page';
import { StudentAttendanceComponent } from './student-attendance/student-attendance.component';
import { SharedModule } from 'src/app/components/shared.module';
import { StudentDataComponent } from './student-data/student-data.component';
import { AttendanceVerifyComponent } from './attendance-verify/attendance-verify.component';
import { SubStudentAttendanceComponent } from './student-attendance/sub-student-attendance/sub-student-attendance.component';
import { SubAttendanceVerifyComponent } from './student-data/sub-attendance-verify/sub-attendance-verify.component';

import { OrderModule } from "ngx-order-pipe";

const routes: Routes = [
  {
    path: '',
    component: AttendancePage
  },
  {
    path: 'student-attendance',
    component: StudentAttendanceComponent
  },
  {
    path: 'student-data',
    component: StudentDataComponent
  },
  {
    path: 'attendance-verify',
    component: AttendanceVerifyComponent,
  },
  {
     path:'otherClass-attendance',
     component:SubStudentAttendanceComponent,

  },
   {

    path:'otherClass-attendance-verify',
    component:SubAttendanceVerifyComponent,
   }
   
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild(routes),
    OrderModule
  ],
  declarations: [AttendancePage,
    StudentAttendanceComponent,
    StudentDataComponent,
    AttendanceVerifyComponent,
    SubStudentAttendanceComponent,
    SubAttendanceVerifyComponent
  ],
    entryComponents: []
    })
export class AttendancePageModule {}
