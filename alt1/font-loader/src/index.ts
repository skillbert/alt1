import * as sharp from "sharp";
import * as OCR from "@alt1/ocr/src";
import * as a1lib from "@alt1/base";
import { LoaderContext } from "webpack";

type FontMeta = {
	basey: number,
	spacewidth: number,
	treshold: number,
	color: [number, number, number],
	shadow: boolean,
	chars: string,
	seconds: string
	img?: string,
	bonus?: { [char: string]: number },
	unblendmode: "removebg" | "raw" | "blackbg"
};


function cloneImage(img: ImageData, x, y, w, h) {
	var clone = new a1lib.ImageData(w, h);
	img.copyTo(clone, x, y, w, h, 0, 0);
	return clone;
}

declare var __non_webpack_require__: any;

a1lib.NodePolyfill.polyfillRequire(typeof __non_webpack_require__ != "undefined" ? __non_webpack_require__ : require);

export default function (this: LoaderContext<void>, source: string) {
	this.cacheable(true);
	var me = this;
	var meta = JSON.parse(source) as FontMeta;
	if (!meta.img) { meta.img = this.resourcePath.replace(/\.fontmeta\.json$/, ".data.png"); }

	this.addDependency(meta.img);
	this.async();

	(async () => {
		var bytes = await new Promise<Buffer>((done, err) => {
			this.fs.readFile(meta.img!, (e, buf) => {
				if (e) { err(e); }
				done(buf as Buffer);
			})
		});
		var byteview = new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength);
		a1lib.ImageDetect.clearPngColorspace(byteview);
		//currently still need the sharp package instead of node-canvas for this to prevent losing precision due to premultiplied alphas
		var imgfile = sharp(bytes);
		var imgdata = await imgfile.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
		var img = new a1lib.ImageData(new Uint8ClampedArray(imgdata.data.buffer), imgdata.info.width, imgdata.info.height);
		if (imgdata.info.premultiplied) { console.warn("png unpacking used premultiplied alpha, pixels with low alpha values have suffered loss of precision in rgb channels"); }

		var bg: ImageData | null = null;
		var pxheight = img.height - 1;
		if (meta.unblendmode == "removebg") { pxheight /= 2; }
		var inimg = cloneImage(img, 0, 0, img.width, pxheight);
		var outimg: ImageData;
		if (meta.unblendmode == "removebg") {
			bg = cloneImage(img, 0, pxheight + 1, img.width, pxheight);
			outimg = OCR.unblendKnownBg(inimg, bg, meta.shadow, meta.color[0], meta.color[1], meta.color[2]);
		} else if (meta.unblendmode == "raw") {
			outimg = OCR.unblendTrans(inimg, meta.shadow, meta.color[0], meta.color[1], meta.color[2]);
		} else if (meta.unblendmode == "blackbg") {
			outimg = OCR.unblendBlackBackground(inimg, meta.color[0], meta.color[1], meta.color[2])
		} else {
			throw new Error("no unblend mode");
		}
		var unblended = new a1lib.ImageData(img.width, pxheight + 1);
		outimg.copyTo(unblended, 0, 0, outimg.width, outimg.height, 0, 0);
		img.copyTo(unblended, 0, pxheight, img.width, 1, 0, pxheight);

		var font = OCR.generatefont(unblended, meta.chars, meta.seconds, meta.bonus || {}, meta.basey, meta.spacewidth, meta.treshold, meta.shadow);

		me.callback(null, JSON.stringify(font));
	})()
};


//debug function used to be able to view an image while inside a webpack process
//paste the returned string in a console with old alt1 libraries loaded
function exportimg(img: ImageData) {
	return "(function(){var b=new ImageData(" + img.width + "," + img.height + "); b.data.set([" + img.data + "]); b.show(); console.clear(); return b;})()";
}