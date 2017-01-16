import { Component } from '@angular/core';
import { AngularFire, AngularFireDatabase } from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs';
import { NavController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { BondPage } from '../bond/bond';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  bonds: Observable<any[]>;

  private start = new Subject<number>();
  private end = new Subject<number>();

  constructor(public navCtrl: NavController, af: AngularFire, public modalCtrl: ModalController, private db: AngularFireDatabase) {
    this.bonds = db.list('/bonds', {
      query: {
        orderByChild: 'dateCreated',
        startAt: this.start,
        endAt: this.end
      }
    })
    .map((arr) => { 
      return arr.reverse(); 
    });
  }

  ionViewWillEnter() {
    let today = new Date();
    
    // show only this months items
    let startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    let endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    this.start.next(startDate.getTime());
    this.end.next(endDate.getTime());
  }

  itemTapped(event, bond) {
    let modal = this.modalCtrl.create(BondPage, { bond: bond });
    modal.present();
  }

  createBond() {
    this.navCtrl.parent.select(1);
  }

}
