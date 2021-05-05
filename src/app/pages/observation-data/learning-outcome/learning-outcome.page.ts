import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { NavController, LoadingController, Platform } from '@ionic/angular';
import { FormGroup, FormBuilder,FormArray,FormControl, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { IonicStorageService } from '../../../services/ionic-storage/ionic-storage.service';
import { FileHandlerService } from '../../../services/file-handler/file-handler.service';
import { ToastService } from '../../../services/common_Provider/toast-service/toast.service';

@Component({
  selector: 'app-learning-outcome',
  templateUrl: './learning-outcome.page.html',
  styleUrls: ['./learning-outcome.page.scss'],
})
export class LearningOutcomePage implements OnInit {

  ques:any;
  quesValue:any;
  extra_field:any=[];
  extra_img:any=[]
  
 
  
  questionForm:FormGroup;
  inputRadio:boolean=false;
    selectValue: any=[];
    loading
  template_id: any;
  curr_template: any;
  original_template: any=[];
  last_saved_data: any=[];
  constructor(private api:ApiService,private fb:FormBuilder,private loadingCtrl:LoadingController,
    private router:Router,private navCtrl:NavController,private activateRoute:ActivatedRoute,private ionicStorageService:IonicStorageService,
    private plt:Platform,private fileService:FileHandlerService,private toast:ToastService) {
  
   }

  ngOnInit() {
    this.getLocalData()
    // this.presentLoading()
    this.questionForm=this.fb.group({
     pedagogy_info:this.fb.array([])
     })
    //this.getQuestions()
    this.activateRoute.queryParams.subscribe(params=>{
      // console.log('param',params);
      if(params.template_list){
       this.template_id=JSON.parse(params.template_list)
      }
    })
    
  
  
  }
  async presentLoading() {
    this.loading=await this.loadingCtrl.create({
    message: '',
    duration:1000
   
  });
 return await this.loading.present();
}
getLocalData(){
  this.ionicStorageService.getData('learning-outcome').then(Response=>{
    if(Response){
      this.last_saved_data.pedagogy_info=Response.learning_outcome
     
    }
    this.getQues()
  })
}

assignDataAndControl(){
  console.log("local data",this.last_saved_data);
  
let temp=this.curr_template
this.curr_template=temp.questions.filter(val=>val.section == "1")
  // console.log("Entered")
  // console.log(this.curr_template);
  this.curr_template.forEach(res=>{
    let temp=JSON.parse(res.ques_ans_json)
    res.ques_ans_json=temp
  })

  // console.log("curr temp",this.curr_template)
  this.ques=this.curr_template
  // if(typeof(response) != 'object'){
  //   this.ques=JSON.parse(this.ques)
  // }
  // if(this.ques.offline_file){
  //   if(this.ques.offline_file == true){
  //   this.ques=JSON.parse(this.ques)
  //   }
  // }
 
  this.ques.forEach((res,index)=>{
    let answer_only:any=[];
    // console.log("res.ques_ans_json",res.ques_ans_json.type)
    if(res.ques_ans_json.type!='5' ){
  
  res.ques_ans_json.answers.forEach(val=>{
    answer_only.push({'ans':val.ans})
  })
      const control=this.questionForm.get('pedagogy_info') as FormArray
      control.push( this.createValue(res.ques_ans_json,answer_only));
   
    }
    else{
      // const control=this.questionForm.get('question') as FormArray
      // const val=this.fb.group({
      //   ans:this.fb.array([this.checkBoxArray(res)])
      // })
      // control.push(val);
      const control=this.questionForm.get('pedagogy_info') as FormArray
      control.push(this.checkBoxArray(res.ques_ans_json));
      // console.log("for",this.questionForm.value)
      // control=control.controls[index]
      // control.push( this.createValue(res));
    }
    // if(res.type == '3'){
    //   // this.getIonSelectValue(res,index);
    // }
    // console.log("form",this.questionForm.get('pedagogy_info')as FormArray)
  //   if(res.type == 2){
  //     this.createRadio(res.key)
  //   // this.questionForm.controls.radio['controls'].addControl(res.key,new FormControl(''))
  //   // let val=<FormArray>this.questionForm.controls
  // //   let val= this.fb.group({
  // //     res.key : ['']
  // //  });
  // //  const control = <FormArray>this.questionForm.controls.radio;
  // //  control.push(addControl(res.key));
  //   }
    // else{
  // this.questionForm.addControl(res.key,new FormControl(''));
    // }
    let nae=res.key
   
  })

  console.log("la",this.last_saved_data)
  if(this.last_saved_data.hasOwnProperty('pedagogy_info')){
    this.questionForm.patchValue(this.last_saved_data)
    console.log("d",this.questionForm.value)
    this.questionForm.value.pedagogy_info.forEach((value,index)=>{  // For IOnic Selectable onChange
      if(value.type == 3 || value.type == 4){
        console.log(value);
        this.valueChanges(value.ans,value,index)
      }
  })
    setTimeout(()=>{
      console.log("Entered");  
      if(this.last_saved_data.hasOwnProperty('pedagogy_info')){
        const pedagogy_info: any = <FormArray>this.questionForm.controls['pedagogy_info'];
        pedagogy_info.patchValue(this.last_saved_data.pedagogy_info);
      }
    },800)
  }
  // this.loading.dismiss();
}

getQues(){
  if (this.plt.is('cordova')) { 
    this.fileService.readFile({dir:'templates',file_name:this.template_id}).then(file=>{
    this.curr_template=JSON.parse(file)
    this.original_template=this.curr_template
    this.assignDataAndControl()
    })
    }
    else{
    this.api.getAllTemplates().subscribe(res=>{
      if(res['dataStatus']){
        console.log("ddd",res['records'])
        this.curr_template=res['records']
        
        // console.log("res",this.curr_template);
       this.curr_template=this.curr_template.filter(val=>val.template_id==this.template_id)
        this.curr_template=this.curr_template[0]
        this.original_template=this.curr_template
        this.assignDataAndControl()
      }
  });
}
//   this.api.getAllTemplates().subscribe(res=>{
//     if(res['dataStatus']){
// console.log("res",res['records']);
// this.curr_template=res['records'].filter(val=>val.template_id==this.template_id)
// this.curr_template=this.curr_template[0]
// let temp=this.curr_template
// this.curr_template=temp.questions.filter(val=>val.section == "2")
//   console.log("Entered")
//   console.log(this.curr_template);
//   this.curr_template.forEach(res=>{
//     let temp=JSON.parse(res.ques_ans_json)
//     res.ques_ans_json=temp
//   })

//   console.log("curr temp",this.curr_template)
//   this.ques=this.curr_template
//   // if(typeof(response) != 'object'){
//   //   this.ques=JSON.parse(this.ques)
//   // }
//   // if(this.ques.offline_file){
//   //   if(this.ques.offline_file == true){
//   //   this.ques=JSON.parse(this.ques)
//   //   }
//   // }
 
//   this.ques.forEach((res,index)=>{
//     let answer_only:any=[];
//     console.log("res.ques_ans_json",res.ques_ans_json.type)
//     if(res.ques_ans_json.type!='5' ){
  
//   res.ques_ans_json.answers.forEach(val=>{
//     answer_only.push({'ans':val.ans})
//   })
//       const control=this.questionForm.get('pedagogy_info') as FormArray
//       control.push( this.createValue(res.ques_ans_json,answer_only));
   
//     }
//     else{
//       // const control=this.questionForm.get('pedagogy_info') as FormArray
//       // const val=this.fb.group({
//       //   ans:this.fb.array([this.checkBoxArray(res)])
//       // })
//       // control.push(val);
//       const control=this.questionForm.get('pedagogy_info') as FormArray
//       control.push(this.checkBoxArray(res.ques_ans_json));
//       console.log("for",this.questionForm.value)
//       // control=control.controls[index]
//       // control.push( this.createValue(res));
//     }
//     // if(res.type == '3'){
//     //   // this.getIonSelectValue(res,index);
//     // }
//     console.log("form",this.questionForm.get('pedagogy_info')as FormArray)
//   //   if(res.type == 2){
//   //     this.createRadio(res.key)
//   //   // this.questionForm.controls.radio['controls'].addControl(res.key,new FormControl(''))
//   //   // let val=<FormArray>this.questionForm.controls
//   // //   let val= this.fb.group({
//   // //     res.key : ['']
//   // //  });
//   // //  const control = <FormArray>this.questionForm.controls.radio;
//   // //  control.push(addControl(res.key));
//   //   }
//     // else{
//   // this.questionForm.addControl(res.key,new FormControl(''));
//     // }
//     let nae=res.key
   
//   })
//   // this.loading.dismiss();
// }
// })
}

//OLD FUNCTION

// getQuestions(){
 
//   this.api.getQuestions().subscribe(response=>{
//     console.log("Response",response);
//     console.log("type of",typeof(response));
//     this.ques=response
//     if(typeof(response) != 'object'){
//       this.ques=JSON.parse(this.ques)
//     }
//     this.ques.forEach((res,index)=>{
//       let answer_only:any=[];
//       if(res.type!='5' ){
    
//     res.answers.forEach(val=>{
//       answer_only.push({'ans':val.ans})
//     })
//         const control=this.questionForm.get('pedagogy_info') as FormArray
//         control.push( this.createValue(res,answer_only));
     
//       }
//       else{
       
//         const control=this.questionForm.get('pedagogy_info') as FormArray
//         control.push(this.checkBoxArray(res));
//         console.log("for",this.questionForm.value)
//       }
//       console.log("form",this.questionForm.get('pedagogy_info')as FormArray)
//       let nae=res.key
     
//     })
//   })
//   }
 
  checkBoxArray(res){
    return this.fb.group({
      ques:[res.question],
      // key:[res.key],
      type:[res.type],
      answer_key:[res.answers],
      ans:this.fb.array([])
    }
    )
  }
  onChange(value,isChecked,index){
    // console.log(value,isChecked,index)
    // console.log("q",this.questionForm.controls['pedagogy_info']);
    const answers = <FormArray>this.questionForm.controls['pedagogy_info']['controls'][index].controls.ans
  
    if(isChecked) {
      answers.push(new FormControl(value,Validators.compose([Validators.required])))
    } else {
      let idx = answers.controls.findIndex(x => x.value == value)
      answers.removeAt(idx)
    }
  }
  onChangeSubField(value,isChecked,index,par_index){
    const answers = <FormArray>this.questionForm.controls['pedagogy_info']['controls'][index].controls.ans
    const dd:any=<FormArray>this.questionForm.controls['pedagogy_info']['controls'][par_index]
    console.log("par",dd)
  const sub_control:any=<FormArray>this.questionForm.controls['pedagogy_info']['controls'][par_index].controls.sub_field_array.controls[index].controls.ans as FormArray
  console.log(answers,sub_control)
    if(isChecked) {
      sub_control.push(new FormControl(value,Validators.compose([Validators.required])))
    } else {
      let idx = answers.controls.findIndex(x => x.value == value)
      answers.removeAt(idx)
    }
  }
  createValue(res,answer_only): FormGroup{
   return this.fb.group({
      ans:['',Validators.compose([Validators.required])],
      ques:[res.question],
      answer_only:[answer_only],
      type:[res.type],
      answer_key:[res.answers]
      
    })
  }
  createSubValue(res,answer_only): FormGroup{
    return this.fb.group({
       ans:['',Validators.compose([Validators.required])],
       ques:[res.question],
       answer_only:[answer_only],
       type:[res.type],
       answer_key:[res.answers]
       
     })
   }
//   valueChanges(event,name,i){
//     // console.log(event,name,i)
//     let value
//     value=name.answer_key.filter(val=>val.ans == event)
//     // console.log(value)
//     const control:any= this.questionForm.get('pedagogy_info')
//    if(value.length>0){
//    if(value[0].next_filed == 'freetext'){
//     // console.log("free text",value)
//      this.extra_field[i]=value[0]
//      this.extra_field[i].open=true
  

//    control.controls[i].addControl('subfield_name',new FormControl(this.extra_field[i].field_value))
//    control.controls[i].addControl('subfield_value',new FormControl('',Validators.compose([Validators.required])))
//    }
//  else if(value[0].next_filed == 'img'){
//     value[0].open = true
//     this.extra_field[i]=value[0]
//     control.controls[i].addControl('subfield_name',new FormControl(this.extra_field[i].field_value))
//     control.controls[i].addControl('subfield_value',new FormControl(''))
//    }
//    else{
//     value[0].open = false
//      this.extra_field[i]=value[0]
//      this.questionForm.removeControl(this.extra_field[i].field_value);
//      control.controls[i].removeControl(this.extra_field[i].field_value)
//    }
        // console.log("extra Field",this.extra_field);
    
  //  }
  
    
    // console.log("Form Values",this.questionForm.value)
  // }

  //OLD WORKING CODE

//   valueChanges(event,name,i){
//         // console.log(event,name,i)
       
//         let value
//         value=name.answer_key.filter(val=>val.ans == event)
//         console.log(value,this.curr_template)
//         const control:any= this.questionForm.get('pedagogy_info')
       
//         let sub_field_template
//         if(value.length>0){
//           control.controls[i].removeControl('sub_field_array')
//            sub_field_template= this.original_template.questions.filter(val=>val.section == value[0].action)
//            console.log("sub",sub_field_template)
//            control.controls[i].addControl('sub_field_array',this.fb.array([]))
         
//            sub_field_template.forEach((res,index)=>{
//             let answer_only:any=[]
//              console.log('parse',JSON.parse(res.ques_ans_json))
//              let cc=JSON.parse(res.ques_ans_json)
//             //  if(cc.type != '5'){
//              cc.answers.forEach(value=>{
//               answer_only.push({'ans':value.ans})
//              })
//             //  const control=this.questionForm.get('pedagogy_info') as FormArray
//             // const india_sales:any=<FormArray> this.businessForm.controls['manufacturing_activity_details']['controls'][0].controls.india_where_sale_done;
//             // const sub_control:any=<FormArray>this.questionForm.controls['pedagogy_info']['controls'][i].controls.sub_field_array as FormArray
//             let sub_control: any = control.controls[i].get('sub_field_array') as FormArray;
//             sub_control.push(this.createSubValue(cc,answer_only))
//             //  }
//             //  else{
//             //    console.log("ente")
//             //   let sub_control: any = control.controls[i].get('sub_field_array') as FormArray;
//             //   sub_control.push(this.checkBoxArray(cc));
//             // }
//             //  this.extra_field[i]=value[0]
//             // this.extra_field[i].open=true
//             //  control.controls[i].addControl('subfield_name'+index,new FormControl(cc.question))
//             //  control.controls[i].addControl('subfield_value'+index,new FormControl('',Validators.compose([Validators.required])))
//            })

//           //  res.ques_ans_json.answers.forEach(val=>{
//           //   answer_only.push({'ans':val.ans})
//           // })
//           //     const control=this.questionForm.get('pedagogy_info') as FormArray
//           //     control.push( this.createValue(res.ques_ans_json,answer_only));
           
//            console.log("dd",control)
//         }
//            if(value.length>0){
//    if(value[0].next_filed == 'freetext'){
//     // console.log("free text",value)
//      this.extra_field[i]=value[0]
//      this.extra_field[i].open=true
//      this.extra_field[i].placeholder=value[0].Description
  

//    control.controls[i].addControl('subfield_name',new FormControl(this.extra_field[i].field_value))
//    control.controls[i].addControl('subfield_value',new FormControl('',Validators.compose([Validators.required])))
//    }
//  else if(value[0].next_filed == 'img'){
//     value[0].open = true
//     this.extra_field[i]=value[0]
//     control.controls[i].addControl('subfield_name',new FormControl(this.extra_field[i].field_value))
//     control.controls[i].addControl('subfield_value',new FormControl(''))
//    }
//    else{
//     value[0].open = false
//      this.extra_field[i]=value[0]
//      this.questionForm.removeControl(this.extra_field[i].field_value);
//      control.controls[i].removeControl(this.extra_field[i].field_value)
//    }
//   }
   
//     }

     
   
//       control.controls[i].addControl('subfield_name',new FormControl(this.extra_field[i].field_value))
//       control.controls[i].addControl('subfield_value',new FormControl('',Validators.compose([Validators.required])))
//       }
//     else if(value[0].next_filed == 'img'){
//        value[0].open = true
//        this.extra_field[i]=value[0]
//        control.controls[i].addControl('subfield_name',new FormControl(this.extra_field[i].field_value))
//        control.controls[i].addControl('subfield_value',new FormControl(''))
//       }
//       else{
//        value[0].open = false
//         this.extra_field[i]=value[0]
//         this.questionForm.removeControl(this.extra_field[i].field_value);
//         control.controls[i].removeControl(this.extra_field[i].field_value)
//       }
//      }
// }

valueChanges(event,name,i){
  console.log(event,name,i)
  // console.log(typeof(event),event)
  let value:any=[];
  if(typeof(event) == 'object' && event.length >0){
    event.forEach(result=>{
      let child=name.answer_key.filter(val=>val.ans == result.ans)
      console.log(child)
      if(child.length >0){
        value.push(child[0])
      }
    })
  }
  else{
    value=name.answer_key.filter(val=>val.ans == event)
    console.log(value,this.curr_template)
  }
  const control:any= this.questionForm.get('pedagogy_info')
  // console.log("value",value);
  // if(value.length >0){
  //     let sub_field_template
  //     sub_field_template= this.original_template.questions.filter(val=>val.section == value.forEach(res=>{
  //       return res.action
  //     }))
  //     console.log("sub field",sub_field_template)
  // }
 


 
  let sub_field_template
  if(value.length>0){
    control.controls[i].removeControl('sub_field_array')
     sub_field_template= this.original_template.questions.filter(val=>val.section == value.map(action_val=>{
      //  console.log("a",action_val)
      return action_val.action
     }))
    //  sub_field_template
     console.log("sub",sub_field_template)
     control.controls[i].addControl('sub_field_array',this.fb.array([]))
    
     sub_field_template.forEach((res,index)=>{
      let answer_only:any=[]
       console.log('parse',JSON.parse(res.ques_ans_json))
       let cc=JSON.parse(res.ques_ans_json)
      //  if(cc.type != '5'){
       cc.answers.forEach(value=>{
        answer_only.push({'ans':value.ans})
       })
      //  const control=this.questionForm.get('pedagogy_info') as FormArray
      // const india_sales:any=<FormArray> this.businessForm.controls['manufacturing_activity_details']['controls'][0].controls.india_where_sale_done;
      // const sub_control:any=<FormArray>this.questionForm.controls['pedagogy_info']['controls'][i].controls.sub_field_array as FormArray
      let sub_control: any = control.controls[i].get('sub_field_array') as FormArray;
      sub_control.push(this.createSubValue(cc,answer_only))
      //  }
      //  else{
      //    console.log("ente")
      //   let sub_control: any = control.controls[i].get('sub_field_array') as FormArray;
      //   sub_control.push(this.checkBoxArray(cc));
      // }
      //  this.extra_field[i]=value[0]
      // this.extra_field[i].open=true
      //  control.controls[i].addControl('subfield_name'+index,new FormControl(cc.question))
      //  control.controls[i].addControl('subfield_value'+index,new FormControl('',Validators.compose([Validators.required])))
     })

    //  res.ques_ans_json.answers.forEach(val=>{
    //   answer_only.push({'ans':val.ans})
    // })
    //     const control=this.questionForm.get('pedagogy_info') as FormArray
    //     control.push( this.createValue(res.ques_ans_json,answer_only));
     
     console.log("dd",control)
  }

  //for the MultiSelect
  if(typeof(event) == 'object'){
    let data:any=[]
    if(value.length >0){
     value.map(val=>{
        if( val.next_filed == 'freetext' || val.next_filed == 'img'  ){
          data.push(val)
        }
      })
      value=data
    }
  }

  console.log("va",value);
     if(value.length>0){
if(value[0].next_filed == 'freetext'){
// console.log("free text",value)
this.extra_field[i]=value[0]
this.extra_field[i].open=true
this.extra_field[i].placeholder=value[0].Description


control.controls[i].addControl('subfield_name',new FormControl(this.extra_field[i].field_value))
control.controls[i].addControl('subfield_value',new FormControl('',Validators.compose([Validators.required])))
}
else if(value[0].next_filed == 'img'){
value[0].open = true
this.extra_field[i]=value[0]
control.controls[i].addControl('subfield_name',new FormControl(this.extra_field[i].field_value))
control.controls[i].addControl('subfield_value',new FormControl(''))
}
else{
value[0].open = false
this.extra_field[i]=value[0]
control.controls[i].removeControl('subfield_value');
this.questionForm.removeControl(this.extra_field[i].field_value);
control.controls[i].removeControl(this.extra_field[i].field_value)
}
}

// for setting the sub_field value in Edit functionality
// if(this.last_saved_data.hasOwnProperty('pedagogy_info')){
//   console.log(" Entered")
//   // this.setValuefor_Sub_field(this.last_saved_data.pedagogy_info)
//   const pedagogy_info: any = <FormArray>this.questionForm.controls['pedagogy_info'];
//   pedagogy_info.patchValue(this.last_saved_data.pedagogy_info);
// }

}

  createRadio(name){
    let vale=name
    let val= this.fb.group({
      vale : ['']
   });
    const control = <FormArray>this.questionForm.controls.radio;
   control.push(val);
  }
  // continue(){
  //   console.log("this.form",this.questionForm.value)
  //   let records:any=this.questionForm.value
  //  records.pedagogy_info.forEach(res=>{
  //    let temp:any
  //     res.answer_key ? delete res.answer_key : '' // FOR REMOVING THE ANSWER KEY FROM FORMARRAY
  //     res.answer_only ? delete res.answer_only : ''
  //     // if(res.ans.ans){                  //FOR REMVOING THE WASTAGE IN ION-SELECTABLE
  //     //   temp=res.ans.ans
  //     //   delete res.ans
  //     //   res.ans=temp
  //     // }
  //     if(res.ans.length >0 && res.type == 4){ //FOR IONIC SELECTABLE MULTIPLE 
  //       let temp=res.ans.map(val=>val.ans)
  //       res.ans=temp
        
      
      
  //   }
  //   })
  //   console.log("Question",records)
  //   this.navCtrl.setDirection('root')
  //   this.router.navigate(['student-list'])
   
  // }
  // onSubmit(){
  //   console.log("this.form",this.questionForm.value)
  //   let records:any=this.questionForm.value
  //  records.question.forEach(res=>{
  //    let temp:any
  //     res.answer_key ? delete res.answer_key : '' // FOR REMOVING THE ANSWER KEY FROM FORMARRAY
  //     res.answer_only ? delete res.answer_only : ''
  //     // if(res.ans.ans){                  //FOR REMVOING THE WASTAGE IN ION-SELECTABLE
  //     //   temp=res.ans.ans
  //     //   delete res.ans
  //     //   res.ans=temp
  //     // }
  //     if(res.ans.length >0 && res.type == 4){ //FOR IONIC SELECTABLE MULTIPLE 
  //       let temp=res.ans.map(val=>val.ans)
  //       res.ans=temp
  //   }
  //   })
  //   console.log("Question",records)
  //   this.navCtrl.setDirection('root')
  //   this.router.navigate(['student-list'])
  // }
  onCheckboxChange(key,value,isChecked){
    // console.log(key,value,isChecked);
   
    let answer=this.questionForm.controls[key]['controls']
    // console.log("dd",answer)
    if(isChecked){
      answer.push(new FormControl(value));
    }
    else{
      let idx=answer.controls.findIndex(x=>x.value == value)
      answer.removeAt(idx)
    }
  }
  validateAllFormFields(formGroup: FormGroup) {   
    console.log(formGroup)      //{1}
    formGroup.controls.pedagogy_info['controls'].forEach((formArray,index)=>{
  Object.keys(formArray.controls).forEach(field => { 
    // console.log(field) //{2}
    const control = formGroup.controls.pedagogy_info['controls'][index].get(field); 
    // console.log("co",control)            //{3}
    if (control instanceof FormControl) {             //{4}
      control.markAsTouched()
    } else if (control instanceof FormGroup) {        //{5}
      this.validateAllFormFields(control);            //{6}
    }
  })
  if(formArray.controls.sub_field_array){
    formArray.controls.sub_field_array['controls'].forEach((subFormArray,sub_index)=>{
    Object.keys(subFormArray.controls).forEach(field => { 
      console.log(field) //{2}
      const control = formGroup.controls.pedagogy_info['controls'][index].controls.sub_field_array['controls'][sub_index].get(field); 
      console.log("co",control)            //{3}
      if (control instanceof FormControl) {             //{4}
        control.markAsTouched()
      } else if (control instanceof FormGroup) {        //{5}
        this.validateAllFormFields(control);            //{6}
      }
    })
  })
  }
  });
}
  onSubmit(){
    console.log("this.form",this.questionForm.value)
   

    // if(this.plt.is('cordova')){
      if(this.questionForm.invalid){
        this.validateAllFormFields(this.questionForm)
        this.questionForm.markAsDirty();
        this.toast.presentToast("Please Fill all the Fields",'error');
        return
      }
    // }
    let records:any=this.questionForm.value
   records.pedagogy_info.forEach(res=>{
    
      res.answer_key ? delete res.answer_key : '' // FOR REMOVING THE ANSWER KEY FROM FORMARRAY
      res.answer_only ? delete res.answer_only : ''
      // if(res.ans.ans){                  //FOR REMVOING THE WASTAGE IN ION-SELECTABLE
      //   temp=res.ans.ans
      //   delete res.ans
      //   res.ans=temp
      // }
      if(res.ans.length >0 && res.type == 4){ //FOR IONIC SELECTABLE MULTIPLE 
        let temp=res.ans.map(val=>val.ans)
        res.ans=temp
        
      
      
    }
    })
    let navigationExtras:NavigationExtras={
      queryParams:{
        // template_list:value.template_id
        template_list:this.template_id
      }
    }
    // console.log("Question",records)
    this.ionicStorageService.insertData_Replace("learning-outcome",{learning_outcome:records.pedagogy_info})
    //this.navCtrl.setDirection('root')
    // if(this.template_id == 3){
    //   this.router.navigate(['page-route','pedagogy-info'],navigationExtras)
    // }
    // else{
    // this.router.navigate(['page-route','tntp-content'],navigationExtras)
    // }
    this.navCtrl.navigateBack(['page-route','question-template-list'],navigationExtras)
  }

}
