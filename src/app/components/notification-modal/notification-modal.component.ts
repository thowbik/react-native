import { Component, OnInit } from "@angular/core";
import { ModalController, NavParams } from "@ionic/angular";
import { AlertService } from "src/app/services/alert.service";
import { ApiService } from "src/app/services/api.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-notification-modal",
  templateUrl: "./notification-modal.component.html",
  styleUrls: ["./notification-modal.component.scss"],
})
export class NotificationModalComponent implements OnInit {
  /*-- Language Variables Starts --*/
  public languageType: any;
  public notificationHeading: any;
  public cancel: any;
  /*-- Language Variables Ends --*/

  constructor(
    private modalController: ModalController,
    public navParams: NavParams,
    public _alertService: AlertService,
    public _apiService: ApiService,
    private _translate: TranslateService
  ) {}

  ngOnInit() {
    this.appLanguage();
  }

  appLanguage() {
    this._apiService.languageInfo.subscribe((data: any) => {
      this.languageType = data;
      this._translate.use(this.languageType);
      this._initialiseTranslation();
    });
  }

  _initialiseTranslation(): void {
    this._translate.get("notificationHeading").subscribe((res: string) => {
      this.notificationHeading = res;
    });
    this._translate.get("cancel").subscribe((res: string) => {
      this.cancel = res;
    });
  }

  async dismiss(data) {
    await this.modalController.dismiss(data);
  }
}
