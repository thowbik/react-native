import { Component, OnInit } from "@angular/core";
import { ModalController, NavParams } from "@ionic/angular";
import { ApiService } from "src/app/services/api.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-observationmodal",
  templateUrl: "./observationmodal.component.html",
  styleUrls: ["./observationmodal.component.scss"],
})
export class ObservationmodalComponent implements OnInit {
  showTextarea = false;
  public teacherDetails: any;
  public submitted: Boolean = false;

  /*-- Language Variables Starts --*/
  public languageType: any;
  public didDiscuss: any;
  public yes: any;
  public no: any;
  public submit: any;
  public giveReason: string;
  /*-- Language Variables Ends --*/

  constructor(
    private modalController: ModalController,
    private _apiService: ApiService,
    navParams: NavParams,
    private _translate: TranslateService
  ) {
    this.teacherDetails = navParams.get("teacherDetails");
  }

  ngOnInit() {
    this._apiService.languageInfo.subscribe((data: any) => {
      this.languageType = data;
      this._translate.use(this.languageType);
      this._initialiseTranslation();
    });

    this.showTextarea = false;
  }

  _initialiseTranslation(): void {
    this._translate.get("didDiscuss").subscribe((res: string) => {
      this.didDiscuss = res;
    });
    this._translate.get("submit").subscribe((res: string) => {
      this.submit = res;
    });
    this._translate.get("yes").subscribe((res: string) => {
      this.yes = res;
    });
    this._translate.get("no").subscribe((res: string) => {
      this.no = res;
    });
    this._translate.get("giveReason").subscribe((res: string) => {
      this.giveReason = res;
    });
  }

  async dismiss(value, reason) {
    // using the injected ModalController this page

    if (value === "no") {
      const v = reason.value.trim();
      if (v.length === 0) {
        reason.value = undefined;
        this.submitted = true;
        return;
      }
    }

    const onClosedData = "Wrapped Up!";
    let body1 = document.getElementsByTagName("ion-modal")[0];
    body1.classList.remove("new-info");

    await this.modalController.dismiss(value);
    this.showTextarea = false;
  }

  addClass() {
    this._apiService.setName("showText");
  }
}
