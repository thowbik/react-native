import { Component, OnInit } from "@angular/core";
import { ModalController, NavParams } from "@ionic/angular";
import { AlertService } from "src/app/services/alert.service";
import { ApiService } from "src/app/services/api.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-emimodal",
  templateUrl: "./emimodal.component.html",
  styleUrls: ["./emimodal.component.scss"],
})
export class EmimodalComponent implements OnInit {
  listedValue: any;
  actualValue: any;
  selectedValue: any;
  divisionType: any;
  correction: any;
  /*-- Language Variables Starts --*/
  public languageType: any;
  public correctionIn: any;
  public listed_Value: any;
  public actual_Value: any;
  public cancel: any;
  public submit: any;
  public chooseItem: any;
  public showCategory: any;
  /*-- Language Variables Ends --*/

  constructor(
    private modalController: ModalController,
    navParams: NavParams,
    public _alerService: AlertService,
    public _apiService: ApiService,
    private _translate: TranslateService
  ) {
    this.listedValue = navParams.get("listedValue");
    this.actualValue = navParams.get("actualValue");
    this.divisionType = navParams.get("divisionType");
    this.correction = navParams.get("correction");
    this.showCategory = navParams.get("showCategory");
  }

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
    this._translate.get("correctionIn").subscribe((res: string) => {
      this.correctionIn = res;
    });
    this._translate.get("listed_Value").subscribe((res: string) => {
      this.listed_Value = res;
    });
    this._translate.get("actual_Value").subscribe((res: string) => {
      this.actual_Value = res;
    });
    this._translate.get("cancel").subscribe((res: string) => {
      this.cancel = res;
    });
    this._translate.get("submit").subscribe((res: string) => {
      this.submit = res;
    });
    this._translate.get("chooseItem").subscribe((res: string) => {
      this.chooseItem = res;
    });
  }

  mySelectHandler(selectedValue, index) {
    this.selectedValue = selectedValue;
  }

  async dismiss(data) {
    // using the injected ModalController this page
    if (data != "Cancel") {
      const correctedValue = data;
      if (correctedValue != undefined) {
        await this.modalController.dismiss(correctedValue);
      } else {
        this._alerService.showAlert(null, "Please fill the actual value");
      }
    } else {
      await this.modalController.dismiss(data);
    }
  }
}
