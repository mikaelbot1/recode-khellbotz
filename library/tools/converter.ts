import { exec, ExecException,  } from "child_process";
import { autoPath } from "../functions/function";
import * as fs from "fs";
import { promisify} from 'util';


export const Exec = async (code: string): Promise <string> => {
	return new Promise (async (resolve, reject) => {
		exec(code, (err: ExecException | null, done: string) => {
			if (err) return reject(err);
			return resolve(done)
		})
	})
}
export const WebpToMp4 = async (input: string): Promise <string> => {
	return new Promise (async (resolve, reject) => {
		try {
			let output: string = autoPath("webp");
			const webp = require('node-webpmux');
			const img = new webp.Image();
			const temp: string = './library/storage/temp/';
			const execute: (command: string) => Promise <{ stdout: string, stderr: string}> = promisify(exec)
			await img.load(input)
			let frames: number = img.anim.frames.length;
			for (let i: number = 0; frames > i; i++) {
				await execute(`webpmux -get frame ${i} ${input} -o ${temp}${i}.webp`)
				await execute(`dwebp ${temp}${i}.webp -o ${temp}${i}.png`)
			}
			await execute(`ffmpeg -framerate 22 -i ${temp}%d.png -y -c:v libx264 -pix_fmt yuv420p -loop 4 ${output}`)
			for (frames === 0; frames--; ) {
				fs.unlinkSync(`${temp}${frames}.webp`)
				fs.unlinkSync(`${temp}${frames}.png`)
			}
			if (fs.existsSync(input)) fs.unlinkSync(input)
			return resolve(output)
		} catch (err) {
			throw reject(err)
		}
	})
}

export const WebpToGif = async (input: string): Promise <string> => {
	return new Promise (async (resolve, reject) => {
		let output: string = autoPath("gif")
		exec(`magick ${input} ${output}`, (err: ExecException | null, stdout: string) => {
			if (err) {
				if (fs.existsSync (input)) fs.unlinkSync(input)
				if (fs.existsSync(output)) fs.unlinkSync(output)
				return reject(err)
			} else {
				if (fs.existsSync (input)) fs.unlinkSync(input)
				return resolve(output)
			}
		})
	})
}

