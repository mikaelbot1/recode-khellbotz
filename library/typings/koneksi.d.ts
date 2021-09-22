export interface getClientVersion {
	isBroken: boolean
	isBelowSoft: boolean,
	isBelowHard: boolean
	hardUpdateTime: number
	beta: any | null,
	currentVersion: `${number}.${number}.${number}`
}