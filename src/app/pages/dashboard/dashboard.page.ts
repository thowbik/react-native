import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { IonSlides, Platform } from '@ionic/angular';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  slidImages=[{
    id:1,
    image:'../../assets/pencil.jpg'
  },
  {
    id:2,
    image:'../../assets/pencil.jpg'
  },
  {
    id:3,
    image:'../../assets/pencil.jpg'
  }]
  slideOptions = {
    initialSlide: 0,
    speed: 400,
  };
  backButtonSubscription
  options:any;
  // public unsubscribeBackEvent: any;

  constructor(private plt:Platform) { }

  ngOnInit() {
    // this.initializeBackButtonCustomHandler();
  }
  //Called when view is left
  ionViewWillLeave() {
    // Unregister the custom back button action for this page
    // this.unsubscribeBackEvent && this.unsubscribeBackEvent();
  }
  ngAfterViewInit(){
    // this.backButtonSubscription=this.plt.backButton.subscribe(()=>{
    //   navigator['app'].exitApp();
    // })
  }
  // initializeBackButtonCustomHandler(): void {
  //   this.unsubscribeBackEvent = this.plt.backButton.subscribeWithPriority(999999,  () => {
  //       alert("back pressed home" + this.constructor.name);
  //   });
  //   /* here priority 101 will be greater then 100 
  //   if we have registerBackButtonAction in app.component.ts */
  // }

  ngOnDestroy() {
    // this.backButtonSubscription.unsubscribe();
  }
  slidesDidLoad(slides:IonSlides){
   // console.log("auto",slides);
    slides.startAutoplay();
  }
}
