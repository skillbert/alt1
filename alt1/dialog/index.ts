import * as a1lib from "@alt1/base";
import * as OCR from "@alt1/ocr";
import { webpackImages } from "@alt1/base/imagedetect";
import { ImgRef } from "@alt1/base";

var imgs = webpackImages({
	chatimg: require("./imgs/chatimg.data.png"),
	chatimghover: require("./imgs/chatimghover.data.png"),
	chatimgactive: require("/imgs/chatimgactive.data.png"),
	continueimg: require("/imgs/continueimg.data.png"),
	continueimgdown: require("/imgs/continueimgdown.data.png"),
	boxtl: require("/imgs/boxtl.data.png"),
	boxtr: require("/imgs/boxtr.data.png")
});

var fontmono = require("@alt1/ocr/fonts/aa_8px_mono_new.fontmeta.json");
var fontheavy = require("@alt1/ocr/fonts/aa_8px_mono_allcaps.fontmeta.json");

export default class DialogReader {
	pos: a1lib.RectLike | null = null;
	find(imgref: ImgRef) {
		if (!imgref) { imgref = a1lib.captureHoldFullRs(); }
		if (!imgref) { return null; }

		var pos = imgref.findSubimage(imgs.boxtl);

		var boxes: a1lib.PointLike[] = [];
		for (var a in pos) {
			var p = pos[a];
			if (imgref.findSubimage(imgs.boxtr, p.x + 492, p.y, 16, 16).length != 0) {
				boxes.push(p);
			}
		}
		if (boxes.length == 0) { return false; }
		var box = boxes[0];
		if (boxes.length > 1) { console.log("More than one chat box found"); }

		this.pos = new a1lib.Rect(box.x + 1, box.y + 1, 506, 130);
		return this.pos;
	}

	ensureimg(imgref: ImgRef) {
		if (!this.pos) { return null; }
		if (imgref && a1lib.Rect.fromArgs(imgref).contains(this.pos)) { return imgref; }
		return a1lib.captureHold(this.pos.x, this.pos.y, this.pos.width, this.pos.height);
	}

	read(imgref: ImgRef) {
		imgref = this.ensureimg(imgref);
		if (!imgref) { return false; }

		var r = { text: null, opts: null, title: null };
		r.title = this.readTitle(imgref);
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
		var buf = imgref.toData(this.pos.x, this.pos.y, this.pos.width, 32);
		var pos = OCR.findChar(buf, fontheavy, [255, 203, 5], Math.round(this.pos.width / 2) - 10, 16, 20, 4);
		if (!pos) { return ""; }
		var read = OCR.readLine(buf, fontheavy, [255, 203, 5], pos.x, pos.y, true, true);
		return read.text;
	}

	checkDialog(imgref: ImgRef) {
		var locs = [];
		locs = locs.concat(imgref.findSubimage(imgs.continueimg, this.pos.x - imgref.x, this.pos.y - imgref.y, this.pos.width, this.pos.height));
		locs = locs.concat(imgref.findSubimage(imgs.continueimgdown, this.pos.x - imgref.x, this.pos.y - imgref.y, this.pos.width, this.pos.height));
		return locs.length != 0;
	}

	readDialog(imgref: ImgRef, checked: boolean) {
		imgref = this.ensureimg(imgref);
		if (!imgref) { return false; }
		if (!checked) { checked = this.checkDialog(imgref); }
		if (!checked) { return false; }


		var lines = [];
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
				var chr = null;
				chr = chr || OCR.findChar(buf, fontmono, [0, 0, 0], 192, y + 5, 12, 3);
				chr = chr || OCR.findChar(buf, fontmono, [0, 0, 0], 246, y + 5, 12, 3);
				chr = chr || OCR.findChar(buf, fontmono, [0, 0, 0], 310, y + 5, 12, 3);
				if (chr) {
					var read = OCR.readLine(buf, fontmono, [0, 0, 0], chr.x, chr.y, true, true);
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
		var locs: { x: number, y: number, hover: boolean, active: boolean }[] = [];

		var a = imgref.findSubimage(imgs.chatimg);
		for (var b in a) { locs.push({ x: a[b].x, y: a[b].y, hover: false, active: false }); }

		var a = imgref.findSubimage(imgs.chatimghover);
		for (var b in a) { locs.push({ x: a[b].x, y: a[b].y, hover: true, active: false }); }

		var a = imgref.findSubimage(imgs.chatimgactive);
		for (var b in a) { locs.push({ x: a[b].x, y: a[b].y, hover: false, active: true }); }

		return locs;
	}

	readOptions(imgref: ImgRef, locs: ReturnType<typeof DialogReader["prototype"]["findOptions"]>) {
		imgref = this.ensureimg(imgref);
		if (!imgref) { return false; }
		var buf = imgref.toData();

		if (!locs) { locs = this.findOptions(imgref); }

		var props = {
			normal: { col: [194, 70, 21], gap: 33 },
			hover: { col: [255, 94, 31], gap: 25 },
			active: { col: [190, 57, 6], gap: 33 }
		};
		var r: ((typeof locs)[number] & { text: string, width: number, buttonx: number })[] = [];
		for (var a = 0; a < locs.length; a++) {
			var dx = locs[a].x + 30;
			var dy = locs[a].y + 6;
			var checkline = imgref.toData(dx, dy, Math.min(500, imgref.width - a), 1);
			var row: typeof r[number] | null = null;
			for (var x = 0; x < checkline.width; x++) {
				var i = x * 4;
				var prop = props[(locs[a].hover ? "hover" : (locs[a].active ? "active" : "normal"))];

				if (coldiff(checkline.data[i], checkline.data[i + 1], checkline.data[i + 2], prop.col[0], prop.col[1], prop.col[2]) < 50) {
					if (row) { row.width = x + prop.gap; }
					break;
				}

				if (!row && coldiff(checkline.data[i], checkline.data[i + 1], checkline.data[i + 2], 174, 208, 224) < 100) {
					var text = "";
					var chr = OCR.findChar(buf, fontmono, [174, 208, 224], dx + x + 2 - imgref.x, dy + 3 - imgref.y, 30, 1);
					if (chr) {
						var read = OCR.readLine(buf, fontmono, [174, 208, 224], chr.x, chr.y, true, true);
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