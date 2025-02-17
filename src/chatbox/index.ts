import * as a1lib from "alt1/base";
import { ImgRef, ImgRefData } from "alt1/base";
import * as OCR from "alt1/ocr";
import { webpackImages } from "alt1/base";

type FontSetting = { name: string, lineheight: number, badgey: number, dy: number, def: OCR.FontDefinition };

let chatfont = require("../fonts/aa_8px.fontmeta.json");

let fonts: FontSetting[] = [
	{ name: "10pt", lineheight: 14, badgey: -9, dy: 2, def: require("../fonts/chatbox/10pt.fontmeta.json") },
	{ name: "12pt", lineheight: 16, badgey: -9, dy: -1, def: require("../fonts/chatbox/12pt.fontmeta.json") },
	{ name: "14pt", lineheight: 18, badgey: -10, dy: -3, def: require("../fonts/chatbox/14pt.fontmeta.json") },
	{ name: "16pt", lineheight: 21, badgey: -10, dy: -6, def: require("../fonts/chatbox/16pt.fontmeta.json") },
	{ name: "18pt", lineheight: 23, badgey: -11, dy: -8, def: require("../fonts/chatbox/18pt.fontmeta.json") },
	{ name: "20pt", lineheight: 25, badgey: -11, dy: -11, def: require("../fonts/chatbox/20pt.fontmeta.json") },
	{ name: "22pt", lineheight: 27, badgey: -12, dy: -13, def: require("../fonts/chatbox/22pt.fontmeta.json") },
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

const chatimgs = webpackImages({
	public: require("./imgs/public.data.png"),
	private: require("./imgs/private.data.png"),
	privateRecent: require("./imgs/privateRecent.data.png"),
	clan: require("./imgs/clan.data.png"),
	guestclan: require("./imgs/guestclan.data.png"),
	friends: require("./imgs/friends.data.png"),
	group: require("./imgs/group.data.png"),
	groupironman: require("./imgs/groupironman.data.png"),
});

const chatmap: { [key in keyof typeof chatimgs.raw]: string } = {
	public: "main",
	private: "pc",
	clan: "cc",
	guestclan: "gcc",
	friends: "fc",
	group: "gc",
	groupironman: "gimc",
	privateRecent: "pc", // needs to be last to not mess with the buf
	
}
const chatbadges = webpackImages({
	vip: require("./imgs/badgevip.data.png"),
	pmod: require("./imgs/badgepmod.data.png"),
	pmodvip: require("./imgs/badgepmodvip.data.png"),
	broadcast_gold: require("./imgs/badge_broadcast_gold.data.png"),
	broadcast_silver: require("./imgs/badge_broadcast_silver.data.png"),
	broadcast_bronze: require("./imgs/badge_broadcast_bronze.data.png"),
	broadcast_death: require("./imgs/badge_broadcast_death.data.png"),
	ironman: require("./imgs/badgeironman.data.png"),
	hcim: require("./imgs/badgehcim.data.png"),
	rgim: require("./imgs/badgergim.data.png"),
	gim: require("./imgs/badgegim.data.png"),
	chatlink: require("./imgs/chat_link.data.png"),
});

const badgemap: { [key in keyof typeof chatbadges.raw]: string } = {
	vip: "\u2730",//SHADOWED WHITE STAR
	pmod: "\u2655",//WHITE CHESS QUEEN
	pmodvip: "\u2655",//WHITE CHESS QUEEN
	broadcast_gold: "\u2746",//HEAVY CHEVRON SNOWFLAKE
	broadcast_silver: "\u2746",//HEAVY CHEVRON SNOWFLAKE
	broadcast_bronze: "\u2746",//HEAVY CHEVRON SNOWFLAKE
	broadcast_death: "\u{1F480}",//SKULL
	ironman: "\u26AF",//UNMARRIED PARTNERSHIP SYMBOL
	hcim: "\u{1F480}",//SKULL
	rgim: "\u328F",//CIRCLED IDEOGRAPH EARTH
	gim: "\u3289",//CIRCLED IDEOGRAPH TEN
	chatlink: "\u{1F517}",//LINK SYMBOL
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
	[215, 195, 119], //interface preset color
	[255, 255, 176], //gim exclusive?
];

type BoxCorner = a1lib.PointLike & { type: "hidden" | "full" | "legacy" }
export type Chatbox = {
	rect: a1lib.Rect,
	timestamp: boolean,
	type: "main" | "cc" | "fc" | "gc" | "gcc" | "pc" | "gimc",
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
	//settings
	readargs = {
		colors: defaultcolors.map(c => a1lib.mixColor(c[0], c[1], c[2]))
	};
	minoverlap = 2;
	diffRead = true;
	diffReadUseTimestamps = true;

	forwardnudges = defaultforwardnudges.slice();
	backwardnudges = defaultbackwardnudges.slice();

	//state
	pos: { mainbox: Chatbox, boxes: Chatbox[] } | null = null;
	debug = null;
	overlaplines: ChatLine[] = [];
	lastTimestamp = -1;
	lastTimestampUpdate = 0;
	addedLastread = false;
	font: FontSetting | null = null;
	lastReadBuffer: ImgRefData | null = null;

	readChatLine(box: Chatbox, imgdata: ImageData, imgx: number, imgy: number, font: FontSetting, ocrcolors: OCR.ColortTriplet[], linenr: number): ChatLine {
		var liney = box.line0y - linenr * font.lineheight + font.dy;

		let ctx: ReadLineContext = {
			badgedy: font.badgey,
			baseliney: liney + box.rect.y - imgy,
			colors: ocrcolors,
			font: font.def,
			forward: true,
			imgdata,
			leftx: box.line0x + box.rect.x - imgx,
			rightx: box.line0x + box.rect.x - imgx,
			text: "",
			fragments: [],
			addfrag(this: ReadLineContext, frag: OCR.TextFragment) {
				if (this.forward) {
					this.fragments.push(frag);
					this.text += frag.text;
					this.rightx = frag.xend;
				}
				else {
					this.fragments.unshift(frag);
					this.text = frag.text + this.text;
					this.leftx = frag.xstart;
				}
			}
		}

		if (!box.leftfound) {
			let col = OCR.getChatColor(imgdata, { x: ctx.rightx - 5, y: ctx.baseliney - 10, width: 10, height: 10 }, ocrcolors);
			if (!col) { return { text: "", fragments: [], basey: liney }; }
			let pos = OCR.findChar(imgdata, font.def, col, ctx.rightx - 5, ctx.baseliney, font.def.width, 1);
			if (!pos) { return { text: "", fragments: [], basey: liney }; }
			ctx.rightx = pos.x;
			ctx.leftx = pos.x;
		}

		for (let dirforward of [false, true]) {
			if (box.leftfound && !dirforward) { continue; }
			ctx.forward = dirforward;
			let nudges = (dirforward ? this.forwardnudges : this.backwardnudges);
			retryloop: while (true) {
				for (let nudge of nudges) {
					let m = ctx.text.match(nudge.match)
					if (m) {
						if (nudge.fn(ctx, m)) {
							continue retryloop;
						}
					}
				}
				break;
			}
		}

		ctx.fragments.forEach(f => { f.xstart += imgx; f.xend += imgx });
		if (!box.leftfound) {
			let found = false;
			let extraoffset = 0;
			//ignore lines with news in them since the preceeding news icon often doesn't match in backward reads
			if (ctx.text.match(/^(\[\w)/i) && ctx.text.indexOf("News") == -1) {
				found = true;
			}
			if (found) {
				let dx = ctx.fragments[0].xstart - box.rect.x - extraoffset;
				box.rect.x += dx;
				box.rect.width -= dx;
				box.leftfound = true;
				console.log("found box left because of chat contents", ctx.text);
			}
		}
		return { text: ctx.text, fragments: ctx.fragments, basey: ctx.baseliney + imgy };
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
				if (this.diffReadUseTimestamps && !this.addedLastread && !hadtimestampless && time != -1 && this.lastTimestamp != -1) {
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

		img.findSubimage(imgs.plusbutton).forEach(loc => toprights.push({ x: loc.x + 5, y: loc.y + 21, type: "hidden" }));
		img.findSubimage(imgs.filterbutton).forEach(loc => toprights.push({ x: loc.x + 19, y: loc.y + 19, type: "hidden" }));
		img.findSubimage(imgs.minusbutton).forEach(loc => toprights.push({ x: loc.x + 5, y: loc.y + 21, type: "full" }));

		var botlefts: a1lib.PointLike[] = [];
		img.findSubimage(imgs.chatbubble).forEach(loc => {
			//107,2 press enter to chat
			//102,2 click here to chat
			// biggest chat size is 83 + 4 pixels
			var data = img.toData(loc.x + 19, loc.y, 87 + (107 - 102), 10);
			for (let chat in chatimgs.raw) {
				let cimg = chatimgs.raw[chat];
	
				if (data.pixelCompare(cimg, 0, 1) != Infinity || data.pixelCompare(cimg, (107 - 102), 1) != Infinity) {
				botlefts.push(loc);
				}
				//i don't even know anymore some times the bubble is 1px higher (i think it might be java related)
				else if (data.pixelCompare(cimg, 0, 0) != Infinity || data.pixelCompare(cimg, (107 - 102), 0) != Infinity) {
					loc.y -= 1;
					botlefts.push(loc);
				}
				//active chat
				else {
					var pixel = img.toData(loc.x, loc.y - 5, 1, 1);
					var pixel2 = img.toData(loc.x, loc.y - 4, 1, 1);
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
			}
		});
		img.findSubimage(imgs.chatLegacyBorder).forEach(loc => {
			botlefts.push({ x: loc.x, y: loc.y - 1 });
		});
		// previously activated private chat showing "To"
		img.findSubimage(chatimgs.privateRecent).forEach(loc => {
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
			// rect.x + 21 is the offset after chat bubble
			// buff & comp needs to be different for recent private chat as it doesn't have the chat bubble
			let buf = img.toData(group.rect.x + 19, group.rect.y + group.rect.height, 150, 10);
			let pbuf = img.toData(group.rect.x, group.rect.y + group.rect.height, 150, 10);

			for (let chat in chatmap) {
				let cimg = chatimgs.raw[chat];
				let comp = buf.pixelCompare(cimg, 0, 1);
				let pcomp = pbuf.pixelCompare(cimg, 0, 1);
				if (comp != Infinity || pcomp != Infinity) {
					group.type = chatmap[chat];
					break;
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
			group.line0y = group.rect.height - 16;//15;//12;//- 15;//-11//- 9;//-10 before mobile interface update

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
		//TODO replace this
		return false;
	}

	static getMessageTime(str: string) {
		let m = str.match(/^\[(\d{2}):(\d{2}):(\d{2})\]/);
		if (!m) { return -1; }
		return (+m[1]) * 60 * 60 + (+m[2]) * 60 + (+m[3]);
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


type ReadLineContext = {
	addfrag: (frag: OCR.TextFragment) => void,
	leftx: number,
	rightx: number,
	baseliney: number,
	imgdata: ImageData,
	font: OCR.FontDefinition,
	badgedy: number,
	colors: [number, number, number][]
	text: string,
	fragments: OCR.TextFragment[],
	forward: boolean
}


type ReadLineNudge = {
	name: string,
	match: RegExp,
	fn: (ctx: ReadLineContext, match: RegExpMatchArray) => boolean | undefined
};


let checkchatbadge = (ctx: ReadLineContext) => {
	let addspace = ctx.forward && ctx.text.length != 0 && ctx.text[ctx.text.length - 1] != " ";
	for (let badge in chatbadges.raw) {
		let bimg = chatbadges.raw[badge];
		let badgeleft = (ctx.forward ? ctx.rightx + (addspace ? ctx.font.spacewidth : 0) : ctx.leftx - bimg.width);
		let d = ctx.imgdata.pixelCompare(bimg, badgeleft, ctx.baseliney + ctx.badgedy);
		if (d < Infinity) {
			if (addspace) {
				ctx.addfrag({ color: [255, 255, 255], index: -1, xstart: ctx.rightx, xend: badgeleft, text: " " });
			}
			ctx.addfrag({ color: [255, 255, 255], index: -1, text: badgemap[badge], xstart: badgeleft, xend: badgeleft + bimg.width });
			return true;
		}
	}
}

let defaultforwardnudges: ReadLineNudge[] = [
	{
		//fix for "[" first char
		match: /^$/,
		name: "timestampopen", fn: (ctx) => {
			let timestampopen = OCR.readChar(ctx.imgdata, ctx.font, [255, 255, 255], ctx.rightx, ctx.baseliney, false, false);
			if (timestampopen?.chr == "[") {
				ctx.addfrag({ color: [255, 255, 255], index: -1, text: "[", xstart: ctx.rightx, xend: ctx.rightx + timestampopen.basechar.width });
				return true;
			}
		}
	},
	{
		match: /(\] ?|news: ?|^)$/i,
		name: "badge", fn: checkchatbadge
	},
	{
		match: /.*/,
		name: "body", fn: ctx => {
			var data = OCR.readLine(ctx.imgdata, ctx.font, ctx.colors, ctx.rightx, ctx.baseliney, true, false);
			if (data.text) {
				data.fragments.forEach(f => ctx.addfrag(f));
				return true;
			}
		}
	},
	{
		match: /\[[\w: ]+$/,
		name: "timestampclose", fn: ctx => {
			let closebracket = OCR.readChar(ctx.imgdata, ctx.font, [255, 255, 255], ctx.rightx, ctx.baseliney, false, false);
			if (closebracket?.chr == "]") {
				ctx.addfrag({ color: [255, 255, 255], text: "] ", index: -1, xstart: ctx.rightx, xend: ctx.rightx + closebracket.basechar.width + ctx.font.spacewidth });
				return true;
			}
		}
	},
	{
		match: /(^|\]|:)( ?)$/i,
		name: "startline", fn: (ctx, match) => {
			let addspace = !match[2];
			let x = ctx.rightx + (addspace ? ctx.font.spacewidth : 0);
			let best: OCR.ReadCharInfo | null = null;
			let bestcolor: OCR.ColortTriplet | null = null;
			for (let col of ctx.colors) {
				let chr = OCR.readChar(ctx.imgdata, ctx.font, col, x, ctx.baseliney, false, false);
				if (chr && (!best || chr.sizescore < best.sizescore)) {
					best = chr;
					bestcolor = col;
				}
			}
			if (bestcolor) {
				var data = OCR.readLine(ctx.imgdata, ctx.font, bestcolor, x, ctx.baseliney, true, false);
				if (data.text) {
					if (addspace) { ctx.addfrag({ color: [255, 255, 255], index: -1, text: " ", xstart: ctx.rightx, xend: x }); }
					//console.log("hardrecol", text, data.text);
					data.fragments.forEach(f => ctx.addfrag(f));
					return true;
				}
			}
		}
	},
	{
		match: /\w$/,
		name: "whitecolon", fn: ctx => {
			let startx = ctx.rightx;
			let colonchar = OCR.readChar(ctx.imgdata, ctx.font, [255, 255, 255], startx, ctx.baseliney, false, true);
			if (colonchar?.chr == ":") {
				ctx.addfrag({ color: [255, 255, 255], index: -1, text: ": ", xstart: startx, xend: startx + colonchar.basechar.width + ctx.font.spacewidth });
				return true;
			}
		}
	}
];

let defaultbackwardnudges: ReadLineNudge[] = [
	{
		match: /^(news: |[\w\-_]{1,12}: )/i,
		name: "badge", fn: checkchatbadge
	},
	{
		match: /.*/,
		name: "body", fn: ctx => {
			var data = OCR.readLine(ctx.imgdata, ctx.font, ctx.colors, ctx.leftx, ctx.baseliney, false, true);
			if (data.text) {
				data.fragments.reverse().forEach(f => ctx.addfrag(f));
				return true;
			}
		}
	},
	{
		match: /^\w/,
		name: "whitecolon", fn: ctx => {
			let startx = ctx.leftx - ctx.font.spacewidth;
			let colonchar = OCR.readChar(ctx.imgdata, ctx.font, [255, 255, 255], startx, ctx.baseliney, false, true);
			if (colonchar?.chr == ":") {
				startx -= colonchar.basechar.width;
				ctx.addfrag({ color: [255, 255, 255], index: -1, text: ": ", xstart: startx, xend: startx + colonchar.basechar.width + ctx.font.spacewidth });
				return true;
			}
		}
	}
];
