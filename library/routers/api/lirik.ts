import Github from "./github";
import axios, { AxiosResponse } from "axios";
import { UserAgent } from "../../functions/function";
import * as fs from "fs";
import cheerio, { CheerioAPI } from "cheerio";
import { LirikResult } from "../../typings";

export default class LirikLagu extends Github {
	constructor () {
		super()
	};
	public MusicMatch = async (judul: string): Promise <LirikResult|null> => {
		return new Promise (async (resolve, reject) => {
			try {
				const respon: AxiosResponse = await axios({
					url: 'https://www.musixmatch.com/search/' + judul,
					method: 'GET',
					headers: {
						'User-Agent': UserAgent("default")
					},
					proxy: JSON.parse(fs.readFileSync("./app.json").toString())
				})
				const c: CheerioAPI = cheerio.load(respon.data)
				const Url: string | undefined = c('#search-all-results > div.main-panel > div:nth-child(1)').find('div.box-content > div > ul > li > div > div.media-card-body > div > h2 > a').attr('href')
				if (!Url) return resolve(null);
				const Post: AxiosResponse = await axios({
					url: "https://www.musixmatch.com" + Url,
					method: "GET",
					headers: {
						'User-Agent': UserAgent("Windows")
					},
					proxy: JSON.parse(fs.readFileSync("./app.json").toString())
				})
				const $: CheerioAPI = cheerio.load(Post.data)
				const title: string = $('div.mxm-track-banner.top > div > div > div > div').find('div.track-title-header > div.mxm-track-title').find('h1').text().trim().replace(/Lyrics/, '')
				const thumbnail: string = 'https:' + $('div.mxm-track-banner.top > div > div > div').find('div > div > div > div > img').attr('src')
				const artist: string = $('div.mxm-track-banner.top > div > div > div > div').find('div.track-title-header > div.mxm-track-title > h2 > span').text().trim()
				const lirik: string = $('div.mxm-track-lyrics-container > div.container > div > div > div').find('div > div.mxm-lyrics > span > div > p > span').text().trim()
				const Format: LirikResult = {
					status: Post.status,
					result: {
						title,
						thumbnail,
						artist,
						lirik
					}
				}
				return resolve(Format)
			} catch (err) {
				return reject(err)
			}
		})
	}
}