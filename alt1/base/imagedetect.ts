import { ImgRef, ImgRefBind } from "./imgref";
import * as wapper from "./wrapper";
import { ImageData as ImageDataFill } from "./imagedata-extensions";

declare var __non_webpack_require__;
/**
* Downloads an image and returns the ImageData
* Make sure the png image does not have a sRGB chunk or the resulting pixels will differ for different users!!!
* @param url http(s) or data url to the image
*/
export async function imageDataFromUrl(url: string): Promise<ImageData> {
	if (typeof Image != "undefined") {
		var img = new Image();
		img.crossOrigin = "crossorigin";
		return await new Promise((done, fail) => {
			img.onload = function () { done(img.toBuffer()); };
			img.onerror = fail;
			img.src = url;
		}) as ImageData;
	} else {
		var hdr = "data:image/png;base64,";
		if (url.startsWith(hdr)) {
			var raw = Buffer.from(url.slice(hdr.length), "base64");
			var buffer = new Uint8Array(raw.buffer, raw.byteOffset, raw.byteLength);
		}
		else {
			var nodefetch = require("node-fetch");
			var res = await nodefetch(url).then(r => r.arrayBuffer());
			var buffer = new Uint8Array(res);
		}
		clearPngColorspace(buffer);
		var sharp = __non_webpack_require__("sharp");
		var file = sharp(Buffer.from(buffer.buffer, buffer.byteOffset, buffer.byteLength));
		var pixelobj = await file.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
		return new ImageDataFill(new Uint8ClampedArray(pixelobj.data), pixelobj.info.width, pixelobj.info.height);
	}
}

/**
* Loads an ImageData object from a base64 encoded png image
* Make sure the png image does not have a sRGB chunk or the resulting pixels will differ for different users!!!
* @param data a base64 encoded png image
*/
export async function imageDataFromBase64(data: string) {
	return imageDataFromUrl("data:image/png;base64," + data);
}

/**
* Used to visualise data as a grayscale image. The imput array must contain one (float) value per pixel.
* The values are automatically scaled so the lowest value is black and the highest is white
* @param array The pixels, one values per pixel
*/
function imagedataFromArray(array: number[], w: number, h: number) {
	if (array.length != w * h) { throw new Error("Invalid array size"); }
	var min = Math.min.apply(null, array);
	var max = Math.max.apply(null, array);
	var range = max - min;
	var buf = new ImageData(w, h);
	for (var i = 0; i < w * h; i++) {
		var ibuf = i * 4;
		buf.data[ibuf] = buf.data[ibuf + 1] = buf.data[ibuf + 2] = (array[i] - min) / range * 255;
		buf.data[ibuf + 3] = 255;
	}
	return buf;
}


/**
* Checks if a given byte array is a png file (by checking for ?PNG as first 4 bytes)
* @param bytes Raw bytes of the png file
*/
export function isPngBuffer(bytes: Uint8Array) {
	return bytes[0] == 137 && bytes[1] == 80 && bytes[2] == 78 && bytes[3] == 71;
}
/**
* Resets the colorspace data in the png file.
* This makes sure the browser renders the exact colors in the file instead of filtering it in order to obtain the best real life representation of
* what it looked like on the authors screen. (this feature is often broken and not supported)
* For example a round trip printscreen -> open in browser results in different colors than the original
* @param data Raw bytes of the png file
*/
export function clearPngColorspace(data: Uint8Array) {
	if (!isPngBuffer(data)) { throw new Error("non-png image received"); }
	var i = 8;
	while (i < data.length) {
		var length = data[i++] * 0x1000000 + data[i++] * 0x10000 + data[i++] * 0x100 + data[i++];
		var chunkname = String.fromCharCode(data[i++], data[i++], data[i++], data[i++]);
		//qw(chunkname, length);
		if (chunkname == "sRGB") {
			//Set render intent to absole colormetric, this forces browsers to not mess with the image
			console.log("- Changed sRGB, old value:", data[i]);
			//new chunk data
			data[i] = 3;
			//new chunk checksum
			data[i + length + 0] = 0x37;
			data[i + length + 1] = 0xc7;
			data[i + length + 2] = 0x4d;
			data[i + length + 3] = 0x53;
		}
		if (chunkname == "IEND") {
			break;
		}
		i += length;
		i += 4;
	}
}

/**
* finds the given needle ImageBuffer in the given haystack ImgRef this function uses the best optimized available
* code depending on the type of the haystack. It will use fast c# searching if the haystack is an ImgRefBind, js searching
* is used otherwise.
* the checklist argument is no longer used and should ignored or null/undefined
* The optional sx,sy,sw,sh arguments indicate a bounding rectangle in which to search the needle. The rectangle should be bigger than the needle
* @returns An array of points where the needle is found. The array is empty if none are found
*/
export function findSubimage(haystackImgref: ImgRef, needleBuffer: ImageData, sx = 0, sy = 0, sw = haystackImgref.width, sh = haystackImgref.height) {
	if (!haystackImgref) { throw new TypeError(); }
	if (!needleBuffer) { throw new TypeError(); }

	var max = 30;

	//check if we can do this in alt1
	if (haystackImgref instanceof ImgRefBind && wapper.hasAlt1 && alt1.bindFindSubImg) {
		var needlestr = wapper.encodeImageString(needleBuffer);
		var r = alt1.bindFindSubImg(haystackImgref.handle, needlestr, needleBuffer.width, sx, sy, sw, sh);
		if (!r) { throw new wapper.Alt1Error(); }
		return JSON.parse(r) as { x: number, y: number }[];
	}

	return findSubbuffer(haystackImgref.read(), needleBuffer, sx, sy, sw, sh);
}

/**
* Uses js to find the given needle ImageBuffer in the given haystack ImageBuffer. It is better to use the alt1.bind- functions in
* combination with a1nxt.findsubimg.
* the optional sx,sy,sw,sh arguments indicate a bounding rectangle in which to search.
* @returns An array of points where the needle is found. The array is empty if none are found
*/
export function findSubbuffer(haystack: ImageData, needle: ImageData, sx = 0, sy = 0, sw = haystack.width, sh = haystack.height) {
	var r: { x: number, y: number }[] = [];
	var maxdif = 30;
	var maxresults = 50;
	var needlestride = needle.width * 4;
	var heystackstride = haystack.width * 4;

	//built list of non trans pixel to check
	var checkList: { x: number, y: number }[] = [];
	for (var x = 0; x < needle.width; x++) {
		for (var y = 0; y < needle.height; y++) {
			var i = x * 4 + y * needlestride;
			if (needle.data[i + 3] == 255) { checkList.push({ x: x, y: y }); }
			if (checkList.length == 10) { break; }
		}
		if (checkList.length == 10) { break; }
	}

	var cw = (sx + sw) - needle.width;
	var ch = (sy + sh) - needle.height;
	var checklength = checkList.length;
	for (var x = sx; x <= cw; x++) {
		outer: for (var y = sy; y <= ch; y++) {
			for (var a = 0; a < checklength; a++) {
				var i1 = (x + checkList[a].x) * 4 + (y + checkList[a].y) * heystackstride;
				var i2 = checkList[a].x * 4 + checkList[a].y * needlestride;

				var d = 0;
				d = d + Math.abs(haystack.data[i1 + 0] - needle.data[i2 + 0]) | 0;
				d = d + Math.abs(haystack.data[i1 + 1] - needle.data[i2 + 1]) | 0;
				d = d + Math.abs(haystack.data[i1 + 2] - needle.data[i2 + 2]) | 0;
				d *= 255 / needle.data[i2 + 3];
				if (d > maxdif) {
					continue outer;
				}
			}
			if (simpleCompare(haystack, needle, x, y, maxdif) != Infinity) {
				r.push({ x, y });
				if (r.length > maxresults) { return r; }
			}
		}
	}
	return r;
}

/**
* Compares two images and returns the average color difference per pixel between them
* @param max The max color difference at any point in the image before short circuiting the function and returning Infinity. set to -1 to always continue.
* @returns The average color difference per pixel or Infinity if the difference is more than max at any point in the image
*/
export function simpleCompare(bigbuf: ImageData, checkbuf: ImageData, x: number, y: number, max = 30) {
	if (x < 0 || y < 0) { throw new RangeError(); }
	if (x + checkbuf.width > bigbuf.width || y + checkbuf.height > bigbuf.height) { throw new RangeError(); }

	if (max == -1) { max = 255 * 4; }
	var go = true;

	var dif = 0;
	for (var step = 8; step >= 1; step /= 2) {
		for (var cx = 0; cx < checkbuf.width; cx += step) {
			for (var cy = 0; cy < checkbuf.height; cy += step) {
				var i1 = (x + cx) * 4 + (y + cy) * bigbuf.width * 4;
				var i2 = cx * 4 + cy * checkbuf.width * 4;
				var d = 0;
				d = d + Math.abs(bigbuf.data[i1 + 0] - checkbuf.data[i2 + 0]) | 0;
				d = d + Math.abs(bigbuf.data[i1 + 1] - checkbuf.data[i2 + 1]) | 0;
				d = d + Math.abs(bigbuf.data[i1 + 2] - checkbuf.data[i2 + 2]) | 0;
				d *= checkbuf.data[i2 + 3] / 255;
				if (step == 1) { dif += d; }
				if (d > max) { return Infinity; }
			}
		}
	}
	return dif / checkbuf.width / checkbuf.height;
}

/**
* Returns the difference between two colors (scaled to the alpha of the second color)
*/
export function coldif(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number, a2: number) {
	return (Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2)) * a2 / 255;//only applies alpha for 2nd buffer!
}

/**
 * Turns map of promises into a map that contains the resolved values after loading.
 * @param input
 */
export function asyncMap<T extends { [name: string]: Promise<any> }>(input: T) {
	//recusive types what xd
	type subt = { [K in keyof T]: T[K] extends Promise<infer U> ? U : any };
	var raw = {} as subt;
	var promises: Promise<any>[] = [];

	for (var a in input) {
		if (input.hasOwnProperty(a)) {
			raw[a] = null!;
			promises.push(input[a].then(function (a: keyof T, i: any) { raw[a] = i; r[a] = i; }.bind(null, a)));
		}
	}
	var r = {} as subt & { promise: Promise<subt>, loaded: boolean, raw: subt };
	var promise = Promise.all(promises).then(() => { r.loaded = true; return r; });
	Object.defineProperty(r, "loaded", { enumerable: false, value: false, writable: true });
	Object.defineProperty(r, "promise", { enumerable: false, value: promise });
	Object.defineProperty(r, "raw", { enumerable: false, value: raw });
	return Object.assign(r, raw);
}

/**
* Same as asyncMap, but casts the properties to ImageData in typescript
*/
export function webpackImages<T extends { [name: string]: Promise<ImageData> }>(input: T) {
	type subt = { [K in keyof T]: ImageData };
	return asyncMap<{ [K in keyof T]: Promise<ImageData> }>(input) as any as { promise: Promise<subt>, loaded: boolean, raw: subt } & subt;
}

