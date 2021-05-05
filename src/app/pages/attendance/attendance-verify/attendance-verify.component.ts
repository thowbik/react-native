import { Component, OnInit } from "@angular/core";
import { IonicStorageService } from "src/app/services/ionic-storage/ionic-storage.service";
import { Router } from "@angular/router";
import { ApiService } from "src/app/services/api.service";
import { LoadingService } from "src/app/services/loading.service";
import { AlertService } from "src/app/services/alert.service";
import { TranslateService } from "@ngx-translate/core";
import { NetworkService } from "src/app/services/network.service";

@Component({
  selector: "app-attendance-verify",
  templateUrl: "./attendance-verify.component.html",
  styleUrls: ["./attendance-verify.component.scss"],
})
export class AttendanceVerifyComponent implements OnInit {
  storeDetail: any;
  public classDetail: any;
  public schoolDetail: any;
  /*-- Language Variables Starts --*/
  public languageType: any;
  public thankyou: any;
  public Attendance: any;
  public Verification: any;
  public networkInfo: any;
  public class: any;
  public done: any;
  /*-- Language Variables Ends --*/

  constructor(
    public _router: Router,
    public ionicStore: IonicStorageService,
    public _apiService: ApiService,
    public loading: LoadingService,
    public _alertService: AlertService,
    public networkService: NetworkService,
    private _translate: TranslateService
  ) {}

  ngOnInit() {
    this.appLanguage();
    this.schoolDetail = JSON.parse(localStorage.getItem("schoolInfo"));
    this.ionicStore.getStoreData().then((response) => {
      this.storeDetail = response;
      this.classDetail = this.storeDetail.pages.pageData[12].pageDetails.selectedClass;
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
    this._translate.get("thankyou").subscribe((res: string) => {
      this.thankyou = res;
    });
    this._translate.get("Attendance").subscribe((res: string) => {
      this.Attendance = res;
    });
    this._translate.get("Verification").subscribe((res: string) => {
      this.Verification = res;
    });
    this._translate.get("networkInfo").subscribe((res: string) => {
      this.networkInfo = res;
    });
    this._translate.get("class").subscribe((res: string) => {
      this.class = res;
    });
    this._translate.get("done").subscribe((res: string) => {
      this.done = res;
    });
  }

  finalSubmit = () => {
    //     "class": 8,
    // "medium":"Tamil",
    // "class_type":"Multigrade",
    // "section": "A",
    // "teacher_name": "Siva S",
    // "teacher_emisid": "391401105603",

    const {
      school_id,
      school_name,
    } = this.storeDetail.pages.pageData[0].pageDetails;
    const emiverfiyInfo = this.storeDetail.pages.pageData[1].pageDetails;

    const schoolInfo = {
      school_id: school_id,
      school_name: school_name,
    };

    let mediumIds = this.storeDetail.pages.pageData[3].pageDetails.mediumInfo.map(
      (el) => {
        return el.medium_id;
      }
    );
    const classInfo = {
      class: this.storeDetail.pages.pageData[3].pageDetails.selectedClass[0]
        .class_id,
      medium: mediumIds.toString(),
      class_type: this.storeDetail.pages.pageData[3].pageDetails.classType,
      section: this.storeDetail.pages.pageData[3].pageDetails.selectedClass[0]
        .section,
      teacher_name: this.storeDetail.pages.pageData[2].pageDetails
        .teacherDetails.teacher_name,
      teacher_emisid: this.storeDetail.pages.pageData[2].pageDetails
        .teacherDetails.teacher_emisid,
    };
    const basicInfoObj = { ...schoolInfo, ...emiverfiyInfo, ...classInfo };
    const schoolReasons = this.storeDetail.pages.pageData[0].pageDetails
      .schoolsReasons;
    const studentReasons = this.storeDetail.pages.pageData[7].pageDetails
      .studentReasonList;
    let teacher;
    if (
      this.storeDetail.pages.pageData[2].pageDetails.reasonDetails !== undefined
    ) {
      teacher = {
        teacher_emisid: this.storeDetail.pages.pageData[2].pageDetails
          .teacherDetails.teacher_emisid,
        teacher_name: this.storeDetail.pages.pageData[2].pageDetails
          .teacherDetails.teacher_name,
        reason: this.storeDetail.pages.pageData[2].pageDetails.reasonDetails,
        description: "Reason for not observing teacher",
      };
    }
    const not_verfied = {
      schools: schoolReasons,
      teacher: teacher == undefined ? {} : teacher,
      student: studentReasons,
    };

    const learning_outcome_data = {
      subject: this.storeDetail.pages.pageData[6].pageDetails.subject,
      term: this.storeDetail.pages.pageData[6].pageDetails.term,
      unit: this.storeDetail.pages.pageData[6].correctedDetails.unitInfo
        .chapter_no,
      learning_outcome: this.storeDetail.pages.pageData[6].correctedDetails
        .unitInfo.learning_outcome,
      question_data: this.storeDetail.pages.pageData[8].pageDetails,
    };

    let observation_reportconst = {};
    if (this.storeDetail.pages.pageData[9]) {
      observation_reportconst = {
        strength: this.storeDetail.pages.pageData[9].pageDetails.strength,
        improvement: this.storeDetail.pages.pageData[9].pageDetails.improvement,
      };
    }

    let observation_data;

    if (this.storeDetail.pages.pageData[5]) {
      observation_data = {
        observation_dataInfo: this.storeDetail.pages.pageData[5].apiResponse
          .records.customizeSectionList,
      };
    }

    let finalData = {
      basic_info: basicInfoObj,
      not_verfied: not_verfied,
      learning_outcome_data: learning_outcome_data,
      observation_data: this.storeDetail.pages.pageData[5]
        ? observation_data.observation_dataInfo
        : {},
      observation_report: this.storeDetail.pages.pageData[5]
        ? observation_reportconst
        : {},
      final_remarks: "Good",
    };
    let final = {
      json: JSON.stringify(finalData),
    };
    console.log("final Data",finalData)
    // this.ionicStore.getFinalData()
    // .then((response) => {

    // });

    let connectionStatus = this.networkService.getCurrentNetworkStatus();
    if (connectionStatus !== 1) {
      this.ionicStore.setFinalData(finalData);
      this.loading.present();
      this._apiService.postfinalinfo(final).subscribe(
        (data) => {
          this.loading.dismiss();
          this.ionicStore.removeStoreData();
          this.ionicStore.removeOffStorage();
          this.ionicStore.removeFinalData();
          localStorage.removeItem("classInfo");
          localStorage.removeItem("chapterId");
          localStorage.removeItem("schoolInfo");
          localStorage.removeItem("teacherInfo");
          this._router.navigate(["/page-route/dashboardc"]);
        },
        (error: any) => {
          this.loading.dismiss();
          this.ionicStore.removeStoreData();
          this.ionicStore.removeOffStorage();
          localStorage.removeItem("classInfo");
          localStorage.removeItem("chapterId");
          localStorage.removeItem("schoolInfo");
          localStorage.removeItem("teacherInfo");
          this._router.navigate(["/page-route/dashboardc"]);
        }
      );
      // this.loading.dismiss();
    } else {
      this.loading.dismiss();
      this._alertService.showAlert(this.networkInfo);
    }
  };
}
