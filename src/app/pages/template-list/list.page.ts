import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { FileHandlerService } from 'src/app/services/file-handler/file-handler.service';
import { Platform } from '@ionic/angular';
import { ToastService } from 'src/app/services/common_Provider/toast-service/toast.service';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit {
  template_list:any=[];
  private selectedItem: any;
  private icons = [
    'flask',
    'wifi',
    'beer',
    'football',
    'basketball',
    'paper-plane',
    'american-football',
    'boat',
    'bluetooth',
    'build'
  ];
  public items: Array<{ title: string; note: string; icon: string }> = [];
  constructor(private router:Router,private apiService:ApiService,
    private fileService:FileHandlerService,private plt:Platform,
    private toastService:ToastService,private activateRoute:ActivatedRoute) {
    for (let i = 1; i < 11; i++) {
      this.items.push({
        title: 'Item ' + i,
        note: 'This is item #' + i,
        icon: this.icons[Math.floor(Math.random() * this.icons.length)]
      });
    }
  }

  ngOnInit() {
    let template_class;
    this.activateRoute.queryParams.subscribe(param_data=>{
      console.log("pa",param_data.template_class)
      if(param_data.template_class){
        template_class=param_data.template_class
      }
    
    })
     if (this.plt.is('cordova')) { 
      this.template_list=[]
      // make your native API calls 
      this.fileService.listDirectory('templates').then(res=>{
        console.log("list dir",res)
       let dir_list=res
      //  let template_list_temp
       dir_list.forEach(file_name=>{
        this.fileService.readFile({dir:'templates',file_name:file_name.name}).then(file=>{
          // console.log("read file",file);
          this.template_list.push(JSON.parse(file))
          console.log("template list",this.template_list)
         
        },err=>{
          this.toastService.presentToast("Network Error"+err,'error');
        })
        console.log("splitted",this.template_list.filter(val=>val.includes('3')))
        })
      },err=>{
        this.toastService.presentToast("Network Error"+err,'error');
      })
    } 
    else{
    this.apiService.getAllTemplates().subscribe(res=>{
      this.template_list=res['records'];
      console.log("splitted",this.template_list.filter(val=>val.template_name.includes(template_class)))
      let curr_template=this.template_list.filter(val=>val.template_name.includes(template_class))[0]
      this.navigate(curr_template.template_id)
  }) 
} 
  
  // console.log("list dir",direct);
  }
  // add back when alpha.4 is out
  // navigate(item) {
  //   this.router.navigate(['/list', JSON.stringify(item)]);
  // }
  navigate(value){
    // let param:any={}
    let navigationExtras:NavigationExtras={
      queryParams:{
        // template_list:value.template_id
        template_list:value
      }
    }
    this.router.navigate(['page-route','questions'],navigationExtras)
  }
  
}
