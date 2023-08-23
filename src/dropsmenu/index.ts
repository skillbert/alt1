import * as a1lib from "alt1/base";
import { webpackImages, ImgRef } from "alt1/base";
import * as OCR from "alt1/ocr";

var imgs = webpackImages({
	loot: require("./imgs/lootbutton.data.png"),
	reset: require("./imgs/reset.data.png"),
	scrolltop: require("./imgs/scrolltop.data.png")
});
var font = require("../fonts/chatbox/12pt.fontmeta.json");


var fontcolors: OCR.ColortTriplet[] = [
	[255, 255, 255],//white
	[30, 255, 0],//green
	[102, 152, 255],//blue
	[163, 53, 238],//purple //TODO currently buggy
	[255, 128, 0]//orange (1b+ and boss pets)
];

export default class DropsMenuReader {
	pos = null as a1lib.RectLike | null;
	items = [];
	onincrease = null as ((name: string, increase: number, newtotal: number) => any) | null

	find(img?: ImgRef) {
		if (!img) { img = a1lib.captureHoldFullRs(); }
		if (!img) { return null; }
		var pos = img.findSubimage(imgs.loot);
		if (pos.length == 0) { return null; }
		var left = pos[0].x - 32;
		var bot = pos[0].y - 4;

		var rpos = img.findSubimage(imgs.reset, left + 50, bot + 4, img.width - left - 50, imgs.reset.height);
		if (rpos.length == 0) { return null; }
		var width = rpos[0].x - left + 15;

		let scrollrect = img.toData(left + width, 0, 10, bot);
		let scrolltops: { y: number, rmse: number }[] = [];
		for (let y = bot - imgs.scrolltop.height; y >= 0; y--) {
			let diff = a1lib.ImageDetect.simpleCompareRMSE(scrollrect, imgs.scrolltop, 0, y);
			scrolltops.push({ y, rmse: diff });
		}
		scrolltops.sort((a, b) => a.rmse - b.rmse);
		let besttop = scrolltops[0];

		//the below above also tends to have a good score, hardcode this situation if the best and 2nd best are adjacent
		if (Math.abs(scrolltops[0].rmse - scrolltops[1].rmse) < 10 && scrolltops[0].y == scrolltops[1].y + 1) { besttop = scrolltops[1]; }
		if (besttop.rmse > 130) { return null; }

		let top = besttop.y - 4;
		let titlebar = img.toData(left, top, width, 18);
		let quantitymatch = OCR.findReadLine(titlebar, font, [[143, 172, 187]], width - 100, 12, 70, 1);
		if (quantitymatch.text != "Quantity") { return null; }

		var p = { x: left, y: top, height: bot - top, width: width };
		alt1.overLayRect(a1lib.mixColor(255, 255, 255), p.x, p.y, p.width, p.height, 5000, 1);
		this.pos = p;
		return p;
	}

	read(img?: ImgRef) {
		if (!this.pos) { return null; }
		var buf: ImageData;
		if (img) { buf = img.toData(this.pos.x, this.pos.y, this.pos.width, this.pos.height); }
		else { buf = a1lib.capture(this.pos.x, this.pos.y, this.pos.width, this.pos.height); }

		let quantitymatch = OCR.findReadLine(buf, font, [[143, 172, 187]], this.pos.width - 100, 12, 70, 1);
		if (quantitymatch.text != "Quantity") { return null; }
		var right = quantitymatch.debugArea.x;

		for (var y = 35; y + 5 < buf.height; y += 18) {
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