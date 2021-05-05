import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { Observable, from, of, forkJoin } from 'rxjs';
import { switchMap, finalize, tap } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { store } from '@angular/core/src/render3';



const STORAGE_REQ_KEY = 'store_observation';
interface StoredRequest {
  url: string,
  type: string,
  data: any,
  time: any,
  id: string
}
@Injectable({
  providedIn: 'root'
})
export class OfflineManagerService {
  
  constructor(private storage:Storage,private http:HttpClient,private toastCtrl:ToastController) { 
    //console.log("Offline Manager Service")
  }
 
  checkForEvents(): Observable<any>{
    return from(this.storage.get(STORAGE_REQ_KEY)).pipe(
      switchMap(storedOperations => {
      // return this.storage.get(STORAGE_REQ_KEY).then(storedOperations=>{
      //console.log("Stored Operations",storedOperations);
        let storedObj = JSON.parse(storedOperations);
        if (storedObj && storedObj.length > 0) {
          return this.sendRequests(storedObj).pipe(
            tap(res=>{
              //console.log("check for Events",res)
             
              let false_response:any=[]
               false_response= res.filter(val=>val['dataStatus'] != true )
             
              //console.log(false_response);
              if(false_response.length == 0 ){
                   let toast = this.toastCtrl.create({
                message: `Local data succesfully saved!`,
                duration: 3000,
                position: 'bottom'
              });
              toast.then(toast => toast.present());
                //console.log("delete key")
                    this.storage.remove(STORAGE_REQ_KEY);
              }
              else{
                this.storage.remove(STORAGE_REQ_KEY);
                res.forEach((val,index)=>{
                  if(val['dataStatus']!=true){
                    //console.log("false",index)
                    //console.log(storedObj[index])
                   this.storeRequest(storedObj[index].url,'post',storedObj[index].data)
                  }
                })
              }
            })
            // finalize(() => {
            //   let toast = this.toastCtrl.create({
            //     message: `Local data succesfully saved!`,
            //     duration: 3000,
            //     position: 'bottom'
            //   });
            //   toast.then(toast => toast.present());
 
            //   this.storage.remove(STORAGE_REQ_KEY);
            // })
          );
        } else {
          //console.log('no local events to sync');
          return of(false);
        }
      })
    )
    
  }
  storeRequest(url, type, data) {
    let toast = this.toastCtrl.create({
      message: `Your data is stored locally because you seem to be offline.`,
      duration: 3000,
      position: 'bottom'
    });
    toast.then(toast => toast.present());
 
    let action: StoredRequest = {
      url: url,
      type: type,
      data: data,
      time: new Date(),
      id: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)
    };
    // https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
 
    return this.storage.get(STORAGE_REQ_KEY).then(storedOperations => {
      let storedObj = JSON.parse(storedOperations);
 
      if (storedObj) {
        storedObj.push(action);
      } else {
        storedObj = [action];
      }
      // Save old & new local transactions back to Storage
      return this.storage.set(STORAGE_REQ_KEY, JSON.stringify(storedObj));
    });
  }
  sendRequests(operations: StoredRequest[]) {
    let obs = [];
    //console.log("op",operations)
    for (let op of operations) {
      //console.log('Make one request: ', op);
      let oneObs
      if(op.type == 'post'){
         oneObs=this.http.post(op.url,op.data)
      }
      //  oneObs = this.http.request(op.type, op.url, op.data);
      obs.push(oneObs);
    }
 
    // Send out all local events and return once they are finished
    return forkJoin(obs);
  }
}
