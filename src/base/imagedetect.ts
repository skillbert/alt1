import { ImgRef, ImgRefBind, ImgRefCtx } from "./imgref";
import * as wapper from "./wrapper";
import * as nodeimports from "./nodepolyfill";
import { RectLike, Rect } from ".";

/**
* Downloads an image and returns the ImageData.
* Cleans sRGB headers from downloaded png images. Assumes that data url's are already cleaned from sRGB and other headers
* @param url http(s) or data url to the image
*/
export async function imageDataFromUrl(url: string): Promise<ImageData> {
	var hdr = "data:image/png;base64,";
	var isdataurl = url.startsWith(hdr);
	if (typeof Image != "undefined") {
		if (isdataurl) {
			return loadImageDataFromUrl(url);
		} else {
			let res = await fetch(url);
			if (!res.ok) { throw new Error("failed to load image: " + url); }
			let file = new Uint8Array(await res.arrayBuffer());
			return imageDataFromFileBuffer(file);
		}
	} else {
		if (isdataurl) {
			return imageDataFromBase64(url.slice(hdr.length));
		}
		throw new Error("loading remote images in nodejs has been disabled, load the raw bytes and use imageDataFromNodeBuffer instead");
	}
}

function loadImageDataFromUrl(url: string) {
	if (typeof Image == "undefined") {
		throw new Error("Browser environment expected");
	}
	return new Promise<ImageData>((done, fail) => {
		var img = new Image();
		img.crossOrigin = "crossorigin";
		img.onload = function () { done(new ImgRefCtx(img).toData()); };
		img.onerror = fail;
		img.src = url;
	});
}

/**
* Loads an ImageData object from a base64 encoded png image
* Make sure the png image does not have a sRGB chunk or the resulting pixels will differ for different users!!!
* @param data a base64 encoded png image
*/
export async function imageDataFromBase64(data: string) {
	if (typeof Image != "undefined") {
		return imageDataFromUrl("data:image/png;base64," + data);
	} else {
		return nodeimports.imageDataFromBase64(data);
	}
}

/**
 * Loads an ImageData object directly from a png encoded file buffer
 * This method ensures that png color space headers are taken care off
 * @param data The bytes of a png file
 */
export async function imageDataFromFileBuffer(data: Uint8Array) {
	if (isPngBuffer(data)) {
		clearPngColorspace(data);
	}
	if (typeof Image != "undefined") {
		let blob = new Blob([data], { type: "image/png" });
		let url = URL.createObjectURL(blob);
		let r = await loadImageDataFromUrl(url);
		URL.revokeObjectURL(url);
		return r;
	} else {
		return nodeimports.imageDataFromBuffer(data);
	}
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
		var ancillary = !!((data[i] >> 5) & 1);
		var chunkname = String.fromCharCode(data[i], data[i + 1], data[i + 2], data[i + 3]);
		var chunkid = chunkname.toLowerCase();
		if (chunkid != "trns" && ancillary) {
			data[i + 0] = "n".charCodeAt(0);
			data[i + 1] = "o".charCodeAt(0);
			data[i + 2] = "P".charCodeAt(0);
			data[i + 3] = "E".charCodeAt(0);

			//calculate new chunk checksum
			//http://www.libpng.org/pub/png/spec/1.2/PNG-CRCAppendix.html
			var end = i + 4 + length;
			var crc = 0xffffffff;

			//should be fast enough like this
			var bitcrc = function (bit: number) {
				for (var k = 0; k < 8; k++) {
					if (bit & 1) { bit = 0xedb88320 ^ (bit >>> 1); }
					else { bit = bit >>> 1; }
				}
				return bit;
			}
			for (var a = i; a < end; a++) {
				if (a >= i + 4) { data[a] = 0; }
				var bit = data[a];
				crc = bitcrc((crc ^ bit) & 0xff) ^ (crc >>> 8);
			}
			crc = crc ^ 0xffffffff;
			//new chunk checksum
			data[i + 4 + length + 0] = (crc >> 24) & 0xff;
			data[i + 4 + length + 1] = (crc >> 16) & 0xff;
			data[i + 4 + length + 2] = (crc >> 8) & 0xff;
			data[i + 4 + length + 3] = (crc >> 0) & 0xff;
		}
		if (chunkname == "IEND") { break; }
		i += 4;//type
		i += length;//data
		i += 4;//crc
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
	for (var y = 0; y < needle.height; y++) {
		for (var x = 0; x < needle.width; x++) {
			var i = x * 4 + y * needlestride;
			if (needle.data[i + 3] == 255) { checkList.push({ x: x, y: y }); }
			if (checkList.length == 10) { break; }
		}
		if (checkList.length == 10) { break; }
	}

	var cw = (sx + sw) - needle.width;
	var ch = (sy + sh) - needle.height;
	var checklength = checkList.length;
	for (var y = sy; y <= ch; y++) {
		outer: for (var x = sx; x <= cw; x++) {
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
* Calculates the root mean square error between the two buffers at the given coordinate, this method can be used in situations with significant blur or 
* transparency, it does not bail early on non-matching images like simpleCompare does so it can be expected to be much slower when called often.
* @returns The root mean square error beteen the images, high single pixel errors are penalized more than consisten low errors. return of 0 means perfect match.
*/
export function simpleCompareRMSE(bigbuf: ImageData, checkbuf: ImageData, x: number, y: number) {
	if (x < 0 || y < 0) { throw new RangeError(); }
	if (x + checkbuf.width > bigbuf.width || y + checkbuf.height > bigbuf.height) { throw new RangeError(); }

	var dif = 0;
	var numpix = 0;
	for (var cx = 0; cx < checkbuf.width; cx++) {
		for (var cy = 0; cy < checkbuf.height; cy++) {
			var i1 = (x + cx) * 4 + (y + cy) * bigbuf.width * 4;
			var i2 = cx * 4 + cy * checkbuf.width * 4;
			var d = 0;
			d = d + Math.abs(bigbuf.data[i1 + 0] - checkbuf.data[i2 + 0]) | 0;
			d = d + Math.abs(bigbuf.data[i1 + 1] - checkbuf.data[i2 + 1]) | 0;
			d = d + Math.abs(bigbuf.data[i1 + 2] - checkbuf.data[i2 + 2]) | 0;
			var weight = checkbuf.data[i2 + 3] / 255;
			numpix += weight;
			dif += d * d * weight;
		}
	}
	return Math.sqrt(dif / numpix);
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

export class ImageDataSet {
	buffers: ImageData[] = [];

	matchBest(img: ImageData, x: number, y: number, max?: number) {
		let best: number | null = null;
		let bestscore: number | undefined = max;
		for (let a = 0; a < this.buffers.length; a++) {
			let score = img.pixelCompare(this.buffers[a], x, y, bestscore)
			if (isFinite(score) && (bestscore == undefined || score < bestscore)) {
				bestscore = score;
				best = a;
			}
		}
		if (best == null) {
			return null;
		}
		return { index: best, score: bestscore };
	}


	static fromFilmStrip(baseimg: ImageData, width: number) {
		if ((baseimg.width % width) != 0) { throw new Error("slice size does not fit in base img"); }
		let r = new ImageDataSet();
		for (let x = 0; x < baseimg.width; x += width) {
			r.buffers.push(baseimg.clone(new Rect(x, 0, width, baseimg.height)));
		}
		return r;
	}

	static fromFilmStripUneven(baseimg: ImageData, widths: number[]) {
		let r = new ImageDataSet()
		let x = 0;
		for (let w of widths) {
			r.buffers.push(baseimg.clone(new Rect(x, 0, w, baseimg.height)));
			x += w;
			if (x > baseimg.width) { throw new Error("sampling filmstrip outside bounds"); }
		}
		if (x != baseimg.width) { throw new Error("unconsumed pixels left in film strip imagedata"); }
		return r;
	}

	static fromAtlas(baseimg: ImageData, slices: RectLike[]) {
		let r = new ImageDataSet();
		for (let slice of slices) {
			r.buffers.push(baseimg.clone(slice));
		}
		return r;
	}
}