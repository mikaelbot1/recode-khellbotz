import { LogLogin, getBuffer, getUrl,  Tunggu,  RandomName, Runtime } from "../functions/function";
import { Exec } from "../tools"
import {  FunctionMethod, ToolsMethod } from "../typings";
import { Ucapan } from "./static"


const Functions: FunctionMethod  = {
	LogLogin,
	getBuffer,
	getUrl,
	Tunggu,
	RandomName,
	Runtime,
	Ucapan
}
const Tools: ToolsMethod = {
	Exec
}
export const response: FunctionMethod | ToolsMethod = {
	...Functions,
	...Tools
}