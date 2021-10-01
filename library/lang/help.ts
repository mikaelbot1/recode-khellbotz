export default class LanguageHelp {
	constructor(public prefix: string | undefined) {}
	public HelpSticker =  (): string  => {
		return `Fitur ini akan dapat di gunakan untuk mengubah media menjadi sticker atau juga bisa di gunakan untuk mengubah watermark sticker

*Contoh Hasil :* https://bit.ly/39026d3 (Hasil Bisa kamu lihat seperti Gambar ini atau kunjungi link berikut )

*Contoh Penggunaan :*

*-* ${this.prefix}sticker (kirim atau reply media dengan caption untuk membuat sticker)
*-* ${this.prefix}sticker Punya RA (kirim atau reply media dengan caption untuk membuat sticker dengan costum watermark)
*-* ${this.prefix}sticker Ini WM RA (reply Sticker yang ingin di ubah watermarknya)

*Media support :*

- Image
- Video / Gif
- Document image/ Document Video
- Sticker Image/ Gif

*Perintah terkait*: (Perintah terkait ini kamu juga bisa menggunakan command lain)

*-* ${this.prefix}sticker
*-* ${this.prefix}s
*-* ${this.prefix}stiker
*-* ${this.prefix}stickergif
*-* ${this.prefix}stikergif
*-* ${this.prefix}sgif

*NOTES :*

- _Fitur ini dapat digunakan untuk membuat sticker atau mengubah watermark Sticker_

- _Fitur ini dapat di gunakan oleh semua orang jika bot aktif_

- _*DILARANG* menggunakan perintah ini untuk pornograpi/rasisme/ yang berkaitan dengan sesuatu yang bersifat sensitif atau sesuatu yang bersifat kejahatan_

- _Jika tetap melanggar bot tidak segan memblokir nomer anda dan melakukan banned_

- _Perintah terkait Adalah command yang saling berhubungan beberapa tidak dimasukkan kedalam menu_
`
	}
	public HelpStickerTrigger: string = `Fitur ini dapat di gunakan untuk membuat Gambar / Sticker menjadi sticker triggered. Tetapi fitur ini belum support untuk media Video / Sticker Gif.


*Contoh Penggunaan :*

*-* ${this.prefix}trigger (kirim Gambar atau Reply Gambar  dengan caption untuk membuat sticker Triggered)
*-* ${this.prefix}trigger (Reply Sticker Image <Bukan Sticker Gif> dengan caption untuk membuat Sticker Triggered)

*Media support :*

- Image / Gambar
- Sticker Image / Sticker Gambar

*Perintah terkait*: (Perintah terkait ini kamu juga bisa menggunakan command lain)

*-* ${this.prefix}strigger
*-* ${this.prefix}trigger
*-* ${this.prefix}triggered
*-* ${this.prefix}stickertriggered
*-* ${this.prefix}stikertriggered

*NOTES :*

- _Fitur ini dapat digunakan untuk mengubah media menjadi Sticker Trigger_

- _Fitur ini dapat di gunakan oleh semua orang jika bot aktif_

- _*DILARANG* menggunakan perintah ini untuk pornograpi/rasisme/ yang berkaitan dengan sesuatu yang bersifat sensitif atau sesuatu yang bersifat kejahatan_

- _Jika tetap melanggar bot tidak segan memblokir nomer anda dan melakukan banned_

- _Perintah terkait Adalah command yang saling berhubungan beberapa tidak dimasukkan kedalam menu_
`
}