import { loadImage, createCanvas, Image, Canvas, NodeCanvasRenderingContext2D } from "canvas";
import GIFEncoder from "gifencoder";
import * as fs from "fs";


// Thanks to Alen Saito
//
const Triggered = async function (path: string, outpath: string): Promise <string> {
	return new Promise (async (resolve, reject) => {
		const base: Image = await loadImage("./library/storage/polosan/triggered.png");
		const img: Image = await loadImage(path);
		const GIF: GIFEncoder = new GIFEncoder(256, 310);
		GIF.start()
		GIF.setRepeat(0)
		GIF.setDelay(15)
		const canvas: Canvas = createCanvas(256, 310)
		const ctx: NodeCanvasRenderingContext2D = canvas.getContext("2d")
		for (let i = 0; i < 9; i++) {
			ctx.clearRect(0, 0, 256, 310)
			ctx.drawImage(img, Math.floor(Math.random() * 20) - 20, Math.floor(Math.random() * 20) - 20, 256 + 20, 310 - 54 + 20);
			ctx.fillStyle = `#FF000033`;
			ctx.fillRect(0, 0, 256, 310);
			ctx.drawImage(base, Math.floor(Math.random() * 10) - 10, 310 - 54 + Math.floor(Math.random() * 10) - 10, 256 + 10, 54 + 10);
			GIF.addFrame(ctx);
		}
		GIF.finish();
		fs.writeFileSync(outpath, (GIF.out.getData()))
		if (fs.existsSync(path)) fs.unlinkSync(path)
		return resolve(outpath)
	})
}
export default Triggered;