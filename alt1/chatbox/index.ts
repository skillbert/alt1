import * as a1lib from "@alt1/base";
import { ImgRef, ImgRefBind } from "@alt1/base";


const imgs = a1lib.ImageDetect.webpackImages({
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

const timestampOffset = 56;
const defaultcolors = [
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
	[239, 0, 0],
	[239, 0, 175],
	[255, 79, 255],
	[175, 127, 255],
	[48, 48, 48],
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

type Chatbox = {
	rect: a1lib.Rect,
	timestamp: boolean,
	type: string,
	leftfound: boolean,
	topright: a1lib.PointLike & { type: string },
	botleft: a1lib.PointLike & { type: string },
	line0x: number,
	line0y: number
};

export class ChatBoxReader {
	pos = null;
	debug = null;
	overlaplines = [];
	readargs = {
		backwards: true,
		colors: defaultcolors.map(c => a1lib.mixColor(c[0], c[1], c[2]))
	};

	lineheight = 14;
	minoverlap = 2;
	diffRead = true;

	read(img: ImgRefBind) {
		var t = Date.now();
		if (!this.pos) { return null; }
		var box = this.pos.mainbox;
		if (!img) { img = a1lib.captureHold(box.rect.x + (box.leftfound ? 0 : -300), box.rect.y, box.rect.width + (box.leftfound ? 0 : 300), box.rect.height); }
		if (!img) { return null; }

		//add timestamp colors if needed
		if (box.timestamp && this.readargs.colors) {
			var cols = [a1lib.mixColor(127, 169, 255), a1lib.mixColor(255, 255, 255)];
			for (var a in cols) {
				if (this.readargs.colors.indexOf(cols[a]) == -1) { this.readargs.colors.push(cols[a]); }
			}
		}

		//TODO check scrollbar
		var imgline0y = box.line0y + box.rect.y - img.y;
		var imgline0x = box.line0x + box.rect.x - img.x;

		var readlines = [];
		var newlines = [];
		for (var line = 0; true; line++) {
			var liney = box.line0y - line * this.lineheight;
			var imgliney = liney + box.rect.y - img.y;
			if (liney - this.lineheight < 0) {
				newlines = readlines;
				break;
			}

			var str = JSON.parse(alt1.bindReadStringEx(img.handle, imgline0x, imgliney, JSON.stringify(this.readargs)));
			//retry with offset if timestamps are enabled
			if (!str && box.timestamp) { str = JSON.parse(alt1.bindReadStringEx(img.handle, imgline0x + timestampOffset, imgliney, JSON.stringify(this.readargs))); }
			readlines.unshift(str ? str : { text: "", fragments: [] });
			//console.log(str);

			//combine with previous reads
			if (this.diffRead) {
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
		this.overlaplines = this.overlaplines.concat(newlines);
		if (this.overlaplines.length > this.minoverlap) { this.overlaplines.splice(0, this.overlaplines.length - this.minoverlap); }

		//qw("Read chat attempt time: " + (Date.now() - t));
		//for (var a = 0; a < newlines.length; a++) { qw(newlines[a]); }
		return newlines;
	}

	//convert some similar characters to prevent problems when a character is slightly misread
	simplefyLine(str: string) {
		str = str.replace(/[\[\]\.\':;,_ ]/g, "");
		str = str.replace(/[|!lIji]/g, "l");
		return str;
	}

	matchLines(line1: string, line2: string) {
		return this.simplefyLine(line1) == this.simplefyLine(line2);
	}

	checkLegacyBG(buf: ImageData, x: number, y: number) {
		return buf.getColorDifference(x, y, 155, 140, 107) < 20;
	}

	find(img: ImgRefBind) {
		if (!img) { img = a1lib.captureHoldFullRs(); }
		if (!img) { return null; }
		var toprights = [];

		img.findSubimage(imgs.plusbutton).forEach(loc => toprights.push({ x: loc.x + 2, y: loc.y - 1, type: "hidden" }));
		img.findSubimage(imgs.minusbutton).forEach(loc => toprights.push({ x: loc.x + 2, y: loc.y + 21, type: "full" }));
		console.log(toprights);

		var botlefts = [];
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
				var pixel = img.toData(loc.x, loc.y - 2, 1, 1);
				if (pixel.data[0] == 255 && pixel.data[1] == 255 && pixel.data[2] == 255) {
					botlefts.push(loc);
				}
				else {
					console.log("unlinked quickchat bubble " + JSON.stringify(loc));
				}
			}
		});
		img.findSubimage(imgs.chatLegacyBorder).forEach(loc => {
			botlefts.push({ x: loc.x, y: loc.y - 1 });
		});
		console.log(botlefts);

		//check if we're in full-on legacy
		if (botlefts.length == 1 && toprights.length == 0) {
			//cheat in a topright without knowing it's actual height
			var pos = img.findSubimage(imgs.legacyreport);
			if (pos.length == 1) { toprights.push({ x: pos[0].x + 32, y: pos[0].y - 170, type: "legacy" }); }
		}

		var groups: Chatbox[] = [];
		var recurs = 0;
		var groupcorners = function () {
			recurs++;
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
		console.log(recurs);
		console.log(groups);
		var mainbox: Chatbox = null;
		var readargs = JSON.stringify({ colors: [a1lib.mixColor(255, 255, 255)], backwards: true });
		groups.forEach(group => {
			var nameread = JSON.parse(alt1.bindReadStringEx(img.handle, group.rect.x - 10, group.rect.y + group.rect.height + 9, readargs));
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
				var pos = [];
				if (pos.length == 0) { pos = img.findSubimage(imgs.gameall, group.rect.x - 300, group.rect.y - 22, 310, 16); }
				if (pos.length == 0) { pos = img.findSubimage(imgs.gamefilter, group.rect.x - 300, group.rect.y - 22, 310, 16); }
				if (pos.length == 0) { pos = img.findSubimage(imgs.gameoff, group.rect.x - 300, group.rect.y - 22, 310, 16); }
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
			group.line0y = group.rect.height - 10;//- 9;//-10 before mobile interface update

			if (group.leftfound) { group.timestamp = this.checkTimestamp(img, group); }
			if (mainbox == null || group.type == "main") { mainbox = group; }
		});

		if (groups.length == 0) { return null; }

		var res = {
			mainbox: mainbox,
			boxes: groups
		};
		this.pos = res;
		return res;
	}

	checkTimestamp(img: ImgRefBind, pos) {
		//the chatbox has timestamps if in the first 3 lines a line start with [00:00:00]
		var readargs = { colors: [a1lib.mixColor(127, 169, 255)] };
		for (var line = 0; line < 3; line++) {
			var y = pos.rect.y + pos.line0y - line * this.lineheight;
			var x = pos.rect.x + pos.line0x;
			x += 3;//the leading '[' can't be the positioning char
			var str = JSON.parse(alt1.bindReadStringEx(img.handle, x, y, JSON.stringify(readargs)));

			if (str && str.text.match(/^\d\d:\d\d:\d\d/)) { return true; }
		}
		return false;
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






