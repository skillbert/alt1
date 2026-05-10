import * as a1lib from "alt1/base";
import * as OCR from "alt1/ocr";
import { webpackImages, ImgRef } from "alt1/base";
import type { ColortTriplet } from "alt1/ocr";
var imgs = webpackImages({
	buff: require("./imgs/buffborder.data.png"),
	debuff: require("./imgs/debuffborder.data.png"),
	buff_alt: require("./imgs/buffborder_alt.data.png"),
	debuff_alt: require("./imgs/debuffborder_alt.data.png"),
	buff_dim: require("./imgs/buffborder_dim.data.png"),
});
var font = require("../fonts/aa_8px_new.fontmeta.json");
var font2 = require("../fonts/aa_8px_buff2.fontmeta.json");
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
		return BuffReader.readArg(this.buffer, this.bufferx + 2, this.buffery + 25, type);
	}
	readTime() {
		return BuffReader.readTime(this.buffer, this.bufferx + 2, this.buffery + 25);
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
		var poslist_alt = img.findSubimage(this.debuffs ? imgs.debuff_alt : imgs.buff_alt);
		for (var ai = 0; ai < poslist_alt.length; ai++) { poslist.push(poslist_alt[ai]); }
		if (!this.debuffs) {
			var poslist_dim = img.findSubimage(imgs.buff_dim);
			for (var di = 0; di < poslist_dim.length; di++) { poslist.push(poslist_dim[di]); }
		}
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
		this.pos = { x: best.x, y: best.y, maxhor: Math.max(5, best.n), maxver: 1 };
		return true;
	}
	getCaptRect() {
		if (!this.pos) { return null; }
		var padLeft = this.pos.x >= BuffReader.gridsize ? BuffReader.gridsize : 0;
		return new a1lib.Rect(this.pos.x - padLeft, this.pos.y, padLeft + (this.pos.maxhor + 1) * BuffReader.gridsize, (this.pos.maxver + 1) * BuffReader.gridsize);
	}
	read(buffer?: ImageData) {
		if (!this.pos) { throw new Error("no pos"); }
		var r: Buff[] = [];
		var rect = this.getCaptRect();
		if (!rect) { return null; }
		if (!buffer) { buffer = a1lib.capture(rect.x, rect.y, rect.width, rect.height); }
		var padLeft = this.pos.x - rect.x;
		var maxhor = 0;
		var maxver = 0;
		var misses = 0;
		var done = false;
		for (var ix = (padLeft > 0 ? -1 : 0); ix <= this.pos.maxhor && !done; ix++) {
			var matched = false;
			for (var iy = 0; iy <= this.pos.maxver; iy++) {
				var x = padLeft + ix * BuffReader.gridsize;
				var y = iy * BuffReader.gridsize;
				if (x + BuffReader.buffsize > buffer.width || y + BuffReader.buffsize > buffer.height) { break; }
				//Allow small tolerance for minor color variations across systems
				var match = buffer.pixelCompare((this.debuffs ? imgs.debuff : imgs.buff), x, y, 50) < 1200;
				if (!match) {
					match = buffer.pixelCompare((this.debuffs ? imgs.debuff_alt : imgs.buff_alt), x, y, 50) < 1200;
				}
				//Wider tolerance for glowing/dimmed buff borders using standard template
				if (!match && !this.debuffs) {
					match = buffer.pixelCompare(imgs.buff, x, y, 60) < 2000;
				}
				if (!match) { break; }
				matched = true;
				r.push(new Buff(buffer, x, y, this.debuffs));
				maxhor = Math.max(maxhor, ix);
				maxver = Math.max(maxver, iy);
			}
			if (!matched) { misses++; if (misses >= 2) { done = true; } }
			else { misses = 0; }
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
		for (var y = 0; y < buffimg.height; y++) {
			for (var x = 0; x < buffimg.width; x++) {
				var i1 = buffer.pixelOffset(ox + x, oy + y);
				var i2 = buffimg.pixelOffset(x, y);
				if (data2[i2 + 3] != 255) { r.skipped++; continue; }//transparent buff pixel
				var R1 = data1[i1], G1 = data1[i1 + 1], B1 = data1[i1 + 2];
				var lum = (R1 + G1 + B1) / 3;
				var maxc = Math.max(R1, G1, B1);
				var minc = Math.min(R1, G1, B1);
				var sat = maxc > 0 ? ((maxc - minc) / maxc) * 255 : 0;
				if (lum > 140 && sat < 60) { r.skipped++; continue; }//bright low-sat pixel - part of buff time text
				if (lum < 50) { r.skipped++; continue; }//dark pixel - part of buff time text shadow
				var d = a1lib.ImageDetect.coldif(data1[i1], data1[i1 + 1], data1[i1 + 2], data2[i2], data2[i2 + 1], data2[i2 + 2], 255);
				r.tested++;
				if (d > 35) {
					r.failed++;
					if (agressive) { return r; }
				}
				else {
					r.passed++;
				}
			}
		}
		return r;
	}

	static isolateBuffer(buffer: ImageData, ox: number, oy: number, buffimg: ImageData) {
		var count = BuffReader.countMatch(buffer, ox, oy, buffimg);
		if (count.passed < 50) { return; }
		var removed = 0;
		var data1 = buffer.data;
		var data2 = buffimg.data;
		for (var y = 0; y < buffimg.height; y++) {
			for (var x = 0; x < buffimg.width; x++) {
				var i1 = buffer.pixelOffset(ox + x, oy + y);
				var i2 = buffimg.pixelOffset(x, y);
				if (data2[i2 + 3] != 255) { continue; }//transparent buff pixel
				var R1 = data1[i1], G1 = data1[i1 + 1], B1 = data1[i1 + 2];
				var lum1 = (R1 + G1 + B1) / 3;
				var maxc1 = Math.max(R1, G1, B1);
				var minc1 = Math.min(R1, G1, B1);
				var sat1 = maxc1 > 0 ? ((maxc1 - minc1) / maxc1) * 255 : 0;
				//==== new buffer has text on it ====
				if ((lum1 > 140 && sat1 < 60) || lum1 < 50) {
					continue;
				}
				//==== old buf has text on it, use the new one ====
				var R2 = data2[i2], G2 = data2[i2 + 1], B2 = data2[i2 + 2];
				var lum2 = (R2 + G2 + B2) / 3;
				var maxc2 = Math.max(R2, G2, B2);
				var minc2 = Math.min(R2, G2, B2);
				var sat2 = maxc2 > 0 ? ((maxc2 - minc2) / maxc2) * 255 : 0;
				if ((lum2 > 140 && sat2 < 60) || lum2 < 50) {
					data2[i2 + 0] = data1[i1 + 0];
					data2[i2 + 1] = data1[i1 + 1];
					data2[i2 + 2] = data1[i1 + 2];
					data2[i2 + 3] = data1[i1 + 3];
					removed++;
				}
				var d = a1lib.ImageDetect.coldif(data1[i1], data1[i1 + 1], data1[i1 + 2], data2[i2], data2[i2 + 1], data2[i2 + 2], 255);
				if (d > 5) {
					data2[i2 + 0] = data2[i2 + 1] = data2[i2 + 2] = data2[i2 + 3] = 0;
					removed++;
				}
			}
		}
		if (removed > 0) { console.log(removed + " pixels remove from buff template image"); }
	}
	static readArg(buffer: ImageData, ox: number, oy: number, type: BuffTextTypes) {
		var lines: string[] = [];
		var firstResult: any = null;
		var firstResultY = oy;
		// Initial scan + oy-2 fallback
		for (var oyOff = 0; oyOff <= 2 && lines.length === 0; oyOff += 2) {
			for (var dy = -10; dy < 10; dy += 10) {
				var result = OCR.readLine(buffer, font, [255, 255, 255], ox, oy - oyOff + dy, true);
				if (result.text) {
					if (!firstResult) { firstResult = result; firstResultY = oy - oyOff + dy; }
					lines.push(result.text);
				}
			}
			if (oyOff > 0 && lines.length > 0) { oy -= oyOff; }
		}
		// Font1 retry with canBlend at offsets
		if (lines.length === 0) {
			for (var ddy = -2; ddy <= 2 && lines.length === 0; ddy++) {
				for (var ddx = 0; ddx <= 3 && lines.length === 0; ddx++) {
					var rr = OCR.readLine(buffer, font, [255, 255, 255], ox + ddx, oy + ddy, true);
					if (rr.text) { lines.push(rr.text); }
				}
			}
		}
		// Cache baseLine for reuse in decimal/second pass/m-detection/%
		var baseLine = OCR.readLine(buffer, font, [255, 255, 255], ox, oy, true);
		// Font2 system - only when font1 found <=1 char
		var joinedLen = lines.join("").length;
		if (joinedLen <= 1) {
			var botC = "", topT = "", bestParenLine = "", bestParenY = -1;
			var botColors: ColortTriplet[] = [[255, 255, 255], [210, 210, 210], [255, 255, 0], [255, 152, 31]];
			var boyMin = Math.max(0, oy - 12), boyMax = oy + 5;
			for (var bci = 0; bci < botColors.length; bci++) {
				for (var boy = boyMin; boy <= boyMax; boy++) {
					for (var bcb = 0; bcb < 2; bcb++) {
						var br = OCR.readLine(buffer, font2, botColors[bci], ox, boy, bcb === 0);
						if (!br.text) { continue; }
						// Keep longest overall for fallback
						if (br.text.length > botC.length) { botC = br.text; }
						// Check for direct parens in cleaned text (only when font1 found nothing)
						var cleaned = br.text.replace(/[^0-9mhrK%()]/g, "");
						if (joinedLen === 0 && /^\d?\(\d/.test(cleaned) && cleaned.length > bestParenLine.length) {
							if (cleaned.indexOf(")") === -1) { cleaned += ")"; }
							bestParenLine = cleaned;
							bestParenY = boy;
						}
						// Dot pattern: font2 reads "(" as "." — convert back
						if (joinedLen === 0) {
							var raw = br.text.replace(/ /g, "");
							var dp2 = (raw.length >= 4 && raw.length <= 9) ? raw.match(/^\.{2,3}(\d)\.{1,3}$/) : null;
							if (dp2) {
								var pl2 = "(" + dp2[1] + ")";
								for (var ldy = -2; ldy <= 0 && pl2[0] === "("; ldy++)
									for (var ldx2 = -1; ldx2 <= 1 && pl2[0] === "("; ldx2++) {
										var lr = OCR.readLine(buffer, font2, [255, 255, 255], ox + ldx2, boy + ldy, true);
										if (lr.text) { var lrc = lr.text.replace(/[^0-9()]/g, ""); if (/^\d\(/.test(lrc)) { pl2 = lrc[0] + pl2; } }
									}
								if (pl2.length >= bestParenLine.length) { bestParenLine = pl2; bestParenY = boy; }
							}
						}
					}
				}
			}
			// Determine timer line — scan top area with font2
			var validParens = bestParenLine && /^\d?\(\d+\)$/.test(bestParenLine);
			if (validParens) { botC = bestParenLine; }
			else {
				botC = botC.replace(/[^0-9mhrK%()]/g, "");
				if (/^\d?\(\d/.test(botC) && botC.indexOf(")") === -1) { botC += ")"; }
			}
			var topScanMin = validParens && bestParenLine[0] === "(" ? bestParenY - 12 : oy - 20;
			var topScanMax = validParens && bestParenLine[0] === "(" ? bestParenY - 8 : oy - 5;
			for (var tci = 0; tci < botColors.length; tci++) {
				for (var toy = topScanMin; toy <= topScanMax; toy++) {
					if (toy < 0) { continue; }
					var tr = OCR.readLine(buffer, font2, botColors[tci], ox, toy, true);
					if (tr.text && tr.text.length > topT.length) { topT = tr.text; }
				}
			}
			topT = topT.replace(/[^0-9mhrK%]/g, "");
			if (validParens) {
				lines = [];
				if (topT) { lines.push(topT); }
				lines.push(botC);
			} else {
				if (lines.length === 0 && topT) { lines.push(topT); }
			}
		}
		var r = { time: 0, arg: "" };
		if (type == "timearg" && lines.length > 1) { r.arg = lines.pop()!; }
		var str = lines.join("");
		if (type != "arg") {
			var m;
			if (m = str.match(/^(\d+)hr($|\s?\()/i)) { r.time = +m[1] * 60 * 60; }
			else if (m = str.match(/^(\d+)m($|\s?\()/i)) { r.time = +m[1] * 60; }
			else if (m = str.match(/^(\d+)($|\s?\()/)) { r.time = +m[1]; }
		}
		// Decimal detection (X.Y debuff timers) — skip "1" since trailing-1 handles it
		if (str.length === 1 && /[02-9]/.test(str)) {
			var baseEndX2 = baseLine.debugArea.w > 0 ? baseLine.debugArea.x + baseLine.debugArea.w : ox + 8;
			for (var dotOff = 3; dotOff <= 6; dotOff++) {
				var dotResult = OCR.readLine(buffer, font, [255, 255, 255], baseEndX2 + dotOff, oy, true);
				if (dotResult.text && /^\d$/.test(dotResult.text)) { str = str + "." + dotResult.text; break; }
			}
		}
		// Second pass - extend 1-2 digit readings using canBlend
		if (str.length >= 1 && str.length <= 2 && /^\d+$/.test(str)) {
			var endX = baseLine.debugArea.w > 0 ? baseLine.debugArea.x + baseLine.debugArea.w : ox + str.length * 7;
			var secondPassY = oy;
			if (firstResult && firstResult.fragments && firstResult.fragments.length > 0) {
				endX = firstResult.fragments[firstResult.fragments.length - 1].xend;
				secondPassY = firstResultY;
			}
			// Trailing-1: try offsets to find digit hidden by "1" shadow (canBlend then non-canBlend)
			if (str.endsWith("1")) {
				var preLen = str.length;
				for (var cb = 1; cb >= 0 && str.length === preLen; cb--)
					for (var roff = 2; roff >= 0 && str.length === preLen; roff--) {
						var rr = OCR.readLine(buffer, font, [255, 255, 255], endX + roff, secondPassY, cb === 1);
						if (rr.text && rr.text.trim() === rr.text && /^\d/.test(rr.text) && rr.text !== "1") { str += rr.text; break; }
					}
			}
			// Suffix extension
			var suffix = OCR.readLine(buffer, font, [255, 255, 255], endX, secondPassY, true);
			if (str.length === 1 && !suffix.text) {
				var sFonts = [font, font2];
				for (var soff = 0; soff <= 2 && !suffix.text; soff++)
					for (var syoff = 0; syoff <= 2 && !suffix.text; syoff++)
						for (var sfi = 0; sfi < 2 && !suffix.text; sfi++) {
							if (soff === 0 && syoff === 0 && sfi === 0) { continue; }
							suffix = OCR.readLine(buffer, sFonts[sfi], [255, 255, 255], endX + soff, secondPassY - syoff, true);
							if (suffix.text && sfi === 1) { var f2d = suffix.text.match(/^[0-9]+/); suffix = f2d ? { text: f2d[0], fragments: suffix.fragments, debugArea: suffix.debugArea } : { text: "", fragments: [], debugArea: suffix.debugArea }; }
						}
			}
			if (suffix.text) {
				if (str.length === 2) {
					if (/^[mhrK%]/.test(suffix.text)) { str += suffix.text[0]; }
					else if (str.endsWith("1") && /^\d/.test(suffix.text)) { str += suffix.text; }
				} else { str += suffix.text; }
			}
		}
		// Decimal detection for "1" — only after trailing-1 failed to extend
		if (str === "1") {
			var baseEndX = baseLine.debugArea.w > 0 ? baseLine.debugArea.x + baseLine.debugArea.w : ox + 8;
			for (var dotOff = 3; dotOff <= 6; dotOff++) {
				var dotResult = OCR.readLine(buffer, font, [255, 255, 255], baseEndX + dotOff, oy, true);
				if (dotResult.text && /^\d$/.test(dotResult.text)) {
					str = str + "." + dotResult.text;
					break;
				}
			}
		}
		// Parens scan with canBlend: stacked buffs OR single-digit/empty readings
		if ((/^\d+$/.test(str) && firstResult && firstResultY < oy) || (str.length <= 1 && /^\d?$/.test(str))) {
			for (var pry = oy - 4, spFound = false; pry <= oy + 4 && !spFound; pry++) {
				for (var prx = -1; prx <= 12 && !spFound; prx++) {
					{	var pr = OCR.readLine(buffer, font2, [255, 255, 255], ox + prx, pry, true);
						if (pr.text) {
							var prc = pr.text.replace(/[^0-9()]/g, "");
							if (/\(\d/.test(prc) && prc.indexOf(")") === -1) { prc = prc.replace(/\((\d).*/, "($1)"); }
							var prm = prc.match(/\((\d)\)/);
							if (prm) { str += "(" + prm[1] + ")"; spFound = true; }
						}
					}
				}
			}
		}
		// "m" suffix detection via stroke groups
		if (/^\d+$/.test(str) && str.length >= 1) {
			var endpointX = baseLine.debugArea.w > 0 ? baseLine.debugArea.x + baseLine.debugArea.w : ox + str.length * 7;
			var strokeGroups = 0, inBright = false, firstBrightCol = -1;
			for (var sc = 0; sc < 14; sc++) {
				var sx = endpointX + sc;
				if (sx >= buffer.width) { break; }
				var hasBright = false;
				for (var sy = oy - 2; sy <= oy + 8; sy++) {
					if (sy < 0 || sy >= buffer.height) { continue; }
					if (BuffReader.isBrightText(buffer, sx, sy)) { hasBright = true; break; }
				}
				if (hasBright) {
					if (firstBrightCol === -1) { firstBrightCol = sc; }
					if (!inBright) { strokeGroups++; inBright = true; }
				} else { inBright = false; }
			}
			// Bright icon check for single digits (prevent false "m" on stack counts)
			var isBrightIcon = false;
			if (str.length === 1) {
				var bpc = 0;
				for (var biy = oy - 20; biy < oy - 5; biy++)
					for (var bix = ox; bix < ox + 25; bix++)
						if (bix >= 0 && biy >= 0 && bix < buffer.width && biy < buffer.height && BuffReader.isBrightText(buffer, bix, biy)) { bpc++; }
				if (bpc > 60) { isBrightIcon = true; }
			}
			var mThreshold = (str.length >= 3 || (str.length === 2 && parseInt(str) >= 20)) ? 2 : 3;
			if (strokeGroups >= mThreshold && !isBrightIcon) { str += "m"; }
			// Gap digit recovery
			if (str.length === 2 && /^\d{2}$/.test(str) && firstBrightCol >= 2) {
				for (var gd = 0; gd < firstBrightCol; gd++) {
					var gc1 = OCR.readChar(buffer, font, [255, 255, 255], endpointX + gd, oy, true);
					if (gc1 && /[2-9]/.test(gc1.chr)) { str += gc1.chr; break; }
				}
			}
		}
		// "%" suffix detection
		if (/^\d{2}$/.test(str)) {
			var pctEndX = baseLine.debugArea.w > 0 ? baseLine.debugArea.x + baseLine.debugArea.w : ox + 14;
			var brightPctPix = 0;
			for (var py = oy - 2; py <= oy + 8; py++) {
				for (var px = pctEndX; px < pctEndX + 10; px++) {
					if (px < 0 || py < 0 || px >= buffer.width || py >= buffer.height) { continue; }
					if (BuffReader.isBrightText(buffer, px, py)) { brightPctPix++; }
				}
			}
			if (brightPctPix >= 80) { str += "%"; }
		}
		r.arg = str;
		return r;
	}
	private static isBrightText(buffer: ImageData, x: number, y: number): boolean {
		var i = buffer.pixelOffset(x, y);
		var R = buffer.data[i], G = buffer.data[i+1], B = buffer.data[i+2];
		var lum = (R + G + B) / 3;
		var mx = Math.max(R, G, B), mn = Math.min(R, G, B);
		return lum > 150 && (mx > 0 ? ((mx - mn) / mx) * 255 : 0) < 40;
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
