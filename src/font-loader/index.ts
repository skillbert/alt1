import sharp from "sharp";
import * as OCR from "alt1/ocr";
import * as a1lib from "alt1/base";
import { LoaderContext } from "webpack";

a1lib.NodePolyfill.polyfillRequire((mod: string) => {
	if (mod == "sharp") { return sharp; }
	throw new Error("module not in require list");
});

export default function (this: LoaderContext<void>, source: string) {
	this.cacheable(true);
	var me = this;
	var meta = JSON.parse(source) as OCR.GenerateFontMeta;
	var imgsrc = this.resourcePath.replace(/\.fontmeta\.json$/, ".data.png");

	this.addDependency(imgsrc);
	this.async();

	(async () => {
		var bytes = await new Promise<Buffer>((done, err) => {
			this.fs.readFile(imgsrc, (e, buf) => {
				if (e) { err(e); }
				done(buf as Buffer);
			})
		});
		var byteview = new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength);
		a1lib.ImageDetect.clearPngColorspace(byteview);
		//currently still need the sharp package instead of node-canvas for this to prevent losing precision due to premultiplied alphas
		var imgfile = sharp(bytes);
		var imgdata = await imgfile.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
		if (imgdata.info.premultiplied) { console.warn("png unpacking used premultiplied alpha, pixels with low alpha values have suffered loss of precision in rgb channels"); }

		var img = new a1lib.ImageData(new Uint8ClampedArray(imgdata.data.buffer), imgdata.info.width, imgdata.info.height);
		let font = OCR.loadFontImage(img, meta);

		me.callback(null, JSON.stringify(font));
	})()
};


//debug function used to be able to view an image while inside a webpack process
//paste the returned string in a console with old alt1 libraries loaded
function exportimg(img: ImageData) {
	return "(function(){var b=new ImageData(" + img.width + "," + img.height + "); b.data.set([" + img.data + "]); b.show(); console.clear(); return b;})()";
}