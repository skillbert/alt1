import * as a1lib from "alt1/base";
import * as OCR from "alt1/ocr";
import { webpackImages, ImgRef } from "alt1/base";

var imgs = webpackImages({
	buff: require("./imgs/buffborder.data.png"),
	debuff: require("./imgs/debuffborder.data.png"),
	buff_alt: require("./imgs/buffborder_alt.data.png"),
	debuff_alt: require("./imgs/debuffborder_alt.data.png"),
});

var font = require("../fonts/aa_8px_buff_digits.fontmeta.json");
font.maxspaces = 1;

function negmod(a: number, b: number) {
	return ((a % b) + b) % b;
}

// Known border colors for generating scaled templates
var BORDER_COLORS = {
	buff: [
		[78, 130, 22],   // new green
		[90, 150, 25],   // old green
	],
	debuff: [
		[177, 6, 3],     // new red
		[204, 0, 0],     // old red
	]
};

// Common RS3 UI scales: buffsize/gridsize pairs
var KNOWN_SCALES = [
	{ buffsize: 27, gridsize: 30 },  // 1080p / 100%
	{ buffsize: 32, gridsize: 35 },  // 2K / ~119%
	{ buffsize: 36, gridsize: 39 },  // ~133% (icons spaced 39px apart)
	{ buffsize: 54, gridsize: 60 },  // 4K / 200%
];

/**
 * Generates a border template at a given size with a given color.
 * 1px solid border, transparent interior - matches RS3 buff/debuff borders.
 */
function createBorderTemplate(size: number, r: number, g: number, b: number): ImageData {
	var img = new ImageData(size, size);
	var d = img.data;
	for (var y = 0; y < size; y++) {
		for (var x = 0; x < size; x++) {
			var i = (y * size + x) * 4;
			if (x === 0 || x === size - 1 || y === 0 || y === size - 1) {
				d[i] = r; d[i + 1] = g; d[i + 2] = b; d[i + 3] = 255;
			}
			// interior stays (0,0,0,0) - transparent
		}
	}
	return img;
}

/**
 * Preprocesses anti-aliased text into clean binary pixels for OCR.
 * Converts bright pixels to pure white, everything else to black.
 */
export class AntiAlias {
	static LUM_THRESHOLD = 150;

	/**
	 * Creates a full cleaned copy of a buffer where anti-aliased text
	 * is converted to binary white/black pixels for reliable OCR matching.
	 * Uses high luminance threshold (170) to filter out icon backgrounds
	 * while keeping text (~200-210 luminance).
	 * Also rejects highly saturated pixels (colored backgrounds).
	 */
	static cleanBuffer(buffer: ImageData): ImageData {
		var clean = new ImageData(buffer.width, buffer.height);
		var src = buffer.data;
		var dst = clean.data;
		// Threshold * 3 to avoid division: (r+g+b)/3 > T  ⟹  r+g+b > T*3
		var lumThresh3 = AntiAlias.LUM_THRESHOLD * 3;
		// Use Uint32Array view for fast 4-byte pixel writes
		var dst32 = new Uint32Array(dst.buffer);
		var white = 0xFFFFFFFF; // RGBA all 255
		var black = 0xFF000000; // RGB 0, A 255 (little-endian: ABGR)
		for (var i = 0, j = 0; i < src.length; i += 4, j++) {
			var r = src[i], g = src[i + 1], b = src[i + 2];
			// Branchless max/min using ternary (faster than Math.max/min)
			var maxC = r > g ? (r > b ? r : b) : (g > b ? g : b);
			var minC = r < g ? (r < b ? r : b) : (g < b ? g : b);
			dst32[j] = (r + g + b > lumThresh3 && maxC - minC < 60) ? white : black;
		}
		return clean;
	}

	/**
	 * Adaptive cleaning for a specific icon region.
	 * Finds the brightest gray pixels (text) and sets threshold relative to them.
	 * This handles icons with bright backgrounds that contaminate fixed-threshold cleaning.
	 */
	static cleanIconRegion(buffer: ImageData, ox: number, oy: number, iconSize: number, gridSize: number): ImageData {
		var clean = new ImageData(buffer.width, buffer.height);
		var src = buffer.data;
		var dst = clean.data;

		// First pass: find the peak gray luminance in the text area of this icon
		var textTop = oy - 10;
		var textBot = oy + 1;
		var textLeft = ox;
		var textRight = Math.min(ox + iconSize - 2, buffer.width);
		if (textTop < 0) textTop = 0;

		var lumValues: number[] = [];
		for (var py = textTop; py < textBot; py++) {
			for (var px = textLeft; px < textRight; px++) {
				if (px < 0 || px >= buffer.width || py < 0 || py >= buffer.height) continue;
				var si = (py * buffer.width + px) * 4;
				var r = src[si], g = src[si + 1], b = src[si + 2];
				var lum = (r + g + b) / 3;
				var sat = Math.max(r, g, b) - Math.min(r, g, b);
				if (sat < 60 && lum > 130) {
					lumValues.push(lum);
				}
			}
		}

		// Determine adaptive threshold: 75% of peak brightness
		var adaptiveThreshold = AntiAlias.LUM_THRESHOLD;
		if (lumValues.length > 3) {
			lumValues.sort((a, b) => b - a);
			// Use median of top 30% for stable peak estimate (avoids pure-white outliers)
			var topIdx = Math.max(0, Math.floor(lumValues.length * 0.3));
			var peakLum = lumValues[topIdx];
			// Threshold at 78% of peak, capped at 175 to avoid over-filtering
			adaptiveThreshold = Math.min(175, Math.max(AntiAlias.LUM_THRESHOLD, peakLum * 0.78));
		}

		// Second pass: apply adaptive threshold to the full buffer
		for (var i = 0; i < src.length; i += 4) {
			var r = src[i], g = src[i + 1], b = src[i + 2];
			var lum = (r + g + b) / 3;
			var maxC = Math.max(r, g, b);
			var minC = Math.min(r, g, b);
			var saturation = maxC - minC;
			if (lum > adaptiveThreshold && saturation < 60) {
				dst[i] = dst[i + 1] = dst[i + 2] = 255;
			} else {
				dst[i] = dst[i + 1] = dst[i + 2] = 0;
			}
			dst[i + 3] = 255;
		}
		return clean;
	}

	/**
	 * Detects if a buff icon has bright grayscale artwork that would contaminate
	 * threshold-based text cleaning. Counts pixels in the ARTWORK area (top 14 rows)
	 * that survive the standard cleaning filter (lum>150, sat<60). Icons with
	 * bright low-saturation artwork have many such pixels, while dark icons have few.
	 */
	static isBrightIcon(buffer: ImageData, ox: number, oy: number, iconSize: number): boolean {
		var src = buffer.data;
		var w = buffer.width;
		var h = buffer.height;
		var artworkPixels = 0;
		// Clamp bounds once
		var y0 = oy + 1, y1 = oy + 14;
		var x0 = ox + 1, x1 = ox + iconSize - 1;
		if (x0 < 0) x0 = 0; if (x1 > w) x1 = w;
		if (y0 < 0) y0 = 0; if (y1 > h) y1 = h;
		// lum > 150 ⟹ r+g+b > 450
		for (var py = y0; py < y1; py++) {
			var rowOff = py * w;
			for (var px = x0; px < x1; px++) {
				var i = (rowOff + px) << 2;
				var r = src[i], g = src[i + 1], b = src[i + 2];
				var maxC = r > g ? (r > b ? r : b) : (g > b ? g : b);
				var minC = r < g ? (r < b ? r : b) : (g < b ? g : b);
				if (r + g + b > 450 && maxC - minC < 60) artworkPixels++;
			}
		}
		return artworkPixels > 50;
	}

	/**
	 * Shadow-masked cleaning for bright icons.
	 * Text has a dark shadow outline (lum < 35) baked in by the game engine.
	 * Only keeps cleaned pixels that are within 2px of a shadow pixel,
	 * removing artwork pixels that lack the text shadow signature.
	 */
	static cleanBufferBright(buffer: ImageData, dilationRadius = 2): ImageData {
		var src = buffer.data;
		var w = buffer.width;
		var h = buffer.height;
		var size = w * h;

		// Pass 1: build shadow map — lum < 50 ⟹ r+g+b < 150
		var shadowMap = new Uint8Array(size);
		for (var i = 0, j = 0; i < src.length; i += 4, j++) {
			if (src[i] + src[i + 1] + src[i + 2] < 150) shadowMap[j] = 1;
		}

		// Pass 2: separable dilation — horizontal then vertical (O(n*r) instead of O(n*r²))
		var tempMap = new Uint8Array(size);
		// Horizontal pass
		for (var y = 0; y < h; y++) {
			var row = y * w;
			for (var x = 0; x < w; x++) {
				if (shadowMap[row + x]) {
					var x0 = x - dilationRadius; if (x0 < 0) x0 = 0;
					var x1 = x + dilationRadius; if (x1 >= w) x1 = w - 1;
					for (var dx = x0; dx <= x1; dx++) tempMap[row + dx] = 1;
				}
			}
		}
		// Vertical pass
		var dilated = new Uint8Array(size);
		for (var x = 0; x < w; x++) {
			for (var y = 0; y < h; y++) {
				if (tempMap[y * w + x]) {
					var y0 = y - dilationRadius; if (y0 < 0) y0 = 0;
					var y1 = y + dilationRadius; if (y1 >= h) y1 = h - 1;
					for (var dy = y0; dy <= y1; dy++) dilated[dy * w + x] = 1;
				}
			}
		}

		// Pass 3: clean with shadow mask — use Uint32Array for fast writes
		var clean = new ImageData(w, h);
		var dst32 = new Uint32Array(clean.data.buffer);
		var white = 0xFFFFFFFF;
		var black = 0xFF000000;
		var lumThresh3 = AntiAlias.LUM_THRESHOLD * 3;
		for (var i = 0, j = 0; i < src.length; i += 4, j++) {
			var r = src[i], g = src[i + 1], b = src[i + 2];
			var maxC = r > g ? (r > b ? r : b) : (g > b ? g : b);
			var minC = r < g ? (r < b ? r : b) : (g < b ? g : b);
			dst32[j] = (r + g + b > lumThresh3 && maxC - minC < 60 && dilated[j]) ? white : black;
		}
		return clean;
	}

	/**
	 * Creates a cleaned copy of a buffer region, converting anti-aliased text
	 * to binary white/black, then scales to 1x (27px icon) resolution for OCR.
	 */
	static cleanAndScale(buffer: ImageData, ox: number, oy: number, w: number, h: number, scale: number): ImageData {
		// Target size at 1x
		var tw = Math.round(w / scale);
		var th = Math.round(h / scale);
		var clean = new ImageData(tw, th);
		var src = buffer.data;
		var dst = clean.data;

		for (var ty = 0; ty < th; ty++) {
			for (var tx = 0; tx < tw; tx++) {
				var di = (ty * tw + tx) * 4;
				// Sample from source at scaled position
				var sx = ox + Math.round(tx * scale);
				var sy = oy + Math.round(ty * scale);
				if (sx < 0 || sx >= buffer.width || sy < 0 || sy >= buffer.height) {
					dst[di] = dst[di + 1] = dst[di + 2] = 0; dst[di + 3] = 255;
					continue;
				}
				var si = (sy * buffer.width + sx) * 4;
				var lum = (src[si] + src[si + 1] + src[si + 2]) / 3;
				if (lum > AntiAlias.LUM_THRESHOLD) {
					dst[di] = dst[di + 1] = dst[di + 2] = 255;
				} else {
					dst[di] = dst[di + 1] = dst[di + 2] = 0;
				}
				dst[di + 3] = 255;
			}
		}
		return clean;
	}
}


export type BuffTextTypes = "time" | "timearg" | "arg";

export class Buff {
	isdebuff: boolean;
	buffer: ImageData;
	bufferx: number;
	buffery: number;
	scale: number;
	constructor(buffer: ImageData, x: number, y: number, isdebuff: boolean, scale: number) {
		this.buffer = buffer;
		this.bufferx = x;
		this.buffery = y;
		this.isdebuff = isdebuff;
		this.scale = scale;
	}
	readArg(type: BuffTextTypes) {
		return BuffReader.readArg(this.buffer, this.bufferx + Math.round(2 * this.scale), this.buffery + Math.round(23 * this.scale), type, this.scale);
	}
	readTime() {
		return BuffReader.readTime(this.buffer, this.bufferx + Math.round(2 * this.scale), this.buffery + Math.round(23 * this.scale), this.scale);
	}
	compareBuffer(img: ImageData) {
		return BuffReader.compareBuffer(this.buffer, this.bufferx + Math.round(1 * this.scale), this.buffery + Math.round(1 * this.scale), img);
	}
	countMatch(img: ImageData, aggressive?: boolean) {
		return BuffReader.countMatch(this.buffer, this.bufferx + Math.round(1 * this.scale), this.buffery + Math.round(1 * this.scale), img, aggressive);
	}
}

export default class BuffReader {
	pos: { x: number, y: number, maxhor: number, maxver: number } | null = null;
	debuffs = false;

	/** Detected icon size (27 at 1080p, 32 at 2K, etc.) */
	buffsize = 27;
	/** Detected grid spacing (30 at 1080p, 35 at 2K, etc.) */
	gridsize = 30;
	/** Detected UI scale factor (1.0 at 1080p) */
	scale = 1.0;

	matchedBorder: ImageData | null = null;

	/**
	 * Try to find the buff/debuff bar by testing border templates at multiple scales.
	 */
	find(img?: ImgRef) {
		if (!img) { img = a1lib.captureHoldFullRs(); }
		if (!img) { return null; }

		var colorKey = this.debuffs ? "debuff" : "buff";
		var colors = BORDER_COLORS[colorKey];

		// Try each known scale
		for (var si = 0; si < KNOWN_SCALES.length; si++) {
			var ks = KNOWN_SCALES[si];

			// Try each border color variant at this scale
			for (var ci = 0; ci < colors.length; ci++) {
				var template = createBorderTemplate(ks.buffsize, colors[ci][0], colors[ci][1], colors[ci][2]);
				var poslist = img.findSubimage(template);

				if (poslist.length > 0) {
					this.buffsize = ks.buffsize;
					this.gridsize = ks.gridsize;
					this.scale = ks.buffsize / 27;
					this.matchedBorder = template;
					console.log("Matched scale: " + ks.buffsize + "x" + ks.buffsize + " (scale " + this.scale.toFixed(2) + "x) color=(" + colors[ci].join(",") + ")");

					// Grid clustering (same as original)
					return this._clusterGrid(poslist);
				}
			}
		}

		// Fallback: try the original loaded templates (exact image match)
		var primary = this.debuffs ? imgs.debuff : imgs.buff;
		var alt = this.debuffs ? imgs.debuff_alt : imgs.buff_alt;
		for (var tmpl of [primary, alt]) {
			var poslist = img.findSubimage(tmpl);
			if (poslist.length > 0) {
				this.matchedBorder = tmpl;
				this.buffsize = tmpl.width;
				this.gridsize = Math.round(tmpl.width * 30 / 27);
				this.scale = tmpl.width / 27;
				return this._clusterGrid(poslist);
			}
		}

		return null;
	}

	private _clusterGrid(poslist: { x: number, y: number }[]) {
		type BuffPos = { n: number, x: number, y: number }
		var grids: BuffPos[] = [];
		for (var a in poslist) {
			var ongrid = false;
			for (var b in grids) {
				var xmod = negmod(grids[b].x - poslist[a].x, this.gridsize);
				var ymod = negmod(grids[b].y - poslist[a].y, this.gridsize);
				// Allow ±1px tolerance in grid alignment
				if ((xmod <= 1 || xmod >= this.gridsize - 1) && (ymod <= 1 || ymod >= this.gridsize - 1)) {
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
		this.pos = { x: best.x, y: best.y, maxhor: Math.max(5, best.n - 1), maxver: 1 };
		return true;
	}

	getCaptRect() {
		if (!this.pos) { return null; }
		return new a1lib.Rect(this.pos.x, this.pos.y, (this.pos.maxhor + 1) * this.gridsize, (this.pos.maxver + 1) * this.gridsize);
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
				var x = ix * this.gridsize;
				var y = iy * this.gridsize;

				// Try matched border first, then alternates
				var match = false;
				var bordersToTry: ImageData[] = [];

				if (this.matchedBorder) bordersToTry.push(this.matchedBorder);

				// Generate alternates at detected scale
				var colorKey = this.debuffs ? "debuff" : "buff";
				var colors = BORDER_COLORS[colorKey];
				for (var ci = 0; ci < colors.length; ci++) {
					var tmpl = createBorderTemplate(this.buffsize, colors[ci][0], colors[ci][1], colors[ci][2]);
					bordersToTry.push(tmpl);
				}

				for (var ti = 0; ti < bordersToTry.length && !match; ti++) {
					try {
						match = buffer.pixelCompare(bordersToTry[ti], x, y) == 0;
						if (match) { this.matchedBorder = bordersToTry[ti]; }
					} catch (e) {
						// Out of bounds
					}
				}

				if (!match) { break; }
				r.push(new Buff(buffer, x, y, this.debuffs, this.scale));
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
		for (var y = 0; y < buffimg.height; y++) {
			for (var x = 0; x < buffimg.width; x++) {
				var i1 = buffer.pixelOffset(ox + x, oy + y);
				var i2 = buffimg.pixelOffset(x, y);

				if (data2[i2 + 3] != 255) { r.skipped++; continue; }
				if (data1[i1] == 255 && data1[i1 + 1] == 255 && data1[i1 + 2] == 255) { r.skipped++; continue; }
				if (data1[i1] == 0 && data1[i1 + 1] == 0 && data1[i1 + 2] == 0) { r.skipped++; continue; }

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

				if (data2[i2 + 3] != 255) { continue; }
				if (data1[i1] == 255 && data1[i1 + 1] == 255 && data1[i1 + 2] == 255 || data1[i1] == 0 && data1[i1 + 1] == 0 && data1[i1 + 2] == 0) {
					continue;
				}
				if (data2[i2] == 255 && data2[i2 + 1] == 255 && data2[i2 + 2] == 255 || data2[i2] == 0 && data2[i2 + 1] == 0 && data2[i2 + 2] == 0) {
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
		if (removed > 0) { console.log(removed + " pixels removed from buff template image"); }
	}

	/**
	 * Match a single character from the font at a given position in the cleaned buffer.
	 * Uses percentage-based scoring (not canblend) to tolerate anti-aliased differences.
	 * Returns { chr, score, width } or null.
	 */
	static matchCharAt(clean: ImageData, x: number, y: number, minMatch = 0.55, charScale = 1.0): { chr: string, score: number, width: number } | null {
		var d = clean.data;
		var w = clean.width;
		var h = clean.height;
		var bestChr = "";
		var bestScore = -1;
		var bestWidth = 0;
		var step = font.shadow ? 4 : 3;
		var baseY = y - Math.round(font.basey * charScale);
		var isUnit = charScale === 1.0;

		for (var ci = 0; ci < font.chars.length; ci++) {
			var fc = font.chars[ci];
			if (fc.secondary) continue;

			var matched = 0;
			var total = 0;
			var pixels = fc.pixels;
			var templateTotal = pixels.length / step;
			var minTotal = templateTotal * 0.6;

			for (var pi = 0; pi < pixels.length; pi += step) {
				// At scale 1.0, skip Math.round
				var bx = isUnit ? x + pixels[pi] : x + Math.round(pixels[pi] * charScale);
				var by = isUnit ? baseY + pixels[pi + 1] : baseY + Math.round(pixels[pi + 1] * charScale);

				if (bx < 0 || bx >= w || by < 0 || by >= h) continue;

				total++;
				// Use bitshift for *4: (by * w + bx) << 2
				if (d[(by * w + bx) << 2] > 200) matched++;
			}

			if (total < 5 || total < minTotal) continue;

			var score = matched / total;
			if (matched < 8 || matched < (total >> 1)) continue;

			var weightedScore = total >= 15 ? score : score * total / 15;

			if (score >= minMatch && weightedScore > bestScore) {
				bestScore = weightedScore;
				bestChr = fc.chr;
				bestWidth = fc.width;
			}
		}

		if (!bestChr) return null;
		return { chr: bestChr, score: bestScore, width: bestWidth };
	}

	/**
	 * Reads timer text from a buff icon. Uses column analysis to find text positions,
	 * then matches characters using percentage-based scoring on the OCR font templates.
	 * Works at any UI scale.
	 */
	static readArg(buffer: ImageData, ox: number, oy: number, type: BuffTextTypes, scale = 1.0) {
		var lines: string[] = [];
		var scaledDy = Math.round(10 * scale);

		var matchScale = 1.0;

		// Detect bright icons: derive icon position from text position
		// Bright icons have grayscale artwork that survives cleaning, producing false reads
		var iconX = ox - Math.round(2 * scale);
		var iconY = oy - Math.round(23 * scale);
		var iconSize = Math.round(27 * scale);
		var bright = AntiAlias.isBrightIcon(buffer, iconX, iconY, iconSize);
		var clean = bright ? AntiAlias.cleanBufferBright(buffer) : AntiAlias.cleanBuffer(buffer);

		// Only scan at the text baseline (dy=0)
		for (var dy = 0; dy < 1; dy += 1) {
			var readY = oy + dy;
			if (readY < 0 || readY >= buffer.height) continue;

			// Chain matchCharAt calls with search window to absorb drift
			type CharMatch = { chr: string, x: number, endX: number, score: number };
			var matches: CharMatch[] = [];
			var searchX = Math.max(0, ox - 1); // start 1px before to catch edge-aligned text
			var searchW = 6;
			var maxX = Math.min(ox + Math.round(22 * matchScale), clean.width - Math.round(6 * matchScale));
			var misses = 0;

			var maxMatches = bright ? 2 : 4;
			while (searchX < maxX && misses < 3 && matches.length < maxMatches) {
				// Try matchCharAt at positions in the search window
				var bestMatch: ReturnType<typeof BuffReader.matchCharAt> = null;
				var bestMatchX = searchX;

				var brightMinMatch = bright ? 0.80 : 0.60;
				for (var sx = searchX; sx < searchX + searchW; sx++) {
					for (var sy = readY - 2; sy <= readY + 2; sy++) {
						var m = BuffReader.matchCharAt(clean, sx, sy, brightMinMatch, matchScale);
						if (m && (!bestMatch || m.score > bestMatch.score)) {
							bestMatch = m;
							bestMatchX = sx;
						}
					}
				}

				if (bestMatch) {
					var advWidth = Math.round(bestMatch.width * matchScale);
					matches.push({ chr: bestMatch.chr, x: bestMatchX, endX: bestMatchX + advWidth, score: bestMatch.score });
					if (bestMatch.width > 7) {
						searchX = bestMatchX + advWidth;
						searchW = Math.round(3 * matchScale);
					} else {
						searchX = bestMatchX + advWidth - Math.round(2 * matchScale);
						searchW = Math.round(5 * matchScale);
					}
					misses = 0;
				} else {
					searchX += font.spacewidth;
					misses++;
				}
			}

			// Bright icon fallback: if no matches found with 2px shadow dilation,
			// retry with 3px dilation + stricter 0.90 threshold for open-curve digits like "3"
			if (bright && matches.length === 0) {
				var cleanWide = AntiAlias.cleanBufferBright(buffer, 3);
				var fallbackX = Math.max(0, ox - 1);
				var fallbackW = 6;
				var fallbackMaxX = Math.min(ox + Math.round(22 * matchScale), cleanWide.width - Math.round(6 * matchScale));
				var fallbackMisses = 0;
				while (fallbackX < fallbackMaxX && fallbackMisses < 3 && matches.length < 4) {
					var fbMatch: ReturnType<typeof BuffReader.matchCharAt> = null;
					var fbMatchX = fallbackX;
					for (var fsx = fallbackX; fsx < fallbackX + fallbackW; fsx++) {
						for (var fsy = readY - 2; fsy <= readY + 2; fsy++) {
							var fm = BuffReader.matchCharAt(cleanWide, fsx, fsy, 0.90, matchScale);
							if (fm && (!fbMatch || fm.score > fbMatch.score)) {
								fbMatch = fm;
								fbMatchX = fsx;
							}
						}
					}
					if (fbMatch) {
						var fbAdvWidth = Math.round(fbMatch.width * matchScale);
						matches.push({ chr: fbMatch.chr, x: fbMatchX, endX: fbMatchX + fbAdvWidth, score: fbMatch.score });
						fallbackX = fbMatchX + fbAdvWidth - Math.round(2 * matchScale);
						fallbackW = Math.round(5 * matchScale);
						fallbackMisses = 0;
					} else {
						fallbackX += font.spacewidth;
						fallbackMisses++;
					}
				}
			}

			// Post-hoc dot detection between matched characters
			var text = "";
			for (var mi = 0; mi < matches.length; mi++) {
				if (mi > 0) {
					var prevEnd = matches[mi - 1].endX;
					var currStart = matches[mi].x;
					// Check for an ISOLATED dot pixel between characters
					// A real dot: 1-2px wide bright spot at baseline, with dark columns on both sides
					var dotCheckStart = Math.max(0, prevEnd - 3);
					var dotCheckEnd = Math.min(clean.width - 1, currStart + 2);
					var dotFound = false;
					for (var dotX = dotCheckStart; dotX <= dotCheckEnd && !dotFound; dotX++) {
						// Check if this column has a bright pixel near baseline
						var hasBright = false;
						for (var dy2 = -1; dy2 <= 0; dy2++) {
							var checkY = readY + dy2;
							if (checkY >= 0 && checkY < clean.height) {
								var dpi = (checkY * clean.width + dotX) * 4;
								if (clean.data[dpi] > 200) { hasBright = true; break; }
							}
						}
						if (!hasBright) continue;

						// Verify isolation: column to the LEFT must be dark at baseline
						var leftDark = true;
						if (dotX > 0) {
							for (var dy3 = -1; dy3 <= 0; dy3++) {
								var ly = readY + dy3;
								if (ly >= 0 && ly < clean.height) {
									var lpi = (ly * clean.width + (dotX - 1)) * 4;
									if (clean.data[lpi] > 200) { leftDark = false; break; }
								}
							}
						}
						// Verify isolation: column to the RIGHT must be dark at baseline
						var rightDark = true;
						if (dotX + 1 < clean.width) {
							for (var dy3 = -1; dy3 <= 0; dy3++) {
								var ry = readY + dy3;
								if (ry >= 0 && ry < clean.height) {
									var rpi = (ry * clean.width + (dotX + 1)) * 4;
									if (clean.data[rpi] > 200) { rightDark = false; break; }
								}
							}
						}
						// Also check that 3 rows above is dark (not a character stroke)
						var aboveDark = true;
						var aboveY = readY - 3;
						if (aboveY >= 0) {
							var api = (aboveY * clean.width + dotX) * 4;
							if (clean.data[api] > 200) aboveDark = false;
						}

						if (leftDark && rightDark && aboveDark) {
							dotFound = true;
						}
					}
					if (dotFound) { text += "."; }
				}
				text += matches[mi].chr;
			}

			// Smart fallback: "3" vs "8" — check pixels unique to "8"
			// Only check the LAST "3" before a suffix (m/K/%) or end of text
			// The first "3" in "38m" is real; only the second (misread "8") needs conversion
			for (var mi2 = 0; mi2 < matches.length; mi2++) {
				if (matches[mi2].chr !== "3") continue;
				// Only check if this is the last digit before a suffix or end
				var nextChr = mi2 + 1 < matches.length ? matches[mi2 + 1].chr : "";
				var isLastDigit = nextChr === "m" || nextChr === "K" || nextChr === "%" || nextChr === "" || mi2 === matches.length - 1;
				if (!isLastDigit) continue;
				var matchX3 = matches[mi2].x;
				// Find "3" and "8" templates
				var t3pix: number[] | null = null;
				var t8pix: number[] | null = null;
				var t3w = 0, t8w = 0;
				for (var fci = 0; fci < font.chars.length; fci++) {
					if (font.chars[fci].chr === "3") { t3pix = font.chars[fci].pixels; t3w = font.chars[fci].width; }
					if (font.chars[fci].chr === "8") { t8pix = font.chars[fci].pixels; t8w = font.chars[fci].width; }
				}
				if (!t3pix || !t8pix) continue;

				// Build set of "3" pixel positions for fast lookup
				var step = font.shadow ? 4 : 3;
				var t3set = new Set<string>();
				for (var pi3 = 0; pi3 < t3pix.length; pi3 += step) {
					t3set.add(t3pix[pi3] + "," + t3pix[pi3 + 1]);
				}

				// Check "8"-only pixels (in "8" but NOT in "3")
				var uniqueTotal = 0, uniqueMatch = 0;
				for (var pi8 = 0; pi8 < t8pix.length; pi8 += step) {
					var key = t8pix[pi8] + "," + t8pix[pi8 + 1];
					if (t3set.has(key)) continue; // shared pixel, skip
					// This pixel is unique to "8"
					var bx8 = matchX3 + Math.round(t8pix[pi8] * matchScale);
					var by8 = readY - Math.round(font.basey * matchScale) + Math.round(t8pix[pi8 + 1] * matchScale);
					if (bx8 < 0 || bx8 >= clean.width || by8 < 0 || by8 >= clean.height) continue;
					uniqueTotal++;
					if (clean.data[(by8 * clean.width + bx8) * 4] > 200) uniqueMatch++;
				}

				// If >60% of "8"-only pixels are bright, it's "8" not "3"
				if (uniqueTotal >= 4 && uniqueMatch / uniqueTotal >= 0.60) {
					matches[mi2].chr = "8";
				}
			}

			// Rebuild text from matches after 3→8 conversions, re-inserting dots
			text = "";
			for (var mr = 0; mr < matches.length; mr++) {
				if (mr > 0) {
					var pEnd = matches[mr - 1].endX;
					var cStart = matches[mr].x;
					// Re-run dot detection between adjacent chars
					var dotCheckS = Math.max(0, pEnd - 3);
					var dotCheckE = Math.min(clean.width - 1, cStart + 2);
					var hasDot = false;
					for (var dx2 = dotCheckS; dx2 <= dotCheckE && !hasDot; dx2++) {
						for (var ddy = -1; ddy <= 0; ddy++) {
							var cy2 = readY + ddy;
							if (cy2 >= 0 && cy2 < clean.height && dx2 >= 0 && dx2 < clean.width) {
								if (clean.data[(cy2 * clean.width + dx2) * 4] > 200) {
									// Check isolation
									var ld = true, rd = true, ad = true;
									if (dx2 > 0) { for (var d3=-1;d3<=0;d3++){var ly2=readY+d3;if(ly2>=0&&ly2<clean.height){if(clean.data[(ly2*clean.width+(dx2-1))*4]>200){ld=false;break;}}}}
									if (dx2+1<clean.width) { for (var d4=-1;d4<=0;d4++){var ry2=readY+d4;if(ry2>=0&&ry2<clean.height){if(clean.data[(ry2*clean.width+(dx2+1))*4]>200){rd=false;break;}}}}
									var ay = readY - 3; if (ay>=0 && clean.data[(ay*clean.width+dx2)*4]>200) ad=false;
									if (ld && rd && ad) { hasDot = true; break; }
								}
							}
						}
					}
					if (hasDot) text += ".";
				}
				text += matches[mr].chr;
			}

			// Smart fallback: 3+ digits followed by another digit = likely "Xm" misread
			// When 3 digits + "m", the "m" at icon edge often loses to a digit
			if (/^\d{4}$/.test(text)) {
				text = text.slice(0, 3) + "m";
			}
			// Smart fallback: decimal X.7 or X.9 → check if "3" or "8" matches
			if (/^\d+\.[79]$/.test(text) && matches.length >= 2) {
				var lastDig = matches[matches.length - 1];
				// High confidence "7"/"9" match (≥0.85) = likely "7" or "8", not "3"
				// Only check "8" with relaxed threshold; skip "3" conversion
				var highConf7 = lastDig.score >= 0.85;
				if (highConf7) {
					// Only check if it's actually "8" — don't consider "3"
					for (var sx3 = lastDig.x - 1; sx3 <= lastDig.x + 1; sx3++) {
						for (var sy3 = readY - 2; sy3 <= readY + 2; sy3++) {
							var t3pix3: number[] | null = null;
							var t8pix3: number[] | null = null;
							for (var fci3 = 0; fci3 < font.chars.length; fci3++) {
								if (font.chars[fci3].chr === "3") t3pix3 = font.chars[fci3].pixels;
								if (font.chars[fci3].chr === "8") t8pix3 = font.chars[fci3].pixels;
							}
							if (t3pix3 && t8pix3) {
								var step3 = font.shadow ? 4 : 3;
								var t3set3 = new Set<string>();
								for (var p3j = 0; p3j < t3pix3.length; p3j += step3) {
									t3set3.add(t3pix3[p3j] + "," + t3pix3[p3j + 1]);
								}
								var uT3 = 0, uM3 = 0;
								for (var p8j = 0; p8j < t8pix3.length; p8j += step3) {
									var k3 = t8pix3[p8j] + "," + t8pix3[p8j + 1];
									if (t3set3.has(k3)) continue;
									var bx83 = sx3 + Math.round(t8pix3[p8j] * matchScale);
									var by83 = sy3 - Math.round(font.basey * matchScale) + Math.round(t8pix3[p8j + 1] * matchScale);
									if (bx83 < 0 || bx83 >= clean.width || by83 < 0 || by83 >= clean.height) continue;
									uT3++;
									if (clean.data[(by83 * clean.width + bx83) * 4] > 200) uM3++;
								}
								if (uT3 >= 4 && uM3 / uT3 >= 0.60) {
									text = text.slice(0, -1) + "8";
								}
							}
							break; // only check one position
						}
						break;
					}
				}
				var found3 = false;
				if (!highConf7) for (var sx3 = lastDig.x - 1; sx3 <= lastDig.x + 1 && !found3; sx3++) {
					for (var sy3 = readY - 2; sy3 <= readY + 2 && !found3; sy3++) {
						for (var fi3 = 0; fi3 < font.chars.length; fi3++) {
							var fc3 = font.chars[fi3];
							if (fc3.chr !== "3") continue;
							var m3 = 0, t3 = 0;
							for (var pi3 = 0; pi3 < fc3.pixels.length; pi3 += (font.shadow ? 4 : 3)) {
								var px3 = fc3.pixels[pi3], py3 = fc3.pixels[pi3 + 1];
								var bx3 = sx3 + Math.round(px3 * matchScale);
								var by3 = sy3 - Math.round(font.basey * matchScale) + Math.round(py3 * matchScale);
								if (bx3 < 0 || bx3 >= clean.width || by3 < 0 || by3 >= clean.height) continue;
								t3++;
								if (clean.data[(by3 * clean.width + bx3) * 4] > 200) m3++;
							}
							if (t3 >= 8 && m3 / t3 >= 0.40) {
								// Before converting to "3", check if "8" is more likely
								// using unique-pixel analysis (pixels in "8" but NOT in "3")
								var t3pix2: number[] | null = null;
								var t8pix2: number[] | null = null;
								for (var fci2 = 0; fci2 < font.chars.length; fci2++) {
									if (font.chars[fci2].chr === "3") t3pix2 = font.chars[fci2].pixels;
									if (font.chars[fci2].chr === "8") t8pix2 = font.chars[fci2].pixels;
								}
								var is8 = false;
								if (t3pix2 && t8pix2) {
									var step2 = font.shadow ? 4 : 3;
									var t3set2 = new Set<string>();
									for (var p3i = 0; p3i < t3pix2.length; p3i += step2) {
										t3set2.add(t3pix2[p3i] + "," + t3pix2[p3i + 1]);
									}
									var uTotal2 = 0, uMatch2 = 0;
									for (var p8i = 0; p8i < t8pix2.length; p8i += step2) {
										var key2 = t8pix2[p8i] + "," + t8pix2[p8i + 1];
										if (t3set2.has(key2)) continue;
										var bx82 = sx3 + Math.round(t8pix2[p8i] * matchScale);
										var by82 = sy3 - Math.round(font.basey * matchScale) + Math.round(t8pix2[p8i + 1] * matchScale);
										if (bx82 < 0 || bx82 >= clean.width || by82 < 0 || by82 >= clean.height) continue;
										uTotal2++;
										if (clean.data[(by82 * clean.width + bx82) * 4] > 200) uMatch2++;
									}
										if (uTotal2 >= 4 && uMatch2 / uTotal2 >= 0.75) {
										is8 = true;
									}
								}
								text = text.slice(0, -1) + (is8 ? "8" : "3");
								found3 = true;
							}
						}
					}
				}
			}

			if (text) { lines.push(text); }
		}

		var r = { time: 0, arg: "" };
		if (type == "timearg" && lines.length > 1) { r.arg = lines.pop()!; }
		var str = lines.join("");
		// Bright icon cleanup: strip dots and non-digit chars — bright timers are integer stack counts (1-10)
		if (bright) {
			str = str.replace(/[^0-9]/g, '');
			// Only "10" is a valid 2-digit bright value; any other 2+ digit result is noise
			if (str.length > 1 && str[0] !== "1") {
				str = str[0];
			}
		}
		// Clean up: decimal timers are always X.Y (1 digit after dot)
		str = str.replace(/^(\d+\.\d)\d*$/, '$1');
		// Clean up: "h" is only valid in "hr" pattern — strip standalone "h"
		str = str.replace(/h(?!r)/g, '');
		// Clean up: strip leading non-digits (false matches before the number)
		str = str.replace(/^[^0-9]+/, '');
		// Clean up: remove trailing false matches after valid patterns
		str = str.replace(/^(\d+[mhrK%]).*$/, '$1');
		// Clean up: strip trailing non-digit non-suffix chars
		str = str.replace(/^(\d+(?:\.\d)?(?:m|hr|K|%)?).*$/, '$1');
		if (type == "arg") {
			r.arg = str;
		} else {
			var rm;
			if (rm = str.match(/^(\d+)hr/i)) { r.time = +rm[1] * 60 * 60; }
			else if (rm = str.match(/^(\d+)m/i)) { r.time = +rm[1] * 60; }
			else if (rm = str.match(/^(\d+\.\d+)/)) { r.time = +rm[1]; }
			else if (rm = str.match(/^(\d+)/)) { r.time = +rm[1]; }
		}
		return r;
	}

	static readTime(buffer: ImageData, ox: number, oy: number, scale = 1.0) {
		return this.readArg(buffer, ox, oy, "time", scale).time;
	}

	static matchBuff(state: Buff[], buffimg: ImageData) {
		for (var a in state) {
			if (state[a].compareBuffer(buffimg)) { return state[a]; }
		}
		return null;
	}

	static matchBuffMulti(state: Buff[], buffinfo: BuffInfo) {
		if (buffinfo.final) {
			return BuffReader.matchBuff(state, buffinfo.imgdata);
		}
		else {
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
