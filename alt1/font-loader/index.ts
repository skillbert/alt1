import {PNG} from "pngjs";
import * as OCR from "@alt1/ocr";
import * as a1lib from "@alt1/base";
import * as webpack from "webpack";

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
	unblendmode: "removebg" | "raw"
};


function cloneImage(img:ImageData,x,y,w,h) {
	var clone = new a1lib.ImageData(w, h);
	img.copyTo(clone, x, y, w, h, 0, 0);
	return clone;
}

module.exports = async function (this: webpack.loader.LoaderContext, source: string) {
	var me = this;
	var meta = JSON.parse(source) as FontMeta;
	if (!meta.img) { meta.img = this.resourcePath.replace(/\.fontmeta\.json$/, ".data.png"); }

	this.addDependency(meta.img);
	this.async();
	//TODO make sure the image doesn't contain the srgb header

	var bytes = await new Promise((done, err) => {
		this.fs.readFile(meta.img, (e, buf) => {
			if (e) { err(e); }
			done(buf);
		})
	}) as Buffer;
	var byteview = new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength);
	a1lib.ImageDetect.clearPngColorspace(byteview);
	var png = new PNG();
	await new Promise((done, err) => {
		png.on("parsed", e => done(e));
		png.on("error", e => err(e));
		png.parse(bytes);
	})
	var img = new a1lib.ImageData(new Uint8ClampedArray(png.data.buffer, png.data.byteOffset, png.data.byteLength), png.width, png.height);

	var bg = null;
	var pxheight = img.height - 1;
	if (meta.unblendmode == "removebg") {
		pxheight /= 2;
		bg = cloneImage(img, 0, pxheight + 1, img.width, pxheight);
	}
	var inimg = cloneImage(img, 0, 0, img.width, pxheight);
	var outimg;
	if (meta.unblendmode == "removebg") {
		outimg = OCR.unblendKnownBg(inimg, bg, meta.shadow, meta.color[0], meta.color[1], meta.color[2]);
	} else if (meta.unblendmode == "raw") {
		outimg = OCR.unblendTrans(inimg, meta.shadow, meta.color[0], meta.color[1], meta.color[2]);
	} else {
		throw "no unblend mode";
	}
	var unblended = new a1lib.ImageData(img.width, pxheight + 1);
	outimg.copyTo(unblended, 0, 0, outimg.width, outimg.height, 0, 0);
	img.copyTo(unblended, 0, pxheight, img.width, 1, 0, pxheight);

	var font = OCR.generatefont(unblended, meta.chars, meta.seconds, meta.bonus, meta.basey, meta.spacewidth, meta.treshold, meta.shadow);

	me.callback(null, JSON.stringify(font));
};


//debug function used to be able to view an image while inside a webpack process
//paste the returned string in a console with old alt1 libraries loaded
function exportimg(img: ImageData) {
	return "(function(){var b=new ImageData(" + img.width + "," + img.height + "); b.data.set([" + img.data + "]); b.show(); console.clear(); return b;})()";
}