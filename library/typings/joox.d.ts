export interface ArtisList {
	id: string;
	name: string;
}
export interface JooxImages {
	width: number;
	height: number;
	url: string;
}
export interface Joox {
	album_id: string;
	id: string;
	name: string;
	album_name: string;
	artist_list: ArtisList[];
	play_duration: number;
	images: JooxImages[];
	vip_flag: number;
	is_playable: boolean;
	track_free_action_control: number;
}
export declare class JooxAll {
	item_list: JooxItems [];
	section_type: number;
    section_title: string;
}
export interface JooxItems {
	type: number;
	song: SongInfo[];
}
export interface SongInfo {
	song_info: Joox;
	lyric: string;
}
export interface JooxThumbnail {
	width: number;
	height: number;
	url: string;
}
export interface AlbumJoox {
	id: string;
	album_url: string;
	country: string;
	encodeSongId: string;
}
export interface DownloaderJoox {
	mp3: string;
	m4a: string;
	r192: string;
	r320: string;
}
export declare interface JooxDown {
	url: string;
	size: string
}

export declare class jooxPlayMusic {
	id: string;
	title: string;
	artist: string;
	thumbnail: JooxThumbnail
	publikasi: string;
	language: string;
	durasi: number;
	quality:  JooxKBPSMap;
	down: DownloaderJoox;
}
export declare class SeachResultJoox {
	id: string;
	title: string;
	album: string;
	durasi: number;
	artis: string;
	thumb: string
}
export declare class ImgThumbJoox {
	width: number;
	height: number;
	url: string;
}

export declare interface JooxInterfaceDown {
	album_url: string;
	code: number;
	country: string;
	encodeSongId: string;
	express_domain: string;
	flag: number;
	gososo: number;
	has_hifi: boolean;
	has_hq: boolean;
	has_preview: number;
	imgSrc: string;
	kbps_map: string;
	ktrack_id: number;
	m4aUrl: string;
	malbum: string;
	malbumid: number;
	malbummid: string;
	minterval: number;
	mmid: string;
	mp3Url: string;
	msg: string;
	msinger: string;
	msingerid: number;
	msingermid: string;
	msize: number;
	msong: string;
	public_time: string;
	r192Url: string;
	r320Url: string;
	singer_list: SingerListJoox[],
	size128: number;
	size320: number;
	songInfoMid: string;
	songmid: string;
	source_id: number;
	subscript: any[];
	track_label_flag: number;
	web_fully_play: number;
  }

export interface SingerListJoox {
	id: number;
	name: string;
}

export interface JooxKBPSMap {
	128: number;
	192: number;
	24: number;
	320: number;
	48: number;
	96: number;
	ape: number;
	flac: number;
}