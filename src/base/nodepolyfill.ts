//nodejs and electron polyfills for web api's
//commented out type info as that breaks webpack with optional dependencies

import { ImageData } from "./index";
import { clearPngColorspace } from "./imagedetect";

var requirefunction: null | ((mod: string) => any) = null;

/**
 * Call this function to let the libs require extra dependencies on nodejs in order
 * to polyfill some browser api's (mostly image compression/decompression)
 * `NodePolifill.polyfillRequire(require);` should solve most cases
 */
export function polyfillRequire(requirefn: (mod: string) => any) {
	requirefunction = requirefn;
}

export function requireSharp() {
	try {
		if (requirefunction) {
			return requirefunction("sharp");
		} else {
			return require(/* webpackIgnore: true */ "sharp");// as typeof import("sharp");
		}
	} catch (e) { }
	return null;
}

export function requireNodeCanvas() {
	//attempt to require sharp first, after loading canvas the module sharp fails to load
	requireSharp();
	try {
		if (requirefunction) {
			return requirefunction("canvas");
		} else {
			return require(/* webpackIgnore: true */ "canvas");// as typeof import("sharp");
		}
	} catch (e) { }
	return null;
}

export function requireElectronCommon() {
	try {
		if (requirefunction) {
			return requirefunction("electron/common");
		} else {
			return require(/* webpackIgnore: true */ "electron/common");
		}
	} catch (e) { }
	return null;
}

export function imageDataToDrawable(buf: ImageData) {
	let nodecnv = requireNodeCanvas();
	if (!nodecnv) { throw new Error("couldn't find built-in canvas or the module 'canvas'"); }
	return new nodecnv.ImageData(buf.data, buf.width, buf.height);
}

export function createCanvas(w: number, h: number) {
	let nodecnv = requireNodeCanvas();
	if (!nodecnv) { throw new Error("couldn't find built-in canvas or the module 'canvas'"); }
	return nodecnv.createCanvas(w, h) as any as HTMLCanvasElement;
}

function flipBGRAtoRGBA(data: Uint8ClampedArray | Uint8Array) {
	for (let i = 0; i < data.length; i += 4) {
		let tmp = data[i + 2];
		data[i + 2] = data[i + 0];
		data[i + 0] = tmp;
	}
}

export async function imageDataToFileBytes(buf: ImageData, format: "image/png" | "image/webp", quality?: any) {
	//use the electron API if we're in electron
	var electronCommon: any;
	var sharp: any;
	if (electronCommon = requireElectronCommon()) {
		let nativeImage = electronCommon.nativeImage;
		//need to copy the buffer in order to flip it without destroying the original
		let bufcpy = Buffer.from(buf.data.slice(buf.data.byteOffset, buf.data.byteLength));
		flipBGRAtoRGBA(bufcpy);
		let nativeimg = nativeImage.createFromBitmap(bufcpy, { width: buf.width, height: buf.height });
		return nativeimg.toPNG();
	}
	else if (sharp = requireSharp()) {
		let img = sharp(Buffer.from(buf.data.buffer), { raw: { width: buf.width, height: buf.height, channels: 4 } });
		if (format == "image/png") { img.png(); }
		else if (format == "image/webp") {
			var opts = { quality: 80 };
			if (typeof quality == "number") { opts.quality = quality * 100; }
			img.webp(opts)
		}
		else { throw new Error("unknown image format: " + format); }
		return await img.toBuffer({ resolveWithObject: false }).buffer;
	}
	throw new Error("coulnd't find build-in image compression methods or the module 'electron/common' or 'sharp'");
}

export function imageDataFromBase64(base64: string) {
	return imageDataFromBuffer(Buffer.from(base64, "base64"));
}

export async function imageDataFromBuffer(buffer: Uint8Array) {
	clearPngColorspace(buffer);
	//use the electron API if we're in electron
	var electronCommon: any;
	var nodecnv: any;
	if (electronCommon = requireElectronCommon()) {
		let nativeImage = electronCommon.nativeImage;
		let img = nativeImage.createFromBuffer(buffer);
		let pixels = img.toBitmap();
		let size = img.getSize();
		let pixbuf = new Uint8ClampedArray(pixels.buffer, pixels.byteOffset, pixels.byteLength);
		flipBGRAtoRGBA(pixbuf);
		return new ImageData(pixbuf, size.width, size.height);
	} else if (nodecnv = requireNodeCanvas()) {
		return new Promise<ImageData>((done, err) => {
			let img = new nodecnv.Image();
			img.onerror = err;
			img.onload = () => {
				var cnv = nodecnv.createCanvas(img.naturalWidth, img.naturalHeight);
				var ctx = cnv.getContext("2d")!;
				ctx.drawImage(img, 0, 0);
				var data = ctx.getImageData(0, 0, img.naturalWidth, img.naturalHeight);
				//use our own class
				done(new ImageData(data.data, data.width, data.height));
			}
			img.src = Buffer.from(buffer.buffer, buffer.byteOffset, buffer.byteLength);
		});
	}
	throw new Error("couldn't find built-in canvas, module 'electron/common' or the module 'canvas'");
}









