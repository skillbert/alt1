import * as a1lib from "@alt1/base";
import * as OCR from "@alt1/ocr";
import { ImgRef } from "@alt1/base";

var chatfont = require("@alt1/ocr/fonts/aa_8px_new.fontmeta.json");

var imgs =a1lib.ImageDetect.webpackImages({
	detectimg: require("./imgs/detectimg.data.png")
});

export default class TargetMobReader {

	state = null as { hp: number, name: string };
	lastpos = null;

	read(img?: ImgRef) {
		if (!img) { img = a1lib.captureHoldFullRs(); }
		var pos = img.findSubimage(imgs.detectimg);
		if (pos.length != 0) {
			var data = img.toData(pos[0].x - 151, pos[0].y - 16, 220, 44);
			var mobname = OCR.findReadLine(data, chatfont, [[255, 255, 255]], 62, 18, 20, 1);
			var mobhp = OCR.findReadLine(data, chatfont, [[255, 203, 5]], 92, 39, 20, 1);
			this.lastpos = pos[0];
			this.state = {
				name: mobname.text,
				hp: +mobhp.text
			};
		} else {
			this.state = null;
		}
		return this.state;
	}
}