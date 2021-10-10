export declare class ImageStickerOpenWa {
	image: string;
	stickerMetadata: IStickerMetadata;
	sessionInfo: ISessionInfoOpenWa;
	config: IConfigOpenWa;
}

export declare class VideoStickerOpenWa {
	file: string;
	processOptions: ProcessOptionsOpenWa;
	stickerMetadata: IStickerMetadata;
	sessionInfo: ISessionInfoOpenWa;
	config: IConfigOpenWa;
}

export declare interface ProcessOptionsOpenWa {
	crop: boolean;
	fps: number;
	startTime: string;
	endTime: string;
	loop: number;
}

export declare interface IConfigOpenWa {
	sessionId: string;
	headless: boolean;
	qrTimeout: number;
	authTimeout: number;
	cacheEnabled: boolean;
	useChrome: boolean;
	killProcessOnBrowserClose: boolean;
	throwErrorOnTosBlock: boolean;
	chromiumArgs: string[];
	executablePath: string;
	skipBrokenMethodsCheck: boolean;
	stickerServerEndpoint: boolean;
}

export declare interface ISessionInfoOpenWa {
	WA_VERSION: string;
	PAGE_UA: string;
	WA_AUTOMATE_VERSION: string;
	BROWSER_VERSION: string;
	OS: string;
	START_TS: number;
	NUM: string;
	LAUNCH_TIME_MS: number;
	PHONE_VERSION: string;
}

export declare interface IStickerMetadata {
	author?: string;
	pack?: string;
	keepScale?: boolean;
	removebg?: string;
	circle?: boolean;
}