import { Component} from '@angular/core';
import { NavController} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AngularFire } from 'angularfire2';
import { FormBuilder,  FormGroup, Validators, FormControl } from '@angular/forms';
import { TabsPage } from '../tabs/tabs';
import { ToastController } from 'ionic-angular';
import { User } from '../../app/user.service';
import { LoadingController } from 'ionic-angular';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  authForm: FormGroup;
  username: string;
  password: string;
  name: string;
  users: any;

  constructor(public navCtrl: NavController, public af: AngularFire, fb: FormBuilder, public toastCtrl: ToastController, public storage:Storage, public user:User, public loadingCtrl: LoadingController) {
    this.authForm = fb.group({  
        'username': ['', Validators.compose([Validators.required])],
        'password': ['', Validators.compose([Validators.required])]
        // 'name': ['', Validators.compose([Validators.required])]
    });
  }

  onSubmit(value: string): void { 
      if(this.authForm.valid) { 
          this.login();      
      }
  }

  login() {
    let loader = this.loadingCtrl.create({
      content: "Authenticating..."
    });
    loader.present();
    this.af.auth.login({ email: this.username, password: this.password }).then(result => {
      loader.dismiss();
      // this.users = this.af.database.list('/users', {
      //   query: {
      //     orderByChild: 'name',
      //     equalTo: this.name
      //   }
      // });
      // this.users.subscribe(users => {
      //   if (users.length > 0) {
      //     this.storage.set('bailout_user', {name: this.name, email: this.username, pass: this.password});
      //     this.navCtrl.push(TabsPage);
      //   } else {
      //     this.showToast('Invalid User Name');
      //   }
      // });
      this.user.name = this.username;
      this.storage.set('bailout_user', {name: this.username, email: this.username, pass: this.password});
      this.navCtrl.push(TabsPage);

    }, error => {
      console.log(error);
      this.showToast('Invalid email or password');
    });
  }

  private showToast(message) {
    let toast = this.toastCtrl.create({
          message: message,
          duration: 3000
        });
    toast.present();
  }

  // checkFirstCharacterValidator(control: FormControl): { [s: string]: boolean } {  
  //     // if (control.value.match(/^\d/)) {  
  //     //     return {checkFirstCharacterValidator: true};  
  //     // }       
  //     return {checkFirstCharacterValidator: true};
  // }
}
