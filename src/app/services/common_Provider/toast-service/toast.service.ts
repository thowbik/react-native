import { Injectable } from '@angular/core';
import {ToastController, AlertController} from '@ionic/angular'

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastCtrl:ToastController,private alertCtrl:AlertController) {

   }
    async presentToast(msg:string,color) {
      //console.log("g",this.getColor(color))
    const toast =  await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      color:this.getColor(color)
    });
    return await toast.present();
  }
  async presentToastWithOptions(msg) {
    const toast = await this.toastCtrl.create({
      header: 'Toast header',
      message: msg,
      position: 'top',
      buttons: [
        {
          side: 'start',
          icon: 'star',
          text: 'Favorite',
          handler: () => {
            //console.log('Favorite clicked');
          }
        }, {
          text: 'Done',
          role: 'cancel',
          handler: () => {
            //console.log('Cancel clicked');
          }
        }
      ]
    });
    return await toast.present();
  }
  async setAlertForUpdateCheck(header,message){
    const alert = await this.alertCtrl.create({
      header: header,
      backdropDismiss:false,
      
      message: message,
      buttons: [
        {
          text: 'Ok',
          role: 'ok',
          cssClass: 'secondary',
          handler: (blah) => {
            alert.dismiss('ok')
            //console.log('Confirm Ok: blah');
            // alert.dismiss()
            return false
          }
        }
      ]
    });

    await alert.present()
    let result=await alert.onDidDismiss();
    return result

    }
  async setAlert(title_name,msg){
 

    const alert= await this.alertCtrl.create({
      header:title_name,
      message:msg,
      cssClass:'buttoncss',
      buttons:[{
        text:'No',
        cssClass:'btnNo',
        handler:()=>{
          alert.dismiss(false)
          return false
        }
      },{
        text:'Yes',
        cssClass:'btnYes',
        handler:()=>{
          alert.dismiss('s')
          return false
        }
      },
      ]
    });
    //alert.present()
    return alert
    
    }
    async presentAlertConfirm(header,message) {
      const alert = await this.alertCtrl.create({
        header: header,
        message: message,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              alert.dismiss('cancel')
              //console.log('Confirm Cancel: blah');
              // alert.dismiss()
              return false
            }
          }, {
            text: 'Okay',
            role: 'okay',
            handler: () => {
              alert.dismiss('okay')
              //console.log('Confirm Okay');
              return false
            }
          }
        ]
      });
  
      await alert.present()
      let result=await alert.onDidDismiss();
      return result

    }
  getColor(color){
    switch(color){
      case 'success':
        return 'primary'
      case 'warning':
         return 'warning'
      case 'error':
          return 'danger'
      case 'success_green':
          return 'secondary'
      case 'dark':
          return 'dark'  
      default :
          return ''
    }
  }
}
