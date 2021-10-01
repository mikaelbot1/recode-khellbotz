import { Eval,  Execute } from "./eval";
import { Menu, Owner } from "./menu";
import { Sticker } from "./sticker";
import { Tomp3 } from "./converter";
import { YtSearch } from "./youtube";
import { MultiPrefix } from "./prefix";
import { Tiktokstalk } from "./tiktok";
import { SearchJoox } from "./joox";
import { googleSearch } from "./google"

// Export 1 aja Bro perwakilan soalnya klo gada di satuin error
// Muewehehe
export function onPattern (): void {
	Eval
	Menu
	Sticker
	Execute
	Owner
	Tomp3
	YtSearch
	MultiPrefix
	Tiktokstalk
	SearchJoox
	googleSearch
}