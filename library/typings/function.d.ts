export declare class FunctionMethod {
	LogLogin: () => void;
	getBuffer: (url: string) => Promise<Buffer>;
	getUrl: (Link: string) =>  RegExpMatchArray | null;
	Tunggu: (ms: number) => Promise <unknown>;
	RandomName: (jumlah: number) => string;
	Runtime: (second: number) => string
	Ucapan: () => string
}
export declare class ToolsMethod {
	Exec: (code: string) => Promise <string>
}
export declare class Formatter {
	LogLogin: () => void;
	getBuffer: (url: string) => Promise<Buffer>;
	getUrl: (Link: string) =>  RegExpMatchArray | null;
	Tunggu: (ms: number) => Promise <unknown>;
	RandomName: (jumlah: number) => string;
	Exec: (code: string) => Promise <string>
	Runtime: (second: number) => string
	Ucapan: () => string
}