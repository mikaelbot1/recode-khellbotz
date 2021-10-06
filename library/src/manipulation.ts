import { HandlingData } from '../typings';
import { ClientMessage } from '../Base/Scripts/client';
import { proto } from "@adiwajshing/baileys";
import * as fs from "fs";

export var Circle: void = globalThis.Client.on("Sticker Cirle", async (data: HandlingData, Cli: ClientMessage) => {
	const { from, id, media, isGambar, isQuotedImage, command } = data;
	var { CreateImageToCircle, Tunggu, stickerWhatsappFormatterWithCropped } = Cli.respon;
	if (isGambar || isQuotedImage) {
		return void await CreateImageToCircle(await Cli.decryptMedia(media as proto.WebMessageInfo, true) as string).then(async (hasil: string) => {
			const Sticker: Buffer = await stickerWhatsappFormatterWithCropped(hasil);
			await Cli.sendFile(from, Sticker, { quoted: id })
			 await Tunggu(2000)
			 if (fs.existsSync(hasil)) fs.unlinkSync(hasil)
		}).catch((err) => {
			Cli.reply(from, "*「❗」* Mohon Maaf kak, Fitur Sticker Circle saat ini sedang error bot otomatis menghubungi owner", id)
			return void Cli.sendPanic(err)
		})
	} else {
		return void Cli.reply(from, `*「❗」* Mohon maaf ka, diharapkan kirim/reply Gambar image dengan caption ${command} untuk menggunakan perintah ini`, id)
	}
 }, { event: ["stickercircle <image>"], tag: "manipulasi", command: ["stickerc", "stikerc", "stickercircle", "stikercircle", "scircle"], isMedia: true })