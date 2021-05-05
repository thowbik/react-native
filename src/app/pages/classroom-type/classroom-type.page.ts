import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup, FormControl, Validators } from '@angular/forms';
import { Events, Platform } from '@ionic/angular';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { FileHandlerService } from 'src/app/services/file-handler/file-handler.service';
import { ApiService } from 'src/app/services/api.service';
import { IonicStorageService } from 'src/app/services/ionic-storage/ionic-storage.service';
import { ToastService } from 'src/app/services/common_Provider/toast-service/toast.service';
import { DISABLED } from '@angular/forms/src/model';

@Component({
  selector: 'app-classroom-type',
  templateUrl: './classroom-type.page.html',
  styleUrls: ['./classroom-type.page.scss'],
})
export class ClassroomTypePage implements OnInit {
  classroomTypeForm:FormGroup
  param_class_data:any;
  param_teacher_data:any;
  param_class_sec_info:any;
  teacher_list:any;
  class_list_forClasses=[]
  class_list:any=[{
    class_studying_id:1,
    class_name:1
  },{
    class_studying_id:2,
    class_name:2
  },
  {
    class_studying_id:3,
    class_name:3
  },
  {
    class_studying_id:4,
    class_name:4
  },
  {
    class_studying_id:5,
    class_name:5
  },
  {
    class_studying_id:6,
    class_name:6
  },
  {
    class_studying_id:7,
    class_name:7
  },
  {
    class_studying_id:8,
    class_name:8
  },];
  section_list:any=[];
  template_class: any;
  template_list: any[];
  student_list: any=[];
  medium_list=[{
    medium_info_id:2,
    medium_info_name:"Tamil"
  },{
    medium_info_id:3,
    medium_info_name:"English"
  },{
    medium_info_id:1,
    medium_info_name:"Others"
  }]

  constructor(private fb:FormBuilder,private event:Events,private router:Router, 
    private activateRoute:ActivatedRoute,private fileService:FileHandlerService,
    private apiService:ApiService,private ionicStorage:IonicStorageService,
    private plt:Platform,private toastService:ToastService) { 
    this.activateRoute.queryParams.subscribe(params=>{
      console.log("param",params)
      if(params.class_sec_info){
        this.param_class_sec_info=JSON.parse(params.class_sec_info)
      }
      if(params.class_data){
        this.param_class_data=JSON.parse(params.class_data)
      }
      if(params.teacher_info){
        this.param_teacher_data=JSON.parse(params.teacher_info)
      }
      // console.log(this.param_class_sec_info);
    })
    let class_numb;
    let sec_numb
    //class list
    // this.ionicStorage.getData('studentlist').then(res=>{
    //   class_numb=res.map(val=>val.class_studying_id)
    //   sec_numb=res.map(val=>val.class_section)
    //   class_numb=class_numb.filter((elem, i, arr) => {
    //     if (arr.indexOf(elem) === i) {
    //       return elem
    //     }
    //   })
    //   sec_numb=sec_numb.filter((elem, i, arr) => {
    //     if (arr.indexOf(elem) === i) {
    //       return elem
    //     }
    //   })
    //   console.log("edd",class_numb,sec_numb)
    //   sec_numb.length >0?
    //   sec_numb.forEach(val=>{
    //     this.section_list.push({sec_name:'A'})
    //   }): ''
    //   class_numb.length >0?
    //   class_numb.forEach(i=>{
    //  // for(let i=1;i<=15;i++){
    //     let value=this.fileService.classConvertion(i)
    //     this.class_list.push({'class_name':value,'class_studying_id':i})
    //  //}
    // }):''
    // })
    // console.log("param section",this.param_class_sec_info)
   
    // console.log("class",this.class_list)
    // this.section_list.push({sec_name:'A'});
    // this.section_list.push({sec_name:'B'});
    // this.section_list.push({sec_name:'C'});
    // this.section_list.push({sec_name:'D'});
    // this.section_list.push({sec_name:'E'});
    // this.section_list.push({sec_name:'F'});
    
    
  }

  ngOnInit() {
    this.classroomTypeForm=this.fb.group({
      // teachers_sanctioned:[''],
      // teachers_alloted:[''],
      // staff_attendance:[''],
      // student_enrolment:['']
      class:[this.param_class_sec_info ? this.param_class_sec_info.class_studying_id : '',Validators.compose([Validators.required])],
      section:[this.param_class_sec_info ? this.param_class_sec_info.sections.section : '',Validators.compose([Validators.required])],
      teacher:[''],
      class_type:['',Validators.compose([Validators.required])],
      tot_students:['',Validators.compose([Validators.required])],
      students_seen:['',Validators.compose([Validators.required])],
      medium_info:['',Validators.compose([Validators.required])],
      medium_info_others:[''],
      teacher_observed:['',Validators.compose([Validators.required])],
      teacher_emis_id:['']
      // classes_taken:[''],
      // class_observed:['']


    })

    // this.apiService.getTeachersListBySchoolId(this.param_class_data.school_id).subscribe(res=>{
    //     if(res['dataStatus']){
    //       this.teacher_list=res['records']
    //     }
    // })
    this.class_list_forClasses=this.class_list
    this.ionicStorage.getData('classroom-data').then(Response=>{
      if(Response){
        let cate_type=Response.classroom_data[1].cate_type.split(' ')[0]
        console.log("cate_type",cate_type)
        if(cate_type.toUpperCase() == 'PRIMARY'){
          this.class_list_forClasses=this.class_list.slice(0,5)
          console.log("c",this.class_list_forClasses)
        }
        else{
        
        }
      }
    })
    this.ionicStorage.getData('classroom-type').then(Response=>{
      console.log("classroom_type",Response)
      if(Response){
       
        this.classroomTypeForm.patchValue(Response.classroom_type)
      }
    })
    this.ionicStorage.getData('teacherlist').then(res=>{
      console.log(res)
      if(res){
        this.teacher_list=res
      }
      else{
        
      }
    })
    this.getTemplateFromFile()
  }
  valueChanges(value){
    if(value == 'multigrade'){
      this.classroomTypeForm.addControl('classes_taken',new FormControl('',Validators.compose([Validators.required])))
      this.classroomTypeForm.addControl('class_observed',new FormControl('',Validators.compose([Validators.required])))
      this.classroomTypeForm.removeControl('class')
    }
    else{
      this.classroomTypeForm.addControl('class',new FormControl('',Validators.compose([Validators.required])))
      this.classroomTypeForm.removeControl('classes_taken')
      this.classroomTypeForm.removeControl('class_observed')
    }
  }
  onSubmit(){
    if(this.plt.is('cordova')){
    if(this.classroomTypeForm.invalid){
        console.log(this.classroomTypeForm.value)
        Object.keys(this.classroomTypeForm.controls).forEach(field => { // {1}
          const control = this.classroomTypeForm.get(field);            // {2}
          control.markAsTouched({ onlySelf: true });       // {3}
        });
        this.toastService.presentToast("Please Fill all the Fields",'error');
        return;
    }
  }
      this.event.publish('classroom_type',this.classroomTypeForm.value);
      
      console.log(this.classroomTypeForm.value.class_type);
      if(this.classroomTypeForm.value.class_type == ''){
        this.template_class=this.classroomTypeForm.value.class
      }
      else if(this.classroomTypeForm.value.class_type == "monograde"){
        
        this.template_class=this.classroomTypeForm.value.class
        // this.classroomTypeForm.value.class='101'
      }
      else{
        this.template_class=this.classroomTypeForm.value.class_observed
      }
      // let params:NavigationExtras={
      //   queryParams:{
      //     template_class:template_class
      //   }
      // }
      // this.fileService.listDirectory('templates').then(res=>{
      //   console.log("list Directory",res);
      // })
      // localStorage.setItem('classroom_type',JSON.stringify(this.classroomTypeForm.value))
      this.ionicStorage.insertData_Replace('classroom-type',{classroom_type:this.classroomTypeForm.value})
      // console.log("splitted",this.template_list.filter(val=>val.template_name.includes(this.template_class)))
      let curr_template:any=this.template_list.filter(val=>val.template_name.includes(this.template_class))
      if(curr_template.length == 0){
        this.toastService.presentToast("No template available for the selected class",'error');
        return
      }
      curr_template=curr_template[0]
      this.navigate(curr_template.template_id)
    
  }
  getTemplateFromFile(){
     if (this.plt.is('cordova')) { 
      this.template_list=[]
      // make your native API calls 
      this.fileService.listDirectory('templates').then(res=>{
        console.log("list dir",res)
       let dir_list=res
      //  console.log("dir list",dir_list)
      //  dir_list.filter(val=>val.template_id)
       let template_list_temp
       dir_list.forEach(file_name=>{
        this.fileService.readFile({dir:'templates',file_name:file_name.name}).then(file=>{
          // console.log("read file",file);
          this.template_list.push(JSON.parse(file))
          console.log("template list",this.template_list)
         
        },err=>{
          this.toastService.presentToast("Network Error"+err,'error');
        })
        })
     
      },err=>{
        this.toastService.presentToast("Network Error"+err,'error');
      })
    } 
    else{
    this.apiService.getAllTemplates().subscribe(res=>{
      this.template_list=res['records'];

      // console.log("splitted",this.template_list.filter(val=>val.template_name.includes(this.template_class)))
      // let curr_template=this.template_list.filter(val=>val.template_name.includes(this.template_class))[0]
      // this.navigate(curr_template.template_id)
  }) 
} 

  
  }
  navigate(value){
    // let param:any={}
    let navigationExtras:NavigationExtras={
      queryParams:{
        // template_list:value.template_id
        template_list:value
      }
    }
    this.router.navigate(['page-route','question-template-list'],navigationExtras)
  }
  getTotalList(){
    console.log("ee");
    if(this.classroomTypeForm.value.class!=''&& this.classroomTypeForm.value.section!=''){
      console.log("Dd",this.classroomTypeForm.value.class, this.classroomTypeForm.value.section)
      this.ionicStorage.getData('studentlist').then(res=>{
        console.log(res)
        if(res){
          this.student_list=res
          let sec_upper=this.classroomTypeForm.value.section.toUpperCase()
         let curr_class_info= this.student_list.filter(val=>val.class_studying_id == this.classroomTypeForm.value.class && val.class_section== sec_upper)[0]
          console.log(curr_class_info)
          if(curr_class_info != ''){
          let tot=parseInt(curr_class_info.male)+parseInt(curr_class_info.female)
          this.classroomTypeForm.controls['tot_students'].setValue({value:tot,disabled:true})
          }
        }
        else{
          
        }
      })
    }
  }

}
