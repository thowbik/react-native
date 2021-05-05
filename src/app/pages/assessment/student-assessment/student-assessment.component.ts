import { Component, OnInit, AfterViewInit } from "@angular/core";
import { AssessmentmodalComponent } from "src/app/components/assessmentmodal/assessmentmodal.component";
import { ModalController, AlertController } from "@ionic/angular";
import { ApiService } from "src/app/services/api.service";
import { Router } from "@angular/router";
import { AlertService } from "src/app/services/alert.service";
import { PostService } from "src/app/services/post.service";
import { IonicStorageService } from "src/app/services/ionic-storage/ionic-storage.service";
import { TranslateService } from "@ngx-translate/core";
import { LoadingService } from "src/app/services/loading.service";

@Component({
  selector: "app-student-assessment",
  templateUrl: "./student-assessment.component.html",
  styleUrls: ["./student-assessment.component.scss"],
})
export class StudentAssessmentComponent implements OnInit {
  public masterApiResponse: any;
  classMedium: any;
  schoolInfo: any;
  attendanceList: any[] = [];
  randomStudentList: any[] = [];
  reasonList: any[] = [];
  mediumInfoList: any[] = [];
  studentReasons: any[] = [];
  storeDetail: any;
  progressValue: number;
  /*-- Language Variables Starts --*/
  public languageType: any;
  public studentAsessment: any;
  public access_Info: any;
  public canAssessed: any;
  public ReasonAssessing: any;
  public yes: any;
  public no: any;
  public back: any;
  public next: any;
  /*-- Language Variables Ends --*/

  constructor(
    public modalController: ModalController,
    public _apiService: ApiService,
    public _router: Router,
    public _postService: PostService,
    public _alertService: AlertService,
    public loading: LoadingService,
    public ionicStore: IonicStorageService,
    private _translate: TranslateService
  ) {}

  ngOnInit() {
    this.progressValue = Math.round(((8 - 2) / 12) * 100);
    this.appLanguage();
    this.loading.present();
    this.classMedium = localStorage.getItem("classInfo");
    this.classMedium = JSON.parse(this.classMedium);
    this.schoolInfo = localStorage.getItem("schoolInfo");
    this.schoolInfo = JSON.parse(this.schoolInfo);

    /*  Getting All Details Stored in offlineStorage....*/
    this.ionicStore.getOffStorage().then((response) => {
      this.masterApiResponse = response.records;

      /*  Getting AllPage Entered Info....*/
      this.ionicStore.getStoreData().then((response) => {
        this.storeDetail = response;
        this.storeDetail.pages.currentPage = "stu_Assessment_accessed";
        //this.storeDetail.pages.pageData.splice(7);
        this.ionicStore.setStoreData(this.storeDetail);
        this.mediumInfoList = this.storeDetail.pages.pageData[3].apiResponse.records.medium_info;

        /*  Check This Page is Registered or Not, If 'Registered' move to 'else' part...  */
        if (this.storeDetail.pages.pageData[7] === undefined) {
          this.getStudentAttendanceList(
            this.classMedium,
            this.schoolInfo.schoolId
          );
        } else {
          let apiData = this.storeDetail.pages.pageData[7].apiResponse.records;
          let correctedInfo = this.storeDetail.pages.pageData[7]
            .correctedDetails;
          this.reasonList = apiData.stu_reasonList;
          this.randomStudentList = correctedInfo.studentList;
          this.loading.dismiss();
        }
      });
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
    this._translate.get("access_Info").subscribe((res: string) => {
      this.access_Info = res;
    });
    this._translate.get("canAssessed").subscribe((res: string) => {
      this.canAssessed = res;
    });
    this._translate.get("ReasonAssessing").subscribe((res: string) => {
      this.ReasonAssessing = res;
    });
    this._translate.get("yes").subscribe((res: string) => {
      this.yes = res;
    });
    this._translate.get("no").subscribe((res: string) => {
      this.no = res;
    });
    this._translate.get("next").subscribe((res: string) => {
      this.next = res;
    });
    this._translate.get("back").subscribe((res: string) => {
      this.back = res;
    });
  }

  /*  Modal Open ....*/
  async openAssessmentModal(viewInfo, status, studentDetail, index) {
    const modal = await this.modalController.create({
      component: AssessmentmodalComponent,
      componentProps: {
        viewName: viewInfo,
        studentDetail: studentDetail,
        reasonList: this.reasonList,
        mediumList: this.mediumInfoList,
      },
      backdropDismiss: false,
      cssClass:
        viewInfo == "view1"
          ? "my-custom-modal-s_assessment"
          : "my-custom-modal-assessment",
    });

    modal.onDidDismiss().then((response) => {
      if (response.data !== "Cancel" && viewInfo === "view1") {
        // This is No Click
        const found = this.studentReasons.filter(
          (data) =>
            data.student_emisid == response.data.student_emisid &&
            data.reason == response.data.reason
        );
        if (!this.studentReasons.length) {
          this.studentReasons.push(response.data);
        } else {
          let studentIds = this.studentReasons.map((el) => {
            return el.student_emisid;
          });
          if (!studentIds.includes(response.data.student_emisid)) {
            this.studentReasons.push(response.data);
          } else {
            const found = this.studentReasons.find(
              (data) => data.student_emisid == response.data.student_emisid
            );
            if (found.reason !== response.data.reason) {
              const findIndex = this.studentReasons.indexOf(found);
              this.studentReasons.splice(findIndex, 1);
              this.studentReasons.push(response.data);
            }
          }
        }
        this.addnewRandom(status, index, studentDetail);
      } else if (response.data !== "Cancel" && viewInfo === "view2") {
        // This is Yes Click
        this.addnewRandom(status, index, studentDetail);
      }
    });

    if (viewInfo === "view1") {
      return await modal.present();
    } else {
      this.addnewRandom(status, index, studentDetail);
    }
  }

  getStudentAttendanceList = (classMedium, schoolId) => {
    classMedium["school_id"] = schoolId;
    // this._apiService.getAttendanceDetails(classMedium)
    //   .subscribe((response: any) => {
    let tempStudents = this.masterApiResponse.StudentsData.all.filter(
      (data) => data.class_studying_id === classMedium.class_id
    );
    let records = {
      all: tempStudents,
    };

    this.attendanceList = records.all;
    let tempAttendanceList = JSON.parse(JSON.stringify(records.all));
    let i;
    for (i = 0; i < 5; i++) {
      if (this.attendanceList.length) {
        let idx;
        idx = Math.floor(Math.random() * this.attendanceList.length);
        this.randomStudentList.push(this.attendanceList[idx]);
        this.randomStudentList[i]["accessed"] = "none";
        this.attendanceList.splice(idx, 1);
      }
    }
    this.loading.dismiss();

    /*  Registering This Page in Storage ....*/
    let apiData = {
      pageNo: "8",
      pageName: "stu_Assessment_accessed",
      apiResponse: {
        records: {
          attendanceList: tempAttendanceList,
        },
      },
      correctedDetails: {
        studentList: this.randomStudentList,
      },
    };

    this.storeDetail.pages.pageData[7] = apiData;
    this.ionicStore.setStoreData(this.storeDetail);    
    this.getAssesmentReasons();

    // }, (error) => {
    // });
  };

  getAssesmentReasons() {
    // this._apiService.getAssesmentReasonsList()
    //   .subscribe((response: any) => {
    let stu_reasons = this.masterApiResponse.student_reasons;
    let records = {
      student_reasons: stu_reasons,
    };
    this.reasonList = records.student_reasons;
    this.storeDetail.pages.pageData[7].apiResponse.records[
      "stu_reasonList"
    ] = this.reasonList;
    this.ionicStore.setStoreData(this.storeDetail);
    // }, (error: any) => {
    // });
  }

  async addnewRandom(status, index, studentDetail) {
    let statusType = status;
    if (statusType == "no") {
      this.randomStudentList[index].accessed = "no";

      if (this.attendanceList.length) {
        const item = this.attendanceList[
          Math.floor(Math.random() * this.attendanceList.length)
        ];
        this.randomStudentList.push(item);
        this.attendanceList.splice(this.attendanceList.indexOf(item), 1);
        studentDetail.addedStudent = item;
      }
    } else {
      this.randomStudentList[index].accessed = "yes";
      if (this.randomStudentList.length > 5 && studentDetail.addedStudent) {
        this.randomStudentList.splice(
          this.randomStudentList.indexOf(studentDetail.addedStudent),
          1
        );
      }
    }
  }

  goToStudentPerformance() {
    let pageDetails = {
      studentReasonList: this.studentReasons,
    };
    this.storeDetail.pages.pageData[7]["pageDetails"] = pageDetails;
    this.storeDetail.pages.pageData[7].correctedDetails.studentList = this.randomStudentList;
    this.storeDetail.pages.currentProgress = this.progressValue;
    this.ionicStore.setStoreData(this.storeDetail);

    if (this.storeDetail.pages.pageData[8] !== undefined) {
      let questionAccessedStudents = this.storeDetail.pages.pageData[8].apiResponse.records.accessedStudents.map(
        (el) => {
          return el.id;
        }
      );
      let currentAccessedStudents = this.storeDetail.pages.pageData[7].correctedDetails.studentList.map(
        (el) => {
          return el.id;
        }
      );
      if (
        JSON.stringify(questionAccessedStudents) !==
        JSON.stringify(currentAccessedStudents)
      ) {
        this.storeDetail.pages.pageData.splice(8);        
        this.ionicStore.setStoreData(this.storeDetail);
      }
    }
    const accessedStudents = this.randomStudentList.filter(
      (data) => data.accessed == "none" || !data.accessed
    );

    if (accessedStudents.length > 0) {
      this._alertService.showAlert("Please Select Students");
    } else {
      this._router.navigate(["/page-route/assessment/student-performance"]);
    }
  }
}
