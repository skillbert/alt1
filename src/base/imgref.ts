import { ImageDetect, transferImageData } from "./index";
import { RectLike } from "./rect";

/**
 * Represents an image that might be in different types of memory
 * This is mostly used to represent images still in Alt1 memory that have
 * not been transfered to js yet. Various a1lib api's use this type and
 * choose the most efficient approach based on the memory type
 */
export abstract class ImgRef {
	public width: number;
	public height: number;
	public x: number;
	public y: number;
	public t = "none";

	constructor(x: number, y: number, w: number, h: number) {
		this.x = x;
		this.y = y;
		this.width = w;
		this.height = h;
	}

	read(x = 0, y = 0, w = this.width, h = this.height): ImageData {
		throw new Error("This imgref (" + this.t + ") does not support toData");
	}

	findSubimage(needle: ImageData, sx = 0, sy = 0, w = this.width, h = this.height) {
		return ImageDetect.findSubimage(this, needle, sx, sy, w, h);
	}
	toData(x = this.x, y = this.y, w = this.width, h = this.height) {
		return this.read(x - this.x, y - this.y, w, h);
	};
	containsArea(rect: RectLike) {
		return this.x <= rect.x && this.y <= rect.y && this.x + this.width >= rect.x + rect.width && this.y + this.height >= rect.y + rect.height;
	}
}

/**
 * Represents an image in js render memory (canvas/image tag)
 */
export class ImgRefCtx extends ImgRef {
	ctx: CanvasRenderingContext2D;
	constructor(img: HTMLImageElement | CanvasRenderingContext2D | HTMLCanvasElement, x = 0, y = 0) {
		if (img instanceof CanvasRenderingContext2D) {
			super(x, y, img.canvas.width, img.canvas.height);
			this.ctx = img;
		} else {
			super(x, y, img.width, img.height);
			if (img instanceof HTMLCanvasElement) {
				this.ctx = img.getContext("2d", { willReadFrequently: true })!;
			} else {
				var cnv = document.createElement("canvas");
				cnv.width = img.width;
				cnv.height = img.height;
				this.ctx = cnv.getContext("2d", { willReadFrequently: true })!;
				this.ctx.drawImage(img, 0, 0);
			}
		}
		this.t = "ctx";
	}

	read(x = 0, y = 0, w = this.width, h = this.height) {
		return this.ctx.getImageData(x, y, w, h);
	}
}

/**
 * Represents in image in Alt1 memory, This type of image can be searched for subimages 
 * very efficiently and transfering the full image to js can be avoided this way
 */
export class ImgRefBind extends ImgRef {
	handle: number;
	constructor(handle: number, x = 0, y = 0, w = 0, h = 0) {
		super(x, y, w, h);
		this.handle = handle;
		this.t = "bind";
	}

	read(x = 0, y = 0, w = this.width, h = this.height) {
		return transferImageData(this.handle, x, y, w, h);
	}
}

/**
 * Represents an image in js memory
 */
export class ImgRefData extends ImgRef {
	buf: ImageData;
	constructor(buf: ImageData, x = 0, y = 0) {
		super(x, y, buf.width, buf.height);
		this.buf = buf;
		this.t = "data";
	}

	read(x = 0, y = 0, w = this.width, h = this.height) {
		if (x == 0 && y == 0 && w == this.width && h == this.height) {
			return this.buf;
		}
		var r = new ImageData(w, h);
		for (var b = y; b < y + h; b++) {
			for (var a = x; a < x + w; a++) {
				var i1 = (a - x) * 4 + (b - y) * w * 4;
				var i2 = a * 4 + b * 4 * this.buf.width;

				r.data[i1] = this.buf.data[i2];
				r.data[i1 + 1] = this.buf.data[i2 + 1];
				r.data[i1 + 2] = this.buf.data[i2 + 2];
				r.data[i1 + 3] = this.buf.data[i2 + 3];
			}
		}
		return r;
	}
}
