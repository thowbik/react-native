import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import {} from '../login/login.module'
const routes: Routes = [
  // { path: '', redirectTo: 'dashbo ard', pathMatch: 'full' },
  { path: '', redirectTo: 'dashboardc', pathMatch: 'full' },

  // { path: 'login5', loadChildren: '../pages/login/login.module#LoginPageModule' },
//   { path: 'home', loadChildren: './home/home.module#HomePageModule' },
//   { path: 'login1', loadChildren: './login/login.module#LoginPageModule' },
  { path:'questions', loadChildren: '../pages/observation-data/questions/questions.module#QuestionsPageModule' },
//   {
//     path: 'list',
//     loadChildren: './pages/list/list.module#ListPageModule'
//   }, 
  { path:'classroom-data', loadChildren: '../pages/classroom-data/classroom-data.module#ClassroomDataPageModule'},
  { path:'classroom-type', loadChildren: '../pages/classroom-type/classroom-type.module#ClassroomTypePageModule'},
  { path:'activity-log', loadChildren:'../pages/activity-log/activity-log.module#ActivityModule'},
  { path:'schedular', loadChildren:'../pages/schedular/schedular.module#SchedularModule'},
  { path:'school-selection', loadChildren:'../pages/school-selection/school-selection.module#SchoolselectionModule'},
  { path:'dashboard', loadChildren: '../pages/dashboard/dashboard.module#DashboardPageModule' },
  { path:'dashboardc', loadChildren: '../pages/dashboardc/dashboardc.module#DashboardcPageModule' },
  { path:'emiverify/:id', loadChildren: '../pages/emiverify/emiverify.module#EmiverifyModule' },
  { path:'classroom', loadChildren: '../pages/classroom/classroom.module#ClassroomModule' },
  { path:'methodology', loadChildren: '../pages/methodology/methodology.module#MethodologyModule' },

  //  { path: 'pedagogy-details', loadChildren: '../pages/pedagogy-details/pedagogy-details.module#PedagogyDetailsPageModule' },
  { path: 'student-list', loadChildren: '../pages/observation-data/student-list/student-list.module#StudentListPageModule' },
  { path: 'student-assesment', loadChildren: '../pages/observation-data/student-assesment/student-assesment.module#StudentAssesmentPageModule' },
  { path: 'student-info', loadChildren: '../pages/student-info/student-info.module#StudentInfoPageModule' },
  { path: 'teacher-info', loadChildren: '../pages/teacher-info/teacher-info.module#TeacherInfoPageModule' },
  { path: 'class-sec-info', loadChildren: '../pages/class-sec-info/class-sec-info.module#ClassSecInfoPageModule' },
  { path: 'pedagogy-info', loadChildren: '../pages/observation-data/pedagogy-info/pedagogy-info.module#PedagogyInfoPageModule' },
  { path: 'attendance', loadChildren: './attendance/attendance.module#AttendancePageModule' },
  { path: 'template-list',loadChildren: '../pages/template-list/list.module#ListPageModule'},
  { path: 'student-attendance', loadChildren: './student-attendance/student-attendance.module#StudentAttendancePageModule' },
  { path: 'student-class-list', loadChildren: './student-class-list/student-class-list.module#StudentClassListPageModule' },
  { path: 'staff-attendance', loadChildren: './staff-attendance/staff-attendance.module#StaffAttendancePageModule' },
  { path: 'learning-outcome', loadChildren: './observation-data/learning-outcome/learning-outcome.module#LearningOutcomePageModule' },
  { path: 'tntp-content', loadChildren: './observation-data/tntp-content/tntp-content.module#TntpContentPageModule' },
  { path: 'record-verification', loadChildren: './observation-data/record-verification/record-verification.module#RecordVerificationPageModule' },
  { path: 'observation', loadChildren: './observation/observation.module#ObservationModule' },
  { path: 'observation-list', loadChildren: './observation-list/observation-list.module#ObservationListPageModule' },
  { path: 'question-template-list', loadChildren: './observation-data/question-template-list/question-template-list.module#QuestionTemplateListPageModule' },
  { path: 'assessment', loadChildren: './assessment/assessment.module#AssessmentPageModule' },
  { path: 'teacher-selection', loadChildren: './teacher-selection/teacher-selection.module#TeacherSelectionPageModule' },

  // { path: 'page', loadChildren: './page/page.module#PagesPageModule' },

];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
