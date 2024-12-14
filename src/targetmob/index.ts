import * as a1lib from "alt1/base";
import * as OCR from "alt1/ocr";
import { webpackImages, ImgRef } from "alt1/base";

var chatfont = require("../fonts/aa_8px.fontmeta.json");

var imgs = webpackImages({
	detectimg: require("./imgs/detectimg.data.png"),
	detectleg: require("./imgs/detectimgLegacy.data.png")
});

export default class TargetMobReader {

	state: { hp: number, name: string } | null = null;
	lastpos: a1lib.PointLike | null = null;
	legacy: boolean = false;

	read(img?: ImgRef) {
		if (!img) { img = a1lib.captureHoldFullRs(); }
		if (!this.lastpos) {
			var leg = img.findSubimage(imgs.detectleg);
			if (leg.length != 0) { this.legacy = true; } 
		}
		var pos = this.legacy ?	img.findSubimage(imgs.detectleg) : img.findSubimage(imgs.detectimg);
		if (pos.length != 0) {
			var data = img.toData(pos[0].x - 151, pos[0].y - 16, 220, 44);
			var mobname = OCR.findReadLine(data, chatfont, [[255, 255, 255]], 62, 18, 20, 1);
			var mobhp = OCR.findReadLine(data, chatfont, [[255, 203, 5]], 92, 39, 20, 1);
			this.lastpos = pos[0];
			this.state = {
				name: mobname.text,
				hp: +mobhp.text.replace(/,/g, "")
			};
		} else {
			this.state = null;
		}
		return this.state;
	}
}