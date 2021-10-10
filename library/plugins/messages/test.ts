export var Example: void = globalThis.Client.open("test-Owner", (data): string | void => {
	//console.log("Ini owner")
	//return "test owner"
}, { isOwner: true })

export var Example2: void = globalThis.Client.open("testing", (data): string | void => {
    //console.log("ini chat group")
    //return "testing"
}, { isGroupMsg: true})