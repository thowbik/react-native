import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { AssessmentmodalComponent } from "src/app/components/assessmentmodal/assessmentmodal.component";
import { Router } from "@angular/router";
import { ApiService } from "src/app/services/api.service";
import { Storage } from "@ionic/storage";
import { IonicStorageService } from "src/app/services/ionic-storage/ionic-storage.service";
import { TranslateService } from "@ngx-translate/core";
import { AlertService } from "src/app/services/alert.service";

@Component({
  selector: "app-assessment",
  templateUrl: "./assessment.page.html",
  styleUrls: ["./assessment.page.scss"],
})
export class AssessmentPage implements OnInit {
  selectedStandard: any;
  storeDetail: any;
  classDetail: any;
  termList: any[] = [];
  chapterList: any[] = [];
  showUnit: boolean = false;
  public unitInfo: any;
  public btnDisabled: boolean = true;
  public masterApiResponse: any;

  @Input()
  name: string;

  @Input()
  description: string;

  @Input()
  image: string;
  selectedTerm: string;
  selectedChapter: string;
  progressValue: number;

  @Output()
  change: EventEmitter<string> = new EventEmitter<string>();
  public itemIndex: any;
  public isMenuOpen: boolean = false;

  /*-- Language Variables Starts --*/
  public languageType: any;
  public studentAsessment: any;
  public assessment_Info: any;
  public proceedAssess: any;
  public standard: any;
  public subject: any;
  public selectTerm: any;
  public SelectUnit: any;
  public testingStudents: any;
  public Unit: any;
  public learningOutcome: any;
  public noQuestions: any;
  public noUnit: any;
  public back: any;
  public next: any;

  /*-- Language Variables Ends --*/

  constructor(
    public modalController: ModalController,
    public _storage: Storage,
    public _router: Router,
    public apiService: ApiService,
    public _alertService: AlertService,
    private _translate: TranslateService,
    public ionicStore: IonicStorageService
  ) {}

  ngOnInit() {
    this.progressValue = Math.round(((7 - 2) / 12) * 100);
    this.appLanguage();
    // this.selectedStandard=this.apiService.getSelectedStandard();
    this.classDetail = localStorage.getItem("classInfo");
    this.classDetail = this.classDetail.replace(/'/g, '"');
    this.classDetail = JSON.parse(this.classDetail);

    /*  Getting All Details Stored in offlineStorage....*/
    this.ionicStore.getOffStorage().then((response) => {
      this.masterApiResponse = response.records;

      /*  Getting AllPage Entered Info....*/
      this.ionicStore.getStoreData().then((response) => {
        this.storeDetail = response;
        this.storeDetail.pages.currentPage = "stu_Assessment_term";
        // this.storeDetail.pages.pageData.splice(6);
        this.ionicStore.setStoreData(this.storeDetail);

        /*  Check This Page is Registered or Not, If 'Registered' move to 'else' part...  */
        if (this.storeDetail.pages.pageData[6] === undefined) {
          this.getTermList();
        } else {
          this.termList = this.storeDetail.pages.pageData[6].apiResponse.records.termList;
          if (
            this.storeDetail.pages.pageData[6].apiResponse.records
              .chapterList != undefined
          ) {
            this.chapterList = this.storeDetail.pages.pageData[6].apiResponse.records.chapterList;
          }
          if (
            this.storeDetail.pages.pageData[6].correctedDetails != undefined
          ) {
            this.selectedTerm = this.storeDetail.pages.pageData[6].correctedDetails.term_id;
            this.selectedChapter = this.storeDetail.pages.pageData[6].correctedDetails.chapter_id;
            this.unitInfo = this.storeDetail.pages.pageData[6].correctedDetails.unitInfo;
            this.showUnit = this.storeDetail.pages.pageData[6].correctedDetails.showUnit;
            this.btnDisabled = false;
          } else {
          }
        }
      });
    });

    // this.getTermList();
    // this.termList= this.apiService.getTermList();
  }

  /*  Getting language Info... */

  appLanguage() {
    this.apiService.languageInfo.subscribe((data: any) => {
      this.languageType = data;
      this._translate.use(this.languageType);
      this._initialiseTranslation();
    });
  }

  _initialiseTranslation(): void {
    this._translate.get("studentAsessment").subscribe((res: string) => {
      this.studentAsessment = res;
    });
    this._translate.get("assessment_Info").subscribe((res: string) => {
      this.assessment_Info = res;
    });
    this._translate.get("proceedAssess").subscribe((res: string) => {
      this.proceedAssess = res;
    });
    this._translate.get("standard").subscribe((res: string) => {
      this.standard = res;
    });
    this._translate.get("subject").subscribe((res: string) => {
      this.subject = res;
    });
    this._translate.get("selectTerm").subscribe((res: string) => {
      this.selectTerm = res;
    });
    this._translate.get("SelectUnit").subscribe((res: string) => {
      this.SelectUnit = res;
    });
    this._translate.get("testingStudents").subscribe((res: string) => {
      this.testingStudents = res;
    });
    this._translate.get("noUnit").subscribe((res: string) => {
      this.noUnit = res;
    });
    this._translate.get("Unit").subscribe((res: string) => {
      this.Unit = res;
    });
    this._translate.get("learningOutcome").subscribe((res: string) => {
      this.learningOutcome = res;
    });
    this._translate.get("noQuestions").subscribe((res: string) => {
      this.noQuestions = res;
    });
    this._translate.get("next").subscribe((res: string) => {
      this.next = res;
    });
    this._translate.get("back").subscribe((res: string) => {
      this.back = res;
    });
  }

  public getTermList = () => {
    // this.apiService.getAllTermList()
    //   .subscribe((response: any) => {
    let termList = this.masterApiResponse.term;
    let records = {
      term: termList,
    };
    this.termList = records.term;

    /*  Registering This Page in Storage ....*/
    let apiData = {
      pageNo: "7",
      pageName: "stu_Assessment_term",
      apiResponse: {
        records: {
          termList: this.termList,
        },
      },
    };
    this.storeDetail.pages.pageData[6] = apiData;
    this.ionicStore.setStoreData(this.storeDetail);
    // }, (error: any) => {
    // });
  };

  public toggleAccordion(i) {
    this.isMenuOpen = !this.isMenuOpen;
    this.itemIndex = i;
  }

  public broadcastName(name: string) {
    this.change.emit(name);
  }

  public mySelectHandlerChapter(selectedValue) {
    this.selectedChapter = selectedValue;
    let chapterDetail = {
      chapter_id: selectedValue,
    };

    let allChaptersList = this.masterApiResponse.QuestionData.learning_outcome;
    let allAssessmentQuestions = this.masterApiResponse.QuestionData
      .questions_ans;
    let selectedAssessementQuestions = [];
    let optionList = [];
    let termChapterList = allChaptersList.filter(
      (data) => data.chapter_id === chapterDetail.chapter_id
    );

    let tempLearningOutcome =
      termChapterList[Math.floor(Math.random() * termChapterList.length)];

    selectedAssessementQuestions = allAssessmentQuestions.filter(
      (data) => data.lo_id === tempLearningOutcome.lo_id
    );

    if (!selectedAssessementQuestions.length) {
      this._alertService.showAlert(this.noQuestions);
    }

    Object.entries(tempLearningOutcome).forEach(([key, value]) => {
      let keyName = key.split("_", 1);
      if (keyName.toString() === "option") {
        let keyid = key.split("_")[1];
        let optionData = {
          id: keyid,
          option: value,
        };
        optionList.push(optionData);
      }
    });

    Object.entries(tempLearningOutcome).forEach(([key, value]) => {
      let keyName = key.split("_", 1);
      if (keyName.toString() === "grade") {
        let keyid = key.split("_")[2];
        optionList.forEach((data) => {
          let optionData = data;
          if (optionData.id === keyid) {
            data["grade"] = value;
          }
        });
      }
    });

    let records = {
      chapter_no: tempLearningOutcome.chapter_no,
      learning_outcome: tempLearningOutcome.lo_name,
      learning_outcome_id: tempLearningOutcome.lo_id,
      options: optionList,
      no_of_random_qus: tempLearningOutcome.no_of_random_qus,
      questions: selectedAssessementQuestions,
    };

    // this.apiService.getAllassesmentQuestions(chapterDetail)
    //   .subscribe((response: any) => {

    this.unitInfo = records;
    localStorage.setItem("chapterId", selectedValue);
    this.showUnit = true;
    if (selectedAssessementQuestions.length) {
      this.btnDisabled = false;
    } else {
      this.btnDisabled = true;
    }

    let correctedDetails = {
      term_id: this.selectedTerm,
      chapter_id: selectedValue,
      unitInfo: this.unitInfo,
      showUnit: true,
    };
    this.storeDetail.pages.pageData[6]["correctedDetails"] = correctedDetails;
    this.ionicStore.setStoreData(this.storeDetail);
    // this.storeDetail.pages.pageData[6] = apiData;
    // this.ionicStore.setStoreData(this.storeDetail);

    // }, (error: any) => {

    //   this.showUnit = false;

    // });
  }

  public mySelectHandler(selectedValue) {
    this.selectedTerm = selectedValue;
    let mediumIds = this.classDetail.mediumInfo.map((el) => {
      return el.medium_id;
    });
    let termInfo = {
      class_id: this.classDetail.class_id,
      term_id: selectedValue,
      medium_id: mediumIds,
      subject_id: this.classDetail.subjectInfo.subject_id,
    };
    let allChapterList = this.masterApiResponse.chapters;
    let tempChapterList = [];
    allChapterList.forEach((data) => {
      if (
        data.class === termInfo.class_id &&
        data.subject_id === termInfo.subject_id &&
        data.term === termInfo.term_id &&
        termInfo.medium_id.includes(data.medium_id)
      ) {
        tempChapterList.push(data);
      }
    });

    let records = {
      chapters: tempChapterList,
    };

    // this.apiService.getChapterList(termInfo)
    //   .subscribe((response: any) => {
    this.chapterList = records.chapters;
    this.storeDetail.pages.pageData[6].apiResponse.records[
      "chapterList"
    ] = this.chapterList;
    this.ionicStore.setStoreData(this.storeDetail);
    // }, (error: any) => {
    // });
  }

  backPage = () => {
    let isRegularTeacher = this.storeDetail.pages.pageData[2].correctedDetails
      .regularTeacher;
    if (isRegularTeacher) {
      this._router.navigate(["/page-route/methodology"]);
    } else {
      this._router.navigate(["/page-route/attendance/student-attendance"]);
    }
  };

  goToStudentAssessmentPage = () => {
    let pageDetails = {
      subject: this.classDetail.subjectInfo.subject,
      term: this.selectedTerm,
      // unit: this.unitInfo.learning_outcome_id,
      // learning_outcome: this.unitInfo.learning_outcome,
    };
    this.storeDetail.pages.pageData[6]["pageDetails"] = pageDetails;
    this.storeDetail.pages.currentProgress = this.progressValue;
    this.ionicStore.setStoreData(this.storeDetail);
    this._router.navigate(["/page-route/assessment/s-assessment"]);
  };
}
