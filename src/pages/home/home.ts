import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { BluetoothSerial, BLE, Toast } from 'ionic-native';
import { ShareService } from '../services/services';
import { ModalPage } from './modal';

@Component({
  	selector: 'page-home',
  	templateUrl: 'home.html'
})
export class HomePage {

	public config: any;
	public recorded: any[];
	public currentCommand: any;
	public isRecording: boolean;

	constructor(public navCtrl: NavController, private modalController: ModalController, private shareService: ShareService) {

		this.config = {'top': 'f', 'right': 'd', 'left': 'e', 'bottom': 't', 'stop': '0'};
		this.recorded = [];

	}

	ionViewDidEnter() {
		document.getElementsByClassName("fab-close-icon")[0].className = "fab-close-icon icon-md ion-md-close";
	}

	public edit(): void {

		let modal = this.modalController.create(ModalPage, this.config);
		modal.onDidDismiss(data => {

	        if (data) {
	            this.config = data;
	        }

      	});
    	modal.present();

	}

	public sendData(command): void {
		this.sendDataCommand(command, true);
	}

	public sendDataCommand(command, withStopCommand): void {

		if (this.shareService.isConnected()) {

			this.currentCommand = {'time': (new Date()).getTime(), 'command': command};
			if (this.shareService.isBle()) {
				this.sendDataBLE(command);
			} else {
				this.sendDataSerial(command);
			}
			if (withStopCommand) {
				this.checkButtonPressed();
			}

		} else {
			Toast.show("Não Há Nenhum Dispositivo Conectado", '2000', 'center').subscribe(toast => {});
		}

	}

	private checkButtonPressed(): void {

		setTimeout(() => {

			if (document.querySelectorAll(".dir:active").length > 0) {
				this.checkButtonPressed();
			} else {
				this.stopCommand();
			}

		}, 100);

	}

	public stopCommand(): void {

		if (this.isRecording) {

			this.currentCommand.time = (new Date()).getTime()-this.currentCommand.time;
			this.recorded.push(this.currentCommand);

		}
		if (this.shareService.isBle()) {
				this.sendDataBLE(this.config.stop);
		} else {
			this.sendDataSerial(this.config.stop);
		}

	}

	private sendDataBLE(command): void {

		BLE.write(this.shareService.getId(), this.shareService.getService(), this.shareService.getCharac(), this.stringToBytes(command)).then(res => {

			if (this.isRecording && command != "0") {
				console.log('Armazenando = '+command);
			} else {
				console.log('Enviando = '+command);
			}

		}).catch(error => {
			Toast.show("Falha ao Enviar Comando", '2000', 'center').subscribe(toast => {});
		});

	}

	private sendDataSerial(command): void {

		BluetoothSerial.write(command).then(res => {

			// console.log('Enviando');
			if (this.isRecording && command != "0") {
				console.log('Armazenando = '+command);
			} else {
				console.log('Enviando = '+command);
			}

		}).catch(error => {
			Toast.show("Falha ao Enviar Comando", '2000', 'center').subscribe(toast => {});
		});

	}

	private stringToBytes(string): ArrayBuffer {

	   var array = new Uint8Array(string.length);
	   for (var i = 0, l = string.length; i < l; i++) {
	       array[i] = string.charCodeAt(i);
	    }
	    return array.buffer;

	}

	public enableRecord(): void {

		this.isRecording = !this.isRecording;
		if (this.isRecording) {
			this.recorded = [];
		}

	}

	public sendRecorded(isReverse, index): void {

		this.isRecording = false;

		if (this.shareService.isConnected()) {

			if (this.recorded.length > 0) {

				if (index < this.recorded.length) {

					var command = null;
					var time = null;
					if (isReverse) {

						command = this.reverseCommand(this.recorded[this.recorded.length-1-index].command);
						time = this.recorded[this.recorded.length-1-index].time;

					} else {

						command = this.recorded[index].command;
						time = this.recorded[index].time;

					}
					this.sendDataCommand(command, false);
					setTimeout(() => {
						this.sendRecorded(isReverse, ++index);
					}, time);
					

				} else {
					this.stopCommand();
				}

			} else {
				Toast.show("Não Há Nenhum Comando Gravado", '2000', 'center').subscribe(toast => {});
			}

		} else {
			Toast.show("Não Há Nenhum Dispositivo Conectado", '2000', 'center').subscribe(toast => {});
		}


	}

	private reverseCommand(command): string {

		if (command == this.config.top) {
			return this.config.bottom;
		} else if (command == this.config.right) {
			return this.config.left;
		} else if (command == this.config.left) {
			return this.config.right;
		} else if (command == this.config.bottom) {
			return this.config.top;
		}
		return null;

	}


}
