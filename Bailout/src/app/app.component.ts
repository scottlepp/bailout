import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
// import { StatusBar, Splashscreen } from 'ionic-native';
import { AngularFire } from 'angularfire2';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { Storage } from '@ionic/storage';
import { User } from './user.service';
import { BondPage } from '../pages/bond/bond';
import { LoadingController } from 'ionic-angular';
import { Sync } from './sync.service';

@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class MyApp {
  // check login
  rootPage: any = LoginPage;

  constructor(platform: Platform, private storage: Storage, public af: AngularFire, user: User, public loadingCtrl: LoadingController, private sync: Sync) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      storage.get('bailout_user').then(bailoutUser => {
        if (bailoutUser) {
          user.name = bailoutUser.name;
          let loader = this.loadingCtrl.create({
            content: "Authenticating..."
          });
          loader.present();
          
          this.af.auth.login({ email: bailoutUser.email, password: bailoutUser.pass }).then(result => {
              loader.dismiss();
              this.sync.execute();
              this.rootPage = TabsPage;
              // StatusBar.styleDefault();
              // Splashscreen.hide();
          }, error => {
            // assume offline
            loader.dismiss();
            user.offline = true;
            this.rootPage = BondPage;
            // StatusBar.styleDefault();
            // Splashscreen.hide();
          });
        } else {
          // StatusBar.styleDefault();
          // Splashscreen.hide();
        }
      });
    });
  }
}
