import { Component, OnInit } from "@angular/core";
import { ApiService } from "src/app/services/api.service";
import { Router } from "@angular/router";
import { AlertService } from "src/app/services/alert.service";
import { IonicStorageService } from "src/app/services/ionic-storage/ionic-storage.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-observation-teaching",
  templateUrl: "./observation-teaching.component.html",
  styleUrls: ["./observation-teaching.component.scss"],
})
export class ObservationTeachingComponent implements OnInit {
  selectedStandard: any;
  classData: any;
  standardList: any[] = [];
  storeDetail: any;
  selectedClass: any[] = [];
  classSelect: any;
  /*-- Language Variables Starts --*/
  public languageType: any;
  public next: any;
  public back: any;
  public standardInfo: any;
  public classroomObservation: any;
  public teaching: any;
  public observation: any;
  public selectStandard: string;
  /*-- Language Variables Ends --*/

  constructor(
    public _apiService: ApiService,
    public _router: Router,
    public _alertService: AlertService,
    public ionicStore: IonicStorageService,
    private _translate: TranslateService
  ) {}

  ngOnInit() {
    this.appLanguage();

    /*  Getting AllPage Entered Info....*/
    this.ionicStore.getStoreData().then((response) => {
      this.storeDetail = response;
      this.selectedClass = this.storeDetail.pages.pageData[3].correctedDetails;
      if (
        this.storeDetail.pages.pageData[3].pageDetails.selectedClass.length ===
        1
      ) {
        this.classSelect = this.storeDetail.pages.pageData[3].pageDetails.selectedClass[0].class_id;
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
    this._translate.get("next").subscribe((res: string) => {
      this.next = res;
    });
    this._translate.get("standardInfo").subscribe((res: string) => {
      this.standardInfo = res;
    });
    this._translate.get("teaching").subscribe((res: string) => {
      this.teaching = res;
    });
    this._translate.get("classroomObservation").subscribe((res: string) => {
      this.classroomObservation = res;
    });
    this._translate.get("Observation").subscribe((res: string) => {
      this.observation = res;
    });
    this._translate.get("back").subscribe((res: string) => {
      this.back = res;
    });
    this._translate.get("selectStandard").subscribe((res: string) => {
      this.selectStandard = res;
    });
  }

  radioChecked(event) {
    this.selectedStandard = event;
  }

  goToMethodolgyQuestions() {
    if (this.selectedStandard != undefined) {
      this.classData = this.storeDetail.pages.pageData[3].pageDetails;
      let selectClass = this.storeDetail.pages.pageData[3].correctedDetails.filter(
        (data) => data.class_id == this.selectedStandard.class_id
      );
      let classInfo = {
        mediumInfo: this.classData.mediumInfo,
        subjectInfo: this.classData.subjectInfo,
        classType: this.classData.classType,
        class_id: this.selectedStandard.class_id.toString(),
      };

      localStorage.setItem("classInfo", JSON.stringify(classInfo));
      if (
        this.storeDetail.pages.pageData[3].pageDetails.selectedClass.length ===
        1
      ) {
        let givenClassId = this.storeDetail.pages.pageData[3].pageDetails
          .selectedClass[0].class_id;
        let selectedClassId = selectClass[0].class_id;
        if (givenClassId !== selectedClassId) {
          this.storeDetail.pages.pageData.splice(5);
          this.ionicStore.setStoreData(this.storeDetail);
        }
      }
      this.storeDetail.pages.pageData[3].pageDetails.selectedClass = selectClass;
      this.ionicStore.setStoreData(this.storeDetail);
      let isRegularTeacher = this.storeDetail.pages.pageData[2].correctedDetails
        .regularTeacher;

      if (isRegularTeacher) {
        this._router.navigate(["/page-route/methodology"]);
      } else {
        this._router.navigate(["/page-route/assessment"]);
      }
    } else {
      this._alertService.showAlert(null, this.selectStandard);
    }
  }
}
