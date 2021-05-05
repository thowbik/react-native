import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { NotificationModalComponent } from "../notification-modal/notification-modal.component";

@Component({
  selector: "app-notification",
  templateUrl: "./notification.component.html",
  styleUrls: ["./notification.component.scss"],
})
export class NotificationComponent implements OnInit {
  constructor(public modalController: ModalController) {}

  ngOnInit() {}

  /* MODAL POPUP OPEN AND CLOSE .............*/

  async openNotifyModal() {
    const modal = await this.modalController.create({
      component: NotificationModalComponent,
      cssClass: "my-custom-modal-dashboarc",
      // componentProps: {
      //   'schoolReason': this.schoolReasons,
      //   'allSchoolList': this.allSchoolList,
      //   'unVisitedSchoolList': this.unVisitedSchoolList
      // },
      backdropDismiss: false,
    });

    modal.onDidDismiss().then((response) => {});
    return await modal.present();
  }
}
