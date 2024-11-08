import * as a1lib from "alt1/base";
import * as OCR from "alt1/ocr";
import { ImgRef, webpackImages } from "alt1/base";

var imgs_rs3 = webpackImages({
	chatimg: require("./imgs/chatimg.data.png"),
	chatimghover: require("./imgs/chatimghover.data.png"),
	chatimgactive: require("./imgs/chatimgactive.data.png"),
	continueimg: require("./imgs/continueimg.data.png"),
	continueimgdown: require("./imgs/continueimgdown.data.png"),
	boxtl: require("./imgs/boxtl.data.png"),
	boxtr: require("./imgs/boxtr.data.png")
});

var imgs_leg = webpackImages({
	chatimg: require("./imgs/chatimg_leg.data.png"),
	chatimghover: require("./imgs/chatimghover_leg.data.png"),
	chatimgactive: require("./imgs/chatimgactive_leg.data.png"),
	continueimg: require("./imgs/continueimg_leg.data.png"),
	continueimgdown: require("./imgs/continueimgdown_leg.data.png"),
	boxtl: require("./imgs/boxtl_leg.data.png"),
	boxtr: require("./imgs/boxtr_leg.data.png")
});

var fontmono = require("../fonts/aa_8px_mono.fontmeta.json");
var fontmono2 = require("./imgs/12pt.fontmeta.json");
var fontheavy = require("../fonts/aa_8px_mono_allcaps.fontmeta.json");

type DialogButtonLocation = { x: number, y: number, hover: boolean, active: boolean };
export type DialogButton = DialogButtonLocation & { text: string, width: number, buttonx: number };

export default class DialogReader {
	pos: a1lib.RectLike & { legacy: boolean } | null = null;
	find(imgref?: ImgRef) {
		if (!imgref) { imgref = a1lib.captureHoldFullRs(); }
		if (!imgref) { return null; }

		var boxes: (a1lib.PointLike & { legacy: boolean })[] = [];
		for (let imgs of [imgs_rs3, imgs_leg]) {
			var pos = imgref.findSubimage(imgs.boxtl);

			for (var a in pos) {
				var p = pos[a];
				if (imgref.findSubimage(imgs.boxtr, p.x + 492, p.y, 16, 16).length != 0) {
					boxes.push({ ...p, legacy: imgs == imgs_leg });
				}
			}
		}
		if (boxes.length == 0) { return false; }
		var box = boxes[0];
		if (boxes.length > 1) { console.log("More than one dialog box found"); }

		this.pos = { x: box.x + 1, y: box.y + 1, width: 506, height: 130, legacy: box.legacy };
		return this.pos;
	}

	ensureimg(imgref: ImgRef | null | undefined) {
		if (!this.pos) { return null; }
		if (imgref && a1lib.Rect.fromArgs(imgref).contains(this.pos)) { return imgref; }
		return a1lib.captureHold(this.pos.x, this.pos.y, this.pos.width, this.pos.height);
	}

	read(imgref?: ImgRef | null | undefined) {
		imgref = this.ensureimg(imgref);
		if (!imgref) { return false; }

		let title = this.readTitle(imgref);
		var r = {
			text: null as null | string[],
			opts: null as ReturnType<DialogReader["readOptions"]>,
			title
		};
		if (this.checkDialog(imgref)) {
			r.text = this.readDialog(imgref, true);
			return r;
		}
		else {
			var opts = this.findOptions(imgref);
			if (opts.length != 0) {
				r.opts = this.readOptions(imgref, opts);
				return r;
			}
			else {
				return null;
			}
		}
	}

	readTitle(imgref: ImgRef) {
		if (!this.pos) { throw new Error("position not found yet"); }
		var buf = imgref.toData(this.pos.x, this.pos.y, this.pos.width, 32);
		//somehow y coord can change, 19 for "choose and option:" 18 for npc names
		var pos = OCR.findChar(buf, fontheavy, [255, 203, 5], Math.round(this.pos.width / 2) - 10, 16, 20, 4);
		if (!pos) { return ""; }
		var read = OCR.readSmallCapsBackwards(buf, fontheavy, [[255, 203, 5]], Math.round(this.pos.width / 2) - 10, pos.y, 150, 1);
		return read.text.toLowerCase();//normalize case since we don't actually know the original
	}

	checkDialog(imgref: ImgRef) {
		if (!this.pos) { throw new Error("position not found yet"); }
		var locs: a1lib.PointLike[] = [];
		let imgs = (this.pos.legacy ? imgs_leg : imgs_rs3);
		locs = locs.concat(imgref.findSubimage(imgs.continueimg, this.pos.x - imgref.x, this.pos.y - imgref.y, this.pos.width, this.pos.height));
		locs = locs.concat(imgref.findSubimage(imgs.continueimgdown, this.pos.x - imgref.x, this.pos.y - imgref.y, this.pos.width, this.pos.height));
		return locs.length != 0;
	}

	readDialog(imgref: ImgRef | undefined | null, checked: boolean) {
		if (!this.pos) { throw new Error("position not found yet"); }
		imgref = this.ensureimg(imgref);
		if (!imgref) { return null; }
		if (!checked) { checked = this.checkDialog(imgref); }
		if (!checked) { return null; }


		var lines: string[] = [];
		var buf = imgref.toData(this.pos.x, this.pos.y + 33, this.pos.width, 80);
		for (var y = 0; y < buf.height; y++) {
			var hastext = false;
			for (var x = 200; x < 300; x++) {
				var i = x * 4 + y * 4 * buf.width;
				if (buf.data[i] + buf.data[i + 1] + buf.data[i + 2] < 50) {
					hastext = true;
					break;
				}
			}
			if (hastext) {
				var chr: OCR.ReadCharInfo | null = null;
				chr = chr || OCR.findChar(buf, fontmono2, [0, 0, 0], 192, y + 5, 12, 3);
				chr = chr || OCR.findChar(buf, fontmono2, [0, 0, 0], 246, y + 5, 12, 3);
				chr = chr || OCR.findChar(buf, fontmono2, [0, 0, 0], 310, y + 5, 12, 3);
				if (chr) {
					var read = OCR.readLine(buf, fontmono2, [0, 0, 0], chr.x, chr.y, true, true);
					if (read.text.length >= 3) {
						lines.push(read.text);
					}
					y = chr.y + 5;
				}
			}
		}

		return lines;
	}

	findOptions(imgref: ImgRef) {
		var locs: DialogButtonLocation[] = [];
		if (!this.pos) { throw new Error("position not found yet"); }
		let imgs = (this.pos.legacy ? imgs_leg : imgs_rs3);

		var a = imgref.findSubimage(imgs.chatimg);
		for (var b in a) { locs.push({ x: a[b].x, y: a[b].y, hover: false, active: false }); }

		var a = imgref.findSubimage(imgs.chatimghover);
		for (var b in a) { locs.push({ x: a[b].x, y: a[b].y, hover: true, active: false }); }

		var a = imgref.findSubimage(imgs.chatimgactive);
		for (var b in a) { locs.push({ x: a[b].x, y: a[b].y, hover: false, active: true }); }

		return locs;
	}

	readOptions(imgref: ImgRef | null | undefined, locs: ReturnType<DialogReader["findOptions"]>) {
		imgref = this.ensureimg(imgref);
		if (!imgref) { return null; }
		if (!this.pos) { throw new Error("interface not found"); }
		var buf = imgref.toData();

		if (!locs) { locs = this.findOptions(imgref); }

		var bgcol = [150, 135, 105];
		var fontcol: OCR.ColortTriplet = this.pos.legacy ? [255, 255, 255] : [174, 208, 224];

		var r: DialogButton[] = [];
		for (var a = 0; a < locs.length; a++) {
			var dx = locs[a].x + 30;
			var dy = locs[a].y + 6;
			var checkline = imgref.toData(dx, dy, Math.min(500, imgref.width - a), 1);
			var row: typeof r[number] | null = null;
			for (var x = 0; x < checkline.width; x++) {
				var i = x * 4;

				if (row) {
					if (coldiff(checkline.data[i], checkline.data[i + 1], checkline.data[i + 2], bgcol[0], bgcol[1], bgcol[2]) < 75) {
						row.width = x + 20;
						break;
					}
				} else if (coldiff(checkline.data[i], checkline.data[i + 1], checkline.data[i + 2], fontcol[0], fontcol[1], fontcol[2]) < 380) {
					var text = "";
					var chr = OCR.findChar(buf, fontmono, fontcol, dx + x - 5 - imgref.x, dy + 3 - imgref.y, 30, 1);
					if (chr) {
						var read = OCR.readLine(buf, fontmono, fontcol, chr.x, chr.y, true, true);
						var text = read.text;
					}
					row = { text: text, x: dx + x, y: dy, width: 200, buttonx: dx - 31, hover: !!locs[a].hover, active: locs[a].active };
				}
			}
			if (row) { r.push(row); }
		}
		r.sort((a, b) => a.y - b.y);
		return r;
	}
}

//TODO get rid of this or make it standard
function coldiff(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number) {
	return Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2);
}