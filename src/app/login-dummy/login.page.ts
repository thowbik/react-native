import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as watermark from 'watermarkjs'
import {Camera,CameraOptions} from '@ionic-native/camera/ngx'

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  @ViewChild('previewimage') waterMarkImage: ElementRef;
 
  originalImage = null;
  blobImage = null;
  value:any;
  waterMarkedImg:any;
  constructor(private route:ActivatedRoute,private camera:Camera,private router:Router) {
  this.route.queryParams.subscribe(params=>{
this.value=params['txt']
//console.log(params)
  })
    
  }
  captureImage() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }
 
    this.camera.getPicture(options).then((imageData) => {
      this.originalImage = 'data:image/jpeg;base64,' + imageData;
      //console.log("Original",this.originalImage)
 
      fetch(this.originalImage)
        .then(res => res.blob())
        .then(blob => {
          this.blobImage = blob;
          //console.log("Blob Image",this.blobImage);
        });
    }, (err) => {
      // Handle error
    });
  }
  addImageWatermark() {
    watermark([this.blobImage, 'assets/imgs/academy.png'])
      .image(watermark.image.lowerRight(0.6))
      .then(img => {
        this.waterMarkImage.nativeElement.src = img.src;
        //console.log('img',img);
        
      });
  }
  pageLogin(){
    this.router.navigate(['page-route'])
  }
  addTextWatermark() {
    let path='/assets/wall.jpg'
    watermark([path])
      .image(watermark.text.lowerRight('20/09/2019', '150px Arial', '#fff', 0.5))
      .then(img => {
        this.waterMarkImage.nativeElement.src = img.src;
        //console.log('img',img);
        //console.log('img',img.src);
      });
  }

  ngOnInit() {
  }

}
