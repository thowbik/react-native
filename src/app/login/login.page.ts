import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AuthenticationService } from '../services/auth-service/authentication.service';
import { Router } from '@angular/router';
import { ToastService } from '../services/common_Provider/toast-service/toast.service';
import { NetworkService } from '../services/network.service';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
username:any;
password:any;
  constructor(public menuCtrl: MenuController,private authService:AuthenticationService,
      private router:Router,private toastService:ToastService, public loading: LoadingService,
      public networkService:NetworkService) {
   }
   ngOnInit() {
     this.loading.present();
    this.menuCtrl.get().then((menu: HTMLIonMenuElement) => {
      menu.swipeGesture = false;
    });
    this.loading.dismiss();

    }
    login(){
      let params:any={
        'username':this.username,
        'password':this.password,
        "client":"MOB"
      };

      let connectionStatus = this.networkService.getCurrentNetworkStatus();
    if(connectionStatus!==1){
      this.authService.login(params).subscribe(res=>{
       if(res.token){
         this.toastService.presentToast("Login Successful",'')
         setTimeout(()=>{
          this.router.navigate(['page-route'], {replaceUrl: true})
        },2000)
       }
       else{
         this.toastService.presentToast("User Not Found",'danger')
        //  setTimeout(()=>{
        //   this.router.navigate(['/'], {replaceUrl: true})
        // },2000)
       }
      });
    }else{
      this.toastService.presentToast("Please enable your internet connection",'danger')

    }

    }

  }
  // ionViewWillEnter() {
  //   this.menuCtrl.swipeEnable(false);
  // }

