import { exec, ExecException } from "child_process";


export const Exec = async (code: string): Promise <string> => {
	return new Promise (async (resolve, reject) => {
		await exec(code, (err: ExecException | null, done: string) => {
			if (err) return reject(err);
			return resolve(done)
		})
	})
}