import * as fs from "fs";
import {PNG} from "pngjs";
import * as OCR from "libs/ocr";
import * as path from "path";
import * as a1lib from "libs/alt1lib";
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
	(img as any).copyTo(clone, x, y, w, h, 0, 0);
	return clone;
}

module.exports = function (this: webpack.loader.LoaderContext, source: string) {
	var me = this;
	var meta = JSON.parse(source) as FontMeta;
	if (!meta.img) { meta.img = this.resourcePath.replace(/\.fontmeta\.json$/, ".data.png"); }

	this.addDependency(meta.img);
	this.async();
	//TODO make sure the image doesn't contain the srgb header
	fs.createReadStream(meta.img).pipe(new PNG({ filterType: 4 })).on('parsed', function (this: any) {
		var img = new a1lib.ImageData(new Uint8ClampedArray(this.data.buffer), this.width, this.height);
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
	});
};