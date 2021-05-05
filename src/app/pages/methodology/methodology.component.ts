import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  ɵConsole,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from "@angular/core";
import { Router } from "@angular/router";
import { ApiService } from "src/app/services/api.service";
import { IonicStorageService } from "src/app/services/ionic-storage/ionic-storage.service";
import { AlertService } from "src/app/services/alert.service";
import { TranslateService } from "@ngx-translate/core";
import { LoadingService } from "src/app/services/loading.service";
import _ from "lodash";

@Component({
  selector: "app-methodology",
  templateUrl: "./methodology.component.html",
  styleUrls: ["./methodology.component.scss"],
})
export class MethodologyComponent implements OnInit {
  //@ViewChild('headersize') headersize: ElementRef;
  // @ViewChild('headersize', {read: ElementRef, static:false}) elementView: ElementRef;

  //@ViewChild('headersize') private headersize: any;
  @ViewChild("headersize", { read: ElementRef }) headersize: ElementRef;
  headerSizeh: any;
  footerSizeh: any;
  contentSizeh: any;
  actualvalue: any;
  styleInfo: any;
  elTop: any;
  elBottom: any;
  @Input()
  name: string;
  @Input()
  description: string;
  @Input()
  image: string;
  @Output()
  change: EventEmitter<string> = new EventEmitter<string>();
  itemIndex: any;
  headerClicked: boolean = false;
  currentIndex: any;
  question_no: number = 0;
  public selectedSection: any;
  public methodologyQuestions: any[] = [];
  public sectionList: any[] = [];
  public questionList: any[] = [];
  public tempQuestions: any[] = [];
  public finalAnswerdList: any = {};
  public masterApiResponse: any;
  public subQuestionNo: number = 0; /* subQuestion Number .....*/
  lastChildQuesIdIndex: any;
  public classroomSelection_ClassList_Ids: any;
  public classroomSelection_ClassList: any;
  answerNo: any;
  storeDetail: any;
  classType: any;
  selectedClass: any;
  sectionName: any;
  pageDetail: any;
  progressValue: number;
  /*-- Language Variables Starts --*/
  public languageType: any;
  public classroom: any;
  public Practices: any;
  public back: any;
  public next: any;
  public fillAnswer: any;
  public teaching: any;
  public methodology: any;
  /*-- Language Variables Ends --*/

  constructor(
    private _router: Router,
    public apiService: ApiService,
    private _translate: TranslateService,
    public _alertService: AlertService,
    public ionicStore: IonicStorageService,
    public loading: LoadingService,
    private el: ElementRef
  ) {}

  ngOnInit() {
    this.progressValue = Math.round(((6 - 2) / 12) * 100);
    this.appLanguage();
    this.loading.present();

    /*  Getting All Details Stored in offlineStorage....*/
    this.ionicStore.getOffStorage().then((response) => {
      this.masterApiResponse = response.records;
      /*  Getting AllPage Entered Info....*/
      this.ionicStore.getStoreData().then((response) => {
        this.storeDetail = response;

        this.storeDetail.pages.currentPage = "teachingMethodology";
        // this.storeDetail.pages.pageData.splice(5);
        this.ionicStore.setStoreData(this.storeDetail);
        this.classType = this.storeDetail.pages.pageData[3].pageDetails.classType;
        this.selectedClass = this.storeDetail.pages.pageData[3].pageDetails.selectedClass[0].class_id;
        this.classroomSelection_ClassList = this.storeDetail.pages.pageData[3].correctedDetails;
        this.classroomSelection_ClassList_Ids = this.storeDetail.pages.pageData[3].correctedDetails.map(
          (data) => {
            return data.class_id;
          }
        );

        let classDetail = this.storeDetail.pages.pageData[3].pageDetails;
        /*  Check This Page is Registered or Not, If 'Registered' move to 'else' part...  */
        if (this.storeDetail.pages.pageData[5] === undefined) {
          this.getMethodology(
            classDetail.classType,
            classDetail.selectedClass[0].class_id,
            this.classroomSelection_ClassList_Ids,
            this.classroomSelection_ClassList
          );
        } else {
          this.sectionList = this.storeDetail.pages.pageData[5].correctedDetails.customizeSectionList;
          // this.tempQuestions = this.sectionList;
          this.methodologyQuestions = this.storeDetail.pages.pageData[5].correctedDetails.methodologyQuestions;
          this.selectedSection = this.storeDetail.pages.pageData[5].correctedDetails.selectedSection;
          this.headerClicked = this.storeDetail.pages.pageData[5].correctedDetails.headerClicked;
          this.currentIndex = this.storeDetail.pages.pageData[5].correctedDetails.currentIndex;
          this.loading.dismiss();
        }
      });
    });
  }

  /*  Getting language Info... */

  appLanguage() {
    this.apiService.languageInfo.subscribe((data: any) => {
      this.languageType = data;
      this._translate.use(this.languageType);
      this._initialiseTranslation();
    });
  }
  _initialiseTranslation(): void {
    this._translate.get("classroom").subscribe((res: string) => {
      this.classroom = res;
    });
    this._translate.get("Practices").subscribe((res: string) => {
      this.Practices = res;
    });
    this._translate.get("teaching").subscribe((res: string) => {
      this.teaching = res;
    });
    this._translate.get("methodology").subscribe((res: string) => {
      this.methodology = res;
    });
    this._translate.get("fillAnswer").subscribe((res: string) => {
      this.fillAnswer = res;
    });
    this._translate.get("next").subscribe((res: string) => {
      this.next = res;
    });
    this._translate.get("back").subscribe((res: string) => {
      this.back = res;
    });
  }

  getMethodology(
    classType,
    classId,
    classroomSelection_ClassList_Ids,
    classroomSelection_ClassList
  ) {
    let classDetail = {
      class_id: classId,
      classtype: classType,
    };

    // this.apiService.getTeachingMethodology(classDetail)
    //   .subscribe((response: any) => {

    let tempsectionList = [];
    let tempQuestionList = [];
    if (this.languageType === "en") {
      tempsectionList = this.masterApiResponse.Observations.methodologys.en;
      let tempQuesEN;
      tempQuesEN = this.masterApiResponse.methodology_questions_lang.en;
      tempQuestionList = tempQuesEN.concat(
        this.masterApiResponse.methodology_questions_lang.child.en
      );
    } else if (this.languageType === "ta") {
      tempsectionList = this.masterApiResponse.Observations.methodologys.ta;
      let tempQuesTA;
      tempQuesTA = this.masterApiResponse.methodology_questions_lang.ta;
      tempQuestionList = tempQuesTA.concat(
        this.masterApiResponse.methodology_questions_lang.child.ta
      );
    } else {
    }

    let methodologyQuesList = [];    

    tempQuestionList.forEach((data) => {
      let quesClassList = data.class.split(",");
      let allSelectionClassList = classroomSelection_ClassList;
      let allSelectionClassList_Ids = classroomSelection_ClassList_Ids;
      // let getIndex = allSelectionClassList_Ids.indexOf(this.selectedClass);
      // if (getIndex !== -1) allSelectionClassList_Ids.splice(getIndex, 1);
      //  let status = quesClassList.some(i => allSelectionClassList_Ids.includes(i));
      let status = quesClassList.includes(this.selectedClass);
      let isNon_SelectedPresent;
      if (allSelectionClassList_Ids.length && quesClassList.length) {
        isNon_SelectedPresent = allSelectionClassList_Ids.filter((ac) =>
          quesClassList.includes(ac)
        );

        if (isNon_SelectedPresent.length > 0 || status) {
          isNon_SelectedPresent = true;
        } else {
          isNon_SelectedPresent = false;
        }
      } else {
        isNon_SelectedPresent = false;
      }

      if (
        isNon_SelectedPresent == true &&
        (data.classtype === classType || data.classtype === "3")
      ) {
        if (data.sec_id === "8" || data.sec_id === "15") {
          if (status) {
            methodologyQuesList.push(data);
          }
        } else if (data.sec_id === "3" || data.sec_id === "10") {
          if (status) {
            methodologyQuesList.push(data);
          }
        } else {
          methodologyQuesList.push(data);
        }
      }
    });

    let records = {
      methodology: tempsectionList,
      methodology_questions: methodologyQuesList,
    };
    

    let a = JSON.parse(JSON.stringify(records.methodology));
    this.methodologyQuestions = records.methodology_questions;
    this.methodologyQuestions.forEach((data) => {
      let selectedAnswer;
      let answerType = data.type_of_ans;
      switch (answerType) {
        case "0": {
          selectedAnswer = "";
          break;
        }
        case "1": {
          selectedAnswer = {
            answer_id: "",
            answer: "",
          };
          break;
        }
        case "2": {
          selectedAnswer = [];
          break;
        }
        case "3": {
          selectedAnswer = "";
          break;
        }
        default: {
          break;
        }
      }
      data["selectedAnswer"] = selectedAnswer;
    });
    this.sectionList = records.methodology;    
    this.sectionList.forEach((data, index) => {
      this.question_no = 0;
      let questions = this.methodologyQuestions.filter((data1, index1) => {
        if (data.sec_id == data1.sec_id && data1.parent_id === "-1") {
          //  if (this.classType === data1.classtype || data1.classtype === '3' && this.isClassPresent(data1.class) === true) {
          const answer = data1;

          if (data1.sec_id === "7" || data1.sec_id === "14") {
            if (data1.class.includes(classId)) {
              if (data1.ans != null) {
                answer.ans = data1.ans
                  .replace(/^\s+|\s+$/g, "")
                  .replace(/\n/g, "");
                answer.ans = JSON.parse(answer.ans);

                answer.ans.ans.forEach((element) => {
                  element["checked"] = false;
                });
              }
              this.question_no = this.question_no + 1;
              answer.question_no = this.question_no;
              return answer;
            }
          } else {
            if (data1.ans != null) {
              answer.ans =
                typeof data1.ans !== "string"
                  ? data1.ans
                  : data1.ans.replace(/^\s+|\s+$/g, "").replace(/\n/g, "");

              answer.ans =
                typeof answer.ans === "string"
                  ? JSON.parse(answer.ans)
                  : answer.ans;

              answer.ans.ans.forEach((element) => {
                element["checked"] = false;
              });
            }
            this.question_no = this.question_no + 1;
            answer.question_no = this.question_no;
            return answer;
          }

          // }
        }
      });
      this.sectionList[index]["status"] = "inactive";
      this.sectionList[index]["questionList"] = questions;
      this.sectionList[index]["isAnswerd"] = false;
    });    
    //  this.tempQuestions = this.sectionList;
    this.loading.dismiss();

    /*  Registering This Page in Storage ....*/
    let apiData = {
      pageNo: "6",
      pageName: "teachingMethodology",
      apiResponse: {
        records: {
          sectionList: a,
          methodologyQuestions: this.methodologyQuestions,
          customizeSectionList: this.sectionList,
        },
      },
      correctedDetails: {
        methodologyQuestions: this.methodologyQuestions,
        customizeSectionList: this.sectionList,
        headerClicked: false,
        currentIndex: 0,
        selectedSection: "",
      },
    };
    this.storeDetail.pages.pageData[5] = apiData;
    this.ionicStore.setStoreData(this.storeDetail);
  }

  /*  Toggle section active or inactive .....*/
  public toggleAccordion1(name, sectionIndex, index) {
    this.sectionName = name;
    this.selectedSection = sectionIndex;
    this.sectionList.forEach((data, currentindex) => {
      if (currentindex === index) {
        this.sectionList[index]["status"] = "active";
        this.currentIndex = index;
        this.storeDetail.pages.pageData[5].correctedDetails.selectedSection = this.selectedSection;
        this.storeDetail.pages.pageData[5].correctedDetails.customizeSectionList = this.sectionList;
        this.storeDetail.pages.pageData[5].correctedDetails.headerClicked = this.headerClicked;
        this.storeDetail.pages.pageData[5].correctedDetails.currentIndex = this.currentIndex;
        this.ionicStore.setStoreData(this.storeDetail);
      } else {
        this.sectionList[currentindex]["status"] = "inactive";
        this.storeDetail.pages.pageData[5].correctedDetails.selectedSection = this.selectedSection;
        this.storeDetail.pages.pageData[5].correctedDetails.customizeSectionList = this.sectionList;
        this.storeDetail.pages.pageData[5].correctedDetails.headerClicked = this.headerClicked;
        this.storeDetail.pages.pageData[5].correctedDetails.currentIndex = this.currentIndex;
        this.ionicStore.setStoreData(this.storeDetail);
      }
    });
  }

  public broadcastName(name: string) {
    this.change.emit(name);
  }

  /*  Getting Answer here....  */
  displayCounter = (selectedAnswerDetail) => {
    let answerDetail = selectedAnswerDetail;
    let currentSectionId = this.sectionList[this.selectedSection].sec_id;
    let answerdQuestion_SectionId = answerDetail.question.sec_id;

    if (currentSectionId == answerdQuestion_SectionId) {
      let answerType = answerDetail.question.type_of_ans;

      switch (answerType) {
        case "0": {
          this.sectionList[this.selectedSection].questionList[
            answerDetail.questionIndex
          ].selectedAnswer = answerDetail.answer;
          break;
        }
        case "1": {
          let selectedAnswer = {
            answer_id: answerDetail.answer.id,
            answer: answerDetail.answer.ans,
          };

          if (
            selectedAnswer.answer.toLowerCase() === "other" ||
            selectedAnswer.answer === "மற்றவை"
          ) {
            selectedAnswer["otherAns"] = answerDetail.otherAnswer;
          }

          if (
            this.sectionList[this.selectedSection].questionList[
              answerDetail.questionIndex
            ] !== undefined
          ) {
            this.sectionList[this.selectedSection].questionList[
              answerDetail.questionIndex
            ].selectedAnswer = selectedAnswer;
          }
          break;
        }
        case "2": {
          let selectedAnswer = {
            answer_id: answerDetail.answer.id,
            answer: answerDetail.answer.ans,
          };

          let answerInfo = selectedAnswer.answer
            .split(" ")
            .join("")
            .toLowerCase();
          let selectedAnswerList = this.sectionList[this.selectedSection]
            .questionList[answerDetail.questionIndex].selectedAnswer;

          if (!selectedAnswerList.length) {
            this.sectionList[this.selectedSection].questionList[
              answerDetail.questionIndex
            ].selectedAnswer.push(selectedAnswer);
            this.sectionList[this.selectedSection].questionList[
              answerDetail.questionIndex
            ].ans.ans[answerDetail.answerIndex].checked = true;
          } else {
            let answerIds = selectedAnswerList.map((el) => {
              return el.answer_id;
            });

            const found = answerIds.includes(selectedAnswer.answer_id);

            if (found) {
              let indexInfo = this.sectionList[
                this.selectedSection
              ].questionList[
                answerDetail.questionIndex
              ].selectedAnswer.findIndex(
                (answer) => answer.answer_id === selectedAnswer.answer_id
              );
              this.sectionList[this.selectedSection].questionList[
                answerDetail.questionIndex
              ].ans.ans[answerDetail.answerIndex].checked = false;
              this.sectionList[this.selectedSection].questionList[
                answerDetail.questionIndex
              ].selectedAnswer.splice(indexInfo, 1);
            } else {
              if (
                answerInfo === "noneoftheabove" ||
                answerInfo === "none" ||
                answerInfo === "எதுவுமில்லை" ||
                answerInfo === "மேற்கூறியஎதுவும்இல்லை" ||
                answerInfo.toLowerCase() === "other" ||
                answerInfo === "மற்றவை"
              ) {
                //  this.sectionList[this.selectedSection].questionList[answerDetail.questionIndex].selectedAnswer=[];
                this.sectionList[this.selectedSection].questionList[
                  answerDetail.questionIndex
                ].ans.ans.forEach((element) => {
                  element.checked = false;
                });

                this.sectionList[this.selectedSection].questionList[
                  answerDetail.questionIndex
                ].selectedAnswer.push(selectedAnswer);
                this.sectionList[this.selectedSection].questionList[
                  answerDetail.questionIndex
                ].ans.ans[answerDetail.answerIndex].checked = true;
              } else {
                this.sectionList[this.selectedSection].questionList[
                  answerDetail.questionIndex
                ].ans.ans.forEach((ansData, index) => {
                  let listanswer = ansData.ans
                    .split(" ")
                    .join("")
                    .toLowerCase();

                  if (
                    listanswer === "noneoftheabove" ||
                    listanswer === "none" ||
                    listanswer === "எதுவுமில்லை" ||
                    listanswer === "மேற்கூறியஎதுவும்இல்லை" ||
                    listanswer.toLowerCase() === "other" ||
                    listanswer === "மற்றவை"
                  ) {
                    this.sectionList[this.selectedSection].questionList[
                      answerDetail.questionIndex
                    ].ans.ans[index].checked = false;
                  }
                });
                this.sectionList[this.selectedSection].questionList[
                  answerDetail.questionIndex
                ].selectedAnswer.push(selectedAnswer);
                this.sectionList[this.selectedSection].questionList[
                  answerDetail.questionIndex
                ].ans.ans[answerDetail.answerIndex].checked = true;
              }
            }
          }
          break;
        }
        case "3": {
          this.sectionList[this.selectedSection].questionList[
            answerDetail.questionIndex
          ].selectedAnswer = answerDetail.answer;
          break;
        }
        default: {
          break;
        }
      }      
      this.storeDetail.pages.pageData[5].correctedDetails.customizeSectionList = this.sectionList;
      this.ionicStore.setStoreData(this.storeDetail);

      /*  Check Question type here ...*/
      if (answerDetail.question.type_of_ans !== "2") {
        this.removeSubQuestions(
          answerDetail.question.ref_id,
          answerDetail.question.ob_qus_id
        );
      } else {
        let status1 = this.sectionList[this.selectedSection].questionList[
          answerDetail.questionIndex
        ].ans.ans[answerDetail.answerIndex].checked;
        if (status1) {
          this.removeSubQuestions(
            answerDetail.question.ref_id,
            answerDetail.question.ob_qus_id
          );
        }
      }

      if (answerDetail.answer.child_qus !== undefined) {
        /*  Check Child is present or not for current Quesiton ....*/
        if (answerDetail.answer.child_qus.length > 0) {
          this.subQuestionNo = 0;
          let status = this.sectionList[this.selectedSection].questionList[
            answerDetail.questionIndex
          ].ans.ans[answerDetail.answerIndex].checked;

          /*  Check Question type here ...*/
          if (answerDetail.question.type_of_ans !== "2") {
            answerDetail.answer.child_qus.forEach(
              async (datad, childQuestion_Index) => {
                let newQuestion = await this.methodologyQuestions.find(
                  (data1, index) => data1.ref_id === datad.toString()
                );

                if (newQuestion !== undefined) {
                  await this.addSubQuestions(
                    newQuestion,
                    answerDetail.questionIndex,
                    answerDetail.question,
                    answerDetail.answerIndex
                  );
                }
              }
            );
          } else {
            let status = this.sectionList[this.selectedSection].questionList[
              answerDetail.questionIndex
            ].ans.ans[answerDetail.answerIndex].checked;
            if (status) {
              answerDetail.answer.child_qus.forEach(
                async (datad, childQuestion_Index) => {
                  let newQuestion = await this.methodologyQuestions.find(
                    (data1, index) => data1.ref_id === datad.toString()
                  );
                  if (newQuestion !== undefined) {
                    await this.addSubQuestions(
                      newQuestion,
                      answerDetail.questionIndex,
                      answerDetail.question,
                      answerDetail.answerIndex
                    );
                  }
                }
              );
            }
          }
        }
      }
    }
  };

  /*  Adding SubQuestions .... */
  addSubQuestions = (
    newQuestion,
    questionIndex,
    parentQuestion,
    answerIndex = ""
  ) => {
    let i = 0;
    let temp_Questions = JSON.parse(JSON.stringify(newQuestion));

    if (temp_Questions.ans !== null) {
      temp_Questions.ans = temp_Questions.ans.replace(/^\s+|\s+$/g, "");
      temp_Questions.ans = JSON.parse(temp_Questions.ans);
    }
    if (
      (this.classType === temp_Questions.classtype ||
        temp_Questions.classtype === "3") &&
      (this.isClassPresent(
        temp_Questions.class,
        this.classroomSelection_ClassList_Ids
      ) == true ||
        this.isNonSelectedClass_present(
          temp_Questions.class,
          this.classroomSelection_ClassList_Ids
        ) == true)
    ) {
      this.subQuestionNo++; /* subQuestion Number .....*/
      let questionNo = this.subQuestionNo;
      temp_Questions["question_no"] =
        this.sectionList[this.selectedSection].questionList[questionIndex]
          .question_no +
        "." +
        questionNo;
      this.sectionList[this.selectedSection].questionList.splice(
        questionIndex + questionNo,
        0,
        temp_Questions
      );
      this.storeDetail.pages.pageData[5].correctedDetails.customizeSectionList = this.sectionList;
      this.ionicStore.setStoreData(this.storeDetail);
    }
  };

  /*  Removing SubQuestions here...... */
  async removeSubQuestions(question_RefId, question_Id) {
    let temp = [];

    await this.sectionList[this.selectedSection].questionList.forEach(
      async (question, questionIndex) => {
        if (question.parent_id === question_Id) {
          temp.splice(0, 0, questionIndex);
          await this.removeSubQuestions(question.ref_id, question.ob_qus_id);
        }
      }
    );

    temp.forEach((questionIndex, arrayIndex) => {
      this.sectionList[this.selectedSection].questionList.splice(
        questionIndex,
        1
      );
    });

    this.storeDetail.pages.pageData[5].correctedDetails.customizeSectionList = this.sectionList;
    this.ionicStore.setStoreData(this.storeDetail);
    // this.storeDetail.pages.pageData[5].apiResponse.records.customizeSectionList = this.sectionList;
  }

  isClassPresent = (classList, classroomSelection_ClassList_Ids) => {
    let Ques_ClassList = classList.split(",");
    let status = Ques_ClassList.includes(this.selectedClass);
    //  let status = a.includes(this.selectedClass);
    return status;
  };
  isNonSelectedClass_present(classList, classroomSelection_ClassList_Ids) {
    let Ques_ClassList = classList.split(",");
    let allSelectionClassList_Ids = classroomSelection_ClassList_Ids;
    let getIndex = allSelectionClassList_Ids.indexOf(this.selectedClass);
    if (getIndex !== -1) allSelectionClassList_Ids.splice(getIndex, 1);
    let isNon_SelectedPresent;
    if (allSelectionClassList_Ids.length && Ques_ClassList.length) {
      isNon_SelectedPresent = allSelectionClassList_Ids.includes(
        Ques_ClassList[0]
      );
    } else {
      isNon_SelectedPresent = false;
    }
    return isNon_SelectedPresent;
  }

  /* Move to Next Section or Page ....*/
  public moveIndex() {
    if (this.headerClicked === false) {
      this.headerClicked = true;
      this.currentIndex = 0;
      this.selectedSection = this.currentIndex;
      this.sectionList[this.currentIndex].status = "active";
      this.sectionName = this.sectionList[this.currentIndex].sec_name;
      this.storeDetail.pages.pageData[5].correctedDetails.selectedSection = this.selectedSection;
      this.storeDetail.pages.pageData[5].correctedDetails.headerClicked = this.headerClicked;
      this.storeDetail.pages.pageData[5].correctedDetails.currentIndex = this.currentIndex;
      this.storeDetail.pages.pageData[5].correctedDetails.customizeSectionList = this.sectionList;
      this.ionicStore.setStoreData(this.storeDetail);
    } else {
      this.pageDetail = this.storeDetail.pages.pageData[5].correctedDetails.customizeSectionList;
      let questionList = this.pageDetail[this.selectedSection].questionList;

      let statusCheck = questionList.every(this.checkValid);

      if (statusCheck) {
        this.storeDetail.pages.pageData[5].correctedDetails.customizeSectionList[
          this.selectedSection
        ].isAnswerd = true;
        //   this.storeDetail.pages.pageData[5].correctedDetails.selectedSection.isAnswerd = true;
        this.ionicStore.setStoreData(this.storeDetail);

        if (this.currentIndex <= this.sectionList.length - 2) {
          this.sectionList[this.currentIndex].status = "inactive";
          this.currentIndex = this.currentIndex + 1;
          this.sectionList[this.currentIndex].status = "active";
          this.selectedSection = this.currentIndex;
          this.sectionName = this.sectionList[this.currentIndex].sec_name;
          this.storeDetail.pages.pageData[5].correctedDetails.selectedSection = this.selectedSection;
          this.storeDetail.pages.pageData[5].correctedDetails.customizeSectionList = this.sectionList;
          this.storeDetail.pages.pageData[5].correctedDetails.currentIndex = this.currentIndex;

          this.ionicStore.setStoreData(this.storeDetail);
        } else {
          this._router.navigate(["/page-route/assessment"]);
        }
      } else {
        this._alertService.showAlert(this.fillAnswer);
      }
    }
  }

  /* Move to Previous Section or Page ....*/
  public backIndex() {
    if (this.headerClicked == true) {
      if (this.currentIndex < this.sectionList.length) {
        if (this.currentIndex !== 0) {
          this.sectionList[this.currentIndex].status = "inactive";
          this.currentIndex = this.currentIndex - 1;
          this.sectionList[this.currentIndex].status = "active";
          this.selectedSection = this.currentIndex;
          this.sectionName = this.sectionList[this.currentIndex].sec_name;
          this.storeDetail.pages.pageData[5].correctedDetails.selectedSection = this.selectedSection;
          this.storeDetail.pages.pageData[5].correctedDetails.customizeSectionList = this.sectionList;
          this.storeDetail.pages.pageData[5].correctedDetails.currentIndex = this.currentIndex;
          this.ionicStore.setStoreData(this.storeDetail);
        } else {
          this.headerClicked = false;
          for (let sectionIndex in this.sectionList) {
            this.sectionList[sectionIndex].status = "inactive";
          }
          this.storeDetail.pages.pageData[5].correctedDetails.headerClicked = this.headerClicked;
          this.storeDetail.pages.pageData[5].correctedDetails.currentIndex = this.currentIndex;
          this.storeDetail.pages.pageData[5].correctedDetails.customizeSectionList = this.sectionList;
          this.storeDetail.pages.currentProgress = this.progressValue;
          this.ionicStore.setStoreData(this.storeDetail);
        }
      }
    } else {
      let selectedClass = this.storeDetail.pages.pageData[3].correctedDetails;
      if (selectedClass.length === 1) {
        this._router.navigate(["/page-route/attendance/student-attendance"]);
      } else {
        this._router.navigate(["/page-route/observation/observationTeaching"]);
      }
    }
  }

  checkValid(element, index, array) {
    let status = true;
    let answerType = element.type_of_ans;
    if (answerType == "1") {
      if (element.selectedAnswer.answer_id === undefined) {
        status = false;
      }

      if (
        element.selectedAnswer.answer.toLowerCase() === "other" ||
        element.selectedAnswer.answer === "மற்றவை"
      ) {
        if (
          !element.selectedAnswer.otherAns ||
          element.selectedAnswer.otherAns === ""
        ) {
          status = false;
        }
      }
    } else if (answerType == "2") {
      if (!element.selectedAnswer.length) {
        status = false;
      }

      const otherFound = _.find(
        element.selectedAnswer,
        (sa) => sa.answer.toLowerCase() === "other" || sa.answer === "மற்றவை"
      );

      if (otherFound) {
        if (!otherFound.otherAns || otherFound.otherAns === "") {
          status = false;
        }
      }
    } else {
      if (element.selectedAnswer === "") {
        status = false;
      }
    }
    return status;
  }

  ionViewWillLeave() {}

  just() {}
}
