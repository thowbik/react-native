import { Component, OnInit, OnDestroy, ɵConsole } from "@angular/core";
import { ModalController, Platform } from "@ionic/angular";
import { Router } from "@angular/router";
import { ApiService } from "src/app/services/api.service";
import { AnyARecord } from "dns";
import { IonicStorageService } from "src/app/services/ionic-storage/ionic-storage.service";
import { TranslateService } from "@ngx-translate/core";
import { LoadingService } from "src/app/services/loading.service";
import _ from "lodash";
import { Action } from 'rxjs/internal/scheduler/Action';

@Component({
  selector: "app-observation",
  templateUrl: "./observation.component.html",
  styleUrls: ["./observation.component.scss"],
})
export class ObservationComponent implements OnInit, OnDestroy {
  public items: any = [];
  public class123: any = [];
  public class45: any = [];
  public class678: any = [];
  public misMatchAttendance: any[] = [];
  public teacherDetails: any;
  public classDetails: any;
  public schoolDetails: any;
  public storeDetail: any;
  public chapterDetail: any;
  public accessedStudentList: any[] = [];
  progressValue: number;
  public _areas = {
    aos: [],
    aod: [],
  };
  /*-- Language Variables Starts --*/
  public languageType: any;
  public Observation: any;
  public Report: any;
  public discussReport: any;
  public schoolObserved: any;
  public standardObserved: any;
  public subject: any;
  public studentTested: any;
  public identifyAlphabet: any;
  public TodayReport: any;
  public areastrength: any;
  public areaImprovement: any;
  public assessmentResults: any;
  public back: any;
  public next: any;
  /*-- Language Variables Ends --*/

  constructor(
    public modalController: ModalController,
    public _router: Router,
    public _apiService: ApiService,
    public loading: LoadingService,
    public ionicStore: IonicStorageService,
    private _translate: TranslateService,
    private platform: Platform
  ) {
    this.items = [
      { expanded: false },
      { expanded: false },
      { expanded: false },
      { expanded: false },
      { expanded: false },
      { expanded: false },
      { expanded: false },
      { expanded: false },
      { expanded: false },
    ];
  }

  ngOnInit() {
    this.progressValue = Math.round(((10 - 2) / 12) * 100);
    this.appLanguage();
    this.loading.present();

    let teacherInfo = localStorage.getItem("teacherInfo");
    this.teacherDetails = JSON.parse(teacherInfo);
    let classInfo = localStorage.getItem("classInfo");
    this.classDetails = JSON.parse(classInfo);
    let schoolInfo = localStorage.getItem("schoolInfo");
    this.schoolDetails = JSON.parse(schoolInfo);

    /*  Getting AllPage Entered Info....*/
    this.ionicStore.getStoreData().then((response) => {
      this.storeDetail = response;
      this.storeDetail.pages.currentPage = "observationReport";
      //  this.storeDetail.pages.pageData.splice(9);
      this.ionicStore.setStoreData(this.storeDetail);

      /*  Check This Page is Registered or Not, If 'Registered' move to 'else' part...  */
      if (this.storeDetail.pages.pageData[9] === undefined) {
        this.createPage();
      }
      this.chapterDetail = this.storeDetail.pages.pageData[6].correctedDetails.unitInfo.learning_outcome;
      this.accessedStudentList = _.remove(
        _.flattenDeep(this.storeDetail.pages.pageData[8].pageDetails),
        _.undefined
      );

      this.getList();
      this.loading.dismiss();
    });

    if (this.platform.is("android")) {
      // Plugin to prevent the screenshot in this page.
      // (<any>window).plugins.preventscreenshot.enable(
      //   (a) => this.successInPreventScreenshot(a),
      //   (b) => this.errorInPreventScreenshot(b)
      // );
    }
  }

  successInPreventScreenshot(isDone) {
    console.log("prevented screenshot ==> ", isDone);
  }

  errorInPreventScreenshot(isError) {
    console.log("Error in Prevent Screenshot ==> ", isError);
  }

  /*  Getting language Info... */

  appLanguage() {
    this._apiService.languageInfo.subscribe((data: any) => {
      this.languageType = data;      
      this._translate.use(this.languageType);
      this._initialiseTranslation();
    });
  }

  _initialiseTranslation(): void {
    this._translate.get("Observation").subscribe((res: string) => {
      this.Observation = res;
    });
    this._translate.get("Report").subscribe((res: string) => {
      this.Report = res;
    });
    this._translate.get("discussReport").subscribe((res: string) => {
      this.discussReport = res;
    });
    this._translate.get("schoolObserved").subscribe((res: string) => {
      this.schoolObserved = res;
    });
    this._translate.get("standardObserved").subscribe((res: string) => {
      this.standardObserved = res;
    });
    this._translate.get("subject").subscribe((res: string) => {
      this.subject = res;
    });
    this._translate.get("studentTested").subscribe((res: string) => {
      this.studentTested = res;
    });
    this._translate.get("TodayReport").subscribe((res: string) => {
      this.TodayReport = res;
    });
    this._translate.get("areastrength").subscribe((res: string) => {
      this.areastrength = res;
    });
    this._translate.get("areaImprovement").subscribe((res: string) => {
      this.areaImprovement = res;
    });
    this._translate.get("assessmentResults").subscribe((res: string) => {
      this.assessmentResults = res;
    });
    this._translate.get("next").subscribe((res: string) => {
      this.next = res;
    });
    this._translate.get("back").subscribe((res: string) => {
      this.back = res;
    });
  }

  expandItem(item): void {
    if (item.expanded) {
      item.expanded = false;
    } else {
      this.items.map((listItem) => {
        if (item == listItem) {
          listItem.expanded = !listItem.expanded;
        } else {
          listItem.expanded = false;
        }
        return listItem;
      });
    }
  }

  getAreas = (groupedQuestions, area) => {    
    for (const key in groupedQuestions) {
      if (groupedQuestions.hasOwnProperty(key)) {
        const elements = groupedQuestions[key];                
        const elementsSorted = _.sortBy(elements, ["action_priority"]);
        for (let i = 0; i < elementsSorted.length; i++) {          
          const action = elementsSorted[i];
          const selAnswer = action.selectedAnswer;          
          const answerId = selAnswer.answer_id;
          if (!action.ans) continue;
          const _area = action.ans[area];
          const ans = action.ans.ans;                
          let joinedSel, isAOS;          
          if (Array.isArray(selAnswer)) {
            joinedSel = selAnswer.map((s) => s.answer_id).sort();
            // .join();

            if (action.action_name === "CCE record") {
              if (joinedSel.join() === "1,2,3") {
                if (_area[1]) {
                  if (_area[1].length > 1) {
                    isAOS = _.includes(_area.toString(), joinedSel.join());
                  }
                }
              } else {
                joinedSel.forEach((js) => {
                  isAOS = _.includes(_area, js);
                });
              }
            } else {              
              joinedSel.forEach((js) => {
                isAOS = _.includes(_area, js);
              });
            }
          } else {            
            joinedSel = selAnswer.answer_id;
            isAOS = _.includes(_area, joinedSel);            
          }

          if(elementsSorted[i].action_name==="Pedagogy"&&elementsSorted[i].classtype==='2'&&elementsSorted[i].action_priority==='1'){                          
            if (isAOS) {
              if (Array.isArray(joinedSel)) {
                if (_area[1] && _area[1].length > 1) {
                  this._areas[area].push({
                    action_item_description: _area[1],
                    param_id:action.param_id
                  });
                } else {
                  joinedSel.forEach((jss) => {
                    const f = _.find(ans, (a) => a.id === jss);                  
                    f.param_id = action.param_id;
                    this._areas[area].push(f);
                  });
                }
              } 
              else {                            
                const f = _.find(ans, (a) => a.id === joinedSel);              
                f.param_id = action.param_id;
                this._areas[area].push(f);                
              }                          
            }               
            //continue;
          }          
          else{              
            if (isAOS) {
              if (Array.isArray(joinedSel)) {
                if (_area[1] && _area[1].length > 1) {
                  this._areas[area].push({
                    action_item_description: _area[1],
                    param_id:action.param_id
                  });
                } else {
                  joinedSel.forEach((jss) => {
                    const f = _.find(ans, (a) => a.id === jss);                  
                    f.param_id = action.param_id;
                    this._areas[area].push(f);
                  });
                }
              } else {                            
                const f = _.find(ans, (a) => a.id === joinedSel);              
                f.param_id = action.param_id;
                this._areas[area].push(f);
              }            
              break;  
            }
            
          }            

          if (isAOS) {
            if (Array.isArray(joinedSel)) {
              if (_area[1] && _area[1].length > 1) {
                this._areas[area].push({
                  action_item_description: _area[1],
                  param_id:action.param_id
                });
              } else {
                joinedSel.forEach((jss) => {
                  const f = _.find(ans, (a) => a.id === jss);                  
                  f.param_id = action.param_id;
                  this._areas[area].push(f);
                });
              }
            } else {                            
              const f = _.find(ans, (a) => a.id === joinedSel);              
              f.param_id = action.param_id;
              this._areas[area].push(f);
            }                        
          }
        }
      }
    }    
    };
  
  // getAreas = (groupedQuestions, area) => {
  //   for (const key in groupedQuestions) {
  //     if (groupedQuestions.hasOwnProperty(key)) {
  //       const elements = groupedQuestions[key];

  //       const elementsSorted = _.sortBy(elements, ["action_priority"]);
  //       for (let i = 0; i < elementsSorted.length; i++) {
  //         const action = elementsSorted[i];
  //         const selAnswer = action.selectedAnswer;
  //         const answerId = selAnswer.answer_id;
  //         if (!action.ans) continue;
  //         const _area = action.ans[area];
  //         const ans = action.ans.ans;

  //         let joinedSel, isAOS;
  //         if (Array.isArray(selAnswer)) {
  //           joinedSel = selAnswer.map((s) => s.answer_id).sort();
  //           // .join();

  //           if (action.action_name === "CCE record") {
  //             if (joinedSel.join() === "1,2,3") {
  //               if (_area[1]) {
  //                 if (_area[1].length > 1) {
  //                   isAOS = _.includes(_area.toString(), joinedSel.join());
  //                 }
  //               }
  //             } else {
  //               joinedSel.forEach((js) => {
  //                 isAOS = _.includes(_area, js);
  //               });
  //             }
  //           } else {
  //             joinedSel.forEach((js) => {
  //               isAOS = _.includes(_area, js);
  //             });
  //           }
  //         } else {
  //           joinedSel = selAnswer.answer_id;
  //           isAOS = _.includes(_area, joinedSel);
  //         }

  //         if (isAOS) {
  //           if (Array.isArray(joinedSel)) {
  //             if (_area[1] && _area[1].length > 1) {
  //               this._areas[area].push({
  //                 action_item_description: _area[1],
  //               });
  //             } else {
  //               joinedSel.forEach((jss) => {
  //                 const f = _.find(ans, (a) => a.id === jss);
  //                 this._areas[area].push(f);
  //               });
  //             }
  //           } else {
  //             const f = _.find(ans, (a) => a.id === joinedSel);
  //             this._areas[area].push(f);
  //           }

  //           break;
  //         }
  //       }
  //     }
  //   }
  // };

  checkpedagogy = (groupedQuestions, area) => {
    for (const key in groupedQuestions) {
      if (groupedQuestions.hasOwnProperty(key)) {
        const elements = groupedQuestions[key];        
        const elementsSorted = _.sortBy(elements, ["action_priority"]);
        for (let i = 0; i < elementsSorted.length; i++) {          
          const action = elementsSorted[i];
          const selAnswer = action.selectedAnswer;
          const answerId = selAnswer.answer_id;
          if (!action.ans) continue;
          if(action.classtype=='2' && action.action_name=="Pedagogy"){            
            if(action.class=='1'||action.class=='2'||action.class=='3'){                            
              for( let j=0;j<selAnswer.length;j++){                
                this.class123.push(selAnswer[j].answer_id);                                
              }              
            }
            if(action.class=='4'||action.class=='5'){              
              for( let j=0;j<selAnswer.length;j++){
                this.class45.push(selAnswer[j].answer_id)                
              }              
            }
            if(action.class=='6'||action.class=='7'||action.class=='8'){              
              for( let j=0;j<selAnswer.length;j++){
                this.class678.push(selAnswer[j].answer_id)                
              }              
            }                        
          }
        }        
    }
  }    
    // if(this.class123.indexOf('4') !==-1){      
    //   for (var i = 0; i < this._areas.aos.length; i++){        
    //     if (this._areas.aos[i].action_item_description === 'You are following the steps in the pedagogy. Well done!') { 
    //       this._areas.aos.splice(i, 1);            
    //     }
    //     if (this._areas.aos[i].action_item_description === 'நீங்கள் கற்றல்-கற்பித்தல் செயல்பாடுகளைப் பின்பற்றுகிறீர்கள். வாழ்த்துக்கள்!') { 
    //       this._areas.aos.splice(i, 1);            
    //     }                 
    //   }                         
    // }
    // else{           
    //   for (var i = 0; i < this._areas.aod.length; i++){        
    //     if (this._areas.aod[i].action_item_description === 'Teacher contact activity, peer activity and independent activity need to be carried out in all classes') { 
    //       this._areas.aod.splice(i, 1);            
    //     }
    //     if (this._areas.aod[i].action_item_description === 'ஆசிரியர் நேர செயல்பாடு, குழு செயல்பாடு மற்றும் தனி நபர் செயல்பாடு ஆகியவை வகுப்பில் மேற்கொள்ளப்பட வேண்டும்') { 
    //       this._areas.aod.splice(i, 1);            
    //     }         
    //   }          
    // }      
      if(this.class123.length>0&&this.class45.length>0){        
        if(this.class123.indexOf('4') !==-1&&this.class45.indexOf('8') !==-1){                
          for (var i = 0; i < this._areas.aos.length; i++){        
            if (this._areas.aos[i].action_item_description === 'You are following the steps in the pedagogy. Well done!') { 
              this._areas.aos.splice(i, 1);            
            }
            if (this._areas.aos[i].action_item_description === 'நீங்கள் கற்றல்-கற்பித்தல் செயல்பாடுகளைப் பின்பற்றுகிறீர்கள். வாழ்த்துக்கள்!') { 
              this._areas.aos.splice(i, 1);            
            }                 
            if (this._areas.aos[i].action_item_description === 'You follow the steps in the SALM pedagogy. Well done!') { 
              this._areas.aos.splice(i, 1);            
            }
            if (this._areas.aos[i].action_item_description === 'நீங்கள் SALM கற்றல்-கற்பித்தல் செயல்பாடுகளைப் பின்பற்றுகிறீர்கள். வாழ்த்துக்கள்!') { 
              this._areas.aos.splice(i, 1);            
            }
          }  
          for (var i = 0; i < this._areas.aod.length; i++){        
            if (this._areas.aod[i].action_item_description === 'Teacher contact activity, peer activity and independent activity need to be carried out in all classes') { 
              this._areas.aod.splice(i, 1);            
            }
            if (this._areas.aod[i].action_item_description === 'ஆசிரியர் நேர செயல்பாடு, குழு செயல்பாடு மற்றும் தனி நபர் செயல்பாடு ஆகியவை வகுப்பில் மேற்கொள்ளப்பட வேண்டும்') { 
              this._areas.aod.splice(i, 1);                          
            }         
            if (this._areas.aod[i].action_item_description === 'Follow the steps in the SALM pedagogy.') { 
              this._areas.aod.splice(i, 1);            
            }
            if (this._areas.aod[i].action_item_description === 'SALM  கற்றல்-கற்பித்தல் செயல்பாடுகளைப் பின்பற்றவும்.') { 
              this._areas.aod.splice(i, 1);            
            }            
          }              
          if(this.languageType=='en'){
            const data = {param_id:'2',action_item_description:'Please Follow the steps in the pedagogy.'};
            if(this._areas.aod){
              if(this._areas.aod[0].param_id==='1'){
                this._areas.aod.splice(1, 0, data);                              
              }
              else{
                this._areas.aod.unshift(data)           
              }
            }               
          }
          else{
            const data = {param_id:'2',action_item_description:'கற்றல்-கற்பித்தல் செயல்பாடுகளைப் பின்பற்றவும்.'};
            if(this._areas.aod){
              if(this._areas.aod[0].param_id==='1'){
                this._areas.aod.splice(1, 0, data);                              
              }
              else{
                this._areas.aod.unshift(data)           
              }
            }               
          }          
          // if(this._areas.aod){
          //   if(this._areas.aod[0].param_id==='1'){
          //     this._areas.aod.splice(1, 0, data);                              
          //   }
          //   else{
          //     this._areas.aod.unshift(data)           
          //   }
          // }          
          //this._areas.aod.splice(1, 0, data);                          
          //this._areas.aod.includes('Please Follow the steps in the pedagogy.')                      
        }
        else if(this.class123.indexOf('4') ==-1&&this.class45.indexOf('8') ==-1){                                         
          for (var i = 0; i < this._areas.aod.length; i++){        
            if (this._areas.aod[i].action_item_description === 'Teacher contact activity, peer activity and independent activity need to be carried out in all classes') { 
              this._areas.aod.splice(i, 1);            
            }
            if (this._areas.aod[i].action_item_description === 'ஆசிரியர் நேர செயல்பாடு, குழு செயல்பாடு மற்றும் தனி நபர் செயல்பாடு ஆகியவை வகுப்பில் மேற்கொள்ளப்பட வேண்டும்') { 
              this._areas.aod.splice(i, 1);                          
            }         
            if (this._areas.aod[i].action_item_description === 'Follow the steps in the SALM pedagogy.') { 
              this._areas.aod.splice(i, 1);            
            }
            if (this._areas.aod[i].action_item_description === 'SALM  கற்றல்-கற்பித்தல் செயல்பாடுகளைப் பின்பற்றவும்.') { 
              this._areas.aod.splice(i, 1);            
            }            
          }   
          for (var i = 0; i < this._areas.aos.length; i++){        
            if (this._areas.aos[i].action_item_description === 'You are following the steps in the pedagogy. Well done!') { 
              this._areas.aos.splice(i, 1);            
            }
            if (this._areas.aos[i].action_item_description === 'நீங்கள் கற்றல்-கற்பித்தல் செயல்பாடுகளைப் பின்பற்றுகிறீர்கள். வாழ்த்துக்கள்!') { 
              this._areas.aos.splice(i, 1);            
            }                 
            if (this._areas.aos[i].action_item_description === 'You follow the steps in the SALM pedagogy. Well done!') { 
              this._areas.aos.splice(i, 1);            
            }
            if (this._areas.aos[i].action_item_description === 'நீங்கள் SALM கற்றல்-கற்பித்தல் செயல்பாடுகளைப் பின்பற்றுகிறீர்கள். வாழ்த்துக்கள்!') { 
              this._areas.aos.splice(i, 1);            
            }
          }            
          if(this.languageType=='en'){
            const data = {param_id:'2',action_item_description:'You are following the steps in the pedagogy. Well done!'};
            if(this._areas.aos){
              if(this._areas.aos[0].param_id==='1'){
                this._areas.aos.splice(1, 0, data);                              
              }
              else{
                this._areas.aos.unshift(data);
              }
            }            
          }
          else{
            const data = {param_id:'2',action_item_description:'நீங்கள் கற்றல்-கற்பித்தல் செயல்பாடுகளைப் பின்பற்றுகிறீர்கள். வாழ்த்துக்கள்!'};
            if(this._areas.aos){
              if(this._areas.aos[0].param_id==='1'){
                this._areas.aos.splice(1, 0, data);                              
              }
              else{
                this._areas.aos.unshift(data);
              }
            }            
          }  
                    
          //this._areas.aos.splice(1, 0, data);                          
        }
        else if(this.class123.indexOf('4') ==-1&&this.class45.indexOf('8') !==-1){                                         
          for (var i = 0; i < this._areas.aod.length; i++){        
            if (this._areas.aod[i].action_item_description === 'Teacher contact activity, peer activity and independent activity need to be carried out in all classes') { 
              this._areas.aod.splice(i, 1);            
            }
            if (this._areas.aod[i].action_item_description === 'ஆசிரியர் நேர செயல்பாடு, குழு செயல்பாடு மற்றும் தனி நபர் செயல்பாடு ஆகியவை வகுப்பில் மேற்கொள்ளப்பட வேண்டும்') { 
              this._areas.aod.splice(i, 1);                          
            }         
            // if (this._areas.aod[i].action_item_description === 'Follow the steps in the SALM pedagogy.') { 
            //   this._areas.aod.splice(i, 1);            
            // }
            // if (this._areas.aod[i].action_item_description === 'SALM  கற்றல்-கற்பித்தல் செயல்பாடுகளைப் பின்பற்றவும்.') { 
            //   this._areas.aod.splice(i, 1);            
            // }            
          }   
          for (var i = 0; i < this._areas.aos.length; i++){        
            // if (this._areas.aos[i].action_item_description === 'You are following the steps in the pedagogy. Well done!') { 
            //   this._areas.aos.splice(i, 1);            
            // }
            // if (this._areas.aos[i].action_item_description === 'நீங்கள் கற்றல்-கற்பித்தல் செயல்பாடுகளைப் பின்பற்றுகிறீர்கள். வாழ்த்துக்கள்!') { 
            //   this._areas.aos.splice(i, 1);            
            // }                 
            if (this._areas.aos[i].action_item_description === 'You follow the steps in the SALM pedagogy. Well done!') { 
              this._areas.aos.splice(i, 1);            
            }
            if (this._areas.aos[i].action_item_description === 'நீங்கள் SALM கற்றல்-கற்பித்தல் செயல்பாடுகளைப் பின்பற்றுகிறீர்கள். வாழ்த்துக்கள்!') { 
              this._areas.aos.splice(i, 1);            
            }
          }            
        }   
        else if(this.class123.indexOf('4') !==-1&&this.class45.indexOf('8') ==-1){                                         
          for (var i = 0; i < this._areas.aod.length; i++){        
            // if (this._areas.aod[i].action_item_description === 'Teacher contact activity, peer activity and independent activity need to be carried out in all classes') { 
            //   this._areas.aod.splice(i, 1);            
            // }
            // if (this._areas.aod[i].action_item_description === 'ஆசிரியர் நேர செயல்பாடு, குழு செயல்பாடு மற்றும் தனி நபர் செயல்பாடு ஆகியவை வகுப்பில் மேற்கொள்ளப்பட வேண்டும்') { 
            //   this._areas.aod.splice(i, 1);                          
            // }         
            if (this._areas.aod[i].action_item_description === 'Follow the steps in the SALM pedagogy.') { 
              this._areas.aod.splice(i, 1);            
            }
            if (this._areas.aod[i].action_item_description === 'SALM  கற்றல்-கற்பித்தல் செயல்பாடுகளைப் பின்பற்றவும்.') { 
              this._areas.aod.splice(i, 1);            
            }            
          }   
          for (var i = 0; i < this._areas.aos.length; i++){        
            if (this._areas.aos[i].action_item_description === 'You are following the steps in the pedagogy. Well done!') { 
              this._areas.aos.splice(i, 1);            
            }
            if (this._areas.aos[i].action_item_description === 'நீங்கள் கற்றல்-கற்பித்தல் செயல்பாடுகளைப் பின்பற்றுகிறீர்கள். வாழ்த்துக்கள்!') { 
              this._areas.aos.splice(i, 1);            
            }                 
            // if (this._areas.aos[i].action_item_description === 'You follow the steps in the SALM pedagogy. Well done!') { 
            //   this._areas.aos.splice(i, 1);            
            // }
            // if (this._areas.aos[i].action_item_description === 'நீங்கள் SALM கற்றல்-கற்பித்தல் செயல்பாடுகளைப் பின்பற்றுகிறீர்கள். வாழ்த்துக்கள்!') { 
            //   this._areas.aos.splice(i, 1);            
            // }
          }            
        }                
      }

      if(this.class123&&!this.class45){                
        if(this.class123.indexOf('4') !==-1){      
          for (var i = 0; i < this._areas.aos.length; i++){        
            if (this._areas.aos[i].action_item_description === 'You are following the steps in the pedagogy. Well done!') { 
              this._areas.aos.splice(i, 1);            
            }
            if (this._areas.aos[i].action_item_description === 'நீங்கள் கற்றல்-கற்பித்தல் செயல்பாடுகளைப் பின்பற்றுகிறீர்கள். வாழ்த்துக்கள்!') { 
              this._areas.aos.splice(i, 1);            
            }                 
          }                         
        }
        else{                 
          for (var i = 0; i < this._areas.aod.length; i++){        
            if (this._areas.aod[i].action_item_description === 'Teacher contact activity, peer activity and independent activity need to be carried out in all classes') { 
              this._areas.aod.splice(i, 1);            
            }
            if (this._areas.aod[i].action_item_description === 'ஆசிரியர் நேர செயல்பாடு, குழு செயல்பாடு மற்றும் தனி நபர் செயல்பாடு ஆகியவை வகுப்பில் மேற்கொள்ளப்பட வேண்டும்') { 
              this._areas.aod.splice(i, 1);            
            }         
          }          
        }   
      
      
      if(this.class45&&!this.class123){                
        if(this.class45.indexOf('8') !==-1){
          for (var i = 0; i < this._areas.aos.length; i++){        
            if (this._areas.aos[i].action_item_description === 'You follow the steps in the SALM pedagogy. Well done!') { 
              this._areas.aos.splice(i, 1);            
            }
            if (this._areas.aos[i].action_item_description === 'நீங்கள் SALM கற்றல்-கற்பித்தல் செயல்பாடுகளைப் பின்பற்றுகிறீர்கள். வாழ்த்துக்கள்!') { 
              this._areas.aos.splice(i, 1);            
            }         
          }          
        }
        else{
          for (var i = 0; i < this._areas.aod.length; i++){        
            if (this._areas.aod[i].action_item_description === 'Follow the steps in the SALM pedagogy.') { 
              this._areas.aod.splice(i, 1);            
            }
            if (this._areas.aod[i].action_item_description === 'SALM  கற்றல்-கற்பித்தல் செயல்பாடுகளைப் பின்பற்றவும்.') { 
              this._areas.aod.splice(i, 1);            
            }                 
          }          
        } 
      }      
   
    }  

    // if(this.class45.indexOf('8') !==-1){
    //   for (var i = 0; i < this._areas.aos.length; i++){        
    //     if (this._areas.aos[i].action_item_description === 'You follow the steps in the SALM pedagogy. Well done!') { 
    //       this._areas.aos.splice(i, 1);            
    //     }
    //     if (this._areas.aos[i].action_item_description === 'நீங்கள் SALM கற்றல்-கற்பித்தல் செயல்பாடுகளைப் பின்பற்றுகிறீர்கள். வாழ்த்துக்கள்!') { 
    //       this._areas.aos.splice(i, 1);            
    //     }         
    //   }          
    // }
    // else{
    //   for (var i = 0; i < this._areas.aod.length; i++){        
    //     if (this._areas.aod[i].action_item_description === 'Follow the steps in the SALM pedagogy.') { 
    //       this._areas.aod.splice(i, 1);            
    //     }
    //     if (this._areas.aod[i].action_item_description === 'SALM  கற்றல்-கற்பித்தல் செயல்பாடுகளைப் பின்பற்றவும்.') { 
    //       this._areas.aod.splice(i, 1);            
    //     }                 
    //   }          
    // }
    if(this.class678.length>0){
    if(this.class678.indexOf('8') !==-1){      
      for (var i = 0; i < this._areas.aos.length; i++){        
        if (this._areas.aos[i].action_item_description === 'You follow the steps in the ALM pedagogy. Well done!') { 
          this._areas.aos.splice(i, 1);            
        }
        if (this._areas.aos[i].action_item_description === 'நீங்கள் ALM கற்றல்-கற்பித்தல் செயல்பாடுகளைப் பின்பற்றுகிறீர்கள். வாழ்த்துக்கள்!') { 
          this._areas.aos.splice(i, 1);            
        }                 
      }          
    }
    else{     
      for (var i = 0; i < this._areas.aod.length; i++){        
        if (this._areas.aod[i].action_item_description === 'Follow the steps in the ALM pedagogy.') { 
          this._areas.aod.splice(i, 1);                      
        } 
        if (this._areas.aod[i].action_item_description === 'ALM கற்றல்-கற்பித்தல் செயல்பாடுகளைப் பின்பற்றவும்.') { 
          this._areas.aod.splice(i, 1);                      
        }                 
      }          
    }
  }    
    this._areas.aos = _.uniqBy(
      this._areas.aos,
      (_this) => _this.param_id
    );
    this._areas.aod = _.uniqBy(
      this._areas.aod,
      (_this) => _this.param_id
    );                      
                     
  };  

  /*  Calculating AOS and AOD List here......*/
  getList = () => {
    if (this.storeDetail.pages.pageData[5] !== undefined) {
      let questionData = this.storeDetail.pages.pageData[5].correctedDetails
        .customizeSectionList;
      let questionsList = [];
      questionData.forEach((element) => {
        element.questionList.forEach((data) => {
          questionsList.push(data);
        });
      });
      questionsList.sort((x, y) => {
        return (
          Number(x.param_priority) - Number(y.param_priority) ||
          Number(x.action_priority) - Number(y.action_priority)
        );
      });

      const groupedQuestions = _.groupBy(questionsList, "param_priority");      
      this.getAreas(groupedQuestions, "aos");
      this.getAreas(groupedQuestions, "aod");      

      this._areas.aos = _.uniqBy(
        this._areas.aos,
        (_this) => _this.action_item_description
      );
      this._areas.aod = _.uniqBy(
        this._areas.aod,
        (_this) => _this.action_item_description
      );        
    
      this.checkpedagogy(groupedQuestions,this._areas);      
    }
  };

  /*  Registering This Page in Storage ....*/
  createPage = () => {
    let apiData = {
      pageNo: "10",
      pageName: "observationReport",
      apiResponse: {
        records: {},
      },
      pageDetails: {
        strength: [],
        improvement: [],
      },
    };
    this.storeDetail.pages.pageData[9] = apiData;
    this.ionicStore.setStoreData(this.storeDetail);
  };

  goToNextPage = () => {
    this.misMatchAttendance = this.storeDetail.pages.pageData[4].correctedDetails;
    this.storeDetail.pages.pageData[9].pageDetails.strength = this._areas.aos;
    this.storeDetail.pages.pageData[9].pageDetails.improvement = this._areas.aod;
    this.storeDetail.pages.currentProgress = this.progressValue;

    this.ionicStore.setStoreData(this.storeDetail);
    if (this.misMatchAttendance.length) {
      this._router.navigate(["/page-route/attendance/student-data"]);
    } else {
      this._router.navigate(["/page-route/observation/updateObservation"]);
    }
  };

  goBack = () => {
    this._router.navigate(["/page-route/assessment/student-performance"]);
  };

  ngOnDestroy() {
    if (this.platform.is("android")) {
      // Enable the screenshot after it leaves this page.
      // (<any>window).plugins.preventscreenshot.disable(
      //   (a) => this.successInPreventScreenshot(a),
      //   (b) => this.errorInPreventScreenshot(b)
      // );
    }
  }
}
