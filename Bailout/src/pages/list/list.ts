import { Component } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import { NavController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { BondPage } from '../bond/bond';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  bonds: Observable<any[]>;

  constructor(public navCtrl: NavController, af: AngularFire, public modalCtrl: ModalController) {
    this.bonds = af.database.list('/bonds')
    .map((arr) => { 
      return arr.reverse(); 
    });
  }

  itemTapped(event, bond) {
    let modal = this.modalCtrl.create(BondPage, { bond: bond });
    modal.present();
  }

  createBond() {
    this.navCtrl.parent.select(1);
  }

}
