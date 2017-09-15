import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BluetoothSerial, BLE, Toast, SpinnerDialog } from 'ionic-native';
import { ShareService } from '../services/services';


@Component({
	selector: 'page-settings',
	templateUrl: 'settings.html'
})
export class SettingsPage {

	public devices: any[];
	public isBLE: boolean;
	public service: string;
	public charac: string;

  	constructor(public navCtrl: NavController, private shareService: ShareService) {
  		this.devices = [];
  	}

	ionViewDidLoad() {
	}

	public refresh(): void {

		if (this.isBLE) {
			this.refreshBLE();
		} else {
			this.refreshSerial();
		}

	}

	private refreshBLE(): void {

		SpinnerDialog.show();
		BLE.isEnabled().then(res1 => {

			var id = '';
			if (this.devices.length > 0) {
				id = this.devices[0].id;
			}
			BLE.isConnected(id).then(res => {

				SpinnerDialog.hide();
				Toast.show("Desative o Dispositivo Ativo", '2000', 'center').subscribe(toast => {});

			}).catch(error => {

				BLE.startScan([]).subscribe(dev => {

					this.devices = [];
			      	this.devices.push(dev);
			      	this.disableAll();

			    }, error => {

			    	SpinnerDialog.hide();
			      	Toast.show("Falha na Busca de Dispositivos", '2000', 'center').subscribe(toast => {});

			    });

			  	setTimeout(() => {

					BLE.stopScan().then(() => {

						SpinnerDialog.hide();
						if (this.devices.length > 0) {
							Toast.show("Dispositivos Encontrados", '2000', 'center').subscribe(toast => {});
						} else {
							Toast.show("Nenhum Dispositivo Encontrado", '2000', 'center').subscribe(toast => {});
						}

					});

				}, 2000);

			});

		}).catch(error => {
			SpinnerDialog.hide();
			Toast.show("Bluetooth Desabilitado", '2000', 'center').subscribe(toast => {})
		});
	}

	private refreshSerial(): void {

		SpinnerDialog.show();
		BluetoothSerial.isEnabled().then(res1 => {

			BluetoothSerial.isConnected().then(res1 => {

				SpinnerDialog.hide();
				Toast.show("Desative o Dispositivo Ativo", '2000', 'center').subscribe(toast => {});

			}).catch(error => {

				this.devices = [];
				BluetoothSerial.list().then(dev => {

					SpinnerDialog.hide();
					this.devices = dev;
					this.disableAll();
					if (this.devices.length > 0) {
						Toast.show("Dispositivos Encontrados", '2000', 'center').subscribe(toast => {});
					} else {
						Toast.show("Nenhum Dispositivo Encontrado", '2000', 'center').subscribe(toast => {});
					}

				}).catch(error2 => {
					SpinnerDialog.hide();
					Toast.show("Falha na Busca de Dispositivos", '2000', 'center').subscribe(toast => {});
				});

			});




		}).catch(error => {
			SpinnerDialog.hide();
			Toast.show("Bluetooth Desabilitado", '2000', 'center').subscribe(toast => {});
		});

	}

	public connect(device): void {

		this.shareService.setId(device.id);
		this.shareService.setBle(this.isBLE);
		if (this.isBLE) {
			this.connectBLE(device);
		} else {
			this.connectSerial(device);
		}

	}

	private connectBLE(device): void {

		SpinnerDialog.show();
		device.enabled = !device.enabled;
		BLE.connect(device.id).subscribe(res => {

			SpinnerDialog.hide();
			this.shareService.setCharac(res.characteristics[res.characteristics.length-1].characteristic);
			this.shareService.setService(res.characteristics[res.characteristics.length-1].service);
			this.shareService.setConnected(true);
	      	Toast.show("Dispositivo Conectado", '2000', 'center').subscribe(toast => {});

	    }, error => {

	      	SpinnerDialog.hide();
	    	Toast.show("Dispositivo Não Encontrado", '2000', 'center').subscribe(toast => {});

	    });

	}

	private connectSerial(device): void {

		SpinnerDialog.show();
		device.enabled = !device.enabled;
		BluetoothSerial.connect(device.id).subscribe(res => {

			SpinnerDialog.hide();
			this.shareService.setConnected(true);
			Toast.show("Dispositivo Conectado", '2000', 'center').subscribe(toast => {});

	    }, error => {

	    	SpinnerDialog.hide();
	    	Toast.show("Dispositivo Não Encontrado", '2000', 'center').subscribe(toast => {});

	    });

	}

	public disconnect(device): void {

		this.shareService.setConnected(true);
		if (this.isBLE) {
			this.disconnectBLE(device);
		} else {
			this.disconnectSerial(device);
		}

	}

	private disconnectBLE(device): void {

		SpinnerDialog.show();
		device.enabled = !device.enabled;
		BLE.disconnect(device.id).then(res => {

			SpinnerDialog.hide();
			Toast.show("Dispositivo Desconectado", '2000', 'center').subscribe(toast => {});

	    }).catch(error => {

	    	SpinnerDialog.hide();
	    	Toast.show("Dispositivo Desconectado", '2000', 'center').subscribe(toast => {});

	    });

	}

	private disconnectSerial(device): void {

		SpinnerDialog.show();
		device.enabled = !device.enabled;
		BluetoothSerial.connect(device).subscribe(res => {

			SpinnerDialog.hide();
			Toast.show("Dispositivo Desconectado", '2000', 'center').subscribe(toast => {});

		}, error => {

	    	SpinnerDialog.hide();
	    	Toast.show("Dispositivo Desconectado", '2000', 'center').subscribe(toast => {});

	    });

	}


	private disableAll(): void {

		for (var i = 0; i < this.devices.length; i++) {
			this.devices[i].enabled = false;
		}

	}


}
