export declare interface IRegister {
	id: string;
	status: boolean;
	hit: number;
	multi: boolean;
	prefix: string;
	simple: boolean;
}

export declare interface IStickerCmd {
	id: string;
	cmd: ICmdSticker[]
}
export declare interface ICmdSticker {
	id: string;
	command: string;
}