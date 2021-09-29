import axios, { AxiosProxyConfig} from "axios";
import cheerio from "cheerio";
import { JSDOM, ResourceLoader  } from "jsdom";
import * as fs from "fs"
import { UserAgent } from '../functions/function';
import { config } from "dotenv";


(async () => {
	config( { path: "./.env"})
})()
