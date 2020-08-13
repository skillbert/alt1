import * as a1lib from "./index";
import { requireNodeCanvas, requireSharp } from "./nodeimports";

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
		getPixelInt(x: number, y: number): number;
		getColorDifference(x: number, y: number, r: number, g: number, b: number, a?: number): number;


		setPixel(x: number, y: number, color: [number, number, number, number]): void;
		setPixel(x: number, y: number, r: number, g: number, b: number, a: number): void;

		setPixelInt(x: number, y: number, color: number): void;

		toFileBytes(format: "image/png" | "image/webp", quality?: any): Promise<ArrayBuffer>;
		toPngBase64(): string;

		pixelCompare(buf: ImageData, x?: number, y?: number, max?: number): number;

		copyTo(target: ImageData, sourcex: number, sourcey: number, width: number, height: number, targetx: number, targety: number): void;
	}

	interface HTMLImageElement {
		toBuffer(x?: number, y?: number, w?: number, h?: number): ImageData;
		toCanvas(x?: number, y?: number, w?: number, h?: number): HTMLCanvasElement;
	}
}

type ImageDataConstr = {
	prototype: ImageData;
	new(width: number, height: number): ImageData;
	new(array: Uint8ClampedArray, width: number, height: number): ImageData;
};


//export this so node.js can also use it
export var ImageData: ImageDataConstr;

// //TODO revamp this madness a bit?
// (function () {
// 	var globalvar = (typeof self != "undefined" ? self : (typeof (global as any) != "undefined" ? (global as any) : null)) as any;
// 	//use the node-canvas version when on node
// 	if (typeof globalvar.ImageData == "undefined") {
// 		let nodecnv = requireNodeCanvas();
// 		globalvar.ImageData = nodecnv.ImageData;
// 	}
// 	var fill = typeof globalvar.ImageData == "undefined";

// 	//should never be reach anymore
// 	var constr = function (this: any) {
// 		var i = 0;
// 		var data = (arguments[i] instanceof Uint8ClampedArray ? arguments[i++] : null);
// 		var width = arguments[i++];
// 		var height = arguments[i++];

// 		if (fill) {
// 			if (!data) { data = new Uint8ClampedArray(width * height * 4); }
// 			this.width = width;
// 			this.height = height;
// 			this.data = data;
// 		}
// 		else if (oldconstr) {
// 			return (data ? new oldconstr(data, width, height) : new oldconstr(width, height));
// 		} else {
// 			var canvas = document.createElement('canvas');
// 			canvas.width = width;
// 			canvas.height = height;
// 			var ctx = canvas.getContext("2d")!;
// 			var imageData = ctx.createImageData(width, height);
// 			if (data) { imageData.data.set(data); }
// 			return imageData;
// 		}
// 	}

// 	var oldconstr = globalvar.ImageData;
// 	if (typeof document != "undefined") {
// 		try {
// 			new oldconstr(1, 1);
// 		} catch (e) {
// 			//direct constructor call not allowed in ie
// 			oldconstr = null;
// 		}
// 	}

// 	if (!fill) { constr.prototype = globalvar.ImageData.prototype; }
// 	globalvar.ImageData = constr;
// 	ImageData = constr as any;
// })();


(function () {
	var globalvar = (typeof self != "undefined" ? self : (typeof (global as any) != "undefined" ? (global as any) : null)) as any;
	var fill = typeof globalvar.ImageData == "undefined" || typeof globalvar.document == "undefined";

	var constr = function (this: any) {
		var i = 0;
		var data = (arguments[i] instanceof Uint8ClampedArray ? arguments[i++] : null);
		var width = arguments[i++];
		var height = arguments[i++];

		if (fill) {
			if (!data) { data = new Uint8ClampedArray(width * height * 4); }
			this.width = width;
			this.height = height;
			this.data = data;
		}
		else {
			var canvas = document.createElement('canvas');
			canvas.width = width;
			canvas.height = height;
			var ctx = canvas.getContext("2d")!;
			var imageData = ctx.createImageData(width, height);
			if (data) { imageData.data.set(data); }
			return imageData;
		}
	}
	if (!fill) { constr.prototype = globalvar.ImageData.prototype; }
	globalvar.ImageData = constr;
	ImageData = constr as any;
})();

//Recast into a drawable imagedata class on all platforms, into a normal browser ImageData on browsers or a node-canvas imagedata on nodejs
ImageData.prototype.toDrawableData = function () {
	if (typeof document == "undefined") {
		let nodecnv = requireNodeCanvas();
		return new nodecnv.ImageData(this.data, this.width, this.height);
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

ImageData.prototype.clone = function (rect) {
	return this.toImage(rect).getContext("2d")!.getImageData(0, 0, rect.width, rect.height);
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
	(el.style as any).imageRendering = "pixelated";
	el.style.outline = "1px solid #0f0";
	el.style.width = (this.width == 1 ? 100 : this.width) + "px";
	el.style.height = (this.height == 1 ? 100 : this.height) + "px";
	el.onclick = function () { el.remove(); }
	document.body.appendChild(el);
	return el;
} as typeof ImageData["prototype"]["show"];
ImageData.prototype.show.maxImages = 10;

ImageData.prototype.toImage = function (rect?) {
	if (!rect) { rect = new a1lib.Rect(0, 0, this.width, this.height); }
	if (typeof document != "undefined") {
		var el = document.createElement("canvas");
		el.width = rect.width;
		el.height = rect.height;
	} else {
		var nodecnv = requireNodeCanvas();
		var el = nodecnv.createCanvas(rect.width, rect.height) as any as HTMLCanvasElement;
	}
	var ctx = el.getContext("2d")!;
	ctx.putImageData(this, -rect.x, -rect.y);
	return el;
}

ImageData.prototype.getPixel = function (x, y): [number, number, number, number] {
	var i = x * 4 + y * 4 * this.width;
	return [this.data[i], this.data[i + 1], this.data[i + 2], this.data[i + 3]];
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
			r.onload = () => d(r.result as ArrayBuffer);
		}, format, quality));
	} else {
		var sharp = requireSharp();
		return new Promise<ArrayBuffer>(d => {
			var img = sharp(Buffer.from(this.data.buffer), { raw: { width: this.width, height: this.height, channels: 4 } });
			if (format == "image/png") { img.png(); }
			else if (format == "image/webp") {
				var opts = { quality: 80 };
				if (typeof quality == "number") { opts.quality = quality * 100; }
				img.webp(opts)
			}
			else { throw new Error("unknown image format: " + format); }
			img.toBuffer({ resolveWithObject: false }).then(r => d(r.buffer));
		})
	}
}

//use the implementation using the sharp package in order to support webp
/*
ImageData.prototype.toFileBytes = function (this: ImageData, format: "image/png" | "image/webp", quality?: any) {
	return new Promise<ArrayBuffer>((done, error) => {
		var cnv = this.toImage();
		if (typeof cnv.toBlob != "undefined") {
			cnv.toBlob(b => {
				var r = new FileReader();
				r.readAsArrayBuffer(b!);
				r.onload = () => done(r.result as ArrayBuffer);
				r.onerror = error;
			}, format, quality);
		} else {
			var nodecnv = requireNodeCanvas();
			var ncnv = cnv as any as InstanceType<typeof nodecnv.Canvas>;
			//TODO webp not supported right now
			if (format != "image/png") { throw new Error("only png compression available on node right now"); }
			let stream = ncnv.createPNGStream();
			var chunks: Buffer[] = [];
			stream.once("error", error);
			stream.once("end", () => done(Buffer.concat(chunks)))
			stream.on("data", c => chunks.push(c as Buffer));
		}
	});
}
*/

ImageData.prototype.toPngBase64 = function (this: ImageData) {
	if (typeof HTMLCanvasElement != "undefined") {
		var str = this.toImage().toDataURL("image/png");
		return str.slice(str.indexOf(",") + 1);
	} else {
		throw new Error("synchronous image conversion no supported in nodejs, try using ImageData.prototype.toFileBytes");
	}
}

ImageData.prototype.pixelCompare = function (buf: ImageData, x = 0, y = 0, max?: number) {
	return a1lib.ImageDetect.simpleCompare(this, buf, x, y, max);
}

ImageData.prototype.copyTo = function (target: ImageData, sourcex: number, sourcey: number, width: number, height: number, targetx: number, targety: number) {
	for (var cx = 0; cx < width; cx++) {
		for (var cy = 0; cy < height; cy++) {
			var it = (cx + targetx) * 4 + (cy + targety) * target.width * 4;
			var is = (cx + sourcex) * 4 + (cy + sourcey) * this.width * 4;
			target.data[it + 0] = this.data[is + 0];
			target.data[it + 1] = this.data[is + 1];
			target.data[it + 2] = this.data[is + 2];
			target.data[it + 3] = this.data[is + 3];
		}
	}
}

if (typeof HTMLImageElement != "undefined") {
	HTMLImageElement.prototype.toBuffer = function (this: HTMLImageElement, x = 0, y = 0, w = this.width, h = this.height) {
		var cnv = document.createElement("canvas");
		cnv.width = w;
		cnv.height = h;
		var ctx = cnv.getContext("2d")!;
		ctx.drawImage(this, -x, -y);
		return ctx.getImageData(0, 0, w, h);
	}

	HTMLImageElement.prototype.toCanvas = function (this: HTMLImageElement, x = 0, y = 0, w = this.width, h = this.height) {
		var cnv = document.createElement("canvas");
		cnv.width = w;
		cnv.height = h;
		var ctx = cnv.getContext("2d")!;
		ctx.drawImage(this, -x, -y);
		return cnv;
	}
}