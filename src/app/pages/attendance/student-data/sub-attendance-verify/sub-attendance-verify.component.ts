import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { AttendancemodalComponent } from "src/app/components/attendancemodal/attendancemodal.component";
import { ApiService } from "src/app/services/api.service";
import { IonicStorageService } from "src/app/services/ionic-storage/ionic-storage.service";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { AlertService } from "src/app/services/alert.service";

@Component({
  selector: "app-sub-attendance-verify",
  templateUrl: "./sub-attendance-verify.component.html",
  styleUrls: ["./sub-attendance-verify.component.scss"],
})
export class SubAttendanceVerifyComponent {
  public misMatchAttendance: any[] = [];
  misMatchReasons: any[] = [];
  selectedIndex: any;
  public storeDetail: any;
  /*-- Language Variables Starts --*/
  public languageType: any;
  public Attendance: any;
  public Verification: any;
  public reasonMismatch: any;
  public Note: any;
  public mismatchInfo: any;
  public back: any;
  public next: any;
  /*-- Language Variables Ends --*/

  constructor(
    public modalController: ModalController,
    public _apiService: ApiService,
    public ionicStore: IonicStorageService,
    public _router: Router,
    private _translate: TranslateService,
    private _alertService: AlertService
  ) {}

  ionViewWillEnter() {
    this.appLanguage();

    /*  Getting AllPage Entered Info....*/
    this.ionicStore.getStoreData().then((response) => {
      this.storeDetail = response;
      this.misMatchAttendance = this.storeDetail.pages.pageData[13].correctedDetails;
      this.misMatchReasons = this.storeDetail.pages.pageData[4].apiResponse.records.misMatchReasonList;
    });
    // this.getReasonsList();
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
    this._translate.get("Note").subscribe((res: string) => {
      this.Note = res;
    });
    this._translate.get("mismatchInfo").subscribe((res: string) => {
      this.mismatchInfo = res;
    });
    this._translate.get("reasonMismatch").subscribe((res: string) => {
      this.reasonMismatch = res;
    });
    this._translate.get("next").subscribe((res: string) => {
      this.next = res;
    });
    this._translate.get("back").subscribe((res: string) => {
      this.back = res;
    });
  }

  /*  Modal Open ....*/
  async presentModal(studentName, index) {
    this.selectedIndex = index;
    const modal = await this.modalController.create({
      component: AttendancemodalComponent,
      componentProps: {
        misMatchReasonList: this.misMatchReasons,
        student: studentName,
      },
      backdropDismiss: false,
      cssClass: "my-custom-modal-attendance",
    });

    modal.onDidDismiss().then((response) => {
      if (response.data.reason !== "Cancel") {
        this.misMatchAttendance[this.selectedIndex].reasonInfo =
          response.data.reason;
      }
    });
    return await modal.present();
  }

  goToOtherClassAttendance = () => {
    this._router.navigate(["/page-route/attendance/otherClass-attendance"]);
  };

  goToAttendanceVerify = () => {
    const isAllAssessed = this.misMatchAttendance.filter(
      (_ma) => _ma.reasonInfo === ""
    );

    if (isAllAssessed.length === 0) {
      this.storeDetail.pages.pageData[13].correctedDetails = this.misMatchAttendance;
      this.ionicStore.setStoreData(this.storeDetail);
      this._router.navigate(["/page-route/attendance/attendance-verify"]);
    } else {
      this._alertService.showAlert(
        "Attendance Vertification",
        "Please verify attendance for all the students"
      );
    }
  };
}
