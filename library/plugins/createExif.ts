import * as fs from "fs";
import { config } from "dotenv";
config({ path: "./.env"})

export async function createExif (Path: string, pakage?: string, author?: string): Promise <string> {
	const json: { "sticker-pack-name": string, "sticker-pack-publisher": string} = {	
		"sticker-pack-name": pakage ?? process.env.nama_bot ?? "RA BOT",
		"sticker-pack-publisher": author ??  "",
	}
	const littleEndian: Buffer = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00])	
	const bytes: number[] = [0x00, 0x00, 0x16, 0x00, 0x00, 0x00]	
	let len: number = JSON.stringify(json).length	
	let last: string | number
	if (len > 256) {	
		len = len - 256	
		bytes.unshift(0x01)	
	} else {	
		bytes.unshift(0x00)	
	}	
	if (len < 16) {	
		last = len.toString(16)	
		last = "0" + len	
	} else {	
		last = len.toString(16)	
	}	
	const buf2: Buffer = Buffer.from(last, "hex")	
	const buf3: Buffer = Buffer.from(bytes)	
	const buf4: Buffer = Buffer.from(JSON.stringify(json))
	const buffer: Buffer = Buffer.concat([littleEndian, buf2, buf3, buf4])
	await fs.writeFileSync(Path + ".exif", buffer)
	return Path + ".exif"
}