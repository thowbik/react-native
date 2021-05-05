import { Component, OnInit } from '@angular/core';
import { IonicStorageService } from 'src/app/services/ionic-storage/ionic-storage.service';
import { ApiService } from 'src/app/services/api.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-observation-end',
  templateUrl: './observation-end.component.html',
  styleUrls: ['./observation-end.component.scss'],
})
export class ObservationEndComponent implements OnInit {


  public storeDetail: any;
  public teacherDetail: any;
  public schoolDetail: any;
  public classDetail: any;
  progressValue:number;
       /*-- Language Variables Starts --*/
       public languageType:any;
       public congratulations:any;
       public successfullyCompleted:any;
       public Observation:any;
       public done:any;
       public class:any;
       /*-- Language Variables Ends --*/
       
  constructor(public ionicStore: IonicStorageService,
    private _apiService: ApiService,
    private _translate: TranslateService) { }

  ngOnInit() {

   // this.progressValue = Math.round(((12-2)/12)*100);
    this.progressValue = 100;
    this.appLanguage();

    this.teacherDetail = JSON.parse(localStorage.getItem('teacherInfo'));
    this.schoolDetail = JSON.parse(localStorage.getItem('schoolInfo'));
    this.classDetail = JSON.parse(localStorage.getItem('classInfo'));

/*  Getting AllPage Entered Info....*/
    this.ionicStore.getStoreData()
      .then((response) => {
        this.storeDetail = response;
        this.storeDetail.pages.currentPage ='Observation_complete_percentage';
        this.ionicStore.setStoreData(this.storeDetail);
        /*  Check This Page is Registered or Not, If 'Registered' move to 'else' part...  */
        if (this.storeDetail.pages.pageData[11] === undefined) {
          this.createPage();
        } else {
        }
      });
  }

  /*  Getting language Info... */ 
  appLanguage(){
    this._apiService.languageInfo.subscribe((data:any) => {
      this.languageType = data;
      this._translate.use(this.languageType);
         this._initialiseTranslation();
 });
}

  _initialiseTranslation(): void {
    
    this._translate.get('Observation').subscribe((res: string) => {
      this.Observation = res; 
    });

    this._translate.get('successfullyCompleted').subscribe((res: string) => {
      this.successfullyCompleted = res; 
    });
    this._translate.get('congratulations').subscribe((res: string) => {
      this.congratulations = res; 
    });
    this._translate.get('class').subscribe((res: string) => {
      this.class = res; 
    });
    this._translate.get('done').subscribe((res: string) => {
      this.done = res; 
    });
    
   
  }

  /*  Registering This Page in Storage ....*/
  createPage = () => {
    let apiData = {
      pageNo: '12',
      pageName: 'Observation_complete_percentage',
      apiResponse: {
        records: {
        }
      },
    };
    this.storeDetail.pages.pageData[11] = apiData;
    this.storeDetail.pages.currentProgress = this.progressValue;
    this.ionicStore.setStoreData(this.storeDetail);
  }

}
