import * as a1lib from "@alt1/base";
import { ImgRef, ImgRefBind, unmixColor, mixColor, ImgRefData } from "@alt1/base";
import * as OCR from "@alt1/ocr";
import { webpackImages } from "@alt1/base/imagedetect";

type FontSetting = { name: string, lineheight: number, badgey: number, dy: number, def: OCR.FontDefinition };

let chatfont = require("@alt1/ocr/fonts/chat_8px.fontmeta.json");

let fonts: FontSetting[] = [
	{ name: "11pt", lineheight: 15, badgey: -8, dy: 0, def: require("@alt1/ocr/fonts/chat_8px.fontmeta.json") },
	{ name: "13pt", lineheight: 17, badgey: -9, dy: -1, def: require("@alt1/ocr/fonts/chat_10px.fontmeta.json") },
	{ name: "15pt", lineheight: 19, badgey: -11, dy: -2, def: require("@alt1/ocr/fonts/chat_11px.fontmeta.json") },
	{ name: "17pt", lineheight: 21, badgey: -11, dy: -2, def: require("@alt1/ocr/fonts/chat_13px.fontmeta.json") }
];

const imgs = webpackImages({
	plusbutton: require("./imgs/plusbutton.data.png"),
	minusbutton: require("./imgs/minusbutton.data.png"),
	filterbutton: require("./imgs/filterbutton.data.png"),
	chatbubble: require("./imgs/chatbubble.data.png"),
	chatLegacyBorder: require("./imgs/chatLegacyBorder.data.png"),
	entertochat: require("./imgs/entertochat.data.png"),
	gameoff: require("./imgs/gameoff.data.png"),
	gamefilter: require("./imgs/gamefilter.data.png"),
	gameall: require("./imgs/gameall.data.png"),
	legacyreport: require("./imgs/legacyreport.data.png"),
	reportbutton: require("./imgs/reportbutton.data.png"),
});

const chatbadges = webpackImages({
	vip: require("./imgs/badgevip.data.png"),
	pmod: require("./imgs/badgepmod.data.png"),
	pmodvip: require("./imgs/badgepmodvip.data.png"),
	broadcast: require("./imgs/badgebroadcast.data.png"),
	drop: require("./imgs/badgedrop.data.png"),
	ironman: require("./imgs/badgeironman.data.png"),
	hcim: require("./imgs/badgehcim.data.png")
});

const badgemap: { [key in keyof typeof chatbadges.raw]: string } = {
	vip: "\u2730",//SHADOWED WHITE STAR
	pmod: "\u2655",//WHITE CHESS QUEEN
	pmodvip: "\u2655",//WHITE CHESS QUEEN
	broadcast: "\u2746",//HEAVY CHEVRON SNOWFLAKE
	drop: "\u2746",//HEAVY CHEVRON SNOWFLAKE
	ironman: "\u26AF",//UNMARRIED PARTNERSHIP SYMBOL
	hcim: "\u{1F480}",//SKULL
}

export const defaultcolors = [
	[0, 255, 0],
	[0, 255, 255],
	[0, 175, 255],
	[0, 0, 255],
	[255, 82, 86],
	[159, 255, 159],
	[0, 111, 0],
	[255, 143, 143],
	[255, 152, 31],
	[255, 111, 0],
	[255, 255, 0],
	//[239, 0, 0],//messes up broadcast detection [255,0,0]
	[239, 0, 175],
	[255, 79, 255],
	[175, 127, 255],
	//[48, 48, 48],//fuck this color, its unlegible for computers and people alike
	[191, 191, 191],
	[127, 255, 255],
	[128, 0, 0],
	[255, 255, 255],
	[127, 169, 255],
	[255, 140, 56], //orange drop received text
	[255, 0, 0], //red achievement world message
	[69, 178, 71], //blueish green friend broadcast
	[164, 153, 125], //brownish gray friends/fc/cc list name
	[215, 195, 119] //interface preset color
];

type BoxCorner = a1lib.PointLike & { type: "hidden" | "full" | "legacy" }
export type Chatbox = {
	rect: a1lib.Rect,
	timestamp: boolean,
	type: "main" | "cc" | "fc" | "gc" | "gcc",
	leftfound: boolean,
	topright: BoxCorner,
	botleft: a1lib.PointLike,
	line0x: number,
	line0y: number
};
export type ChatLine = {
	text: string,
	fragments: OCR.TextFragment[],
	basey: number
};

export default class ChatBoxReader {
	pos: { mainbox: Chatbox, boxes: Chatbox[] } | null = null;
	debug = null;
	overlaplines: ChatLine[] = [];
	lastTimestamp = -1;
	lastTimestampUpdate = 0;
	addedLastread = false;
	readargs = {
		colors: defaultcolors.map(c => a1lib.mixColor(c[0], c[1], c[2]))
	};

	minoverlap = 2;
	diffRead = true;
	font: FontSetting | null = null;
	lastReadBuffer: ImgRefData | null = null;

	readChatLine(box: Chatbox, imgdata: ImageData, imgx: number, imgy: number, font: FontSetting, ocrcolors: OCR.ColortTriplet[], linenr: number): ChatLine {
		var fragments: OCR.TextFragment[] = [];
		var text = "";
		var liney = box.line0y - linenr * font.lineheight + font.dy;
		var imgliney = liney + box.rect.y - imgy;


		var rightx = box.line0x + box.rect.x - imgx;
		if (!box.leftfound) {
			let col = OCR.getChatColor(imgdata, { x: rightx - 5, y: imgliney - 10, width: 10, height: 10 }, ocrcolors);
			if (!col) { return { text: "", fragments: [], basey: liney }; }
			let pos = OCR.findChar(imgdata, font.def, col, rightx - 5, imgliney, font.def.width, 1);
			if (!pos) { return { text: "", fragments: [], basey: liney }; }
			rightx = pos.x;
		}
		var leftx = rightx;

		for (let dirforward of [false, true]) {

			if (box.leftfound && !dirforward) { continue; }

			let addfrag = (frag: OCR.TextFragment) => {
				if (dirforward) {
					fragments.push(frag);
					text += frag.text;
					rightx = frag.xend;
				}
				else {
					fragments.unshift(frag);
					text = frag.text + text;
					leftx = frag.xstart;
				}
			}

			let triedletterspacingskip = false;
			retryloop: while (true) {
				//fix for "[" first char
				if (text == "" && dirforward) {
					let timestampopen = OCR.readChar(imgdata, font.def, [255, 255, 255], rightx, imgliney, false, false);
					if (timestampopen?.chr == "[") {
						addfrag({ color: [255, 255, 255], index: -1, text: "[", xstart: rightx, xend: rightx + timestampopen.basechar.width });
						continue;
					}
				}
				//main body of read
				var data = OCR.readLine(imgdata, font.def, ocrcolors, (dirforward ? rightx : leftx), imgliney, dirforward, !dirforward);
				if (data.text) {
					if (dirforward) { data.fragments.forEach(f => addfrag(f)); }
					else { data.fragments.reverse().forEach(f => addfrag(f)); }
					triedletterspacingskip = false;
				}

				//failed to read closing square bracket?
				if (dirforward && text.match(/\[[\w: ]+$/)) {
					let closebracket = OCR.readChar(imgdata, font.def, [255, 255, 255], rightx, imgliney, false, false);
					if (closebracket?.chr == "]") {
						addfrag({ color: [255, 255, 255], text: "] ", index: -1, xstart: rightx, xend: rightx + closebracket.basechar.width + font.def.spacewidth });
						continue;
					}
				}

				//chat badges
				if (
					(dirforward && text.match(/(\] ?|news: ?|^)$/i)) ||
					(!dirforward && text.match(/^(news: |[\w\-_]{1,12}: )/i))
				) {
					let addspace = dirforward && text.length != 0 && text[text.length - 1] != " ";
					for (let badge in chatbadges.raw) {
						let bimg = chatbadges.raw[badge];
						let badgeleft = (dirforward ? rightx + (addspace ? font.def.spacewidth : 0) : leftx - bimg.width);
						let d = imgdata.pixelCompare(bimg, badgeleft, imgliney + font.badgey);
						if (d < Infinity) {
							if (addspace) {
								addfrag({ color: [255, 255, 255], index: -1, xstart: rightx, xend: badgeleft, text: " " });
							}
							addfrag({ color: [255, 255, 255], index: -1, text: badgemap[badge], xstart: badgeleft, xend: badgeleft + bimg.width });
							continue retryloop;
						}
					}
				}

				//strong col check at start of line
				if (dirforward && text.match(/(^|\]|:) ?$/i)) {
					let addspace = text.length != 0 && text[text.length - 1] != " ";
					let x = rightx + (addspace ? font.def.spacewidth : 0);
					let best: OCR.ReadCharInfo | null = null;
					let bestcolor: OCR.ColortTriplet | null = null;
					for (let col of ocrcolors) {
						let chr = OCR.readChar(imgdata, font.def, col, x, imgliney, false, false);
						if (chr && (!best || chr.sizescore < best.sizescore)) {
							best = chr;
							bestcolor = col;
						}
					}
					if (bestcolor) {
						var data = OCR.readLine(imgdata, font.def, bestcolor, x, imgliney, true, false);
						if (data.text) {
							if (addspace) { addfrag({ color: [255, 255, 255], index: -1, text: " ", xstart: rightx, xend: x }); }
							//console.log("hardrecol", text, data.text);
							data.fragments.forEach(f => addfrag(f));
							triedletterspacingskip = false;
							continue;
						}
					}
					//console.log("hardrecol failed", text);
				}

				//white colon
				if (dirforward && text.match(/\w$/) || !dirforward && text.match(/^\w/)) {
					let startx = (dirforward ? rightx : leftx - font.def.spacewidth);
					let colonchar = OCR.readChar(imgdata, font.def, [255, 255, 255], startx, imgliney, !dirforward, true);
					if (colonchar?.chr == ":") {
						if (!dirforward) { startx -= colonchar.basechar.width; }
						addfrag({ color: [255, 255, 255], index: -1, text: ": ", xstart: startx, xend: startx + colonchar.basechar.width + font.def.spacewidth });
						continue;
					}
				}

				//in 17pt font the size of a space character is 2px smaller in usernames (don't ask me why)
				if (font.name == "17pt" && !triedletterspacingskip && dirforward && text.match(/\] [\w\-_]{1,12}$/i)) {
					rightx -= 2;
					triedletterspacingskip = true;
					continue;
				}

				break;
			}
		}
		fragments.forEach(f => { f.xstart += imgx; f.xend += imgx });
		if (!box.leftfound) {
			let found = false;
			if (text.indexOf(badgemap.broadcast + "News") == 0) { found = true; }
			if (text.match(/^(\[\w)/i)) { found = true; }
			if (found) {
				let dx = fragments[0].xstart - box.rect.x;
				box.rect.x += dx;
				box.rect.width -= dx;
				box.leftfound = true;
				console.log("found box left because of chat contents");
			}
		}
		return { text, fragments, basey: imgliney + imgy };
	}

	read(img?: ImgRef | null) {
		if (!this.pos) { return null; }
		var box = this.pos.mainbox;
		var leftmargin = (box.leftfound ? 0 : 300);
		let imgx = box.rect.x - leftmargin;
		let imgy = box.rect.y;
		let imgdata: ImageData;
		if (img) { imgdata = img.toData(imgx, imgy, box.rect.width + leftmargin, box.rect.height); }
		else { imgdata = a1lib.capture(imgx, imgy, box.rect.width + leftmargin, box.rect.height); }
		this.lastReadBuffer = new ImgRefData(imgdata, imgx, imgy);

		//add timestamp colors if needed
		//TODO
		if (true || box.timestamp) {
			var cols = [a1lib.mixColor(127, 169, 255), a1lib.mixColor(255, 255, 255)];
			for (var a in cols) {
				if (this.readargs.colors.indexOf(cols[a]) == -1) { this.readargs.colors.push(cols[a]); }
			}
		}

		var ocrcolors = this.readargs.colors.map(c => a1lib.unmixColor(c));

		if (!this.font) {
			for (let font of fonts) {
				let line1 = this.readChatLine(box, imgdata, imgx, imgy, font, ocrcolors, 0);
				let line2 = this.readChatLine(box, imgdata, imgx, imgy, font, ocrcolors, 1);
				let m = (line1.text + line2.text).match(/\w/g)
				if (m && m.length > 10) {
					this.font = font;
					break;
				}
			}
		}
		if (!this.font) {
			return null;
		}

		var readlines: ChatLine[] = [];
		var newlines: ChatLine[] = [];
		let hadtimestampless = false;
		for (var line = 0; true; line++) {
			var liney = box.line0y - line * this.font.lineheight + this.font.dy;
			if (liney - this.font.lineheight < 0) {
				newlines = readlines;
				break;
			}

			let newline = this.readChatLine(box, imgdata, imgx, imgy, this.font, ocrcolors, line);
			readlines.unshift(newline);

			//combine with previous reads
			if (this.diffRead) {
				let time = ChatBoxReader.getMessageTime(newline.text);
				if (!this.addedLastread && !hadtimestampless && time != -1 && this.lastTimestamp != -1) {
					//don't block messages in the same second as last update
					if (Date.now() > this.lastTimestampUpdate + 1000) {
						const maxtime = 24 * 60 * 60;
						let diff = time - this.lastTimestamp;
						//wrap around at 00:00:00
						if (diff < -maxtime / 2) { diff += maxtime; }
						//don't accept messages with older timestamp
						if (diff <= 0) {
							newlines = readlines.slice(1);
							break;
						}
					}
				} else {
					//can not use timestamps if there is a msg without timestamp in the same batch
					hadtimestampless = true;
				}
				if (readlines.length >= this.overlaplines.length && this.overlaplines.length >= this.minoverlap) {
					var matched = true;
					for (let a = 0; a < this.overlaplines.length; a++) {
						if (!this.matchLines(this.overlaplines[a].text, readlines[a].text)) { matched = false; break; }
					}
					if (matched) {
						newlines = readlines.slice(this.overlaplines.length, readlines.length);
						break;
					}
				}
			}
		}
		//update the last message timestamp
		this.addedLastread = newlines.length != 0;
		for (let a = newlines.length - 1; a >= 0; a--) {
			let time = ChatBoxReader.getMessageTime(newlines[a].text);
			if (time != -1) {
				this.lastTimestamp = time;
				this.lastTimestampUpdate = Date.now();
				break;
			}
		}
		//add new lines
		this.overlaplines = this.overlaplines.concat(newlines);
		if (this.overlaplines.length > this.minoverlap) { this.overlaplines.splice(0, this.overlaplines.length - this.minoverlap); }

		//console.log("Read chat attempt time: " + (Date.now() - t));
		//for (let a = 0; a < newlines.length; a++) { console.log(newlines[a]); }
		return newlines;
	}

	//convert some similar characters to prevent problems when a character is slightly misread
	simplifyLine(str: string) {
		str = str.replace(/[\[\]\.\':;,_ ]/g, "");
		str = str.replace(/[|!lIji]/g, "l");
		return str;
	}

	matchLines(line1: string, line2: string) {
		return this.simplifyLine(line1) == this.simplifyLine(line2);
	}

	checkLegacyBG(buf: ImageData, x: number, y: number) {
		return buf.getColorDifference(x, y, 155, 140, 107) < 20;
	}

	find(imgornull?: ImgRef) {
		if (!imgornull) { imgornull = a1lib.captureHoldFullRs(); }
		if (!imgornull) { return null; }
		var img = imgornull;
		var toprights: BoxCorner[] = [];

		img.findSubimage(imgs.plusbutton).forEach(loc => toprights.push({ x: loc.x + 2, y: loc.y - 1, type: "hidden" }));
		img.findSubimage(imgs.minusbutton).forEach(loc => toprights.push({ x: loc.x + 2, y: loc.y + 21, type: "full" }));


		var botlefts: a1lib.PointLike[] = [];
		img.findSubimage(imgs.chatbubble).forEach(loc => {
			//107,2 press enter to chat
			//102,2 click here to chat
			var data = img.toData(loc.x + 102, loc.y + 1, 28 + (107 - 102), 10);
			if (data.pixelCompare(imgs.entertochat, 0, 1) != Infinity || data.pixelCompare(imgs.entertochat, (107 - 102), 1) != Infinity) {
				botlefts.push(loc);
			}
			//i don't even know anymore some times the bubble is 1px higher (i think it might be java related)
			else if (data.pixelCompare(imgs.entertochat, 0, 0) != Infinity || data.pixelCompare(imgs.entertochat, (107 - 102), 0) != Infinity) {
				loc.y -= 1;
				botlefts.push(loc);
			}
			else {
				var pixel = img.toData(loc.x, loc.y - 6, 1, 1);
				var pixel2 = img.toData(loc.x, loc.y - 5, 1, 1);
				if (pixel.data[0] == 255 && pixel.data[1] == 255 && pixel.data[2] == 255) {
					botlefts.push(loc);
				}
				//the weird offset again
				else if (pixel2.data[0] == 255 && pixel2.data[1] == 255 && pixel2.data[2] == 255) {
					loc.y -= 1;
					botlefts.push(loc);
				}
				else {
					//console.log("unlinked quickchat bubble " + JSON.stringify(loc));
				}
			}
		});
		img.findSubimage(imgs.chatLegacyBorder).forEach(loc => {
			botlefts.push({ x: loc.x, y: loc.y - 1 });
		});

		//check if we're in full-on legacy
		if (botlefts.length == 1 && toprights.length == 0) {
			//cheat in a topright without knowing it's actual height
			var pos = img.findSubimage(imgs.legacyreport);
			if (pos.length == 1) { toprights.push({ x: pos[0].x + 32, y: pos[0].y - 170, type: "legacy" }); }
		}

		var groups: Chatbox[] = [];
		var groupcorners = function () {
			var done = true;
			for (var a in toprights) {
				if (groups.find(q => q.topright == toprights[a])) { continue; }
				done = false;
				for (var b in botlefts) {
					if (groups.find(q => q.botleft == botlefts[b])) { continue; }
					var group: Chatbox = {
						timestamp: false,
						type: "main",
						leftfound: false,
						topright: toprights[a],
						botleft: botlefts[b],
						rect: new a1lib.Rect(botlefts[b].x, toprights[a].y, toprights[a].x - botlefts[b].x, botlefts[b].y - toprights[a].y),
						line0x: 0,
						line0y: 0
					};
					if (groups.find(q => q.rect.overlaps(group.rect))) { continue; }
					groups[groups.length] = group;
					if (groupcorners()) { return true; }
					groups.splice(groups.length - 1, 1);
				}
			}
			return done;
		}

		if (!groupcorners()) { return null; }
		var mainbox: Chatbox | null = null;
		groups.forEach(group => {
			let buf = img.toData(group.rect.x - 110, group.rect.y + group.rect.height - 5, 150, 20);
			let nameread = OCR.readLine(buf, chatfont, [255, 255, 255], 110, 14, false, true);
			if (nameread) {
				var d = 0;
				if (nameread.text == "Clan Chat") { group.type = "cc"; d = 62; }
				else if (nameread.text == "Friends Chat") { group.type = "fc"; d = 76; }
				else if (nameread.text == "Group Chat") { group.type = "gc"; d = 69; }
				else if (nameread.text == "Guest Clan Chat") { group.type = "gcc"; d = 98; }
				if (d != 0) {
					group.rect.x -= d;
					group.rect.width += d;
					group.leftfound = true;
				}
			}

			if (!group.leftfound && group.topright.type == "full") {
				var pos: a1lib.PointLike[] = [];
				if (pos.length == 0) { pos = img.findSubimage(imgs.gameall, Math.max(0, group.rect.x - 300), group.rect.y - 22, 310, 16); }
				if (pos.length == 0) { pos = img.findSubimage(imgs.gamefilter, Math.max(0, group.rect.x - 300), group.rect.y - 22, 310, 16); }
				if (pos.length == 0) { pos = img.findSubimage(imgs.gameoff, Math.max(0, group.rect.x - 300), group.rect.y - 22, 310, 16); }
				if (pos.length != 0) {
					group.leftfound = true;
					var d = group.rect.x - pos[0].x;
					group.rect.x -= d;
					group.rect.width += d;
				}
			}
			//alt1.overLayRect(a1lib.mixcolor(255, 255, 255), group.rect.x, group.rect.y, group.rect.width, group.rect.height, 10000, 2);
			//alt1.overLayTextEx(group.type, a1lib.mixcolor(255, 255, 255), 20, group.rect.x + group.rect.width / 2 | 0, group.rect.y + group.rect.height / 2 | 0, 10000, "", true, true);


			group.line0x = 0;
			group.line0y = group.rect.height - 15;//-11//- 9;//-10 before mobile interface update

			if (group.leftfound) { group.timestamp = this.checkTimestamp(img, group); }
			if (mainbox == null || group.type == "main") { mainbox = group; }
		});

		if (groups.length == 0 || !mainbox) { return null; }

		var res = {
			mainbox: mainbox,
			boxes: groups
		};
		this.pos = res;
		return res;
	}

	checkTimestamp(img: ImgRef, pos) {
		//the chatbox has timestamps if in the first 3 lines a line start with [00:00:00]
		// var readargs = { colors: [a1lib.mixColor(127, 169, 255)] };
		// for (var line = 0; line < 3; line++) {
		// 	var y = pos.rect.y + pos.line0y - line * this.font.lineheight;
		// 	var x = pos.rect.x + pos.line0x;
		// 	x += 3;//the leading '[' can't be the positioning char
		// 	for (var offset = 0; offset >= (pos.leftfound ? 0 : -200); offset -= 10) {
		// 		var str: any = null;
		// 		//TODO
		// 		//try { str = JSON.parse(alt1.bindReadStringEx(img.handle, x + offset, y, JSON.stringify(readargs))); }
		// 		//catch (e) { }

		// 		if (str && str.text.match(/^\d\d:\d\d:\d\d/)) {
		// 			if (!pos.leftfound) {
		// 				var d = offset + 10;
		// 				pos.rect.x += d;
		// 				pos.rect.width -= d;
		// 				//not an exact pos but better guess
		// 			}

		// 			return true;
		// 		}
		// 	}
		// }
		return false;
	}

	static getMessageTime(str: string) {
		let m = str.match(/^\[(\d{2}):(\d{2}):(\d{2})\]/);
		if (!m) { return -1; }
		return ((+m[1]) * 24 + (+m[2])) * 60 + (+m[3]);
	}

	static getFontColor(buffer: ImageData, x: number, y: number, w: number, h: number) {
		var bestscore = -Infinity;
		var bestx = 0, besty = 0;
		var data = buffer.data;

		for (var cx = x; cx < x + w - 1; cx++) {
			for (var cy = y; cy < y + h - 1; cy++) {
				var i1 = 4 * cx + 4 * buffer.width * cy;
				var i2 = 4 * (cx + 1) + 4 * buffer.width * (cy + 1);

				var colorness = data[i1] + data[i1 + 1] + data[i1 + 2];
				var blackness = data[i2] + data[i2 + 1] + data[i2 + 2];

				var score = Math.min(255, 255 + 20 - blackness) * colorness;
				if (score > bestscore) {
					bestscore = score;
					bestx = cx;
					besty = cy;
				}
			}
		}
		return buffer.getPixel(bestx, besty);
	}
}






