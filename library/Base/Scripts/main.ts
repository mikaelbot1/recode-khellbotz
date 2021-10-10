import { WAOpenResult, WAChatUpdate, WAConnection } from "@adiwajshing/baileys";
import Languages from "../../lang/help";
import Connections from "../../routers/connections/connect";
import { LogLogin } from "../../functions/function";
import { HandlerData, CommandHandler, ClientMessage } from ".";
import Call from "./CallHandling";
import chalk from "chalk";
import * as fs from "fs";
import { HandlingData, IConfiguration } from "../../typings";

let Path: string = "./library/database/config.json";

if (!fs.existsSync(Path)) fs.writeFileSync(Path, JSON.stringify({ 
	"public": false,
	"antipakistan": false
} as IConfiguration))

export let Public: IConfiguration =  (JSON.parse(fs.readFileSync(Path).toString()) as IConfiguration);

export function SettingsPublic (settings: boolean) {
	Public.public = settings;
}

export class MainHandler extends Connections {
	constructor (public client: WAConnection) {
		super(client)
	}
	public HandlingData: HandlerData = new HandlerData();
	public CallHandler:  Call  = new  Call(this.client);
	public  BeforeConnect (): void {
		this.Login()
		return this.CheckConneksi()
	}
	public  AfterConnect (): void {
		return  this.GetMessages()
	}
	public DetectorConnect (): void {
		return void this.CallHandler.callDetector()
	}
	private GetMessages (): void {
		this.client.on("chat-update", async (chats: WAChatUpdate): Promise <void> => {
			const data: HandlingData | undefined =  this.HandlingData.getRespon(chats, this.client);
			globalThis.Lang = new Languages(data?.prefix);
			if (!data) return;
			if (!Public.public && !data.isOwner) return;
			globalThis.Client = new CommandHandler();
			const Cli: ClientMessage = new ClientMessage(this.client, data);
			(await import("../../src/main")).onPattern();
			Client.getEventsDetector(this.client, data, Cli)
			if (data.isBot) return;
			return void (Client.waitEventsUpdate(this.client, data, Cli));
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
