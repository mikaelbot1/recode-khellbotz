(async () => {
	const RegPost: RegExpExecArray | null= /(?:http(?:s|):\/\/|)(?:www\.|)instagram.com\/s\/([0-9A-Za-z]{5,50})\?story_media_id=([-_0-9A-Za-z]{5,50})/gi.exec("https://www.instagram.com/s/aGinajsdkasdkadksadasdaskdkladk?story_media_id=23913913239193193913193&utm_medium")
	console.log(RegPost)
})()