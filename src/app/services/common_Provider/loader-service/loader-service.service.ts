import { Injectable } from '@angular/core';
import {LoadingController} from '@ionic/angular'

@Injectable({
  providedIn: 'root'
})
export class LoaderServiceService {
  loading
  constructor(private loadingController:LoadingController) { }
  async presentLoading() {
     this.loading = await this.loadingController.create({
      message: 'Please Wait',
      duration: 2000,
     
    });
    await this.loading.present();

    // const { role, data } = await loading.onDidDismiss();

   
  }
  async dismissLoader(){
    this.loading.dismiss();
   // console.log('Loading dismissed!');
  }
}
