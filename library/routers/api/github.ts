import axios, { AxiosResponse } from "axios";
import { GhStalk, GhSearch, GithubSearchItems   } from "../../typings";
import { RandomArray } from "../../functions/function";
import StickerCreate from "./sticker";

// Sumber https://api.github.com/
//
//
export default class Github extends StickerCreate {
	constructor () {
		super()
	}
	public GithubStalk = async (username: string): Promise <GhStalk|null> => {
		return new Promise (async (resolve, reject) => {
			await axios.get("https://api.github.com/users/" + username).then(({ data }) => {
				if (/not found/i.test(data.message)) return resolve(null)
				return resolve(data as GhStalk)
			}).catch((err) => reject(err))
		})
	}
	public GithubSearchRepo = async (querry: string, random?: boolean, limit?: number): Promise <GhSearch> => {
		return new Promise (async (resolve, reject) => {
			let getLimit: string = limit ? "&per_page=" + limit : "&per_page=" + 25;
			try {
				let data: GhSearch = (await axios.get(encodeURI(`https://api.github.com/search/users?q=${querry}${getLimit}`)) as AxiosResponse).data;
				if (random) data.items =  RandomArray(data.items) as GithubSearchItems[]
				return resolve(data)
			} catch (err) {
				return reject(err)
			}
		})
	}
}