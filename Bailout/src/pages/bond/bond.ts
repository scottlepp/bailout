import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { AngularFire} from 'angularfire2';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ToastController } from 'ionic-angular';
import { User } from '../../app/user.service';
import { Storage } from '@ionic/storage';
import * as firebase from 'firebase';
import { ModalController } from 'ionic-angular';
import { SignPage } from '../sign/sign';
import { LoadingController } from 'ionic-angular';
import createNumberMask from 'text-mask-addons/dist/createNumberMask.js'
import { Sync } from '../../app/sync.service';

@Component({
  selector: 'page-bond',
  templateUrl: 'bond.html'
})
export class BondPage {

  bondForm: FormGroup;
  bond: any = {status: 'open'};
  editing = false;
  key: string;
  saving = false;
  connectSubscription;
  numberMask = createNumberMask({
  });
  today = new Date();
  showForm = true;

  phoneMask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  constructor(public navCtrl: NavController, public af: AngularFire, fb: FormBuilder, public toastCtrl: ToastController, params: NavParams, public viewCtrl: ViewController, public user: User, public storage: Storage, public modalCtrl: ModalController, public loadingCtrl: LoadingController, private sync: Sync) {
    if (params.get('bond')) {
      this.bond = params.get('bond');
      this.key = this.bond.$key;
      this.editing = true;
    }
    this.bond.user = user.name;
    if (!this.editing) {
      this.bond.status = 'open';
      var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
      var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0,-1);
      this.bond.date = localISOTime;
    }
    this.bondForm = fb.group({bond: fb.group({
        'power': ['', Validators.compose([Validators.required])],
        'defendantFirst': ['', Validators.compose([Validators.required])],
        'defendantMiddle': ['', ],
        'defendantLast': ['', Validators.compose([Validators.required])],
        'phone': ['', Validators.compose([Validators.required])],
        'amount': ['', Validators.compose([Validators.required])],
        'county': ['', Validators.compose([Validators.required])],
        'source': ['', Validators.compose([Validators.required])],
        'indemnitorFirst': ['', Validators.compose([Validators.required])],
        'indemnitorMiddle': ['', ],
        'indemnitorLast': ['', Validators.compose([Validators.required])],
        'indPhone': ['', ],
        'date': ['', ],
        'status': ['', Validators.compose([Validators.required])]
        // 'signature': ['', Validators.compose([Validators.required])]
      })
    })

    let connected = af.database.object(".info/connected");
    this.connectSubscription = connected.subscribe(resp => {
      if (this.user.offline === true && resp.$value === true) {
        // reconnected - sync up anything stored offline
        this.sync.execute();
      }
      this.user.offline = !resp.$value;
    });
  }

  ionViewWillEnter() {
    if (!this.editing) {
      var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
      var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0,-1);
      this.bond.date = localISOTime;
      this.bond.status = 'open';
    }
  }

  close(event) {
    this.connectSubscription.unsubscribe();
    this.viewCtrl.dismiss();
  }

  onSubmit(value: string): void { 
    if(this.bondForm.valid) {    
      this.saving = true;
      this.bond.amount = this.bond.amount.replace(/\W/g, '');
      this.bond.phone = this.bond.phone.replace(/\W/g, '');
      // this.bond.phone = this.bond.phone.replace(/_/g, '');
      this.bond.phone = this.bond.phone.substring(0, 10);

      this.bond.indPhone = this.bond.indPhone.replace(/\W/g, '');
      // this.bond.indPhone = this.bond.indPhone.replace(/_/g, '');
      this.bond.indPhone = this.bond.indPhone.substring(0, 10);

      this.bond.localTime = new Date().getTime();
      if (!this.editing) {
        this.bond.dateCreated = firebase.database['ServerValue']['TIMESTAMP'];
      }

      if (this.bond.date !== undefined) {
        let dateParts = this.bond.date.split('T');
        // let localTime = new Date().toISOString();
        var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
        var localTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0,-1);
        let localDateParts = localTime.split('T');
        let easternDate = dateParts[0] + 'T' + localDateParts[1];
        let formDate = new Date(easternDate);
        if (this.today.getFullYear() !== formDate.getFullYear() || this.today.getMonth() !== formDate.getMonth() || this.today.getDate() !== formDate.getDate()) {
          this.bond.dateCreated = formDate.getTime();
        }
      }
      
      if (!this.user.offline) {
        let loader = this.loadingCtrl.create({
          content: "Saving..."
        });
        loader.present();
        let bonds = this.af.database.list('/bonds')

        if (this.editing) {
          delete this.bond.$key;
          delete this.bond.$exists;
          bonds.update(this.key, this.bond).then(() => {
            this.saving = false;
            loader.dismiss();
            this.showToast();
          });
        } else {
          this.showForm = false;
          bonds.push(this.bond).then(() => {
            loader.dismiss();
            this.showToast();
            this.bond = {user:this.user.name, status:'open', date: this.today.toISOString()};
            this.bondForm.reset(this.bond);
            setTimeout(() => {
              this.showForm = true;
            });

            this.saving = false;
          });
        }
        
      } else {  // offline
        this.showForm = false;
        this.storage.get('bailout_bonds').then(bonds => {
          if (bonds === null) {
            bonds = [];
          }
          bonds.push(this.bond);
          this.storage.set('bailout_bonds', bonds);
          this.showToast();
          this.bond = {user:this.user.name, status:'open', date: this.today.toISOString()};
          this.bondForm.reset(this.bond);
          setTimeout(() => {
            this.showForm = true;
          });
          this.saving = false;
        });
      }
    }
  } 

  sign(event) {
    let modal = this.modalCtrl.create(SignPage, { bond: this.bond });
    modal.present();
  }

  private showToast() {
    let toast = this.toastCtrl.create({
          message: 'Bond was saved successfully',
          duration: 3000
        });
    toast.present();
  }

  private padDigits(number, digits) {
    return Array(Math.max(digits - String(number).length + 1, 0)).join('0') + number;
  }

}
