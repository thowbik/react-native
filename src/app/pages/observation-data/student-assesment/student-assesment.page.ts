import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController, NavController } from '@ionic/angular';
import {StudentListPage} from '../student-list/student-list.page'
import { FormGroup, FormBuilder,FormControl,FormArray } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/services/auth-service/authentication.service';
import { IonicStorageService } from 'src/app/services/ionic-storage/ionic-storage.service';
import { Storage } from '@ionic/storage';
import { ToastService } from 'src/app/services/common_Provider/toast-service/toast.service';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { version } from 'punycode';
import { NetworkService, ConnectionStatus } from 'src/app/services/network.service';

@Component({
  selector: 'app-student-assesment',
  templateUrl: './student-assesment.page.html',
  styleUrls: ['./student-assesment.page.scss'],
})
export class StudentAssesmentPage implements OnInit {
  final_remarks_form:FormGroup;
  template_id: any;
  constructor(private modal:ModalController,private navCtrl:NavController,private fb:FormBuilder,private activateRoute:ActivatedRoute,private authService:AuthenticationService,private ionicStorage:Storage,private toastService:ToastService,private ionicStorageService:IonicStorageService,private appVersion:AppVersion,private networkService:NetworkService) { 
    
  }
  ngOnInit() {
   
    this.final_remarks_form=this.fb.group({
      recomend_class_action:[''],
      teacher_last_visit:[''],
      final_remarks:['']
    })
    this.ionicStorageService.getData('final_remarks').then(result=>{
      if(result){
        this.final_remarks_form.patchValue(result.final_remarks);
      }
    })
    this.activateRoute.queryParams.subscribe(params=>{
      if(params.template_list){
       this.template_id=JSON.parse(params.template_list)
      }
    })
}
onSubmit(){
  let navigationExtras:NavigationExtras={
    queryParams:{
      // template_list:value.template_id
      template_list:this.template_id
    }
  }
  this.ionicStorageService.insertData_Replace('final_remarks',{final_remarks:this.final_remarks_form.value})
  this.navCtrl.navigateBack(['page-route','question-template-list'],navigationExtras)
}
clearLastSavedForms(){
  
}
}
