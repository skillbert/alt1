import * as a1lib from "alt1/base";
import { webpackImages, ImgRef } from "alt1/base";
import * as OCR from "alt1/ocr";

var chatfont = require("../fonts/aa_8px.fontmeta.json");

var imgs = webpackImages({
	dren: require("./actionbarimgs/dren.data.png"),
	drenretal: require("./actionbarimgs/drenretal.data.png"),
	lifepoints: require("./actionbarimgs/lifepoints.data.png"),
	lifepointspoison: require("./actionbarimgs/lifepointspoison.data.png"),
	prayer: require("./actionbarimgs/prayer.data.png"),
	prayeron: require("./actionbarimgs/prayeron.data.png"),
	sumpoints: require("./actionbarimgs/sumpoints.data.png"),
});

export type LifeState = {
	hp: number,
	dren: number,
	pray: number,
	sum: number,
	exacthp: { cur: number, max: number } | null,
	exactpray: { cur: number, max: number } | null,
	exactsum: { cur: number, max: number } | null,
	exactdren: { cur: number, max: number } | null,
}

type Layout = {
	hp: a1lib.PointLike,
	dren: a1lib.PointLike,
	pray: a1lib.PointLike,
	sum: a1lib.PointLike,
	width: number,
	height: number,
	hor: boolean,
	barlength: number,
	type: MainBarType
}

type MainBarType = "mainflat" | "mainhor" | "mainver" | "maintower";

export default class ActionbarReader {
	pos: { x: number, y: number, layout: Layout } | null = null;

	static layouts: { [name: string]: Layout } = {
		mainflat: { hp: { x: 0, y: 0 }, dren: { x: 119, y: 0 }, pray: { x: 238, y: 0 }, sum: { x: 357, y: 0 }, width: 470, height: 25, hor: true, barlength: 80, type: "mainflat" },
		mainhor: { hp: { x: 0, y: 0 }, dren: { x: 102, y: 0 }, pray: { x: 16, y: 22 }, sum: { x: 118, y: 22 }, width: 210, height: 45, hor: true, barlength: 62, type: "mainhor" },
		mainver: { hp: { x: 0, y: 0 }, dren: { x: 0, y: 100 }, pray: { x: 22, y: 16 }, sum: { x: 22, y: 116 }, width: 35, height: 210, hor: false, barlength: 62, type: "mainver" },
		maintower: { hp: { x: 0, y: 0 }, dren: { x: 0, y: 119 }, pray: { x: 0, y: 238 }, sum: { x: 0, y: 357 }, width: 20, height: 465, hor: false, barlength: 80, type: "maintower" }
	};

	find(img?: ImgRef) {
		if (!img) { img = a1lib.captureHoldFullRs(); }
		if (!img) { return false; }
		var sumpos = img.findSubimage(imgs.sumpoints);
		if (sumpos.length == 0) { return false; }
		var hppos = img.findSubimage(imgs.lifepoints);
		if (hppos.length == 0) { hppos = img.findSubimage(imgs.lifepointspoison); }
		if (hppos.length == 0) { return false; }

		var layout: Layout | null = null;
		for (var a in ActionbarReader.layouts) {
			var l = ActionbarReader.layouts[a];
			if (sumpos[0].x - hppos[0].x == l.sum.x - l.hp.x && sumpos[0].y - hppos[0].y == l.sum.y - l.hp.y) {
				layout = l;
				break;
			}
		}
		if (!layout) { return false; }
		this.pos = {
			x: hppos[0].x - layout.hp.x,
			y: hppos[0].y - layout.hp.y,
			layout: layout
		};

		return true;
	}

	read(): LifeState;
	read(buffer: ImageData, bufx: number, bufy: number): LifeState;
	read(buffer?: ImageData, bufx?: number, bufy?: number): LifeState {
		if (!this.pos) { throw new Error("interface is not found yet"); }
		if (!buffer) {
			//TODO fix the capture dimensions!!!
			let fixoffset = 10;
			buffer = a1lib.capture(this.pos.x, this.pos.y - fixoffset, this.pos.layout.width, this.pos.layout.height + fixoffset);
			bufx = this.pos.x;
			bufy = this.pos.y - fixoffset;
		}
		var dx = this.pos.x - bufx!;
		var dy = this.pos.y - bufy!;

		var hptext = this.readBarNumber(buffer, this.pos.layout.hp.x + dx, this.pos.layout.hp.y + dy, this.pos.layout.hor);
		var drentext = this.readBarNumber(buffer, this.pos.layout.dren.x + dx, this.pos.layout.dren.y + dy, this.pos.layout.hor);
		var sumtext = this.readBarNumber(buffer, this.pos.layout.sum.x + dx, this.pos.layout.sum.y + dy, this.pos.layout.hor);
		var praytext = this.readBarNumber(buffer, this.pos.layout.pray.x + dx, this.pos.layout.pray.y + dy, this.pos.layout.hor);
		var hpbar = this.readBar(buffer, this.pos.layout.hp.x + dx, this.pos.layout.hp.y + dy, this.pos.layout.hor);
		var drenbar = this.readBar(buffer, this.pos.layout.dren.x + dx, this.pos.layout.dren.y + dy, this.pos.layout.hor);
		var praybar = this.readBar(buffer, this.pos.layout.pray.x + dx, this.pos.layout.pray.y + dy, this.pos.layout.hor);
		var sumbar = this.readBar(buffer, this.pos.layout.sum.x + dx, this.pos.layout.sum.y + dy, this.pos.layout.hor);

		return {
			hp: (hptext ? hptext.cur / hptext.max : hpbar),
			dren: (drentext ? drentext.cur / drentext.max : drenbar),
			sum: (sumtext ? sumtext.cur / sumtext.max : sumbar),
			pray: (praytext ? praytext.cur / praytext.max : praybar),
			exacthp: hptext,
			exactdren: drentext,
			exactpray: praytext,
			exactsum: sumtext
		};

	}

	readBarNumber(buffer: ImageData, x: number, y: number, hor: boolean) {
		if (hor) {
			var line = OCR.readLine(buffer, chatfont, [255, 255, 255], x + 22, y + 5, true, false);
			var m = line.text.match(/^(\d+)(\/(\d+)|%)$/);
			if (m) { return { cur: +m[1], max: (m[2] == "%" ? 100 : +m[3]) }; }
		}
		return null;
	}
	readBar(buffer: ImageData, x: number, y: number, hor: boolean) {
		if (!this.pos) { throw new Error("interface not found yet"); }
		if (hor) { x += 25; y += 11; }
		else { x += 7; y += 26; }
		var width = this.pos.layout.barlength;
		for (var b = 0; b < width; b++) {
			var i = buffer.pixelOffset(x + (hor ? b : 0), y + (hor ? 0 : b));
			if (a1lib.ImageDetect.coldif(buffer.data[i], buffer.data[i + 1], buffer.data[i + 2], 25, 31, 34, 255) < 20) {
				break;
			}
		}
		return b / width;
	}

	static getCurrentLayoutData(img: ImgRef) {
		img ??= a1lib.captureHoldFullRs();
		var matches = {
			hp: a1lib.findSubimage(img, imgs.lifepoints)[0],
			dren: a1lib.findSubimage(img, imgs.dren)[0],
			pray: a1lib.findSubimage(img, imgs.prayer)[0],
			sum: a1lib.findSubimage(img, imgs.sumpoints)[0]
		};
		var layout = {
			hp: { x: matches.hp.x - matches.hp.x, y: matches.hp.y - matches.hp.y },
			dren: { x: matches.dren.x - matches.hp.x, y: matches.dren.y - matches.hp.y },
			pray: { x: matches.pray.x - matches.hp.x, y: matches.pray.y - matches.hp.y },
			sum: { x: matches.sum.x - matches.hp.x, y: matches.sum.y - matches.hp.y }
		}
		return JSON.stringify(layout);
	}
}
