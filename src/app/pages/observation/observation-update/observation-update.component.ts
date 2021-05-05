import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { ObservationmodalComponent } from "src/app/components/observationmodal/observationmodal.component";
import { ApiService } from "src/app/services/api.service";
import { Router } from "@angular/router";
import { IonicStorageService } from "src/app/services/ionic-storage/ionic-storage.service";
import * as moment from "moment";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-observation-update",
  templateUrl: "./observation-update.component.html",
  styleUrls: ["./observation-update.component.scss"],
})
export class ObservationUpdateComponent implements OnInit {
  public teacherDetails: any;
  public storeDetail: any;
  public misMatchAttendance: any[] = [];
  public strength: any[] = [];
  public improvement: any[] = [];
  public reportDate: any;
  public currentImprovement: any[] = [];
  public allTeachersList: any[] = [];
  progressValue: number;
  public masterApiResponse: any;
  public improvedList: any[] = [];
  public needimproveList: any[] = [];
  /*-- Language Variables Starts --*/
  public languageType: any;
  public Observation: any;
  public Report: any;
  public UpdateObservation: any;
  public Congratulate: any;
  public Note: any;
  public encourage: any;
  public noData: any;
  public workPreviousObservation: any;
  public submitObservation: any;
  public back: any;
  /*-- Language Variables Ends --*/

  constructor(
    public modalController: ModalController,
    private _apiService: ApiService,
    private _router: Router,
    public ionicStore: IonicStorageService,
    private _translate: TranslateService
  ) {}

  ngOnInit() {
    // let teacherInfo = localStorage.getItem('teacherInfo');
    // this.teacherDetails = JSON.parse(teacherInfo);
    this.progressValue = Math.round(((11 - 2) / 12) * 100);
    this.appLanguage();
    // this.ionicStore.getOffStorage()
    // .then((response) => {
    //   this.masterApiResponse = response.records;
    // });

    /*  Getting AllPage Entered Info....*/
    this.ionicStore.getStoreData().then((response) => {
      this.storeDetail = response;
      this.storeDetail.pages.currentPage = "ObservationReport_update";
      this.ionicStore.setStoreData(this.storeDetail);
      this.teacherDetails = this.storeDetail.pages.pageData[2].apiResponse.records.teacher;

      if (this.teacherDetails.createdon !== "null") {
        this.reportDate = moment(this.teacherDetails.createdon).format(
          "Do MMM YYYY"
        );
      }

      if (this.storeDetail.pages.pageData[9]) {
        this.currentImprovement = this.storeDetail.pages.pageData[9].pageDetails.improvement;
        if (this.teacherDetails.improvement != "null") {
          this.improvement = this.teacherDetails.improvement.split("|");
          let currentImprovementData = this.currentImprovement.map((data) => {
            return data.action_item_description;
          });

          this.improvement = this.improvement.filter((i) => i);

          this.improvement.forEach((previmprovement) => {
            const found = currentImprovementData.includes(previmprovement);

            if (found) {
              this.needimproveList.push(previmprovement);
            } else {
              this.improvedList.push(previmprovement);
            }
          });
        }
      }

      this.improvedList = this.improvedList.filter((i) => i);

      // if (this.teacherDetails.strength != null) {
      //   this.strength = this.teacherDetails.strength.split(',');
      // }

      /*  Check This Page is Registered or Not, If 'Registered' move to 'else' part...  */
      if (this.storeDetail.pages.pageData[10] === undefined) {
        this.createPage();
      } else {
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
    this._translate.get("Observation").subscribe((res: string) => {
      this.Observation = res;
    });
    this._translate.get("Report").subscribe((res: string) => {
      this.Report = res;
    });
    this._translate.get("UpdateObservation").subscribe((res: string) => {
      this.UpdateObservation = res;
    });
    this._translate.get("Congratulate").subscribe((res: string) => {
      this.Congratulate = res;
    });
    this._translate.get("Note").subscribe((res: string) => {
      this.Note = res;
    });
    this._translate.get("noData").subscribe((res: string) => {
      this.noData = res;
    });

    this._translate.get("encourage").subscribe((res: string) => {
      this.encourage = res;
    });
    this._translate.get("workPreviousObservation").subscribe((res: string) => {
      this.workPreviousObservation = res;
    });
    this._translate.get("submitObservation").subscribe((res: string) => {
      this.submitObservation = res;
    });

    this._translate.get("back").subscribe((res: string) => {
      this.back = res;
    });
  }

  /*  Modal Open ....*/
  async openDiscussModal() {
    const modal = await this.modalController.create({
      component: ObservationmodalComponent,
      cssClass: "my-custom-modal-updateObservation",
      componentProps: {
        teacherDetails: this.teacherDetails,
      },
      backdropDismiss: false,
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data) {
        this._router.navigate(["/page-route/observation/endObservation"]);
      }
    });

    this._apiService.name.subscribe((response) => {
      if (response == "showText") {
        let body = document.getElementsByTagName("ion-modal")[0];
        body.classList.add("new-info");
      }
    });
    return await modal.present();
  }

  createPage = () => {
    /*  Registering This Page in Storage ....*/
    let apiData = {
      pageNo: "11",
      pageName: "ObservationReport_update",
      apiResponse: {
        records: {},
      },
    };
    this.storeDetail.pages.pageData[10] = apiData;
    this.storeDetail.pages.currentProgress = this.progressValue;
    this.ionicStore.setStoreData(this.storeDetail);
  };

  goToBackPage = () => {
    this.misMatchAttendance = this.storeDetail.pages.pageData[4].correctedDetails;
    if (this.misMatchAttendance.length) {
      this._router.navigate(["/page-route/attendance/student-data"]);
    } else {
      this._router.navigate(["/page-route/observation"]);
    }
  };
}
