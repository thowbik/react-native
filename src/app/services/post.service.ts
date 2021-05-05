import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PostService {


  finalData:any;
  constructor() { }

  setFinalInfo=(globalObject)=>{

    this.finalData = globalObject;
  }
  getFinalInfo=()=>{

    return this.finalData;
  }

}
