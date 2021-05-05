import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Events } from '@ionic/angular';
import { IonicStorageService } from 'src/app/services/ionic-storage/ionic-storage.service';
// import { DISABLED } from '@angular/forms/src/model';

@Component({
  selector: 'app-teacher-info',
  templateUrl: './teacher-info.page.html',
  styleUrls: ['./teacher-info.page.scss'],
})
export class TeacherInfoPage implements OnInit {
teacherInfoForm:FormGroup
param_data:any;
  constructor(private fb:FormBuilder,private router:Router,private event:Events,
    private activateRoute:ActivatedRoute,private ionicStorage:IonicStorageService) {
    // this.activateRoute.queryParams.subscribe(params=>{
    //   console.log("param",params)
    //   if(params.class_data){
    //     this.param_data=JSON.parse(params.class_data)
    //   }
    // })
   
   }

  ngOnInit() {
    // this.event.subscribe('school_selection',(data)=>{
    //   console.lthis.
    this.getTeacherAlloted();
    this.teacherInfoForm=this.fb.group({
      teachers_sanctioned:[''],
     teachers_alloted:[''],
     staff_attendance:[''],
     // student_enrolment:['']
   })
   
   
  }
  getTeacherAlloted(){
      this.ionicStorage.getData('classroom-data').then(res=>{
        this.param_data=res.classroom_data[1].teach_tot
        this.teacherInfoForm.controls['teachers_alloted'].setValue(this.param_data);
      })
      
      // console.log(this.param_data);
   
  }
  onSubmit=()=>{
    // let navigationExtras:NavigationExtras={
    //   queryParams:{
    //     class_data:JSON.stringify(this.param_data),
    //     // teacher_info:JSON.stringify(this.teacherInfoForm.value)
    //   }
    // }
    // localStorage.setItem('teacher-info',JSON.stringify(this.teacherInfoForm.value))
    
    // this.router.navigate(['page-route','class-sec-info'],navigationExtras)
    this.ionicStorage.insertData_Replace('teacher-info',{teacher_info:this.teacherInfoForm.value})
    this.router.navigate(['page-route','classroom-type'])
  }

}
