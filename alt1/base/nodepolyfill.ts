//nodejs and electron polyfills for web api's
//commented out type info as that breaks webpack with optional dependencies

import { ImageData } from "./index";
import { clearPngColorspace } from "./imagedetect";

declare var __non_webpack_require__: any;

function requireNodeCanvas() {
	if (typeof __non_webpack_require__ != "undefined") {
		//attempt to require sharp first, after loading canvas the module sharp fails to load
		try { requireSharp(); } catch (e) { }
		return __non_webpack_require__("canvas");// as typeof import("canvas");
	}
	throw new Error("couldn't find built-in canvas or the module 'canvas'");
}

function requireSharp() {
	if (typeof __non_webpack_require__ != "undefined") {
		return __non_webpack_require__("sharp");// as typeof import("sharp");
	}
	throw new Error("coulnd't find build-in image compression methods or the module 'sharp'");
}

function requireElectronCommon() {
	if (typeof __non_webpack_require__ != "undefined") {
		return __non_webpack_require__("electron/common");
	}
	throw new Error("could not load module electron/common");
}

export function imageDataToDrawable(buf: ImageData) {
	let nodecnv = requireNodeCanvas();
	return new nodecnv.ImageData(buf.data, buf.width, buf.height);
}

export function createCanvas(w: number, h: number) {
	var nodecnv = requireNodeCanvas();
	return nodecnv.createCanvas(w, h) as any as HTMLCanvasElement;
}

function flipBGRAtoRGBA(data: Uint8ClampedArray | Uint8Array) {
	for (let i = 0; i < data.length; i += 4) {
		let tmp = data[i + 2];
		data[i + 2] = data[i + 0];
		data[i + 0] = tmp;
	}
}

export function showImageData(img: ImageData) {
	let nativeImage = requireElectronCommon().nativeImage;
	//need to copy the buffer in order to flip it without destring the original
	let buf = Buffer.from(img.data.slice(img.data.byteOffset, img.data.byteLength));
	flipBGRAtoRGBA(buf);
	let nativeimg = nativeImage.createFromBitmap(buf, { width: img.width, height: img.height });
	return nativeimg.toPNG();
}

export async function imageDataToFileBytes(buf: ImageData, format: "image/png" | "image/webp", quality?: any) {
	var sharp = requireSharp();
	var img = sharp(Buffer.from(buf.data.buffer), { raw: { width: buf.width, height: buf.height, channels: 4 } });
	if (format == "image/png") { img.png(); }
	else if (format == "image/webp") {
		var opts = { quality: 80 };
		if (typeof quality == "number") { opts.quality = quality * 100; }
		img.webp(opts)
	}
	else { throw new Error("unknown image format: " + format); }
	return await img.toBuffer({ resolveWithObject: false }).buffer;
}

export function imageDataFromBase64(base64: string) {
	var buffer = Buffer.from(base64, "base64");
	return new Promise<ImageData>((done, error) => {
		clearPngColorspace(buffer);
		//use the electron API if we're in electron
		var electronCommon: any = null;
		try { electronCommon = requireElectronCommon(); }
		catch (e) { }
		if (electronCommon) {
			let nativeImage = electronCommon.nativeImage;
			let img = nativeImage.createFromBuffer(buffer);
			let pixels = img.toBitmap();
			let size = img.getSize();
			done(new ImageData(new Uint8ClampedArray(pixels.buffer, pixels.byteOffset, pixels.byteLength), size.width, size.height));
		} else {
			//fallback to node-canvas
			var nodecnv = requireNodeCanvas();
			let img = new nodecnv.Image();
			img.onerror = error;
			img.onload = () => {
				var cnv = nodecnv.createCanvas(img.naturalWidth, img.naturalHeight);
				var ctx = cnv.getContext("2d")!;
				ctx.drawImage(img, 0, 0);
				var data = ctx.getImageData(0, 0, img.naturalWidth, img.naturalHeight);
				//use our own class
				done(new ImageData(data.data, data.width, data.height));
			}
			img.src = Buffer.from(buffer.buffer, buffer.byteOffset, buffer.byteLength);
		}
	});
}









