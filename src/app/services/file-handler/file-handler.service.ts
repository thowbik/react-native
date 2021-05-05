import { Injectable } from '@angular/core';
import {File} from '@ionic-native/file/ngx'
import { Observable } from 'rxjs';
import { promise } from 'protractor';
import { Platform } from '@ionic/angular';

const template='template'
@Injectable({
  providedIn: 'root'
})
export class FileHandlerService {
  directory_root:any=this.file.externalDataDirectory
  constructor(private file:File,private platform:Platform) { 
    if(this.platform.is('ios')){
      this.directory_root=this.file.dataDirectory
    }
  }

  readFile(options){
    this.directory_root=this.file.dataDirectory
    let temp=options.file_name
    options.file_name=String(temp);
    //console.log("readFile,options ",options);
    //console.log("file value",this.file.readAsText(this.directory_root+options.dir,options.file_name))
    let value=this.checkDirectory(options.dir)
    //console.log("check dir",value);
    if(value){
    return this.file.readAsText(this.directory_root+options.dir,options.file_name)
    }
  }
  writeFile(data,options){
    this.directory_root=this.file.dataDirectory
    //console.log("writeFile",data,options)
     this.checkDirectory(options.dir).then(value=>{
       //console.log("file value",value)
       // this.file.createDir(this.directory_root,options.dir,true)
        if(value){
        return this.file.writeFile(this.directory_root+options.dir,options.file_name,JSON.stringify(data),{replace:true}).then(result=>{})
      }
      else{
       this.createDirectory(options.dir).then(result=>{
         //console.log("result",result)
        return this.file.writeFile(this.directory_root+options.dir,options.file_name,JSON.stringify(data),{replace:true}).then(result=>{})
      },
      err=>{
        //console.log("create dir err",err)
      })
      }
      },err=>{
        //console.log("checkdir err",err)
        this.createDirectory(options.dir).then(result=>{
          //console.log("result",result)
         return this.file.writeFile(this.directory_root+options.dir,options.file_name,JSON.stringify(data),{replace:true}).then(result=>{})
       },
       error=>{
         //console.log("create dir err",error)
       })
      
      })
  }
  listDirectory(folderName:string){
    this.directory_root=this.file.dataDirectory
     return this.file.listDir(this.directory_root,folderName)
     
   //  return false
     
  }
  checkDirectory(folderName){
    this.directory_root=this.file.dataDirectory
    return this.file.checkDir(this.directory_root,folderName)
  }
  createDirectory(folderName){
    this.directory_root=this.file.dataDirectory
    return this.file.createDir(this.directory_root,folderName,true)
  }

  //FOR CONVERTING THE CLASS OF 13,14,15
  classConvertion(value){
    value=String(value);
    value=='13' ? value='LKG' : value == '14' ? value = 'UKG' : value == '15' ? value= 'Pre-KG' : value
    return value;
  }
}
