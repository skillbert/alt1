//keep the nastyness in one file
//TODO this used to be nastier, can probly inline it again
//commented out type info as that breaks webpack with optional dependencies

declare var __non_webpack_require__: any;

export function requireNodeCanvas() {
	if (typeof __non_webpack_require__ != "undefined") {
		try { requireSharp(); } catch (e) { }
		return __non_webpack_require__("canvas");// as typeof import("canvas");
	}
	throw new Error("couldn't find built-in canvas or the module 'canvas'");
}

export function requireSharp() {
	if (typeof __non_webpack_require__ != "undefined") {
		return __non_webpack_require__("sharp");// as typeof import("sharp");
	}
	throw new Error("coulnd't find build-in image compression methods or the module 'sharp'");
}