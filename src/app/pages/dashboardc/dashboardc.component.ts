import { Component, OnInit } from "@angular/core";
import {
  ModalController,
  AlertController,
  LoadingController,
} from "@ionic/angular";
import { DashboardmodalComponent } from "src/app/components/dashboardmodal/dashboardmodal.component";
import { NavigationComponent } from "src/app/components/navigation/navigation.component";
import { ApiService } from "src/app/services/api.service";
import { Router } from "@angular/router";
import { elementStyleProp, store } from "@angular/core/src/render3";
import { LoadingService } from "src/app/services/loading.service";
import { PostService } from "src/app/services/post.service";
import { IonicStorageService } from "src/app/services/ionic-storage/ionic-storage.service";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { Observable } from "rxjs";
import { AlertService } from "src/app/services/alert.service";
import { TranslateService } from "@ngx-translate/core";
import { Globalization } from "@ionic-native/globalization/ngx";

@Component({
  selector: "app-dashboardc",
  templateUrl: "./dashboardc.component.html",
  styleUrls: ["./dashboardc.component.scss"],
})
export class DashboardcComponent {
  lname: string = "";
  allSchoolList: any[] = [];
  visitedSchoolList: any[] = [];
  unVisitedSchoolList: any[] = [];
  selectedSchool: any;
  sSchool: any;
  currentDate: string = "";
  schoolReasons: any[] = [];
  todayQuotes: any;
  targetDetails: any;
  observedDetails: any;
  observedSchool: number;
  observedTeacher: number;
  schoolReasonList: any[] = [];
  public storeDetail: any;
  sample: boolean = false;
  imageData: any;
  image: any;
  pageMoved: any;
  currentPercentage: number;
  checkData: any;
  public languageType: any;
  public newv: any;
  public continue: any;
  public start: any;
  public completed: any;
  public masterApiResponse: any;

  /*-- Language Variables Starts --*/
  public welcome: any;
  public observationTarget: any;
  public teachersTarget: any;
  public schoolsVisited: any;
  public teachersObserved: any;
  public observedOn: any;
  public chooseSchool: any;
  public noSchool: any;
  public classroomObservation: any;
  public greetings: any;
  public noneAbove: any;
  public noTeacherFound: any;
  public noStudentsFound: any;
  public fetchingText: any;
  /*-- Language Variables Ends --*/

  constructor(
    public loading: LoadingService,
    public modalController: ModalController,
    private _apiService: ApiService,
    public _postService: PostService,
    private _router: Router,
    private camera: Camera,
    public alertController: AlertController,
    public ionicStore: IonicStorageService,
    public _alertService: AlertService,
    private globalization: Globalization,
    private _translate: TranslateService
  ) {}

  ionViewWillEnter() {
    this.unVisitedSchoolList = [];
    /*Getting FinalInfo to Check if last submitted data is Success (or) Not*/
    this.ionicStore.getFinalData().then((response) => {
      if (response !== null) {
        /* Last Submitted Data is still there not Success... */
        this._apiService.postfinalinfo(response).subscribe(
          (data) => {
            this.ionicStore.removeFinalData();
            this.selectedSchool = undefined;
            this.pageMoved = undefined;
            this.dashboardPageInitiates();
            this._apiService.languageDisableUpdate(false);
          },
          (error) => {
            this.ionicStore.removeFinalData();
            this.selectedSchool = undefined;
            this.pageMoved = undefined;
            this.dashboardPageInitiates();
            this._apiService.languageDisableUpdate(false);
          }
        );
      } else {
        // this.selectedSchool = undefined;
        // this.pageMoved = undefined;

        /* First Visit or Last Submitted Data got success....*/
        this.dashboardPageInitiates();
      }
    });

    let languageStatus = localStorage.getItem("language");

    if (languageStatus !== null) {
      this.languageType = languageStatus;
      // this._translate.use(this.languageType);
      //    this._initialiseTranslation();
      this._apiService.languageChange(this.languageType);
      this.appLanguage();
    } else {
      this.appLanguage();
    }
  }

  /*  Getting language Info... */
  appLanguage = () => {
    this._apiService.languageInfo.subscribe((data: any) => {
      this.languageType = data;
      this._translate.use(this.languageType);
      this._initialiseTranslation();
    });
  };

  _initialiseTranslation(): void {
    this._translate.get("welcome").subscribe((res: string) => {
      this.welcome = res;
    });
    this._translate.get("observationTarget").subscribe((res: string) => {
      this.observationTarget = res;
    });
    this._translate.get("teachersTarget").subscribe((res: string) => {
      this.teachersTarget = res;
    });
    this._translate.get("schoolsVisited").subscribe((res: string) => {
      this.schoolsVisited = res;
    });
    this._translate.get("teachersObserved").subscribe((res: string) => {
      this.teachersObserved = res;
    });
    this._translate.get("observedOn").subscribe((res: string) => {
      this.observedOn = res;
    });
    this._translate.get("classroomObservation").subscribe((res: string) => {
      this.classroomObservation = res;
    });
    this._translate.get("chooseSchool").subscribe((res: string) => {
      this.chooseSchool = res;
    });
    this._translate.get("noSchool").subscribe((res: string) => {
      this.noSchool = res;
    });
    this._translate.get("greetings").subscribe((res: string) => {
      this.greetings = res;
    });

    this._translate.get("continue").subscribe((res: string) => {
      this.continue = res;
    });
    this._translate.get("start").subscribe((res: string) => {
      this.start = res;
    });
    this._translate.get("noneAbove").subscribe((res: string) => {
      this.noneAbove = res;
    });
    this._translate.get("completed").subscribe((res: string) => {
      this.completed = res;
    });
    this._translate.get("noTeacherFound").subscribe((res: string) => {
      this.noTeacherFound = res;
    });
    this._translate.get("noStudentsFound").subscribe((res: string) => {
      this.noStudentsFound = res;
    });
    this._translate.get("fetchingText").subscribe((res: string) => {
      this.fetchingText = res;
    });
  }

  dashboardPageInitiates() {
    this.getSchoolList();

    /*check if Already we stored the  whole data */
    this.ionicStore.getOffStorage().then((response) => {
      if (response !== null) {
        this.masterApiResponse = response.records;
      }
    });

    /*  Getting AllPage Entered Info....*/
    this.ionicStore.getStoreData().then((response) => {
      this.storeDetail = response;

      /*  Check This Page is Registered or Not, If 'Registered' move to 'else' part...  */
      if (this.storeDetail === null) {
        this.selectedSchool = undefined;
        this._apiService.languageDisableUpdate(false);
        this.pageMoved = undefined;
        let tempData = {
          pages: {
            pageData: [],
            currentProgress: 0,
            currentPage: "",
          },

          dependency: {
            dashboard: ["emiVerfiy"],
            emiVerfiy: [],
            teacherSeleciton: [],
            classRoom: [
              "stu_Attendance",
              "teachingObservation",
              "teachingMethodology",
              "stu_Assessment_term",
              "stu_Assessment_accessed",
              "stu_Assessment_questions",
              "observationReport",
              "mismatchAttendance",
              "observationDiscussion_DIKSHA",
              "ObservationReport_update",
              "Observation_complete_percentage",
            ],

            stu_Attendance: ["mismatchAttendance"],
            teachingObservation: [
              "teachingMethodology",
              "stu_Assessment_term",
              "stu_Assessment_accessed",
              "stu_Assessment_questions",
              "observationReport",
              "mismatchAttendance",
              "observationDiscussion_DIKSHA",
              "ObservationReport_update",
              "Observation_complete_percentage",
            ],
            teachingMethodology: [],
            stu_Assessment_term: ["stu_Assessment_questions"],
            stu_Assessment_accessed: ["stu_Assessment_questions"],
            stu_Assessment_questions: [],
            observationReport: [],
            mismatchAttendance: [],
            ObservationReport_update: [],
            Observation_complete_percentage: [],
          },
        };
        this.ionicStore.setStoreData(tempData);
        this.ionicStore.getStoreData().then((response) => {
          this.storeDetail = response;
        });
      } else {
        if (this.storeDetail.pages.pageData.length) {
          this.selectedSchool = this.storeDetail.pages.pageData[0].pageDetails;
          this.sSchool = this.selectedSchool.school_id;
          this.pageMoved = this.storeDetail.pages.pageData[0].pageMoved;
          if (this.pageMoved === "yes") {
            this._apiService.languageDisableUpdate(true);
          }
        }
        if (Object.keys(this.storeDetail.pages).length) {
          this.currentPercentage = this.storeDetail.pages.currentProgress;
        }
      }
    });
  }

  /*  GETTING SCHOOL LIST ....................*/

  getSchoolList = () => {
    this.loading.present();
    const userName = localStorage.getItem("username");
    let userDetail = {
      username: userName,
    };
    this._apiService.getSchoolList(userDetail).subscribe(
      (response: any) => {
        this.allSchoolList =
          response.records.school_info.All !== false
            ? response.records.school_info.All
            : [];
        const tempAllSchoolList =
          response.records.school_info.All !== false
            ? response.records.school_info.All
            : [];
        // this.visitedSchoolList = response.records.school_info.recentlyVisited;
        if (!this.visitedSchoolList.length) {
          var arr = [];
          while (arr.length < 3) {
            var r = Math.floor(Math.random() * tempAllSchoolList.length);
            if (arr.indexOf(r) === -1) arr.push(r);
          }
          for (let i = 0; i < arr.length; i++) {
            if (tempAllSchoolList.length) {
              let idx = arr[i];
              // idx = Math.floor(Math.random() * tempAllSchoolList.length);
              this.unVisitedSchoolList[i] = tempAllSchoolList[idx];
              // tempAllSchoolList.splice(idx, 1);
            }
          }
        } else {
          const tempUnvisitedSchoolList = this.allSchoolList.filter((cv) => {
            return !this.visitedSchoolList.find((e) => {
              return e.school_id == cv.school_id;
            });
          });

          var arr = [];
          while (arr.length < 3) {
            var r = Math.floor(Math.random() * tempUnvisitedSchoolList.length);
            if (arr.indexOf(r) === -1) arr.push(r);
          }
          for (let i = 0; i < arr.length; i++) {
            if (tempUnvisitedSchoolList.length) {
              let idx = arr[i];
              // idx = Math.floor(Math.random() * tempUnvisitedSchoolList.length);
              this.unVisitedSchoolList[i] = tempUnvisitedSchoolList[idx];
              // tempUnvisitedSchoolList.splice(idx, 1);
            }
          }
        }
        // to remove the undefined from the array, if any.
        this.unVisitedSchoolList.filter((unv) => unv);
        this.loading.dismiss();
        this.currentDate = response.records.current_date;
        this.schoolReasons =
          response.records.school_reasons !== false
            ? response.records.school_reasons
            : [];
        this.todayQuotes = response.records.today_quotes;
        this.targetDetails = response.records.targets;
        this.observedDetails = response.records.school_info.observed[0];
        this.observedSchool = Number(
          Number(this.observedDetails.schools_visited) /
            Number(this.targetDetails.schoolTarget.target_value)
        );
        this.observedTeacher = Number(
          Number(this.observedDetails.teachers_observed) /
            Number(this.targetDetails.teacherTarget.target_value)
        );
      },
      (error: any) => {
        this.loading.dismiss();
        this._alertService.showAlert("SOMETHING WENT WRONG");
      }
    );
  };

  async quickNavigation() {
    const modal = await this.modalController.create({
      component: NavigationComponent,
      cssClass: "my-custom-modal",
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

  mySelectHandler(event, _sSchool) {
    // This needs to be handled, for temporary, it's fixed this way
    if (event === "none") {
      this.selectedSchool = {};
      this.presentModal();
    } else {
      let a = this.unVisitedSchoolList.find((data) => data.school_id == event);
      this.selectedSchool = a;
      this.fetchOfflineData();
    }
  }

  /* MODAL POPUP OPEN AND CLOSE .............*/

  async presentModal() {    
    const modal = await this.modalController.create({
      component: DashboardmodalComponent,
      cssClass: "my-custom-modal-dashboarc",
      backdropDismiss: false,
      componentProps: {
        schoolReason: this.schoolReasons,
        allSchoolList: this.allSchoolList,
        unVisitedSchoolList: this.unVisitedSchoolList,
      },
    });

    modal.onDidDismiss().then((response) => {
      if (response.data !== "Cancel") {
        this.schoolReasonList = response.data.reasonList;
        this.selectedSchool = response.data.schoolDetail;

        // let schoolInn  = {
        //     school_id: "26112",
        //     school_name: "PUMS,PERUMANALLUR"
        // };
        //  this.selectedSchool = response.data.schoolDetail;

        this.fetchOfflineData();
      }
    });
    return await modal.present();
  }

  async fetchOfflineData() {
    this.loading.present(this.fetchingText);
    await this._apiService.getAllData(this.selectedSchool.school_id).subscribe(
      (data: any) => {
        if (data.status === 200 && data.dataStatus === true) {
          this.masterApiResponse = data.records;
          this.ionicStore.setOffStorage(data);
          if (this.unVisitedSchoolList.some((item) => item.school_id == this.selectedSchool.school_id)) {
            this.unVisitedSchoolList=this.unVisitedSchoolList.filter((item)=>item.school_id!==this.selectedSchool.school_id)
        }else{
          this.unVisitedSchoolList.splice(0, 1);
        }          
          this.unVisitedSchoolList.push(this.selectedSchool);
          this.sSchool = this.selectedSchool.school_id;
          const found = this.unVisitedSchoolList.includes(this.selectedSchool);

          if (found) {
            this.loading.dismiss();
          }
        }
      },
      (error) => {}
    );
  }

  async goToEmiVerify() {
    if (this.pageMoved === undefined) {
      if (
        this.selectedSchool === undefined ||
        (Object.keys(this.selectedSchool).length === 0 &&
          this.selectedSchool.constructor === Object)
      ) {
        this._alertService.showAlert(this.chooseSchool);
      } else {
        let allStudents = this.masterApiResponse.StudentsData.all;
        if (
          this.masterApiResponse.teachers_details.teacher_name == null ||
          this.masterApiResponse.teachers_details.teacher_emisid == null
        ) {
          this._alertService.showAlert(this.noTeacherFound);
        } else if (allStudents == false) {
          this._alertService.showAlert(this.noStudentsFound);
        } else {
          /*  Registering This Page in Storage ....*/
          let pageValues = {
            pageNo: "1",
            pageName: "dashboard",
            pageDetails: {
              school_id: this.selectedSchool.school_id,
              school_name: this.selectedSchool.school_name,
              schoolsReasons: this.schoolReasonList,
            },
            pageMoved: "yes",
          };

          this.ionicStore.getStoreData().then((response) => {
            this.storeDetail = response;
            this.storeDetail.pages.pageData[0] = pageValues;
            this.ionicStore.setStoreData(this.storeDetail);
            this._apiService.languageDisableUpdate(true);
            this._router.navigate([
              "/page-route/emiverify",
              this.selectedSchool.school_id,
            ]);
          });
        }
      }
    } else {
      /* Redirecting to the Last Visited Page....*/
      let currentPage = this.storeDetail.pages.currentPage;
      switch (currentPage) {
        case "emiVerfiy": {
          this._router.navigate([
            "/page-route/emiverify",
            this.selectedSchool.school_id,
          ]);
          break;
        }
        case "teacherSeleciton": {
          this._router.navigate(["/page-route/teacher-selection"]);
          break;
        }
        case "classRoom": {
          this._router.navigate(["/page-route/classroom"]);
          break;
        }
        case "stu_Attendance": {
          this._router.navigate(["/page-route/attendance/student-attendance"]);
          break;
        }
        case "teachingMethodology": {
          this._router.navigate(["/page-route/methodology"]);
          break;
        }
        case "stu_Assessment_term": {
          this._router.navigate(["/page-route/assessment"]);
          break;
        }
        case "stu_Assessment_accessed": {
          this._router.navigate(["/page-route/attendance/student-attendance"]);
          break;
        }
        case "stu_Assessment_questions": {
          this._router.navigate(["/page-route/assessment/student-performance"]);
          break;
        }
        case "observationReport": {
          this._router.navigate(["/page-route/observation"]);
          break;
        }
        case "ObservationReport_update": {
          this._router.navigate(["/page-route/observation/updateObservation"]);

          break;
        }
        case "Observation_complete_percentage": {
          this._router.navigate(["/page-route/observation/endObservation"]);
          break;
        }

        case "Other_classroom": {
          this._router.navigate(["/page-route/attendance"]);
          break;
        }

        case "other_class_attendance": {
          this._router.navigate([
            "/page-route/attendance/otherClass-attendance",
          ]);
          break;
        }

        default: {
          this._router.navigate([
            "/page-route/emiverify",
            this.selectedSchool.school_id,
          ]);
          break;
        }
      }
    }
  }
}
