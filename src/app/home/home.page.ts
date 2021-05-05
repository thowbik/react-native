import { Component } from "@angular/core";
import { ApiService } from "../services/api.service";
import { Platform, NavController } from "@ionic/angular";
import { Router, NavigationExtras } from "@angular/router";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage {
  users = [];
  txt: any;
  constructor(
    private apiService: ApiService,
    private plt: Platform,
    private router: Router,
    private navCtrl: NavController
  ) {}
  ngOnInit() {
    this.plt.ready().then(() => {
      this.loadData(true);
    });
  }
  loadData(refresh = false, refresher?) {
    this.apiService.getUsers(refresh).subscribe((res) => {
      this.users = res;
      if (refresher) {
        refresher.target.complete();
      }
    });
  }

  updateUser(id) {
    this.apiService.updateUser(id, { name: "Simon", job: "CEO" }).subscribe();
  }
  login() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        txt: this.txt,
      },
    };
    this.navCtrl.navigateForward("/login1", navigationExtras);
  }
}
