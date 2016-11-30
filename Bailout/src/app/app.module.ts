import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { TabsPage } from '../pages/tabs/tabs';
import { BondPage } from '../pages/bond/bond';
import { LoginPage } from '../pages/login/login';
import { ListPage } from '../pages/list/list';
import { User } from './user.service';
import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';
import { Storage } from '@ionic/storage';
import {MomentModule} from 'angular2-moment';

import {
    defaultFirebase,
    FIREBASE_PROVIDERS
} from 'angularfire2';

const COMMON_CONFIG = {
    apiKey: "AIzaSyBG9SdyCTKlowUnCN4F47rb8DQtXocf1Ro",
    authDomain: "bailout-38e42.firebaseapp.com",
    databaseURL: "https://bailout-38e42.firebaseio.com",
    storageBucket: "bailout-38e42.appspot.com",
    messagingSenderId: "94440734373"
};

const myFirebaseAuthConfig = {
  provider: AuthProviders.Password,
  method: AuthMethods.Password
}

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    BondPage,
    LoginPage,
    ListPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(COMMON_CONFIG, myFirebaseAuthConfig),
    MomentModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    BondPage,
    LoginPage,
    ListPage
  ],
  providers: [
    FIREBASE_PROVIDERS,
    defaultFirebase(COMMON_CONFIG),
    User,
    Storage
  ]
})
export class AppModule {}
