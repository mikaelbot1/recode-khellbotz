import { WAConnection } from "@adiwajshing/baileys";
import { getCommand, HandlingData, EventEmitter } from "../../typings";
import chalk from "chalk";
import { ClientMessage  } from ".";
import { config } from 'dotenv';
config({ path: './.env' })

const Events: any = {};
const antispam: Set<String> = new Set();
const waitSpam: Set<String> = new Set();
const rejectSpam: Set<String> = new Set();
const doubleSpam: Set<String> = new Set();

export class CommandHandler {
	public events: any = Events;
	public client: WAConnection | undefined;
	public res: ClientMessage  | undefined;
	constructor() {
    }
	public on (className: string, callback: (data: HandlingData, res: ClientMessage) => void, _event: getCommand) {
		_event.withPrefix = _event.withPrefix ?? true
		_event.enable = _event.enable ? _event.enable : true
		if (!this.events[className]) 
		this.events[className] = {
			nameClass: className,
			callback,
			..._event
		}
		this.events[className] = {
			...this.events[className],
			callback,
			..._event
		}
	}
	public waitEventsUpdate (client: WAConnection, data: HandlingData, res: ClientMessage) {
		return new Promise (async (resolve, reject) => {
			this.client = client
			this.res = res;
			const { isOwner, prefix,  command, isGroupMsg, from, id,  groupMetadata, Jam, fromMe, args, pushname, sender, media, getIdButton } = data;
			try {
				for (const className in this.events) {
					const event: EventEmitter = this.events[className];
					if (!event.enable && !isOwner) continue;
					const getPrefix: string = this.checkPrefix(prefix, event);
					let _command: string = event.isButton ? getIdButton ?? "" : command.startsWith(getPrefix) ? command.replace(getPrefix, "") : command
					const isCmd: boolean = this.getCmd(event.isButton ? getIdButton ?? "" : command, event.command, getPrefix)
					if (!isCmd) continue
					event.antispam = (event.antispam == undefined) ? true : event.antispam
					event.isBlockir = (event.isBlockir == undefined) ? true : event.isBlockir
					if (event.isOwner && !isOwner) return
					if (event.isBlockir && this.client.blocklist.find((values: string) => values === sender?.replace("@c.us", "@s.whatsapp.net"))) return;
					if (event.antispam && !isOwner && !!doubleSpam.has(sender as string)) return;
					if (event.antispam && !isOwner && !!rejectSpam.has(sender as string)) return;
					if (event.antispam && !isOwner && !!waitSpam.has(sender as string)) return rejectSpam.add(sender as string) && await this.res.reply(from, `*「❗」* Mohon maaf kak, Tunggu perintah sebelumnya berakhir terlebih dahulu jika kakak ingin menggunakan perintah berikutnya`, id)
					if (event.antispam && !isOwner && !!antispam.has(sender as string)) return doubleSpam.add(sender as string) && await this.res.reply(from, `*「❗」* Maaf ka setelah anda menggunakan command ada jeda ${event.delaySpam ?? 7000} detik untuk anda bisa menggunakan command kembali`, id)
					if (event.isQuerry && !args[0]) return this.res.reply(from, "*「❗」* Mohon maaf kak, harap masukkan querry untuk menggunakan perintah tersebut", id)
					if (event.isMedia && !media) return this.res.reply(from, "*「❗」*  Mohon maaf kak, harap masukkan media jika kamu ingin menggunakan perintah tersebut", id)
					if (event.isUrl && !res.respon.getUrl(args.join(" "))) return this.res.reply(from, "*「❗」* Mohon maaf kak, untuk menggunakan perintah ini kakak harus memasukkan url agar bot dapat mengeksekusi perintah tersebut", id)
					if (event.isPrivate && !isOwner && isGroupMsg) return this.res.reply(from, "*「❗」* Mohon maaf kak, Perintah ini hanya dapat di gunakan di personal chat saja kak", id)
					if (event.isGroupMsg && !isGroupMsg && !isOwner) return await res.reply(from, "*「❗」* Maaf kak perintah ini hanya bisa di gunakan di dalam grup saja kak", id)
					if (event.isAdmins && !(await groupMetadata()).isGroupAdmins) return await this.res.reply(from, "*「❗」*  Mohon Maaf kak, Perintah ini dapat digunakan khusus untuk admin group saja", id)
					if (event.isBotAdmins && !(await groupMetadata()).isBotAdmins) return await this.res.reply(from, "*「❗」* Mohon Maaf Kak, Perintah ini dapat di gunakan jika bot menjadi admin group", id)
					try {
						if (event.antispam && !isOwner) waitSpam.add(sender as string) 
						return void  (await event.callback(data, res)) 
					} catch (err) {
						if (event.antispam && !!rejectSpam.has(sender as string)) rejectSpam.delete(sender as string)
						if (event.antispam && !!waitSpam.has(sender as string)) waitSpam.delete(sender as string)
						if (event.antispam && !!antispam.has(sender as string)) antispam.delete(sender as string)
						if (event.antispam && !!doubleSpam.has(sender as string)) doubleSpam.delete(sender as string)
						console.log(err)
						this.res.reply(from, "*「❗」* Mohon Maaf kak, Saat ini Fitur sedang Error Bot otomatis menghubungi owner", id)
						throw this.res.sendText(data.sendOwner, "Error " + _command + ":" + err)
					} finally {
						if (event.antispam && !isOwner && !!waitSpam.has(sender as string)) waitSpam.delete(sender as string);
						if (event.antispam && !isOwner && !!rejectSpam.has(sender as string)) rejectSpam.delete(sender as string)
						if (event.antispam && !isOwner) antispam.add(sender as string)
						console.log(chalk.keyword('red')('\x1b[1;31m~\x1b[1;37m>'), chalk.keyword('blue')(`[\x1b[1;32m${chalk.hex('#009940').bold('RECORD')}]`), chalk.red.bold('\x1b[1;31m=\x1b[1;37m>'),chalk.cyan('\x1bmSTATUS :\x1b'), chalk.hex('#fffb00')(fromMe ? 'SELF' : 'PUBLIK'), chalk.greenBright('[COMMAND]'), chalk.keyword('red')('\x1b[1;31m~\x1b[1;37m>'), chalk.blueBright(command), chalk.hex('#f7ef07')(`[${args?.length}]`),chalk.red.bold('\x1b[1;31m=\x1b[1;37m>'), chalk.hex('#26d126')('[PENGIRIM]'),chalk.hex('#f505c1')(pushname), chalk.hex('#ffffff')(`(${sender?.replace(/@s.whatsapp.net/i, '')})`), chalk.greenBright('IN'), chalk.hex('#0428c9')(`${(await groupMetadata()).groupMetadata?.subject}`), chalk.keyword('red')('\x1b[1;31m~\x1b[1;37m>'), chalk.hex('#f2ff03')('[DATE] =>'),chalk.greenBright(Jam.split(' GMT')[0]))
						return void (setTimeout( () => {
							if (event.antispam && !!antispam.has(sender as string)) antispam.delete(sender as string)
							if (event.antispam && !!doubleSpam.has(sender as string)) doubleSpam.delete(sender as string)
						}, event.delaySpam ?? 7000))
					}
				}
			} catch (err) {
				throw reject(console.log(err))
			}
		})
	}
	private getCmd (command: string, cmd: string | string[], prefix: string) {
		const isCmd: boolean = Array.isArray(cmd) ? cmd.some((value: string) => (prefix + value == command)) : typeof cmd == "string" ? prefix + cmd === command : false
		return isCmd
	}
	private checkPrefix (prefix: string, events: EventEmitter): string {
		if (events.withPrefix && events.prefix) {
			return events.prefix
		} else if (events.withPrefix) {
			return prefix
		} else {
			return ""
		}
	}
}
