import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { AngularFire } from 'angularfire2';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { Storage } from '@ionic/storage';
import { User } from './user.service';
import { BondPage } from '../pages/bond/bond';
import {Observable} from 'rxjs/Rx';

@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class MyApp {
  // check login
  rootPage: any = LoginPage;

  constructor(platform: Platform, private storage: Storage, public af: AngularFire, user: User) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      storage.get('bailout_user').then(bailoutUser => {
        if (bailoutUser) {
          user.name = bailoutUser.name;
          this.af.auth.login({ email: bailoutUser.email, password: bailoutUser.pass }).then(result => {
              this.sync();
              this.rootPage = TabsPage;
              StatusBar.styleDefault();
              Splashscreen.hide();
          }, error => {
            // assume offline
            user.offline = true;
            this.rootPage = BondPage;
            StatusBar.styleDefault();
            Splashscreen.hide();
          });
        } else {
          StatusBar.styleDefault();
          Splashscreen.hide();
        }
      });
    });
  }

  sync() {
    this.storage.get('bailout_bonds').then(bonds => {
      if (bonds !== null) {
        let promises = [];
        let remoteBonds = this.af.database.list('/bonds');
        bonds.forEach((bond) => {
          promises.push(remoteBonds.push(bond));
        });
        Observable.forkJoin(promises).subscribe(data => {
          console.log('synced ' + data.length);
          this.storage.remove('bailout_bonds');
        })
      }
    })
  }
}
