import { Component } from "@angular/core";

import { Platform, MenuController, Events } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { OfflineManagerService } from "./services/offline-manager.service";
import { NetworkService, ConnectionStatus } from "./services/network.service";
import { Router } from "@angular/router";
import { AuthenticationService } from "./services/auth-service/authentication.service";
import { ToastService } from "./services/common_Provider/toast-service/toast.service";
import { ApiService } from "./services/api.service";
import { FileHandlerService } from "./services/file-handler/file-handler.service";
import { IonicStorageService } from "./services/ionic-storage/ionic-storage.service";
import { AppVersion } from "@ionic-native/app-version/ngx";
import { Market } from "@ionic-native/market/ngx";
import { Globalization } from "@ionic-native/globalization/ngx";
import { TranslateService } from "@ngx-translate/core";
import { LoadingService } from "./services/loading.service";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
})
export class AppComponent {
  public appPages = [
    {
      title: "Home",
      url: "/page-route/dashboardc",
      icon: "home",
    },

    // {
    //   title: 'List',
    //   url: '/list',
    //   icon: 'list'
    // },
    {
      title: "Logout",
      url: "/login",
      icon: "log-out",
    },
    {
      title: "Exit",
      url: "",
      icon: "exit",
    },
  ];
  logged_username: string = "";
  appVersionNumber: any = "";
  update_available: boolean = false;

  /*-- Language Variables Starts --*/

  public languageType: any;

  public observationTarget: any;
  public teachersTarget: any;
  public schoolsVisited: any;
  public isDisabled: boolean = false;

  /*-- Language Variables Ends --*/
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private offlineManager: OfflineManagerService,
    private networkService: NetworkService,
    private router: Router,
    private authService: AuthenticationService,
    private toastService: ToastService,
    private apiService: ApiService,
    private fileService: FileHandlerService,
    private ionicStorageService: IonicStorageService,
    private menuCtrl: MenuController,
    private appVersion: AppVersion,
    private events: Events,
    private marketOpener: Market,
    private loading: LoadingService,
    private globalization: Globalization,
    private _translate: TranslateService
  ) {
    this.initializeApp();
    let languageStatus = localStorage.getItem("language");

    if (languageStatus !== null) {
      this.languageType = languageStatus;
    } else {
      this.languageType = "en";
    }

    this.apiService.languageDisableInfo.subscribe((data: any) => {
      this.isDisabled = data;
    });
  }
  ionViewDidEnter(): void {
    this.getDeviceLanguage();
  }

  initializeApp() {
    // this.loading.present();

    this.platform.ready().then(() => {
      this.platform.backButton.subscribe(async () => {
        if (
          this.router.isActive("/page-route/dashboard", true) &&
          this.router.url === "/page-route/dashboard"
        ) {
          navigator["app"].exitApp();
        }
      });
      this.statusBar.styleDefault();
      if (this.platform.is("android")) {
        this.statusBar.styleLightContent();
      }
      this.appVersion.getVersionNumber().then((appVersion_number) => {
        if (appVersion_number) {
          this.appVersionNumber = appVersion_number;
        }
      });
      this.splashScreen.hide();
      // this.checkUpdateAvailable();
      this.checkAuthenticationState();

      this.networkService
        .onNetworkChange()
        .subscribe((status: ConnectionStatus) => {
          if (status == ConnectionStatus.Online) {
            this.offlineManager.checkForEvents().subscribe();
          }
        });
      // if(this.update_available){

      // }
    });
    // this.loading.dismiss();
  }
  downloadTemplate() {
    let status: any = [];
    this.apiService.getAllTemplates().subscribe((res) => {
      if (res["dataStatus"]) {
        status.push("success");
        if (this.platform.is("cordova")) {
          res["records"].forEach((value) => {
            // this.fileService.createDirectory("templates")
            let store = this.fileService.writeFile(value, {
              dir: "templates",
              file_name: value.template_id,
            });
          });
        }
      } else {
        status.push("fail");
      }

      let tokenData = this.authService.getTokenDetails();
      this.apiService
        .getSchoolListByBlockId(tokenData.district_id)
        .subscribe((res) => {
          if (res["dataStatus"]) {
            status.push("success");
            // let modified:any=[];
            let school_data = res["records"].filter(
              (val) => val.school_type == "Government"
            );
            let store = this.ionicStorageService.insertData_Replace(
              "schoollistbydistrictid",
              school_data
            );
          } else {
            status.push("fail");
          }

          this.apiService
            .getAllLeaningOutcomeQuestions()
            .subscribe((ques_response) => {
              if (ques_response["dataStatus"] == true) {
                status.push("success");
                this.ionicStorageService.insertData_Replace(
                  "learningoutcomeques",
                  ques_response["records"]
                );
              } else {
                status.push("fail");
              }
              let params = { start_date: null, end_date: null };
              this.apiService.getObservationList(params).subscribe((result) => {
                if (result["dataStatus"]) {
                  status.push("success");
                } else {
                  status.push("fail");
                }
              });
              if (status.filter((val) => val == "fail").length > 0) {
                this.toastService.presentToast(
                  "Data not downloaded please check your Internet",
                  "error"
                );
              } else {
                this.toastService.presentToast(
                  "Data Downloaded Successfully",
                  "dark"
                );
              }
            });
        });
    });
    this.menuCtrl.close();
  }
  checkAuthenticationState() {
    this.authService.authenticationState.subscribe((res) => {
      if (res) {
        this.logged_username = localStorage.getItem("logged_username");

        this.events.subscribe("user:signedIn", (userEventData) => {
          this.logged_username = localStorage.getItem("logged_username");
        });

        //   if (this.platform.is('cordova')) {
        //alert('cior')
        this.router.navigate(["page-route"], { replaceUrl: true });
        //  }
      } else {
        // console.log('login');
        this.router.navigate(["login"]);
        //this.router.navigate(['page-route'], {replaceUrl: true});
      }
    });
  }
  setAction(data) {
    if (data.title == "Logout") {
      this.authService.logout();
      this.toastService.presentToast("Logged Out Successfully", "warning");
      setTimeout(() => {
        this.router.navigate(["login"]);
      });
    }
    if (data.title == "Exit") {
      navigator["app"].exitApp();
    }
  }
  checkUpdateAvailable() {
    let version_info;
    this.apiService.getAppVersionInfo().subscribe((result_version) => {
      if (result_version["dataStatus"]) {
        version_info = result_version["records"][0].version;
        if (version_info != this.appVersionNumber.toString()) {
          this.toastService
            .setAlertForUpdateCheck(
              "Update Available",
              "Please update the App with latest version"
            )
            .then((result) => {
              if (result.data == "ok") {
                this.marketOpener.open("com.tnschools.schoolsapp");
              }
            });
        }
      }
    });
  }

  mySelectHandler() {
    this.apiService.languageChange(this.languageType);
    localStorage.setItem("language", this.languageType);
  }

  goDashboard(url) {
    this.router.navigate([url]);
  }

  // public changeLanguage(): void {
  //   this._translateLanguage();
  // }

  // _translateLanguage(): void {
  //   console.log('language', this.language)
  //   this._translate.use(this.language);
  //   this._initialiseTranslation();
  // }

  _initTranslate() {
    // Set the default language for translation strings, and the current language.
    this._translate.setDefaultLang("en");

    if (this._translate.getBrowserLang() !== undefined) {
      this.languageType = this._translate.getBrowserLang();
    } else {
      // Set your language here
      this.languageType = "en";
    }

    this.mySelectHandler();
  }

  getDeviceLanguage() {
    this.globalization
      .getPreferredLanguage()
      .then((res) => {
        this._initTranslate();
      })
      .catch((e: any) => {});
  }
}
