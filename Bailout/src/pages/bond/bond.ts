import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { AngularFire } from 'angularfire2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from 'ionic-angular';
import { User } from '../../app/user.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-bond',
  templateUrl: 'bond.html'
})
export class BondPage {

  bondForm: FormGroup;
  bond: any = {};
  editing = false;
  key: string;

  constructor(public navCtrl: NavController, public af: AngularFire, fb: FormBuilder, public toastCtrl: ToastController, params: NavParams, public viewCtrl: ViewController, public user: User, public storage: Storage) {
    if (params.get('bond')) {
      this.bond = params.get('bond');
      this.key = this.bond.$key;
      this.editing = true;
    }
    this.bond.user = user.name;
    this.bondForm = fb.group({bond: fb.group({
        'power': ['', Validators.compose([Validators.required])],
        'defendant': ['', Validators.compose([Validators.required])],
        'phone': ['', Validators.compose([Validators.required])],
        'amount': ['', Validators.compose([Validators.required])],
        'county': ['', Validators.compose([Validators.required])],
        'source': ['', Validators.compose([Validators.required])]
      })
    })
  }

  close(event) {
    this.viewCtrl.dismiss();
  }

  onSubmit(value: string): void { 
    if(this.bondForm.valid) {    
      if (!this.user.offline) {
        let bonds = this.af.database.list('/bonds');
        if (this.editing) {
          delete this.bond.$key;
          delete this.bond.$exists;
          bonds.update(this.key, this.bond).then(() => {
            this.showToast();
          });
        } else {
          bonds.push(this.bond).then(() => {
            this.showToast();
            this.bond = {user:this.user.name};
            this.bondForm.reset();
          });
        }
      } else {  // offline
        this.storage.get('bailout_bonds').then(bonds => {
          if (bonds === null) {
            bonds = [];
          }
          bonds.push(this.bond);
          this.storage.set('bailout_bonds', bonds);
          this.showToast();
          this.bond = {user:this.user.name};
          this.bondForm.reset();
        });
      }
    }
  } 

  private showToast() {
    let toast = this.toastCtrl.create({
          message: 'Bond was saved successfully',
          duration: 3000
        });
    toast.present();
  }

}
