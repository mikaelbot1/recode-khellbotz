import ApiConverter from "./converter";
import { Formatter } from "../../typings";
import axios, { AxiosStatic } from "axios";
import Cheerio, { CheerioAPI } from "cheerio";
import IGot, { Got } from "got";
import Form from "form-data";

export default class CreateApi extends ApiConverter{
	constructor () {
		super();
	}
	public Axios: AxiosStatic = axios;
	public cheerio: CheerioAPI = Cheerio;
	public got: Got = IGot;
	public FormData = Form;
}