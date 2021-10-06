import Jimp from "jimp";
import * as fs from "fs";
import  { autoPath} from "../functions/function";


export const CreateImageToCircle = async (input: string): Promise <string> => {
	return new Promise (async (resolve, reject) => {
		const Input: Promise <Jimp> = Jimp.read(input);
		const output: string = autoPath("png");
		Promise.all([Input]).then(function (images) {
			const lenna: Jimp = images[0];
			lenna
			.circle()
			.background(0)
			.resize(256, Jimp.AUTO).write(output, (err) => {
				if (err) {
					if (fs.existsSync(input)) fs.unlinkSync(input);
					if (fs.existsSync(output)) fs.unlinkSync(output);
					return reject(err)
				} else {
					if (fs.existsSync(input)) fs.unlinkSync(input);
					return resolve(output)
				}
			});
		})
	})
}
