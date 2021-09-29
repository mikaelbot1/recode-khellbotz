import { WAConnection } from '@adiwajshing/baileys';
import { MainHandler } from "./Scripts";

class Connected {
	constructor () {
	}
	public client: WAConnection = new WAConnection()
	public Handler: MainHandler = new MainHandler(this.client)
	public async sendRespon () {
		this.Handler.BeforeConnect()
		this.Handler.AfterConnect()
		this.Handler.DetectorConnect()
	}
}
new  Connected().sendRespon()