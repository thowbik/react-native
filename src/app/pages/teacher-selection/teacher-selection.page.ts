import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { ClassroommodalComponent } from "src/app/components/classroommodal/classroommodal.component";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "src/app/services/api.service";
import { EmimodalComponent } from "src/app/components/emimodal/emimodal.component";
import { AlertService } from "src/app/services/alert.service";
import { PostService } from "src/app/services/post.service";
import { IonicStorageService } from "src/app/services/ionic-storage/ionic-storage.service";
import { typeWithParameters } from "@angular/compiler/src/render3/util";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-teacher-selection",
  templateUrl: "./teacher-selection.page.html",
  styleUrls: ["./teacher-selection.page.scss"],
})
export class TeacherSelectionPage implements OnInit {
  regularTeacher: boolean;
  showDropdown: boolean = false;
  lname: string = "";
  schoolId: any;
  teacherList: any;
  teacherDetails: any;
  changedValue: string = "";
  schoolInfo: any;
  teacherReasons: any[] = [];
  isChanged: boolean = false;
  selectedReason: any;
  teacher_id: any;
  storeDetail: any;
  checkedValue: any;
  public btnDisabled: boolean = true;
  public progressValue: number;
  public masterApiResponse: any;
  /*-- Language Variables Starts --*/
  public languageType: any;
  public teacher: any;
  public Selection: any;
  public todayObserving: any;
  public proceedObservation: any;
  public yes: any;
  public no: any;
  public emiIdVerify: any;
  public Note: any;
  public takeAttendance: any;
  public noneAbove: any;
  public back: any;
  public start: any;
  public giveReason: any;
  public doIt: any;
  /*-- Language Variables Ends --*/

  constructor(
    public modalController: ModalController,
    public _router: Router,
    public _apiService: ApiService,
    public _alertService: AlertService,
    public _postService: PostService,
    private activatedRoute: ActivatedRoute,
    public ionicStore: IonicStorageService,
    private _translate: TranslateService
  ) {}

  ngOnInit() {
    this.progressValue = Math.round(((3 - 2) / 12) * 100);
    this.appLanguage();
    /*  Getting All Details Stored in offlineStorage....*/
    this.ionicStore.getOffStorage().then((response) => {
      this.masterApiResponse = response.records;

      /*  Getting AllPage Entered Info....*/
      this.ionicStore.getStoreData().then((response) => {
        this.storeDetail = response;
        this.storeDetail.pages.currentPage = "teacherSeleciton";
        this.ionicStore.setStoreData(this.storeDetail);
        this.schoolInfo = localStorage.getItem("schoolInfo");
        this.schoolInfo = JSON.parse(this.schoolInfo);
        // this.storeDetail.pages.pageData.splice(2,1);
        // this.ionicStore.setStoreData(this.storeDetail);

        /*  Check This Page is Registered or Not, If 'Registered' move to 'else' part...  */
        if (this.storeDetail.pages.pageData[2] === undefined) {
          this.getSchoolTeacherDetail(this.schoolInfo.schoolId);
        } else {
          let apiResponse = this.storeDetail.pages.pageData[2].apiResponse
            .records;
          this.teacherReasons = apiResponse.reasons;
          this.teacherReasons = this.filterListByLang(this.teacherReasons);
          if (this.storeDetail.pages.pageData[2].pageDetails != undefined) {
            this.teacherDetails = this.storeDetail.pages.pageData[2].pageDetails.teacherDetails;
            this.teacher_id = this.storeDetail.pages.pageData[2].pageDetails.teacher_id;
            this.showDropdown = this.storeDetail.pages.pageData[2].tempInfo.showDropdown;
            if (
              this.storeDetail.pages.pageData[2].pageDetails.reasonDetails !=
              undefined
            ) {
              this.selectedReason = this.storeDetail.pages.pageData[2].pageDetails.reasonDetails.reason;
            }
            if (this.showDropdown) {
              this.btnDisabled = false;
            }
          }
          if (
            this.storeDetail.pages.pageData[2].correctedDetails != undefined
          ) {
            this.changedValue = this.storeDetail.pages.pageData[2].correctedDetails.changedValue;
            this.isChanged = this.storeDetail.pages.pageData[2].correctedDetails.isChanged;
            this.regularTeacher = this.storeDetail.pages.pageData[2].correctedDetails.regularTeacher;
            this.checkedValue = this.regularTeacher ? "true" : "false";
          }
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
    this._translate.get("teacher").subscribe((res: string) => {
      this.teacher = res;
    });
    this._translate.get("Selection").subscribe((res: string) => {
      this.Selection = res;
    });
    this._translate.get("takeAttendance").subscribe((res: string) => {
      this.takeAttendance = res;
    });
    this._translate.get("doIt").subscribe((res: string) => {
      this.doIt = res;
    });

    this._translate.get("todayObserving").subscribe((res: string) => {
      this.todayObserving = res;
    });
    this._translate.get("proceedObservation").subscribe((res: string) => {
      this.proceedObservation = res;
    });
    this._translate.get("yes").subscribe((res: string) => {
      this.yes = res;
    });
    this._translate.get("no").subscribe((res: string) => {
      this.no = res;
    });

    this._translate.get("Note").subscribe((res: string) => {
      this.Note = res;
    });

    this._translate.get("noneAbove").subscribe((res: string) => {
      this.noneAbove = res;
    });
    this._translate.get("back").subscribe((res: string) => {
      this.back = res;
    });

    this._translate.get("start").subscribe((res: string) => {
      this.start = res;
    });
    this._translate.get("giveReason").subscribe((res: string) => {
      this.giveReason = res;
    });
    // this._translate.get('giveReason').subscribe((res: string) => {
    //   this.giveReason = res;

    //PLEAES GIVE A REASON
    // });
  }

  filterListByLang(list) {
    switch (this.languageType) {
      case "en":
        list = list.filter((sr) => sr.language_id == 2);
        break;
      case "ta":
        list = list.filter((sr) => sr.language_id == 1);
      default:
        break;
    }

    return list;
  }

  getSchoolTeacherDetail = (schoolId) => {
    // this._apiService.getTeacherDetail(schoolId)
    //   .subscribe((response: any) => {
    let records = {
      teacher: this.masterApiResponse.teachers_details,
      reasons: this.masterApiResponse.teacher_reasons,
    };
    let totalRecords = records;
    //  this.teacherList = response.records.teachers;
    this.teacherReasons = records.reasons;
    this.teacherReasons = this.filterListByLang(this.teacherReasons);
    //   this.teacherDetails = this.teacherList[Math.floor(Math.random() * this.teacherList.length)];
    this.teacherDetails = records.teacher;
    this.teacher_id = this.teacherDetails.teacher_emisid;
    localStorage.setItem("teacherInfo", JSON.stringify(this.teacherDetails));
    //this.schoolDetails = response.records[0];
    //this.schoolList = response.records.schoolList;

    /*  Registering This Page in Storage ....*/
    let apiData = {
      pageNo: "3",
      pageName: "teacherSeleciton",
      apiResponse: {
        records: totalRecords,
      },
      pageDetails: {
        teacherDetails: this.teacherDetails,
        teacher_id: this.teacher_id,
      },
      tempInfo: {
        showDropdown: false,
      },
    };
    this.storeDetail.pages.pageData[2] = apiData;
    this.ionicStore.setStoreData(this.storeDetail);
    // }, (error: any) => {
    //   console.log(error);
    // });
  };
  mySelectHandler(event) {
    this.lname = event.replace(/\s/g, "");
    if (this.lname == "Multigrade") {
      this.presentModal();
    }
  }

  mySelectReason(event) {
    this.selectedReason = event;
  }

  addData = (status) => {
    this.storeDetail.pages.pageData[2].tempInfo.showDropdown = status;
    this.ionicStore.setStoreData(this.storeDetail);
    this.btnDisabled = false;
  };
  async presentModal() {
    const modal = await this.modalController.create({
      component: ClassroommodalComponent,
      cssClass: " my-custom-modal-classroom",
      backdropDismiss: false,
    });

    // modal.onDidDismiss().then((dataReturned) => {
    //   if (dataReturned !== null) {
    //     this.dataReturned = dataReturned.data;
    //     //alert('Modal Sent Data :'+ dataReturned);
    //   }
    // });
    return await modal.present();
  }

  proceedCheck(changedValue) {
    this.changedValue = changedValue;
    this.isChanged = false;
    this.teacher_id = this.storeDetail.pages.pageData[2].pageDetails.teacher_id;
  }

  /*  Modal Open ....*/
  async presentModald(listedValue, type, correction, showCategory) {
    const modal = await this.modalController.create({
      component: EmimodalComponent,
      componentProps: {
        listedValue: listedValue,
        actualValue: "",
        divisionType: type,
        correction: correction,
        showCategory: showCategory,
      },
      backdropDismiss: false,
    });
    modal.onDidDismiss().then((response) => {
      if (response.data !== "Cancel") {
        this.teacher_id = response.data;
        this.changedValue = response.data;
        this.isChanged = true;
      }
    });
    return await modal.present();
  }

  goToClassroom = () => {
    let teacherReason;
    if (!this.regularTeacher) {
      teacherReason = {
        reason: this.selectedReason,
        description: "Reason for not observing teacher",
      };
    }
    let correctedDetails = {
      changedValue: this.changedValue,
      isChanged: this.isChanged,
      regularTeacher: this.regularTeacher,
    };
    this.storeDetail.pages.pageData[2]["correctedDetails"] = correctedDetails;
    this.storeDetail.pages.pageData[2].pageDetails.teacherDetails.teacher_emisid = this.teacher_id;
    this.storeDetail.pages.pageData[2].pageDetails[
      "reasonDetails"
    ] = teacherReason;
    this.storeDetail.pages.currentProgress = this.progressValue;
    this.ionicStore.setStoreData(this.storeDetail);
    if (this.regularTeacher !== undefined && this.regularTeacher) {
      if (!this.isChanged && this.changedValue! == "") {
        this._alertService.showAlert("Please check any");
      } else {
        this._router.navigate(["/page-route/classroom"]);
      }
    } else {
      if (this.selectedReason == undefined) {
        this._alertService.showAlert("Please Select Reason");
      } else {
        this._router.navigate(["/page-route/classroom"]);
      }
    }
  };

  backToEmiVerify() {
    this._router.navigate(["/page-route/emiverify", this.schoolInfo.schoolId]);
  }
}
