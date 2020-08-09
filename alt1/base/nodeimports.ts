//keep the nastyness in one file
//TODO this used to be nastier, can probly inline it again

export function requireNodeFetch() {
	return require("node-fetch") as typeof fetch;
}

export function requireNodeCanvas() {
	return require("canvas") as typeof import("canvas");
}

export function requireSharp() {
	return require("sharp") as typeof import("sharp");
}