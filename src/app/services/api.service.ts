import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NetworkService, ConnectionStatus } from './network.service';
import { OfflineManagerService } from './offline-manager.service';
import { Observable, from, of, BehaviorSubject } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import {File} from '@ionic-native/file/ngx';
import {api_url} from '../../environments/environment';
import { FileHandlerService } from './file-handler/file-handler.service';
import { IonicStorageService } from './ionic-storage/ionic-storage.service';

const folder_name='templates'
const API_STORAGE_KEY = 'specialkey';
//const API_URL = 'https://reqres.in/api';
// const API_URL='http://localhost/SINE/databyid.php'
const API_URL=' http://demo4866112.mockable.io/ap';
const token_key="user_token";
const logged_username="logged_username";
const apiUrl = api_url;
const auth_key = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwidGltZXN0YW1wIjoxNTc3MTk1NTk5fQ.faNSlQkjmpwOge1EoRnjqj-HH1eT8yW7dwgkbR-AAgk';


// export enum ConnectionStatus{
//   Offline,
//   Online
// }

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  standardList:any[]=[];
  totalStandardList:any[]=[];
  termList:any[]=[];
  accessedStudent:any[]=[];
  misMatchList:any[]=[];
  selectedStandard:any;
  @Output() fire: EventEmitter<any> = new EventEmitter();
  headers = new HttpHeaders();
  public name = new BehaviorSubject("");
  getName = this.name.asObservable();
  counter = 1;
  languageInfo: BehaviorSubject<any>;
  languageDisableInfo:BehaviorSubject<Boolean>;

  constructor(private http:HttpClient,private networkService:NetworkService,private storage:Storage,
    private offlineManager:OfflineManagerService,private fileService:FileHandlerService,private file:File,private ionicStrorageService:IonicStorageService) { 

    this.languageInfo = new BehaviorSubject("en");
    this.languageDisableInfo = new BehaviorSubject(false);
  }

  languageChange(lan) {
    this.languageInfo.next(lan);
  }
  languageDisableUpdate(status) {
  this.languageDisableInfo.next(status);
  }
  setStandard(standardList) {
    this.standardList = standardList;
  }
  getStandard() {
    return this.standardList;
  }

  setSelectedStandard(standard) {
    this.selectedStandard = standard;
  }
  getSelectedStandard() {
    return this.selectedStandard;
  }
  setTerm(termList) {
    this.termList = termList;
  }
  getTermList() {
    return this.termList;
  }

  setAccessedStudents(studentList) {
    this.accessedStudent = studentList;
  }
  getAccessedStudents() {
    return this.accessedStudent;
  }

  setMismatchAttendance=(misMatchList)=>{

    this.misMatchList =misMatchList;
  }
  getMisMatchList=()=>{
    
    return this.misMatchList;
  }


  createAuthorizationHeader(headers: HttpHeaders) {    
    // headers.append('Authorization', 'application/json');
    headers.append('Accept', 'application/json');
     headers.append('Authorization', 'emis_dev');
     headers.append('authorization_key', auth_key);
     headers.append('Token', localStorage.getItem(token_key));
  }


  setName(result) {
  this.name.next(result);
  }

  doChange() {
     this.fire.emit(true);
   }
   getEmittedValue() {
    return this.fire;
  }
  
  getUsers(forceRefresh: boolean = false):Observable<any> {
    if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline || !forceRefresh) {
      // Return the cached data from Storage
      return from(this.getLocalData('users'));
    } else {
      // Just to get some "random" data
      let page = Math.floor(Math.random() * Math.floor(6));
      
      // Return real API data and store it locally
      return this.http.get(API_URL).pipe(
        // map(res => res['data']),
        tap(res => {
          this.setLocalData('users', res);
        })
      )
    }
  }
  updateUser(user, data): Observable<any> {
    let url = API_URL;
    if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline) {
      return from(this.offlineManager.storeRequest(url, 'GET', data));
    } else {
      return this.http.put(url, data).pipe(
        catchError(err => {
          this.offlineManager.storeRequest(url, 'GET', data);
          throw new Error(err);
        })
      );
    }
  }
   // Save result of API requests
   private setLocalData(key, data) {
    // this.storage.set(`${API_STORAGE_KEY}-${key}`, data);
    this.storage.set(`${key}`, data);
  }
 
  // Get cached API result
  private getLocalData(key) {
    return this.storage.get(`${API_STORAGE_KEY}-${key}`);
  }
  getQuestions():Observable<any>{
    let apiurl='http://demo4866112.mockable.io/questions'
    if(this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline){
      return from(this.getDataFromFile())
    }
    else{
    return this.http.get(apiurl).pipe(
      tap(res=>{
        this.setLocalData('que1',res);

        //Listing the Files on the Dir
      //   this.fileService.listDirectory('templates').then(listdir=>{
      //     console.log('list directory',listdir)
      //   })

      //   //Write the Data on the File
      //   this.fileService.writeFile(res,{dir:'templates',file_name:'question_observation'}).then(file_res=>{
      //    console.log("File Read",file_res)
      //  })
        
        //console.log("data dir",this.file.dataDirectory);
        // return this.file.listDir('/',this.file.dataDirectory)
      
        // let data:any=res;
        // data.offline_file=true
        // this.file.writeFile(this.file.dataDirectory+'/kd','',JSON.stringify(res))
        // alert(this.file.listDir(this.file.externalDataDirectory,''));
      //   this.file.createDir(this.file.externalDataDirectory,'templates',false)
      //   console.log("ne file",this.file.externalDataDirectory+'templates')
      //   this.file.writeFile(this.file.externalDataDirectory+'templates','file.txt','ss');
      //   console.log(this.file.listDir(this.file.externalDataDirectory,''))
      //   this.file.writeFile(this.file.externalDataDirectory,'sample.txt','sseo')
       return this.file.writeFile(this.file.externalDataDirectory,'question_observation.json',JSON.stringify(res),{replace:true})
      
        // .then(_=>{
        //   console.log("Directory Exists")
        // }).catch(res=>{
        //   console.log("Directory Does not exists",res)
        // })
      })
    )
  }
}

private getDataFromFile(){
  
  return this.file.readAsText(this.file.externalDataDirectory,'question_observation.json')
  // return this.fileService.readFile({dir:'templates',file_name:'question_observation'}).then(file_response=>{
 
  
  
}
saveQuestion(data:any):Observable<any>{
  
  if(this.networkService.getCurrentNetworkStatus()== ConnectionStatus.Offline){ 
     this.setLocalData('question',data)
  }
  else{
  return this.http.post(API_URL,{'records':data})
  }
}
getStudentsList(){
  let apiurl='http://demo4866112.mockable.io/students_list'
  return this.http.get(apiurl)
}
getMaster(data){
  return this.http.get(apiUrl+'getMaster?param1='+data)
  .pipe(
    catchError(this.handleError('role',[]))
  )
}
getAllTemplates(){
  if(this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline){
    // return from(this.fileService.listDirectory(folder_name))
  }
  return this.http.get(apiUrl+'getAllTemplates')
  .pipe(
    catchError(this.handleError('role', []))
    )
}
getSchoolListByBlockId (districtid:any){
  return this.http.post(apiUrl+'getSchoolListByDistrictId',{'districtid':districtid})
  .pipe(
    catchError(this.handleError('role',[]))
  )
}
getStudentsListBySchoolId(school_id:any):Observable<any>{
  if(this.networkService.getCurrentNetworkStatus()==ConnectionStatus.Offline){
    // let status="offline"
    return 
  }
  else{
  return this.http.post(apiUrl+'getStudentsListBySchoolId',{'schoolid':school_id})
  .pipe(
    catchError(this.handleError('',[]))
  )
  }
  
}
getTeachersListBySchoolId(school_id:any){
  return this.http.post(apiUrl+'getTeachersListBySchoolId',{'schoolid':school_id})
  .pipe(
    catchError(this.handleError('',[]))
  )
}
saveObservation(data:any){
  let url = apiUrl+'saveObservation';
    if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline) {
      return from(this.offlineManager.storeRequest(url, 'post', {records:data}));
    } 
    else{
  return this.http.post(apiUrl+'saveObservation',{records:data})
  .pipe(catchError(err=>{
    this.handleError('saveObservation',[])
    this.offlineManager.storeRequest(url,'post',{records:data})
    throw new Error(err)}))
    }
}
  getAllLeaningOutcomeQuestions(){
  return this.http.get(apiUrl+'getLeaningOutcomeQuestions')
  .pipe(catchError(this.handleError('Question_final',[])))
}
  getObservationList(datas)
  {
    // if(this.ionicStrorageService.getData('observation_list'))
    if(this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline){
      return from(this.ionicStrorageService.getData('observation_list'))
    }
    return this.http.post(apiUrl+'getObservationList',datas)
    .pipe(tap(res=>{
      let data:any=[]
      data=res;
     data.lastUpdated=new Date();
      this.setLocalData('observation_list',data)
    })
   )
  }
  //GETTING THE VERSION FROM API FOR UPDATE CHECK
  getAppVersionInfo(){
    return this.http.get(apiUrl+'getAppVersionInfo').pipe(catchError(this.handleError('getappVersion',[])))
  }


private handleError<T>(operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {
      return of(result as T);
  };
}

 getSchoolList (userName) {
  this.createAuthorizationHeader(this.headers);
  return this.http.post(apiUrl + `getSchoolMapping`, userName, {headers: this.headers
  }).pipe(catchError(this.handleError('School_List', [])));
 }
 getAllData (school_id) {
  this.createAuthorizationHeader(this.headers);
  return this.http.get(apiUrl + `getSchoolData/${school_id}`, {headers: this.headers
  }).pipe(catchError(this.handleError('Getting_AllData', [])));
 }

 getSchoolDetail(schoolId){
  this.createAuthorizationHeader(this.headers);
  return this.http.get(apiUrl + `getSchoolDetails/${schoolId}`, {headers: this.headers
  }).pipe(catchError(this.handleError('SchoolDetails', [])));
 }

 getTeacherDetail=(schoolId)=>{
  this.createAuthorizationHeader(this.headers);
  return this.http.get(apiUrl + `getTeacherDetails/${schoolId}`, {headers: this.headers
  }).pipe(catchError(this.handleError('TeacherDetails', [])));
 }

 getSchoolClassInfo=(schoolId)=>{
  this.createAuthorizationHeader(this.headers);
  return this.http.get(apiUrl + `getSchoolClassInfo/${schoolId}`, {headers: this.headers
  }).pipe(catchError(this.handleError('School_ClassDetails', [])));
 }

 getAllSubjects =(classDetail)=>{
  this.createAuthorizationHeader(this.headers);
  return this.http.post(apiUrl + `getSubjects`, classDetail, {headers: this.headers
  }).pipe(catchError(this.handleError('SubjectsList', [])));
 }

 getTeachingMethodology=(classDetail)=>{
  this.createAuthorizationHeader(this.headers);
  return this.http.post(apiUrl + `getTeachingMethodology`,classDetail, {headers: this.headers
  }).pipe(catchError(this.handleError('Question_final', [])));
 }

 getAttendanceDetails = (classDetail)=>{
  this.createAuthorizationHeader(this.headers);
  return this.http.post(apiUrl + `getStudentDetails`, classDetail, {headers: this.headers
  }).pipe(catchError(this.handleError('AttendanceDetails', [])));
 }

 getAllEducationDistricts= (districtId)=>{
  this.createAuthorizationHeader(this.headers);
  return this.http.post(apiUrl + `getObservationInfo`, districtId, {headers: this.headers
  }).pipe(catchError(this.handleError('GetAllEducationDistrictList', [])));
  }

 getAllBlocks = (districtId)=>{
  this.createAuthorizationHeader(this.headers);
  return this.http.post(apiUrl + `getObservationInfo`, districtId, {headers: this.headers
  }).pipe(catchError(this.handleError('GetAllBlockList', [])));
 }

 getAllZones = (districtId)=>{
  this.createAuthorizationHeader(this.headers);
  return this.http.post(apiUrl + `getObservationInfo`, districtId, {headers: this.headers
  }).pipe(catchError(this.handleError('GetAllZonesList', [])));

 }

 getAssesmentReasonsList=()=>{
  this.createAuthorizationHeader(this.headers);
  return this.http.get(apiUrl + `getAssesmentReasons`, {headers: this.headers
  }).pipe(catchError(this.handleError('AssessmentReasonList', [])));
 }

 getAllTermList=()=>{
  this.createAuthorizationHeader(this.headers);
  return this.http.get(apiUrl + `getTermList`, {headers: this.headers
  }).pipe(catchError(this.handleError('GetAllTermList', [])));
 }

 getChapterList=(termDetail)=>{
  this.createAuthorizationHeader(this.headers);
  return this.http.post(apiUrl + `getChapterSection`,termDetail, {headers: this.headers
  }).pipe(catchError(this.handleError('GetChaptersList', [])));
 }

 getMisMatchReasons=()=>{
  this.createAuthorizationHeader(this.headers);
  return this.http.get(apiUrl + `getMismatchReasons`,{headers: this.headers
  }).pipe(catchError(this.handleError('MismatchReasonList', [])));
 }

 getAllassesmentQuestions= (chapterDetail) => {
  this.createAuthorizationHeader(this.headers);
  return this.http.post(apiUrl + `getQuestions`,chapterDetail,{headers: this.headers
  }).pipe(catchError(this.handleError('GetAllAssessmentQuestions', [])));
 }

 postfinalinfo= (finalData)=>{
  this.createAuthorizationHeader(this.headers);
  return this.http.post(apiUrl + `saveObservationJson`,finalData,{headers: this.headers
  }).pipe(catchError(this.handleError('submittingFinalData', [])));
 }

}
