import { WAConnection as Base, WANode, MessageType, proto, WAMetric, WATag } from "@adiwajshing/baileys";
import chalk from "chalk";


export default class Call {
	constructor (public client: Base) {};
	public callDetector = () => {
		this.client.on("CB:Call", async (json: any) => {
			const Offer: boolean = json[1]["type"] == "offer";
			const getId: string = `${(json[1]["from"] as string).split("@")[0]}@s.whatsapp.net`;
			if (!Offer) return;
			console.log(`${chalk.green("Call")} ${getId}`)
			await this.actionCall(getId, json[1].id)
		})
	};
	private actionCall = async (target: string, callId: string) => {
		const Tag: string = this.client.generateMessageTag();
		const json: WANode = [
			"action",
			"call",
			[
				"call",
				{
					from: this.client.user.jid,
					to: target,
					id: Tag
				},
				[
					[
						"reject",
						{
							"call-id": callId,
							"call-creator": target,
							count: "0"
						},
						null
					]
				]
			]
		]
		// Set Public kalo mau auto reject bro
		// Set di File 0.Base.d.ts
		// Nyalain aja ini kalo mau reject await this.client.send(`${Tag},${JSON.stringify(json)}`)
	  return void await this.client.sendMessage(target, "Gausah nelpon nelpon babi gada kata un block", MessageType.text).then((value: proto.WebMessageInfo) => {
		  this.client.blockUser(target, "add")
	  })
	}
}