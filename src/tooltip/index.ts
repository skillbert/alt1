import * as a1lib from "alt1/base";
import * as OCR from "alt1/ocr";
import { ImgRef } from "alt1/base";

var font = require("../fonts/aa_10px_mono.fontmeta.json");

export type TooltipState = ReturnType<typeof TooltipReader.read>;

export default class TooltipReader {
	static maxw = 400;
	static maxh = 350;
	static offsetx = -10;
	static offsety = -10;

	farTooltip = false;//Tooltips are further away when interacting with inventory items
	lookabove = true;//check for tooltips going up when near the bottom of the screen
	trackinactive = true;//keep tracking when rs isn't active

	tracking = false;

	private trackcallback: ((state: TooltipState | null) => any) | null = null;
	private trackinterval: number | NodeJS.Timer | null = null;

	track(callback: (state: TooltipState) => any, interval = 30) {
		if (!interval) { interval = 30; }
		this.stopTrack();
		this.trackinterval = setInterval(this.trackTick.bind(this), interval);
		this.trackcallback = callback;
		this.tracking = true;
	}
	stopTrack() {
		if (this.trackinterval) { clearInterval(this.trackinterval as any); }
		this.trackinterval = 0;
		this.tracking = false;
	}
	trackTick() {
		if (!this.trackcallback) { return; }
		var dir: 1 | -1 = 1;
		var mousepos = a1lib.getMousePosition();
		if (!this.trackinactive) {
			if (!alt1.rsActive) { return; }
			if (!mousepos) { return; }
		}
		var found = TooltipReader.checkPossible(null, false, this.farTooltip);
		if (this.lookabove && !found && mousepos && mousepos.y > alt1.rsHeight - TooltipReader.maxh) {
			found = TooltipReader.checkPossible(null, true, this.farTooltip);
			dir = -1;
		}
		var r = (found ? TooltipReader.read(dir) : null);
		this.trackcallback(r);
	}


	static drawOverlay(tooltip: TooltipState, ignoregroup?: boolean) {
		if (!ignoregroup) {
			alt1.overLayFreezeGroup("pc_tooltipread");
			alt1.overLaySetGroupZIndex("pc_tooltipread", 1);
			alt1.overLayClearGroup("pc_tooltipread");
			alt1.overLaySetGroup("pc_tooltipread");
		}
		if (tooltip) {
			var col = a1lib.mixColor(0, 0, 0);
			for (var a = -4; a < tooltip.area.height + 4; a += 20) {
				var y1 = tooltip.area.y + a;
				var y2 = Math.min(y1 + 20, tooltip.area.y + tooltip.area.height + 4);
				alt1.overLayRect(col, tooltip.area.x - 4, y1, tooltip.area.width + 8, y2 - y1, 400, Math.ceil((y2 - y1) / 2));
			}
		}
		if (!ignoregroup) {
			alt1.overLayRefreshGroup("pc_tooltipread");
		}
	}

    /**
     * very fast check to see if a tooltip might exist
     * set up to true to check for tooltips above the mouse instead of under
     */
	static checkPossible(buf: ImageData | null, up: boolean, far: boolean) {
		var mousepos = a1lib.getMousePosition();
		if (!mousepos) { return false; }
		if (!buf) { buf = a1lib.capture(mousepos.x, mousepos.y + (up ? -1 : 1) * (far ? 37 : (up ? 32 : 28)), 5, 5); }
		if (!buf) { return false; }
		var data = buf.data;
		var blacks = 0;
		for (var i = 0; i < data.length; i += 4) {
			if (data[i] == 0 && data[i + 1] == 0 && data[i + 2] == 0) { blacks++ }
		}
		return blacks > data.length / 4 / 2;
	}

	static getCaptArea(dir: -1 | 0 | 1, mousepos: a1lib.PointLike) {
		if (!mousepos) {
			var pos = a1lib.getMousePosition();
			if (!pos) { return; }
			mousepos = pos;
		}

		var captarea: a1lib.RectLike = { x: 0, y: 0, width: 0, height: 0 };
		captarea.width = TooltipReader.maxw;
		captarea.x = Math.min(mousepos.x - Math.floor(TooltipReader.maxw / 2), alt1.rsWidth - TooltipReader.maxw);
		if (dir == 0) {
			if (mousepos.y + TooltipReader.offsety + TooltipReader.maxh > alt1.rsHeight) {
				captarea.y = mousepos.y - TooltipReader.offsety - TooltipReader.maxh;
				captarea.height = alt1.rsHeight - captarea.y;
			}
			else {
				captarea.y = mousepos.y + TooltipReader.offsety;
				captarea.height = TooltipReader.maxh;
			}
		}
		else {
			captarea.height = TooltipReader.maxh;
			captarea.y = mousepos.y + (dir == -1 ? -TooltipReader.offsety - TooltipReader.maxh : TooltipReader.offsety);
		}
		if (captarea.x < 0) { captarea.x = 0; }
		if (captarea.y < 0) { captarea.y = 0; }
		//TODO also do this for right and bot
		return captarea;
	}

	static readImage(img: ImgRef, mouseAbs: a1lib.PointLike, dir: -1 | 1) {
		var area = TooltipReader.getCaptArea(dir, mouseAbs);
		if (!area) { return null; }
		//make sure we don't try to capture something that isn't in the img
		//TODO use rect class functionality instead?
		if (area.x < img.x) { area.width -= img.x - area.x; area.x = img.x; }
		if (area.y < img.y) { area.height -= img.y - area.y; area.y = img.y; }
		if (area.width > img.width) { area.width = img.width; }
		if (area.height > img.height) { area.height = img.height; }
		if (area.x + area.width > img.x + img.width) { area.width = img.x + img.width - area.x; }
		if (area.y + area.height > img.y + img.height) { area.height = img.y + img.height - area.y; }

		var buffer = img.toData(area.x, area.y, area.width, area.height);

		var cx = mouseAbs.x - img.x;
		var cy = mouseAbs.y - img.y + 20 * dir;

		var rect: a1lib.RectLike | null = null;
		while (cx >= 0 && cx < buffer.width && cy >= 0 && cy < buffer.height) {
			var i = 4 * cx + 4 * buffer.width * cy;
			if (buffer.data[i] == 0 && buffer.data[i + 1] == 0 && buffer.data[i + 2] == 0) {
				rect = this.attemptFill(buffer, cx, cy, dir);
				if (rect) { break; }
			}
			cy += dir;
		}

		if (!rect) { return null; }

		var uncertainx = rect.x + rect.width + img.x >= alt1.rsWidth - 6 || rect.x + img.x <= 6;
		//alt1.overLayRect(a1lib.mixColor(255,255,255),rect.x+img.x,rect.y+img.y,rect.width,rect.height,200,1);
		var mousepos = {
			x: (uncertainx ? mouseAbs.x : img.x + rect.x + Math.floor(rect.width / 2)),
			y: img.y + rect.y + (dir == 1 ? -26 : +rect.height + 4),
			uncertainx: uncertainx,
		};

		return {
			area: { x: rect.x + img.x, y: rect.y + img.y, width: rect.width, height: rect.height },
			mousepos: mousepos,
			readBankItem: TooltipReader.readBankItem.bind(TooltipReader, img, rect),
			readInteraction: TooltipReader.readInteraction.bind(TooltipReader, img, rect)
		};
	}

	static read(dir?: -1 | 1 | 0) {
		if (!dir) { dir = 1; }//TODO find actual dir
		var mousepos = a1lib.getMousePosition();
		if (!mousepos) { return null; }
		var captarea = TooltipReader.getCaptArea(dir, mousepos);
		if (!captarea) { return null; }
		var img = a1lib.captureHold(captarea.x, captarea.y, captarea.width, captarea.height);
		if (!img) { return null; }
		if (dir) { return TooltipReader.readImage(img, mousepos, dir); }
		else { return TooltipReader.readImage(img, mousepos, 1) || TooltipReader.readImage(img, mousepos, -1); }
	}

	static readBankItem(img: ImgRef, area: a1lib.RectLike) {
		var data = img.toData();
		var line1: ReturnType<typeof OCR.findReadLine> | null = null;
		var line2: ReturnType<typeof OCR.findReadLine> | null = null;
		var name = "";
		for (var a = 0; a < 2; a++) {
			var wiggle = Math.round(Math.random() * 6 - 3);
			line1 = OCR.findReadLine(data, font, [[248, 213, 107], [184, 209, 209]], area.x + Math.floor(area.width / 2) + 20 + 20 * a + wiggle, area.y + 14);
			if (line1 && line1.text) {
				var m = line1.text.match(/\w/g);
				if (m && m.length >= 4) {
					name += line1.text;
					break;
				}
			}
		}
		if (area.height > 30) {
			for (var a = 0; a < 2; a++) {
				var wiggle = Math.round(Math.random() * 6 - 3);
				line2 = OCR.findReadLine(data, font, [[248, 213, 107], [184, 209, 209]], area.x + Math.floor(area.width / 2) - 20 + 20 * a + wiggle, area.y + 14 + 15);
				if (line2 && line2.text) {
					var m = line2.text.match(/[\)\(\w\)]/g);
					if (m && m.length >= 3) {
						name += " " + line2.text;
						break;
					}
				}
			}
		}
		console.log(name);
		return name;
	}

    /**
     * @deprecated Not completed
     * @param area 
     */
	static readInteraction(img: ImgRef, area: a1lib.RectLike) {
		var data = img.toData();
		var colors: OCR.ColortTriplet[] = [
			[235, 224, 188],//~white
			[0, 255, 255],//interactive scenery
			[248, 213, 107],//memb item
			[184, 209, 209],//nonmemb item
			[255, 255, 0],//npc
		];

		//throw "not completely implemented. OCR only supports one colors at a time";
		//TODO only one color allowed atm
		var lines = OCR.findReadLine(data, font, colors, area.x + 12, area.y + 14);
		return lines;
	}

	static searchBuffer(buffer: ImageData, x = 0, y = 0, w = buffer.width, h = buffer.height) {
		var xsteps = Math.ceil(w / 100);
		var data = buffer.data;
		for (var a = 0; a <= xsteps; a++) {
			var cx = x + Math.round((w - 1) / xsteps * a);
			for (var cy = y; cy < y + h; cy++) {
				var i = 4 * cx + 4 * buffer.width * cy;

				if (data[i] == 0 && data[i + 1] == 0 && data[i + 2] == 0) {
					var r = this.attemptFill(buffer, cx, cy, -1);
					if (typeof r == "object") { return r; }
					if (r == "badimg") { return null; }
				}
			}
		}
		return null;
	}

	static attemptFill(buf: ImageData, x: number, y: number, diry: number) {
		var dir = [1, diry];

		//scan in oposite x dir until nonblack pixel is found
		for (var x1 = x; x1 >= 0 && x1 < buf.width; x1 -= dir[0]) {
			var i = 4 * x1 + 4 * buf.width * y;
			if (buf.data[i] == 0 && buf.data[i + 1] == 0 && buf.data[i + 2] == 0) { continue; }
			break;
		}
		x1 += dir[0];
		if (x1 == 0) {
			return null;
		}

		//scan in oposite y dir until nonblack pixel is found
		for (var y1 = y; y1 >= 0 && y1 < buf.height; y1 -= dir[1]) {
			var i = 4 * x + 4 * buf.width * y1;
			if (buf.data[i] == 0 && buf.data[i + 1] == 0 && buf.data[i + 2] == 0) { continue; }
			break;
		}
		y1 += dir[1];
		if (dir[1] == 1 ? y1 == 0 : y1 == buf.height - 1) {
			return null;
		}

		//scan in x dir from known max y to find 2nd x
		for (var x2 = x1; x2 >= 0 && x2 < buf.width; x2 += dir[0]) {
			var i = 4 * x2 + 4 * buf.width * y1;
			if (buf.data[i] == 0 && buf.data[i + 1] == 0 && buf.data[i + 2] == 0) { continue; }
			break;
		}
		x2 -= dir[0];

		//scan in y dir from known max x to find 2nd y
		for (var y2 = y1; y2 >= 0 && y2 < buf.height; y2 += dir[1]) {
			var i = 4 * x1 + 4 * buf.width * y2;
			if (buf.data[i] == 0 && buf.data[i + 1] == 0 && buf.data[i + 2] == 0) { continue; }
			break;
		}
		y2 -= dir[1];

		if (Math.min(x1, x2) == 0 && Math.max(x1, x2) == buf.width) { return null; }
		if (Math.min(y1, y2) == 0 && Math.max(y1, y2) == buf.height) { return null; }
		if (Math.abs(x1 - x2) < 50 || Math.abs(y1 - y2) < 20) { return null; }
		return { x: Math.min(x1, x2), y: Math.min(y1, y2), width: Math.abs(x1 - x2) + 1, height: Math.abs(y1 - y2) + 1 };
	}

}