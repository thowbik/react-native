import { Component, OnInit } from "@angular/core";
import { ModalController, AlertController } from "@ionic/angular";
import { EmimodalComponent } from "src/app/components/emimodal/emimodal.component";
import { ApiService } from "src/app/services/api.service";
import { ActivatedRoute, Router } from "@angular/router";
import { LoadingService } from "src/app/services/loading.service";
import { AlertService } from "src/app/services/alert.service";
import { PostService } from "src/app/services/post.service";
import { IonicStorageService } from "src/app/services/ionic-storage/ionic-storage.service";
import { Globalization } from "@ionic-native/globalization/ngx";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-emiverify",
  templateUrl: "./emiverify.component.html",
  styleUrls: ["./emiverify.component.scss"],
})
export class EmiverifyComponent {
  schoolId: any;
  schoolDetails: any;
  classList: any[] = [];
  check: boolean = true;
  actualValueList: any[] = [];
  divisionType: any;
  public storeDetail: any;
  listedDistrict: boolean = false;
  listedEduDistrict: boolean = false;
  listedBlock: boolean = false;
  listedZone: boolean = false;
  listedTotalTeachers: boolean = false;
  listedTotalStudents: boolean = false;
  correctedDistrict: string = "";
  correctedEduDistrict: string = "";
  correctedBlock: string = "";
  correctedZone: string = "";
  correctedTotalTeachers: string = "";
  correctedTotalStudents: string = "";
  presentValue: any;
  correctedClass: any[] = [];
  isOpen: boolean = false;
  actualDetails: any;
  vacancies: any;
  masterApiResponse: any;
  teacherSanctionedValue: any;
  teachersAvailableValue: any;
  teachersDeputationSameSchoolValue: any;
  teachersDeputationOtherSchoolValue: any;
  teachersOnLongLeaveValue: any;

  /*-- Language Variables Starts --*/
  public languageType: any;
  public Verification: any;
  public school: any;
  public primary: any;
  public secondary: any;
  public middle: any;
  public district: any;
  public educationalDistrict: any;
  public block: any;
  public zone: any;
  public teachersTotal: any;
  public studentsTotal: any;
  public boysTotal: any;
  public girlsTotal: any;
  public class: any;
  public back: any;
  public next: any;
  public giveCheck: any;
  public enterVacancy: any;
  public vacanciesTotal: any;

  public teacherSanctioned: string;
  public teachersAvailable: string;
  public teachersDeputationSameSchool: string;
  public teachersDeputationOtherSchool: string;
  public teachersOnLongLeave: string;

  public teacherSanctionedRequired: string;
  public teachersAvailableRequired: string;
  public teachersDeputationSameSchoolRequired: string;
  public teachersDeputationOtherSchoolRequired: string;
  public teachersOnLongLeaveRequired: string;

  public submitted: boolean = false;

  /*-- Language Variables Ends --*/
  constructor(
    public loading: LoadingService,
    public modalController: ModalController,
    public _router: Router,
    public _apiService: ApiService,
    private activatedRoute: ActivatedRoute,
    public _alertService: AlertService,
    public _postService: PostService,
    public ionicStore: IonicStorageService,
    private globalization: Globalization,
    private _translate: TranslateService
  ) {}

  ionViewWillEnter() {
    this.loading.present();
    this.appLanguage();

    /*  Getting All Details Stored in offlineStorage....*/
    this.ionicStore.getOffStorage().then((response) => {
      if (response) {
        this.masterApiResponse = response.records;
      }

      /*  Getting AllPage Entered Info....*/
      this.ionicStore.getStoreData().then((response) => {
        this.storeDetail = response;
        // this.storeDetail.pages.pageData.splice(1);
        // this.ionicStore.setStoreData(this.storeDetail);

        this.storeDetail.pages.currentPage = "emiVerfiy";
        this.ionicStore.setStoreData(this.storeDetail);
        /*  Check This Page is Registered or Not, If 'Registered' move to 'else' part...  */
        if (this.storeDetail.pages.pageData[1] === undefined) {
          this.getSchoolDetails(
            this.storeDetail.pages.pageData[0].pageDetails.school_id
          );
        } else {
          this.schoolDetails = this.storeDetail.pages.pageData[1].apiResponse.records;
          this.actualDetails = this.storeDetail.pages.pageData[1].apiResponse.records;
          this.classList = this.schoolDetails.class_info.filter(
            (data, index) => data.total != 0
          );
          this.correctedClass = this.storeDetail.pages.pageData[1].correctedClass;
          this.loading.dismiss();

          let correctedValue = this.storeDetail.pages.pageData[1]
            .correctedDetails;
          if (Object.keys(correctedValue).length) {
            this.correctedDistrict = correctedValue.district_name;
            this.correctedEduDistrict = correctedValue.edu_district_name;
            this.correctedBlock = correctedValue.block_name;
            this.correctedZone = correctedValue.nodal_name;
            this.correctedTotalTeachers = correctedValue.teachers_alloted;
            this.vacancies = correctedValue.vacancies;
            this.correctedTotalStudents = correctedValue.total_students;

            this.teacherSanctionedValue = correctedValue.teacherSanctioned;
            this.teachersAvailableValue = correctedValue.teachersAvailable;
            this.teachersDeputationSameSchoolValue =
              correctedValue.teachersDeputationSameSchool;
            this.teachersDeputationOtherSchoolValue =
              correctedValue.teachersDeputationOtherSchool;
            this.teachersOnLongLeaveValue = correctedValue.teachersOnLongLeave;

            (this.listedZone = this.correctedZone != "" ? false : true),
              (this.listedBlock = this.correctedBlock != "" ? false : true),
              (this.listedEduDistrict =
                this.correctedEduDistrict != "" ? false : true),
              (this.listedDistrict =
                this.correctedDistrict != "" ? false : true),
              (this.listedTotalStudents =
                this.correctedTotalStudents != "" ? false : true),
              (this.listedTotalTeachers =
                this.correctedTotalTeachers != "" ? false : true);
          }
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
    this._translate.get("Verification").subscribe((res: string) => {
      this.Verification = res;
    });
    this._translate.get("school").subscribe((res: string) => {
      this.school = res;
    });
    this._translate.get("primary").subscribe((res: string) => {
      this.primary = res;
    });
    this._translate.get("secondary").subscribe((res: string) => {
      this.secondary = res;
    });
    this._translate.get("middle").subscribe((res: string) => {
      this.middle = res;
    });
    this._translate.get("district").subscribe((res: string) => {
      this.district = res;
    });
    this._translate.get("educationalDistrict").subscribe((res: string) => {
      this.educationalDistrict = res;
    });
    this._translate.get("block").subscribe((res: string) => {
      this.block = res;
    });
    this._translate.get("zone").subscribe((res: string) => {
      this.zone = res;
    });
    this._translate.get("giveCheck").subscribe((res: string) => {
      this.giveCheck = res;
    });
    this._translate.get("teachersTotal").subscribe((res: string) => {
      this.teachersTotal = res;
    });
    this._translate.get("studentsTotal").subscribe((res: string) => {
      this.studentsTotal = res;
    });
    this._translate.get("boysTotal").subscribe((res: string) => {
      this.boysTotal = res;
    });
    this._translate.get("girlsTotal").subscribe((res: string) => {
      this.girlsTotal = res;
    });
    this._translate.get("class").subscribe((res: string) => {
      this.class = res;
    });
    this._translate.get("back").subscribe((res: string) => {
      this.back = res;
    });

    this._translate.get("teacherSanctioned").subscribe((res: string) => {
      this.teacherSanctioned = res;
    });
    this._translate.get("teachersAvailable").subscribe((res: string) => {
      this.teachersAvailable = res;
    });
    this._translate
      .get("teachersDeputationSameSchool")
      .subscribe((res: string) => {
        this.teachersDeputationSameSchool = res;
      });
    this._translate
      .get("teachersDeputationOtherSchool")
      .subscribe((res: string) => {
        this.teachersDeputationOtherSchool = res;
      });
    this._translate.get("teachersOnLongLeave").subscribe((res: string) => {
      this.teachersOnLongLeave = res;
    });

    this._translate.get("next").subscribe((res: string) => {
      this.next = res;
    });
    this._translate.get("vacanciesTotal").subscribe((res: string) => {
      this.vacanciesTotal = res;
    });

    this._translate
      .get("teacherSanctionedRequired")
      .subscribe((res: string) => {
        this.teacherSanctionedRequired = res;
      });
    this._translate
      .get("teachersAvailableRequired")
      .subscribe((res: string) => {
        this.teachersAvailableRequired = res;
      });
    this._translate
      .get("teachersDeputationSameSchoolRequired")
      .subscribe((res: string) => {
        this.teachersDeputationSameSchoolRequired = res;
      });
    this._translate
      .get("teachersDeputationOtherSchoolRequired")
      .subscribe((res: string) => {
        this.teachersDeputationOtherSchoolRequired = res;
      });
    this._translate
      .get("teachersOnLongLeaveRequired")
      .subscribe((res: string) => {
        this.teachersOnLongLeaveRequired = res;
      });
  }

  getSchoolDetails = (schoolId) => {
    // this._apiService.getSchoolDetail(schoolId)
    //   .subscribe((response: any) => {

    let records = {
      nodal_name: this.masterApiResponse.nodal_name,
      nodal_id: this.masterApiResponse.nodal_id,
      dist_id: this.masterApiResponse.dist_id,
      edu_dist_id: this.masterApiResponse.edu_dist_id,
      block_id: this.masterApiResponse.block_id,
      block_name: this.masterApiResponse.block_name,
      edu_dist_name: this.masterApiResponse.edu_dist_name,
      district_name: this.masterApiResponse.district_name,
      total: this.masterApiResponse.total,
      catty_id: this.masterApiResponse.catty_id,
      cate_type: this.masterApiResponse.cate_type,
      teach_tot: this.masterApiResponse.teach_tot,
      nonteach_tot: this.masterApiResponse.nonteach_tot,
      totstaff: this.masterApiResponse.totstaff,
      total_students: this.masterApiResponse.total_students,
      school_name: this.masterApiResponse.school_name,
      school_id: this.masterApiResponse.school_id,
      udise_code: this.masterApiResponse.udise_code,
      class_info: this.masterApiResponse.class_info,
      districts: this.masterApiResponse.districts,
    };
    this.schoolDetails = records;
    this.actualDetails = records;
    let schoolData = {
      schoolId: this.schoolDetails.school_id,
      schoolName: this.schoolDetails.school_name,
      distName: this.schoolDetails.district_name,
      eduDistName: this.schoolDetails.edu_dist_name,
      blockName: this.schoolDetails.block_name,
      cateType: this.schoolDetails.cate_type,
    };

    this.classList = this.schoolDetails.class_info.filter(
      (data, index) => data.total != 0
    );
    this.correctedClass = JSON.parse(JSON.stringify(this.classList));
    this.addCorrectedVariable();
    this.loading.dismiss();
    localStorage.setItem("schoolInfo", JSON.stringify(schoolData));
    /*  Registering This Page in Storage ....*/
    let apiData = {
      pageNo: "2",
      pageName: "emiVerfiy",
      apiResponse: {
        records: this.schoolDetails,
      },
      pageDetails: {},
      correctedDetails: {},
      correctedClass: this.correctedClass,
    };

    this.storeDetail.pages.pageData[1] = apiData;
    this.ionicStore.setStoreData(this.storeDetail);

    // }, (error: any) => {
    this.loading.dismiss();

    // });
  };

  async presentModal(
    listedValue,
    type,
    correction,
    showCategory,
    gender = "",
    index = ""
  ) {
    let selectedGender = gender;
    let selectedIndex = index;
    this.presentValue = listedValue;
    this.divisionType = type;
    switch (this.divisionType) {
      case "district": {
        this.getDistrictList(
          listedValue,
          type,
          correction,
          showCategory,
          gender,
          index
        );
        break;
      }
      case "edu_district": {
        this.getEducationalDistrictList(
          listedValue,
          type,
          correction,
          showCategory,
          gender,
          index
        );
        break;
      }
      case "block": {
        this.getBlocksList(
          listedValue,
          type,
          correction,
          showCategory,
          gender,
          index
        );
        break;
      }
      case "zone": {
        this.getZoneList(
          listedValue,
          type,
          correction,
          showCategory,
          gender,
          index
        );
        break;
      }
      default: {
        this.getCountData(
          listedValue,
          type,
          correction,
          showCategory,
          gender,
          index
        );
        break;
      }
    }
  }

  async getDistrictList(
    listedValue,
    type,
    correction,
    showCategory,
    gender = "",
    index = ""
  ) {
    let selectedGender = gender;
    let selectedIndex = index;

    this.schoolDetails.districts.forEach((data) => {
      if (data.district_name !== this.presentValue) {
        this.actualValueList.push({
          id: data.id,
          item: data.district_name,
        });
      }
    });
    /*  Modal Open ....*/
    const modal = await this.modalController.create({
      component: EmimodalComponent,
      componentProps: {
        listedValue: listedValue,
        actualValue: this.actualValueList,
        divisionType: this.divisionType,
        correction: correction,
        showCategory: showCategory,
      },
      backdropDismiss: false,
    });

    modal.onDidDismiss().then((response) => {
      this.actualValueList = [];
      if (response.data !== "Cancel") {
        // this.dataReturned = dataReturned.data;
        //alert('Modal Sent Data :'+ dataReturned);

        this.schoolDetails.dist_id = response.data.id;
        this.correctedDistrict = response.data.item;
      }
    });
    return await modal.present();
  }

  async getEducationalDistrictList(
    listedValue,
    type,
    correction,
    showCategory,
    gender = "",
    index = ""
  ) {
    let selectedGender = gender;
    let selectedIndex = index;
    const districtDetail = {
      district_id: this.schoolDetails.dist_id,
    };

    let temp_eduDistrictList = this.masterApiResponse.obs_info.edu_dist.filter(
      (data) => data.district_id === this.schoolDetails.dist_id
    );

    temp_eduDistrictList.forEach((data) => {
      if (data.edn_dist_name != this.presentValue) {
        this.actualValueList.push({
          id: data.id,
          item: data.edn_dist_name,
        });
      }
    });

    /*  Modal Open ....*/
    const modal = await this.modalController.create({
      component: EmimodalComponent,
      componentProps: {
        listedValue: listedValue,
        actualValue: this.actualValueList,
        divisionType: this.divisionType,
        correction: correction,
        showCategory: showCategory,
      },
      backdropDismiss: false,
    });

    modal.onDidDismiss().then((response) => {
      this.actualValueList = [];
      if (response.data !== "Cancel") {
        // this.dataReturned = dataReturned.data;
        //alert('Modal Sent Data :'+ dataReturned);

        this.schoolDetails.edu_dist_id = response.data.id;
        this.correctedEduDistrict = response.data.item;
      }
    });

    return await modal.present();

    //   this.loading.dismiss();

    // });
  }

  async getBlocksList(
    listedValue,
    type,
    correction,
    showCategory,
    gender = "",
    index = ""
  ) {
    let selectedGender = gender;
    let selectedIndex = index;
    const blockDetail = {
      edu_dist_id: this.schoolDetails.edu_dist_id,
    };

    let temp_blockList = this.masterApiResponse.obs_info.blocks.filter(
      (data) => data.edu_dist_id === this.schoolDetails.edu_dist_id
    );

    temp_blockList.forEach((data) => {
      if (data.block_name != this.presentValue) {
        this.actualValueList.push({
          id: data.id,
          item: data.block_name,
        });
      }
    });

    /*  Modal Open ....*/
    const modal = await this.modalController.create({
      component: EmimodalComponent,
      componentProps: {
        listedValue: listedValue,
        actualValue: this.actualValueList,
        divisionType: this.divisionType,
        correction: correction,
        showCategory: showCategory,
      },
      backdropDismiss: false,
    });

    modal.onDidDismiss().then((response) => {
      this.actualValueList = [];
      if (response.data !== "Cancel") {
        // this.dataReturned = dataReturned.data;
        //alert('Modal Sent Data :'+ dataReturned);

        this.schoolDetails.block_id = response.data.id;
        this.correctedBlock = response.data.item;
      }
    });
    return await modal.present();
  }

  async getZoneList(
    listedValue,
    type,
    correction,
    showCategory,
    gender = "",
    index = ""
  ) {
    let selectedGender = gender;
    let selectedIndex = index;

    const zoneDetail = {
      block_id: this.schoolDetails.block_id,
    };

    let temp_ZoneList = [];
    this.masterApiResponse.obs_info.nodals.forEach((data) => {
      if (
        data.edu_dist_id === this.schoolDetails.edu_dist_id &&
        data.district_id === this.schoolDetails.dist_id &&
        data.block_id === this.schoolDetails.block_id
      ) {
        temp_ZoneList.push(data);
      }
    });

    temp_ZoneList.forEach((data, index) => {
      if (data.nodal_name != this.presentValue) {
        this.actualValueList.push({
          id: data.hss_school_id,
          item: data.hss_school_name,
        });
      }
    });

    /*  Modal Open ....*/
    const modal = await this.modalController.create({
      component: EmimodalComponent,
      componentProps: {
        listedValue: listedValue,
        actualValue: this.actualValueList,
        divisionType: this.divisionType,
        correction: correction,
        showCategory: showCategory,
      },
      backdropDismiss: false,
    });

    modal.onDidDismiss().then((response) => {
      this.actualValueList = [];
      if (response.data !== "Cancel") {
        // this.dataReturned = dataReturned.data;
        //alert('Modal Sent Data :'+ dataReturned);

        this.schoolDetails.school_id = response.data.id;
        this.correctedZone = response.data.item;
      }
    });
    return await modal.present();

    //   this.loading.dismiss();

    // });
  }

  async getCountData(
    listedValue,
    type,
    correction,
    showCategory,
    gender = "",
    index = ""
  ) {
    let selectedGender = gender;
    let selectedIndex = index;
    /*  Modal Open ....*/
    const modal = await this.modalController.create({
      component: EmimodalComponent,
      componentProps: {
        listedValue: listedValue,
        actualValue: this.actualValueList,
        divisionType: this.divisionType,
        correction: correction,
        showCategory: showCategory,
      },
      backdropDismiss: false,
    });

    modal.onDidDismiss().then((response) => {
      this.actualValueList = [];
      if (response.data !== "Cancel") {
        // this.dataReturned = dataReturned.data;
        //alert('Modal Sent Data :'+ dataReturned);

        switch (this.divisionType) {
          case "teacher_count": {
            this.correctedTotalTeachers = response.data;
            break;
          }
          case "student_count": {
            this.correctedTotalStudents = response.data;
            break;
          }
          case "count": {
            if (selectedGender == "girls") {
              this.correctedClass[
                selectedIndex
              ].girls = response.data.toString();
              this.correctedClass[selectedIndex].showCorrected_Girls = true;
              this.correctedClass[selectedIndex].listetClassGirls = false;
            } else {
              this.correctedClass[
                selectedIndex
              ].boys = response.data.toString();
              this.correctedClass[selectedIndex].showCorrected_Boys = true;
              this.correctedClass[selectedIndex].listetClassBoys = false;
            }
            break;
          }
          default: {
            console.log("Invalid choice");
            break;
          }
        }
      }
    });

    return await modal.present();
  }

  addCorrectedVariable() {
    this.correctedClass.forEach((data, index) => {
      data["listetClassBoys"] = false;
      data["listetClassGirls"] = false;
      data["showCorrected_Boys"] = false;
      data["showCorrected_Girls"] = false;
      data["checked"] = false;
    });
  }

  isAllClassChecked(currentValue, index, array) {
    return (
      (currentValue.listetClassGirls == true ||
        currentValue.showCorrected_Girls == true) &&
      (currentValue.listetClassBoys == true ||
        currentValue.showCorrected_Boys == true)
    );
  }

  async goToTeacherSelection() {
    if (
      (!this.listedDistrict && this.correctedDistrict === "") ||
      (!this.listedEduDistrict && this.correctedEduDistrict === "") ||
      (!this.listedBlock && this.correctedBlock === "") ||
      (!this.listedZone && this.correctedZone === "") ||
      (!this.listedTotalStudents && this.correctedTotalStudents === "")
    ) {
      this._alertService.showAlert(this.giveCheck);
    } else {
      if (
        this.teacherSanctionedValue === null ||
        this.teacherSanctionedValue === undefined ||
        this.teachersAvailableValue === null ||
        this.teachersAvailableValue === undefined ||
        this.teachersDeputationSameSchoolValue === null ||
        this.teachersDeputationSameSchoolValue === undefined ||
        this.teachersDeputationOtherSchoolValue === null ||
        this.teachersDeputationOtherSchoolValue === undefined ||
        this.teachersOnLongLeaveValue === null ||
        this.teachersOnLongLeaveValue === undefined
      ) {
        this.submitted = true;

        return;
      }

      const found = this.correctedClass.every(this.isAllClassChecked);

      if (found) {
        let classList = [];
        this.correctedClass.forEach((data, index) => {
          classList.push({
            class: data.class,
            no_of_boys: data.boys,
            no_of_girls: data.girls,
          });
        });
        let created_on = new Date();
        created_on.toISOString();
        let pageDetails = {
          nodal_id: this.schoolDetails.school_id,
          nodal_name:
            this.correctedZone != ""
              ? this.correctedZone
              : this.schoolDetails.nodal_name,
          block_id: this.schoolDetails.block_id,
          block_name:
            this.correctedBlock != ""
              ? this.correctedBlock
              : this.schoolDetails.block_name,
          edu_district_id: this.schoolDetails.edu_dist_id,
          edu_district_name:
            this.correctedEduDistrict != ""
              ? this.correctedEduDistrict
              : this.schoolDetails.edu_dist_name,
          district_id: this.schoolDetails.dist_id,
          district_name:
            this.correctedDistrict != ""
              ? this.correctedDistrict
              : this.schoolDetails.district_name,
          created_on: created_on,
          created_by: localStorage.getItem("username"),
          teachers_alloted:
            this.correctedTotalTeachers != ""
              ? this.correctedTotalTeachers
              : this.listedTotalTeachers,
          total_students:
            this.correctedTotalStudents != ""
              ? this.correctedTotalStudents
              : this.listedTotalStudents,
          vacancies: this.vacancies,
          classdata: classList,
          teacherSanctioned: this.teacherSanctionedValue,
          teachersAvailable: this.teachersAvailableValue,
          teachersDeputationSameSchool: this.teachersDeputationSameSchoolValue,
          teachersDeputationOtherSchool: this
            .teachersDeputationOtherSchoolValue,
          teachersOnLongLeave: this.teachersOnLongLeaveValue,
        };
        let correctedDetails = {
          nodal_id: this.schoolDetails.school_id,
          nodal_name: this.correctedZone,
          block_id: this.schoolDetails.block_id,
          block_name: this.correctedBlock,
          edu_district_id: this.schoolDetails.edu_dist_id,
          edu_district_name: this.correctedEduDistrict,
          district_id: this.schoolDetails.dist_id,
          district_name: this.correctedDistrict,
          created_on: created_on,
          created_by: localStorage.getItem("username"),
          teachers_alloted: this.correctedTotalTeachers,
          total_students: this.correctedTotalStudents,
          vacancies: this.vacancies,
          classdata: classList,
          teacherSanctioned: this.teacherSanctionedValue,
          teachersAvailable: this.teachersAvailableValue,
          teachersDeputationSameSchool: this.teachersDeputationSameSchoolValue,
          teachersDeputationOtherSchool: this
            .teachersDeputationOtherSchoolValue,
          teachersOnLongLeave: this.teachersOnLongLeaveValue,
        };
        this.storeDetail.pages.pageData[1].pageDetails = pageDetails;
        this.storeDetail.pages.pageData[1].correctedDetails = correctedDetails;
        this.storeDetail.pages.pageData[1].correctedClass = this.correctedClass;
        this.storeDetail.pages.currentProgress = 0;
        this.ionicStore.setStoreData(this.storeDetail);
        this._router.navigate(["/page-route/teacher-selection"]);
      } else {
        this._alertService.showAlert(this.giveCheck);
      }
    }
  }

  checkActualData(division, data) {
    this.divisionType = division;

    switch (this.divisionType) {
      case "district": {
        this.schoolDetails.dist_id = data;
        break;
      }
      case "edu_district": {
        this.schoolDetails.edu_dist_id = data;
        break;
      }
      case "block": {
        this.schoolDetails.block_id = data;
        break;
      }
      case "zone": {
        this.schoolDetails.school_id = data;

        break;
      }
      case "teacher_count": {
        this.correctedTotalTeachers = data;
        break;
      }
      case "student_count": {
        this.correctedTotalStudents = data;
        break;
      }
      default: {
        console.log("Invalid choice");
        break;
      }
    }
  }
}
