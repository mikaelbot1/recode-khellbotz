import { WAConnection, WAOpenResult, Browsers } from '@adiwajshing/baileys';
import chalk from "chalk";
import * as fs from "fs";
import axios, { AxiosResponse } from "axios";
import { getClientVersion } from "../../typings";


const Path: string = "./library/routers/account/session_bot.json";

export default class Connections {
	constructor (public client: WAConnection) {
	}
	private LoginQr (): void {
		return void this.client.on("qr", (qr: string) => {
			console.log(chalk.red('[!]'), chalk.hex('#e3ff00')('Please scan your Qr code immediately...........'))
		})
	}
	private async getVersion (): Promise <[number, number, number]> {
		let respon: [number, number, number]
		try {
			const getData: AxiosResponse = await axios.get("https://web.whatsapp.com/check-update?version=1&platform=web")
			let Json: getClientVersion = getData.data;
			respon = [Number(Json.currentVersion.split(".")[0]), Number(Json.currentVersion.split(".")[1]), Number(Json.currentVersion.split(".")[2])]
		} catch (err) {
			console.log(err)
			respon = [2, 2134, 10]
		}
		return respon
	}
	private async getSessions (): Promise <WAOpenResult> {
		fs.existsSync(Path) && this.client.loadAuthInfo(Path)
		const connect: WAOpenResult = await this.client.connect();
		fs.writeFileSync(Path, JSON.stringify(this.client.base64EncodedAuthInfo(), null, 2))
		return connect
	}
	private ConfigurationBeforeLogin (version: [number, number, number]): void {
		this.client.version = version;
		this.client.logger.level = "fatal";
		this.client.browserDescription = Browsers.macOS("chrome");
	}
	public async Login (): Promise <WAOpenResult> {
		this.ConfigurationBeforeLogin(await this.getVersion())
		this.LoginQr()
		return this.getSessions()
	}
}