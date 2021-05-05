import { Injectable } from "@angular/core";
import { AlertController } from "@ionic/angular";
import { ApiService } from "./api.service";
import { TranslateService } from "@ngx-translate/core";

@Injectable({
  providedIn: "root",
})
export class AlertService {
  public languageType: any;
  public ok: any;

  constructor(
    public alertController: AlertController,
    public apiService: ApiService,
    private _translate: TranslateService
  ) {
    this.appLanguage();
  }

  appLanguage() {
    this.apiService.languageInfo.subscribe((data: any) => {
      this.languageType = data;
      // if(this.languageType === 'en'){
      //   this.sectionList = this.masterApiResponse? this.masterApiResponse.Observations.methodologys.en:"";
      //   }else if(this.languageType === 'ta'){
      //     this.sectionList = this.masterApiResponse? this.masterApiResponse.Observations.methodologys.ta:"";
      //   }else{

      //   }
      this._translate.use(this.languageType);
      this._initialiseTranslation();
    });
  }

  _initialiseTranslation(): void {
    this._translate.get("ok").subscribe((res: string) => {
      this.ok = res;
    });
  }

  /*  Alert popup .....  */
  async showAlert(alertInfo = "", message = "") {
    const alert = await this.alertController.create({
      header: alertInfo,
      message: message,
      buttons: [{ text: this.ok }],
    });
    await alert.present();
  }
}
