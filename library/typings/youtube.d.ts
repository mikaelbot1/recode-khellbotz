export declare class YoutubeDlCore {
	status: number
	data: {
		title: string
		quality: string
		size: string
		format: string
		down: string
		like: number
		dislike: number
		viewers: number
		category: string
		rilis: string
		video_url: string
		channel: string
		durasi: string | number
		thumbnail: string | undefined
		desk: string | null
		ago?: string;
		publikasi?: string;
		parseText?: string;
	}
}
export declare interface IKeepYoutube {
	link: string;
	size: string;
}

export interface IY1tS {
	link: string, 
	quality: string, 
	judul: string, 
	type: string, 
	size: string
}

export interface IYtSFormat {
	vid: string;
	k: string;
}
export declare interface ISnappea {
	type: string;
	size: string;
	link: string;
}

export declare interface IY2Mate { 
	link: string; 
	thumb: string;
	size: string
}

export declare interface IFormatterY2Mate { 
	type: string;
	_id: string;
	v_id: string;
	ajax: number;
	token: string;
	ftype: string;
	fquality: string
}

export declare interface IFormatterY2MatePost { 
	url: string; 
	q_auto: string;
	ajax: string
}

export declare class YoutubePlay {
	title: string;
	description: string;
	url: string;
	videoId: string;
	seconds: number;
	timestamp: string;
	duration: Duration;
	views: number;
	genre: string;
	uploadDate: string;
	ago: string;
	image: string;
	thumbnail: string;
	author: author;
	link?: string; 
	thumb?: string; 
	size?: string;
	parseText?: string;
}
interface Duration {
	seconds: number;
	timestamp: string;
	toString: () => string;
}
interface author {
	name: string;
	url: string;
}