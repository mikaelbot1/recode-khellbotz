import chalk from "chalk";
import got from "got";
import { config } from 'dotenv';
import parsems from "parse-ms";
config({ path: "./.env"})

export function LogLogin (version?: string): void {
	const color = (text: string, color: string): string => {
		return !color ? chalk.green(text) : chalk.keyword(color)(text)
	}
	console.clear()
	console.log(color('..............', 'red'))
	console.log(color('            ..,;:ccc,.', 'red'))
	console.log(color("          ......''';lxO.", 'red'))
	console.log(color(".....''''..........,:ld;", 'red'))
	console.log(color("           .';;;:::;,,.x,", 'red'))
	console.log(color("      ..'''.            0Xxoc:,.  ...", 'red'))
	console.log(color("  ....                ,ONkc;,;cokOdc',.", 'red'))
	console.log(color(" .                   OMo           ':ddo.", 'red'))
	console.log(color('                    dMc               :OO;', 'red'))
	console.log(color('                    0M.                 .:o.', 'red'))
	console.log(color('                    ;Wd', 'red'))
	console.log(color('                     ;XO,', 'red'))
	console.log(color('                       ,d0Odlc;,..', 'red'))
	console.log(color("                           ..',;:cdOOd::,.", 'red'))
	console.log(color("                                    .:d;.':;.", 'red'))
	console.log(color("                                       'd,  .'", 'red'))
	console.log(color('                                         ;l   ..', 'red'))
	console.log(color('                                          .o', 'red'))
	console.log(color(`    [=] Bot: ${process.env.nama_bot} [=]            `, 'cyan'), color('c', 'red'))
	console.log(color(`    [=] Number : ${process.env.ownerNumber} [=]             `, 'cyan'), color(".'", 'red'))
	console.log(color(`    [=] Web Version : ${version} [=]             `, 'cyan'), color(".'", 'red'))
	console.log(color('                                              ', 'cyan'), color(".'", 'red'))
	console.log('')
	return void console.log('')
}
export async function getBuffer (Url: string): Promise<Buffer> {
	const data: Buffer = await got(Url, {
		method: 'GET',
        headers: {
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36'
        }
    }).buffer()
    return data
}
export function getUrl (Link: string): RegExpMatchArray | null {
	return Link.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
}
export function Tunggu(ms: number): Promise <unknown> {
    return new Promise((resolve) => setTimeout(resolve, ms))
}
export function RandomName(jumlah: number): string {
    const result: string[] = []
    const karakter: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let Total: number = karakter.length
    for (let i: number = 0; i < jumlah; i++) {
        result.push(karakter.charAt(Math.floor(Math.random() * Total)))
    }
    return result.join('')
}
export function Runtime(seconds: number): string {
	let getData = parsems(seconds * 1000)
	let Text: string = `${getData.days} Hari, ${getData.hours} Jam, ${getData.minutes} Menit, ${getData.seconds} Detik`
	return Text
}