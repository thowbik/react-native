import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { Events } from '@ionic/angular';
import { IonicStorageService } from 'src/app/services/ionic-storage/ionic-storage.service';
import { FileHandlerService } from 'src/app/services/file-handler/file-handler.service';

@Component({
  selector: 'app-class-sec-info',
  templateUrl: './class-sec-info.page.html',
  styleUrls: ['./class-sec-info.page.scss'],
})
export class ClassSecInfoPage implements OnInit {
  school_data:any=[]
  param_data:any=[]
  school_id:any;
class_info=[{
  class_studying_id:1,
  sections:
  [{  sec:'a',
  boys:'20',
  girls:'10',
  tot:'30'
},
{
  sec:'b',
  boys:'10',
  girls:'90',
  tot:'140'
}]
},
{
  class_studying_id:2,
  sections:
  [{  sec:'a',
  boys:'20',
  girls:'10',
  tot:'30'
},
{
  sec:'b',
  boys:'10',
  girls:'90',
  tot:'140'
}] 
}]
  param_school_data: any;
  param_teacher_info: any;
  data_value:any=[]
  randomColor:any=[];
  constructor(private router:Router,private apiService:ApiService,private events:Events,
    private ActivateRoute:ActivatedRoute,private ionicStorage:IonicStorageService,private fileService:FileHandlerService) { 
      // console.log("class",this.class_info);
    // this.events.subscribe('school_selection',(data)=>{
    //   console.log("data12",data)
    //   this.school_data=data.full_info
    //   console.log(this.school_data);
    // })
    // console.log("school data",this.school_data);
    // this.ActivateRoute.queryParams.subscribe(params=>{
    //   console.log("params",params);
    //   if(params.class_data){
    //     this.param_school_data=JSON.parse(params.class_data)
    //   }
    // })  
    
  }

  ngOnInit() {
  
    // this.apiService.getStudentsListBySchoolId(this.param_school_data.school_id).subscribe(res=>{
    //   if(res['dataStatus']){
    //   this.school_data=res['records']
    //   this.school_data.forEach(res=>{
    //     let tot=parseInt(res.male)+parseInt(res.female)
    //     res.total=tot
    //   })
    //   console.log("t",this.school_data);
    //   }
    // })
    this.ionicStorage.getData('studentlist').then(res=>{
      // console.log(res);
      if(res){
           this.school_data=res
          //  let data_value:any=[]
           let i=0
      this.school_data.forEach((res,index)=>{
        let tot=parseInt(res.male)+parseInt(res.female)
        res.total=tot
        if(this.data_value.length  != 0){
          // console.log("index",index);
        if(res.class_studying_id==this.data_value[i-1].class_studying_id){
         this.data_value[i-1].sections.push({'section':res.class_section,'totalStrength':tot,'male':res.male,'female':res.female})
         i=i-1;
        }
        else{
        this.data_value.push({class_name:this.fileService.classConvertion(res.class_studying_id),class_studying_id: res.class_studying_id,sections:[{'section':res.class_section,'totalStrength':tot,'male':res.male,'female':res.female}]})
        }
      }
      else{
        this.data_value=[{class_name:this.fileService.classConvertion(res.class_studying_id),class_studying_id:res.class_studying_id,sections:[{'section':res.class_section,'totalStrength':tot,'male':res.male,'female':res.female}]}]
      }
      i=i+1
      // console.log("data_val",this.data_value);
      this.Color()
     
      })
      // console.log("t",this.school_data);
      }
    })
  }
  Color()

  {
  let color=  "rgb("+ Math.floor(Math.random() * 255) + ","+ Math.floor(Math.random() * 255) + ","

    + Math.floor(Math.random() * 255) + ")"
       this.randomColor.push (color);

      //change the text color with the new random color

      // document.getElementById("content").style.color = color;
      // console.log(this.randomColor)

  }
  onClick(value,childIndex){
    console.log("v",value)
    let sec=value.sections[childIndex];
    console.log(sec);
    let records:any={}
    records={class_studying_id:value.class_studying_id}
    records.sections=sec

    let navigationExtras:NavigationExtras={
      queryParams:{
        // class_data:JSON.stringify(this.param_school_data),
        // teacher_info:JSON.stringify(this.param_teacher_info),
        class_sec_info:JSON.stringify(records)
      }
    }
    this.router.navigate(['page-route','classroom-type'],navigationExtras)
    // this.router.navigate(['page-route','classroom-type'])
  }

}
