import * as a1lib from "alt1/base";
import * as OCR from "alt1/ocr";
import { webpackImages, ImgRef } from "alt1/base";

var imgs = webpackImages({
	buff: require("./imgs/buffborder.data.png"),
	debuff: require("./imgs/debuffborder.data.png"),
});

var font = require("../fonts/pixel_8px_digits.fontmeta.json");

function negmod(a: number, b: number) {
	return ((a % b) + b) % b;
}


export type BuffTextTypes = "time" | "timearg" | "arg";

export class Buff {
	isdebuff: boolean;
	buffer: ImageData;
	bufferx: number;
	buffery: number;
	constructor(buffer: ImageData, x: number, y: number, isdebuff: boolean) {
		this.buffer = buffer;
		this.bufferx = x;
		this.buffery = y;
		this.isdebuff = isdebuff;
	}
	readArg(type: BuffTextTypes) {
		return BuffReader.readArg(this.buffer, this.bufferx + 2, this.buffery + 23, type);
	}
	readTime() {
		return BuffReader.readTime(this.buffer, this.bufferx + 2, this.buffery + 23);
	}
	compareBuffer(img: ImageData) {
		return BuffReader.compareBuffer(this.buffer, this.bufferx + 1, this.buffery + 1, img);
	}
	countMatch(img: ImageData, aggressive?: boolean) {
		return BuffReader.countMatch(this.buffer, this.bufferx + 1, this.buffery + 1, img, aggressive);
	}
}

export default class BuffReader {
	pos: { x: number, y: number, maxhor: number, maxver: number } | null = null;
	debuffs = false;

	static buffsize = 27;
	static gridsize = 30;

	find(img?: ImgRef) {
		if (!img) { img = a1lib.captureHoldFullRs(); }
		if (!img) { return null; }
		var poslist = img.findSubimage(this.debuffs ? imgs.debuff : imgs.buff);
		if (poslist.length == 0) { return null; }
		type BuffPos = { n: number, x: number, y: number }
		var grids: BuffPos[] = [];
		for (var a in poslist) {
			var ongrid = false;
			for (var b in grids) {
				if (negmod(grids[b].x - poslist[a].x, BuffReader.gridsize) == 0 && negmod(grids[b].x - poslist[a].x, BuffReader.gridsize) == 0) {
					grids[b].x = Math.min(grids[b].x, poslist[a].x);
					grids[b].y = Math.min(grids[b].y, poslist[a].y);
					grids[b].n++;
					ongrid = true;
					break;
				}
			}
			if (!ongrid) { grids.push({ x: poslist[a].x, y: poslist[a].y, n: 1 }); }
		}
		var max = 0;
		var above2 = 0;
		var best: BuffPos | null = null;
		for (var a in grids) {
			console.log("buff grid [" + grids[a].x + "," + grids[a].y + "], n:" + grids[a].n);
			if (grids[a].n > max) { max = grids[a].n; best = grids[a]; }
			if (grids[a].n >= 2) { above2++; }
		}
		if (above2 > 1) { console.log("Warning, more than one possible buff bar location"); }
		if (!best) { return null; }
		this.pos = { x: best.x, y: best.y, maxhor: 5, maxver: 1 };
		return true;
	}
	getCaptRect() {
		if (!this.pos) { return null; }
		return new a1lib.Rect(this.pos.x, this.pos.y, (this.pos.maxhor + 1) * BuffReader.gridsize, (this.pos.maxver + 1) * BuffReader.gridsize);
	}
	read(buffer?: ImageData) {
		if (!this.pos) { throw new Error("no pos"); }
		var r: Buff[] = [];
		var rect = this.getCaptRect();
		if (!rect) { return null; }
		if (!buffer) { buffer = a1lib.capture(rect.x, rect.y, rect.width, rect.height); }
		var maxhor = 0;
		var maxver = 0;
		for (var ix = 0; ix <= this.pos.maxhor; ix++) {
			for (var iy = 0; iy <= this.pos.maxver; iy++) {
				var x = ix * BuffReader.gridsize;
				var y = iy * BuffReader.gridsize;

				//Have to require exact match here as we get transparency bs otherwise
				var match = buffer.pixelCompare((this.debuffs ? imgs.debuff : imgs.buff), x, y) == 0;
				if (!match) { break; }
				r.push(new Buff(buffer, x, y, this.debuffs));
				maxhor = Math.max(maxhor, ix);
				maxver = Math.max(maxver, iy);
			}
		}
		this.pos.maxhor = Math.max(5, maxhor + 2);
		this.pos.maxver = Math.max(1, maxver + 1);
		return r;
	}

	static compareBuffer(buffer: ImageData, ox: number, oy: number, buffimg: ImageData) {
		var r = BuffReader.countMatch(buffer, ox, oy, buffimg, true);
		if (r.failed > 0) { return false; }
		if (r.tested < 50) { return false; }
		return true;
	}

	static countMatch(buffer: ImageData, ox: number, oy: number, buffimg: ImageData, agressive?: boolean) {
		var r = { tested: 0, failed: 0, skipped: 0, passed: 0 };
		var data1 = buffer.data;
		var data2 = buffimg.data;
		//var debug = new ImageData(buffimg.width, buffimg.height);
		for (var y = 0; y < buffimg.height; y++) {
			for (var x = 0; x < buffimg.width; x++) {
				var i1 = buffer.pixelOffset(ox + x, oy + y);
				var i2 = buffimg.pixelOffset(x, y);

				//debug.data[i2] = 255; debug.data[i2 + 1] = debug.data[i2 + 2] = 0; debug.data[i2 + 3] = 255;
				if (data2[i2 + 3] != 255) { r.skipped++; continue; }//transparent buff pixel
				if (data1[i1] == 255 && data1[i1 + 1] == 255 && data1[i1 + 2] == 255) { r.skipped++; continue; }//white pixel - part of buff time text
				if (data1[i1] == 0 && data1[i1 + 1] == 0 && data1[i1 + 2] == 0) { r.skipped++; continue; }//black pixel - part of buff time text

				var d = a1lib.ImageDetect.coldif(data1[i1], data1[i1 + 1], data1[i1 + 2], data2[i2], data2[i2 + 1], data2[i2 + 2], 255);
				r.tested++;
				//debug.data[i2] = debug.data[i2 + 1] = debug.data[i2 + 2] = d * 10;
				if (d > 35) {
					//qw(pixelschecked); debug.show();
					r.failed++;
					if (agressive) { return r; }
				}
				else {
					r.passed++;
				}
			}
		}
		//debug.show(); qw(pixelschecked);
		return r;
	}


	static isolateBuffer(buffer: ImageData, ox: number, oy: number, buffimg: ImageData) {
		var count = BuffReader.countMatch(buffer, ox, oy, buffimg);
		if (count.passed < 50) { return; }

		var removed = 0;
		var data1 = buffer.data;
		var data2 = buffimg.data;
		//var debug = new ImageData(buffimg.width, buffimg.height);
		for (var y = 0; y < buffimg.height; y++) {
			for (var x = 0; x < buffimg.width; x++) {
				var i1 = buffer.pixelOffset(ox + x, oy + y);
				var i2 = buffimg.pixelOffset(x, y);

				//debug.data[i2] = 255; debug.data[i2 + 1] = debug.data[i2 + 2] = 0; debug.data[i2 + 3] = 255;
				if (data2[i2 + 3] != 255) { continue; }//transparent buff pixel
				//==== new buffer has text on it ====
				if (data1[i1] == 255 && data1[i1 + 1] == 255 && data1[i1 + 2] == 255 || data1[i1] == 0 && data1[i1 + 1] == 0 && data1[i1 + 2] == 0) {
					continue;
				}

				//==== old buf has text on it, use the new one ====
				if (data2[i2] == 255 && data2[i2 + 1] == 255 && data2[i2 + 2] == 255 || data2[i2] == 0 && data2[i2 + 1] == 0 && data2[i2 + 2] == 0) {
					data2[i2 + 0] = data1[i1 + 0];
					data2[i2 + 1] = data1[i1 + 1];
					data2[i2 + 2] = data1[i1 + 2];
					data2[i2 + 3] = data1[i1 + 3];
					removed++;
				}

				var d = a1lib.ImageDetect.coldif(data1[i1], data1[i1 + 1], data1[i1 + 2], data2[i2], data2[i2 + 1], data2[i2 + 2], 255);
				//debug.data[i2] = debug.data[i2 + 1] = debug.data[i2 + 2] = d * 10;
				if (d > 5) {
					//qw(pixelschecked); debug.show();
					data2[i2 + 0] = data2[i2 + 1] = data2[i2 + 2] = data2[i2 + 3] = 0;
					removed++;
				}
			}
		}
		//debug.show(); qw(pixelschecked);
		if (removed > 0) { console.log(removed + " pixels remove from buff template image"); }
	}

	static readArg(buffer: ImageData, ox: number, oy: number, type: BuffTextTypes) {
		var lines: string[] = [];
		for (var dy = -10; dy < 10; dy += 10) {//the timer can be spread to a second line at certain times (229m)
			var result = OCR.readLine(buffer, font, [255, 255, 255], ox, oy + dy, true);
			if (result.text) { lines.push(result.text); }
		}
		var r = { time: 0, arg: "" };
		if (type == "timearg" && lines.length > 1) { r.arg = lines.pop()!; }
		var str = lines.join("");
		if (type == "arg") {
			r.arg = str;
		} else {
			var m;
			if (m = str.match(/^(\d+)hr($|\s?\()/i)) { r.time = +m[1] * 60 * 60; }
			else if (m = str.match(/^(\d+)m($|\s?\()/i)) { r.time = +m[1] * 60; }
			else if (m = str.match(/^(\d+)($|\s?\()/)) { r.time = +m[1]; }
		}
		return r;
	}

	static readTime(buffer: ImageData, ox: number, oy: number) {
		return this.readArg(buffer, ox, oy, "time").time;
	}

	static matchBuff(state: Buff[], buffimg: ImageData) {
		for (var a in state) {
			if (state[a].compareBuffer(buffimg)) { return state[a]; }
		}
		return null;
	}

	static matchBuffMulti(state: Buff[], buffinfo: BuffInfo) {
		if (buffinfo.final) {//cheap way if we known exactly what we're searching for
			return BuffReader.matchBuff(state, buffinfo.imgdata);
		}
		else {//expensive way if we are not sure the template is final
			var bestindex = -1;
			var bestscore = 0;
			if (buffinfo.imgdata) {
				for (var a = 0; a < state.length; a++) {
					var count = BuffReader.countMatch(state[a].buffer, state[a].bufferx + 1, state[a].buffery + 1, buffinfo.imgdata, false);
					if (count.passed > bestscore) {
						bestscore = count.passed;
						bestindex = a;
					}
				}
			}
			if (bestscore < 50) { return null; }

			//update the isolated buff
			if (buffinfo.canimprove) {
				BuffReader.isolateBuffer(state[bestindex].buffer, state[bestindex].bufferx + 1, state[bestindex].buffery + 1, buffinfo.imgdata);
			}
			return state[bestindex];
		}
	}
}

export class BuffInfo {
	imgdata: ImageData;
	isdebuff: boolean;

	buffid: string;
	final: boolean;
	canimprove: boolean;

	constructor(imgdata: ImageData, debuff: boolean, id: string, canimprove: boolean) {
		this.imgdata = imgdata;
		this.isdebuff = debuff;

		this.buffid = id;
		this.final = !!id && !canimprove;
		this.canimprove = canimprove;
	}
}
