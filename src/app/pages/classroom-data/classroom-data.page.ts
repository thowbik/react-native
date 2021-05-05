import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup, Validators, FormControl } from '@angular/forms';
import { Events } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthenticationService } from 'src/app/services/auth-service/authentication.service';
import { IonicStorageService } from 'src/app/services/ionic-storage/ionic-storage.service';
import { ToastService } from 'src/app/services/common_Provider/toast-service/toast.service';
import { FileHandlerService } from 'src/app/services/file-handler/file-handler.service';
import { NetworkService, ConnectionStatus } from 'src/app/services/network.service';

@Component({
  selector: 'app-classroom-data',
  templateUrl: './classroom-data.page.html',
  styleUrls: ['./classroom-data.page.scss'],
})
export class ClassroomDataPage implements OnInit {
  school_selection_form:FormGroup;
  school_data:any=[]
  school_info:any=''
  // districtData=[{
  //   name:'coimbatore', 
  //   id:201},
  //   {
  //     name:'Thiruvarur',
  //     id:202
  //   }]
  //   blockData=[{
  //     name:'Anamalai', 
  //     id:1,
  //     D_id:201
  //   },
  //     {
  //       name:'Annur',
  //       id:2,
  //       D_id:201
  //     },
  //     {
  //       name:'karamadai',
  //       id:3,
  //       D_id:201
  //     },
  //     {
  //       name:'Madhukkarai',
  //       id:4,
  //       D_id:201
  //     }
  //   ]
  //   schoolData=[{
  //     name:'Coimbatore Government Higher Secondary School',
  //     id:1
  //   }]

    searchOption=[{
      name:'School Name',
      value:'school_search'
    },
    {
      name:'UDISE ID',
      value:'id_search'
    },
    {
      name:'Location',
      value:'locate_school'
    }]
  no_internet: boolean=false;
  blockList:any=[]
  curr_school:any=[]

  constructor(private fb:FormBuilder,private event:Events,private router:Router,
    private apiService:ApiService,private authService:AuthenticationService,
    private ionicStorage:IonicStorageService,
    private toastService:ToastService,private fileService:FileHandlerService,private networkService:NetworkService) { }

  ngOnInit() {
    this.ionicStorage.getData('schoollistbydistrictid').then(res=>{
      console.log("ddkkd",res)
      if(res != null){
        
        this.school_data=res
        this.seperateBlockandSchool()
      }
      else{
    if(this.networkService.getCurrentNetworkStatus()==ConnectionStatus.Offline){
      this.toastService.presentToast("You are currently Offline",'');
    }
    else{
    this.getDataFromApi();
    }
  }
  })
   
    this.school_selection_form=this.fb.group({
      block:['',Validators.compose([Validators.required])],
      search_option:[''],
      school_search:['',Validators.compose([Validators.required])]
    })
   
    let local_data:any;
    this.ionicStorage.getData('classroom-data').then(response=>{
      console.log("getDataresponse ",response);
      local_data=response
    console.log("d",local_data)
    
    if(local_data){
      local_data=local_data.classroom_data
    
      console.log("inside",local_data);
      this.SelectedOption(local_data[0].search_option)

      let data
      if(this.school_selection_form.value.search_option == "UDISE ID"){
       data=local_data[1]
       this.school_selection_form.controls['id_search'].setValue(local_data[0].id_search)

      }
       else{
         this.school_selection_form.controls['school_search'].setValue(local_data[0].school_search)
         this.school_selection_form.controls['block'].setValue(local_data[0].block)
        data=local_data[0].school_search
       }

      this.getValueOfSchool(data,this.school_selection_form.value.search_option,'')
      // this.toastService.presentToast("Last School Selection Record","success")
    }
    else{
    // this.getDataFromApi();
    }
  
  },err=>{
    alert(err);
  })
  // this.ionicStorage.loopData('classroom-data').then(vv=>{
  //   console.log("vv result",vv);
  // })
  
  }
  seperateBlockandSchool(){
    this.school_data.forEach(res=>{
      //  console.log("dd",this.blockList)
       if(this.blockList.length > 0){
         let len=this.blockList.filter(val=>val.block_id === res.block_id)
         if(len.length>0){}
         else{
          this.blockList.push({'block_id':res.block_id,block_name:res.block_name})
         }
       }
       else{
        this.blockList.push({'block_id':res.block_id,block_name:res.block_name})
       }
      })
  }
  getDataFromApi(){
    this.apiService.getAllTemplates().subscribe(res=>{
      // let value=res['records'][0].questions[0].ques_ans_json
      // console.log("raw",value)
      // console.log("Parsed",JSON.parse(value))
      res['records'].forEach(value=>{
        // this.fileService.createDirectory("templates")
      let store=this.fileService.writeFile(value,{dir:"templates",file_name:value.template_id})
      console.log("store",store);
    })
  })

    let tokenData=this.authService.getTokenDetails()
    console.log("token DAta",tokenData);
    this.apiService.getSchoolListByBlockId(tokenData.district_id).subscribe(res=>{
      if(res['dataStatus']){
        // let modified:any=[];
        this.school_data=res['records'].filter(val=>val.school_type == 'Government')
        let store=this.ionicStorage.insertData_Replace('schoollistbydistrictid',this.school_data)
        console.log("schoollistbydistrictid 111",store)
       this.school_data.forEach(res=>{
        //  console.log("dd",this.blockList)
         if(this.blockList.length > 0){
           let len=this.blockList.filter(val=>val.block_id === res.block_id)
           if(len.length>0){}
           else{
            this.blockList.push({'block_id':res.block_id,block_name:res.block_name})
           }
         }
         else{
          this.blockList.push({'block_id':res.block_id,block_name:res.block_name})
         }
        })
        // this.blockList=this.blockList.filter((elem, i, arr) => {
        //   if (arr.indexOf(elem) === i) {
        //     return elem
        //   }
        // })
        // console.log(modified)
      }   
    })
    //  this.apiService.getMaster('SCHOOLNEW_BLOCK').subscribe(res=>{
    //   console.log(res)
    // })
    //  this.apiService.getMaster('SCHOOLNEW_SCHOOL_DEPARTMENT').subscribe(res=>{
    //   console.log(res)
    // })
    // this.apiService.getMaster('SCHOOLNEW_DISTRICT').subscribe()
    // this.apiService.getMaster('SCHOOLNEW_EDN_DIST_MAS').subscribe()
    // this.apiService.getMaster('SCHOOLNEW_MANAGE_CATE').subscribe()
    // this.apiService.getMaster('EMIS_SCHOOLS_TEACHERS').subscribe()
   
    this.apiService.getAllLeaningOutcomeQuestions().subscribe(ques_response=>{
      if(ques_response['dataStatus']== true){
        this.ionicStorage.insertData_Replace('learningoutcomeques',ques_response['records'])
      }
    })  
  }
  SelectedOption(value){
    // console.log(value);
    this.school_info=''
    this.school_selection_form.controls['search_option'].setValue(value);
    if(value == 'School Name'){
    this.school_selection_form.addControl('school_search',new FormControl('',Validators.compose([Validators.required])))
    this.school_selection_form.removeControl('id_search') 
    }
    else if(value == 'UDISE ID'){
      this.school_selection_form.addControl('id_search',new FormControl('',Validators.compose([Validators.required])))
      this.school_selection_form.removeControl('school_search')
      // this.school_selection_form.controls['scho']
    }
    else{
      this.school_selection_form.removeControl('id_search')
      this.school_selection_form.removeControl('school_search')
    }
  }
  getValueOfSchool(data,option,from){
    // this.networkService
   
    // console.log(data);
  if(option == 'udise_code'){

    let value=this.school_data.filter(val=>val.udise_code == data)
    // console.log("value",value)
    if(value.length !=0){
    this.school_info=value[0]
    }
  }
  else{
  this.school_info=data
  }
  if(from == 'click'){
    //for button Click function
  if(this.networkService.getCurrentNetworkStatus()== ConnectionStatus.Offline){
    // this.toastService.presentToast("You have no Internet Connection",'warning');
  }
  else{
    // this.storeMasterDataOffline();
    // this.toastService.presentToast("Data Synced Successfully for the Selected School","success");
   
  }
}
else{
  //from ngONInit();
  // this.storeMasterDataOffline();
}

  
  // if(this.networkService.getCurrentNetworkStatus() != ConnectionStatus.Offline){
  // }
  // else{
  //   this.toastService.presentToast("You are Offline Connect to the network and try again!!","dark")
  // }
}

  storeMasterDataOffline(){
    let school_id=this.school_info.school_id
    this.apiService.getStudentsListBySchoolId(school_id).subscribe(res=>{
      // console.log("studentlist api",res);
      if(res['dataStatus']==true){
       this.ionicStorage.insertData_Replace('studentlist',res['records'])
      }
      else{
        this.toastService.presentToast("Error:"+res['msg'],'dark')
      }
     this.apiService.getTeachersListBySchoolId(school_id).subscribe(Response=>{
       if(Response['dataStatus']== true){
         this.ionicStorage.insertData_Replace('teacherlist',Response['records'])
       }
       else{
         this.toastService.presentToast('Error'+Response['msg'],'dark')
       }
      
      
     },error=>{
       this.toastService.presentToast('Error Something went wrong'+error,'error');
     })
    },err=>{
      this.toastService.presentToast('Error Something went wrong'+err,'error');
    })
    this.ionicStorage.insertData_Replace('school_id',this.school_info.school_id);

    let records:any=[]
    records.push(this.school_selection_form.value);
    records.push(this.school_info);
    
    this.ionicStorage.insertData_Replace('classroom-data',{"classroom_data":records});
  }
  onSubmit(){
    if(this.school_selection_form.valid && this.school_info !=''){
      console.log("dd",this.school_selection_form.value,this.school_info);
      this.goToNextPage();
    }
  }
  reset_School_info(){
    this.school_info=''
  }
  goToNextPage(){
    this.ionicStorage.insertData_Replace('school_id',this.school_info.school_id);

    let records:any=[]
    records.push(this.school_selection_form.value);
    records.push(this.school_info);
    
    this.ionicStorage.insertData_Replace('classroom-data',{"classroom_data":records});
    
    // let records:any=[];
    // storeData=this.school_selection_form.value
    // storeData.push({'school_id':this.school_info.school_id})
    // records.school_selection=this.school_selection_form.value
    // records.full_info=this.school_info

    // records.push(this.school_selection_form.value);
    // records.push(this.school_info);
    // console.log("records",records);
    // this.event.publish('school_selection',records)
    // let navigationExtras:NavigationExtras={
    //   queryParams:{
    //     class_data:JSON.stringify(records.full_info)
    //   }
    // }
    
    // localStorage.setItem('classroom_data',JSON.stringify(this.school_selection_form.value))
    // localStorage.setItem('school_id',this.school_info.school_id)
    
    // this.router.navigate(['page-route','teacher-info'],this.school_selection_form.value)
    this.router.navigate(['page-route','teacher-info'])
  } 
  getSchools(){
    console.log(this.school_selection_form.value)
    this.curr_school=this.school_data.filter(val=>val.block_id ==this.school_selection_form.value.block.block_id)
    console.log(this.school_data);
  }

}
