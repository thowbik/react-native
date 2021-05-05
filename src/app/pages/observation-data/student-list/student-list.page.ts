import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service'
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { Router, OutletContext, NavigationExtras, ActivatedRoute } from '@angular/router';
import { ModalController, NavController, Events, Platform } from '@ionic/angular';
import { ToastService } from '../../../services/common_Provider/toast-service/toast.service'
import { IonicStorageService } from 'src/app/services/ionic-storage/ionic-storage.service';
import { Storage } from '@ionic/storage'
import { AuthenticationService } from 'src/app/services/auth-service/authentication.service';


@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.page.html',
  styleUrls: ['./student-list.page.scss'],
})
export class StudentListPage implements OnInit {
  studentGrade: FormGroup
  Expanded: boolean = false
  medium: any;
  rate: any
  // studentsListForm:FormGroup
  students_list: any = []
  loadView: boolean = false

  students_data = [{
    name: "Naveen",
    class: 'I'
  },
  {
    name: 'Kumar',
    class: 'I'
  },
  {
    name: 'Rajesh',
    class: 'I'
  },
  {
    name: 'Prakash',
    class: 'I'
  },
  {
    name: 'Anandharaj',
    class: 'I'
  },
  ]
  class_medium: any = ["Tamil", "English", "Maths", "Science", "Social Science"]
  disabledValue: any = []
  GradeDataValue: any = [];
  ratingDescription: any = [];
  gradeListValue: any = [];
  public outcomeListValue: any = [];
  unitListValue: any = [];
  templateQues: any = [];
  curr_template_ques: any;
  all_class_medium: any = [];
  all_unitListValue: any = [];
  all_outcomeListValue: any = [];
  all_template_ques: any = [];
  dynamic_template: boolean = false;
  student_count_chip: any;
  editIndex: any = '';
  template_id: any;


  constructor(private api: ApiService, private fb: FormBuilder, private activateRoute: ActivatedRoute,
    private modalCtrl: ModalController, private navCtrl: NavController,
    private events: Events, private toastService: ToastService,
    private ionicStorageService: IonicStorageService, private ionicStorage: Storage,
    private authService: AuthenticationService, private platform: Platform) {
    // this.dismiss()
    // console.log(this.disabledValue);
    // this.ionicStorageService.getData('school_id').then(school_id=>{
    //   this.api.getStudentsListBySchoolId(school_id).subscribe(res=>{
    //     // this.students_list=res['records'].map(val=>val.student_data)
    //     let class_info:any=localStorage.getItem('classroom_type')
    //     class_info=JSON.parse(class_info)
    //     this.students_list=res['records'].filter(val=>val.class_studying_id == class_info.class && val.class_section == class_info.section)
    //     this.students_list=this.students_list[0].student_data
    //     console.log(this.students_list)
    //   })
    //   this.loadView=true
    // })
    //   this.ionicStorageService.getData('studentlist').then(result=>{
    //     // let class_info:any=localStorage.getItem('classroom_type')
    //     this.ionicStorageService.getData("classroom-type").then(studentlistRes=>{
    //       // console.log("ionic storage",result,studentlistRes);
    //       let class_info:any=studentlistRes
    //         class_info=class_info.classroom_type
    //         this.students_list=result.filter(val=>val.class_studying_id == class_info.class && val.class_section == class_info.section)
    //         // this.students_list=this.students_list[0].student_data
    //         // console.log(this.students_list)
    //   })
    // })
    this.ionicStorageService.getData('student-list').then(result => {
      if (result) {
        this.student_count_chip = result.student_list
        this.GradeDataValue = result.student_list
      }
    })
    this.activateRoute.queryParams.subscribe(params => {
      // console.log('param',params);
      if (params.template_list) {
        this.template_id = JSON.parse(params.template_list)
      }
    })

  }
  // async dismiss() {
  // using the injected ModalController this page
  // can "dismiss" itself and optionally pass back data
  // const modal = await this.modalCtrl.getTop();
  //  modal.dismiss({'data':true},undefined);
  // await this.modalCtrl.dismiss({
  //   'data':true
  // },undefined)
  //this.navCtrl.back()
  // this.navCtrl.setDirection("back")
  //this.router.
  // }

  ngOnInit() {
    this.takeDecision()
    //  this.getLearningOutcomeFromStorage()
    this.studentGrade = this.fb.group({
      student_emis_id: [''],
      student: ['', Validators.compose([Validators.required])],
      medium: ['', Validators.compose([Validators.required])],
      learning_outcome_updated: ['', Validators.compose([Validators.required])],
      // rating:[''],
      // grade:[''],
      // outcome:[''],
      // unit:[''],
      // topic_record:['',Validators.compose([Validators.required])],
      // question_asked1:['',Validators.compose([Validators.required])],
      // answered_correctly1:['',Validators.compose([Validators.required])],
      // remarks1:['',Validators.compose([Validators.required])],
      // question_asked2:['',Validators.compose([Validators.required])],
      // answered_correctly2:['',Validators.compose([Validators.required])],
      // remarks2:['',Validators.compose([Validators.required])],
      // question_asked3:['',Validators.compose([Validators.required])],
      // answered_correctly3:['',Validators.compose([Validators.required])],
      // remarks3:['',Validators.compose([Validators.required])],
      // questions:this.fb.array([])
      // recomend_class_action:['',Validators.compose([Validators.required])],
      // teacher_last_visit:['',Validators.compose([Validators.required])]
    })
    // let value=localStorage.getItem('school_id')

    // this.api.getStudentsList().subscribe(res=>{
    // this.students_list=res
    // this.students_list.forEach(res=>{
    // this.studentsListForm=this.fb.group({
    //   // students_list:[this.students_list],
    //   subject:['']
    // })
    // res.subject=''
    //  this.studentsListForm.addControl('student_list',new FormControl(res))
    //  this.studentsListForm.addControl('subject',new FormControl(''))
    // this.createArrayValue(res)
    // const control=this.studentsListForm.get('student_data') as FormArray
    // control.push(this.createArrayValue(res))

    // })

    // })
    // this.ionicStorageService.getData("disable_student").then(res=>{
    //   console.log(res);
    //   this.disabledValue=res;
    // })
    this.events.subscribe('student-rating', (data) => {
      // let GradeDataValue=[]
      if (data) {
        this.GradeDataValue = data
        // console.log("grade data",this.GradeDataValue)
        // this.GradeDataValue.push(this.studentGrade.value);
      }
    })

    this.events.subscribe('disable_student', (res) => {
      if (res) {
        this.disabledValue = res
        console.log("disable data", res)
      }
    })
    // console.log("dd",this.studentsListForm.value)
  }

  takeDecision() {

    this.ionicStorageService.getData('learning_outcome').then(outcome_value => {
      if (outcome_value) {
        if (outcome_value.toUpperCase() == 'YES') {
          this.getLearningOutcomeFromStorage()

          this.ionicStorageService.getData('learningoutcomeques').then(res => {
            if (res) {
              this.ionicStorageService.getData('classroom-type').then(class_value => {
                class_value = class_value.classroom_type
                // console.log("class",class_value)
                if (class_value.hasOwnProperty('class')) {
                  class_value = class_value.class
                }
                else {
                  class_value = class_value.class_observed
                }
                console.log("class", class_value)
                this.templateQues = res
                console.log("class", this.templateQues)
                this.templateQues = this.templateQues.filter(ques_filter => ques_filter.grade == class_value)
                // console.log("dd",JSON.parse(this.templateQues[10].questions[0].ques_ans_json));
                this.all_template_ques = this.templateQues
                console.log("fresh", this.all_template_ques)
                if (this.templateQues.length > 0) {

                  // this.gradeListValue=res.map(val=>val.grade)

                  //   this.gradeListValue=this.gradeListValue.filter((elem, i, arr) => {
                  //   if (arr.indexOf(elem) === i) {
                  //     return elem
                  //   }
                  // })

                  //   let temp=this.gradeListValue
                  //   this.gradeListValue=[]
                  //  temp.forEach((val,index)=>{
                  //   this.gradeListValue.push({id:index+1,name:val})
                  //   })
                  // res.forEach((val,index)=>{
                  //   this.outcomeListValue.push({id:val.learning_outcome_id,name:val.learning_outcome})
                  //   this.unitListValue.push({id:index+1,name:val.unit})
                  //   this.class_medium.push({id:index+1,name:val.subject})
                  // })
                  // this.outcomeListValue=res.map(val=>val.learning_outcome)
                  // this.unitListValue=res.map(val=>val.unit)

                  // this.class_medium=res.map(val=>val.subject)

                  // this.outcomeListValue=this.outcomeListValue.filter((elem,i,arr)=>{

                  //   if(arr.indexOf(elem) === i){
                  //     return elem
                  //   }
                  // })
                  // this.unitListValue=this.unitListValue.filter((elem,i,arr)=>{

                  //   if(arr.indexOf(elem) === i){
                  //     return elem
                  //   }
                  // })
                  // this.class_medium=this.class_medium.filter((elem,i,arr)=>{
                  //   if(arr.indexOf(elem) === i){
                  //     return elem
                  //   }
                  // })

                  // this.all_class_medium=this.class_medium
                  // this.all_unitListValue=this.unitListValue
                  // this.all_outcomeListValue=this.outcomeListValue
                  // this.dynamicTemplate('yes')
                  this.dynamic_template = true
                  // this.outcomeListValue=res.map(val=>val.learning_outcome)
                  // this.unitListValue=res.map(val=>val.unit)
                  console.log(this.gradeListValue, this.outcomeListValue, this.unitListValue)
                }
                else {
                  this.dynamicTemplate('no')
                  this.dynamic_template = false
                }
              })
            }
          })
        }
        else {
          this.dynamicTemplate('no')
          this.dynamic_template = false
        }
      }
      else {
        this.dynamicTemplate('no')
        this.dynamic_template = false
      }
    })
  }

  getLearningOutcomeFromStorage() {
    this.ionicStorageService.getData('learningoutcomeques').then(res => {
      if (res) {
        this.templateQues = res
        // console.log(res)
        this.gradeListValue = res.map(val => val.grade)

        this.gradeListValue = this.gradeListValue.filter((elem, i, arr) => {
          if (arr.indexOf(elem) === i) {
            return elem
          }
        })

        let temp = this.gradeListValue
        this.gradeListValue = []
        temp.forEach((val, index) => {
          this.gradeListValue.push({ id: index + 1, name: val })
        })
        res.forEach((val, index) => {
          // this.outcomeListValue.push({id:val.learning_outcome_id,name:val.learning_outcome})
          // this.unitListValue.push({id:index+1,name:val.unit})
        })
        // this.outcomeListValue=res.map(val=>val.learning_outcome)
        // this.unitListValue=res.map(val=>val.unit)
        console.log(this.gradeListValue, this.outcomeListValue, this.unitListValue)
      }
    })
  }
  createArrayValue(value) {
    // console.log("value",value)
    return this.fb.group({
      // student_list:[value],
      name: [value.name],
      expanded: [true],
      roll: [value.roll],
      subject: ['e']
    })
  }
  ExpandItem() {
    // if(this.students_list[i].Expanded){
    // console.log(this.medium)
    // console.log("e",this.studentsListForm.get('student_data'))
    // this.studentsListForm.get('student_data').value[i].Expanded= !this.studentsListForm.get('student_data').value[i].Expanded
    this.Expanded = !this.Expanded
    // }
  }
  // submit(value,index){
  //   if(this.medium == undefined){
  //     this.students_list[index].Expanded=!this.students_list[index].Expanded
  //   }
  //   console.log(index,value)
  // }
  onSubmit() {
    // console.log("student grade form",this.studentGrade.value)
    if (this.GradeDataValue.length == 0 || !this.GradeDataValue) {
      this.toastService.presentToast("Atleast One Assessment is required", "warning");
      return
    }
    // this.toastService.presentToast('Record Saved Successfully','')
    this.ionicStorageService.insertData_Replace("student-list", { student_list: this.GradeDataValue })

    //   let records=[]

    //   let tokenData=this.authService.getTokenDetails()
    //   let emis_username=tokenData.emis_username

    //   records.push({emis_username:emis_username})

    //   this.ionicStorage.forEach((value,key,index)=>{
    //     // console.log("st",index,key,value)
    //     if(key != "studentListBy_school_id" && key != "teacherListBy_school_id" && key != "currentSchool_id" ){
    //     records.push(value)
    //     }
    //     console.log("index",index)
    //     if(index == 9){
    //       console.log("curr index",index)
    //     //  console.log("string",JSON.stringify({records:records}))
    //     this.api.saveObservation(records).subscribe(res=>{
    //       if(res['dataStatus']){
    //         this.toastService.presentToast("Record Saved Successfully","success");
    //       
    //       }
    //       else{
    //         this.toastService.presentToast("Something went wrong","error");
    //       }
    //     },err=>{
    //       this.toastService.presentToast("Error:"+err,'error');
    //     })
    //     }
    //   })
    //   console.log("ksdfj",{records:records})
    // //  this.api.saveObservation(records).subscribe(res=>{
    //    if(res['dataStatus']){
    //      this.toastService.presentToast("Record Saved Successfully","success");
    //      this.router.navigate(['page-route'])
    //    }
    //    else{
    //      this.toastService.presentToast("Something went wrong","error");
    //    }
    //  },err=>{
    //    this.toastService.presentToast("Error:"+err,'error');
    //  })
    // console.log("string",JSON.stringify(dd))


    // console.log("dd",this.ionicStorageService.loopData(''))
    //  this.router.navigate(['page-route'])
    let navigationExtras: NavigationExtras = {
      queryParams: {
        // template_list:value.template_id
        template_list: this.template_id
      }
    }
    // this.router.navigate(['page-route','student-assesment'])
    this.navCtrl.navigateBack(['page-route', 'question-template-list'], navigationExtras)
  }
  continue() {
    if (this.studentGrade.invalid) {
      if (this.platform.is('cordova')) {
        this.toastService.presentToast("Some Data is missing", 'error')
        return
      }
    }
    if (this.GradeDataValue.length >= 5 && this.students_data.length >= 5) {
      // alert("sorry !! You have already taken the assessment for 5 Student. Kindly Submit the value")
      this.toastService.presentToast("You have already taken the assessment for 5 Student. Kindly Submit the Records", 'danger')
      // console.log("Limit exceeded")
      return;
    }
    else if (this.students_data.length == this.GradeDataValue.length) {
      this.toastService.presentToast("You have finished all the Students Assessment in a class. Submit the Records", 'secondary.tint');
      return;
    }

    if (this.GradeDataValue.length > 0) {
      // this.GradeDataValue.disableStudent=this.studentGrade.value.student
      // this.GradeDataValue.push(this.studentGrade.value)
      // let key="questions"+this.GradeDataValue.length+1
      // let value=this.studentGrade.value.questions
      // value.student=this.studentGrade.value.student
      // value.student_emis_id=this.studentGrade.value.student_emis_id;
      console.log("edit ", this.GradeDataValue)
      if (this.editIndex === '') {
        console.log("entered", this.editIndex)
        this.GradeDataValue.push(this.studentGrade.value)
        this.disabledValue.push(this.studentGrade.value.student);
      }
      else {
        this.GradeDataValue[this.editIndex] = this.studentGrade.value
        this.disabledValue[this.editIndex] = this.studentGrade.value.student

      }
      // this.ionicStorageService.insertData_noReplace("disable_student",this.studentGrade.value.student)
    }
    else {
      // this.GradeDataValue.disableStudent=this.studentGrade.value.student
      this.GradeDataValue = [this.studentGrade.value]
      // this.ionicStorageService.insertData_noReplace("disable_student",this.studentGrade.value.student)
      this.disabledValue = [this.studentGrade.value.student]
    }
    // console.log(this.disabledValue)
    // this.students_data.forEach((Res,index)=>{
    //   if(Res.name == this.studentGrade.value.student){
    //    this.students_data[index]['stu_disable']=true
    //   }
    // })

    // console.log("dn",this.students_data);
    this.events.publish('disable_student', this.disabledValue)
    this.events.publish('student-rating', this.GradeDataValue);
    if (this.editIndex !== '') {
      this.toastService.presentToast("Updated Successfully", '')
    }
    else {
      this.toastService.presentToast((this.GradeDataValue.length) + " Student assessment completed", '')
    }
    if (this.GradeDataValue.length == 5) {
      this.onSubmit()
    }
    else {
      this.studentGrade.removeControl('questions')
      this.studentGrade.reset();
      this.ratingDescription = []
      this.ngOnInit();
      // this.studentGrade.controls['learning_outcome_updated'].setValue('');
      // this.studentGrade.controls['student'].setValue('')
      // this.studentGrade.controls['student_emis_id'].setValue('')
    }
    this.editIndex = ''
  }
  onRateChange(value) {
    // console.log(value)
    switch (value) {
      case 1:
        this.ratingDescription.value = 'Poor'
        this.ratingDescription.color = '#f04141'
        break;
      case 2:
        this.ratingDescription.value = 'Below Average'
        this.ratingDescription.color = '#fc886b'
        break;
      case 3:
        this.ratingDescription.value = 'Average'
        this.ratingDescription.color = '#ff9100'
        break;
      case 4:
        this.ratingDescription.value = 'Good'
        this.ratingDescription.color = '#0bb8cc'
        break;
      case 5:
        this.ratingDescription.value = 'Excellent'
        this.ratingDescription.color = '#0ec254'
    }


  }
  dynamicTemplate(option) {
    console.log("dynamic", option)
    if (option == 'no') {
      this.studentGrade.removeControl('questions')
      this.studentGrade.addControl('questions', this.fb.array([]))
      this.studentGrade.updateValueAndValidity();
      const control = <FormArray>this.studentGrade.get('questions')
      control.push(this.createNoTemplate());
      this.studentGrade.controls['learning_outcome_updated'].setValue('no')
      console.log("form c", this.studentGrade.value)
    }
    else {
      // this.studentGrade.removeControl('questions')
      // this.studentGrade.addControl('questions',this.fb.ardynamicControlGenerationray([]))
      // this.studentGrade.addControl('medium',new FormControl(''))
      // this.studentGrade.addControl('unit',new FormControl(''))
      // this.studentGrade.addControl('outcome',new FormControl(''))
      // this.studentGrade.addControl('student',new FormControl(''))
      // this.studentGrade.addControl('student_emis_id',new FormControl(''))
    }
  }

  dynamicControlGeneration() {

    // let grade=this.studentGrade.value.grade
    let outcome = this.studentGrade.value.outcome;
    let unit = this.studentGrade.value.unit
    let subject = this.studentGrade.value.medium
    if (outcome != '' && unit != '' && subject != '') {
      // this.studentGrade.removeControl('questions')
      // console.log(outcome,unit,subject.toUpperCase())
      console.log("template Ques", this.all_template_ques)
      this.curr_template_ques = []
      this.curr_template_ques = this.templateQues.filter(val => val.learning_outcome == outcome && val.unit == unit && val.subject == subject)
      console.log(this.curr_template_ques)
      if (this.curr_template_ques.length > 0) {
        this.studentGrade.removeControl('questions')
        this.studentGrade.addControl('questions', this.fb.array([]))
        this.assignDataAndControl();
      }
      else {
        // this.toastService.presentToast("No Template available for the selected subject",'error')
      }
    }
  }

  assignDataAndControl() {
    this.studentGrade.controls['learning_outcome_updated'].setValue('yes')

    let temp = this.curr_template_ques
    console.log("temp", temp)
    this.curr_template_ques = temp[0].questions

    this.curr_template_ques.forEach(res => {
      console.log("Dd", typeof (res.ques_ans_json));

      if (typeof (res.ques_ans_json) == 'string') {

        let temp = JSON.parse(res.ques_ans_json)
        res.ques_ans_json = temp
      }
    })


    // this.ques=this.curr_template

    this.curr_template_ques.forEach((res, index) => {
      console.log("ee", res)
      let answer_only: any = [];
      // console.log("res.ques_ans_json",res.ques_ans_json.type)
      if (res.ques_ans_json.type != '5') {

        res.ques_ans_json.answers.forEach(val => {
          answer_only.push({ 'ans': val.ans })
        })
        const control = <FormArray>this.studentGrade.controls['questions']
        control.push(this.createValue(res.ques_ans_json, answer_only));

      }
      else {

        const control = <FormArray>this.studentGrade.controls['questions']
        control.push(this.checkBoxArray(res.ques_ans_json));

      }

    })

  }
  createValue(res, answer_only): FormGroup {
    if (res.hasOwnProperty('showcount')) {
      console.log("w", res)
      let temp = res.question
      res.question = []
      let ques_length = temp.length
      for (let i = 0; i < res.showcount; i++) {
        let random_num = Math.floor(Math.random() * (ques_length - 1)) + 0
        console.log("ran", random_num)
        res.question.push(temp[random_num])
      }
      console.log("Value from createValue", res.question)
    }
    return this.fb.group({
      //   medium:[''],
      //   outcome:[''],
      // unit:[''],
      ans: ['', Validators.compose([Validators.required])],
      ques: [res.question],
      answer_only: [answer_only],
      type: [res.type],
      answer_key: [res.answers],
      showcount: [res.hasOwnProperty('showcount') ? res.showcount : ''],
      title: [res.hasOwnProperty('title') ? res.title : '']
    })
  }
  checkBoxArray(res) {
    return this.fb.group({
      //   medium:[''],
      //   outcome:[''],
      // unit:[''],
      ques: [res.question],
      // key:[res.key],
      type: [res.type],
      answer_key: [res.answers],
      ans: this.fb.array([])
    }
    )
  }

  changeOptions(option, value) {
    console.log("grade", option, value);

    if (option == 'medium') {

      console.log("medium")
      if (this.dynamic_template) {
        let check_category = this.templateQues.filter(result => result.subject.toUpperCase() == value.toUpperCase())
        if (check_category.length > 0) {
          this.studentGrade.removeControl('questions')
          this.studentGrade.addControl('questions', this.fb.array([]))
          // this.studentGrade.addControl('medium',new FormControl(''))
          this.studentGrade.addControl('unit', new FormControl(''))
          this.studentGrade.addControl('outcome', new FormControl(''))
        }
        else {
          this.studentGrade.removeControl('questions')
          // this.studentGrade.addControl('questions',this.fb.array([]))
          // this.studentGrade.addControl('medium',new FormControl(''))
          this.studentGrade.removeControl('unit')
          this.studentGrade.removeControl('outcome')
          this.dynamicTemplate('no')
          return;
        }
        console.log("chekc category", check_category)
        this.outcomeListValue = []
        this.unitListValue = []
        this.outcomeListValue.length = 0
        this.templateQues.forEach((val, index) => {
          if (val.subject == value) {
            // console.log("vv",val)
            // this.outcomeListValue.filter(result=>result == val.learning_outcome).length >0 ?'' :this.outcomeListValue.push(val.learning_outcome)
            this.unitListValue.filter(result => result == val.unit).length > 0 ? '' : this.unitListValue.push(val.unit)
          }
        })
      }
    }
    if (option == 'outcome') {
      // this.class_medium=[]
      this.unitListValue = []
      this.templateQues.forEach((val, index) => {
        if (val.learning_outcome == value) {
          // this.class_medium.filter(result=>result == val.subject).length >0 ?'' :this.class_medium.push(val.subject)
          this.unitListValue.filter(result => result == val.unit).length > 0 ? '' : this.unitListValue.push(val.unit)
        }
      })
    }
    if (option == 'unit') {
      this.outcomeListValue = []
      // this.class_medium=[]
      this.templateQues.forEach((val, index) => {
        if (val.unit == value) {
          console.log("dd", value)
          // this.class_medium.filter(result=>result == val.subject).length >0 ?'' :this.class_medium.push(val.subject)
          this.outcomeListValue.filter(result => result == val.learning_outcome).length > 0 ? '' : this.outcomeListValue.push(val.learning_outcome)

        }
      })
      console.log(this.outcomeListValue)
    }
  }
  createNoTemplate(): FormGroup {
    return this.fb.group({
      // student_emis_id:[''],
      // student:[''],
      topic_record: ['', Validators.compose([Validators.required])],
      question_asked1: ['', Validators.compose([Validators.required])],
      answered_correctly1: ['', Validators.compose([Validators.required])],
      // remarks1:['',Validators.compose([Validators.required])],
      question_asked2: ['', Validators.compose([Validators.required])],
      answered_correctly2: ['', Validators.compose([Validators.required])],
      // remarks2:['',Validators.compose([Validators.required])],
      question_asked3: ['', Validators.compose([Validators.required])],
      answered_correctly3: ['', Validators.compose([Validators.required])],
      // remarks3:['',Validators.compose([Validators.required])],
    })
  }
  SelectedOption(value, i) {
    this.editIndex = i
    console.log(value, i)
    let current_array = this.student_count_chip[i]
    this.student_count_chip[i].is_selected = true
    console.log(current_array)
    if (current_array.learning_outcome_updated == 'no') {

      this.studentGrade.patchValue(current_array)
    }
    else {
      this.studentGrade.controls['medium'].setValue(current_array.medium)
      this.changeOptions('medium', current_array.medium)
      this.studentGrade.controls['unit'].setValue(current_array.unit)
      this.changeOptions('unit', current_array.unit)
      this.studentGrade.controls['outcome'].setValue(current_array.outcome)
      this.changeOptions('outcome', current_array.outcome)
      // this.changeOptions('medium',current_array.medium)

      // this.changeOptions('outcome',current_array.outcome)
      this.dynamicControlGeneration()
      setTimeout(() => {
        this.studentGrade.patchValue(current_array)
      })
    }
  }

}