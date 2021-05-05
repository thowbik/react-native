import { Component, OnInit, Input } from "@angular/core";
import { ModalController, NavParams } from "@ionic/angular";
import { AlertService } from "src/app/services/alert.service";
import { TranslateService } from "@ngx-translate/core";
import { ApiService } from "src/app/services/api.service";

@Component({
  selector: "app-dashboardmodal",
  templateUrl: "./dashboardmodal.component.html",
  styleUrls: ["./dashboardmodal.component.scss"],
})
export class DashboardmodalComponent implements OnInit {
  lname: string = "";
  //@Input() schoolReason: string;
  schoolReasons: any[] = [];
  unVisitedSchoolList: any[] = [];
  allSchoolList: any[] = [];
  selectedReason: any[] = [];
  reasonDataList: any[] = [];
  selectedSchool: any;
  result: boolean;
  /*-- Language Variables Starts --*/
  public languageType: any;
  public schoolsReason: any;
  public visitSchool: any;
  public reason: any;
  public chooseSchool: any;
  public Others: any;
  public cancel: any;
  public submit: any;
  /*-- Language Variables Ends --*/

  constructor(
    private modalController: ModalController,
    public navParams: NavParams,
    public _alertService: AlertService,
    public _apiService: ApiService,
    private _translate: TranslateService
  ) {
    this.schoolReasons = navParams.get("schoolReason");
    this.unVisitedSchoolList = navParams.get("unVisitedSchoolList");    
    this.allSchoolList = navParams.get("allSchoolList");    
    this.allSchoolList = this.allSchoolList.filter(val => !this.unVisitedSchoolList.includes(val));    

  }

  ngOnInit() {
    this._apiService.languageInfo.subscribe((data: any) => {
      this.languageType = data;
      this._translate.use(this.languageType);
      this._initialiseTranslation();
      switch (this.languageType) {
        case "en":
          this.schoolReasons = this.schoolReasons.filter(
            (sr) => sr.language_id == 2
          );
          break;
        case "ta":
          this.schoolReasons = this.schoolReasons.filter(
            (sr) => sr.language_id == 1
          );
        default:
          break;
      }
    });
  }

  _initialiseTranslation(): void {
    this._translate.get("schoolsReason").subscribe((res: string) => {
      this.schoolsReason = res;
    });
    this._translate.get("visitSchool").subscribe((res: string) => {
      this.visitSchool = res;
    });
    this._translate.get("chooseSchool").subscribe((res: string) => {
      this.chooseSchool = res;
    });

    this._translate.get("reason").subscribe((res: string) => {
      this.reason = res;
    });
    this._translate.get("Others").subscribe((res: string) => {
      this.Others = res;
    });
    this._translate.get("cancel").subscribe((res: string) => {
      this.cancel = res;
    });
    this._translate.get("submit").subscribe((res: string) => {
      this.submit = res;
    });
  }

  planToVisitSchool = (school) => {
    this.selectedSchool = school;
  };

  mySelectHandler = (event, index, school) => {
    // this.lname = event.replace(/\s/g, '');
    this.lname = event;
    this.selectedReason[index] = this.lname;
    // if (this.lname != 'Others') {
    let reasonDetail = {
      school_id: school.school_id,
      school_name: school.school_name,
      reason: this.lname,
      description: "Reasons for not selecting the following schools",
    };    
    if (!this.reasonDataList.length) {
      this.reasonDataList.push(reasonDetail);
    } else {
      const findIndex = this.reasonDataList.findIndex(
        (data) => data.school_id === reasonDetail.school_id
      );
      if (findIndex !== -1) {
        this.reasonDataList.splice(findIndex, 1);
      }
      this.reasonDataList.push(reasonDetail);
    }
    // }
  };

  inputHandler = (type, inputValue, index, school) => {
    let reasonDetail = {
      school_id: school.school_id,
      school_name: school.school_name,
      reason: inputValue,
      description: "Reasons for not selecting the following schools",
    };    
    if (!this.reasonDataList.length) {
      this.reasonDataList.push(reasonDetail);
    } else {
      const findIndex = this.reasonDataList.findIndex(
        (data) => data.school_id === reasonDetail.school_id
      );
      if (findIndex !== -1) {
        this.reasonDataList.splice(findIndex, 1);
      }
      this.reasonDataList.push(reasonDetail);
    }
  };

  async dismiss(submitted) {
    // using the injected ModalController this page
    let onClosedData = submitted;
    if (onClosedData != "Cancel") {      
      if (
        this.reasonDataList.length === this.unVisitedSchoolList.length &&
        this.selectedSchool
      ) {
        let reasonInfo = {
          reasonList: this.reasonDataList,
          schoolDetail: this.selectedSchool,
        };
        await this.modalController.dismiss(reasonInfo);
      } else {
        this._alertService.showAlert("Please Enter All Options");
      }
    } else {
      await this.modalController.dismiss(onClosedData);
    }
  }
}
