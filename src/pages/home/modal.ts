import { Component } from '@angular/core';
import { ModalController, NavParams, ViewController } from 'ionic-angular';

@Component({
  	selector: 'page-modal',
  	templateUrl: 'modal.html'
})
export class ModalPage {

  	public config;

  	constructor(private modalController: ModalController, private viewCtrl: ViewController, private navParam: NavParams) {
  	    this.config = Object.create(this.navParam.data);
  	}

  	public save(): void {
  		  this.viewCtrl.dismiss(this.config);
  	}

  	public dismissModal(): void {
  	     this.viewCtrl.dismiss();
    }

  	public setConfigTop(value): void {
  		  this.config.top = value;
  	}

  	public setConfigRight(value): void {
  		  this.config.right = value;
  	}

  	public setConfigLeft(value): void {
  		  this.config.left = value;
  	}

  	public setConfigBottom(value): void {
  		  this.config.bottom = value;
  	}

    public setConfigStop(value): void {
        this.config.stop = value;
    }

}