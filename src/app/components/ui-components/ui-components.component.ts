import { Component, OnInit, Input, Output } from "@angular/core";
import { FormGroup, FormBuilder, FormControl, FormArray } from "@angular/forms";
import { ApiService } from "src/app/services/api.service";
import { EventEmitter } from "@angular/core";
import { LoadingController } from "@ionic/angular";
import { Router } from "@angular/router";
// import {} from '@ionic-native/'

@Component({
  selector: "app-ui-components",
  templateUrl: "./ui-components.component.html",
  styleUrls: ["./ui-components.component.scss"],
})
export class UiComponentsComponent implements OnInit {
  txt: string;
  ques: any;
  quesValue: any;
  extra_field: any = [];
  extra_img: any = [];
  @Input("ques_response") myQuesResp;
  // @Output ()someevent=new EventEmitter();
  @Output() someEvent = new EventEmitter();
  questionForm: FormGroup;
  inputRadio: boolean = false;
  selectValue: any = [];
  // open: boolean=false;
  loading;

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private loadingCtrl: LoadingController,
    private router: Router
  ) {
    this.extra_field = [];
  }

  ngOnInit() {
    this.presentLoading();
    this.questionForm = this.fb.group({
      // ques1:[''],
      question: this.fb.array([]),
    });
    this.getQuestions();
    this.txt = this.myQuesResp;
  }
  ngAfterViewInit() {}
  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      message: "",
      duration: 1000,
    });
    return await this.loading.present();
  }

  getQuestions() {
    // this.presentLoading()
    this.api.getQuestions().subscribe((response) => {
      // load.dismiss()

      this.ques = response;
      if (typeof response != "object") {
        this.ques = JSON.parse(this.ques);
      }

      this.ques.forEach((res, index) => {
        let answer_only: any = [];
        if (res.type != "5") {
          res.answers.forEach((val) => {
            answer_only.push({ ans: val.ans });
          });
          const control = this.questionForm.get("question") as FormArray;
          control.push(this.createValue(res, answer_only));
        } else {
          // const control=this.questionForm.get('question') as FormArray
          // const val=this.fb.group({
          //   ans:this.fb.array([this.checkBoxArray(res)])
          // })
          // control.push(val);
          const control = this.questionForm.get("question") as FormArray;
          control.push(this.checkBoxArray(res));
          console.log("for", this.questionForm.value);
          // control=control.controls[index]
          // control.push( this.createValue(res));
        }
        // if(res.type == '3'){
        //   // this.getIonSelectValue(res,index);
        // }
        console.log("form", this.questionForm.get("question") as FormArray);
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
        let nae = res.key;
      });
      // this.loading.dismiss();
    });
  }
  // getIonSelectValue(val,index){
  //   console.log(val)
  //   val.forEach(res=>{
  //     console.log(res)
  //     this.selectValue=res
  //   })
  //   console.log("ths.sele",this.selectValue)
  //   return this.selectValue
  // }
  checkBoxArray(res) {
    return this.fb.group({
      ques: [res.question],
      // key:[res.key],
      type: [res.type],
      answer_key: [res.answers],
      ans: this.fb.array([]),
    });
  }
  onChange(value, isChecked, index) {
    console.log(value, isChecked, index);
    console.log("q", this.questionForm.controls["question"]);
    const answers = <FormArray>(
      this.questionForm.controls["question"]["controls"][index].controls.ans
    );

    if (isChecked) {
      answers.push(new FormControl(value));
    } else {
      let idx = answers.controls.findIndex((x) => x.value == value);
      answers.removeAt(idx);
    }
  }
  createValue(res, answer_only): FormGroup {
    // let temp=res.answers.map(res=>res.ans)
    return this.fb.group({
      ans: [""],
      ques: [res.question],
      answer_only: [answer_only],
      type: [res.type],
      answer_key: [res.answers],
    });
  }
  valueChanges(event, name, i) {
    console.log(event, name, i);
    let value;
    value = name.answer_key.filter((val) => val.ans == event);
    console.log(value);
    const control: any = this.questionForm.get("question");
    if (value.length > 0) {
      if (value[0].next_filed == "freetext") {
        console.log("free text", value);
        // value[0].open = true
        this.extra_field[i] = value[0];
        this.extra_field[i].open = true;
        //  this.questionForm.addControl(this.extra_field[i].field_value,new FormControl(''));

        control.controls[i].addControl(
          "subfield_name",
          new FormControl(this.extra_field[i].field_value)
        );
        control.controls[i].addControl("subfield_value", new FormControl(""));
      } else if (value[0].next_filed == "img") {
        value[0].open = true;
        this.extra_field[i] = value[0];
        // this.questionForm.addControl(this.extra_field[i].field_value,new FormControl(''));
        // control.controls[i].addControl(this.extra_field[i].field_value,new FormControl(''))
        control.controls[i].addControl(
          "subfield_name",
          new FormControl(this.extra_field[i].field_value)
        );
        control.controls[i].addControl("subfield_value", new FormControl(""));
      } else {
        value[0].open = false;
        this.extra_field[i] = value[0];
        this.questionForm.removeControl(this.extra_field[i].field_value);
        control.controls[i].removeControl(this.extra_field[i].field_value);
      }
      // // this.open=true

      console.log("extra Field", this.extra_field);
    }

    // this.inputRadio=true;
    console.log("Form Values", this.questionForm.value);
  }
  createRadio(name) {
    let vale = name;
    let val = this.fb.group({
      vale: [""],
    });
    const control = <FormArray>this.questionForm.controls.radio;
    control.push(val);
    // const control=<FormArray>this.questionForm.controls.radio[0].controls
    // control.push(val);
  }
  onSubmit() {
    console.log("this.form", this.questionForm.value);
    let records: any = this.questionForm.value;
    records.question.forEach((res) => {
      let temp: any;
      res.answer_key ? delete res.answer_key : ""; // FOR REMOVING THE ANSWER KEY FROM FORMARRAY
      res.answer_only ? delete res.answer_only : "";
      // if(res.ans.ans){                  //FOR REMVOING THE WASTAGE IN ION-SELECTABLE
      //   temp=res.ans.ans
      //   delete res.ans
      //   res.ans=temp
      // }
      if (res.ans.length > 0 && res.type == 4) {
        //FOR IONIC SELECTABLE MULTIPLE
        let temp = res.ans.map((val) => val.ans);
        res.ans = temp;
      }
    });
    console.log("Question", records);
    this.router.navigate([""]);
    // this.api.saveQuestion(this.questionForm.value).subscribe(response=>{
    //   console.log(response);
    // })
  }
  onCheckboxChange(key, value, isChecked) {
    console.log(key, value, isChecked);

    let answer = this.questionForm.controls[key]["controls"];
    console.log("dd", answer);
    if (isChecked) {
      answer.push(new FormControl(value));
    } else {
      let idx = answer.controls.findIndex((x) => x.value == value);
      answer.removeAt(idx);
    }
  }
  sendData() {
    console.log("this.form", this.questionForm.value);
    let records: any = this.questionForm.value;
    records.question.forEach((res) => {
      let temp: any;
      res.answer_key ? delete res.answer_key : ""; // FOR REMOVING THE ANSWER KEY FROM FORMARRAY
      res.answer_only ? delete res.answer_only : "";
      // if(res.ans.ans){                  //FOR REMVOING THE WASTAGE IN ION-SELECTABLE
      //   temp=res.ans.ans
      //   delete res.ans
      //   res.ans=temp
      // }
      if (res.ans.length > 0 && res.type == 4) {
        //FOR IONIC SELECTABLE MULTIPLE
        let temp = res.ans.map((val) => val.ans);
        res.ans = temp;
      }
    });
    console.log("Question", records);
    this.someEvent.emit(records);
  }
}
