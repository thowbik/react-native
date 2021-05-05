import { Component, OnInit } from '@angular/core';
import {ActionSheetController} from '@ionic/angular'
import { ApiService } from 'src/app/services/api.service';
import { IonicStorageService } from 'src/app/services/ionic-storage/ionic-storage.service';
import { LoaderServiceService } from "src/app/services/common_Provider/loader-service/loader-service.service";

@Component({
  selector: 'app-observation-list',
  templateUrl: './observation-list.page.html',
  styleUrls: ['./observation-list.page.scss'],
})
export class ObservationListPage implements OnInit {
  observation_list_data: any;
  lastUpdated_value:any='';
  local_list_data: any=[];
  

  constructor(private actionSheetController:ActionSheetController,private apiService:ApiService,
    private ionicStorageService:IonicStorageService,private loaderService:LoaderServiceService) { }

  ngOnInit() {
    this.getObservationList()
  }
  getObservationList(){
    this.loaderService.presentLoading();
    //for getting saved data in api
    this.ionicStorageService.getData('observation_list').then(local_data=>{
      //for local data
      this.ionicStorageService.getData('store_observation').then(local_stored=>{
        if(local_stored){
          //console.log(JSON.parse(local_stored))
          local_stored=JSON.parse(local_stored)
          // this.local_list_data=local_stored.data.records.form_values.classroom_data[1]
         
          this.local_list_data=local_stored.map(val=>val.data.records.form_values)
          let temp=[]
      this.local_list_data.map(res=>{
         let d=res.filter(val=>val.classroom_data)[0]
         let class_type=res.filter(val=>val.classroom_type)[0]
        
         class_type=class_type.classroom_type
         //console.log(class_type)
         d.classroom_data[1].class=class_type.hasOwnProperty('class') ? class_type.class : class_type.class_observed
         d.classroom_data[1].section=class_type.section
          temp.push(d.classroom_data[1])
         })
         //console.log(temp);
         this.local_list_data=temp
        }
     
      if(local_data){
        this.observation_list_data=local_data.records;
        this.lastUpdated_value=local_data.lastUpdated
        this.loaderService.dismissLoader();
      }
      
   else{
    let params={start_date:null,end_date:null}
    this.apiService.getObservationList(params).subscribe(result=>{
      if(result['dataStatus']){
      this.observation_list_data=result['records']
      this.lastUpdated_value=new Date();
      }
      // this.getObservationList();
    })
  }
  })
})
    //for getting local data
  
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: '',
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          //console.log('Delete clicked');
        }
      // }, {
      //   text: 'Edit',
      //   icon: 'create',
      //   handler: () => {
      //     //console.log('Edit clicked');
      //   }
      }, 
      // {
      //   text: 'Play (open modal)',
      //   icon: 'arrow-dropright-circle',
      //   handler: () => {
      //     //console.log('Play clicked');
      //   }
      // }, 
      // {
      //   text: 'Favorite',
      //   icon: 'heart',
      //   handler: () => {
      //     console.log('Favorite clicked');
      //   }
      // },
       {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
         // console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }
  doRefresh(event){
    let params={start_date:null,end_date:null}
    this.apiService.getObservationList(params).subscribe(result=>{
      if(result['dataStatus']){
      this.observation_list_data=result['records']
      this.lastUpdated_value=new Date();
      }
    
      // this.getObservationList();
    })
    setTimeout(() => {
    //  console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

}
