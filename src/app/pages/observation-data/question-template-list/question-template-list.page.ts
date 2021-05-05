import { Component, OnInit, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Storage } from '@ionic/storage';
import { ToastService } from 'src/app/services/common_Provider/toast-service/toast.service';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { ConnectionStatus, NetworkService } from 'src/app/services/network.service';
import { ApiService } from 'src/app/services/api.service';
import { AuthenticationService } from 'src/app/services/auth-service/authentication.service';

@Component({
  selector: 'app-question-template-list',
  templateUrl: './question-template-list.page.html',
  styleUrls: ['./question-template-list.page.scss'],
})
export class QuestionTemplateListPage implements OnInit {
  template_list = [{
    id: 1,
    name: "Topic and Learning Outcome",
    url: 'learning-outcome',
    storage_id:'5',
    is_answered:false,
    color:'red'
  },
  {
    id: 2,
    name: "Pedagogy Info",
    url: 'tntp-content',
    storage_id:'2',
    is_answered:false,
    color:'red'
  },
  {
    id: 3,
    name: "Diksha / TNTP Content",
    url: 'pedagogy-info',
    storage_id:'4',
    is_answered:false,
    color:'red'
  },
  {
    id: 4,
    name: "Classroom Management",
    url: 'questions',
    storage_id:'6',
    is_answered:false,
    color:'red'
  },
  {
    id: 6,
    name: "Record Verification",
    url: 'record-verification',
    storage_id:'8',
    is_answered:false,
    color:'red'
  },
  {
    id: 7,
    name: "Student Assessment",
    url: "student-list",
    storage_id:'3',
    is_answered:false,
    color:'red'
  },
  {
    id: 8,
    name: "Final Remarks",
    url: 'student-assesment',
    storage_id:'7',
    is_answered:false,
    color:'red'
  }
  ]
  storage_keys = [
  {
    id: 2,
    name: 'pedagogy_info'
  },
  {
    id: 3,
    name: 'student_list_form'
  },
  {
    id: 4,
    name: 'tntp_content_form'
  }, {
    id: 5,
    name: "learning_outcome_form"
  },{
    id:6,
    name:'classroom_observation_form'
  },
  {
    id:7,
    name:'final_remarks'
  },
  {
    id:8,
    name:'record_verification_form'
  }
  ]
  template_id: any;
  constructor(private activateRoute: ActivatedRoute, private router: Router,private ionicStorage:Storage
    ,private toastService:ToastService,private appVersion:AppVersion,private networkService:NetworkService
    ,private api:ApiService,private authService:AuthenticationService) { }

  ngOnInit() {
    this.activateRoute.queryParams.subscribe(params => {
      // console.log('param',params);
      if (params.template_list) {
        this.template_id = JSON.parse(params.template_list)
      }
      this.getDataFromStorage()
    })
   
  }
  // ngDoCheck(){
  //   
  // }
  
 

 
  getDataFromStorage(){
    let keys_from_storage
    
    this.ionicStorage.keys().then(keys=>{
      keys_from_storage=keys
      // console.log(keys)
      this.storage_keys.forEach(result=>{
        // console.log('ins',result)
        keys_from_storage.forEach(value=>{
          // console.log(value,result)
          if(value == result.name){
            // console.log("correct key",value)
            this.template_list.filter(val=>parseInt(val.storage_id) == result.id).map(res=>{
               res.is_answered=true
               res.color='green'
            })
            // console.log(this.template_list)
          }
        })
    })
  })
  }
  choose_question(choosen_template) {
    if (choosen_template != '') {
      console.log(choosen_template);
      let navigationExtras: NavigationExtras = {
        queryParams: {
          // template_list:value.template_id
          template_list: this.template_id
        }
      }
      this.router.navigate(['page-route', choosen_template.url], navigationExtras)
    }
  }
  onSubmit(){
    
    this.toastService.presentAlertConfirm("Confirm","Are you sure you want to submit").then(toast_res=>{
      if(toast_res.role == 'cancel'){
        return;
      }
      else{
        let appVersionNumber
       this.appVersion.getVersionNumber().then(version_number=>{
        appVersionNumber=version_number
      })
        console.log("else part")
    // let final_remarks_form={final_remarks_form:this.final_remarks_form.value}
    let records:any=[]
     
    let tokenData=this.authService.getTokenDetails()
    let emis_username=tokenData.emis_username
  
    // records.emis_username={user:emis_username}
    let form_values:any=[]
    this.ionicStorage.forEach((value,key,index)=>{
      // console.log("st",index,key,value)
      if(key != "studentListBy_school_id" && key != "teacherListBy_school_id" && key != "currentSchool_id"  && key != "learning_outcome" && key != 'store_observation' && key != 'learningOutcomeQues' && key !='schoolListBy_District_id'&& key != 'observation_list'){
      // records[key]=value
      form_values.push(value)
      // this.ionicStorage.remove(key)
      console.log("r",form_values,key);
      }
      this.ionicStorage.length().then(storage_length=>{
      if(index == storage_length){
        // console.log("curr index",index)
       console.log("string",records)
      //  form_values.push(final_remarks_form)
      
      records={emis_username:emis_username,form_values,app_version:appVersionNumber}
      console.log("ksdfj",records)
      this.api.saveObservation(records).subscribe(res=>{
        if(res['dataStatus']){
          this.ionicStorage.forEach((value,key,index)=>{
            if(key != "studentListBy_school_id" && key != "teacherListBy_school_id" && key != "currentSchool_id"  && key != "learning_outcome" && key != 'store_observation' && key != 'learningOutcomeQues' && key !='schoolListBy_District_id'&& key != 'observation_list'){
              this.ionicStorage.remove(key)
              console.log("r",key);
              }
              this.toastService.presentToast("Record Saved Successfully","success");
              this.router.navigate(['page-route'])
          }) 
        }
        else{
          // this.ionicStorageService.insertData_noReplace('save_observation',records)
          console.log("some thing went wrong");
          if(this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline){
          this.ionicStorage.forEach((value,key,index)=>{
            if(key != "studentListBy_school_id" && key != "teacherListBy_school_id" && key != "currentSchool_id"  && key != "learning_outcome" && key != 'store_observation' && key != 'learningOutcomeQues' && key !='schoolListBy_District_id'&& key != 'observation_list'){
              this.ionicStorage.remove(key)
              // console.log("r",key);
              }
          this.router.navigate(['page-route'])
        }) 
          }
          else{
          this.toastService.presentToast("Something went wrong","error");
          }
        }
      },err=>{
        console.log(err)
        this.ionicStorage.forEach((value,key,index)=>{
          if(key != "studentListBy_school_id" && key != "teacherListBy_school_id" && key != "currentSchool_id"  && key != "learning_outcome" && key != 'store_observation' && key != 'learningOutcomeQues' && key !='schoolListBy_District_id' && key != 'observation_list'){
            this.ionicStorage.remove(key)
            console.log("r",key);
            }
        this.router.navigate(['page-route'],{replaceUrl:true})
          })
        // this.toastService.presentToast(JSON.stringify(err),'error');
      })
    console.log("ksdfj",{records:records})
  
      }
    })
    })
  }
  })
    
  }

}
