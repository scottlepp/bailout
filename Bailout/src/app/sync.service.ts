import {Injectable} from "@angular/core";
import { AngularFire } from 'angularfire2';
import { Storage } from '@ionic/storage';
import { LoadingController } from 'ionic-angular';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class Sync {

  syncing = false;

  constructor (private storage: Storage, public af: AngularFire, public loadingCtrl: LoadingController) {
  }

  execute() {
    this.storage.get('bailout_bonds').then(bonds => {
      if (bonds !== null && !this.syncing) {
        this.syncing = true;
        let loader = this.loadingCtrl.create({
          content: "Synchonizing..."
        });
        loader.present();
        let promises = [];
        let remoteBonds = this.af.database.list('/bonds');
        bonds.forEach((bond) => {
          promises.push(remoteBonds.push(bond));
        });
        Observable.forkJoin(promises).subscribe(data => {
          // console.log('synced ' + data.length);
          loader.dismiss();
          this.storage.remove('bailout_bonds');
          this.syncing = false;
        })
      }
    })
  }

}