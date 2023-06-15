import * as a1lib from "alt1/base";
import { webpackImages, ImgRef, ImageDetect } from "alt1/base";
import * as OCR from "alt1/ocr";


let font = require("./assets/timerfont.fontmeta.json");

let imgs = webpackImages({
	bossicon: require("./assets/bossicon.data.png")
});


export default class BossTimerReader {

	pos: a1lib.RectLike | null = null;

	find(img?: ImgRef) {
		if (!img) { img = a1lib.captureHoldFullRs(); }

		let pos = img.findSubimage(imgs.bossicon);
		if (pos.length == 0) { return null; }
		if (pos.length > 1) { console.log("more than one possible boss timer found"); }

		this.pos = { x: pos[0].x - 8, y: pos[0].y - 12, width: 120, height: 35 };
		return this.pos;
	}
	read(img?: ImgRef) {
		if (!this.pos) { return null; }
		let buf: ImageData;
		if (!img) { buf = a1lib.capture(this.pos); }
		else { buf = img.toData(this.pos.x, this.pos.y, this.pos.width, this.pos.height); }

		let timestr = OCR.findReadLine(buf, font, [[255, 255, 255], [200, 0, 0], [200, 20, 0], [210, 40, 0], [230, 80, 0], [250, 100, 0], [220, 60, 0]], 56, 23, 30, 1);
		let m = timestr.text.match(/^(\d{2}):(\d{2})$/);
		if (!m) { return null; }
		return {
			minpart: +m[1],
			secpart: +m[2],
			time: (+m[1]) * 60 + (+m[2])
		}
	}
}