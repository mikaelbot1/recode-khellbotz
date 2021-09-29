import Tiktok from "./tiktok";
import ytSearch, { SearchResult, VideoSearchResult, VideoMetadataResult } from 'yt-search';
import  ytdl, { videoInfo, videoFormat } from 'ytdl-core';
import { YoutubeDlCore, IKeepYoutube, Formatter, IY1tS, IYtSFormat, ISnappea, IY2Mate, IFormatterY2Mate, IFormatterY2MatePost, YoutubePlay  } from "../../typings";
import axios, { AxiosResponse } from "axios";
import cheerio, { CheerioAPI } from "cheerio";
import { response } from "../../plugins";
import filesize from "filesize";
import { config } from "dotenv";
config({ path: './env' })

let getCookies: { cookie?: string, "x-client-data"?: string } = {
	"cookie": process.env.cookieYoutube
}
if (process.env.cookieYoutube) getCookies.cookie = process.env.cookieYoutube
if (process.env.xcliendatayoutube) getCookies['x-client-data'] = process.env.xcliendatayoutube
const options: Formatter = response as Formatter;

export default class Youtube extends Tiktok {
	constructor () {
		super()
	}
	public YoutubeSearch = async (title: string): Promise <VideoSearchResult[]> => {
		return new Promise (async (resolve, reject) => {
			await ytSearch(title).then((values: SearchResult) => {
				return resolve(values.videos)
			}).catch((err: Error) => {
				return reject(err)
			})
		})
	}
	public ytdlCore = async (url: string, mp3: boolean): Promise <YoutubeDlCore> => {
		return new Promise (async (resolve, reject) => {
			const result: VideoMetadataResult = await  this.VideoMetadata(url)
			if (mp3) {
				await this.ytdlCoremp3(url).then((response: YoutubeDlCore) => {
					response.data.thumbnail = result.thumbnail;
					response.data.durasi = result.timestamp;
					response.data.ago = result.ago;
					response.data.publikasi = result.uploadDate;
					response.data.parseText = this.ParseTextYoutube(response, { } as any, { id: result.videoId, ytdl: true, mp3: true })
					return resolve(response)
				}).catch((err) => {
					return reject(err)
				})
			} else {
				await this.ytdlCoremp4(url).then((response: YoutubeDlCore) => {
					response.data.thumbnail = result.thumbnail;
					response.data.durasi = result.timestamp;
					response.data.ago = result.ago;
					response.data.publikasi = result.uploadDate;
					response.data.parseText = this.ParseTextYoutube(response, { } as any, { id: result.videoId, ytdl: true })
					return resolve(response)
				}).catch ((err) => {
					return reject(err)
				})
			}
		})
	}
	protected ytdlCoremp4 = async (url: string): Promise <YoutubeDlCore> => {
		return new Promise (async (resolve, reject) => {
			const regex: RegExp = /(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:watch\?.*(?:|\&)v=|embed\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/
			if (!regex.test(url)) return reject(new Error("URL null"))
			const getId: RegExpExecArray | null = regex.exec(url)
			if (!getId) return reject(new Error("Bukan id youtube"))
			const data: videoInfo = await ytdl.getInfo(getId[1], {
				requestOptions: {
					headers: {
						"User-Agent": options.UserAgent(),
						...getCookies
				}
			}
		});
		const format: videoFormat | undefined = ytdl.filterFormats(data.formats, 'video').find((result => result.mimeType?.startsWith("video/mp4")))
		if (!format) return reject(new Error("data undefined"))
		const size: string = filesize(Number(format.contentLength))
		const result: YoutubeDlCore = {
			status: 200,
			data: {
				title: data.videoDetails.title,
				quality: format.quality,
				size: size,
				format: format.container,
				down: format.url,
				like: Number(data.videoDetails.likes),
				dislike: Number(data.videoDetails.dislikes),
				viewers: Number(data.videoDetails.viewCount),
				category: data.videoDetails.category,
				rilis: data.videoDetails.category,
				video_url: data.videoDetails.video_url,
				channel: data.videoDetails.ownerChannelName,
				durasi: data.videoDetails.lengthSeconds,
				thumbnail: data.videoDetails.thumbnails.find((filter) => filter.width === 1920)?.url,
				desk: data.videoDetails.description
			}
		}
		return resolve(result)
		})
	}
	protected ytdlCoremp3 = async (url: string): Promise <YoutubeDlCore> => {
		return new Promise (async (resolve, reject) => {
			const regex: RegExp = /(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:watch\?.*(?:|\&)v=|embed\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/
			if (!regex.test(url)) return reject(new Error("URL null"))
			const getId: RegExpExecArray | null = regex.exec(url)
			if (!getId) return reject(new Error("Bukan id youtube"))
			const data: videoInfo = await ytdl.getInfo(getId[1], {
				requestOptions: {
					headers: {
						"User-Agent": options.UserAgent(),
						...getCookies
				}
			}
		});
		const format: videoFormat | undefined = ytdl.filterFormats(data.formats, 'audioonly').find((result => result.audioQuality === "AUDIO_QUALITY_MEDIUM"))
		if (!format) return reject(new Error("data undefined"))
		const size: string = filesize(Number(format.contentLength))
		const result: YoutubeDlCore = {
			status: 200,
			data: {
				title: data.videoDetails.title,
				quality: format.quality,
				size: size,
				format: format.container,
				down: format.url,
				like: Number(data.videoDetails.likes),
				dislike: Number(data.videoDetails.dislikes),
				viewers: Number(data.videoDetails.viewCount),
				category: data.videoDetails.category,
				rilis: data.videoDetails.category,
				video_url: data.videoDetails.video_url,
				channel: data.videoDetails.ownerChannelName,
				durasi: data.videoDetails.lengthSeconds,
				thumbnail: data.videoDetails.thumbnails.find((filter) => filter.width === 1920)?.url,
				desk: data.videoDetails.description
			}
		}
		return resolve(result)
		})
	}
	protected keepVideoMP3 = async (url: string): Promise <IKeepYoutube> => {
		return new Promise(async (resolve, reject) => {
			try {
				const regex: RegExp = /(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:watch\?.*(?:|\&)v=|embed\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/
				if (!regex.test(url)) return reject(new Error("URL null"))
				const ua: string =  options.UserAgent()
				const res: AxiosResponse = await axios({
					url: 'https://keepv.id/',
					method: 'POST',
					headers: {
						'User-Agent': ua
					}
				})
				const $: CheerioAPI = cheerio.load(res.data)
				const Sid: string = $('#page-top > main').find('script:nth-child(10)').html() || ''
				const data: AxiosResponse = await axios({
					url: 'https://keepv.id/',
					method: 'POST',
					headers: {
						'User-Agent': ua,
						cookie: res.headers['set-cookie'][0]
					},
					data: new URLSearchParams(Object.entries({ url: (regex.exec(url) as RegExpMatchArray)[0] , sid: Sid.split("'")[1].split("'")[0] }))
				})
				const ch: CheerioAPI = cheerio.load(data.data)
				const Format: IKeepYoutube = {
					link: ch('#moreOptions > h6:nth-child(3) > div > div:nth-child(1)').find('table:nth-child(2) > tbody > tr:nth-child(3) > td.text-right > a').attr('href') || '',
					size: ch('#moreOptions > h6:nth-child(3) > div > div:nth-child(1)').find('table:nth-child(2) > tbody > tr:nth-child(3) > td:nth-child(3)').text().trim()
				}
				return resolve(Format)
			} catch (err) {
				reject(err)
			}
		})
	}
	protected keepVideoMP4 = async (url: string): Promise <IKeepYoutube> => {
		return new Promise(async (resolve, reject) => {
			try {
				const regex: RegExp = /(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:watch\?.*(?:|\&)v=|embed\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/
				if (!regex.test(url)) return reject(new Error("URL null"))
				const ua: string = options.UserAgent()
				const res: AxiosResponse = await axios({
					url: 'https://keepv.id/',
					method: 'POST',
					headers: {
						'User-Agent': ua
					}
				})
				const $: CheerioAPI = cheerio.load(res.data)
				const Sid: string = $('#page-top > main').find('script:nth-child(10)').html() || ''
				const data: AxiosResponse = await axios({
					url: 'https://keepv.id/',
					method: 'POST',
					headers: {
						'User-Agent': ua,
						cookie: res.headers['set-cookie'][0]
					},
					data: new URLSearchParams(Object.entries({ url: (regex.exec(url) as RegExpMatchArray)[0], sid: Sid.split("'")[1].split("'")[0] }))
				})
				const ch: CheerioAPI = cheerio.load(data.data)
				const Format: IKeepYoutube = {
					link: ch('#moreOptions > h6:nth-child(3) > div > div:nth-child(2)').find('table > tbody > tr:nth-child(3) > td.text-right > a').attr('href') || '',
					size: ch('#moreOptions > h6:nth-child(3) > div > div:nth-child(2)').find('table > tbody > tr:nth-child(3) > td:nth-child(3)').text().trim()
				}
				return resolve(Format)
			} catch (err) {
				reject(err)
			}
		})
	}
	protected Yt1sAudio = async (url: string): Promise <IY1tS> => {
		return new Promise(async (resolve, reject) => {
			try {
				const regex: RegExp = /(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:watch\?.*(?:|\&)v=|embed\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/
				if (!regex.test(url)) return reject(new Error("URL null"))
				const ua: string = options.UserAgent()
				const data: AxiosResponse = await axios({
					url: 'https://yt1s.com/api/ajaxSearch/index',
					method: 'POST',
					headers: {
						'User-Agent': ua
					},
					data: new URLSearchParams(Object.entries({ q: url, vt: 'home' }))
				})
				const Format: IYtSFormat = {
					vid: data.data.vid,
					k: data.data.links.mp3.mp3128.k
				}
				const Upload: AxiosResponse = await axios({
					url: 'https://yt1s.com/api/ajaxConvert/convert',
					method: 'POST',
					headers: {
						'User-Agent': ua
					},
					data: new URLSearchParams(Object.entries(Format))
				})
				const convert: IY1tS = {
					link: Upload.data.dlink,
					quality: Upload.data.fquality,
					judul: Upload.data.title,
					type: Upload.data.ftype,
					size: data.data.links.mp3.mp3128.size
				}
				return resolve(convert)
			} catch (err) {
				return reject(err)
			}
		})
	}
	protected Yt1svVideo = async (url: string): Promise <IY1tS> => {
		return new Promise(async (resolve, reject) => {
			try {
				const regex: RegExp = /(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:watch\?.*(?:|\&)v=|embed\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/
				if (!regex.test(url)) return reject(new Error("URL null"))
				const ua: string = options.UserAgent()
				const data: AxiosResponse = await axios({
					url: 'https://yt1s.com/api/ajaxSearch/index',
					method: 'POST',
					headers: {
						'User-Agent': ua
					},
					data: new URLSearchParams(Object.entries({ q: url, vt: 'home' }))
				})
				const Format: IYtSFormat = {
					vid: data.data.vid,
					k: data.data.links.mp4['136'].k
				}
				const Upload: AxiosResponse = await axios({
					url: 'https://yt1s.com/api/ajaxConvert/convert',
					method: 'POST',
					headers: {
						'User-Agent': ua
					},
					data: new URLSearchParams(Object.entries(Format))
				})
				const convert: IY1tS = {
					link: Upload.data.dlink,
					quality: Upload.data.fquality,
					judul: Upload.data.title,
					type: Upload.data.ftype,
					size: data.data.links.mp4['136'].size
				}
				return resolve(convert)
			} catch (err) {
				return reject(err)
			}
		})
	}
	protected SnappeaVideo = async (url: string): Promise <ISnappea> => {
		return new Promise(async (resolve, reject) => {
			try {
				const regex: RegExp = /(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:watch\?.*(?:|\&)v=|embed\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/
				if (!regex.test(url)) return reject(new Error("URL null"))
				const data: AxiosResponse = await axios.get('https://api.snappea.com/v1/video/details?url=' + url)
				const Hasil = data.data.videoInfo.downloadInfoList.find((value: any) => value.formatExt == "mp4")
				if (!Hasil) return reject(new Error("Hasil Undefined"))
				const Format: ISnappea = {
					type: Hasil.formatExt,
					size: filesize(Hasil.size),
					link: Hasil.partList[0].urlList[0]
				}
				return resolve(Format)
			} catch (err) {
				return reject(err)
			}
		})
	}
	protected SnappeaAudio = async (url: string): Promise <ISnappea> => {
		return new Promise(async (resolve, reject) => {
			try {
				const regex: RegExp = /(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:watch\?.*(?:|\&)v=|embed\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/
				if (!regex.test(url)) return reject(new Error("URL null"))
				const data: AxiosResponse = await axios.get('https://api.snappea.com/v1/video/details?url=' + url)
				const Hasil = data.data.videoInfo.downloadInfoList.find((value: any) => value.formatAlias == "128k")
				if (!Hasil) return reject(new Error("Hasil Undefined"))
				const Format: ISnappea  = {
					type: Hasil.formatExt,
					size: filesize(Hasil.size),
					link: Hasil.partList[0].urlList[0]
				}
				return resolve(Format)
			} catch (err) {
				return reject(err)
			}
		})
	}
	protected Y2mateVid = async (url: string): Promise <IY2Mate> => {
		return new Promise(async (resolve, reject) => {
			try {
				const ytIdRegex: RegExp = /(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:watch\?.*(?:|\&)v=|embed\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/
				const ua: string = options.UserAgent()
				const Format: IFormatterY2MatePost = {
					url: url,
					q_auto: '0',
					ajax: '1'
				}
				const data: AxiosResponse = await axios({
					url: 'https://www.y2mate.com/mates/en12/downloader/ajax',
					method: 'POST',
					headers: {
						'User-Agent': ua
					},
					data: new URLSearchParams(Object.entries(Format))
				})
				const $: CheerioAPI = cheerio.load(data.data.result)
				const IdYt: RegExpExecArray | null = ytIdRegex?.exec(url)
				if (!IdYt) return reject(new Error("Id Yt null"))
				const convert:  IFormatterY2Mate = {
					type: 'youtube',
					_id: data.data.result.split(/var k__id = /)[1].split('; ')[0].replace(/"/gi, '')[1] as string,
					v_id: IdYt[1] as string,
					ajax: 1,
					token: '',
					ftype: 'mp4',
					fquality: '720p'
				}
				const Upload: AxiosResponse = await axios({
					url: 'https://www.y2mate.com/mates/convert',
					method: 'POST',
					headers: {
						'User-Agent': ua
					},
					data: new URLSearchParams(Object.entries(convert))
				})
				const ch: CheerioAPI = cheerio.load(Upload.data.result)
				const result: IY2Mate = {
					link: ch('div').find('a').attr('href') || '',
					thumb: $('div.thumbnail.cover').find('a > img').attr('src') || '',
					size: $('#mp4 > table > tbody > tr:nth-child(2) > td:nth-child(2)').text()
				}
				if (result.link.length < 55) return reject(new Error("Link invalid"))
				return resolve(result)
			} catch (err) {
				return reject(err)
			}
		})
	}
	public VideoMetadata = async (url: string): Promise <VideoMetadataResult> => {
		return new Promise (async (resolve, reject) => {
			let Id: RegExpExecArray | null | string = /(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:watch\?.*(?:|\&)v=|embed\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/.exec(url)
			if (!Id) return reject(new Error("Id undefined"))
			const result: VideoMetadataResult  = await ytSearch({ videoId: Id[1] })
			return resolve(result)
		})
	}
	public ParseVideoMetadataMP4 = async (data: VideoMetadataResult): Promise <YoutubePlay> => {
		return new Promise (async (resolve, reject) => {
			await this.keepVideoMP4(data.url).then((value: IKeepYoutube) => {
				let Format: YoutubePlay = {
					parseText: this.ParseTextYoutube({} as any, {
						...data,
						...value
					}, { id: data.videoId }),
					...data,
					...value
				}
				return resolve(Format)
			}).catch (async () => {
				await this.Yt1svVideo(data.url).then((value: IY1tS) => {
					let Format: YoutubePlay = {
						parseText: this.ParseTextYoutube({} as any, {
							...data,
							...value
						}, { id: data.videoId }),
						...data,
						...value
					}
					return resolve(Format)
				}).catch (async () => {
					await this.SnappeaVideo(data.url).then(async (value: ISnappea) => {
						let Format: YoutubePlay = {
							parseText: this.ParseTextYoutube({} as any, {
								...data,
								...value
							}, { id: data.videoId }),
							...data,
							...value
						}
						return resolve(Format)
					}).catch (async () => {
						await this.Y2mateVid(data.url).then(async (value: IY2Mate) => {
							let Format: YoutubePlay = {
								parseText: this.ParseTextYoutube({} as any, {
									...data,
									...value
								}, { id: data.videoId }),
								...data,
								...value
							}
							return resolve(Format)
						}).catch ((err) => {
							throw reject(err)
						})
					})
				})
			})
		})
	}
	public ParseVideoMetadataMP3 = async (data: VideoMetadataResult): Promise <YoutubePlay> => {
		return new Promise (async (resolve, reject) => {
			await this.keepVideoMP3(data.url).then((value: IKeepYoutube) => {
				let Format: YoutubePlay = {
					parseText: this.ParseTextYoutube({} as any, {
						...data,
						...value
					}, { id: data.videoId }),
					...data,
					...value
				}
				return resolve(Format)
			}).catch(async () => {
				await this.Yt1sAudio(data.url).then((value: IY1tS) => {
					let Format: YoutubePlay = {
						parseText: this.ParseTextYoutube({} as any, {
							...data,
							...value
						}, { id: data.videoId }),
						...data,
						...value
					}
					return resolve(Format)
				})
			}).catch(async () => {
				await this.SnappeaAudio(data.url).then((value: ISnappea) => {
					let Format: YoutubePlay = {
						parseText: this.ParseTextYoutube({} as any, {
							...data,
							...value
						}, { id: data.videoId }),
						...data,
						...value
					}
					return resolve(Format)
				}).catch (async () => {
					await this.Y2mateAud(data.url).then((value: IY2Mate) => {
						let Format: YoutubePlay = {
							parseText: this.ParseTextYoutube({} as any, {
								...data,
								...value
							}, { id: data.videoId }),
							...data,
							...value
						}
						return resolve(Format)
					}).catch((err) => {
						return reject(new Error(String(err)))
					})
				})
			})
		})
	}
	public YoutubePlayData = async (url: string, mp3: boolean): Promise <YoutubePlay> => {
		return new Promise (async (resolve, reject) => {
			const metadata: VideoMetadataResult = await this.VideoMetadata(url)
			if (mp3) {
				await this.ParseVideoMetadataMP3(metadata).then ((respon: YoutubePlay) => {
					respon.parseText = this.ParseTextYoutube({} as any, respon, { id: metadata.videoId, ytdl: false, mp3: true})
					return resolve(respon)
				}).catch((err) => {
					throw reject(err)
				})
			} else {
				await this.ParseVideoMetadataMP4(metadata).then((respon: YoutubePlay) => {
					respon.parseText = this.ParseTextYoutube({} as any, respon, { id: metadata.videoId, ytdl: false, mp3: false})
					return resolve(respon)
				}).catch((err) => {
					throw reject(err)
				})
			}
		})
	}
	public Y2mateAud = async (url: string): Promise <IY2Mate> => {
		return new Promise(async (resolve, reject) => {
			try {
				const ytIdRegex: RegExp = /(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:watch\?.*(?:|\&)v=|embed\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/
				const ua: string = options.UserAgent()
				const Format: IFormatterY2MatePost = {
					url: url,
					q_auto: '0',
					ajax: '1'
				}
				const data: AxiosResponse = await axios({
					url: 'https://www.y2mate.com/mates/en68/analyze/ajax',
					method: 'POST',
					headers: {
						'User-Agent': ua
					},
					data: new URLSearchParams(Object.entries(Format))
				})
				const $: CheerioAPI = cheerio.load(data.data.result)
				const IdYt: RegExpExecArray | null = ytIdRegex?.exec(url)
				if (!IdYt) return reject(new Error("Id Yt null"))
				const convert: { type: string, _id: string, v_id: string, ajax: number, token: string, ftype: string, fquality: string } | any = {
					type: 'youtube',
					_id: data.data.result.split(/var k__id = /)[1].split('; ')[0].replace(/"/gi, ''),
					v_id: IdYt[1],
					ajax: 1,
					token: '',
					ftype: 'mp3',
					fquality: '128'
				}
				const Upload: AxiosResponse = await axios({
					url: 'https://www.y2mate.com/mates/convert',
					method: 'POST',
					headers: {
						'User-Agent': ua
					},
					data: new URLSearchParams(Object.entries(convert))
				})
				const ch: CheerioAPI = cheerio.load(Upload.data.result)
				const result: IY2Mate = {
					link: ch('div').find('a').attr('href') || '',
					thumb: $('div.thumbnail.cover').find('a > img').attr('src') || '',
					size: $('#audio > table > tbody > tr:nth-child(1) > td:nth-child(2)').text()
				}
				if (result.link.length < 55) return reject(new Error("Link invalid"))
				return resolve(result)
			} catch (err) {
				return reject(err)
			}
		})
	}
	private ParseTextYoutube = (response: YoutubeDlCore, data?: YoutubePlay, options?:{ id?: string,ytdl?: boolean, mp3?: boolean}): string => {
		if (options?.ytdl) {
			let text: string = `
*╭────────────────*
*│「 𝐏𝐋𝐀𝐘 𝐘𝐎𝐔𝐓𝐔𝐁𝐄  」*
*╰────────────────*
							
*📬 ID :* ${options?.id}
*📜 Judul :* ${response.data.title}
*📍 Link :* ${response.data.video_url}
*⏱️ Durasi :* ${response.data.durasi}
*❤ Like :* ${response.data.like}
*🖤 Dislike :* ${response.data.dislike}
*🎁 Type :* ${response.data.format}
*🎞️ Penonton :* ${response.data.viewers}
*🎉 Rilis :* ${response.data.rilis}
*🎯 Ago :* ${response.data.ago}
*🛡️ Genre :* ${response.data.category}
*🎥 Channel :* ${response.data.channel}
*💡 Kualitas :* ${response.data.quality}
*⚖️ Ukuran :* ${response.data.size}
*📑 Deskripsi :* ${response.data.desk}
							
*╭─── ⟬ Play ${options.mp3 ? "MP3" : "MP4"} ⟭ ───*
*│ 🤖 Author : I` + ` am Ra*  
*╰───「 RA BOT 」───*`
        return text
		} else {
			let text: string = `
*╭────────────────*
*│「 𝐏𝐋𝐀𝐘 𝐘𝐎𝐔𝐓𝐔𝐁𝐄  」*
*╰────────────────*
			
*📬 ID :* ${data?.videoId}
*📜 Judul :* ${data?.title}
*📍 Link :* ${data?.url}
*⏱️ Durasi :* ${data?.duration}
*🎁 Type :* ${options?.mp3 ? "MP3" : "MP4"}}
*🎞️ Penonton :* ${data?.views}
*🛡️ Genre :* ${data?.genre}
*🎉 Rilis :* ${data?.uploadDate}
*⚖️ Ukuran :* ${data?.size}
*📑 Deskripsi :* ${data?.description}
			
*╭─── ⟬ Play ${options?.mp3 ? "MP3" : "MP4"}} ⟭ ───*
*│ 🤖 Author : I` + ` am Ra*  
*╰───「 RA BOT 」───*`
return text
		}
	}
}