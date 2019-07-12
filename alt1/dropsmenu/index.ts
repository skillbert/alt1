import * as a1lib from "@alt1/base";
import { ImgRef } from "@alt1/base";
import * as OCR from "@alt1/ocr";

var imgs =a1lib.ImageDetect.webpackImages({
	loot: require("./imgs/lootbutton.data.png"),
	reset: require("./imgs/reset.data.png"),
	droptext: require("./imgs/droptext.data.png"),
	quantitytext: require("./imgs/quantitytext.data.png")
});
var font = require("@alt1/ocr/fonts/aa_8px_new.fontmeta.json");


var fontcolors = [
	[255, 255, 255],//white
	[30, 255, 0],//green
	[102, 152, 255],//blue
	[163, 53, 238],//purple
	[255, 128, 0]//orange (1b+ and boss pets)
];

export default class DropsMenuReader {
	pos = null as a1lib.RectLike;
	items = [];
	onincrease = null as (name: string, increase: number, newtotal: number) => any

	find(img: ImgRef) {
		if (!img) { img = a1lib.captureHoldFullRs(); }
		if (!img) { return null; }
		var pos = img.findSubimage(imgs.loot);
		if (pos.length == 0) { return null; }
		var left = pos[0].x - 32;
		var bot = pos[0].y - 5;

		var rpos = img.findSubimage(imgs.reset, left + 50, bot + 5, img.width - left - 50, imgs.reset.height);
		if (rpos.length == 0) { return null; }
		var width = rpos[0].x - left + 15;

		var dropspos = img.findSubimage(imgs.droptext, left + 6, 0, imgs.droptext.width, bot - 50);
		if (dropspos.length == 0) { return null; }
		var top = dropspos[0].y - 4;

		var p = { x: left, y: top, height: bot - top, width: width };
		alt1.overLayRect(a1lib.mixColor(255, 255, 255), p.x, p.y, p.width, p.height, 5000, 1);
		this.pos = p;
		return p;
	}

	read(img: ImgRef) {
		if (!this.pos) { return null; }
		var buf: ImageData;
		if (img) { buf = img.toData(this.pos.x, this.pos.y, this.pos.width, this.pos.height); }
		else { buf = a1lib.capture(this.pos.x, this.pos.y, this.pos.width, this.pos.height); }

		var rpos = a1lib.ImageDetect.findSubbuffer(buf, imgs.quantitytext, 20, 4, buf.width - 20, imgs.quantitytext.height);
		if (rpos.length == 0) { return null; }
		var right = rpos[0].x - 3;

		for (var y = 34; y + 5 < buf.height; y += 18) {
			var itemstr = OCR.readLine(buf, font, fontcolors, 5, y, true, false);
			var amount = OCR.readLine(buf, font, fontcolors, right, y, true, false);
			if (itemstr.text && amount.text) {
				var name = itemstr.text;
				var item = this.items[name];
				if (!item) { item = this.items[name] = { amount: 0 }; }
				var n = +amount.text.replace(/,/g, "");
				var d = n - item.amount;
				if (d == 0) { break; }
				this.onincrease && this.onincrease(name, d, n);
				item.amount = n;
			}
		}
	}
}