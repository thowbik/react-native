import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { flatMap } from "rxjs/operators";
import { AlertService } from "src/app/services/alert.service";
import { TranslateService } from "@ngx-translate/core";
import { ApiService } from "src/app/services/api.service";

@Component({
  selector: "app-questions",
  templateUrl: "./questions.component.html",
  styleUrls: ["./questions.component.scss"],
})
export class QuestionsComponent implements OnInit {
  @Input() treeData: [];
  @Output() valueChange = new EventEmitter();
  imageData: any;
  inputanswer: any = "";

  languageType: any;
  fillAnswer: string;

  constructor(
    private camera: Camera,
    public _alertService: AlertService,
    private _translate: TranslateService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.apiService.languageInfo.subscribe((data: any) => {
      this.languageType = data;
      this._translate.use(this.languageType);
      this._initialiseTranslation();
    });
  }

  _initialiseTranslation(): void {
    this._translate.get("fillAnswer").subscribe((res: string) => {
      this.fillAnswer = res;
    });
  }

  /*  Getting AnswerDetail here.....   */
  answerChecked(answer, question, answerIndex, questionIndex) {
    // You can give any function name
    let questionInfo = {
      answer: answer,
      question: question,
      answerIndex: answerIndex,
      questionIndex: questionIndex,
    };

    this.valueChange.emit(questionInfo);
  }

  otherChange(answer, question, answerIndex, questionIndex, otherAnswer) {
    let questionInfo = {
      answer: answer,
      question: question,
      answerIndex: answerIndex,
      questionIndex: questionIndex,
      otherAnswer: otherAnswer,
    };

    // This can be optimised later, if time permits
    if (
      (answer.ans.toLowerCase() === "other" || answer.ans === "மற்றவை") &&
      question.type_of_ans === "2"
    ) {
      question.selectedAnswer[0].otherAns = otherAnswer;
    }

    if (
      (answer.ans.toLowerCase() === "other" || answer.ans === "மற்றவை") &&
      question.type_of_ans === "1"
    ) {
      this.valueChange.emit(questionInfo);
    }
  }

  /*  Opening Camera here.....   */
  openCamera(answer, question, answerIndex, questionIndex) {
    const options: CameraOptions = {
      quality: 100,
      targetWidth: 900,
      targetHeight: 600,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
    };
    this.camera.getPicture(options).then(
      (imageData) => {
        this.imageData = imageData;
        let questionInfo = {
          answer: this.imageData,
          question: question,
          answerIndex: answerIndex,
          questionIndex: questionIndex,
        };
        this.valueChange.emit(questionInfo);
      },
      (err) => {
        // Handle error
        alert("error " + JSON.stringify(err));
      }
    );
  }

  getQuestion(question, id) {
    if (question.selectedAnswer.length) {
      let selectedAnswerIds = question.selectedAnswer.map((el) => {
        return el.answer_id;
      });
      let found = selectedAnswerIds.includes(id);
      return found;
    } else {
      return false;
    }
  }
}
