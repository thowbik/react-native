import { Component, OnInit } from "@angular/core";
import { AssessmentmodalComponent } from "src/app/components/assessmentmodal/assessmentmodal.component";
import { ModalController } from "@ionic/angular";
import { ApiService } from "src/app/services/api.service";
import { Router } from "@angular/router";
import { Storage } from "@ionic/storage";
import { IonicStorageService } from "src/app/services/ionic-storage/ionic-storage.service";
import { AlertService } from "src/app/services/alert.service";
import { TranslateService } from "@ngx-translate/core";
import { LoadingService } from "src/app/services/loading.service";
import { log } from "console";

@Component({
  selector: "app-assement-performance",
  templateUrl: "./assement-performance.component.html",
  styleUrls: ["./assement-performance.component.scss"],
})
export class AssementPerformanceComponent implements OnInit {
  public itemIndex: any;
  public isMenuOpen: boolean = false;
  pageName: any = "page1";
  public studentList: any[] = [];
  public tempStudentList: any[] = [];
  studentCount: number = 0;
  isQuestionsDisplayed: boolean = false;
  displayBtn: string = "NEXT";
  public randomQuestionList: any[] = [];
  public questionList: any[] = [];
  public storeDetail: any;
  public answer: any;
  public unitInfo: any;
  public options: any[] = [];
  public optionList: any[] = [];
  public classInfo: any;
  public studentData: any;
  public assessmentAnswers: any[] = [];
  public learningOutcomeData: any;
  public masterApiResponse: any;
  progressValue: number;
  /*-- Language Variables Starts --*/
  public languageType: any;
  public studentAsessment: any;
  public learningOutcome: any;
  public grade: any;
  public subject: any;
  public referAnswer: any;
  public back: any;
  public next: any;
  public submitAssessement: any;
  /*-- Language Variables Ends --*/

  constructor(
    public modalController: ModalController,
    public _storage: Storage,
    public _apiService: ApiService,
    public _router: Router,
    public loading: LoadingService,
    public ionicStore: IonicStorageService,
    public _alertService: AlertService,
    private _translate: TranslateService
  ) {}

  ngOnInit() {
    this.progressValue = Math.round(((9 - 2) / 12) * 100);
    this.appLanguage();
    this.loading.present();
    this.classInfo = localStorage.getItem("classInfo");
    this.classInfo = JSON.parse(this.classInfo);
    //  this.studentList = this._apiService.getAccessedStudents();

    /*  Getting All Details Stored in offlineStorage....*/
    this.ionicStore.getOffStorage().then((response) => {
      this.masterApiResponse = response.records;
    });

    /*  Getting AllPage Entered Info....*/
    this.ionicStore.getStoreData().then((response) => {
      this.storeDetail = response;
      this.storeDetail.pages.currentPage = "stu_Assessment_questions";
      this.ionicStore.setStoreData(this.storeDetail);
      // this.storeDetail.pages.pageData.splice(8);
      // this.ionicStore.setStoreData(this.storeDetail);
      const accessedStudents = this.storeDetail.pages.pageData[7].correctedDetails.studentList.filter(
        (data) => data.accessed == "yes"
      );
      this.tempStudentList = accessedStudents;
      this.studentList = JSON.parse(JSON.stringify(this.tempStudentList));            
      this.unitInfo = this.storeDetail.pages.pageData[6].correctedDetails.unitInfo;
      this.options = this.storeDetail.pages.pageData[6].correctedDetails.unitInfo.options;
      this.questionList = this.storeDetail.pages.pageData[6].correctedDetails.unitInfo.questions;
      this.learningOutcomeData = this.storeDetail.pages.pageData[6].correctedDetails.unitInfo;
      this.getRandomQuestions();
      this.loading.dismiss();

      /*  Registering This Page in Storage ....*/
      if (this.storeDetail.pages.pageData[8] === undefined) {
        let apiData = {
          pageNo: "9",
          pageName: "stu_Assessment_questions",
          apiResponse: {
            records: {
              questionList: this.questionList,
              options: this.options,
              accessedStudents: this.studentList,
            },
          },
          correctedDetails: {
            question_data: [],
          },
        };
        this.storeDetail.pages.pageData[8] = apiData;
        this.ionicStore.setStoreData(this.storeDetail);
      }
    });
  }

  /*  Getting language Info... */

  appLanguage() {
    this._apiService.languageInfo.subscribe((data: any) => {
      this.languageType = data;
      this._translate.use(this.languageType);
      this._initialiseTranslation();
    });
  }

  _initialiseTranslation(): void {
    this._translate.get("studentAsessment").subscribe((res: string) => {
      this.studentAsessment = res;
    });
    this._translate.get("learningOutcome").subscribe((res: string) => {
      this.learningOutcome = res;
    });
    this._translate.get("grade").subscribe((res: string) => {
      this.grade = res;
    });
    this._translate.get("subject").subscribe((res: string) => {
      this.subject = res;
    });
    this._translate.get("referAnswer").subscribe((res: string) => {
      this.referAnswer = res;
    });
    this._translate.get("next").subscribe((res: string) => {
      this.next = res;
    });
    this._translate.get("back").subscribe((res: string) => {
      this.back = res;
    });
    this._translate.get("submitAssessement").subscribe((res: string) => {
      this.submitAssessement = res;
    });
  }

  public toggleAccordion(i) {
    this.isMenuOpen = !this.isMenuOpen;
    this.itemIndex = i;
  }

  /*  Modal Open ....*/
  async openAssessmentModal(refer) {
    const modal = await this.modalController.create({
      component: AssessmentmodalComponent,
      componentProps: {
        viewName: refer,
        questionList: this.studentData.questions,
      },
      cssClass: "my-custom-modal-assessment",
      backdropDismiss: false,
    });
    return await modal.present();
  }

  moveNext() {    
    if (!this.isQuestionsDisplayed) {
      let studentData = this.storeDetail.pages.pageData[8].correctedDetails      
        .question_data.length;
      if (studentData !== this.studentList.length) {
        let randomData = {
          student_emisid: this.studentList[this.studentCount].id,
          student_name: this.studentList[this.studentCount].name,
          questions: this.randomQuestionList,
          options: this.options,
        };        
        let tempQuestionDataSize = this.storeDetail.pages.pageData[8]
          .correctedDetails.question_data.length;
        if (!tempQuestionDataSize) {
          this.storeDetail.pages.pageData[8].correctedDetails.question_data.push(
            randomData
          );
          this.ionicStore.setStoreData(this.storeDetail);
        } else {
          let studentIds = this.storeDetail.pages.pageData[8].correctedDetails.question_data.map(
            (el) => {
              return el.student_emisid;
            }
          );
          if (!studentIds.includes(randomData.student_emisid)) {
            this.storeDetail.pages.pageData[8].correctedDetails.question_data.push(
              randomData
            );
            this.ionicStore.setStoreData(this.storeDetail);
          }
        }
      }

      this.studentData = this.storeDetail.pages.pageData[8].correctedDetails.question_data[
        this.studentCount
      ];
      this.isQuestionsDisplayed = true;
      this.pageName = "page2";
      if (this.studentCount == this.studentList.length - 1) {
        this.displayBtn = "SUBMIT ASSESSMENT";
        this.studentCount = this.studentCount + 1;
      }
    } else if (this.displayBtn == "NEXT") {      
      if (this.studentData.ans !== undefined) {
        if (this.studentCount !== this.studentList.length - 1) {
          this.studentCount = this.studentCount + 1;
          this.getRandomQuestions();
          // this.answer = "";
          let studentData = this.storeDetail.pages.pageData[8].correctedDetails
            .question_data.length;

            let randomData = {
              student_emisid: this.studentList[this.studentCount].id,
              student_name: this.studentList[this.studentCount].name,
              questions: this.randomQuestionList,
              options: this.options,
              ans: "",
            };            
            if (studentData !== this.studentList.length) { 
              if(this.storeDetail.pages.pageData[8].correctedDetails.question_data.some(person => person.student_emisid === randomData.student_emisid)){
                console.log("Already exists");
            } else{
              this.storeDetail.pages.pageData[8].correctedDetails.question_data.push(
                randomData
              );
              this.ionicStore.setStoreData(this.storeDetail);                
            }                                             

          }
          this.studentData = this.storeDetail.pages.pageData[8].correctedDetails.question_data[
            this.studentCount
          ];
          if (this.studentCount == this.studentList.length - 1) {
            this.displayBtn = "SUBMIT ASSESSMENT";
          }
        }
      } else {
        this._alertService.showAlert("Please Select Answer");
      }
    } else {      
      if (this.studentData.ans !== undefined) {
        this.storeDetail.pages.pageData[8][
          "pageDetails"
        ] = this.assessmentAnswers;
        this.storeDetail.pages.currentProgress = this.progressValue;
        this.ionicStore.setStoreData(this.storeDetail);        

        if (this.storeDetail.pages.pageData[5]) {
          this._router.navigate(["/page-route/observation"]);
        } else {
          if (this.storeDetail.pages.pageData[4].correctedDetails.length > 0) {
            this._router.navigate(["/page-route/attendance/student-data"]);
          } else {
            this._router.navigate(["/page-route/observation/endObservation"]);
          }
        }
      } else {
        this._alertService.showAlert("Please Select Answer");
      }
    }
  }

  moveBack() {
    if (this.isQuestionsDisplayed) {
      if (this.displayBtn === "SUBMIT ASSESSMENT") {
        this.studentCount = this.studentCount - 1;
        if (this.studentCount == 0) {
          this.isQuestionsDisplayed = false;
          this.pageName = "page1";
        } else {
          this.studentData = this.storeDetail.pages.pageData[8].correctedDetails.question_data[
            this.studentCount
          ];
        }
        this.displayBtn = "NEXT";
      } else if (this.studentCount !== 0) {
        this.studentCount = this.studentCount - 1;
        this.studentData = this.storeDetail.pages.pageData[8].correctedDetails.question_data[
          this.studentCount
        ];
      } else {
        this.isQuestionsDisplayed = false;
        this.pageName = "page1";
      }      
    } else {
      this._router.navigate(["/page-route/assessment/s-assessment"]);
    }
  }

  getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }

  getRandomQuestions() {
    this.randomQuestionList = [];
    const noOfRandomQues = this.unitInfo.no_of_random_qus;
    for (let i = 0; i < noOfRandomQues; i++) {
      let idx;
      idx = this.getRandomInt(0, this.questionList.length); // This is used to get a random integer value for the question for pick
      // idx = Math.floor(Math.random() * this.questionList.length);
      const found = this.randomQuestionList.some(
        (el) => el === this.questionList[idx]
      );
      if (!found) {
        this.randomQuestionList.push(this.questionList[idx]);
      } else {
        idx = this.getRandomInt(0, this.questionList.length);
        this.randomQuestionList.push(this.questionList[idx]);
      }
    }
  }

  getGrade(emisId) {
    const foundStudent = this.studentList.find((s) => s.id === emisId);

    if (foundStudent) {
      return foundStudent.class_section;
    } else {
      return null;
    }
  }

  /*   Getting the Selected Answer...  */
  selectedAnswer(ans, grade) {
    let questionData = {
      student_emisid: this.studentData.student_emisid,
      student_name: this.studentData.student_name,
      questions: this.studentData.questions,
      grade: grade,
      ans: ans,
    };
    this.assessmentAnswers[this.studentCount] = questionData;
  }

  /*  Rerraging Students If Student was random selected ....*/
  rearrangeStudent(student, indexd) {
    let tempStudents = JSON.parse(JSON.stringify(this.studentList));     
    let filterStudent = tempStudents.filter((data, index) => index >= indexd);    
    //  let filteredIndex = tempStudents.map((data,index)=> index >= indexd ? index : undefined).filter(x => x) ;
    let previousItems = tempStudents.filter(
      (studentInfo) => !filterStudent.includes(previousItems)
    );    
    this.studentList = filterStudent.concat(previousItems);    
    this.moveNext();
  }
}
