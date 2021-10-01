import request,{ RequestCallback } from "request";
import { RandomArray, getUrl } from "../../functions/function";
import cheerio, { CheerioAPI, Element, Cheerio } from "cheerio";
import { SearchGoogle } from "../../typings/google";
import translate, { ITranslateResponse, languages }  from "@vitalets/google-translate-api";

export default class Google {
	constructor () {}
	public GoogleImages = async (judul: string): Promise <string[]|null> => {
		return new Promise (async (resolve, reject) => {
			try {
				request(`http://images.google.com/search?tbm=isch&q=${judul}%20-site%3Agstatic.com`, {
					headers: {
						"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36"
					}
				}, (err, respon) => {
					if (err) return reject(err)
					const $: CheerioAPI = cheerio.load(respon.body);
					const getScriptsContent: Cheerio <Element> = $('script');
					const hasil: string[] = [];
					for (let i: number = 0; i < getScriptsContent.length; ++i) {
					  if (getScriptsContent[i].children.length > 0) {
						const ress: string = (getScriptsContent[i].children[0] as any).data;
						hasil.push(ress);
					  }
					}
					let getURL: string[] | undefined = getUrl(hasil.join(" "))?.filter((v) => /(.jpg|.jpeg|.png|.gif)$/i.test(v))
					if (!getURL) return resolve(null);
					return resolve(RandomArray(getURL))
				})
			} catch (err) {
				return reject(err)
			}
		})
	}
	public GoogleTranslate = async (text: string, to?: string): Promise <ITranslateResponse|null> => {
		return new Promise (async (resolve, reject) => {
			if (!to) to = "id";
			let bef: string = to;
			if (!languages.isSupported(to)) to = typeof languages.getCode(to) === "string" ? languages.getCode(to) as string : bef
			if (!languages.isSupported(to)) return resolve(null)
			await translate(text, { to: to }).then((values: ITranslateResponse) => {
				return resolve(values)
			}).catch((err) => reject(new Error(String(err))))
		})
	}
	public checkSupportLanguage = (lang: string): boolean => {
		let status: boolean = false;
		if (!languages.isSupported(lang) &&  typeof languages.getCode(lang) === "string" ? languages.getCode(lang) as string : false) status = true
		if (languages.isSupported(lang)) status = true;
		return status
	}
	public GoogleSearch = async (judul: string, options?: { jumlah?: number, start?: number, withAwal?: boolean}): Promise <SearchGoogle[]|null> => {
		return new Promise (async (resolve, reject) => {
			try {
				request("https://www.google.com/search", {
					qs: {
						q: judul,
						num: options?.jumlah || 35,
						start: options?.start || 0
					},
					headers: {
						"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36"
					}
				}, (err, respon) => {
					if (err) return reject(err)
					const $: CheerioAPI = cheerio.load(respon.body)
					let hasil: SearchGoogle[] = []
					$("#search > div").each(function (hay: number, tayo: Element) {
						$(tayo).find("div").each(function (RA_BOT: number, Ra: Element) {
							let title: string = $(Ra).find("div > div > div > a > h3").text()
							let url: string | undefined = $(Ra).find("div > div > div > a").attr("href")
							let snippet: string = $(Ra).find("div > div > div > div > span:nth-child(2)").text()
							let tanggal: string = $(Ra).find("div > div > div > div > div > span.MUxGbd.wuQ4Ob.WZ8Tjf").text()
							if (!title) return;
							if (!tanggal) return;
							if (!url) return;
							hasil.push({ title, url, snippet, tanggal })
						})
					})
					let Respon: SearchGoogle[] = hasil.filter((value, index, array) => array.findIndex((res) => (res.url == value.url)) === index)
					if (options?.withAwal) Respon.shift()
					if (!Respon[0]) return resolve(null)
					return resolve(RandomArray(Respon) as SearchGoogle[])
				})
			} catch (err) {
				return reject(err)
			}
		})
	}
}