import { Component, OnInit } from "@angular/core";
import { AlertController, ModalController } from "@ionic/angular";
import { ApiService } from "src/app/services/api.service";
import { Router } from "@angular/router";
import { isRegExp } from "util";
import { AlertService } from "src/app/services/alert.service";
import { IonicStorageService } from "src/app/services/ionic-storage/ionic-storage.service";
import { TeacherInfoPage } from "../../teacher-info/teacher-info.page";
import { TranslateService } from "@ngx-translate/core";
import { LoadingService } from "src/app/services/loading.service";
import _ from "lodash";

@Component({
  selector: "app-student-attendance",
  templateUrl: "./student-attendance.component.html",
  styleUrls: ["./student-attendance.component.scss"],
})
export class StudentAttendanceComponent implements OnInit {
  classMedium: any;
  schoolInfo: any;
  attendanceList: any[] = [];
  groups: any;
  absentList: any[] = [];
  misMatchList: any[] = [];
  classData: any;
  selectedClass: any;
  storeDetail: any;
  misMatchReasons: any[] = [];
  progressValue: number;
  public masterApiResponse: any;
  /*-- Language Variables Starts --*/
  public languageType: any;
  public studentAttendance: any;
  public rollCall_Info: any;
  public p: any;
  public a: any;
  public Note: any;
  public back: any;
  public next: any;
  /*-- Language Variables Ends --*/

  constructor(
    public modalController: ModalController,
    public _apiService: ApiService,
    public _router: Router,
    public loading: LoadingService,
    public alertController: AlertController,
    public _alertService: AlertService,
    public ionicStore: IonicStorageService,
    private _translate: TranslateService
  ) {}

  ngOnInit() {
    this.progressValue = Math.round(((5 - 2) / 12) * 100);
    this.loading.present();
    this.appLanguage();
    this.schoolInfo = localStorage.getItem("schoolInfo");
    this.schoolInfo = JSON.parse(this.schoolInfo);

    /*  Getting All Details Stored in offlineStorage....*/
    this.ionicStore.getOffStorage().then((response) => {
      this.masterApiResponse = response.records;

      /*  Getting AllPage Entered Info....*/
      this.ionicStore.getStoreData().then((response) => {
        this.storeDetail = response;
        this.storeDetail.pages.currentPage = "stu_Attendance";
        //   this.storeDetail.pages.pageData.splice(4);
        this.ionicStore.setStoreData(this.storeDetail);
        this.selectedClass = this.storeDetail.pages.pageData[3].correctedDetails.map(
          (el) => {
            return el.class_id;
          }
        );

        /*  Check This Page is Registered or Not, If 'Registered' move to 'else' part...  */
        if (this.storeDetail.pages.pageData[4] === undefined) {
          this.getStudentAttendanceList(
            this.selectedClass.toString(),
            this.schoolInfo.schoolId
          );
          this.getReasonsList();
        } else {
          this.attendanceList = this.storeDetail.pages.pageData[4].apiResponse.records.attendanceList;

          this.groups = _.groupBy(
            this.attendanceList,
            (a) => a.class_studying_id
          );
          this.absentList = this.storeDetail.pages.pageData[4].apiResponse.records.absentList;
          this.misMatchReasons = this.storeDetail.pages.pageData[4].apiResponse.records.misMatchReasonList;
          this.misMatchList = this.storeDetail.pages.pageData[4].pageDetails.misMatchStudentList;
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
    this._translate.get("studentAttendance").subscribe((res: string) => {
      this.studentAttendance = res;
    });
    this._translate.get("rollCall_Info").subscribe((res: string) => {
      this.rollCall_Info = res;
    });
    this._translate.get("p").subscribe((res: string) => {
      this.p = res;
    });
    this._translate.get("a").subscribe((res: string) => {
      this.a = res;
    });
    this._translate.get("next").subscribe((res: string) => {
      this.next = res;
    });
    this._translate.get("back").subscribe((res: string) => {
      this.back = res;
    });

    this._translate.get("Note").subscribe((res: string) => {
      this.Note = res;
    });

    // this._translate.get('giveReason').subscribe((res: string) => {
    //   this.giveReason = res;
    //PLEAES GIVE A REASON
    // });
  }

  getStudentAttendanceList = (class_id, schoolId) => {
    debugger;
    let schoolDetail = {
      class_id: class_id,
      school_id: schoolId,
    };
    // this._apiService.getAttendanceDetails(schoolDetail)
    //   .subscribe((response: any) => {
    let allStudents = this.masterApiResponse.StudentsData.all;
    let absent_infoList = this.masterApiResponse.StudentsData.absent_info;
    let absent_dataList = this.masterApiResponse.StudentsData.absent_data;
    let classArray = class_id.split(",");
    let selectedClassStudents = allStudents.filter((data) =>
      classArray.includes(data.class_studying_id)
    );
    let selectedClassAbsentInfo = absent_infoList.length
      ? absent_infoList.filter((data) =>
          classArray.includes(data.class_studying_id)
        )
      : false;
    let selectedClassAbsentData = absent_dataList.filter((data) =>
      classArray.includes(data.class_studying_id)
    );

    let records = {
      all: selectedClassStudents,
      absent_info: selectedClassAbsentInfo.length
        ? selectedClassAbsentInfo
        : false,
      absent_data: selectedClassAbsentData,
    };

    this.attendanceList = records.all;
    this.groups = _.groupBy(this.attendanceList, (a) => a.class_studying_id);
    this.attendanceList.forEach((data, index) => {
      data["status"] = "none";
    });
    this.absentList = records.absent_info == false ? "" : records.absent_info;
    this.loading.dismiss();

    /*  Registering This Page in Storage ....*/
    let apiData = {
      pageNo: "5",
      pageName: "stu_Attendance",
      apiResponse: {
        records: {
          attendanceList: this.attendanceList,
          absentList: this.absentList,
          misMatchReasonList: this.misMatchReasons,
        },
      },
      pageDetails: {
        misMatchStudentList: [],
      },
      correctedDetails: [],
    };

    this.storeDetail.pages.pageData[4] = apiData;
    this.ionicStore.setStoreData(this.storeDetail);

    // }, (error) => {
    // });
  };

  getReasonsList = () => {
    // this._apiService.getMisMatchReasons()
    //   .subscribe((response: any) => {
    let records = {
      mismatch_reasons: this.masterApiResponse.mismatch_reasons,
    };
    this.misMatchReasons = records.mismatch_reasons;
    this.storeDetail.pages.pageData[4].apiResponse.records.misMatchReasonList = this.misMatchReasons;
    this.ionicStore.setStoreData(this.storeDetail);
    // }, (error: any) => {
    // });
  };

  makeAttendance(stu_detail, attedanceStatus, index, key) {
    let absentListId;
    if (this.absentList.length) {
      absentListId = this.absentList.map((el) => {
        return el.id;
      });
    }
    if (attedanceStatus == "p") {
      this.groups[key][index].status = "active";
      if (this.absentList.length) {
        const found = absentListId.includes(stu_detail.id);
        if (found) {
          if (this.misMatchList.indexOf(stu_detail) === -1) {
            this.misMatchList.push(stu_detail);
          }
        }
      }
    } else {
      this.groups[key][index].status = "Inactive";
      if (this.absentList.length) {
        const found = !absentListId.includes(stu_detail.id);
        if (found) {
          if (this.misMatchList.indexOf(stu_detail) === -1) {
            this.misMatchList.push(stu_detail);
          }
        }
      }
    }
  }

  isAttendanceTaken(currentValue, index, array) {
    return currentValue.status != "none";
  }

  goToClassroom = () => {
    this._router.navigate(["/page-route/classroom"]);
  };
  goToObservationTeaching = () => {
    debugger;
    const found = this.attendanceList.every(this.isAttendanceTaken);
    if (found) {
      if (this.misMatchList.length) {
        this.misMatchList.forEach((data, index) => {
          data["reasonInfo"] = "";
        });
      }
      // this._apiService.setMismatchAttendance(this.misMatchList);
      let misMatchData = {
        attendanceMisMatchList: this.misMatchList,
      };
      this.storeDetail.pages.pageData[4].correctedDetails =
        misMatchData.attendanceMisMatchList;
      this.storeDetail.pages.pageData[4].pageDetails.misMatchStudentList =
        misMatchData.attendanceMisMatchList;
      this.storeDetail.pages.currentProgress = this.progressValue;

      this.classData = this.storeDetail.pages.pageData[3].pageDetails;
      let classInfo = {
        mediumInfo: this.classData.mediumInfo,
        subjectInfo: this.classData.subjectInfo,
        classType: this.classData.classType,
        class_id: this.selectedClass.toString(),
      };
      localStorage.setItem("classInfo", JSON.stringify(classInfo));

      let isRegularTeacher = this.storeDetail.pages.pageData[2].correctedDetails
        .regularTeacher;

      this.ionicStore.setStoreData(this.storeDetail);
      if (this.selectedClass.length == 1) {
        if (isRegularTeacher) {
          this._router.navigate(["/page-route/methodology"]);
        } else {
          this._router.navigate(["/page-route/assessment"]);
        }
      } else {
        // if (isRegularTeacher) {
        this._router.navigate(["/page-route/observation/observationTeaching"]);
        // } else {
        //   this._router.navigate(["/page-route/assessment"]);
        // }
      }
    } else {
      this._alertService.showAlert("Please Mark Attendance");
    }
  };
}
