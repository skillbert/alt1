import { ImageData, RectLike, Rect } from "alt1/base";

export type TextFragment = {
	text: string,
	color: ColortTriplet,
	index: number,
	xstart: number,
	xend: number
};
export type Charinfo = {
	width: number,
	chr: string,
	bonus: number,
	secondary: boolean,
	pixels: number[]
};
export type FontDefinition = {
	chars: Charinfo[],
	width: number,
	spacewidth: number,
	shadow: boolean,
	height: number,
	basey: number,
	minrating?: number,
	maxspaces?: number
};
export type ColortTriplet = [number, number, number];

export var debug = {
	printcharscores: false,
	trackread: false
};

type Chardebug = { chr: string, rawscore: number, score: number, img: ImageData };
export var debugout = {} as { [id: string]: Chardebug[] };

/**
 * draws the font definition to a buffer and displays it in the dom for debugging purposes
 * @param font
 */
export function debugFont(font: FontDefinition) {
	var spacing = font.width + 2;
	var buf = new ImageData(spacing * font.chars.length, font.height + 1);
	for (var a = 0; a < buf.data.length; a += 4) {
		buf.data[a] = buf.data[a + 1] = buf.data[a + 2] = 0;
		buf.data[a + 3] = 255;
	}
	for (var a = 0; a < font.chars.length; a++) {
		var bx = a * spacing;
		var chr = font.chars[a];
		for (var b = 0; b < chr.pixels.length; b += (font.shadow ? 4 : 3)) {
			buf.setPixel(bx + chr.pixels[b], chr.pixels[b + 1], [chr.pixels[b + 2], chr.pixels[b + 2], chr.pixels[b + 2], 255]);
			if (font.shadow) {
				buf.setPixel(bx + chr.pixels[b], chr.pixels[b + 1], [chr.pixels[b + 3], 0, 0, 255]);
			}
		}
	}
	buf.show()
}

export function unblendBlackBackground(img: ImageData, r: number, g: number, b: number) {
	var rimg = new ImageData(img.width, img.height);
	for (var i = 0; i < img.data.length; i += 4) {
		var col = decomposeblack(img.data[i], img.data[i + 1], img.data[i + 2], r, g, b);
		rimg.data[i + 0] = col[0] * 255;
		rimg.data[i + 1] = rimg.data[i + 0];
		rimg.data[i + 2] = rimg.data[i + 0];
		rimg.data[i + 3] = 255;
	}
	return rimg;
}

/**
 * unblends a imagebuffer into match strength with given color
 * the bgimg argument should contain a second image with pixel occluded by the font visible.
 * @param img 
 * @param shadow detect black as second color
 * @param bgimg optional second image to 
 */
export function unblendKnownBg(img: ImageData, bgimg: ImageData, shadow: boolean, r: number, g: number, b: number) {
	if (bgimg && (img.width != bgimg.width || img.height != bgimg.height)) { throw "bgimg size doesn't match"; }
	var rimg = new ImageData(img.width, img.height);
	var totalerror = 0;
	for (var i = 0; i < img.data.length; i += 4) {
		var col = decompose2col(img.data[i], img.data[i + 1], img.data[i + 2], r, g, b, bgimg.data[i + 0], bgimg.data[i + 1], bgimg.data[i + 2]);
		if (shadow) {
			if (col[2] > 0.01) { console.log("high error component: " + (col[2] * 100).toFixed(1) + "%"); }
			totalerror += col[2];
			var m = 1 - col[1] - Math.abs(col[2]);//main color+black=100%-bg-error
			rimg.data[i + 0] = m * 255;
			rimg.data[i + 1] = col[0] / m * 255;
			rimg.data[i + 2] = rimg.data[i + 0];
		} else {
			rimg.data[i + 0] = col[0] * 255;
			rimg.data[i + 1] = rimg.data[i + 0];
			rimg.data[i + 2] = rimg.data[i + 0];
		}
		rimg.data[i + 3] = 255;
	}
	return rimg;
}

/**
 * Unblends a font image that is already conpletely isolated to the raw image used ingame. This is the easiest mode for pixel fonts where alpha is 0 or 255, or for extracted font files.
 * @param img
 * @param r
 * @param g
 * @param b
 * @param shadow whether the font has a black shadow
 */
export function unblendTrans(img: ImageData, shadow: boolean, r: number, g: number, b: number) {
	var rimg = new ImageData(img.width, img.height);
	var pxlum = r + g + b;
	for (var i = 0; i < img.data.length; i += 4) {
		if (shadow) {
			var lum = img.data[i + 0] + img.data[i + 1] + img.data[i + 2];
			rimg.data[i + 0] = img.data[i + 3];
			rimg.data[i + 1] = lum / pxlum * 255;
			rimg.data[i + 2] = rimg.data[i + 0];
		} else {
			rimg.data[i + 0] = img.data[i + 3];
			rimg.data[i + 1] = rimg.data[i + 0];
			rimg.data[i + 2] = rimg.data[i + 0];
		}
		rimg.data[i + 3] = 255;
	}
	return rimg;
}

/**
 * Determised wether color [rgb]m can be a result of a blend with color [rgb]1 that is p (0-1) of the mix
 * It returns the number that the second color has to lie outside of the possible color ranges
 * @param rm resulting color
 * @param r1 first color of the mix (the other color is unknown)
 * @param p the portion of the [rgb]1 in the mix (0-1)
 */
export function canblend(rm: number, gm: number, bm: number, r1: number, g1: number, b1: number, p: number) {
	var m = Math.min(50, p / (1 - p));
	var r = rm + (rm - r1) * m;
	var g = gm + (gm - g1) * m;
	var b = bm + (bm - b1) * m;
	return Math.max(0, -r, -g, -b, r - 255, g - 255, b - 255);
}


/**
 * decomposes a color in 2 given component colors and returns the amount of each color present
 * also return a third (noise) component which is the the amount leftover orthagonal from the 2 given colors
 */
export function decompose2col(rp: number, gp: number, bp: number, r1: number, g1: number, b1: number, r2: number, g2: number, b2: number) {
	//get the normal of the error (cross-product of both colors)
	var r3 = g1 * b2 - g2 * b1;
	var g3 = b1 * r2 - b2 * r1;
	var b3 = r1 * g2 - r2 * g1;

	//normalize to length 255
	var norm = 255 / Math.sqrt(r3 * r3 + g3 * g3 + b3 * b3);
	r3 *= norm;
	g3 *= norm;
	b3 *= norm;

	return decompose3col(rp, gp, bp, r1, g1, b1, r2, g2, b2, r3, g3, b3);
}

/**
 * decomposes a pixel in a given color component and black and returns what proportion of the second color it contains
 * this is not as formal as decompose 2/3 and only give a "good enough" number
 */
export function decomposeblack(rp: number, gp: number, bp: number, r1: number, g1: number, b1: number) {
	var dr = Math.abs(rp - r1);
	var dg = Math.abs(gp - g1);
	var db = Math.abs(bp - b1);
	var maxdif = Math.max(dr, dg, db);
	return [1 - maxdif / 255];
}

/**
 * decomposes a color in 3 given component colors and returns the amount of each color present
 */
export function decompose3col(rp: number, gp: number, bp: number, r1: number, g1: number, b1: number, r2: number, g2: number, b2: number, r3: number, g3: number, b3: number) {
	//P=x*C1+y*C2+z*C3
	//assemble as matrix 
	//M*w=p
	//get inverse of M
	//dirty written out version of cramer's rule
	var A = g2 * b3 - b2 * g3;
	var B = g3 * b1 - b3 * g1;
	var C = g1 * b2 - b1 * g2;

	var D = b2 * r3 - r2 * b3;
	var E = b3 * r1 - r3 * b1;
	var F = b1 * r2 - r1 * b2;

	var G = r2 * g3 - g2 * r3;
	var H = r3 * g1 - g3 * r1;
	var I = r1 * g2 - g1 * r2;

	var det = r1 * A + g1 * D + b1 * G;

	//M^-1*p=w
	var x = (A * rp + D * gp + G * bp) / det;
	var y = (B * rp + E * gp + H * bp) / det;
	var z = (C * rp + F * gp + I * bp) / det;

	return [x, y, z];
}

/**
 * brute force to the exact position of the text
 */
export function findChar(buffer: ImageData, font: FontDefinition, col: ColortTriplet, x: number, y: number, w: number, h: number) {
	if (x < 0) { return null; }
	if (y - font.basey < 0) { return null; }
	if (x + w + font.width > buffer.width) { return null; }
	if (y + h - font.basey + font.height > buffer.height) { return null; }

	var best = 1000;//TODO finetune score constants
	var bestchar: ReadCharInfo | null = null;
	for (var cx = x; cx < x + w; cx++) {
		for (var cy = y; cy < y + h; cy++) {
			var chr = readChar(buffer, font, col, cx, cy, false, false);
			if (chr != null && chr.sizescore < best) {
				best = chr.sizescore;
				bestchar = chr;
			}
		}
	}
	return bestchar;
}

/**
 * reads text with unknown exact coord or color. The given coord should be inside the text
 * color selection not implemented yet
 */
export function findReadLine(buffer: ImageData, font: FontDefinition, cols: ColortTriplet[], x: number, y: number, w = -1, h = -1) {
	if (w == -1) { w = font.width + font.spacewidth; x -= Math.ceil(w / 2); }
	if (h == -1) { h = 7; y -= 1; }
	var chr: ReturnType<typeof findChar> = null;
	if (cols.length > 1) {
		//TODO use getChatColor() instead for non-mono?
		var sorted = getChatColorMono(buffer, new Rect(x, y - font.basey, w, h), cols);
		//loop until we have a match (max 2 cols)
		for (var a = 0; a < 2 && a < sorted.length && chr == null; a++) {
			chr = findChar(buffer, font, sorted[a].col, x, y, w, h);
		}
	}
	else {
		chr = findChar(buffer, font, cols[0], x, y, w, h);
	}
	if (chr == null) { return { debugArea: { x, y, w, h }, text: "", fragments: [] } as ReturnType<typeof readLine>; }
	return readLine(buffer, font, cols, chr.x, chr.y, true, true);
}

export function getChatColorMono(buf: ImageData, rect: RectLike, colors: ColortTriplet[]) {
	var colormap = colors.map(c => ({ col: c, score: 0 }));
	if (rect.x < 0 || rect.y < 0 || rect.x + rect.width > buf.width || rect.y + rect.height > buf.height) { return colormap; }
	var data = buf.data;
	var maxd = 50;
	for (var colobj of colormap) {
		var score = 0;
		var col = colobj.col;
		for (var y = rect.y; y < rect.y + rect.height; y++) {
			for (var x = rect.x; x < rect.x + rect.width; x++) {
				var i = x * 4 + y * 4 * buf.width;
				var d = Math.abs(data[i] - col[0]) + Math.abs(data[i + 1] - col[1]) + Math.abs(data[i + 2] - col[2]);
				if (d < maxd) { score += maxd - d; }
			}
		}
		colobj.score = score;
	}
	return colormap.sort((a, b) => b.score - a.score);
}


function unblend(r: number, g: number, b: number, R: number, G: number, B: number) {
	var m = Math.sqrt(r * r + g * g + b * b);
	var n = Math.sqrt(R * R + G * G + B * B);

	var x = (r * R + g * G + b * B) / n;
	var y = Math.sqrt(Math.max(0, m * m - x * x));

	var r1 = Math.max(0, (63.75 - y) * 4);
	var r2 = x / n * 255;

	if (r2 > 255)//brighter than refcol
	{
		r1 = Math.max(0, r1 - r2 + 255);
		r2 = 255;
	}

	return [r1, r2];
}


export function getChatColor(buf: ImageData, rect: RectLike, colors: ColortTriplet[]) {
	var bestscore = -1.0;
	var best: null | ColortTriplet = null;
	var b2 = 0.0;
	var data = buf.data;
	for (let col of colors) {
		var score = 0.0;
		for (var y = rect.y; y < rect.y + rect.height; y++) {
			for (var x = rect.x; x < rect.x + rect.width; x++) {
				if (x < 0 || x + 1 >= buf.width) { continue; }
				if (y < 0 || y + 1 >= buf.width) { continue; }
				let i1 = buf.pixelOffset(x, y);
				let i2 = buf.pixelOffset(x + 1, y + 1);
				var pixel1 = unblend(data[i1 + 0], data[i1 + 1], data[i1 + 2], col[0], col[1], col[2]);
				var pixel2 = unblend(data[i2 + 0], data[i2 + 1], data[i2 + 2], col[0], col[1], col[2]);
				//TODO this is from c# can simplify a bit
				var s = (pixel1[0] / 255 * pixel1[1] / 255) * (pixel2[0] / 255 * (255.0 - pixel2[1]) / 255);
				score += s;
			}
		}
		if (score > bestscore) { b2 = bestscore; bestscore = score; best = col; }
		else if (score > b2) { b2 = score; }
	}
	//Console.WriteLine("color: " + bestcol + " - " + (bestscore - b2));
	//bestscore /= rect.width * rect.height;
	return best;
}

/**
 * reads a line of text with exactly known position and color. y should be the y coord of the text base line, x should be the first pixel of a new character
 */
export function readLine(buffer: ImageData, font: FontDefinition, colors: ColortTriplet | ColortTriplet[], x: number, y: number, forward: boolean, backward = false) {
	if (typeof colors[0] != "number" && colors.length == 1) { colors = colors[0] as ColortTriplet; }
	var multicol = typeof colors[0] != "number";
	var allcolors: ColortTriplet[] = multicol ? colors as ColortTriplet[] : [colors as ColortTriplet];

	var detectcolor = function (sx: number, sy: number, backward: boolean) {
		var w = Math.floor(font.width * 1.5);
		if (backward) { sx -= w; }
		sy -= font.basey;
		return getChatColor(buffer, { x: sx, y: sy, width: w, height: font.height }, allcolors);
	}

	var fragments: TextFragment[] = [];
	var x1 = x;
	var x2 = x;
	var maxspaces = (typeof font.maxspaces == "number" ? font.maxspaces : 1);

	let fragtext = "";
	let fraghadprimary = false;
	var lastcol: ColortTriplet | null = null;
	let addfrag = (forward: boolean) => {
		if (!fragtext) { return; }
		let frag: TextFragment = {
			text: fragtext,
			color: lastcol!,
			index: 0,
			xstart: x + (forward ? fragstartdx : fragenddx),
			xend: x + (forward ? fragenddx : fragstartdx)
		};
		if (forward) { fragments.push(frag); }
		else { fragments.unshift(frag); }
		fragtext = "";
		fragstartdx = dx;
		fraghadprimary = false;
	}

	for (var dirforward of [true, false]) {
		//init vars
		if (dirforward && !forward) { continue; }
		if (!dirforward && !backward) { continue; }

		var dx = 0;
		var fragstartdx = dx;
		var fragenddx = dx;
		var triedspaces = 0;
		var triedrecol = false;
		var col = multicol ? null : colors as ColortTriplet;

		while (true) {
			col = col || detectcolor(x + dx, y, !dirforward);
			var chr = (col ? readChar(buffer, font, col, x + dx, y, !dirforward, true) : null);
			if (col == null || chr == null) {
				if (triedspaces < maxspaces) {
					dx += (dirforward ? 1 : -1) * font.spacewidth;
					triedspaces++;
					continue;
				}
				if (multicol && !triedrecol && fraghadprimary) {
					dx -= (dirforward ? 1 : -1) * triedspaces * font.spacewidth;
					triedspaces = 0;
					col = null;
					triedrecol = true;
					continue;
				}
				if (dirforward) { x2 = x + dx - font.spacewidth; }
				else { x1 = x + dx + font.spacewidth; }
				break;
			} else {
				if (lastcol && (col[0] != lastcol[0] || col[1] != lastcol[1] || col[2] != lastcol[2])) {
					addfrag(dirforward);
				}
				var spaces = "";
				for (var a = 0; a < triedspaces; a++) { spaces += " "; }
				if (dirforward) { fragtext += spaces + chr.chr; }
				else { fragtext = chr.chr + spaces + fragtext; }
				if (!chr.basechar.secondary) { fraghadprimary = true; }
				triedspaces = 0;
				triedrecol = false;
				dx += (dirforward ? 1 : -1) * chr.basechar.width;
				fragenddx = dx;
				lastcol = col;
			}
		}
		if (lastcol && fraghadprimary) { addfrag(dirforward); }
	}

	fragments.forEach((f, i) => f.index = i);

	return {
		debugArea: { x: x1, y: y - 9, w: x2 - x1, h: 10 },
		text: fragments.map(f => f.text).join(""),
		fragments
	};
}

/**
 * Reads a line of text that uses a smallcaps font, these fonts can have duplicate chars that only have a different amount of 
 * empty space after the char before the next char starts. 
 * The coordinates should be near the end of the string, or a rectangle with high 1 containing all points where the string can end.
 */
export function readSmallCapsBackwards(buffer: ImageData, font: FontDefinition, cols: ColortTriplet[], x: number, y: number, w = -1, h = -1) {
	if (w == -1) { w = font.width + font.spacewidth; x -= Math.ceil(w / 2); }
	if (h == -1) { h = 7; y -= 1; }
	var matchedchar: ReadCharInfo | null = null;
	var sorted = (cols.length == 1 ? [{ col: cols[0], score: 1 }] : getChatColorMono(buffer, new Rect(x, y - font.basey, w, h), cols));
	//loop until we have a match (max 2 cols)
	for (var a = 0; a < 2 && a < sorted.length && matchedchar == null; a++) {
		for (var cx = x + w - 1; cx >= x; cx--) {
			var best = 1000;//TODO finetune score constants
			var bestchar: ReadCharInfo | null = null;
			for (var cy = y; cy < y + h; cy++) {
				var chr = readChar(buffer, font, sorted[a].col, cx, cy, true, false);
				if (chr != null && chr.sizescore < best) {
					best = chr.sizescore;
					bestchar = chr;
				}
			}
			if (bestchar) {
				matchedchar = bestchar;
				break;
			}
		}
	}
	if (matchedchar == null) { return { text: "", debugArea: { x, y, w, h } }; }
	return readLine(buffer, font, cols, matchedchar.x, matchedchar.y, false, true);
}
/**
 * Reads a single character at the exact given location
 * @param x exact x location of the start of the character domain (includes part of the spacing between characters)
 * @param y exact y location of the baseline pixel of the character
 * @param backwards read in backwards direction, the x location should be the first pixel after the character domain in that case
 */
export function readChar(buffer: ImageData, font: FontDefinition, col: ColortTriplet, x: number, y: number, backwards: boolean, allowSecondary?: boolean): ReadCharInfo | null {
	y -= font.basey;
	var shiftx = 0;
	var shifty = font.basey;
	var shadow = font.shadow;
	var debugobj: Chardebug[] | null = null;
	var debugimg: ImageData | null = null;
	if (debug.trackread) {
		var name = x + ";" + y + " " + JSON.stringify(col);
		if (!debugout[name]) { debugout[name] = []; }
		debugobj = debugout[name];
	}

	//===== make sure the full domain is inside the bitmap/buffer ======
	if (y < 0 || y + font.height >= buffer.height) { return null; }
	if (!backwards) {
		if (x < 0 || x + font.width > buffer.width) { return null; }
	}
	else {
		if (x - font.width < 0 || x > buffer.width) { return null; }
	}

	//====== start reading the char ======
	var scores: { score: number, sizescore: number, chr: Charinfo }[] = [];
	charloop: for (var chr = 0; chr < font.chars.length; chr++) {
		var chrobj = font.chars[chr];
		if (chrobj.secondary && !allowSecondary) { continue; }
		const scoreobj = { score: 0, sizescore: 0, chr: chrobj };
		var chrx = (backwards ? x - chrobj.width : x);


		if (debug.trackread) {
			debugimg = new ImageData(font.width, font.height);
		}

		for (var a = 0; a < chrobj.pixels.length;) {
			var i = (chrx + chrobj.pixels[a]) * 4 + (y + chrobj.pixels[a + 1]) * buffer.width * 4;
			var penalty = 0;
			if (!shadow) {
				penalty = canblend(buffer.data[i], buffer.data[i + 1], buffer.data[i + 2], col[0], col[1], col[2], chrobj.pixels[a + 2] / 255);
				a += 3;
			}
			else {
				var lum = chrobj.pixels[a + 3] / 255;
				penalty = canblend(buffer.data[i], buffer.data[i + 1], buffer.data[i + 2], col[0] * lum, col[1] * lum, col[2] * lum, chrobj.pixels[a + 2] / 255);
				a += 4;
			}
			scoreobj.score += penalty;

			// Short circuit the loop as soon as the penalty threshold (400) is reached
			if (!debugobj && scoreobj.score > 400) {
				continue charloop; 
			}

			//TODO add compiler flag to this to remove it for performance
			if (debugimg) { debugimg.setPixel(chrobj.pixels[a], chrobj.pixels[a + 1], [penalty, penalty, penalty, 255]); }
		}
		scoreobj.sizescore = scoreobj.score - chrobj.bonus;
		if (debugobj) { debugobj.push({ chr: chrobj.chr, score: scoreobj.sizescore, rawscore: scoreobj.score, img: debugimg! }); }
		scores.push(scoreobj)
	}

	if (debug.printcharscores) {
		scores.sort((a, b) => a.sizescore - b.sizescore);
		scores.slice(0, 5).forEach(q => console.log(q.chr.chr, q.score.toFixed(3), q.sizescore.toFixed(3)));
	}

	let winchr: (typeof scores)[number] | null = null

	for (const chrscore of scores) {
		if (!winchr || (chrscore && chrscore.sizescore < winchr.sizescore)) winchr = chrscore
	}

	if (!winchr || winchr.score > 400) { return null; }

	return { chr: winchr.chr.chr, basechar: winchr.chr, x: x + shiftx, y: y + shifty, score: winchr.score, sizescore: winchr.sizescore };
}
export type ReadCharInfo = { chr: string, basechar: Charinfo, x: number, y: number, score: number, sizescore: number };

export type GenerateFontMeta = {
	/**
	 * The y-coord inside the sprite that is used as y-coord later when reading, usually the lowest pixel that that all characters have in common
	 */
	basey: number,
	/**
	 * Number of pixels to skip when reading a space character
	 */
	spacewidth: number,
	/**
	 * number between 0 and 1 that indicates how close to the text color a pixels needs to be before being used in detection, 1 means it needs to match perfectly. usually ~0.6 when there is good contrast with the text background and up to 0.8 when contrast is bad.
	 */
	treshold: number,
	/**
	 * Text color in the template image, can usually be found by looking for the brightest pixel or the text pixel corresponding to a pure black shadow pixel
	 */
	color: [number, number, number],
	/**
	 * Whether the text has a black drop-shadow in the template image. Shadowed fonts are way more robust to detect when background contrast is bad
	 */
	shadow: boolean,
	/**
	 * The characters in the template image typed out as a string in the same order as the template
	 */
	chars: string,
	/**
	 * a string containing "secondary" characters, usually small characters like `,.;'"`. Secondary characters will only get matched when nothing else matches and won't get used to find the position of text 
	 */
	seconds: string
	/**
	 * You can make some characters slightly more or less likely to match over other using this map. a nudge of +50 is usually enough to fix problems between n and r for example. Set OCR.debug to true to see internal characters scores when reading text
	 */
	bonus?: { [char: string]: number },
	/**
	 * How to interpret and remove the background from the template image.
	 * - `removebg`: Template image height is 2n+1 pixels arranged as: n pixels character screenshots, 1 pixel black/white character boundary followed by n pixels of best estimate of the background behind the characters in the first n pixels
	 * - `raw`: The background is already removed and applying standard alpha blending to the template gives identical results as in-game. The last row of pixels is black/white corresponding to character boundaries again
	 * - `blackbg`: Only works when shadow=false, the template text is placed on a black background. Last row of pixels indicated character boundaries again.
	 */
	unblendmode: "removebg" | "raw" | "blackbg",
	/**
	 * unused, for later reference
	 */
	spriteid?: number
};

export function loadFontImage(img: ImageData, meta: GenerateFontMeta) {
	var bg: ImageData | null = null;
	var pxheight = img.height - 1;
	if (meta.unblendmode == "removebg") { pxheight /= 2; }


	var inimg = img.clone({ x: 0, y: 0, width: img.width, height: pxheight });
	var outimg: ImageData;
	if (meta.unblendmode == "removebg") {
		bg = img.clone({ x: 0, y: pxheight + 1, width: img.width, height: pxheight });
		outimg = unblendKnownBg(inimg, bg, meta.shadow, meta.color[0], meta.color[1], meta.color[2]);
	} else if (meta.unblendmode == "raw") {
		outimg = unblendTrans(inimg, meta.shadow, meta.color[0], meta.color[1], meta.color[2]);
	} else if (meta.unblendmode == "blackbg") {
		outimg = unblendBlackBackground(inimg, meta.color[0], meta.color[1], meta.color[2])
	} else {
		throw new Error("no unblend mode");
	}
	var unblended = new ImageData(img.width, pxheight + 1);
	outimg.copyTo(unblended, 0, 0, outimg.width, outimg.height, 0, 0);
	img.copyTo(unblended, 0, pxheight, img.width, 1, 0, pxheight);

	return generateFont(unblended, meta.chars, meta.seconds, meta.bonus || {}, meta.basey, meta.spacewidth, meta.treshold, meta.shadow);
}

/**
 * Generates a font json description to use in reader functions
 * @param unblended A source image with all characters lined up. The image should be unblended into components using the unblend functions
 * The lowest pixel line of this image is used to mark the location and size of the charecters if the red component is 255 it means there is a character on that pixel column
 * @param chars A string containing all the characters of the image in the same order
 * @param seconds A string with characters that are considered unlikely and should only be detected if no other character is possible.
 * For example the period (.) character matches positive inside many other characters and should be marked as secondary
 * @param bonusses An object that contains bonus scores for certain difficult characters to make the more likely to be red.
 * @param basey The y position of the baseline pixel of the font
 * @param spacewidth the number of pixels a space takes
 * @param treshold minimal color match proportion (0-1) before a pixel is used for the font
 * @param shadow whether this font also uses the black shadow some fonts have. The "unblended" image should be unblended correspondingly
 * @returns a javascript object describing the font which is used as input for the different read functions
 */
export function generateFont(unblended: ImageData, chars: string, seconds: string, bonusses: { [char: string]: number }, basey: number, spacewidth: number, treshold: number, shadow: boolean): FontDefinition {
	//settings vars
	treshold *= 255;

	//initial vars
	var miny = unblended.height - 1;
	var maxy = 0;
	var font = { chars: [] as Charinfo[], width: 0, spacewidth: spacewidth, shadow: shadow, height: 0, basey: 0 };
	var ds: false | number = false;

	type internalcharinfo = Charinfo & { ds: number, de: number };

	var chardata: internalcharinfo[] = [];
	//index all chars
	for (var dx = 0; dx < unblended.width; dx++) {
		var i = 4 * dx + 4 * unblended.width * (unblended.height - 1);

		if (unblended.data[i] == 255 && unblended.data[i + 3] == 255) {
			if (ds === false) { ds = dx; }
		}
		else {
			if (ds !== false) {
				//char found, start detection
				var de = dx;
				var char = chars[chardata.length];
				var chr: internalcharinfo = {
					ds: ds,
					de: de,
					width: de - ds,
					chr: char,
					bonus: (bonusses && bonusses[char]) || 0,
					secondary: seconds.indexOf(chars[chardata.length]) != -1,
					pixels: []
				};
				chardata.push(chr);
				font.width = Math.max(font.width, chr.width);

				for (x = 0; x < de - ds; x++) {
					for (y = 0; y < unblended.height - 1; y++) {
						var i = (x + ds) * 4 + y * unblended.width * 4;
						if (unblended.data[i] >= treshold) {
							miny = Math.min(miny, y);
							maxy = Math.max(maxy, y);
						}
					}
				}
				ds = false;
			}
		}
	}
	font.height = maxy + 1 - miny;
	font.basey = basey - miny;

	//detect all pixels
	for (var a in chardata) {
		var chr = chardata[a];
		for (var x = 0; x < chr.width; x++) {
			for (var y = 0; y < maxy + 1 - miny; y++) {
				var i = (x + chr.ds) * 4 + (y + miny) * unblended.width * 4;
				if (unblended.data[i] >= treshold) {
					chr.pixels.push(x, y);
					chr.pixels.push(unblended.data[i]);
					if (shadow) { chr.pixels.push(unblended.data[i + 1]); }
					chr.bonus += 5;
				}
			}
		}
		//prevent js from doing the thing with unnecessary output precision
		chr.bonus = +chr.bonus.toFixed(3);

		font.chars.push({ width: chr.width, bonus: chr.bonus, chr: chr.chr, pixels: chr.pixels, secondary: chr.secondary });
	}

	return font;
}
