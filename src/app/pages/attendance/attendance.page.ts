import { Component, OnInit } from "@angular/core";
import { ActionSheetController } from "@ionic/angular";
import { IonicStorageService } from "src/app/services/ionic-storage/ionic-storage.service";
import { Router } from "@angular/router";
import { AlertService } from "src/app/services/alert.service";
import { TranslateService } from "@ngx-translate/core";
import { ApiService } from "src/app/services/api.service";

@Component({
  selector: "app-attendance",
  templateUrl: "./attendance.page.html",
  styleUrls: ["./attendance.page.scss"],
})
export class AttendancePage implements OnInit {
  storeDetail: any;
  selectedClass: any = undefined;
  selectedSection: any = undefined;
  sectionList: any[] = [];
  classList: any[] = [];
  public masterApiResponse: any;
  /*-- Language Variables Starts --*/
  public languageType: any;
  public verifyAnotherClass: any;
  public completeAttendance_verify: any;
  public selectClass: any;
  public selectSection: any;
  public Attendance: any;
  public Verification: any;
  public next: any;
  /*-- Language Variables Ends --*/

  constructor(
    private actionSheetController: ActionSheetController,
    public ionicStore: IonicStorageService,
    public _router: Router,
    public _alertService: AlertService,
    private _translate: TranslateService,
    private _apiService: ApiService
  ) {}

  ngOnInit() {
    this.appLanguage();
    /*  Getting All Details Stored in offlineStorage....*/
    this.ionicStore.getOffStorage().then((response) => {
      this.masterApiResponse = response.records;
    });

    /*  Getting AllPage Entered Info....*/
    this.ionicStore.getStoreData().then((response) => {
      this.storeDetail = response;
      this.storeDetail.pages.currentPage = "Other_classroom";
      this.ionicStore.setStoreData(this.storeDetail);

      /*  Check This Page is Registered or Not, If 'Registered' move to 'else' part...  */
      if (this.storeDetail.pages.pageData[12] === undefined) {
        this.createPage();
      } else {
        this.selectedClass = this.storeDetail.pages.pageData[12].pageDetails.selectedClass;
        this.selectedSection = this.storeDetail.pages.pageData[12].pageDetails.selectedSetion;
        this.sectionList = this.storeDetail.pages.pageData[12].pageDetails.sectionList;
      }
      let classDetail = JSON.parse(localStorage.getItem("classInfo"));
      console.log("class list ==> ", this.storeDetail);

      if (this.storeDetail.pages.pageData[3].correctedDetails.length > 1) {
        this.classList = this.storeDetail.pages.pageData[3].apiResponse.records.class_info.filter(
          (data) => !data.checked && !(Number(data.class_id) > 8)
        );
      } else {
        this.classList = this.storeDetail.pages.pageData[3].apiResponse.records.class_info.filter(
          (data) =>
            data.class_id !== classDetail.class_id &&
            !(Number(data.class_id) > 8)
        );
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
    this._translate.get("Attendance").subscribe((res: string) => {
      this.Attendance = res;
    });
    this._translate.get("Verification").subscribe((res: string) => {
      this.Verification = res;
    });
    this._translate.get("verifyAnotherClass").subscribe((res: string) => {
      this.verifyAnotherClass = res;
    });
    this._translate
      .get("completeAttendance_verify")
      .subscribe((res: string) => {
        this.completeAttendance_verify = res;
      });
    this._translate.get("selectClass").subscribe((res: string) => {
      this.selectClass = res;
    });
    this._translate.get("selectSection").subscribe((res: string) => {
      this.selectSection = res;
    });
    this._translate.get("next").subscribe((res: string) => {
      this.next = res;
    });
  }

  classSelectHandler(event) {
    this.selectedClass = event;
    this.sectionList = event.section
      .replace(/[0-9]/, "")
      .split(",")
      .filter((a) => a != "");
  }

  sectionHandler(event) {
    this.selectedSection = event;
  }

  /*  Registering This Page in Storage ....*/
  createPage = () => {
    let apiData = {
      pageNo: "13",
      pageName: "Other_classroom",
      apiResponse: {
        records: {},
      },
      pageDetails: {
        selectedClass: "",
        selectedSetion: "",
        sectionList: [],
      },
    };
    this.storeDetail.pages.pageData[12] = apiData;
    this.ionicStore.setStoreData(this.storeDetail);
  };

  goToOtherClassAttendance = () => {
    if (
      this.selectedClass != undefined &&
      this.selectedClass != "" &&
      this.selectedSection != undefined &&
      this.selectedSection != ""
    ) {
      this.storeDetail.pages.pageData[12].pageDetails.selectedClass = this.selectedClass;
      this.storeDetail.pages.pageData[12].pageDetails.selectedSetion = this.selectedSection;
      this.storeDetail.pages.pageData[12].pageDetails.sectionList = this.sectionList;
      if (this.storeDetail.pages.pageData[13] !== undefined) {
        this.storeDetail.pages.pageData.splice(13);
      }
      let allStudents = this.masterApiResponse.StudentsData.all;

      this.ionicStore.setStoreData(this.storeDetail);
      this._router.navigate(["/page-route/attendance/otherClass-attendance"]);
    } else {
      console.log("alert ==>", this.selectedClass, this.selectedSection);
      this._alertService.showAlert(
        "Attendance Verification",
        "Please select from the below any"
      );
      return;
    }
  };
}
