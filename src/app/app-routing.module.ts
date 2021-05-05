import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CanActivate } from '@angular/router/src/utils/preactivation';
import { AuthGuard } from './guards/auth.guard';


const routes: Routes = [
  // { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  // { path: 'login1', loadChildren: './login/login.module#LoginPageModule' },
  // { path: 'questions', loadChildren: './pages/observation-data/questions/questions.module#QuestionsPageModule' },
  // {
  //   path: 'list',
  //   loadChildren: './pages/list/list.module#ListPageModule'
  // }, 
//   { path: 'classroom-data',
//   loadChildren: './pages/classroom-data/classroom-data.module#ClassroomDataPageModule'
// },
  // { path: 'classroom-type', loadChildren: './pages/classroom-type/classroom-type.module#ClassroomTypePageModule' },
  // { path: 'dashboard', loadChildren: './pages/dashboard/dashboard.module#DashboardPageModule' },
  // { path: 'pedagogy-details', loadChildren: './pages/pedagogy-details/pedagogy-details.module#PedagogyDetailsPageModule' },
  // { path: 'student-list', loadChildren: './pages/observation-data/student-list/student-list.module#StudentListPageModule' },
  // { path: 'student-assesment', loadChildren: './pages/observation-data/student-assesment/student-assesment.module#StudentAssesmentPageModule' },
  // { path: 'student-info', loadChildren: './pages/student-info/student-info.module#StudentInfoPageModule' },
  // { path: 'teacher-info', loadChildren: './pages/teacher-info/teacher-info.module#TeacherInfoPageModule' },
  // { path: 'class-sec-info', loadChildren: './pages/class-sec-info/class-sec-info.module#ClassSecInfoPageModule' },
  // { path: 'pedagogy-info', loadChildren: './pages/observation-data/pedagogy-info/pedagogy-info.module#PedagogyInfoPageModule' },
  {
    path:'page-route',
  // canActivate:[AuthGuard],
    loadChildren:'./pages/pages-routing.module#PagesRoutingModule'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
