import { LogLogin, getBuffer, getUrl,  Tunggu,  RandomName, Runtime, autoPath, UserAgent, RandomArray  } from "../functions/function";
import { Exec, convertToWebp, createWmSticker, stickerWhatsappFormatterWithCropped, WebpToGif, WebpToMp4, convertWebpNoCrop } from "../tools"
import {  FunctionMethod, ToolsMethod } from "../typings";
import { Ucapan } from "./static";
import {  createExif } from "./createExif";
import Triggered from "../tools/triggered";


const Functions: FunctionMethod  = {
	LogLogin,
	getBuffer,
	getUrl,
	Tunggu,
	RandomName,
	Runtime,
	Ucapan,
	autoPath,
	createExif,
	UserAgent,
	RandomArray
}
const Tools: ToolsMethod = {
	Exec,
	convertToWebp,
	createWmSticker,
	stickerWhatsappFormatterWithCropped,
	WebpToGif,
	WebpToMp4, 
	Triggered,
	convertWebpNoCrop
}
export const response: FunctionMethod | ToolsMethod = {
	...Functions,
	...Tools
}