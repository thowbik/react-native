import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-classroommodal',
  templateUrl: './classroommodal.component.html',
  styleUrls: ['./classroommodal.component.scss'],
})
export class ClassroommodalComponent implements OnInit {

  constructor(private modalController: ModalController) { }

  ngOnInit() {}

  async dismiss() {
    // using the injected ModalController this page
      const onClosedData = 'Wrapped Up!';
      await this.modalController.dismiss(onClosedData);
  }

}
