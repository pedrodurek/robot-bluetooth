export class ShareService {  
  
  	private connected: boolean;
  	private id: string;
    private ble: boolean;
	private service: string;
	private charac: string;
 
    constructor() {
    }

    public setConnected(connected): void {
    	this.connected = connected;
    }

    public isConnected(): boolean {
    	return this.connected;
    }

    public setId(id): void {
    	this.id = id;
    }

    public getId(): string {
    	return this.id;
    }

    public setBle(ble): void {
    	this.ble = ble;
    }

    public isBle(): boolean {
    	return this.ble;
    }

    public setService(service): void {
    	this.service = service;
    }

    public getService(): string {
    	return this.service;
    }

    public setCharac(charac): void {
    	this.charac = charac;
    }

    public getCharac(): string {
    	return this.charac;
    }
  
}