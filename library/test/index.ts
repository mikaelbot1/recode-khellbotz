import axios, { AxiosProxyConfig} from "axios";
import cheerio from "cheerio";
import { JSDOM, ResourceLoader  } from "jsdom";
import * as fs from "fs"
import { UserAgent } from '../functions/function';
import { config } from "dotenv";


(async () => {
	config( { path: "./.env"})
	let Proxy: AxiosProxyConfig = JSON.parse(fs.readFileSync("./app.json").toString()) as AxiosProxyConfig;
	let Url =  "https://www.deviceinfo.me/";
	const dom = new JSDOM((await axios({
		url:Url,
		method: "GET",
		headers: {
			"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36",
			"accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
			"accept-language": "en-US,en;q=0.9,id;q=0.8",
			"cache-control": "max-age=0",
			"pragma": "akamai-x-cache-on, akamai-x-cache-remote-on, akamai-x-check-cacheable, akamai-x-get-cache-key, akamai-x-get-extracted-values, akamai-x-get-ssl-client-session-id, akamai-x-get-true-cache-key, akamai-x-serial-no, akamai-x-get-request-id,akamai-x-get-nonces,akamai-x-get-client-ip,akamai-x-feo-trace",
			"sec-ch-ua": "\"Google Chrome\";v=\"93\", \" Not;A Brand\";v=\"99\", \"Chromium\";v=\"93\"",
			"sec-ch-ua-mobile": "?0",
			"sec-ch-ua-platform": "\"Windows\"",
			"sec-fetch-dest": "document",
			"sec-fetch-mode": "navigate",
			"sec-fetch-site": "none",
			"sec-fetch-user": "?1",
			"upgrade-insecure-requests": "1",
			"cookie": "1=1"
		}
	})).data, {
		url: Url,
		runScripts: "dangerously",
		resources: new ResourceLoader()
	})
	dom.window.onerror = (err) => {
		console.log("Error :" + err)
	}
	dom.window.addEventListener("error", (er) => console.log(er))
	Object.defineProperty(dom.window, "matchMedia", {
		value: () => ({
			matches: false,
			addListener: () => {},
			removeListener: () => {}
		})
	})
	Object.defineProperty(dom.window, "crypto", {
		value: {
			getRandomValues: () => [1, 2, 3]
		}
	})
	Object.defineProperty(dom.window, "requestAnimationFrame", {
		value: (callback: () => void) => {
			setTimeout(callback, 0)
		}
	})
	Object.defineProperty(dom.window, "IntersectionObserver", {
		value: class {
			observer() {}
		}
	})
	dom.window.addEventListener("click", () => {
		setTimeout(() => {
		}, 4000)
	})
	dom.window.addEventListener("load", () => {
		setTimeout(() => {
			console.log(dom.serialize())
			dom.window.close()
		}, 4000)
	})
})()