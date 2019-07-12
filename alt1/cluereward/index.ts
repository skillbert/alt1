import { ImgRef, RectLike, Rect, ImageDetect } from "@alt1/base";
import * as a1lib from "@alt1/base";
import * as OCR from "@alt1/ocr";

var font = require("@alt1/ocr/fonts/aa_9px_mono_allcaps.fontmeta.json");

var imgs = ImageDetect.webpackImages({
	complete: require("./imgs/complete.data.png"),
	completeLegacy: require("./imgs/completelegacy.data.png")
});


export default class ClueRewardReader {
	pos: Rect = null;

	find(img: ImgRef) {
		if (!img) { img = a1lib.captureHoldFullRs(); }
		if (!img) { return null; }

		var locs: { x: number, y: number }[] = [];
		var legacy = false;
		locs = img.findSubimage(imgs.complete);
		if (locs.length == 0) {
			legacy = true;
			locs = img.findSubimage(imgs.completeLegacy);
		}
		if (locs.length == 0) {
			return null;
		}

		var x = locs[0].x + (legacy ? -139 : -28);
		var y = locs[0].y + (legacy ? -13 : -13);

		var pos = new Rect(x, y, 402, 224);
		if (!Rect.fromArgs(img).contains(pos)) {
			return null;
		}
		this.pos = pos;
		return this.pos;
	}

	read(img: ImgRef) {
		var buf = img.toData(this.pos.x, this.pos.y, this.pos.width, this.pos.height);
		var legacy = buf.getPixel(10, 2)[0] > 30;

		var hash = 0;

		for (var y = 50; y < 85; y++) {
			for (var x = 25; x < 375; x++) {
				if (legacy && buf.getColorDifference(x, y, 62, 53, 40) < 10) { continue; }
				if (!legacy && buf.getColorDifference(x, y, 10, 31, 41) < 10) { continue; }
				hash = (((hash << 5) - hash) + buf.getPixelInt(x, y)) | 0;
			}
		}

		var str = OCR.findReadLine(buf, font, [[255, 255, 255]], 134, 113);
		if (!str.text) { return null; }
		var text = str.text.toLowerCase();
		var m = text.match(/value[: ]+([\d,]+)\b/);
		if (!m) { return null; }
		var value = +m[1].replace(/,/g, "");

		return { hash, value, text };
	}
}