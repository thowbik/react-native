import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-schedular',
  templateUrl: './schedular.component.html',
  styleUrls: ['./schedular.component.scss'],
})
export class SchedularComponent implements OnInit {

  constructor() { }

  ngOnInit() { 
    // const filePath = 'file:///...';
    // this.base64.encodeFile(filePath).then((base64File: string) => {
    //   console.log(base64File);
    // }, (err) => {
    //   console.log(err);
    // });

    
    // const win = window;
    // win.webkitStorageInfo.queryUsageAndQuota(webkitStorageInfo.TEMPORARY, //the type can be either TEMPORARY or PERSISTENT
    //   function(used, remaining) {
    //     console.log(" Used quota: " + used + ", remaining quota: " + remaining);
    //   }, function(e) {
    //     console.log('Error', e) ;
    //   } );
  }

}
