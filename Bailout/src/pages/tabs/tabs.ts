import { Component } from '@angular/core';

import { BondPage } from '../bond/bond';
import { ListPage } from '../list/list';
import { LoginPage } from '../login/login';
import { NavController } from 'ionic-angular';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root: any = ListPage;
  tab2Root: any = BondPage;

  constructor(public navCtrl: NavController) {
  }

  clearBond() {

  }

  logout() {
    this.navCtrl.setRoot(LoginPage);
  }
}
