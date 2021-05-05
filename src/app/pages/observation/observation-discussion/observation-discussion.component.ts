import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { IonicStorageService } from 'src/app/services/ionic-storage/ionic-storage.service';

@Component({
  selector: 'app-observation-discussion',
  templateUrl: './observation-discussion.component.html',
  styleUrls: ['./observation-discussion.component.scss'],
})
export class ObservationDiscussionComponent implements OnInit {


  misMatchAttendance: any[] = [];
  storeDetail: any;
  sectionData:any;
  constructor(public _router: Router,
    public _apiService: ApiService,
    public ionicStore: IonicStorageService) { }

  ngOnInit() {

    this.ionicStore.getStoreData()
      .then((response) => {
        this.storeDetail = response;
        if (this.storeDetail.pages.pageData[10] === undefined) {
          this.createPage();
        }else{
        this.sectionData = this.storeDetail.pages.pageData[5].correctedDetails.customizeSectionList.find((data)=>data.sec_id == "6");
        }
      });

  }

  displayCounter=(selectedAnswerDetail)=>{
  }


  createPage=()=>{
    let apiData = {
      pageNo: '11',
      pageName: 'observationDiscussion_DIKSHA',
      apiResponse: {
        records: {
        }
      },
    };
    this.storeDetail.pages.pageData[10] = apiData;
    this.ionicStore.setStoreData(this.storeDetail);
  }

  goToBackPage = () => {
    this.misMatchAttendance = this.storeDetail.pages.pageData[4].correctedDetails;
    if (this.misMatchAttendance.length) {
      this._router.navigate(['/page-route/attendance/student-data']);
    } else {
      this._router.navigate(['/page-route/observation']);
    }
  }
}
