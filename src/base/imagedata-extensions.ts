import * as a1lib from "./index";
import * as nodeimports from "./nodepolyfill";

declare global {
	interface ImageData {
		putImageData(buf: ImageData, cx: number, cy: number): void;
		pixelOffset(x: number, y: number): number;
		getPixelHash(rect: a1lib.RectLike): number;

		clone(rect: a1lib.RectLike): ImageData;

		show: {
			(x?: number, y?: number, zoom?: number): HTMLCanvasElement;
			maxImages: number;
		}

		toDrawableData(): ImageData;
		toImage(rect?: a1lib.RectLike): HTMLCanvasElement;

		getPixel(x: number, y: number): [number, number, number, number];
		getPixelValueSum(x: number, y: number): number;
		getPixelInt(x: number, y: number): number;
		getColorDifference(x: number, y: number, r: number, g: number, b: number, a?: number): number;


		setPixel(x: number, y: number, color: [number, number, number, number]): void;
		setPixel(x: number, y: number, r: number, g: number, b: number, a: number): void;

		setPixelInt(x: number, y: number, color: number): void;

		toFileBytes(format: "image/png" | "image/webp", quality?: any): Promise<Uint8Array>;
		toPngBase64(): string;

		pixelCompare(buf: ImageData, x?: number, y?: number, max?: number): number;

		copyTo(target: ImageData, sourcex: number, sourcey: number, width: number, height: number, targetx: number, targety: number): void;
	}
}

type ImageDataConstr = {
	prototype: ImageData;
	new(width: number, height: number): ImageData;
	new(array: Uint8ClampedArray, width: number, height: number): ImageData;
};


//export this so node.js can also use it
export var ImageData: ImageDataConstr;


(function () {
	var globalvar = (typeof self != "undefined" ? self : (typeof (global as any) != "undefined" ? (global as any) : null)) as any;
	var filltype = typeof globalvar.ImageData == "undefined";
	var fillconstr = filltype;
	if (!filltype) {
		var oldconstr = globalvar.ImageData;
		try {
			let data = new Uint8ClampedArray(4);
			data[0] = 1;
			let a = new globalvar.ImageData(data, 1, 1);
			fillconstr = a.data[0] != 1;
		} catch (e) {
			fillconstr = true;
		}
	}

	if (fillconstr) {
		var constr = function ImageDataShim(this: any) {
			var i = 0;
			var data = (arguments[i] instanceof Uint8ClampedArray ? arguments[i++] : null);
			var width = arguments[i++];
			var height = arguments[i++];

			if (filltype) {
				if (!data) { data = new Uint8ClampedArray(width * height * 4); }
				this.width = width;
				this.height = height;
				this.data = data;
			}
			else if (fillconstr) {
				//WARNING This branch of code does not use the same pixel data backing store
				//(problem with wasm, however all wasm browser have a native constructor (unless asm.js is used))
				var canvas = document.createElement('canvas');
				canvas.width = width;
				canvas.height = height;
				var ctx = canvas.getContext("2d")!;
				var imageData = ctx.createImageData(width, height);
				if (data) { imageData.data.set(data); }
				return imageData;
			}
			// else {
			// 	//oh no...
			// 	//we need this monstrocity in order to call the native constructor with variable number of args
			// 	//when es5 transpile is enable (that strips the spread operator)
			// 	return new (Function.prototype.bind.apply(oldconstr, [null,...arguments]));
			// }
		}
		if (!filltype) { constr.prototype = globalvar.ImageData.prototype; }
		globalvar.ImageData = constr;
		ImageData = constr as any;
	} else {
		ImageData = globalvar.ImageData;
	}
})();

//Recast into a drawable imagedata class on all platforms, into a normal browser ImageData on browsers or a node-canvas imagedata on nodejs
ImageData.prototype.toDrawableData = function () {
	if (typeof document == "undefined") {
		return nodeimports.imageDataToDrawable(this);
	} else {
		return this;
	}
}

ImageData.prototype.putImageData = function (buf, cx, cy) {
	for (var dx = 0; dx < buf.width; dx++) {
		for (var dy = 0; dy < buf.height; dy++) {
			var i1 = (dx + cx) * 4 + (dy + cy) * 4 * this.width;
			var i2 = dx * 4 + dy * 4 * buf.width;
			this.data[i1] = buf.data[i2];
			this.data[i1 + 1] = buf.data[i2 + 1];
			this.data[i1 + 2] = buf.data[i2 + 2];
			this.data[i1 + 3] = buf.data[i2 + 3];
		}
	}
}

ImageData.prototype.pixelOffset = function (x, y) {
	return x * 4 + y * this.width * 4;
}

//creates a hash of a portion of the buffer used to check for changes
ImageData.prototype.getPixelHash = function (rect) {
	if (!rect) { rect = new a1lib.Rect(0, 0, this.width, this.height); }
	var hash = 0;
	for (var x = rect.x; x < rect.x + rect.width; x++) {
		for (var y = rect.y; y < rect.y + rect.height; y++) {
			var i = x * 4 + y * 4 * this.width;

			hash = (((hash << 5) - hash) + this.data[i]) | 0;
			hash = (((hash << 5) - hash) + this.data[i + 1]) | 0;
			hash = (((hash << 5) - hash) + this.data[i + 2]) | 0;
			hash = (((hash << 5) - hash) + this.data[i + 3]) | 0;
		}
	}
	return hash;
}

ImageData.prototype.clone = function (this: ImageData, rect) {
	let res = new ImageData(rect.width, rect.height);
	this.copyTo(res, rect.x, rect.y, rect.width, rect.height, 0, 0);
	return res;
}

ImageData.prototype.show = function (this: ImageData, x = 5, y = 5, zoom = 1) {
	if (typeof document == "undefined") {
		console.error("need a document to show an imagedata object");
		return;
	}
	var imgs = document.getElementsByClassName("debugimage");
	while (imgs.length > ImageData.prototype.show.maxImages) { imgs[0].remove(); }
	var el = this.toImage();
	el.classList.add("debugimage")
	el.style.position = "absolute";
	el.style.zIndex = "1000";
	el.style.left = x / zoom + "px";
	el.style.top = y / zoom + "px";
	el.style.background = "purple";
	el.style.cursor = "pointer";
	el.style.imageRendering = "pixelated";
	el.style.outline = "1px solid #0f0";
	el.style.width = (this.width == 1 ? 100 : this.width) * zoom + "px";
	el.style.height = (this.height == 1 ? 100 : this.height) * zoom + "px";
	el.onclick = function () { el.remove(); }
	document.body.appendChild(el);
	return el;
} as typeof ImageData["prototype"]["show"];
ImageData.prototype.show.maxImages = 10;

ImageData.prototype.toImage = function (this: ImageData, rect?) {
	if (!rect) { rect = new a1lib.Rect(0, 0, this.width, this.height); }
	if (typeof document != "undefined") {
		var el = document.createElement("canvas");
		el.width = rect.width;
		el.height = rect.height;
	} else {
		el = nodeimports.createCanvas(rect.width, rect.height);
	}
	var ctx = el.getContext("2d")!;
	ctx.putImageData(this.toDrawableData(), -rect.x, -rect.y);
	return el;
}

ImageData.prototype.getPixel = function (x, y): [number, number, number, number] {
	var i = x * 4 + y * 4 * this.width;
	return [this.data[i], this.data[i + 1], this.data[i + 2], this.data[i + 3]];
}

ImageData.prototype.getPixelValueSum = function (x, y) {
	var i = x * 4 + y * 4 * this.width;
	return this.data[i] + this.data[i + 1] + this.data[i + 2];
}

ImageData.prototype.getPixelInt = function (x, y) {
	var i = x * 4 + y * 4 * this.width;
	return (this.data[i + 3] << 24) + (this.data[i + 0] << 16) + (this.data[i + 1] << 8) + (this.data[i + 2] << 0);
}

ImageData.prototype.getColorDifference = function (x, y, r, g, b, a = 255) {
	var i = x * 4 + y * 4 * this.width;
	return Math.abs(this.data[i] - r) + Math.abs(this.data[i + 1] - g) + Math.abs(this.data[i + 2] - b) * a / 255;
}

ImageData.prototype.setPixel = function (x, y, ...color) {
	var r, g, b, a;
	var [r, g, b, a] = (Array.isArray(color[0]) ? color[0] : color);
	var i = x * 4 + y * 4 * this.width;
	this.data[i] = r;
	this.data[i + 1] = g;
	this.data[i + 2] = b;
	this.data[i + 3] = a == undefined ? 255 : a;
}

ImageData.prototype.setPixelInt = function (x, y, color) {
	var i = x * 4 + y * 4 * this.width;
	this.data[i] = (color >> 24) & 0xff;
	this.data[i + 1] = (color >> 16) & 0xff;
	this.data[i + 2] = (color >> 8) & 0xff;
	this.data[i + 3] = (color >> 0) & 0xff;
}

ImageData.prototype.toFileBytes = function (this: ImageData, format: "image/png" | "image/webp", quality?: any) {
	if (typeof HTMLCanvasElement != "undefined") {
		return new Promise<ArrayBuffer>(d => this.toImage().toBlob(b => {
			var r = new FileReader();
			r.readAsArrayBuffer(b!);
			r.onload = () => d(new Uint8Array(r.result as ArrayBuffer));
		}, format, quality));
	} else {
		return nodeimports.imageDataToFileBytes(this, format, quality);
	}
}

ImageData.prototype.toPngBase64 = function (this: ImageData) {
	if (typeof HTMLCanvasElement != "undefined") {
		var str = this.toImage().toDataURL("image/png");
		return str.slice(str.indexOf(",") + 1);
	} else {
		throw new Error("synchronous image conversion not supported in nodejs, try using ImageData.prototype.toFileBytes");
	}
}

ImageData.prototype.pixelCompare = function (buf: ImageData, x = 0, y = 0, max?: number) {
	return a1lib.ImageDetect.simpleCompare(this, buf, x, y, max);
}

ImageData.prototype.copyTo = function (target: ImageData, sourcex: number, sourcey: number, width: number, height: number, targetx: number, targety: number) {
	//convince v8 that these are 31bit uints
	const targetwidth = target.width | 0;
	const thiswidth = this.width | 0;

	const copywidth = width | 0;
	const fastwidth = Math.floor(width / 4) * 4;
	const thisdata = new Int32Array(this.data.buffer, this.data.byteOffset, this.data.byteLength / 4);
	const targetdata = new Int32Array(target.data.buffer, target.data.byteOffset, target.data.byteLength / 4);
	for (let cy = 0; cy < height; cy++) {
		let cx = 0;
		let it = (cx + targetx) + (cy + targety) * targetwidth;
		let is = (cx + sourcex) + (cy + sourcey) * thiswidth;
		//copy 4 pixels per iter (xmm)
		for (; cx < fastwidth; cx += 4) {
			targetdata[it] = thisdata[is];
			targetdata[it + 1] = thisdata[is + 1];
			targetdata[it + 2] = thisdata[is + 2];
			targetdata[it + 3] = thisdata[is + 3];
			it += 4;
			is += 4;
		}
		//copy remainder per pixel
		for (; cx < copywidth; cx++) {
			targetdata[it] = thisdata[is];
			it += 1;
			is += 1;
		}
	}
}
