import { WAConnection, MessageType, proto, WAGroupParticipant, compressImage } from '@adiwajshing/baileys';
import {  HandlingData,  Formatter  } from "../../typings";
import filetype, { FileTypeResult } from "file-type";
import { RandomName, getUrl, getBuffer } from "../../functions/function";
import { response } from "../../plugins"
import * as fs from "fs";

export class ClientMessage {
	constructor (public client: WAConnection, public data: HandlingData) {}
	public async sendText(from: string, text: string): Promise <proto.WebMessageInfo>  {
		return await this.client.sendMessage(from, text, MessageType.text)
	}
	public async reply (from: string, text: string, id?: proto.WebMessageInfo): Promise <proto.WebMessageInfo> {
		return await this.client.sendMessage(from, text, MessageType.text, { quoted: id })
	}
	public respon: Formatter = response as Formatter
	public async sendTextWithMentions (from: string, text: string, id?: proto.WebMessageInfo): Promise <proto.WebMessageInfo> {
		const ParseMentioned: string[] | undefined = (String(text).match(/@(0|[0-9]{4,14})/g)?.map((values: string) => values.split("@")[1] + "@s.whatsapp.net")) ?? []
		const Reparse: string[] | undefined = (await (await this.data.groupMetadata()).groupMember)?.map((values: WAGroupParticipant) => values.jid) ?? []
		let Mentioned: string[] = [];
		if (ParseMentioned) {
			for (let result of ParseMentioned) {
				Reparse?.filter((value: string) => {
					if (value === result) Mentioned.push(result)
				})
			}
		}
		return await this.client.sendMessage(from, text, MessageType.extendedText, { quoted: id, contextInfo: { mentionedJid: Mentioned }})
	}
	public async sendButtonMenu (from: string, buttons: proto.ButtonsMessage, settings?: { quoted?: proto.WebMessageInfo, mentioned?: string[]}) {
		let response: proto.WebMessageInfo | any = await this.client.prepareMessage(from, buttons, MessageType.buttonsMessage, { thumbnail: await compressImage(fs.readFileSync('./library/storage/polosan/thumb.png')).toString(), quoted: settings?.quoted, contextInfo: { mentionedJid: settings?.mentioned}})
		const Thumb: Buffer = await compressImage(fs.readFileSync('./library/storage/polosan/thumb.png'))
		if (response.message?.ephemeralMessage) {
			response.message.ephemeralMessage.message.buttonsMessage.imageMessage.jpegThumbnail = Thumb
		} else {
			response.message.buttonsMessage.imageMessage.jpegThumbnail = Thumb
		}
		return void (await this.client.relayWAMessage(response))
	}
	public async sendContactOwner (from: string, id?: proto.WebMessageInfo): Promise <proto.WebMessageInfo> {
		const Vcard: string =
		'BEGIN:VCARD\n' +
		'VERSION:3.0\n' +
		'FN: I`am Ra\n' +
		'ORG: RA BOT\n' +
		'TEL;type=CELL;type=VOICE;waid=33753045534:+33 7 53 04 55 34\n' +
		'END:VCARD'
		const Contact: proto.ContactMessage  = { displayName: 'I`am Ra', vcard: Vcard } as proto.ContactMessage
		return await this.client.sendMessage(from, Contact, MessageType.contact, { quoted: id})
	}
	public compressGambar: (bufferFileOrPath: string | Buffer) => Promise <Buffer> = compressImage
	public async sendFile (from: string, media: Buffer | string | proto.WebMessageInfo, _settings: { caption?: string, quoted?: proto.WebMessageInfo, ptt?: boolean, viewOnce?: boolean, withMentions?: boolean, forwardingScore?: number, filename?: string, sendDocs?: boolean}): Promise <proto.WebMessageInfo | void> {
		const ParseMentioned: string[] | undefined = _settings.withMentions == true ? (String(_settings.caption).match(/@(0|[0-9]{4,14})/g)?.map((values: string) => values.split("@")[1] + "@s.whatsapp.net")) : []
		const Reparse: string[] | undefined = _settings.withMentions == true ? (await (await this.data.groupMetadata()).groupMember)?.map((values: WAGroupParticipant) => values.jid) : []
		let Mentioned: string[] = [];
		if (ParseMentioned) {
			for (let result of ParseMentioned) {
				Reparse?.filter((value: string) => {
					if (value === result) Mentioned.push(result)
				})
			}
		}
		try {
			if (Buffer.isBuffer(media)) {
				const File: FileTypeResult | undefined = await  filetype.fromBuffer(media)
				switch (_settings.sendDocs ? "docs" : File?.ext) {
					case "docs":
						return await this.client.sendMessage(from, media, MessageType.document, { quoted: _settings.quoted, mimetype: File?.mime, filename: _settings.filename ?? "RA BOT" + RandomName(12), contextInfo: { mentionedJid: Mentioned, forwardingScore: _settings.forwardingScore }})	
					case "mp4":
						return await this.client.sendMessage(from, media, MessageType.video, { caption: _settings.caption, quoted: _settings.quoted, viewOnce: _settings.viewOnce ?? false, contextInfo: { mentionedJid: Mentioned, forwardingScore: _settings.forwardingScore } })
					case "mp3":
						return await this.client.sendMessage(from, media, MessageType.audio, { quoted: _settings.quoted, ptt: _settings.ptt, contextInfo: { mentionedJid: Mentioned, forwardingScore: _settings.forwardingScore }})
					case "webp":
						return await this.client.sendMessage(from, media, MessageType.sticker, { quoted: _settings.quoted, contextInfo: { mentionedJid: Mentioned, forwardingScore: _settings.forwardingScore }})
					case "png":
					case "jpg":
						return await this.client.sendMessage(from, media, MessageType.image, { caption: _settings.caption, quoted: _settings.quoted, viewOnce: _settings.viewOnce ?? false, contextInfo: { mentionedJid: Mentioned, forwardingScore: _settings.forwardingScore }, thumbnail: (await (await this.compressGambar(media)).toString()) })
					default:
						return await this.client.sendMessage(from, media, MessageType.document, { quoted: _settings.quoted, mimetype: File?.mime, filename: _settings.filename ?? "RA BOT" + RandomName(12), contextInfo: { mentionedJid: Mentioned, forwardingScore: _settings.forwardingScore }})	
				}
			} else if (typeof media === "string" && fs.existsSync(media)) {
				media = fs.readFileSync(media)
				const File: FileTypeResult | undefined = await  filetype.fromBuffer(media)
				switch (_settings.sendDocs ? "docs" : File?.ext) {
					case "docs":
						return await this.client.sendMessage(from, media, MessageType.document, { quoted: _settings.quoted, mimetype: File?.mime, filename: _settings.filename ?? "RA BOT" + RandomName(12), contextInfo: { mentionedJid: Mentioned, forwardingScore: _settings.forwardingScore }})	
					case "mp4":
						return await this.client.sendMessage(from, media, MessageType.video, { caption: _settings.caption, quoted: _settings.quoted, viewOnce: _settings.viewOnce ?? false, contextInfo: { mentionedJid: Mentioned, forwardingScore: _settings.forwardingScore } })
					case "mp3":
						return await this.client.sendMessage(from, media, MessageType.audio, { quoted: _settings.quoted, ptt: _settings.ptt, contextInfo: { mentionedJid: Mentioned, forwardingScore: _settings.forwardingScore }})
					case "webp":
						return await this.client.sendMessage(from, media, MessageType.sticker, { quoted: _settings.quoted, contextInfo: { mentionedJid: Mentioned, forwardingScore: _settings.forwardingScore }})
					case "png":
					case "jpg":
						return await this.client.sendMessage(from, media, MessageType.image, { caption: _settings.caption, quoted: _settings.quoted, viewOnce: _settings.viewOnce ?? false, contextInfo: { mentionedJid: Mentioned, forwardingScore: _settings.forwardingScore }, thumbnail: (await (await this.compressGambar(media)).toString()) })
					default:
						return await this.client.sendMessage(from, media, MessageType.document, { quoted: _settings.quoted, mimetype: File?.mime, filename: _settings.filename ?? "RA BOT" + RandomName(12), contextInfo: { mentionedJid: Mentioned, forwardingScore: _settings.forwardingScore }})	
				}
			} else if (typeof media === "string" && getUrl(media)) {
				let Url: RegExpMatchArray = getUrl(media) as RegExpMatchArray
				media = await getBuffer(Url[0]);
				const File: FileTypeResult | undefined = await  filetype.fromBuffer(media)
				switch (_settings.sendDocs == true ? "docs" : File?.ext) {
					case "docs":
						return await this.client.sendMessage(from, media, MessageType.document, { quoted: _settings.quoted, mimetype: File?.mime, filename: _settings.filename ?? "RA BOT" + RandomName(12), contextInfo: { mentionedJid: Mentioned, forwardingScore: _settings.forwardingScore }})	
					case "mp4":
						return await this.client.sendMessage(from, media, MessageType.video, { caption: _settings.caption, quoted: _settings.quoted, viewOnce: _settings.viewOnce ?? false, contextInfo: { mentionedJid: Mentioned, forwardingScore: _settings.forwardingScore } })
					case "mp3":
						return await this.client.sendMessage(from, media, MessageType.audio, { quoted: _settings.quoted, ptt: _settings.ptt, contextInfo: { mentionedJid: Mentioned, forwardingScore: _settings.forwardingScore }})
					case "webp":
						return await this.client.sendMessage(from, media, MessageType.sticker, { quoted: _settings.quoted, contextInfo: { mentionedJid: Mentioned, forwardingScore: _settings.forwardingScore }})
					case "png":
					case "jpg":
						return await this.client.sendMessage(from, media, MessageType.image, { caption: _settings.caption, quoted: _settings.quoted, viewOnce: _settings.viewOnce ?? false, contextInfo: { mentionedJid: Mentioned, forwardingScore: _settings.forwardingScore }, thumbnail: (await (await this.compressGambar(media)).toString()) })
					default:
						return await this.client.sendMessage(from, media, MessageType.document, { quoted: _settings.quoted, mimetype: File?.mime, filename: _settings.filename ?? "RA BOT" + RandomName(12), contextInfo: { mentionedJid: Mentioned, forwardingScore: _settings.forwardingScore }})	
				}
			} else if (this.data.media == media) {
				let respon: proto.WebMessageInfo = await this.client.prepareMessageFromContent(from, media.message as proto.IMessage,  {  caption: _settings.caption,quoted: _settings.quoted, contextInfo: { mentionedJid: Mentioned, forwardingScore: _settings.forwardingScore }})
				return await this.client.relayWAMessage(respon, { waitForAck: true})
			} else {
				throw new ErrorEvent("Harap Masukkan media file")
			}
		} catch (err) {
			throw new Error(String (err))
		}
	}
}