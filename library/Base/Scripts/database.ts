import * as fs from "fs";


export default class Database {
	private Base: string = "./library/database/";
	private File: string | undefined;
	public database: any
	constructor (private className: string) {
		if (!fs.existsSync(className)) fs.writeFileSync(this.Base + className + ".json", JSON.parse(JSON.stringify([], null, 2)))
		this.File = this.Base + className + ".json";
		this.database = (fs.existsSync(this.File)) ? JSON.parse(fs.readFileSync(this.File).toString()) : []
	}
	public findOneById = (id: string): any => {
		if (!this.checkId(id)) return;
		return this.database.find((values: any) => values.id === id)
	}
	public checkId: (id: string) => boolean =  (id: string): boolean => {
		let status: boolean;
		if (this.database.find((values: any) => values.id === id)) {
			status = true
		} else {
			status = false
		}
		return status
	}
	public findOneAndUpdate = (id: string, update: any) =>{
		if (!this.checkId(id)) return;
		this.database[this.database.findIndex((values: any) => values.id)] = 
	}
}