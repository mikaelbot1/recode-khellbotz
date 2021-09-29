import { HandlingData } from '../typings';
import { ClientMessage } from '../Base/Scripts/client';
import { VideoSearchResult } from "yt-search";


export var YtSearch: void = globalThis.Client.on("ytsearch", async (data: HandlingData, Cli: ClientMessage) => {
	const { from, id, args } = data;
	const { YoutubeSearch } = data.createAPI;
	const result: VideoSearchResult[] = await YoutubeSearch(args.join(" "))
	if (!result[0]) return void Cli.reply(from, "*「❗」* Mohon maaf kak, pencarian youtube kakak tidak ditemukan", id)
	let text: string = `ㅤㅤㅤㅤ  *「 YOUTUBE SEARCH 」*\n\n`
	let count: number = 1;
	for (let hasil of result) {
		text += `\n
*${count++}. 📚 Judul :* ${hasil.title}
*🌐 Id :* ${hasil.videoId}
*💫 Url :* ${hasil.url}
*🕧 Durasi :* ${hasil.timestamp}
*🤖 Publish :* ${hasil.ago ?? "Tidak terdeteksi"}
*👁‍🗨 Penonton :* ${hasil.views}
*💌 Channel :* ${hasil.author.name}\n`
	}
	await Cli.sendFile(from, result[0].thumbnail || result[0].image, { quoted: id, caption: text })
}, { event: ["ytsearch <judul>"], command: ["ytsearch", "yts"], tag: "search", isQuerry: true })

export var play: void = globalThis.Client.on("play", async (data: HandlingData, Cli: ClientMessage) => {
	const { from, id, args, createAPI } = data;
	var { YoutubeSearch, ParseVideoMetadataMP3 , VideoMetadata, ytdlCore, YoutubePlayData } = createAPI;
	const regex: RegExp = /(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:watch\?.*(?:|\&)v=|embed\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/
	const getId: RegExpExecArray | null = regex.exec(args.join(" "))
	return void await ytdlCore(getId ? getId[0] : (await YoutubeSearch(args.join(" ")))[0].url, !(/^(mp4)/.test(args[0]))).then(async (response) => {
		await Cli.sendFile(from, response.data.thumbnail as string, { caption: response.data.parseText, quoted: id })
		if (/^(mp4)/i.test(args[0])) {
			if (/(gb)/gi.test(String(response.data.size)) || Number(String(response.data.size).split(" MB")[0]) >= 50 && /(mb)/gi.test(String(response.data.size))) return void Cli.reply(from, `*「❗」* Mohon maaf kak ukuran media kakak ${response.data.size} terlalu besar untuk dikirimkan bot, batas maksimal size fitur Youtube Play MP4 adalah 50 MB. Kaka bisa download manual di link berikut : ${(await ParseVideoMetadataMP3((await VideoMetadata(response.data.video_url))))}`, id)
			return void await Cli.sendFile(from, response.data.down, { quoted: id })
		} else {
			if (/(gb)/gi.test(String(response.data.size)) || Number(String(response.data.size).split(" MB")[0]) >= 15 && /(mb)/gi.test(String(response.data.size))) return void Cli.reply(from, `*「❗」* Mohon maaf kak ukuran media kakak ${response.data.size} terlalu besar untuk dikirimkan bot, batas maksimal size fitur Youtube Play MP3 adalah 15 MB. Kaka bisa download manual di link berikut : ${(await ParseVideoMetadataMP3((await VideoMetadata(response.data.video_url))))}`, id)
			return void await Cli.client.sendMessage(from, { url: response.data.down }, Cli.Type.audio, { quoted: id, contextInfo: {
				externalAdReply: {
					title: "👾 PLAY MP3 👾",
					body: "RA BOT",
					mediaUrl: response.data.video_url,
					mediaType: 2,
					thumbnail: (await Cli.respon.getBuffer (response.data.thumbnail as string))
				}
			}})
		}
	}).catch(async () => {
		return void await YoutubePlayData(getId ? getId[0] : (await YoutubeSearch(args.join(" ")))[0].url, !(/^(mp4)/.test(args[0]))).then(async (response) => {
			if (/^(mp4)/i.test(args[0])) {
				if (/(gb)/gi.test(String(response.size)) || Number(String(response.size).split(" MB")[0]) >= 50 && /(mb)/gi.test(String(response.size))) return void Cli.reply(from, `*「❗」* Mohon maaf kak ukuran media kakak ${response.size} terlalu besar untuk dikirimkan bot, batas maksimal size fitur Youtube Play MP4 adalah 50 MB. Kaka bisa download manual di link berikut : ${response.link}`, id)
				return void await Cli.sendFile(from, String(response.link), { quoted: id })
			} else {
				if (/(gb)/gi.test(String(response.size)) || Number(String(response.size).split(" MB")[0]) >= 15 && /(mb)/gi.test(String(response.size))) return void Cli.reply(from, `*「❗」* Mohon maaf kak ukuran media kakak ${response.size} terlalu besar untuk dikirimkan bot, batas maksimal size fitur Youtube Play MP3 adalah 15 MB. Kaka bisa download manual di link berikut : ${response.link}`, id)
				return void await Cli.client.sendMessage(from, { url: String(response.link) }, Cli.Type.audio, { quoted: id, contextInfo: {
					externalAdReply: {
						title: "👾 PLAY MP3 👾",
						body: "RA BOT",
						mediaUrl: response.url,
						mediaType: 2,
						thumbnail: (await Cli.respon.getBuffer (response.thumbnail as string))
					}
				}})
			}
		}).catch (() => {
			return void Cli.reply(from, "*「❗」* Mohon maaf kak hasil pencarian youtube anda error / kosong harap ganti media lain", id)
		})
	})
}, { event: ["play mp4 <judul/url>", "play mp3 <judul/url>", "play <judul/url>"], command: ["play"], tag: "musik" })

export var ytmp4: void = globalThis.Client.on("ytmp4", async (data: HandlingData, Cli: ClientMessage) => {
	const { from, id, createAPI, args } = data;
	var { ParseVideoMetadataMP4, VideoMetadata,  YoutubeSearch } = createAPI;
	const regex: RegExp = /(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:watch\?.*(?:|\&)v=|embed\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/
	const getId: RegExpExecArray | null = regex.exec(args.join(" "));
	return void await ParseVideoMetadataMP4(await VideoMetadata(getId ? getId[0] : (await YoutubeSearch(args.join(" ")))[0].url)).then(async (response) => {
		await Cli.sendFile(from, response.thumbnail, { quoted: id, caption: String(response.parseText)})
		if (/(gb)/gi.test(String(response.size)) || Number(String(response.size).split(" MB")[0]) >= 50 && /(mb)/gi.test(String(response.size))) return void Cli.reply(from, `*「❗」* Mohon maaf kak ukuran media kakak ${response.size} terlalu besar untuk dikirimkan bot, batas maksimal size fitur Youtube Play MP4 adalah 50 MB. Kaka bisa download manual di link berikut : ${response.link}`, id)
		return void await Cli.sendFile(from, String(response.link), { quoted: id })
	}).catch(() => {
		return void Cli.reply(from, "*「❗」* Mohon maaf kak, pencarian youtube kakak tidak ditemukan", id)
	})
}, { event: ["ytmp4 <Judul/url>"], command: ["ytmp4", "youtubemp4", "ytv"], tag: "musik"})

export var ytmp3: void = globalThis.Client.on("ytmp3", async (data: HandlingData, Cli: ClientMessage) => {
	const { from, id, createAPI, args } = data;
	var { ParseVideoMetadataMP3, VideoMetadata,  YoutubeSearch } = createAPI;
	const regex: RegExp = /(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:watch\?.*(?:|\&)v=|embed\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/
	const getId: RegExpExecArray | null = regex.exec(args.join(" "));
	return void await ParseVideoMetadataMP3(await VideoMetadata(getId ? getId[0] : (await YoutubeSearch(args.join(" ")))[0].url)).then(async (response) => {
		await Cli.sendFile(from, response.thumbnail, { quoted: id, caption: String(response.parseText)})
		if (/(gb)/gi.test(String(response.size)) || Number(String(response.size).split(" MB")[0]) >= 15 && /(mb)/gi.test(String(response.size))) return void Cli.reply(from, `*「❗」* Mohon maaf kak ukuran media kakak ${response.size} terlalu besar untuk dikirimkan bot, batas maksimal size fitur Youtube Play MP4 adalah 15 MB. Kaka bisa download manual di link berikut : ${response.link}`, id)
		return void await Cli.sendFile(from, String(response.link), { quoted: id })
	}).catch(() => {
		return void Cli.reply(from, "*「❗」* Mohon maaf kak, pencarian youtube kakak tidak ditemukan", id)
	})
}, { event: ["ytmp3 <Judul/url>"], command: ["ytmp3", "youtubemp3"], tag: "musik", isQuerry: true })