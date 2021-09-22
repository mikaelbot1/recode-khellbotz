import { HandlingData } from '../typings';
import { ClientMessage } from '../Base/Scripts/client';
import util from "util";
import * as ts from "typescript";

export var Eval: void = globalThis.Client.on("eval", async (data: HandlingData, Cli: ClientMessage) => {
	const { args, from, id } = data;
	const convert: string = ts.transpile(`(async () => { 
		${args?.join(' ')}
	})()`)
	try {
		const send: string = util.format(eval(convert))
		return void await Cli.reply(from, util.format(send), id)
	} catch (err) {
		throw Cli.reply(from, util.format(err), id)
	}
}, { event: ["=> <Kode Jawascript>"], command: "=>", tag: 'owner', withPrefix: false, isOwner: true, antispam: false  })

export var Execute: void = globalThis.Client.on("execute", async (data: HandlingData, Cli: ClientMessage) => {
	const { from, id, args } = data;
	return void (await Cli.respon.Exec(args.join(" ")).then((value) => {
		Cli.reply(from, util.format(String(value)), id)
	}).catch((err) => Cli.reply(from, util.format(String(err)), id)))
}, { event: ["$ <execute>"], command: "$", tag: "owner", withPrefix: false, isOwner: true, isQuerry: true, antispam: false })