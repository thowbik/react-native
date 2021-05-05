import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Network } from '@ionic-native/network/ngx';
import { ToastController, Platform } from '@ionic/angular';
export enum ConnectionStatus {
  Online,
  Offline
}
@Injectable({
  providedIn: 'root'
})

export class NetworkService {
  private status: BehaviorSubject<ConnectionStatus> = new BehaviorSubject(ConnectionStatus.Offline);

  constructor(private network:Network,private toast:ToastController,private plt:Platform) { 
    this.plt.ready().then(()=>{
      this.initializeNetworkEvents();
      //console.log("Network",this.network);
      let status=this.network.type != 'none' ? ConnectionStatus.Online : ConnectionStatus.Offline
      //console.log("Network Status",this.network.type);
      this.status.next(status);
    })
  }
  initializeNetworkEvents(){
    //console.log("InitializeNetworkEvents Function");
    this.network.onDisconnect().subscribe(()=>{
      if(this.status.getValue()==ConnectionStatus.Online){
        //console.log("We Are Offline");
        this.updateNetworkStatus(ConnectionStatus.Offline);
      }
    });
      this.network.onConnect().subscribe(()=>{
        if(this.status.getValue()== ConnectionStatus.Offline){
          //console.log("We are Online");
          this.updateNetworkStatus(ConnectionStatus.Online)
        }
      
    });
  }
  private async updateNetworkStatus(status :ConnectionStatus){
    this.status.next(status);

    let connection=status == ConnectionStatus.Offline ? 'Offline' : 'Online'
    //console.log("Network Change Status",connection)
    this.presentToast(connection)
  }
  presentToast(value){
    let toast=this.toast.create({
      message:'You are now '+value,
      duration:3000,
      position:'bottom'
    })
    toast.then(toast=>toast.present())
  }
  
  public onNetworkChange(): Observable<ConnectionStatus> {
    return this.status.asObservable();
  }
 
  public getCurrentNetworkStatus(): ConnectionStatus {
    return this.status.getValue();
  }
}
