import ffmpeg from "fluent-ffmpeg";
import { autoPath } from "../functions/function";
import * as fs from "fs";
import { exec } from "child_process";
import { config } from "dotenv";
config({ path: "./.env"})
import { Sticker, StickerTypes } from "wa-sticker-formatter";

export const stickerWhatsappFormatterWithCropped = async (media: Buffer | string, pakage?: string, author?: string): Promise <Buffer> => {
	return new Promise (async (resolve, reject) => {
		const stiker: Buffer = await new Sticker(media, { pack: pakage  ?? "RA BOT", author: author ?? "",type: StickerTypes.CROPPED , quality: 100 }).build();
		if (!stiker) return reject(new Error("Error Create Sticker"))
		return resolve(stiker)
	})
}
export const convertToWebp = async (input: string): Promise <string> => {
	return new Promise (async (resolve, reject) => {
		const Path: string = autoPath("webp")
		await ffmpeg(input)
		.outputOptions(['-vcodec', 'libwebp', "-framerate", "20", '-vf', `crop=w='min(min(iw\,ih)\,512)':h='min(min(iw\,ih)\,512)',scale=512:512:flags=lanczos:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000,setsar=1,fps=15`, "-qscale", "50", "-fs", "1M", '-loop', '0', '-preset', 'default', '-an', '-vsync', '0', '-s', '512:512'])
		.save(Path)
		.on("error", (err) => {
			if (fs.existsSync(Path)) fs.unlinkSync(Path)
			if (fs.existsSync(input)) fs.unlinkSync(input)
			return reject(new Error(err))
		})
		.on('end', () => {
			if (fs.existsSync(input)) fs.unlinkSync(input)
			return resolve(Path)
		})
	})
}
export const createWmSticker = async (input: string, exif?: string): Promise <string> => {
	return new Promise (async (resolve, reject) => {
		await exec(`webpmux -set exif ${exif} ${input} -o ${input}`, function (err) {
			if (err) {
				fs.unlinkSync(input)
				return reject(new Error(String(err)))
			} else {
				return resolve(input)
			}
		})
	})
}