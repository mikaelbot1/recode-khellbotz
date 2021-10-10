import { HandlingData, IConfiguration } from '../../typings';
import { ClientMessage } from '../../Base/Scripts/client';
import * as fs from "fs";

let Path: string = "./library/database/config.json";

if (!fs.existsSync(Path)) fs.writeFileSync(Path, JSON.stringify({ 
	"public": false,
	"antipakistan": false
} as IConfiguration))

export var AntiPakis: void = globalThis.Client.open("Anti Pakistan", async (data: HandlingData, Cli: ClientMessage) => {
	const { isOwner, sender } = data;
	if (!isOwner && sender && sender.endsWith("@s.whatsapp.net") && sender.startsWith("92") && (JSON.parse(fs.readFileSync(Path).toString()) as IConfiguration).antipakistan) {
		await Cli.client.blockUser(sender, "add")
	}
})