import { Component, OnInit } from "@angular/core";
import { NavParams, ModalController } from "@ionic/angular";
import { AlertService } from "src/app/services/alert.service";
import { ApiService } from "src/app/services/api.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-assessmentmodal",
  templateUrl: "./assessmentmodal.component.html",
  styleUrls: ["./assessmentmodal.component.scss"],
})
export class AssessmentmodalComponent implements OnInit {
  viewName: any;
  reasonList: any[] = [];
  mediumList: any[] = [];
  randomQuestionList: any[] = [];
  studentDetail: any;
  selectedReason: any;
  /*-- Language Variables Starts --*/
  public languageType: any;
  public selectInstruction: any;
  public studentIdentify: any;
  public ok: any;
  public ReasonAssessing: any;
  public chooseMedium: any;
  public cancel: any;
  public submit: any;
  /*-- Language Variables Ends --*/

  constructor(
    private navParams: NavParams,
    private modalController: ModalController,
    public _alerService: AlertService,
    public _apiService: ApiService,
    private _translate: TranslateService
  ) {}

  ngOnInit() {
    this.viewName = this.navParams.data.viewName;
    this.reasonList = this.navParams.data.reasonList || [];
    this.studentDetail = this.navParams.data.studentDetail;
    this.mediumList = this.navParams.data.mediumList;
    this.randomQuestionList = this.navParams.data.questionList;

    if (this.randomQuestionList) {
      const ansEmpty = this.randomQuestionList.filter((rq) => rq.ans === "");
      const ansPresent = this.randomQuestionList.filter((rq) => rq.ans !== "");

      if (ansEmpty.length > 0) {
        if (ansPresent.length > 0) {
          const question = ansPresent[0];
          this.randomQuestionList.forEach((rq) => {
            rq.ans = question.ans;
          });
        } else {
          this.randomQuestionList.forEach((rq) => {
            rq.ans = "check if the student is answering correctly";
          });
        }
      }
    }

    this._apiService.languageInfo.subscribe((data: any) => {
      this.languageType = data;
      this._translate.use(this.languageType);
      this._initialiseTranslation();

      switch (this.languageType) {
        case "en":
          this.reasonList = this.reasonList.filter((sr) => sr.language_id == 2);
          break;
        case "ta":
          this.reasonList = this.reasonList.filter((sr) => sr.language_id == 1);
        default:
          break;
      }
    });
  }

  /*-- Getting Language Variables Starts --*/
  _initialiseTranslation(): void {
    this._translate.get("selectInstruction").subscribe((res: string) => {
      this.selectInstruction = res;
    });
    this._translate.get("ReasonAssessing").subscribe((res: string) => {
      this.ReasonAssessing = res;
    });
    this._translate.get("studentIdentify").subscribe((res: string) => {
      this.studentIdentify = res;
    });
    this._translate.get("chooseMedium").subscribe((res: string) => {
      this.chooseMedium = res;
    });
    this._translate.get("ok").subscribe((res: string) => {
      this.ok = res;
    });
    this._translate.get("cancel").subscribe((res: string) => {
      this.cancel = res;
    });
    this._translate.get("submit").subscribe((res: string) => {
      this.submit = res;
    });
  }
  /*-- Getting Language Variables Ends --*/

  mySelectHandler(event, index) {}

  selectReason(reason, index) {
    this.selectedReason = reason;
  }

  /*-- Modal Dismiss --*/
  async dismiss(data) {
    // using the injected ModalController this page
    let submittedData = data;
    if (submittedData != "Cancel" && this.viewName === "view1") {
      if (this.selectedReason != undefined) {
        let studentReason = {
          student_emisid: this.studentDetail.id,
          student_name: this.studentDetail.name,
          reason: this.selectedReason.reason,
          description: "Reason for not assessing student",
        };
        await this.modalController.dismiss(studentReason);
      } else {
        this._alerService.showAlert("Please check any one");
      }
    } else {
      await this.modalController.dismiss(submittedData);
    }
  }
}
