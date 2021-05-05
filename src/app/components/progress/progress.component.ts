import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss'],
})
export class ProgressComponent implements OnInit {

  @Input('progress') progress;
   /*-- Language Variables Starts --*/
   public languageType:any;
   public completed:any;
  /*-- Language Variables Ends --*/

  constructor(public _apiService: ApiService,private _translate: TranslateService) { }
  ngOnInit() {
    this._apiService.languageInfo.subscribe((data:any) => {
        this.languageType = data;
        this._translate.use(this.languageType);
           this._initialiseTranslation();
      });
 }

_initialiseTranslation(): void {
    this._translate.get('completed').subscribe((res: string) => {
        this.completed = res; 
      });
  }
}
