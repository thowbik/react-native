import { Component, OnInit } from "@angular/core";
import { ModalController, NavParams } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { ApiService } from "src/app/services/api.service";
import { AlertService } from "src/app/services/alert.service";

@Component({
  selector: "app-attendancemodal",
  templateUrl: "./attendancemodal.component.html",
  styleUrls: ["./attendancemodal.component.scss"],
})
export class AttendancemodalComponent implements OnInit {
  showInput = false;
  misMatchReasonList: any[] = [];
  selectedReason: any;
  reasonInput: any;
  studentName: string = "";
  showErrorMessage: boolean = false;

  /*-- Language Variables Starts --*/
  public languageType: any;
  public reasonInfoTxt: any;
  public cancel: any;
  public submit: any;
  /*-- Language Variables Ends --*/
  constructor(
    private modalController: ModalController,
    navParams: NavParams,
    public _apiService: ApiService,
    private _translate: TranslateService,
    private _alertService: AlertService
  ) {
    this.misMatchReasonList = navParams.get("misMatchReasonList");
    this.studentName = navParams.get("student");
  }

  ngOnInit() {
    this._apiService.languageInfo.subscribe((data: any) => {
      this.languageType = data;
      this._translate.use(this.languageType);
      this._initialiseTranslation();
    });
    switch (this.languageType) {
      case "en":
        this.misMatchReasonList = this.misMatchReasonList.filter(
          (sr) => sr.language_id == 2
        );
        break;
      case "ta":
        this.misMatchReasonList = this.misMatchReasonList.filter(
          (sr) => sr.language_id == 1
        );
      default:
        break;
    }
  }

  /*-- Getting Language Variables Starts --*/
  _initialiseTranslation(): void {
    this._translate.get("reasonInfoTxt").subscribe((res: string) => {
      this.reasonInfoTxt = res;
    });
    this._translate.get("cancel").subscribe((res: string) => {
      this.cancel = res;
    });
    this._translate.get("submit").subscribe((res: string) => {
      this.submit = res;
    });
  }
  /*-- Getting Language Variables Ends --*/

  mcqAnswer(data, index) {
    if (data.reason.toLowerCase() === "other" || data.reason === "மற்றவை") {
      this.showInput = true;
    } else {
      this.showInput = false;
    }
    this.selectedReason = data;
  }

  async dismiss(selectedValue) {
    let reasonInfo;
    if (selectedValue !== "Cancel") {
      if (!this.selectedReason) {
        this._alertService.showAlert(
          "Please Select",
          "Please select the reason for mismatch"
        );
        return;
      }

      if (this.showInput && !this.reasonInput) {
        this.showErrorMessage = true;
        return;
      }

      if (this.selectedReason.reason != "Other") {
        reasonInfo = {
          id: this.selectedReason.reason_id,
          reason: this.selectedReason.reason,
        };
      } else {
        reasonInfo = {
          id: this.selectedReason.reason_id,
          reason: this.reasonInput,
        };
      }
    } else {
      reasonInfo = {
        id: "0",
        reason: "Cancel",
      };
    }
    const onClosedData = "Wrapped Up!";
    await this.modalController.dismiss(reasonInfo);
  }
}
