import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, ViewController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';

@Component({
  templateUrl: 'sign.html'
})
export class SignPage {

  @ViewChild(SignaturePad) signaturePad: SignaturePad;

  signForm: FormGroup;
  currentWidth;
  orientationListener;
  bond;

  options: Object = { // passed through to szimek/signature_pad constructor
    'minWidth': 5,
    'canvasWidth': 500,
    'canvasHeight': 300
  };

  constructor(public navCtrl: NavController,  fb: FormBuilder, private myElement: ElementRef, public viewCtrl: ViewController, params: NavParams) {

    this.signForm = fb.group({
        'signature': ''
    });

    this.bond = params.get('bond');

    this.orientationListener = () => {
      setTimeout(() => {
        var newWidth = this.myElement.nativeElement.offsetWidth;
        if (newWidth !== this.currentWidth) {
          this.currentWidth = newWidth;
          this.signaturePad.set('canvasWidth', this.currentWidth);
        }
      }, 300);
    }
  }
  
  ionViewDidEnter() {
    // this.signaturePad is now available
    this.currentWidth = this.myElement.nativeElement.offsetWidth;
    this.signaturePad.set('canvasWidth', this.currentWidth); // set szimek/signature_pad options at runtime
    this.signaturePad.clear(); // invoke functions from szimek/signature_pad API

    var supportsOrientationChange = "onorientationchange" in window
    var orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";

    window.addEventListener(orientationEvent, this.orientationListener, false);
  }
 
  ionViewDidLeave() {
    var supportsOrientationChange = "onorientationchange" in window
    var orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";
    window.removeEventListener(orientationEvent, this.orientationListener, false);
  }

  drawComplete() {
    // will be notified of szimek/signature_pad's onEnd event
    // console.log(this.signaturePad.toDataURL());
  }
 
  drawBegin() {

  }
  
  drawStart() {

  }

  onSubmit(value: string): void { 
    var signature = this.signaturePad.toDataURL().replace('data:image/png;base64,', '');
    this.bond.signature = 'Signed';
    this.bond.signatureData = signature;
    this.bond.signatureTime = new Date().getTime();
    this.viewCtrl.dismiss();
  }

  close(event) {
    this.viewCtrl.dismiss();
  }

}
