import { WAOpenResult, WAChatUpdate, WAConnection, MessageType } from '@adiwajshing/baileys';
import Connections from "../../routers/connections/connect";
import { LogLogin } from "../../functions/function";
import { HandlerData, CommandHandler, ClientMessage } from ".";
import chalk from "chalk";
import { HandlingData } from "../../typings";


export class MainHandler extends Connections {
	constructor (public client: WAConnection) {
		super(client)
	}
	public HandlingData: HandlerData = new HandlerData()
	public  BeforeConnect (): void {
		this.Login()
		return this.CheckConneksi()
	}
	public  AfterConnect (): void {
		return  this.GetMessages()
	}
	private GetMessages (): void {
		this.client.on("chat-update", async (chats: WAChatUpdate) => {
			const data: HandlingData | undefined =  this.HandlingData.getRespon(chats, this.client)
			if (!data) return
			globalThis.Client = new CommandHandler()
			const Cli: ClientMessage = new ClientMessage(this.client, data);
			(await import("../../src/main")).onPattern()
			return void (Client.waitEventsUpdate(this.client, data, Cli))
		})
	}
	private CheckConneksi (): void {
		this.client.on("connecting", () => {
			console.log(chalk.yellow("Sedang menghubungkan........"))
		})
		this.client.on("open", (respon: WAOpenResult) => {
			LogLogin(String(this.client.version));
			console.log(chalk.keyword('red')('\x1b[1;31m~\x1b[1;37m>'), chalk.keyword("green")(" BOT STARTED........."))
		})
	}
}