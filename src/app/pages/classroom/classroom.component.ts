import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { ClassroommodalComponent } from "src/app/components/classroommodal/classroommodal.component";
import { ApiService } from "src/app/services/api.service";
import { Router } from "@angular/router";
import { AlertService } from "src/app/services/alert.service";
import { IonicStorageService } from "src/app/services/ionic-storage/ionic-storage.service";
import { LoadingService } from "src/app/services/loading.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-classroom",
  templateUrl: "./classroom.component.html",
  styleUrls: ["./classroom.component.scss"],
})
export class ClassroomComponent {
  public teacherDetails: any;
  public classType: any;
  public standardList: any[] = [];
  selectedStandardList: any[] = [];
  public selectedMediumIds: any[] = [];
  regularTeacher: boolean;
  toggleMultigrade: boolean = false;
  showMonograde: boolean = false;
  classInfoList: any[] = [];
  public mediumInfoList: any[] = [];
  public subjectList: any[] = [];
  public sectionList: any[] = [];
  selectedClass: any = {};
  selectedSection: any;
  selectedSubject: any;
  schoolInfo: any;
  selectedMedium: any[] = [];
  storeDetail: any;
  checkedValue: any;
  progressValue: number;
  public masterApiResponse: any;
  public gradeLabel: string;

  /*-- Language Variables Starts --*/
  public languageType: any;
  public classroom: any;
  public Details: any;
  public multigrade: any;
  public monograde: any;
  public teacherResponsible: any;
  public selectSection: any;
  public selectSubject: any;
  public Note: any;
  public mediumInstruction: any;
  public teacherClass: any;
  public ok: any;
  public cancel: any;
  public back: any;
  public next: any;
  public noSubject: any;
  public noSection: any;
  public med: any;
  public noMedium: any;
  public takeAttendance: any;
  public doIt: any;
  public giveSubject: any;
  public giveMedium: any;
  public giveClass: any;
  public giveSection: any;
  public noStudents: any;
  public multigradeSingleOptionMessage: any;
  /*-- Language Variables Ends --*/

  constructor(
    public modalController: ModalController,
    public _apiService: ApiService,
    public _router: Router,
    public _alertService: AlertService,
    public ionicStore: IonicStorageService,
    public loading: LoadingService,
    private _translate: TranslateService
  ) {}

  ionViewWillEnter() {
    this.loading.present();
    this.schoolInfo = localStorage.getItem("schoolInfo");
    this.schoolInfo = JSON.parse(this.schoolInfo);
    let teacherInfo = localStorage.getItem("teacherInfo");
    this.progressValue = Math.round(((4 - 2) / 12) * 100);
    this.appLanguage();

    this.gradeLabel = this.getGradeLabel();

    /*  Getting All Details Stored in offlineStorage....*/
    this.ionicStore.getOffStorage().then((response) => {
      this.masterApiResponse = response.records;

      /*  Getting AllPage Entered Info....*/
      this.ionicStore.getStoreData().then((response) => {
        this.storeDetail = response;
        this.storeDetail.pages.currentPage = "classRoom";
        this.ionicStore.setStoreData(this.storeDetail);
        this.teacherDetails = this.storeDetail.pages.pageData[2].pageDetails.teacherDetails;

        /*  Check This Page is Registered or Not, If 'Registered' move to 'else' part...  */
        if (this.storeDetail.pages.pageData[3] === undefined) {
          this.getSchoolInfo(
            this.storeDetail.pages.pageData[0].pageDetails.school_id
          );
        } else {
          if (
            this.storeDetail.pages.pageData[3].apiResponse.records
              .medium_info != undefined
          ) {
            this.mediumInfoList = this.storeDetail.pages.pageData[3].apiResponse.records.medium_info;
            //      //  let filteredIndex = tempStudents.map((data,index)=> index >= indexd ? index : undefined).filter(x => x) ;
            //  this.selectedMediumIds =this.mediumInfoList.map((data,index)=> data.checked === true ? data.medium_id : undefined).filter(x => x) ;
            this.selectedMedium = this.mediumInfoList.filter(
              (data, index) => data.checked === true
            );
          }
          this.subjectList = this.storeDetail.pages.pageData[3].apiResponse.records.subjects;
          this.classInfoList = this.storeDetail.pages.pageData[3].apiResponse.records.class_info;
          console.log("class info list ==> ", this.classInfoList);

          let pageDetails = this.storeDetail.pages.pageData[3].pageDetails;
          if (pageDetails != undefined) {
            // this.selectedMedium = pageDetails.mediumInfo;
            this.selectedSubject = pageDetails.subjectInfo;
            this.selectedStandardList = pageDetails.selectedClass;
            if (pageDetails.classType == "2") {
              this.toggleMultigrade = true;
              this.showMonograde = false;
              this.classType = "2";
            } else {
              this.showMonograde = true;
              this.toggleMultigrade = false;
              this.classType = "1";
              this.checkedValue = pageDetails.selectedClass[0].class_id;
              this.selectedSection = pageDetails.selectedClass[0].section;
            }
          }

          this.loading.dismiss();
        }
      });
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
    this._translate.get("classroom").subscribe((res: string) => {
      this.classroom = res;
    });
    this._translate.get("Details").subscribe((res: string) => {
      this.Details = res;
    });
    this._translate.get("takeAttendance").subscribe((res: string) => {
      this.takeAttendance = res;
    });
    this._translate.get("doIt").subscribe((res: string) => {
      this.doIt = res;
    });
    this._translate.get("giveSubject").subscribe((res: string) => {
      this.giveSubject = res;
    });
    this._translate.get("giveMedium").subscribe((res: string) => {
      this.giveMedium = res;
    });
    this._translate.get("giveClass").subscribe((res: string) => {
      this.giveClass = res;
    });
    this._translate.get("giveSection").subscribe((res: string) => {
      this.giveSection = res;
    });
    this._translate.get("multigrade").subscribe((res: string) => {
      this.multigrade = res;
    });
    this._translate.get("monograde").subscribe((res: string) => {
      this.monograde = res;
    });
    this._translate.get("teacherResponsible").subscribe((res: string) => {
      this.teacherResponsible = res;
    });
    this._translate.get("selectSubject").subscribe((res: string) => {
      this.selectSubject = res;
    });
    this._translate.get("mediumInstruction").subscribe((res: string) => {
      this.mediumInstruction = res;
    });
    this._translate.get("selectSection").subscribe((res: string) => {
      this.selectSection = res;
    });
    this._translate.get("teacherClass").subscribe((res: string) => {
      this.teacherClass = res;
    });
    this._translate.get("noSubject").subscribe((res: string) => {
      this.noSubject = res;
    });
    this._translate.get("noSection").subscribe((res: string) => {
      this.noSection = res;
    });
    this._translate.get("med").subscribe((res: string) => {
      this.med = res;
    });
    this._translate.get("noMedium").subscribe((res: string) => {
      this.noMedium = res;
    });
    this._translate.get("Note").subscribe((res: string) => {
      this.Note = res;
    });
    this._translate.get("ok").subscribe((res: string) => {
      this.ok = res;
    });
    this._translate.get("cancel").subscribe((res: string) => {
      this.cancel = res;
    });
    this._translate.get("back").subscribe((res: string) => {
      this.back = res;
    });
    this._translate.get("noStudents").subscribe((res: string) => {
      this.noStudents = res;
    });
    this._translate.get("next").subscribe((res: string) => {
      this.next = res;
    });
    this._translate
      .get("multigradeSingleOptionMessage")
      .subscribe((res: string) => {
        this.multigradeSingleOptionMessage = res;
      });
    // this._translate.get('giveReason').subscribe((res: string) => {
    //   this.giveReason = res;
    //PLEAES GIVE A REASON
    // });
  }

  getSchoolInfo = (schoolId) => {
    // this._apiService.getSchoolClassInfo(schoolId)
    //   .subscribe((response: any) => {
    let records = {
      class_info: this.masterApiResponse.school_class_info,
      subjects: [],
    };
    this.classInfoList = records.class_info;
    this.loading.dismiss();
    /*  Registering This Page in Storage ....*/
    let apiData = {
      pageNo: "4",
      pageName: "classRoom",
      apiResponse: {
        records: records,
      },
    };
    this.storeDetail.pages.pageData[3] = apiData;
    this.ionicStore.setStoreData(this.storeDetail);
    // }, (error: any) => {
    //   this.loading.dismiss();

    // });
  };

  getGradeLabel() {
    switch (this.classType) {
      case "1":
      case 1:
        return this.monograde;
      case "2":
      case 2:
        return this.multigrade;
      default:
        return `${this.multigrade}/${this.monograde}`;
    }
  }

  mySelectHandler(event) {
    let classRoomType = event;
    this.checkedValue = "";
    this.selectedStandardList = [];
    this.customClassInfo(this.classInfoList);

    if (classRoomType == "1") {
      this.showMonograde = true;
      this.toggleMultigrade = false;
      this.classType = "1";
      this.mediumInfoList = [];
      this.selectedMedium = [];
      this.subjectList = [];
      this.selectedSubject = "undefined";
    } else {
      this.toggleMultigrade = true;
      this.showMonograde = false;
      this.classType = "2";
      this.mediumInfoList = [];
      this.selectedMedium = [];
      this.subjectList = [];

      this.selectedSubject = "undefined";
    }

    this.gradeLabel = this.getGradeLabel();
    this.storeDetail.pages.pageData[3].apiResponse.records.medium_info = this.mediumInfoList;
    this.ionicStore.setStoreData(this.storeDetail);
  }

  /*  Modal Open ....*/
  async presentModal() {
    const modal = await this.modalController.create({
      component: ClassroommodalComponent,
      cssClass: " my-custom-modal-classroom",
    });

    return await modal.present();
  }

  mediumSelectHandler(event) {
    let selectedMediumList = event.detail.value;
    this.selectedMedium = this.mediumInfoList.filter((mediumInfo) =>
      selectedMediumList.includes(mediumInfo.medium_id)
    );
    this.mediumInfoList.forEach((data, index) => {
      this.mediumInfoList[index].checked = false;
    });
    selectedMediumList.forEach((data) => {
      this.mediumInfoList.forEach((mediuminfo, index) => {
        if (mediuminfo.medium_id == data) {
          this.mediumInfoList[index].checked = true;
        }
      });
    });

    this.storeDetail.pages.pageData[3].apiResponse.records.medium_info = this.mediumInfoList;
    this.ionicStore.setStoreData(this.storeDetail);
    let selectedClass = this.selectedStandardList.map((el) => {
      return el.class_id;
    });
    let classDetail = {
      class_id: selectedClass.toString(),
      medium_id: selectedMediumList,
    };
    let allSubjectData = this.masterApiResponse.subject_datas.subjects;
    let subjects = [];

    Object.entries(allSubjectData).forEach(([key, value]) => {
      if (selectedClass.includes(key)) {
        let mediumSubject = value;
        Object.entries(mediumSubject).forEach(([mediumKey, valuem]) => {
          let tempSubject = valuem;
          if (selectedMediumList.includes(mediumKey)) {
            tempSubject.forEach((subjectInfo, index) => {
              if (!subjects.length) {
                subjects.push(subjectInfo);
              } else {
                let subjectIds = subjects.map((data) => {
                  return data.subject_id;
                });
                if (!subjectIds.includes(subjectInfo.subject_id) == true) {
                  subjects.push(subjectInfo);
                }
              }
            });
          }
        });
      }
    });

    this.subjectList = subjects;
    this.storeDetail.pages.pageData[3].apiResponse.records.subjects = this.subjectList;
    this.ionicStore.setStoreData(this.storeDetail);
    // this._apiService.getAllSubjects(classDetail)
    //   .subscribe((response: any) => {
    //     this.subjectList = response.records.subjects;
    //     this.storeDetail.pages.pageData[3].apiResponse.records.subjects = this.subjectList;
    //     this.ionicStore.setStoreData(this.storeDetail);
    //   }, (error: any) => {
    //   });
  }
  sectionHandler(event) {
    this.selectedSection = event;
  }
  subjectSelectHandler(event) {
    this.selectedSubject = event;
  }
  selectStandard = (type, standard, index) => {
    let typeData = type;
    if (typeData === "checkbox") {
      this.selectedStandardList = [];
      this.classInfoList[index].checked = !standard.checked;
      this.selectedStandardList = this.classInfoList.filter(
        (standard, index) => standard.checked == true
      );
      this.getMediumList(this.selectedStandardList);
    } else {
      this.selectedStandardList = [];
      this.selectedStandardList[0] = standard;
      this.sectionList = standard.section.split(",");
      this.getMediumList(this.selectedStandardList);
    }
  };

  getMediumList = (selectedStandardList) => {
    let classIds = selectedStandardList.map((data) => {
      return data.class_id;
    });
    let allMediumList = this.masterApiResponse.subject_datas.medium_info;
    let tempMediumList = [];
    Object.entries(allMediumList).forEach(([key, value]) => {
      if (classIds.includes(key)) {
        let mediumData;
        mediumData = value;
        if (mediumData !== false) {
          mediumData.forEach((data) => {
            if (!tempMediumList.length) {
              tempMediumList.push(data);
            } else {
              let tempMediumListIds = tempMediumList.map((data) => {
                return data.medium_id;
              });
              if (!tempMediumListIds.includes(data.medium_id)) {
                tempMediumList.push(data);
              }
            }
          });
        }
      }
    });

    this.mediumInfoList = [];
    this.mediumInfoList = tempMediumList;
    this.mediumInfoList.forEach((data) => {
      data["checked"] = false;
    });
    this.storeDetail.pages.pageData[3].apiResponse.records[
      "medium_info"
    ] = this.mediumInfoList;
    this.ionicStore.setStoreData(this.storeDetail);
  };

  ionViewWillLeave() {
    this.toggleMultigrade = false;
    this.showMonograde = false;
  }

  isEmptyObject(obj) {
    var name;
    for (name in obj) {
      return false;
    }
    return true;
  }

  async goToStudentAttendance() {
    let classInfo = {
      mediumInfo: this.selectedMedium,
      subjectInfo: this.selectedSubject,
      classType: this.classType,
      selectedClass: this.selectedStandardList,
    };
    if (this.classType == "1") {
      classInfo["section"] = this.selectedSection;
    }

    if (this.classType == "2" && this.selectedStandardList.length < 2) {
      this._alertService.showAlert(
        this.multigrade,
        this.multigradeSingleOptionMessage
      );
      return;
    }

    if (this.selectedStandardList.length) {
      if (this.selectedMedium.length) {
        if (this.selectedSubject !== "undefined") {
          if (this.storeDetail.pages.pageData[3].pageDetails !== undefined) {
            let previousMedium = this.storeDetail.pages.pageData[3].pageDetails.mediumInfo.map(
              (el) => {
                return el.medium_id;
              }
            );
            let currentMedium = classInfo.mediumInfo.map((el) => {
              return el.medium_id;
            });

            if (
              previousMedium.toString() === currentMedium.toString() &&
              this.storeDetail.pages.pageData[3].pageDetails.subjectInfo
                .subject_id === classInfo.subjectInfo.subject_id &&
              this.storeDetail.pages.pageData[3].pageDetails.classType ===
                classInfo.classType
            ) {
              let previousClass = this.storeDetail.pages.pageData[3].pageDetails.selectedClass.map(
                (el) => {
                  return el.class_id;
                }
              );
              let currentClass = this.selectedStandardList.map((el) => {
                return el.class_id;
              });
              if (this.classType == "1") {
                if (
                  this.selectedSection !==
                  this.storeDetail.pages.pageData[3].pageDetails.section
                ) {
                  this.storeDetail.pages.pageData.splice(4);
                  this.ionicStore.setStoreData(this.storeDetail);
                }
              }

              if (previousClass.toString() !== currentClass.toString()) {
                this.storeDetail.pages.pageData.splice(4);
                this.ionicStore.setStoreData(this.storeDetail);
              }
            } else {
              let a = JSON.parse(JSON.stringify(this.storeDetail));
              this.storeDetail.pages.pageData.splice(4);
              this.ionicStore.setStoreData(this.storeDetail);
            }
          } else {
            this.storeDetail.pages.pageData[3]["pageDetails"] = classInfo;
            this.storeDetail.pages.pageData[3]["correctedDetails"] =
              classInfo.selectedClass;
          }
          this.storeDetail.pages.pageData[3].pageDetails = classInfo;
          this.storeDetail.pages.pageData[3].correctedDetails =
            classInfo.selectedClass;

          let allStudents = this.masterApiResponse.StudentsData.all;
          let temp_SelectedClassIds = classInfo.selectedClass.map((data) => {
            return data.class_id;
          });
          let selectedClassStudents = allStudents.filter((data) =>
            temp_SelectedClassIds.includes(data.class_studying_id)
          );

          if (selectedClassStudents.length) {
            this.storeDetail.pages.currentProgress = this.progressValue;
            this.ionicStore.setStoreData(this.storeDetail);
            this.pageRedirect();
          } else {
            this._alertService.showAlert(this.noStudents);
          }
        } else {
          this._alertService.showAlert(this.giveSubject);
        }
      } else {
        this._alertService.showAlert(this.giveMedium);
      }
    } else {
      this._alertService.showAlert(this.giveClass);
    }
  }

  customClassInfo = (classInfoList) => {
    classInfoList.forEach((data, index) => {
      this.classInfoList[index] = data;
      this.classInfoList[index]["checked"] = false;
    });
  };

  mediumSelectHandlerMultiple(event) {}

  pageRedirect() {
    if (this.classType == "2") {
      this._router.navigate(["/page-route/attendance/student-attendance"]);
    } else if (this.selectedSection != undefined) {
      this._router.navigate(["/page-route/attendance/student-attendance"]);
    } else {
      this._alertService.showAlert(this.giveSection);
    }
  }
}
